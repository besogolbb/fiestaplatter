"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Pencil, ShieldCheck } from "lucide-react";
import { orderSchema, eventTypes, paymentMethods, type OrderInput } from "@/lib/order-schema";
import { submitOrder, type OrderActionState } from "@/app/(order)/order/actions";
import type { CartLineKind } from "@/lib/cart/catalog";
import { getCatalogEntry } from "@/lib/cart/catalog";
import { earliestDeliveryDate, isValidDeliveryDate } from "@/lib/dates";
import { messengerLink, siteConfig } from "@/config/site";
import type { OrderSummary } from "@/lib/order-format";
import { useCart } from "@/components/cart/cart-provider";
import { FreeDeliveryMeter } from "@/components/cart/cart-sheet";
import { FlagString } from "@/components/cart/flag-string";
import { Pennant } from "@/components/cart/pennant";
import { Field } from "@/components/order/field";
import { OrderSuccess } from "@/components/order/order-success";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackBeginCheckout, trackLead } from "@/lib/analytics-events";
import { cn, formatPrice } from "@/lib/utils";

/** Client-side form shape: everything except the cart, which lives in the cart provider. */
const detailsSchema = orderSchema.omit({ cart: true });
type DetailsInput = Omit<OrderInput, "cart">;

const timeSuggestions = [
  "8:00 AM",
  "10:00 AM",
  "11:30 AM (before lunch)",
  "1:00 PM",
  "3:00 PM (merienda)",
  "5:00 PM",
  "6:30 PM (dinner)",
];

const SUBMIT_FORM_ID = "checkout-form";

/** The last placed order, kept for this tab so a refresh doesn't lose the reference and Messenger step. */
const LAST_ORDER_KEY = "fp-last-order";

function readLastOrder(): OrderSummary | null {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OrderSummary;
    return typeof parsed?.reference === "string" && Array.isArray(parsed.lines) ? parsed : null;
  } catch {
    return null;
  }
}

interface CheckoutFormProps {
  /** Legacy deep link (/order?package= or ?item=) — added to the cart once, then the URL is cleaned. */
  initialAdd?: { kind: CartLineKind; slug: string } | null;
}

