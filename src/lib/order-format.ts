import type { OrderInput } from "@/lib/order-schema";
import { getMenuItem } from "@/data/menu";
import { priceCart } from "@/lib/cart/pricing";
import { formatPrice } from "@/lib/utils";

export interface OrderSummary {
  reference: string;
  packageName: string;
  packagePrice: number | null;
  /** price is the unit price; qty is how many of that item were added. */
  addOns: { name: string; price: number; qty: number }[];
  estimatedTotal: number | null;
  /** Net profit from add-ons with known cost data. Packages/bundles have no cost breakdown, so this is partial, not the full order margin. */
  estimatedProfit: number;
  lines: { label: string; value: string }[];
}

/** "Siomai" for qty 1, "Siomai x2" for qty > 1. */
function formatAddOnLabel(addOn: { name: string; qty: number }): string {
  return addOn.qty > 1 ? `${addOn.name} x${addOn.qty}` : addOn.name;
}

/**
 * Generate a short human-friendly order ID. "FP-" identifies a website
 * order; the Messenger AI agent generates its own "MS-" prefixed ID in the
 * same shape (see docs/14-n8n-strip-order-confirmed.js) so every order's
 * source channel is identifiable at a glance in the Orders sheet.
 */
export function generateReference(): string {
  // Crypto-random, always 4 characters, no look-alikes (0/O, 1/I/L) so
  // customers can read it back over the phone. Kept at 4 to match the
  // Messenger agent's "MS-XXXX" shape.
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const rand = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `FP-${rand}`;
}

/** Build a structured summary from validated order input. */
export function buildOrderSummary(
  order: OrderInput,
  reference = generateReference(),
): OrderSummary {
  // Re-price from the catalog — client-sent prices are never trusted.
  const { lines: priced, subtotal } = priceCart(order.cart);

  // The Orders sheet, /admin and the Messenger agent all read one "Package"
  // column plus an "Add-ons" column. A cart can hold several bundles, so
  // bundles collapse into the Package column ("Fiesta Family x2, …") and
  // menu items stay in Add-ons — the row shape is unchanged.
  const bundleLines = priced.filter((l) => l.kind === "package");
  const itemLines = priced.filter((l) => l.kind === "item");

  const packageName = bundleLines.length
    ? bundleLines.map((l) => formatAddOnLabel({ name: l.entry.name, qty: l.qty })).join(", ")
    : "Custom order";
  const packagePrice = bundleLines.length
    ? bundleLines.reduce((sum, l) => sum + l.lineTotal, 0)
    : null;

  const addOns = itemLines.map((l) => ({ name: l.entry.name, price: l.entry.price, qty: l.qty }));
  const estimatedTotal = subtotal > 0 ? subtotal : null;
  const estimatedProfit = itemLines.reduce((sum, l) => {
    const cost = getMenuItem(l.slug)?.cost;
    return sum + (cost != null ? (l.entry.price - cost) * l.qty : 0);
  }, 0);

  const lines: { label: string; value: string }[] = [
    { label: "Name", value: order.name },
    { label: "Phone", value: order.phone },
    ...(order.email ? [{ label: "Email", value: order.email }] : []),
    ...(order.facebook ? [{ label: "Facebook", value: order.facebook }] : []),
    { label: "Event", value: order.eventType },
    { label: "Guests", value: `${order.guests} pax` },
    { label: "Delivery Date", value: order.deliveryDate },
    { label: "Delivery Time", value: order.deliveryTime },
    { label: "Address", value: order.address },
    { label: "Package", value: packageName },
    ...(addOns.length
      ? [{ label: "Add-ons", value: addOns.map(formatAddOnLabel).join(", ") }]
      : []),
    { label: "Payment", value: order.paymentMethod },
    ...(order.specialInstructions
      ? [{ label: "Notes", value: order.specialInstructions }]
      : []),
  ];

  return { reference, packageName, packagePrice, addOns, estimatedTotal, estimatedProfit, lines };
}

/** Build a prefilled Messenger message a customer can send to confirm. */
export function orderToMessengerText(summary: OrderSummary): string {
  const parts = [
    `Hi Fiesta Platter! I'd like to confirm my order.`,
    `Ref: ${summary.reference}`,
    "",
    ...summary.lines.map((l) => `${l.label}: ${l.value}`),
  ];
  if (summary.estimatedTotal !== null) {
    parts.push("", `Estimated total: ${formatPrice(summary.estimatedTotal)}`);
  }
  return parts.join("\n");
}

/** Plain-text body for the order-notification email. */
export function orderToEmailText(summary: OrderSummary): string {
  const parts = [
    `NEW ORDER — ${summary.reference}`,
    "".padEnd(40, "="),
    ...summary.lines.map((l) => `${l.label.padEnd(16)}: ${l.value}`),
  ];
  if (summary.estimatedTotal !== null) {
    parts.push("".padEnd(40, "-"), `Estimated total : ${formatPrice(summary.estimatedTotal)}`);
  }
  return parts.join("\n");
}
