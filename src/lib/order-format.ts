import type { OrderInput } from "@/lib/order-schema";
import { getPackage } from "@/data/packages";
import { getMenuItem } from "@/data/menu";
import { formatPrice } from "@/lib/utils";

export interface OrderSummary {
  reference: string;
  packageName: string;
  packagePrice: number | null;
  addOns: { name: string; price: number }[];
  estimatedTotal: number | null;
  lines: { label: string; value: string }[];
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

  const addOns = (order.additionalItems ?? [])
    .map((slug) => {
      const item = getMenuItem(slug);
      return item ? { name: item.name, price: item.price } : null;
    })
    .filter((x): x is { name: string; price: number } => x !== null);

  const addOnTotal = addOns.reduce((sum, a) => sum + a.price, 0);
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
      ? [{ label: "Add-ons", value: addOns.map((a) => a.name).join(", ") }]
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