function OrderLines({ compact = false }: { compact?: boolean }) {
  const { lines } = useCart();
  return (
    <ul className="divide-y divide-border">
      {lines.map((l) => (
        <li key={`${l.kind}:${l.slug}`} className="flex items-center gap-3 py-2.5">
          {compact ? null : (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image src={l.entry.image} alt="" fill sizes="48px" className="object-cover" />
            </div>
          )}
          <p className="min-w-0 flex-1 text-sm">
            <span className="tabular font-bold">{l.qty}×</span> {l.entry.name}
          </p>
          <span className="tabular text-sm font-bold">{formatPrice(l.lineTotal)}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ n, children }: { n: number; children: React.ReactNode }) {
  const colors = ["magenta", "yellow", "green", "blue"] as const;
  return (
    <legend className="mb-3 flex items-center gap-2 font-display text-xl font-extrabold">
      <Pennant color={colors[(n - 1) % colors.length]} className="h-6 w-[18px]" />
      {children}
    </legend>
  );
}

export function CheckoutForm({ initialAdd }: CheckoutFormProps) {
  const router = useRouter();
  const cart = useCart();
  const { hydrated, itemCount, subtotal, lines, rawLines, deliveryDate, setDeliveryDate, openSheet } = cart;
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<OrderActionState | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [minDate, setMinDate] = useState("");
  const [lastOrder, setLastOrder] = useState<OrderSummary | null>(null);
  useEffect(() => {
    setLastOrder(readLastOrder());
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<DetailsInput>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      name: "",
      phone: "",
      facebook: "",
      email: "",
      deliveryDate: "",
      deliveryTime: "",
      address: "",
      guests: undefined as unknown as number,
      specialInstructions: "",
      company: "",
    },
    mode: "onTouched",
  });

  // Manila "today" is only known on the client; also pull the date chosen on the store page.
  useEffect(() => {
    setMinDate(earliestDeliveryDate());
  }, []);
  const prefilled = useRef(false);
  useEffect(() => {
    if (!hydrated || prefilled.current) return;
    prefilled.current = true;
    if (deliveryDate && isValidDeliveryDate(deliveryDate)) {
      setValue("deliveryDate", deliveryDate);
    }
  }, [hydrated, deliveryDate, setValue]);

  // Legacy deep links from old posts and bookmarks.
  const handledInitial = useRef(false);
  useEffect(() => {
    if (!hydrated || handledInitial.current || !initialAdd) return;
    handledInitial.current = true;
    if (getCatalogEntry(initialAdd.kind, initialAdd.slug) && cart.qtyOf(initialAdd.kind, initialAdd.slug) === 0) {
      cart.add(initialAdd.kind, initialAdd.slug);
    }
    router.replace("/order", { scroll: false });
  }, [hydrated, initialAdd, cart, router]);

  const firedCheckout = useRef(false);
  useEffect(() => {
    if (!hydrated || firedCheckout.current || itemCount === 0) return;
    firedCheckout.current = true;
    trackBeginCheckout(
      subtotal,
      lines.map((l) => ({ id: l.slug, name: l.entry.name, price: l.entry.price, quantity: l.qty })),
    );
  }, [hydrated, itemCount, subtotal, lines]);

  const firedLead = useRef(false);
  useEffect(() => {
    if (result?.status === "success" && result.summary && !firedLead.current) {
      firedLead.current = true;
      trackLead(result.summary.estimatedTotal ?? 0, result.summary.reference);
    }
  }, [result]);

  const selectedPayment = watch("paymentMethod");

  const onSubmit = (data: DetailsInput) => {
    if (rawLines.length === 0) {
      setCartError("Your cart is empty. Add at least one tray or bundle.");
      return;
    }
    setCartError(null);
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) fd.append(key, String(value));
    });
    fd.append("cart", JSON.stringify(rawLines));

    startTransition(async () => {
      let state: OrderActionState;
      try {
        state = await submitOrder({ status: "idle" }, fd);
      } catch (err) {
        // Network drop, or a deploy landed mid-checkout (the old page's
        // action ID no longer exists). Nothing was recorded — say so and
        // give the Messenger fallback instead of failing silently.
        console.error("[checkout] submit failed:", err);
        toast.error("We couldn't send your order. Check your connection and tap Place order again.", {
          description: "Still not working? Refresh the page (your cart is saved) or order on Messenger.",
          duration: 15000,
          action: {
            label: "Messenger",
            onClick: () => window.open(messengerLink("Hi Fiesta Platter! I'd like to order."), "_blank", "noopener"),
          },
        });
        return;
      }
      if (state.status === "success" && state.summary) {
        try {
          sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(state.summary));
        } catch {
          /* private mode — success still shows, just not after a refresh */
        }
        setResult(state);
        cart.clear();
        window.scrollTo({ top: 0 });
        return;
      }
      setResult(state);
      if (state.errors) {
        for (const [field, messages] of Object.entries(state.errors)) {
          const message = messages?.[0];
          if (!message) continue;
          if (field === "cart") setCartError(message);
          else setError(field as keyof DetailsInput, { message });
        }
      }
      toast.error(state.message ?? "Please check the highlighted fields.");
    });
  };

  if (result?.status === "success" && result.summary) {
    return (
      <div className="container py-10">
        <OrderSuccess summary={result.summary} />
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="container py-16" aria-busy="true">
        <div className="mx-auto h-8 w-48 animate-pulse rounded-full bg-muted" />
        <div className="mx-auto mt-6 h-64 max-w-2xl animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (itemCount === 0 && lastOrder) {
    return (
      <div className="container py-10">
        <OrderSuccess summary={lastOrder} celebrate={false} />
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="container flex flex-col items-center py-20 text-center">
        <div className="flex gap-1" aria-hidden>
          <Pennant color="magenta" className="h-10 w-8" />
          <Pennant color="yellow" className="h-10 w-8" />
          <Pennant color="green" className="h-10 w-8" />
          <Pennant color="blue" className="h-10 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-foreground/70">
          Pick your bundles and trays first, then come back here to set the delivery details.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-brand px-6 font-bold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  const submitLabel = pending ? (
    <>
      <Loader2 className="h-5 w-5 motion-safe:animate-spin" aria-hidden /> Placing order…
    </>
  ) : (
    <>Place order · <span className="tabular">{formatPrice(subtotal)}</span></>
  );

  return (
    <div className="container grid gap-8 pb-32 pt-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:pb-16 lg:pt-10">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Checkout</h1>
        <p className="mt-1 text-sm text-foreground/70">
          No payment here. We&apos;ll confirm your order and total on Messenger first.
        </p>

        {/* Order summary for phones — the desktop sidebar takes over from lg up. */}
        <details className="group mt-5 rounded-2xl border border-border bg-card lg:hidden">
          <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <FlagString lines={lines} max={8} tone="dark" className="w-28 shrink-0 overflow-hidden" />
            <span className="flex-1 text-sm font-bold">
              {itemCount} {itemCount === 1 ? "item" : "items"}
              <span className="block text-xs font-semibold text-foreground/70 group-open:hidden">Show order</span>
              <span className="hidden text-xs font-semibold text-foreground/70 group-open:block">Hide order</span>
            </span>
            <span className="tabular font-display text-xl font-extrabold">{formatPrice(subtotal)}</span>
          </summary>
          <div className="border-t border-border px-4 pb-4">
            <OrderLines />
            <button
              type="button"
              onClick={openSheet}
              className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brand"
            >
              <Pencil className="h-4 w-4" aria-hidden /> Edit cart
            </button>
            <FreeDeliveryMeter className="mt-2" />
          </div>
        </details>

        {cartError ? (
          <p role="alert" className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {cartError}
          </p>
        ) : null}

        <form
          id={SUBMIT_FORM_ID}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label="Checkout"
          className="mt-6 space-y-9"
        >
          {/* Honeypot */}
          <div className="absolute left-[-9999px]" aria-hidden>
            <label htmlFor="company">Company</label>
            <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
          </div>

          <fieldset>
            <SectionTitle n={1}>When &amp; where</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Delivery date"
                htmlFor="deliveryDate"
                required
                error={errors.deliveryDate?.message}
                hint={`At least ${siteConfig.ordering.minLeadTimeHours} hours ahead`}
              >
                <Input
                  id="deliveryDate"
                  type="date"
                  min={minDate || undefined}
                  aria-invalid={!!errors.deliveryDate}
                  aria-describedby="deliveryDate-hint deliveryDate-error"
                  {...register("deliveryDate", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDeliveryDate(e.target.value),
                  })}
                />
              </Field>
              <Field
                label="Delivery time"
                htmlFor="deliveryTime"
                required
                error={errors.deliveryTime?.message}
                hint="Type a time, or pick a suggestion"
              >
                <Input
                  id="deliveryTime"
                  list="delivery-time-suggestions"
                  placeholder="e.g. 11:00 AM"
                  autoComplete="off"
                  aria-invalid={!!errors.deliveryTime}
                  aria-describedby="deliveryTime-hint deliveryTime-error"
                  {...register("deliveryTime")}
                />
                <datalist id="delivery-time-suggestions">
                  {timeSuggestions.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </Field>
            </div>
            <Field
              label="Complete delivery address"
              htmlFor="address"
              required
              error={errors.address?.message}
              className="mt-4"
            >
              <Textarea
                id="address"
                autoComplete="street-address"
                placeholder="House/unit no., street, barangay, town, landmark"
                aria-invalid={!!errors.address}
                aria-describedby="address-error"
                {...register("address")}
              />
            </Field>
          </fieldset>

          <fieldset>
            <SectionTitle n={2}>Your details</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name" required error={errors.name?.message}>
                <Input id="name" autoComplete="name" placeholder="Juan Dela Cruz" aria-invalid={!!errors.name} aria-describedby="name-error" {...register("name")} />
              </Field>
              <Field label="Mobile number" htmlFor="phone" required error={errors.phone?.message}>
                <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0917 123 4567" aria-invalid={!!errors.phone} aria-describedby="phone-error" {...register("phone")} />
              </Field>
              <Field label="Facebook name or link" htmlFor="facebook" error={errors.facebook?.message} hint="Helps us find you on Messenger">
                <Input id="facebook" placeholder="facebook.com/yourname" aria-describedby="facebook-hint facebook-error" {...register("facebook")} />
              </Field>
              <Field label="Email" htmlFor="email" error={errors.email?.message}>
                <Input id="email" type="email" autoComplete="email" placeholder="you@email.com" aria-invalid={!!errors.email} aria-describedby="email-error" {...register("email")} />
              </Field>
            </div>
          </fieldset>

          <fieldset>
            <SectionTitle n={3}>The occasion</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Event type" htmlFor="eventType" required error={errors.eventType?.message}>
                <select
                  id="eventType"
                  defaultValue=""
                  aria-invalid={!!errors.eventType}
                  aria-describedby="eventType-error"
                  className="h-11 w-full rounded-xl border border-input bg-card px-3.5 text-base text-foreground shadow-sm focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 aria-[invalid=true]:border-destructive"
                  {...register("eventType")}
                >
                  <option value="" disabled>
                    Choose the occasion
                  </option>
                  {eventTypes.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Number of guests" htmlFor="guests" required error={errors.guests?.message}>
                <Input id="guests" type="number" inputMode="numeric" min={1} placeholder="e.g. 20" aria-invalid={!!errors.guests} aria-describedby="guests-error" {...register("guests")} />
              </Field>
            </div>
            <Field
              label="Notes for the kitchen"
              htmlFor="specialInstructions"
              error={errors.specialInstructions?.message}
              hint="Allergies, less spicy, landmarks for the rider…"
              className="mt-4"
            >
              <Textarea id="specialInstructions" placeholder="Anything we should know?" aria-describedby="specialInstructions-hint" {...register("specialInstructions")} />
            </Field>
          </fieldset>

          <fieldset aria-describedby={errors.paymentMethod ? "paymentMethod-error" : "payment-note"}>
            <SectionTitle n={4}>Payment</SectionTitle>
            <p id="payment-note" className="-mt-1 mb-3 text-sm text-foreground/70">
              How you&apos;ll pay after we confirm. {siteConfig.ordering.downpaymentNote}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((m) => (
                <label
                  key={m}
                  className={cn(
                    "flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 text-sm font-bold transition-colors focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2",
                    selectedPayment === m ? "border-brand bg-brand/5" : "border-border bg-card hover:border-brand/40",
                  )}
                >
                  <input type="radio" value={m} className="h-5 w-5 accent-[#AF5308]" {...register("paymentMethod")} />
                  {m}
                </label>
              ))}
            </div>
            {errors.paymentMethod ? (
              <p id="paymentMethod-error" role="alert" className="mt-2 text-xs font-medium text-destructive">
                {errors.paymentMethod.message}
              </p>
            ) : null}
          </fieldset>

          <p className="flex items-start gap-2 text-sm text-foreground/70">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
            Prices are confirmed by our kitchen. Any delivery fee for orders under{" "}
            {formatPrice(siteConfig.ordering.freeDeliveryThreshold)} is quoted on Messenger.
          </p>
        </form>
      </div>

      {/* Desktop order summary */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-3xl border border-border bg-card p-5 shadow-[0_18px_40px_-28px_rgba(40,20,4,0.5)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold">Your order</h2>
            <button type="button" onClick={openSheet} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brand">
              <Pencil className="h-4 w-4" aria-hidden /> Edit
            </button>
          </div>
          <FlagString lines={lines} max={20} tone="dark" className="mt-2" />
          <div className="mt-3 max-h-[40vh] overflow-y-auto">
            <OrderLines />
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold text-foreground/70">Subtotal</span>
            <span className="tabular font-display text-2xl font-extrabold">{formatPrice(subtotal)}</span>
          </div>
          <FreeDeliveryMeter className="mt-3" />
          <button
            type="submit"
            form={SUBMIT_FORM_ID}
            disabled={pending}
            className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand text-base font-bold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 disabled:opacity-60"
          >
            {submitLabel}
          </button>
        </div>
      </aside>

      {/* Phone submit bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
        <button
          type="submit"
          form={SUBMIT_FORM_ID}
          disabled={pending}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand text-base font-bold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
