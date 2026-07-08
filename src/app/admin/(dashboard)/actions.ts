"use server";

import { revalidatePath } from "next/cache";
import {
  appendManualOrder,
  deleteOrderByReference,
  setOrderDelivered,
  updateOrderByReference,
  type ManualOrderInput,
  type ManualOrderResult,
} from "@/lib/google-sheets";
import { createOrderCalendarEvent } from "@/lib/google-calendar";

export async function addManualOrderAction(formData: FormData): Promise<ManualOrderResult> {
  const input: ManualOrderInput = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    facebook: String(formData.get("facebook") ?? ""),
    eventType: String(formData.get("eventType") ?? ""),
    guests: String(formData.get("guests") ?? ""),
    deliveryDate: String(formData.get("deliveryDate") ?? ""),
    deliveryTime: String(formData.get("deliveryTime") ?? ""),
    address: String(formData.get("address") ?? ""),
    packageName: String(formData.get("packageName") ?? ""),
    addOns: String(formData.get("addOns") ?? ""),
    paymentMethod: String(formData.get("paymentMethod") ?? ""),
    specialInstructions: String(formData.get("specialInstructions") ?? ""),
    estimatedTotal: String(formData.get("estimatedTotal") ?? ""),
    estimatedProfit: String(formData.get("estimatedProfit") ?? ""),
  };

  if (!input.name || !input.phone || !input.deliveryDate) {
    return { success: false, error: "Name, phone, and delivery date are required." };
  }

  const result = await appendManualOrder(input);
  if (result.success) {
    revalidatePath("/admin");
    if (result.reference) {
      await createOrderCalendarEvent({
        reference: result.reference,
        name: input.name,
        phone: input.phone,
        address: input.address,
        deliveryDate: input.deliveryDate,
        deliveryTime: input.deliveryTime,
        packageName: input.packageName,
        addOns: input.addOns,
        estimatedTotal: input.estimatedTotal,
        specialInstructions: input.specialInstructions,
      });
    }
  }
  return result;
}

export async function updateOrderAction(formData: FormData): Promise<ManualOrderResult> {
  const reference = String(formData.get("reference") ?? "");
  const submittedAt = String(formData.get("submittedAt") ?? "");
  const delivered = String(formData.get("delivered") ?? "No");

  const input: ManualOrderInput = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    facebook: String(formData.get("facebook") ?? ""),
    eventType: String(formData.get("eventType") ?? ""),
    guests: String(formData.get("guests") ?? ""),
    deliveryDate: String(formData.get("deliveryDate") ?? ""),
    deliveryTime: String(formData.get("deliveryTime") ?? ""),
    address: String(formData.get("address") ?? ""),
    packageName: String(formData.get("packageName") ?? ""),
    addOns: String(formData.get("addOns") ?? ""),
    paymentMethod: String(formData.get("paymentMethod") ?? ""),
    specialInstructions: String(formData.get("specialInstructions") ?? ""),
    estimatedTotal: String(formData.get("estimatedTotal") ?? ""),
    estimatedProfit: String(formData.get("estimatedProfit") ?? ""),
  };

  if (!reference || !input.name || !input.phone || !input.deliveryDate) {
    return { success: false, error: "Name, phone, and delivery date are required." };
  }

  const result = await updateOrderByReference(reference, input, { submittedAt, delivered });
  if (result.success) revalidatePath("/admin");
  return result;
}

export async function deleteOrderAction(reference: string): Promise<ManualOrderResult> {
  const result = await deleteOrderByReference(reference);
  if (result.success) revalidatePath("/admin");
  return result;
}

export async function setOrderDeliveredAction(
  reference: string,
  delivered: boolean,
): Promise<ManualOrderResult> {
  const result = await setOrderDelivered(reference, delivered);
  if (result.success) revalidatePath("/admin");
  return result;
}
