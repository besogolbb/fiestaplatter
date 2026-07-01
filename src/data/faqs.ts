import type { FaqItem } from "@/types";
import { siteConfig } from "@/config/site";

export const faqs: FaqItem[] = [
  {
    category: "Ordering",
    question: "How do I place an order?",
    answer:
      "The fastest way is to fill out our Order form — just pick a package or trays, choose your delivery date and time, and submit. We'll confirm the details with you via Messenger or a phone call. You can also message us directly on Facebook Messenger.",
  },
  {
    category: "Reservations",
    question: "How far in advance should I reserve?",
    answer: `We recommend reserving at least ${siteConfig.ordering.minLeadTimeHours} hours before your event to guarantee your preferred delivery schedule. For large parties, fiestas, and holiday dates (like Christmas and New Year), please book 3–5 days ahead as slots fill up quickly.`,
  },
  {
    category: "Delivery",
    question: "Do you deliver, and where?",
    answer: `Yes! We deliver across ${siteConfig.location.serviceArea}. ${siteConfig.ordering.deliveryNote} Delivery fees for areas outside our free zone depend on your location — we'll confirm the exact fee when we process your order.`,
  },
  {
    category: "Delivery",
    question: "Can I choose a specific delivery time?",
    answer:
      "Absolutely. On the Order form you can select your preferred delivery date and time slot. We'll do our best to arrive on schedule so your food is fresh and ready before your guests. We'll message you if any adjustment is needed.",
  },
  {
    category: "Payment",
    question: "What payment methods do you accept?",
    answer: `We accept ${siteConfig.ordering.paymentMethods.join(", ")}. ${siteConfig.ordering.downpaymentNote} The remaining balance can be settled upon delivery.`,
  },
  {
    category: "Payment",
    question: "Is a down payment required to reserve?",
    answer: `Yes. ${siteConfig.ordering.downpaymentNote} This secures your slot and delivery schedule. Once we receive your down payment, your reservation is confirmed.`,
  },
  {
    category: "Servings",
    question: "How many people does one bilao serve?",
    answer:
      "Each bilao is generously portioned. As a guide, one bilao is good for 8–12 pax depending on the item and whether it's a main or a side. Our party packages list the exact serving size — and if you're unsure, message us with your headcount and we'll recommend the right bundle.",
  },
  {
    category: "Ordering",
    question: "Can I customize a package or mix items?",
    answer:
      "Of course! You can add à-la-carte trays to any package, or tell us your budget and headcount and we'll build a custom spread for you. Just add your requests in the 'Special Instructions' field on the Order form.",
  },
  {
    category: "Reservations",
    question: "What is your cancellation policy?",
    answer:
      "Plans change — we get it. You may reschedule or cancel at least 24 hours before your delivery date. Down payments for cancellations made within 24 hours may be non-refundable as ingredients are already prepared. Message us as early as possible and we'll do our best to accommodate.",
  },
  {
    category: "Servings",
    question: "Are your trays freshly prepared?",
    answer:
      "Always. Every tray is cooked fresh on your delivery date using quality ingredients — never pre-frozen or reheated from days before. That's our promise of home-made quality for your celebration.",
  },
];

export const faqCategories = [
  "Ordering",
  "Reservations",
  "Delivery",
  "Payment",
  "Servings",
] as const;
