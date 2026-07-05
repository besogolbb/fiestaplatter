"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { eventTypes, paymentMethods } from "@/lib/order-schema";
import { addManualOrderAction } from "@/app/admin/(dashboard)/actions";
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

/**
 * Manual order entry for phone/Messenger orders that never went through the
 * customer-facing order form — writes straight to the Orders sheet via
 * appendManualOrder, so packageName/addOns are free text here (no menu-slug
 * validation) since the admin may be recording an off-menu arrangement.
 */
export function AddOrderModal({ onClose }: { onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [eventType, setEventType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await addManualOrderAction(formData);
      if (result.success) {
        toast.success(`Order ${result.reference} added.`);
        router.refresh();
        onClose();
      } else {
        toast.error(result.error ?? "Could not add the order.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold text-foreground">Add Manual Order</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-foreground/50 hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-foreground/70">
          For orders taken by phone or Messenger — this writes directly to the Orders sheet.
        </p>

        <form ref={formRef} action={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" htmlFor="name" required>
              <Input id="name" name="name" required placeholder="Juan Dela Cruz" />
            </Field>
            <Field label="Mobile Number" htmlFor="phone" required>
              <Input id="phone" name="phone" required placeholder="0917 123 4567" />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input id="email" name="email" type="email" placeholder="you@email.com" />
            </Field>
            <Field label="Facebook Profile" htmlFor="facebook">
              <Input id="facebook" name="facebook" placeholder="facebook.com/yourname" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Delivery Date" htmlFor="deliveryDate" required>
              <Input id="deliveryDate" name="deliveryDate" type="date" required />
            </Field>
            <Field label="Delivery Time" htmlFor="deliveryTime">
              <Input id="deliveryTime" name="deliveryTime" placeholder="e.g. 10:00 AM – 12:00 NN" />
            </Field>
          </div>
          <Field label="Delivery Address" htmlFor="address">
            <Textarea id="address" name="address" placeholder="House/Unit no., street, barangay, city" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Event Type" htmlFor="eventType">
              <input type="hidden" name="eventType" value={eventType} />
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger id="eventType">
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
            </Field>
            <Field label="Estimated Guests" htmlFor="guests">
              <Input id="guests" name="guests" type="number" min={1} placeholder="e.g. 20" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Package / Order Description" htmlFor="packageName" required>
              <Input id="packageName" name="packageName" required placeholder="e.g. Fiesta Signature Bundle" />
            </Field>
            <Field label="Add-ons" htmlFor="addOns">
              <Input id="addOns" name="addOns" placeholder="e.g. Pork BBQ x2" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Payment Method" htmlFor="paymentMethod">
              <input type="hidden" name="paymentMethod" value={paymentMethod} />
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod">
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
            </Field>
            <Field label="Estimated Total (PHP)" htmlFor="estimatedTotal" required>
              <Input id="estimatedTotal" name="estimatedTotal" type="number" min={0} required placeholder="e.g. 1200" />
            </Field>
          </div>

          <Field label="Special Instructions" htmlFor="specialInstructions">
            <Textarea id="specialInstructions" name="specialInstructions" placeholder="Anything to note?" />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Add Order"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
