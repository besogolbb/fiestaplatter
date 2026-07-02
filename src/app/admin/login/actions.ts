"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, computeAdminSessionToken } from "@/lib/admin-session";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const safeNext = next.startsWith("/admin") ? next : "/admin";

  // .trim() guards against a trailing newline/space from copy-pasting the
  // value into EasyPanel's Environment tab — a very common way this silently
  // breaks without looking wrong anywhere.
  const expectedPassword = process.env.ADMIN_PASSWORD?.trim();
  const sessionSecretSet = Boolean(process.env.ADMIN_SESSION_SECRET);

  if (!expectedPassword || !sessionSecretSet) {
    // Not configured yet — same error message as a wrong password so we
    // don't leak which env var is missing to an unauthenticated visitor.
    redirect(`/admin/login?error=1&next=${encodeURIComponent(safeNext)}`);
  }
  if (password !== expectedPassword) {
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
