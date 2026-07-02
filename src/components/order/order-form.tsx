"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Loader2, Sparkles, ShieldCheck, TrendingUp, Truck } from "lucide-react";
import { orderSchema, type OrderInput, eventTypes, paymentMethods } from "@/lib/order-schema";
import { submitOrder, type OrderActionState } from "@/app/(order)/order/actions";
import { packages } from "@/data/packages";
import { menu } from "@/data/menu";
import { siteConfig } from "@/config/site";
import { Field } from "@/components/order/field";
import { SelectableBundleCard, CustomizeBundleCard } from "@/components/order/selectable-bundle-card";
import { SelectedBundleSummary } from "@/components/order/selected-bundle-summary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderSuccess } from "@/components/order/order-success";
import { cn, formatPrice } from "@/lib/utils";
import { trackSelectBundle, trackBeginCheckout, trackLead } from "@/lib/analytics-events";

const timeSlots = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 NN",
  "12:00 NN – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
];

type Step = "bundle" | "details";

interface OrderFormProps {
  defaultPackage?: string;
  defaultItems?: string[];
}

/** Floating, elevated card panel shared by both steps — the "Jotform card" feel. */
function StepCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-2xl shadow-black/5 dark:shadow-black/40 sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-wide">
      <span className={step === "bundle" ? "text-brand" : "text-foreground/40"}>1. Bundle</span>
      <span className="h-px w-8 bg-border" aria-hidden />
      <span className={step === "details" ? "text-brand" : "text-foreground/40"}>2. Details</span>
    </div>
  );
}

