export type NavItem = {
  label: string;
  href: string;
};

/** Primary navigation shown in the header and mobile menu. */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Packages", href: "/packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/** Footer link columns. */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: [
      { label: "Menu", href: "/menu" },
      { label: "Party Packages", href: "/packages" },
      { label: "Gallery", href: "/gallery" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "How to Order", href: "/#how-it-works" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Order Now", href: "/order" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
