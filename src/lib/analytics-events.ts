declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 + Meta Pixel e-commerce funnel events. Every call is a safe no-op if
 * the corresponding script never loaded (no NEXT_PUBLIC_GA_ID / FB_PIXEL_ID
 * configured, ad blocker, etc.) — never throws, never blocks the UI.
 *
 * `eventId` is passed through to Meta so the same id can later be reused for
 * a server-side Conversions API event and Meta will de-duplicate the two.
 */

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

function fbq(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

function toGaItem(i: CartItem) {
  return { item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity ?? 1 };
}

/** Fired each time something is added to the cart (+ button, stepper up, item sheet). */
export function trackAddToCart(item: CartItem) {
  const quantity = item.quantity ?? 1;
  gtag("event", "add_to_cart", {
    currency: "PHP",
    value: item.price * quantity,
    items: [toGaItem({ ...item, quantity })],
  });
  fbq("track", "AddToCart", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    contents: [{ id: item.id, quantity }],
    currency: "PHP",
    value: item.price * quantity,
  });
}

export function trackBeginCheckout(value: number, items: CartItem[]) {
  gtag("event", "begin_checkout", {
    currency: "PHP",
    value,
    items: items.map(toGaItem),
  });
  fbq("track", "InitiateCheckout", {
    content_ids: items.map((i) => i.id),
    contents: items.map((i) => ({ id: i.id, quantity: i.quantity ?? 1 })),
    currency: "PHP",
    value,
    num_items: items.reduce((n, i) => n + (i.quantity ?? 1), 0),
  });
}

export function trackLead(value: number, eventId: string) {
  gtag("event", "generate_lead", { currency: "PHP", value, transaction_id: eventId });
  fbq("track", "Lead", { currency: "PHP", value }, { eventID: eventId });
}
