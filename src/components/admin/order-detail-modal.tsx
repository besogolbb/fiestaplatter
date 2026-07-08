"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import type { OrderRecord } from "@/lib/google-sheets";
import { updateOrderAction } from "@/app/admin/(dashboard)/actions";
import { eventTypes, paymentMethods } from "@/lib/order-schema";
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
import { formatPrice } from "@/lib/utils";

/**
 * View + edit panel for a single order row. Opens read-only (the table
 * itself already has quick actions for delete / mark delivered), and
 * switches to an editable form on demand. Add-ons stay a free-text field
 * here rather than the qty picker used when creating an order — the sheet
 * only ever stores the add-ons as a display string, so editing it as text
 * is the honest representation of what actually gets saved.
 */
export function OrderDetailModal({ order, onClose }: { order: OrderRecord; onClose: () => void }) {
  const [editing, setEditing] = useState(false);
  const [eventType, setEventType] = useState(order.eventType);
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    formData.set("reference", order.reference);
    formData.set("submittedAt", order.submittedAt);
    formData.set("delivered", order.delivered);
    formData.set("eventType", eventType);
    formData.set("paymentMethod", paymentMethod);

    startTransition(async () => {
      const result = await updateOrderAction(formData);
      if (result.success) {
        toast.success(`Order ${order.reference} updated.`);
        router.refresh();
        onClose();
      } else {
        toast.error(result.error ?? "Could not update the order.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-extrabold text-foreground">
              {editing ? "Edit Order" : "Order Details"}
            </h2>
            <p className="font-mono text-xs text-foreground/50">{order.reference}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {!editing ? (
              <Button type="button" size="sm" variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-foreground/50 hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {editing ? (
          <form action={handleSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" htmlFor="name" required>
                <Input id="name" name="name" required defaultValue={order.name} />
              </Field>
              <Field label="Mobile Number" htmlFor="phone" required>
                <Input id="phone" name="phone" required defaultValue={order.phone} />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input id="email" name="email" type="email" defaultValue={order.email} />
              </Field>
              <Field label="Facebook Profile" htmlFor="facebook">
                <Input id="facebook" name="facebook" defaultValue={order.facebook} />
              </Field>
            </div>

            <Field label="Delivery Address" htmlFor="address" required>
              <Textarea id="address" name="address" required defaultValue={order.address} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Delivery Date" htmlFor="deliveryDate" required>
                <Input id="deliveryDate" name="deliveryDate" type="date" required defaultValue={order.deliveryDate} />
              </Field>
              <Field label="Delivery Time" htmlFor="deliveryTime">
                <Input id="deliveryTime" name="deliveryTime" defaultValue={order.deliveryTime} />
              </Field>
              <Field label="Event Type" htmlFor="eventType">
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
              <Field label="Guests" htmlFor="guests">
                <Input id="guests" name="guests" type="number" min={1} defaultValue={order.guests} />
              </Field>
            </div>

            <Field label="Package" htmlFor="packageName">
              <Input id="packageName" name="packageName" defaultValue={order.packageName} />
            </Field>
            <Field label="Add-ons" htmlFor="addOns" hint="Free text, exactly as it will appear in the sheet.">
              <Textarea id="addOns" name="addOns" defaultValue={order.addOns} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Payment Method" htmlFor="paymentMethod">
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
              <Field label="Estimated Total (PHP)" htmlFor="estimatedTotal">
                <Input id="estimatedTotal" name="estimatedTotal" type="number" min={0} defaultValue={order.estimatedTotal} />
              </Field>
              <Field label="Net Profit (PHP)" htmlFor="estimatedProfit" hint="Only counts items with known cost data.">
                <Input id="estimatedProfit" name="estimatedProfit" type="number" min={0} defaultValue={order.estimatedProfit} />
              </Field>
            </div>

            <Field label="Special Instructions" htmlFor="specialInstructions">
              <Textarea id="specialInstructions" name="specialInstructions" defaultValue={order.specialInstructions} />
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditing(false)} disabled={pending}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-5 space-y-4 text-sm">
            <DetailRow label="Name" value={order.name} />
            <DetailRow label="Phone" value={order.phone} />
            <DetailRow label="Email" value={order.email} />
            <DetailRow label="Facebook" value={order.facebook} />
            <DetailRow label="Address" value={order.address} />
            <DetailRow label="Delivery" value={`${order.deliveryDate} ${order.deliveryTime}`.trim()} />
            <DetailRow label="Event" value={`${order.eventType}${order.guests ? ` · ${order.guests} pax` : ""}`} />
            <DetailRow label="Package" value={order.packageName} />
            <DetailRow label="Add-ons" value={order.addOns || "—"} />
            <DetailRow label="Payment Method" value={order.paymentMethod} />
            <DetailRow label="Special Instructions" value={order.specialInstructions || "—"} />
            <DetailRow label="Delivered" value={order.delivered === "Yes" ? "Yes" : "No"} />
            <div className="flex items-center justify-between rounded-xl border-2 border-brand bg-brand/15 px-4 py-3">
              <div>
                <span className="block text-sm font-bold text-foreground">Estimated Total</span>
                {Number(order.estimatedProfit) > 0 ? (
                  <span className="block text-xs font-semibold text-green-600 dark:text-green-400">
                    {formatPrice(Number(order.estimatedProfit))} net profit
                  </span>
                ) : null}
              </div>
              <span className="font-display text-xl font-extrabold text-brand">
                {formatPrice(Number(String(order.estimatedTotal).replace(/[^0-9.]/g, "")) || 0)}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border pb-2 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{label}</span>
      <span className="text-foreground">{value || "—"}</span>
    </div>
  );
}
