import type { Benefit, HowItWorksStep, GalleryImage } from "@/types";

/** "Why Choose Fiesta Platter" — Step 3 of the funnel. */
export const benefits: Benefit[] = [
  {
    icon: "Sparkles",
    title: "Freshly Prepared",
    description:
      "Every tray is cooked fresh on your delivery date — never pre-frozen. Quality ingredients your family can taste.",
  },
  {
    icon: "ChefHat",
    title: "Home-Made Quality",
    description:
      "Recipes perfected over the years, cooked the way lola makes them. Authentic Filipino flavors, every single time.",
  },
  {
    icon: "UtensilsCrossed",
    title: "Generous Servings",
    description:
      "Big bilao, bigger servings. Our trays are portioned to fill the table and satisfy every guest — sulit sa presyo.",
  },
  {
    icon: "Clock",
    title: "On-Time Delivery",
    description:
      "We arrive on your chosen schedule so your food is ready before your guests are. Reliable, every celebration.",
  },
  {
    icon: "PiggyBank",
    title: "Affordable Pricing",
    description:
      "Premium party food that fits your budget. Transparent prices and bundle savings with no hidden fees.",
  },
  {
    icon: "HeartHandshake",
    title: "Trusted by Families",
    description:
      "Thousands of birthdays, fiestas and office events served. Real families keep coming back — and so will you.",
  },
];

/** "How Ordering Works" — Step 4 of the funnel. */
export const howItWorks: HowItWorksStep[] = [
  {
    step: 1,
    title: "Choose Your Package",
    description:
      "Browse our menu and party packages. Pick the trays or bundle that fits your headcount and budget.",
  },
  {
    step: 2,
    title: "Send Your Inquiry",
    description:
      "Fill out the quick order form or message us on Messenger with your date, time and delivery address.",
  },
  {
    step: 3,
    title: "Confirm the Details",
    description:
      "We'll reach out to confirm your order, delivery schedule and total. Settle the down payment to reserve.",
  },
  {
    step: 4,
    title: "Get Your Confirmation",
    description:
      "Receive your official order confirmation with all the details locked in. Your slot is secured.",
  },
  {
    step: 5,
    title: "Enjoy Your Event",
    description:
      "We deliver fresh, on-time and ready to serve. Sit back, celebrate, and let the food impress your guests.",
  },
];

/** Curated gallery — one to three shots per dish, cross-category tagged. */
export const gallery: GalleryImage[] = [
  { src: "/images/gallery/spaghetti-1.webp", alt: "Filipino-style spaghetti party tray", category: "Food" },
  { src: "/images/gallery/palabok-1.webp", alt: "Pancit palabok with shrimp and egg", category: "Food" },
  { src: "/images/gallery/carbonara-3.webp", alt: "Creamy carbonara bilao", category: "Food" },
  { src: "/images/gallery/lumpia-2.webp", alt: "Crispy cheesy pork lumpia", category: "Food" },
  { src: "/images/gallery/pork-bbq-1.webp", alt: "Grilled pork BBQ skewers", category: "Food" },
  { src: "/images/gallery/jumbo-siomai-2.webp", alt: "Jumbo pork siomai tray", category: "Food" },
  { src: "/images/gallery/pansit-3.webp", alt: "Pancit bihon guisado", category: "Food" },
  { src: "/images/gallery/chicken-embutido-5.webp", alt: "Sliced embutido meatloaf", category: "Food" },
  { src: "/images/gallery/puto-pao-1.webp", alt: "Puto pao with cheese topping", category: "Food" },
  { src: "/images/gallery/maja-blanca-2.webp", alt: "Maja blanca coconut dessert", category: "Food" },
  { src: "/images/gallery/spaghetti-3.webp", alt: "Spaghetti bilao ready for a party", category: "Packaging" },
  { src: "/images/gallery/lumpia-4.webp", alt: "Lumpia tray with dipping sauce", category: "Packaging" },
  { src: "/images/gallery/jumbo-siomai-1.webp", alt: "Siomai tray with chili-garlic sauce", category: "Packaging" },
  { src: "/images/gallery/pork-bbq-3.webp", alt: "BBQ skewers arranged on banana leaf", category: "Packaging" },
  { src: "/images/gallery/palabok-2.webp", alt: "Palabok garnished and ready to serve", category: "Events" },
  { src: "/images/gallery/carbonara-1.webp", alt: "Carbonara served at an event", category: "Events" },
  { src: "/images/gallery/chicken-embutido-2.webp", alt: "Embutido platter at a celebration", category: "Events" },
  { src: "/images/gallery/puto-pao-3.webp", alt: "Puto pao merienda spread", category: "Events" },
];

export const galleryCategories = ["Food", "Packaging", "Events"] as const;
