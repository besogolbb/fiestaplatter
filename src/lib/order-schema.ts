import { z } from "zod";
import { menu } from "@/data/menu";
import { getCatalogEntry } from "@/lib/cart/catalog";
import { MAX_CART_LINES, MAX_LINE_QTY } from "@/lib/cart/pricing";
import { isValidDeliveryDate } from "@/lib/dates";
import { siteConfig } from "@/config/site";

export const eventTypes = [
  "Birthday",
  "Family Gathering",
  "Office / Corporate Event",
  "Fiesta",
  "House Blessing",
  "Christmas Party",
  "Graduation",
  "Baptism / Christening",
  "Wedding",
  "Baby Shower",
  "Community Event",
  "Other",
] as const;

export const paymentMethods = [
  "GCash",
  "Maya",
  "Bank Transfer",
  "Cash on Delivery",
] as const;

/** Order lifecycle — see docs/10-AI-Sales-Agent-System-Prompt.md Section 4g. */
export const orderStatuses = [
  "Created",
  "Payment Submitted",
  "Confirmed",
  "Ongoing",
  "Delivered",
  "Cancelled",
] as const;

const phoneRegex = /^(\+?63|0)9\d{9}$/;

export const cartLineSchema = z
  .object({
    kind: z.enum(["package", "item"]),
    slug: z.string().min(1).max(80),
    qty: z.coerce.number().int().min(1).max(MAX_LINE_QTY),
  })
  .refine((line) => Boolean(getCatalogEntry(line.kind, line.slug)), {
    message: "One of the items in your cart is no longer on the menu.",
  });

export const orderSchema = z.object({
  // Contact
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name is too long."),
  // People type numbers the way they say them ("0917 123 4567", "+63 917-123-4567");
  // strip the separators before validating so the example format is accepted.
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s\-().]/g, ""))
    .pipe(z.string().regex(phoneRegex, "Enter a valid PH mobile number, e.g. 0917 123 4567.")),
  facebook: z.string().trim().max(200).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),

  // Delivery
  deliveryDate: z
    .string()
    .min(1, "Please choose a delivery date.")
    .refine(
      (val) => isValidDeliveryDate(val),
      `Please pick a date at least ${siteConfig.ordering.minLeadTimeHours} hours from now.`,
    ),
  deliveryTime: z
    .string()
    .trim()
    .min(1, "Please tell us what time you need the food.")
    .max(60, "Keep the delivery time short, e.g. 11:00 AM."),
  address: z
    .string()
    .trim()
    .min(8, "Please enter a complete delivery address.")
    .max(300, "Address is too long."),

  // Event
  eventType: z.enum(eventTypes, {
    errorMap: () => ({ message: "Please select an event type." }),
  }),
  guests: z.coerce
    .number({ invalid_type_error: "Enter the estimated number of guests." })
    .int()
    .min(1, "Enter at least 1 guest.")
    .max(1000, "For 1000+ guests, please contact us directly."),

  // Order
  cart: z
    .array(cartLineSchema)
    .min(1, "Your cart is empty. Add at least one tray or bundle.")
    .max(MAX_CART_LINES, "That's a lot of lines! Please message us for very large orders."),
  specialInstructions: z.string().trim().max(600).optional().or(z.literal("")),
  paymentMethod: z.enum(paymentMethods, {
    errorMap: () => ({ message: "Please choose a preferred payment method." }),
  }),

  // Anti-spam honeypot — must stay empty.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type OrderInput = z.infer<typeof orderSchema>;

export const additionalItemOptions = menu.map((m) => ({
  value: m.slug,
  label: `${m.name} — ₱${m.price}`,
}));
