import type { MenuItem } from "@/types";

/**
 * Menu — prices taken from the official Fiesta Platter price list.
 * `image` points to optimized transparent WebP cutouts in /public/images/menu.
 */
export const menu: MenuItem[] = [
  {
    slug: "spaghetti",
    name: "Spaghetti Bilao",
    shortName: "Filipino-style sweet spaghetti",
    description:
      "Crowd-favorite sweet-style Filipino spaghetti loaded with savory meat sauce, hotdog slices and a generous blanket of cheese.",
    price: 389,
    category: "bilao",
    serving: "Good for 8–10 pax",
    image: "/images/menu/spaghetti.webp",
    imageAlt: "Fiesta Platter Filipino-style spaghetti bilao topped with hotdog and cheese",
    bestSeller: true,
    popular: true,
    tags: ["Party favorite", "Kid-approved"],
  },
  {
    slug: "palabok",
    name: "Palabok Bilao",
    shortName: "Pancit palabok",
    description:
      "Rice noodles in rich shrimp-and-annatto sauce, topped with shrimp, boiled egg, chicharrón, and spring onions.",
    price: 449,
    category: "bilao",
    serving: "Good for 8–10 pax",
    image: "/images/menu/palabok.webp",
    imageAlt: "Fiesta Platter pancit palabok bilao topped with shrimp, egg and chicharrón",
    bestSeller: true,
    tags: ["Fiesta classic"],
  },
  {
    slug: "pansit-bihon",
    name: "Pancit Bihon Bilao",
    shortName: "Stir-fried rice noodles",
    description:
      "Classic stir-fried bihon with tender meat, savory sauce and fresh vegetables — a fiesta table must-have for long life.",
    price: 299,
    category: "bilao",
    serving: "Good for 8–10 pax",
    image: "/images/menu/pansit.webp",
    imageAlt: "Fiesta Platter pancit bihon bilao with vegetables and meat",
    popular: true,
    tags: ["Long-life noodles"],
  },
  {
    slug: "carbonara",
    name: "Carbonara Bilao",
    shortName: "Creamy white sauce pasta",
    description:
      "Velvety, creamy carbonara with mushrooms and crispy bacon bits, finished with parmesan and cracked black pepper.",
    price: 399,
    category: "bilao",
    serving: "Good for 8–10 pax",
    image: "/images/menu/carbonara.webp",
    imageAlt: "Fiesta Platter creamy carbonara bilao with bacon and parmesan",
    bestSeller: true,
    tags: ["Creamy", "Premium"],
  },
  {
    slug: "cheesy-pork-lumpia",
    name: "Cheesy Pork Lumpia Bilao",
    shortName: "50 pieces",
    description:
      "Golden, crispy hand-rolled pork spring rolls with a cheesy center. Served with sweet chili dip — always the first tray to empty.",
    price: 400,
    unitPrice: { amount: 8, unit: "per piece" },
    category: "bilao",
    serving: "50 pieces · good for 10–12 pax",
    image: "/images/menu/lumpia.webp",
    imageAlt: "Fiesta Platter cheesy pork lumpia, crispy spring rolls with dipping sauce",
    bestSeller: true,
    popular: true,
    tags: ["Crispy", "50 pcs"],
  },
  {
    slug: "jumbo-siomai",
    name: "Jumbo Siomai Bilao",
    shortName: "36 pieces",
    description:
      "Extra-large, meaty pork-and-shrimp siomai steamed to perfection, served with our signature chili-garlic sauce.",
    price: 540,
    unitPrice: { amount: 15, unit: "per piece" },
    category: "bilao",
    serving: "36 pieces · good for 10–12 pax",
    image: "/images/menu/jumbo-siomai.webp",
    imageAlt: "Fiesta Platter jumbo pork siomai bilao with chili-garlic sauce",
    popular: true,
    tags: ["Steamed", "36 pcs"],
  },
  {
    slug: "chicken-embutido",
    name: "Embutido Bilao",
    shortName: "3 bars, sliced",
    description:
      "Home-style Filipino meatloaf packed with egg, cheese and vegetables, sliced and ready to serve with sweet sauce.",
    price: 480,
    unitPrice: { amount: 160, unit: "per bar" },
    category: "bilao",
    serving: "3 bars · good for 10–12 pax",
    image: "/images/menu/chicken-embutido.webp",
    imageAlt: "Fiesta Platter embutido bilao, sliced Filipino meatloaf with dip",
    tags: ["Home-made", "3 bars"],
  },
  {
    slug: "pork-bbq",
    name: "Pork BBQ Bilao",
    shortName: "20 sticks",
    description:
      "Sweet-savory grilled pork skewers marinated overnight and char-grilled — smoky, tender and glazed to perfection.",
    price: 760,
    unitPrice: { amount: 38, unit: "per stick" },
    category: "sticks",
    serving: "20 sticks · good for 10–12 pax",
    image: "/images/menu/pork-bbq.webp",
    imageAlt: "Fiesta Platter grilled pork BBQ skewers on banana leaf",
    bestSeller: true,
    tags: ["Char-grilled", "20 sticks"],
  },
  {
    slug: "puto-pao",
    name: "Puto Pao Bilao",
    shortName: "50 pieces",
    description:
      "Soft, fluffy steamed rice cakes with a savory pork-asado filling and a melty cheese top. Perfect merienda or dessert.",
    price: 400,
    unitPrice: { amount: 8, unit: "per piece" },
    category: "dessert",
    serving: "50 pieces · good for 12–15 pax",
    image: "/images/menu/puto-pao.webp",
    imageAlt: "Fiesta Platter puto pao, steamed rice cakes topped with cheese",
    tags: ["Merienda", "50 pcs"],
  },
  {
    slug: "maja-blanca",
    name: "Maja Blanca Bilao",
    shortName: "Coconut pudding",
    description:
      "Creamy coconut-milk pudding topped with sweet corn and cheese — a smooth, comforting Filipino dessert classic.",
    price: 289,
    category: "dessert",
    serving: "Good for 10–12 pax",
    image: "/images/menu/maja-blanca.webp",
    imageAlt: "Fiesta Platter maja blanca coconut pudding topped with corn and cheese",
    tags: ["Dessert", "Coconut"],
  },
];

export const bestSellers = menu.filter((m) => m.bestSeller);

export function getMenuItem(slug: string): MenuItem | undefined {
  return menu.find((m) => m.slug === slug);
}

export const menuCategories: { id: MenuItem["category"]; label: string }[] = [
  { id: "bilao", label: "Bilao Trays" },
  { id: "sticks", label: "Grilled Sticks" },
  { id: "dessert", label: "Desserts & Kakanin" },
];
