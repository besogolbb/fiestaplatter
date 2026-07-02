import type { OrderInput } from "@/lib/order-schema";
import type { OrderSummary } from "@/lib/order-format";

export interface OrderRecord {
  submittedAt: string;
  reference: string;
  name: string;
  phone: string;
  email: string;
  facebook: string;
  eventType: string;
  guests: string;
  deliveryDate: string;
  deliveryTime: string;
  address: string;
  packageName: string;
  addOns: string;
  paymentMethod: string;
  specialInstructions: string;
  estimatedTotal: string;
}

/**
 * Appends a submitted order as a row in a Google Sheet via an Apps Script
 * web app webhook (see docs/08-Google-Sheets-Setup.md for the one-time
 * setup). No-ops until GOOGLE_SHEETS_WEBHOOK_URL is configured — safe to
 * call unconditionally from the order action.
 */
export async function appendOrderToGoogleSheet(order: OrderInput, summary: OrderSummary) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET ?? "",
        reference: summary.reference,
        name: order.name,
        phone: order.phone,
        email: order.email ?? "",
        facebook: order.facebook ?? "",
        eventType: order.eventType,
        guests: order.guests,
        deliveryDate: order.deliveryDate,
        deliveryTime: order.deliveryTime,
        address: order.address,
        packageName: summary.packageName,
        addOns: summary.addOns.map((a) => a.name).join(", "),
        paymentMethod: order.paymentMethod,
        specialInstructions: order.specialInstructions ?? "",
        estimatedTotal: summary.estimatedTotal ?? "",
      }),
    });
  } catch (err) {
    // Log server-side; never block the customer's order over a sheet write.
    console.error("[appendOrderToGoogleSheet] failed:", err);
  }
}

/**
 * Reads all order rows back from the same Apps Script webhook (its doGet
 * handler) for the admin dashboard. Returns an empty array if unconfigured
 * or unreachable — the dashboard renders an empty state rather than crash.
 */
export async function fetchOrdersFromGoogleSheet(): Promise<OrderRecord[]> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET ?? "";
  if (!webhookUrl) return [];

  try {
    const url = `${webhookUrl}?secret=${encodeURIComponent(secret)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error("[fetchOrdersFromGoogleSheet] non-OK response:", res.status);
      return [];
    }
    const data = (await res.json()) as { ok: boolean; rows?: OrderRecord[]; error?: string };
    if (!data.ok || !data.rows) {
      console.error("[fetchOrdersFromGoogleSheet] webhook error:", data.error);
      return [];
    }
    return data.rows;
  } catch (err) {
    console.error("[fetchOrdersFromGoogleSheet] failed:", err);
    return [];
  }
}
