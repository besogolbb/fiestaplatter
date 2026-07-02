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

export function trackSelectBundle(item: CartItem) {
  gtag("event", "add_to_cart", {
    currency: "PHP",
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: 1 }],
  });
  fbq("track", "AddToCart", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    currency: "PHP",
    value: item.price,
  });
}

export function trackBeginCheckout(value: number, items: CartItem[]) {
  gtag("event", "begin_checkout", {
    currency: "PHP",
    value,
    items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: 1 })),
  });
  fbq("track", "InitiateCheckout", {
    content_ids: items.map((i) => i.id),
    currency: "PHP",
    value,
    num_items: items.length,
  });
}

export function trackLead(value: number, eventId: string) {
  gtag("event", "generate_lead", { currency: "PHP", value, transaction_id: eventId });
  fbq("track", "Lead", { currency: "PHP", value }, { eventID: eventId });
}
