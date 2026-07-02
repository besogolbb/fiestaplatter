"use server";

import { Resend } from "resend";
import { orderSchema, type OrderInput } from "@/lib/order-schema";
import {
  buildOrderSummary,
  orderToEmailText,
  type OrderSummary,
} from "@/lib/order-format";
import { siteConfig } from "@/config/site";
import { sendMetaCapiLead } from "@/lib/meta-capi";

export interface OrderActionState {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field-level validation errors keyed by field name. */
  errors?: Record<string, string[]>;
  summary?: OrderSummary;
}

/**
 * Server Action: validate the order, email the business (via Resend when
 * configured), and return a structured summary for the success screen +
 * Messenger confirmation. Never throws to the client — always returns state.
 */
export async function submitOrder(
  _prev: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    facebook: formData.get("facebook") ?? "",
    email: formData.get("email") ?? "",
    deliveryDate: formData.get("deliveryDate"),
    deliveryTime: formData.get("deliveryTime"),
    address: formData.get("address"),
    eventType: formData.get("eventType"),
    guests: formData.get("guests"),
    packageSlug: formData.get("packageSlug"),
    additionalItems: formData.getAll("additionalItems").map(String),
    specialInstructions: formData.get("specialInstructions") ?? "",
    paymentMethod: formData.get("paymentMethod"),
    company: formData.get("company") ?? "", // honeypot
  };

  const parsed = orderSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Silently accept honeypot hits without notifying the business.
  if (parsed.data.company) {
    return { status: "success", summary: buildOrderSummary(parsed.data) };
  }

  const order: OrderInput = parsed.data;
  const summary = buildOrderSummary(order);

  // Send the notification email when Resend is configured. Failure to email
  // must NOT block the customer — they still get the Messenger confirmation.
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: process.env.ORDER_FROM_EMAIL ?? `Fiesta Platter <orders@${new URL(siteConfig.url).hostname}>`,
        to: process.env.ORDER_NOTIFICATION_EMAIL ?? siteConfig.contact.email,
        replyTo: order.email || undefined,
        subject: `New Order ${summary.reference} — ${order.name} (${order.eventType})`,
        text: orderToEmailText(summary),
      });
    } catch (err) {
      // Log server-side; degrade gracefully for the customer.
      console.error("[submitOrder] email send failed:", err);
    }
  }

  // Server-side Lead event for Meta CAPI, deduped against the client Pixel
  // event by reference. No-ops until credentials are set. Awaited (not
  // fire-and-forget) so it isn't cut short on serverless runtimes.
  await sendMetaCapiLead({
    eventId: summary.reference,
    value: summary.estimatedTotal ?? 0,
  });

  return {
    status: "success",
    message: "Order received! Please confirm on Messenger to lock in your slot.",
    summary,
  };
}
