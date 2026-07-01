"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Sparkles, ShieldCheck, Users, Wrench } from "lucide-react";
import { orderSchema, type OrderInput, eventTypes, paymentMethods } from "@/lib/order-schema";
import { submitOrder, type OrderActionState } from "@/app/(order)/order/actions";
import { packages } from "@/data/packages";
import { menu } from "@/data/menu";
import { Field } from "@/components/order/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderSuccess } from "@/components/order/order-success";
import { cn, formatPrice } from "@/lib/utils";

const timeSlots = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 NN",
  "12:00 NN – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
];

interface OrderFormProps {
  defaultPackage?: string;
  defaultItems?: string[];
}

export function OrderForm({ defaultPackage, defaultItems = [] }: OrderFormProps) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<OrderActionState | null>(null);

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

  function selectPackage(slug: string) {
    setValue("packageSlug", slug as OrderInput["packageSlug"], {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  function toggleAddOn(slug: string) {
    const set = new Set(selectedAddOns);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    setValue("additionalItems", Array.from(set), { shouldDirty: true });
  }

  // Live estimated subtotal (final total confirmed on checkout)
  const pkg = packages.find((p) => p.slug === selectedPackage);
  const addOnTotal = selectedAddOns.reduce((sum, slug) => {
    const item = menu.find((m) => m.slug === slug);
    return sum + (item?.price ?? 0);
  }, 0);
  const estimatedTotal = (pkg?.price ?? 0) + addOnTotal;

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mx-auto max-w-2xl space-y-8"
      aria-label="Order form"
    >
      {result?.status === "error" ? (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {result.message}
        </p>
      ) : null}

      {/* Honeypot */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      {/* Step 1 — Choose a package */}
      <fieldset className="space-y-4">
        <legend className="mb-1 font-display text-lg font-bold text-foreground">
          1. Choose Your Bundle
        </legend>
        <p className="text-sm text-foreground/60">
          Pick a ready-made Fiesta bundle, or build your own with Customize Bundle.
        </p>

        <div
          role="radiogroup"
          aria-label="Choose a bundle"
          className="grid gap-3 sm:grid-cols-2"
        >
          {packages.map((p) => {
            const active = selectedPackage === p.slug;
            return (
              <button
                type="button"
                key={p.slug}
                role="radio"
                aria-checked={active}
                onClick={() => selectPackage(p.slug)}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-4 text-left transition-all",
                  active
                    ? "border-brand bg-brand/10 ring-1 ring-brand"
                    : "border-white/10 bg-card hover:border-brand/40",
                )}
              >
                <span
                  className={cn(
                    "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border",
                    active ? "border-brand bg-brand text-white" : "border-white/25",
                  )}
                  aria-hidden
                >
                  {active ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
                <span className="flex items-center gap-2 pr-6">
                  <span className="font-display text-base font-bold text-foreground">
                    {p.name}
                  </span>
                  {p.badge ? (
                    <Badge variant="muted" className="shrink-0 text-[10px]">
                      {p.badge}
                    </Badge>
                  ) : null}
                </span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-foreground/55">
                  <Users className="h-3.5 w-3.5 text-brand" /> {p.serving}
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-foreground/70">
                  <span className="font-semibold text-foreground/80">Includes:</span>{" "}
                  {p.includes.join(" · ")}
                </span>
                <span className="mt-2 font-display text-lg font-extrabold text-brand">
                  {formatPrice(p.price)}
                </span>
              </button>
            );
          })}

          {/* Customize Bundle option */}
          <button
            type="button"
            role="radio"
            aria-checked={isCustom}
            onClick={() => selectPackage("custom")}
            className={cn(
              "relative flex flex-col justify-center rounded-2xl border border-dashed p-4 text-left transition-all",
              isCustom
                ? "border-brand bg-brand/10 ring-1 ring-brand"
                : "border-white/20 bg-card hover:border-brand/40",
            )}
          >
            <span
              className={cn(
                "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border",
                isCustom ? "border-brand bg-brand text-white" : "border-white/25",
              )}
              aria-hidden
            >
              {isCustom ? <Check className="h-3.5 w-3.5" /> : null}
            </span>
            <span className="flex items-center gap-2 font-display text-base font-bold text-foreground">
              <Wrench className="h-4 w-4 text-brand" /> Customize Bundle
            </span>
            <span className="mt-1 text-xs text-foreground/55">
              Build your own — pick exactly the trays you want below.
            </span>
          </button>
        </div>

        {errors.packageSlug ? (
          <p role="alert" className="text-xs font-medium text-destructive">
            {errors.packageSlug.message}
          </p>
        ) : null}

        {/* Item picker — extra trays / custom builder */}
        <div className="rounded-2xl border border-white/10 bg-card/60 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-brand" />
            {isCustom ? "Build your bundle — pick your trays" : "Add extra trays"}
            {!isCustom ? (
              <span className="font-normal text-foreground/40">(optional)</span>
            ) : null}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {menu.map((item) => {
              const checked = selectedAddOns.includes(item.slug);
              return (
                <label
                  key={item.slug}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-colors",
                    checked
                      ? "border-brand bg-brand/10 text-foreground"
                      : "border-white/10 bg-card text-foreground/80 hover:border-brand/40",
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
                  </span>
                  <span className="shrink-0 font-semibold text-brand">
                    {formatPrice(item.price)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Live estimated total */}
        {estimatedTotal > 0 ? (
          <div className="flex items-center justify-between rounded-xl border border-brand/30 bg-brand/10 px-4 py-3">
            <span className="text-sm font-semibold text-foreground">Estimated total</span>
            <span className="font-display text-xl font-extrabold text-brand">
              {formatPrice(estimatedTotal)}
            </span>
          </div>
        ) : null}
      </fieldset>

      {/* Step 2 — Contact */}
      <fieldset className="space-y-4">
        <legend className="mb-2 font-display text-lg font-bold text-foreground">
          2. Your Contact Details
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

      {/* Step 3 — Delivery */}
      <fieldset className="space-y-4">
        <legend className="mb-2 font-display text-lg font-bold text-foreground">
          3. Delivery Schedule
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

      {/* Step 4 — Event */}
      <fieldset className="space-y-4">
        <legend className="mb-2 font-display text-lg font-bold text-foreground">
          4. About Your Event
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
          No payment yet. We&apos;ll confirm your order and total before anything is charged.
        </p>
      </div>
    </form>
  );
}
