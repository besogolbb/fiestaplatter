"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, computeAdminSessionToken } from "@/lib/admin-session";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const safeNext = next.startsWith("/admin") ? next : "/admin";

  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword || password !== expectedPassword) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(safeNext)}`);
  }

  const token = await computeAdminSessionToken();
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect(safeNext);
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
