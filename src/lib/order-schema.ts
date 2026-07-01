import { z } from "zod";
import { packages } from "@/data/packages";
import { menu } from "@/data/menu";

const packageSlugs = packages.map((p) => p.slug) as [string, ...string[]];

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

const phoneRegex = /^(\+?63|0)9\d{9}$/;

export const orderSchema = z.object({
  // Contact
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name is too long."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid PH mobile number, e.g. 0917 123 4567."),
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
    .refine((val) => {
      const d = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !Number.isNaN(d.getTime()) && d >= today;
    }, "Delivery date cannot be in the past."),
  deliveryTime: z.string().min(1, "Please choose a delivery time."),
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
  packageSlug: z.enum([...packageSlugs, "custom"] as [string, ...string[]], {
    errorMap: () => ({ message: "Please choose a package." }),
  }),
  additionalItems: z.array(z.string()).optional().default([]),
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
