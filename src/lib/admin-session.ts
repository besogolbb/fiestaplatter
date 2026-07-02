export const ADMIN_SESSION_COOKIE = "fp_admin_session";

/**
 * Deterministic session token derived from ADMIN_SESSION_SECRET via HMAC —
 * no database/session store needed, and Web Crypto works in both the
 * Node.js runtime (admin pages/actions) and the Edge runtime (middleware).
 */
export async function computeAdminSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode("fiesta-platter-admin"));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
