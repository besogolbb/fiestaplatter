import type { OrderInput } from "@/lib/order-schema";
import { getPackage } from "@/data/packages";
import { getMenuItem } from "@/data/menu";
import { formatPrice } from "@/lib/utils";

export interface OrderSummary {
  reference: string;
  packageName: string;
  packagePrice: number | null;
  /** price is the unit price; qty is how many of that item were added. */
  addOns: { name: string; price: number; qty: number }[];
  estimatedTotal: number | null;
  lines: { label: string; value: string }[];
}

/** "Siomai" for qty 1, "Siomai x2" for qty > 1. */
function formatAddOnLabel(addOn: { name: string; qty: number }): string {
  return addOn.qty > 1 ? `${addOn.name} x${addOn.qty}` : addOn.name;
}

/** Generate a short human-friendly order reference. */
export function generateReference(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FP-${y}${m}${d}-${rand}`;
}

/** Build a structured summary from validated order input. */
export function buildOrderSummary(
  order: OrderInput,
  reference = generateReference(),
): OrderSummary {
  const pkg = order.packageSlug === "custom" ? null : getPackage(order.packageSlug);
  const packageName = pkg ? pkg.name : "Custom order";
  const packagePrice = pkg ? pkg.price : null;

  // additionalItems may contain duplicate slugs — occurrence count is the
  // quantity (see setAddOnQty in order-form.tsx) — group them here.
  const addOnCounts = new Map<string, number>();
  for (const slug of order.additionalItems ?? []) {
    addOnCounts.set(slug, (addOnCounts.get(slug) ?? 0) + 1);
  }
  const addOns = Array.from(addOnCounts.entries())
    .map(([slug, qty]) => {
      const item = getMenuItem(slug);
      return item ? { name: item.name, price: item.price, qty } : null;
    })
    .filter((x): x is { name: string; price: number; qty: number } => x !== null);

  const addOnTotal = addOns.reduce((sum, a) => sum + a.price * a.qty, 0);
  const estimatedTotal =
    packagePrice !== null ? packagePrice + addOnTotal : addOnTotal || null;

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

  return { reference, packageName, packagePrice, addOns, estimatedTotal, lines };
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
