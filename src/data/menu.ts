import type { MenuItem } from "@/types";

/**
 * Menu — prices, servings and pax from the official Fiesta Platter price list.
 * `image` points to optimized dark studio photos in /public/images/menu.
 * Our hero product is the Signature Chicken Embutido.
 */
export const menu: MenuItem[] = [
  {
    slug: "chicken-embutido",
    name: "Chicken Embutido Bilao",
    shortName: "Homemade & Hearty",
    description:
      "Savory, juicy chicken embutido made with premium ingredients and wrapped with love in every slice. Our signature party centerpiece.",
    price: 499,
    unitPrice: { amount: 160, unit: "per 350g bar" },
    category: "bilao",
    serving: '12" Bilao · 3 × 350g bars · good for 8–10 pax',
    image: "/images/menu/chicken-embutido.webp",
    imageAlt: "Fiesta Platter signature chicken embutido bilao, sliced with sweet chili dip",
    bestSeller: true,
    popular: true,
    tags: ["Signature", "Homemade"],
  },
  {
    slug: "jumbo-siomai",
    name: "Jumbo Siomai",
    shortName: "36 Pieces",
    description:
      "Premium homemade jumbo siomai packed with juicy meat and vegetables. Served with our signature chili-garlic dipping sauce.",
    price: 585,
    unitPrice: { amount: 16, unit: "per piece" },
    category: "appetizer",
    serving: "36 pieces · good for 8–12 pax",
    image: "/images/menu/jumbo-siomai.webp",
    imageAlt: "Fiesta Platter jumbo pork siomai tray with chili-garlic sauce",
    bestSeller: true,
    tags: ["Appetizer", "36 pcs"],
  },
  {
    slug: "pork-bbq",
    name: "Pork BBQ",
    shortName: "Grilled to Perfection",
    description:
      "Juicy, smoky, tender pork barbecue marinated in our special blend and grilled fresh. A crowd favorite for any celebration.",
    price: 759,
    unitPrice: { amount: 38, unit: "per stick" },
    category: "sticks",
    serving: "20 sticks · good for 6–8 pax",
    image: "/images/menu/pork-bbq.webp",
    imageAlt: "Fiesta Platter grilled pork BBQ skewers on banana leaf",
    bestSeller: true,
    tags: ["Char-grilled", "20 sticks"],
  },
  {
    slug: "cheesy-pork-lumpia",
    name: "Cheesy Pork Lumpia",
    shortName: "Lumpiang Shanghai · 50 pcs",
    description:
      "Golden, crispy lumpiang shanghai filled with savory pork and melty cheese. Perfect as an appetizer or party favorite.",
    price: 399,
    unitPrice: { amount: 8, unit: "per piece" },
    category: "appetizer",
    serving: "50 pieces · good for 10–15 pax",
    image: "/images/menu/lumpia.webp",
    imageAlt: "Fiesta Platter cheesy pork lumpiang shanghai with sweet chili dip",
    bestSeller: true,
    popular: true,
    tags: ["Crispy", "50 pcs"],
  },
  {
    slug: "spaghetti",
    name: "Spaghetti",
    shortName: "Filipino-style Sweet Spaghetti",
    description:
      "Crowd-favorite sweet-style Filipino spaghetti loaded with savory meat sauce, hotdog slices and a generous blanket of cheese.",
    price: 459,
    category: "bilao",
    serving: '12" Bilao · good for 5–6 pax',
    image: "/images/menu/spaghetti.webp",
    imageAlt: "Fiesta Platter Filipino-style spaghetti bilao topped with hotdog and cheese",
    popular: true,
    tags: ["Kid-approved"],
  },
  {
    slug: "carbonara",
    name: "Carbonara",
    shortName: "Creamy Pasta Bilao",
    description:
      "Velvety, creamy carbonara with mushrooms and crispy bacon bits, finished with parmesan and cracked black pepper.",
    price: 485,
    category: "bilao",
    serving: '12" Bilao · good for 4–5 pax',
    image: "/images/menu/carbonara.webp",
    imageAlt: "Fiesta Platter creamy carbonara pasta bilao with bacon and parmesan",
    tags: ["Creamy", "Premium"],
  },
  {
    slug: "pansit-bihon",
    name: "Pancit Bihon",
    shortName: "Classic Stir-Fried Noodles",
    description:
      "Thin rice noodles stir-fried with vegetables, tender meat and savory seasoning. A Filipino favorite for every gathering.",
    price: 359,
    category: "bilao",
    serving: '12" Bilao · good for 4–5 pax',
    image: "/images/menu/pansit.webp",
    imageAlt: "Fiesta Platter pancit bihon bilao with vegetables and meat",
    tags: ["Long-life noodles"],
  },
  {
    slug: "puto-pao",
    name: "Puto Pao",
    shortName: "Steamed, Soft & Cheesy",
    description:
      "Soft and fluffy steamed rice cakes with a savory pork-asado filling and cheesy goodness on top. Perfect merienda or snack.",
    price: 395,
    unitPrice: { amount: 8, unit: "per piece" },
    category: "dessert",
    serving: "50 pieces · good for 10–15 pax",
    image: "/images/menu/puto-pao.webp",
    imageAlt: "Fiesta Platter puto pao, steamed rice cakes topped with cheese",
    tags: ["Merienda", "50 pcs"],
  },
  {
    slug: "maja-blanca",
    name: "Maja Blanca",
    shortName: "Creamy Coconut Pudding",
    description:
      "Classic Filipino coconut pudding made with premium ingredients. Creamy, sweet and perfect as a dessert for any celebration.",
    price: 329,
    category: "dessert",
    serving: '12" Bilao · good for 6–8 pax',
    image: "/images/menu/maja-blanca.webp",
    imageAlt: "Fiesta Platter maja blanca coconut pudding topped with corn and cheese",
    tags: ["Dessert", "Coconut"],
  },
  {
    slug: "frozen-siomai-12",
    name: "Packed Frozen Siomai (12 pcs)",
    shortName: "Grab & Steam Pack",
    description:
      "Our signature homemade siomai, individually packed frozen — 12 pieces ready to steam anytime.",
    price: 180,
    cost: 119,
    category: "appetizer",
    serving: "12 pieces, frozen",
    image: "/images/menu/jumbo-siomai.webp",
    imageAlt: "Fiesta Platter packed frozen siomai, 12 pieces",
    tags: ["Frozen Pack", "Add-on"],
    addOnOnly: true,
  },
  {
    slug: "frozen-embutido-1pc",
    name: "Frozen Chicken Embutido (1 pc)",
    shortName: "Single Bar, Frozen",
    description:
      "A single frozen bar of our signature chicken embutido — great as an easy add-on for smaller orders.",
    price: 160,
    cost: 128,
    category: "bilao",
    serving: "1 piece, frozen",
    image: "/images/menu/chicken-embutido.webp",
    imageAlt: "Fiesta Platter frozen chicken embutido, single piece",
    tags: ["Frozen Pack", "Add-on"],
    addOnOnly: true,
  },
  {
    slug: "frozen-puto-pao-8",
    name: "Frozen Puto Pao (8 pcs)",
    shortName: "Steam-Ready Pack",
    description:
      "Soft steamed rice cakes with savory pork-asado filling, frozen in a convenient 8-piece pack.",
    price: 69,
    cost: 43.84,
    category: "dessert",
    serving: "8 pieces, frozen",
    image: "/images/menu/puto-pao.webp",
    imageAlt: "Fiesta Platter frozen puto pao, 8-piece pack",
    tags: ["Frozen Pack", "Add-on"],
    addOnOnly: true,
  },
  {
    slug: "frozen-cheesy-lumpia-16",
    name: "Frozen Cheesy Lumpia (16 pcs)",
    shortName: "Crispy Pack, Frozen",
    description:
      "Cheesy pork lumpiang shanghai, frozen and packed 16 pieces to a pack — fry fresh whenever.",
    price: 128,
    cost: 85.6,
    category: "appetizer",
    serving: "16 pieces, frozen",
    image: "/images/menu/lumpia.webp",
    imageAlt: "Fiesta Platter frozen cheesy lumpia, 16-piece pack",
    tags: ["Frozen Pack", "Add-on"],
    addOnOnly: true,
  },
  {
    slug: "bento-siomai",
    name: "Bento Siomai",
    shortName: "Individual Pack",
    description:
      "Juicy homemade siomai in a convenient single-serving bento pack — perfect for individual meals or small gatherings.",
    price: 80,
    category: "bento",
    serving: "1 pack · good for 1 pax",
    image: "https://photos.fiestaplatter.com/Messenger/BTSiomai.webp",
    imageAlt: "Fiesta Platter bento siomai individual pack",
    tags: ["Individual Pack", "Bento"],
  },
  {
    slug: "bento-embutido",
    name: "Bento Embutido",
    shortName: "Individual Pack",
    description:
      "Our signature chicken embutido served in a convenient single-serving bento pack.",
    price: 80,
    category: "bento",
    serving: "1 pack · good for 1 pax",
    image: "https://photos.fiestaplatter.com/Messenger/BTEmbutido.webp",
    imageAlt: "Fiesta Platter bento embutido individual pack",
    tags: ["Individual Pack", "Bento"],
  },
  {
    slug: "combo-embutido-siomai",
    name: "Combo Embutido & Siomai",
    shortName: "Bento Combo",
    description:
      "Get both favorites in one pack — chicken embutido and siomai together in a single-serving bento combo.",
    price: 120,
    category: "bento",
    serving: "1 pack · good for 1 pax",
    image: "https://photos.fiestaplatter.com/Messenger/CBEmbutidoSiomai.webp",
    imageAlt: "Fiesta Platter combo bento pack with embutido and siomai",
    tags: ["Individual Pack", "Combo", "Bento"],
  },
];

export const bestSellers = menu.filter((m) => m.bestSeller);

/** The hero / signature product featured across the site. */
export const heroProduct = menu.find((m) => m.slug === "chicken-embutido")!;

export function getMenuItem(slug: string): MenuItem | undefined {
  return menu.find((m) => m.slug === slug);
}

export const menuCategories: { id: MenuItem["category"]; label: string }[] = [
  { id: "bilao", label: "Bilao Trays" },
  { id: "appetizer", label: "Appetizers" },
  { id: "sticks", label: "Grilled Sticks" },
  { id: "dessert", label: "Desserts & Kakanin" },
  { id: "bento", label: "Bento & Individual Packs" },
];
