import type { Metadata } from "next";
import { CheckoutForm } from "@/components/order/checkout-form";
import { pageMetadata } from "@/lib/seo";
import { getPackage } from "@/data/packages";
import { getMenuItem } from "@/data/menu";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Checkout — Reserve Your Party Trays",
    description:
      "Review your Fiesta Platter cart, set your delivery date, time and address, and send your order. We confirm on Messenger before any payment.",
    path: "/order",
  }),
  robots: { index: true, follow: true },
};

interface OrderPageProps {
  searchParams: Promise<{ package?: string; item?: string }>;
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const params = await searchParams;

  // Old links (/order?package=… or ?item=…) still work: the item lands in the cart.
  const pkg = params.package ? getPackage(params.package) : undefined;
  const item = !pkg && params.item ? getMenuItem(params.item) : undefined;
  const initialAdd = pkg
    ? ({ kind: "package", slug: pkg.slug } as const)
    : item
      ? ({ kind: "item", slug: item.slug } as const)
      : null;

  return <CheckoutForm initialAdd={initialAdd} />;
}