export function OrderForm({ defaultPackage, defaultItems = [] }: OrderFormProps) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<OrderActionState | null>(null);
  const hasPreselection = Boolean(defaultPackage) || defaultItems.length > 0;
  const [step, setStep] = useState<Step>(hasPreselection ? "details" : "bundle");
  const reduceMotion = useReducedMotion();

  const todayStr = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: "",
      phone: "",
      facebook: "",
      email: "",
      deliveryDate: "",
      deliveryTime: "",
      address: "",
      guests: undefined as unknown as number,
      packageSlug: (defaultPackage ?? "") as OrderInput["packageSlug"],
      additionalItems: defaultItems,
      specialInstructions: "",
      company: "",
    },
    mode: "onTouched",
  });

  const selectedPackage = watch("packageSlug");
  const selectedAddOns = watch("additionalItems") ?? [];
  const isCustom = selectedPackage === "custom";
  const selectedPkgData = packages.find((p) => p.slug === selectedPackage);

  // Next-tier bundle, sorted by price, for the "upgrade for +₱X" upsell nudge.
  const sortedPackages = [...packages].sort((a, b) => a.price - b.price);
  const nextTierPackage = selectedPkgData
    ? sortedPackages.find((p) => p.price > selectedPkgData.price)
    : undefined;

  function selectBundle(slug: string) {
    setValue("packageSlug", slug as OrderInput["packageSlug"], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setStep("details");

    const pkg = packages.find((p) => p.slug === slug);
    if (pkg) {
      trackSelectBundle({ id: pkg.slug, name: pkg.name, price: pkg.price });
      trackBeginCheckout(pkg.price, [{ id: pkg.slug, name: pkg.name, price: pkg.price }]);
    }
  }

  // Deep-linked entry (?package=/?item=) skips step 1, so fire the same
  // funnel events once on mount instead of via the selectBundle handler.
  const firedEntryEvents = useRef(false);
  useEffect(() => {
    if (!hasPreselection || firedEntryEvents.current) return;
    firedEntryEvents.current = true;
    if (selectedPkgData) {
      trackSelectBundle({ id: selectedPkgData.slug, name: selectedPkgData.name, price: selectedPkgData.price });
    }
    trackBeginCheckout(estimatedTotal, [
      ...(selectedPkgData
        ? [{ id: selectedPkgData.slug, name: selectedPkgData.name, price: selectedPkgData.price }]
        : []),
      ...selectedAddOns
        .map((slug) => menu.find((m) => m.slug === slug))
        .filter((m): m is (typeof menu)[number] => Boolean(m))
        .map((m) => ({ id: m.slug, name: m.name, price: m.price })),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firedLeadEvent = useRef(false);
  useEffect(() => {
    if (result?.status === "success" && result.summary && !firedLeadEvent.current) {
      firedLeadEvent.current = true;
      trackLead(result.summary.estimatedTotal ?? 0, result.summary.reference);
    }
  }, [result]);

  function toggleAddOn(slug: string) {
    const set = new Set(selectedAddOns);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    setValue("additionalItems", Array.from(set), { shouldDirty: true });
  }

  // Live estimated subtotal (final total confirmed on checkout)
  const addOnTotal = selectedAddOns.reduce((sum, slug) => {
    const item = menu.find((m) => m.slug === slug);
    return sum + (item?.price ?? 0);
  }, 0);
  const estimatedTotal = (selectedPkgData?.price ?? 0) + addOnTotal;

  const onSubmit = (data: OrderInput) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "additionalItems" && Array.isArray(value)) {
        value.forEach((v) => fd.append("additionalItems", String(v)));
      } else if (value !== undefined && value !== null) {
        fd.append(key, String(value));
      }
    });

    startTransition(async () => {
      const state = await submitOrder({ status: "idle" }, fd);
      setResult(state);
      if (state.status === "success") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  if (result?.status === "success" && result.summary) {
    return <OrderSuccess summary={result.summary} />;
  }

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: "easeOut" as const };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Order form">
      {/* Honeypot */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div className="mx-auto max-w-3xl">
        <StepIndicator step={step} />

        <AnimatePresence mode="wait" initial={false}>
          {step === "bundle" ? (
            <motion.div
              key="bundle"
              initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={transition}
            >
              <StepCard>
                <h2 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
                  Choose Your Bundle
                </h2>
                <p className="mt-1 text-sm text-foreground/60">
                  Pick a ready-made Fiesta bundle, or build your own with Customize Bundle. Tap a
                  card to continue.
                </p>

                <div
                  role="radiogroup"
                  aria-label="Choose a bundle"
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                >
                  {packages.map((p) => (
                    <SelectableBundleCard
                      key={p.slug}
                      pkg={p}
                      active={selectedPackage === p.slug}
                      onSelect={() => selectBundle(p.slug)}
                    />
                  ))}
                  <CustomizeBundleCard active={isCustom} onSelect={() => selectBundle("custom")} />
                </div>
              </StepCard>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={transition}
            >
              <StepCard className="space-y-8">
                <div>
                  <SelectedBundleSummary
                    pkg={selectedPkgData}
                    isCustom={isCustom}
                    onChange={() => setStep("bundle")}
                  />
                  {errors.packageSlug ? (
                    <p role="alert" className="mt-2 text-xs font-medium text-destructive">
                      {errors.packageSlug.message}
                    </p>
                  ) : null}

                  {/* Upsell nudge — small price gap to the next bundle tier */}
                  {nextTierPackage && selectedPkgData ? (
                    <button
                      type="button"
                      onClick={() => selectBundle(nextTierPackage.slug)}
                      className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-brand/40 bg-brand/5 px-4 py-3 text-left transition-colors hover:bg-brand/10"
                    >
                      <span className="flex items-center gap-2 text-sm text-foreground">
                        <TrendingUp className="h-4 w-4 shrink-0 text-brand" />
                        Add{" "}
                        <strong className="text-brand">
                          {formatPrice(nextTierPackage.price - selectedPkgData.price)}
                        </strong>{" "}
                        to upgrade to <strong>{nextTierPackage.name}</strong>
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-brand underline underline-offset-2">
                        Upgrade
                      </span>
                    </button>
                  ) : null}
                </div>

                {/* Item picker — extra trays / custom builder */}
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Sparkles className="h-4 w-4 text-brand" />
                    {isCustom ? "Build your bundle — pick your trays" : "Add extra trays"}
                    {!isCustom ? (
                      <span className="font-normal text-foreground/40">(optional)</span>
                    ) : null}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {[...menu]
                      .sort(
                        (a, b) =>
                          Number(Boolean(b.bestSeller || b.popular)) -
                          Number(Boolean(a.bestSeller || a.popular)),
                      )
                      .map((item) => {
                        const checked = selectedAddOns.includes(item.slug);
                        return (
                          <label
                            key={item.slug}
                            className={cn(
                              "flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-colors",
                              checked
                                ? "border-brand bg-brand/10 text-foreground"
                                : "border-border bg-card text-foreground/80 hover:border-brand/40",
                            )}
                          >
                            <span className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                className="h-4 w-4 accent-brand"
                                checked={checked}
                                onChange={() => toggleAddOn(item.slug)}
                              />
                              {item.name}
                              {item.bestSeller || item.popular ? (
                                <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-600">
                                  Popular
                                </span>
                              ) : null}
                            </span>
                            <span className="shrink-0 font-semibold text-brand">
                              {formatPrice(item.price)}
                            </span>
                          </label>
                        );
                      })}
                  </div>
                </div>

                {estimatedTotal > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-xl border border-brand/30 bg-brand/10 px-4 py-3">
                      <span className="text-sm font-semibold text-foreground">Estimated total</span>
                      <span className="font-display text-xl font-extrabold text-brand">
                        {formatPrice(estimatedTotal)}
                      </span>
                    </div>

                    {/* Free-delivery progress nudge */}
                    {(() => {
                      const threshold = siteConfig.ordering.freeDeliveryThreshold;
                      const remaining = threshold - estimatedTotal;
                      const pct = Math.min(100, Math.round((estimatedTotal / threshold) * 100));
                      return (
                        <div className="rounded-xl border border-border bg-background/60 px-4 py-3">
                          <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                            <Truck className="h-3.5 w-3.5 text-brand" />
                            {remaining > 0 ? (
                              <>
                                Add <span className="text-brand">{formatPrice(remaining)}</span> more
                                for FREE delivery!
                              </>
                            ) : (
                              <span className="text-green-600">
                                🎉 You&apos;ve unlocked free delivery!
                              </span>
                            )}
                          </p>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                remaining > 0 ? "bg-brand" : "bg-green-500",
                              )}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : null}

                {result?.status === "error" ? (
                  <p
                    role="alert"
                    className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
                  >
                    {result.message}
                  </p>
                ) : null}

                {/* Contact */}
                <fieldset className="space-y-4">
                  <legend className="mb-2 font-display text-lg font-bold text-foreground">
                    Your Contact Details
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name" htmlFor="name" required error={errors.name?.message}>
                      <Input id="name" autoComplete="name" placeholder="Juan Dela Cruz" aria-invalid={!!errors.name} {...register("name")} />
                    </Field>
                    <Field label="Mobile Number" htmlFor="phone" required error={errors.phone?.message}>
                      <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0917 123 4567" aria-invalid={!!errors.phone} {...register("phone")} />
                    </Field>
                    <Field label="Facebook Profile" htmlFor="facebook" error={errors.facebook?.message} hint="Helps us confirm faster via Messenger">
                      <Input id="facebook" placeholder="facebook.com/yourname" {...register("facebook")} />
                    </Field>
                    <Field label="Email" htmlFor="email" error={errors.email?.message}>
                      <Input id="email" type="email" autoComplete="email" placeholder="you@email.com" aria-invalid={!!errors.email} {...register("email")} />
                    </Field>
                  </div>
                </fieldset>

                {/* Delivery */}
                <fieldset className="space-y-4">
                  <legend className="mb-2 font-display text-lg font-bold text-foreground">
                    Delivery Schedule
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Delivery Date" htmlFor="deliveryDate" required error={errors.deliveryDate?.message}>
                      <Input id="deliveryDate" type="date" min={todayStr} aria-invalid={!!errors.deliveryDate} {...register("deliveryDate")} />
                    </Field>
                    <Field label="Preferred Time" htmlFor="deliveryTime" required error={errors.deliveryTime?.message}>
                      <Controller
                        control={control}
                        name="deliveryTime"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="deliveryTime" aria-invalid={!!errors.deliveryTime}>
                              <SelectValue placeholder="Choose a time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>
                  </div>
                  <Field label="Complete Delivery Address" htmlFor="address" required error={errors.address?.message}>
                    <Textarea id="address" autoComplete="street-address" placeholder="House/Unit no., street, barangay, city, landmark" aria-invalid={!!errors.address} {...register("address")} />
                  </Field>
                </fieldset>

                {/* Event */}
                <fieldset className="space-y-4">
                  <legend className="mb-2 font-display text-lg font-bold text-foreground">
                    About Your Event
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Event Type" htmlFor="eventType" required error={errors.eventType?.message}>
                      <Controller
                        control={control}
                        name="eventType"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="eventType" aria-invalid={!!errors.eventType}>
                              <SelectValue placeholder="Select occasion" />
                            </SelectTrigger>
                            <SelectContent>
                              {eventTypes.map((e) => (
                                <SelectItem key={e} value={e}>
                                  {e}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>
                    <Field label="Estimated Guests" htmlFor="guests" required error={errors.guests?.message}>
                      <Input id="guests" type="number" inputMode="numeric" min={1} placeholder="e.g. 20" aria-invalid={!!errors.guests} {...register("guests")} />
                    </Field>
                  </div>
                  <Field label="Special Instructions" htmlFor="specialInstructions" error={errors.specialInstructions?.message} hint="Allergies, custom requests, delivery notes, etc.">
                    <Textarea id="specialInstructions" placeholder="Anything we should know?" {...register("specialInstructions")} />
                  </Field>
                  <Field label="Preferred Payment" htmlFor="paymentMethod" required error={errors.paymentMethod?.message}>
                    <Controller
                      control={control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="paymentMethod" aria-invalid={!!errors.paymentMethod}>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </fieldset>

                <div className="space-y-3">
                  <Button type="submit" size="lg" className="w-full shadow-md" disabled={pending}>
                    {pending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
                      </>
                    ) : (
                      "Submit Order"
                    )}
                  </Button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-xs text-foreground/50">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    No payment yet. We&apos;ll confirm your order and total before anything is
                    charged.
                  </p>
                </div>
              </StepCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
