import { headers, cookies } from "next/headers";
import { siteConfig } from "@/config/site";

/**
 * Server-side Meta Conversions API. Complements the client-side Pixel so
 * Lead events survive iOS ATT / ad-blockers, which the client Pixel alone
 * cannot. No-ops until META_CAPI_ACCESS_TOKEN is configured — safe to call
 * unconditionally from the order action.
 *
 * `eventId` must match the id passed to the client-side fbq("track", "Lead",
 * ..., { eventID }) call for the same order so Meta de-duplicates the two.
 */
export async function sendMetaCapiLead(params: { eventId: string; value: number }) {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  try {
    const h = await headers();
    const c = await cookies();
    const forwardedFor = h.get("x-forwarded-for");

    const userData: Record<string, string> = {};
    if (forwardedFor) userData.client_ip_address = forwardedFor.split(",")[0].trim();
    const ua = h.get("user-agent");
    if (ua) userData.client_user_agent = ua;
    const fbp = c.get("_fbp")?.value;
    if (fbp) userData.fbp = fbp;
    const fbc = c.get("_fbc")?.value;
    if (fbc) userData.fbc = fbc;

    await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: accessToken,
        data: [
          {
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            event_id: params.eventId,
            action_source: "website",
            event_source_url: `${siteConfig.url}/order`,
            user_data: userData,
            custom_data: { currency: "PHP", value: params.value },
          },
        ],
      }),
    });
  } catch (err) {
    console.error("[sendMetaCapiLead] failed:", err);
  }
}
