"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { orderSchema, type OrderInput, eventTypes, paymentMethods } from "@/lib/order-schema";
import { additionalItemOptions } from "@/lib/order-schema";
import { submitOrder, type OrderActionState } from "@/app/(order)/order/actions";
import { packages } from "@/data/packages";
import { Field } from "@/components/order/field";
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
import { formatPrice } from "@/lib/utils";

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

  const selectedAddOns = watch("additionalItems") ?? [];

  function toggleAddOn(slug: string) {
    const set = new Set(selectedAddOns);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    setValue("additionalItems", Array.from(set), { shouldDirty: true });
  }

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
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {result.message}
        </p>
      ) : null}

      {/* Honeypot — hidden from users, catches bots */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      {/* Contact */}
      <fieldset className="space-y-4">
        <legend className="mb-2 font-display text-lg font-bold text-ink">
          1. Your Contact Details
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
        <legend className="mb-2 font-display text-lg font-bold text-ink">
          2. Delivery Schedule
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
        <legend className="mb-2 font-display text-lg font-bold text-ink">
          3. About Your Event
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
      </fieldset>

      {/* Order */}
      <fieldset className="space-y-4">
        <legend className="mb-2 font-display text-lg font-bold text-ink">
          4. Your Order
        </legend>
        <Field label="Choose a Package" htmlFor="packageSlug" required error={errors.packageSlug?.message}>
          <Controller
            control={control}
            name="packageSlug"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="packageSlug" aria-invalid={!!errors.packageSlug}>
                  <SelectValue placeholder="Select a package" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((p) => (
                    <SelectItem key={p.slug} value={p.slug}>
                      {p.name} — {formatPrice(p.price)}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom order / not sure yet</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <div>
          <p className="text-sm font-semibold text-ink">
            Add Extra Trays <span className="font-normal text-ink/40">(optional)</span>
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {additionalItemOptions.map((opt) => {
              const checked = selectedAddOns.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                    checked ? "border-brand bg-brand/5 text-ink" : "border-input bg-white text-ink/80 hover:border-brand/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-brand"
                    checked={checked}
                    onChange={() => toggleAddOn(opt.value)}
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
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
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink/50">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          No payment yet. We&apos;ll confirm your order and total before anything is charged.
        </p>
      </div>
    </form>
  );
}
