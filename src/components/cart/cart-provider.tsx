"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { CartLineKind } from "@/lib/cart/catalog";
import { getCatalogEntry } from "@/lib/cart/catalog";
import {
  MAX_CART_LINES,
  MAX_LINE_QTY,
  priceCart,
  type CartLine,
  type CartTotals,
} from "@/lib/cart/pricing";
import { trackAddToCart } from "@/lib/analytics-events";

const STORAGE_KEY = "fp-cart-v1";

interface CartState {
  lines: CartLine[];
  /** YYYY-MM-DD chosen on the store page; prefills checkout. */
  deliveryDate: string;
}

type CartAction =
  | { type: "hydrate"; state: CartState }
  | { type: "setQty"; kind: CartLineKind; slug: string; qty: number }
  | { type: "setDeliveryDate"; date: string }
  | { type: "clear" };

const emptyState: CartState = { lines: [], deliveryDate: "" };

function clampQty(qty: number): number {
  return Math.max(0, Math.min(MAX_LINE_QTY, Math.trunc(qty)));
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "setQty": {
      const qty = clampQty(action.qty);
      const idx = state.lines.findIndex((l) => l.kind === action.kind && l.slug === action.slug);
      if (idx === -1) {
        if (qty === 0 || state.lines.length >= MAX_CART_LINES) return state;
        return { ...state, lines: [...state.lines, { kind: action.kind, slug: action.slug, qty }] };
      }
      const lines =
        qty === 0
          ? state.lines.filter((_, i) => i !== idx)
          : state.lines.map((l, i) => (i === idx ? { ...l, qty } : l));
      return { ...state, lines };
    }
    case "setDeliveryDate":
      return { ...state, deliveryDate: action.date };
    case "clear":
      return { ...state, lines: [] };
  }
}

/** Parse whatever is in storage into a safe state — unknown or stale items are dropped. */
function readStored(raw: string | null): CartState {
  if (!raw) return emptyState;
  try {
    const data = JSON.parse(raw) as Partial<CartState>;
    const lines = Array.isArray(data.lines)
      ? priceCart(data.lines as CartLine[]).lines.map(({ kind, slug, qty }) => ({ kind, slug, qty }))
      : [];
    const deliveryDate =
      typeof data.deliveryDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data.deliveryDate)
        ? data.deliveryDate
        : "";
    return { lines, deliveryDate };
  } catch {
    return emptyState;
  }
}

interface CartContextValue extends CartTotals {
  /** False until the stored cart has been read — avoids flashing an empty cart. */
  hydrated: boolean;
  deliveryDate: string;
  qtyOf: (kind: CartLineKind, slug: string) => number;
  add: (kind: CartLineKind, slug: string, qty?: number) => void;
  setQty: (kind: CartLineKind, slug: string, qty: number) => void;
  remove: (kind: CartLineKind, slug: string) => void;
  clear: () => void;
  setDeliveryDate: (date: string) => void;
  /** Wire-format lines for the server action. */
  rawLines: CartLine[];
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  /** Last change, for the polite live region. */
  announcement: string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const skipNextWrite = useRef(false);

  // Read once on mount, then follow other tabs.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    dispatch({ type: "hydrate", state: readStored(stored) });
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      skipNextWrite.current = true;
      dispatch({ type: "hydrate", state: readStored(e.newValue) });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Private mode / storage full — the cart still works for this visit.
    }
  }, [state, hydrated]);

  const totals = useMemo(() => priceCart(state.lines), [state.lines]);

  const qtyOf = useCallback(
    (kind: CartLineKind, slug: string) =>
      state.lines.find((l) => l.kind === kind && l.slug === slug)?.qty ?? 0,
    [state.lines],
  );

  const setQty = useCallback(
    (kind: CartLineKind, slug: string, qty: number) => {
      const entry = getCatalogEntry(kind, slug);
      if (!entry) return;
      const prev = state.lines.find((l) => l.kind === kind && l.slug === slug)?.qty ?? 0;
      const next = clampQty(qty);
      if (next === prev) return;
      dispatch({ type: "setQty", kind, slug, qty: next });
      if (next > prev) {
        trackAddToCart({ id: slug, name: entry.name, price: entry.price, quantity: next - prev });
        setAnnouncement(`Added ${entry.name}. ${next} in cart.`);
      } else {
        setAnnouncement(next === 0 ? `Removed ${entry.name}.` : `${entry.name}: ${next} in cart.`);
      }
    },
    [state.lines],
  );

  const add = useCallback(
    (kind: CartLineKind, slug: string, qty = 1) => setQty(kind, slug, qtyOf(kind, slug) + qty),
    [qtyOf, setQty],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ...totals,
      hydrated,
      deliveryDate: state.deliveryDate,
      qtyOf,
      add,
      setQty,
      remove: (kind, slug) => setQty(kind, slug, 0),
      clear: () => dispatch({ type: "clear" }),
      setDeliveryDate: (date) => dispatch({ type: "setDeliveryDate", date }),
      rawLines: totals.lines.map(({ kind, slug, qty }) => ({ kind, slug, qty })),
      sheetOpen,
      openSheet: () => setSheetOpen(true),
      closeSheet: () => setSheetOpen(false),
      announcement,
    }),
    [totals, hydrated, state.deliveryDate, qtyOf, add, setQty, sheetOpen, announcement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>.");
  return ctx;
}
