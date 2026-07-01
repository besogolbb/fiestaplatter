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

/** Gallery — our signature studio shots of every tray. */
export const gallery: GalleryImage[] = [
  { src: "/images/menu/chicken-embutido.webp", alt: "Signature chicken embutido bilao, sliced with sweet chili dip", category: "Food" },
  { src: "/images/menu/jumbo-siomai.webp", alt: "Jumbo pork siomai tray with chili-garlic sauce", category: "Food" },
  { src: "/images/menu/pork-bbq.webp", alt: "Grilled pork BBQ skewers on banana leaf", category: "Packaging" },
  { src: "/images/menu/lumpia.webp", alt: "Crispy cheesy pork lumpiang shanghai with dip", category: "Packaging" },
  { src: "/images/menu/spaghetti.webp", alt: "Filipino-style spaghetti bilao topped with hotdog and cheese", category: "Food" },
  { src: "/images/menu/carbonara.webp", alt: "Creamy carbonara pasta bilao with bacon and parmesan", category: "Food" },
  { src: "/images/menu/pansit.webp", alt: "Pancit bihon bilao with vegetables and meat", category: "Food" },
  { src: "/images/menu/puto-pao.webp", alt: "Puto pao, steamed rice cakes topped with cheese", category: "Food" },
  { src: "/images/menu/maja-blanca.webp", alt: "Maja blanca coconut pudding topped with corn and cheese", category: "Food" },
];

export const galleryCategories = ["Food", "Packaging"] as const;
