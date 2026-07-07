import { JWT } from "google-auth-library";

/**
 * Creates a Google Calendar event for each order so deliveries show up on
 * a real calendar with a built-in 24-hour-before reminder — reuses the same
 * service account as Sheets (see docs/09-Google-Calendar-Setup.md) with an
 * additional Calendar scope. No-ops safely if unconfigured.
 */

let cachedClient: JWT | null | undefined;

function getAuthClient(): JWT | null {
  if (cachedClient !== undefined) return cachedClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) {
    cachedClient = null;
    return null;
  }

  cachedClient = new JWT({
    email,
    key: rawKey.replace(/\\n/g, "\n"),
    // The connection-check call (GET /calendars/{id}) needs the broader
    // "calendar" scope — "calendar.events" alone only covers the Events
    // resource and 403s on that call with "insufficient authentication
    // scopes" even though event creation would work.
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return cachedClient;
}

async function calendarFetch(path: string, init?: RequestInit): Promise<Response | null> {
  const client = getAuthClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!client || !calendarId) return null;

  const { token } = await client.getAccessToken();
  return fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
    },
  );
}

/** "2:00 PM" / "12:00 NN" -> "14:00" / "12:00" (24-hour, for Asia/Manila local time). */
function to24Hour(time: string): string | null {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|NN)$/i);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const minute = m[2];
  const period = m[3].toUpperCase() === "NN" ? "PM" : m[3].toUpperCase();
  if (period === "AM") {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

/** "2:00 PM – 4:00 PM" -> { start: "14:00", end: "16:00" }. Returns null if unparseable. */
function parseTimeSlot(slot: string): { start: string; end: string } | null {
  const parts = slot.split(/[–—-]/).map((s) => s.trim());
  if (parts.length !== 2) return null;
  const start = to24Hour(parts[0]);
  const end = to24Hour(parts[1]);
  if (!start || !end) return null;
  return { start, end };
}

export interface OrderCalendarInput {
  reference: string;
  name: string;
  phone: string;
  address: string;
  /** YYYY-MM-DD */
  deliveryDate: string;
  /** e.g. "2:00 PM – 4:00 PM" — falls back to an all-day event if missing/unparseable. */
  deliveryTime?: string;
  packageName: string;
  addOns?: string;
  estimatedTotal?: string;
  specialInstructions?: string;
}

export interface CalendarResult {
  success: boolean;
  error?: string;
}

/**
 * Creates a calendar event for a delivery, with a popup + email reminder
 * 24 hours before. Requires GOOGLE_CALENDAR_ID in addition to the Sheets
 * service-account env vars, and the target calendar must be shared with
 * the service account email as "Make changes to events".
 */
export async function createOrderCalendarEvent(order: OrderCalendarInput): Promise<CalendarResult> {
  try {
    const range = order.deliveryTime ? parseTimeSlot(order.deliveryTime) : null;

    const description = [
      `Reference: ${order.reference}`,
      `Phone: ${order.phone}`,
      `Address: ${order.address}`,
      `Package: ${order.packageName}`,
      order.addOns ? `Add-ons: ${order.addOns}` : null,
      order.estimatedTotal ? `Estimated Total: ₱${order.estimatedTotal}` : null,
      order.specialInstructions ? `Notes: ${order.specialInstructions}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const event: Record<string, unknown> = {
      summary: `🍽️ ${order.reference} — ${order.name} (${order.packageName})`,
      description,
      location: order.address,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 24 * 60 },
          { method: "email", minutes: 24 * 60 },
        ],
      },
    };

    if (range) {
      event.start = { dateTime: `${order.deliveryDate}T${range.start}:00`, timeZone: "Asia/Manila" };
      event.end = { dateTime: `${order.deliveryDate}T${range.end}:00`, timeZone: "Asia/Manila" };
    } else {
      // All-day fallback when no parseable delivery time (e.g. manual orders
      // that skip the time field) — still shows up on the right date.
      event.start = { date: order.deliveryDate };
      event.end = { date: order.deliveryDate };
    }

    const res = await calendarFetch(`/events`, { method: "POST", body: JSON.stringify(event) });
    if (!res) return { success: false, error: "Google Calendar isn't configured." };
    if (!res.ok) {
      const body = await res.text();
      console.error("[createOrderCalendarEvent] non-OK response:", res.status, body);
      return { success: false, error: `Calendar API returned ${res.status}: ${body.slice(0, 200)}` };
    }
    return { success: true };
  } catch (err) {
    console.error("[createOrderCalendarEvent] failed:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export interface CalendarConnectionStatus {
  configured: boolean;
  connected: boolean;
  error?: string;
}

/** Live check used by the admin dashboard to confirm Calendar is reachable. */
export async function checkGoogleCalendarConnection(): Promise<CalendarConnectionStatus> {
  const missing = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY", "GOOGLE_CALENDAR_ID"].filter(
    (key) => !process.env[key],
  );
  if (missing.length > 0) {
    return { configured: false, connected: false, error: `Missing: ${missing.join(", ")}` };
  }

  try {
    const res = await calendarFetch(`?fields=id`);
    if (!res) return { configured: false, connected: false, error: "Not configured." };
    if (res.ok) return { configured: true, connected: true };
    const body = await res.text();
    return {
      configured: true,
      connected: false,
      error: `Calendar API returned ${res.status}${res.status === 403 ? " (permission denied — has the calendar been shared with the service account email with 'Make changes to events'?)" : ""}${res.status === 404 ? " (calendar not found — check GOOGLE_CALENDAR_ID)" : ""}: ${body.slice(0, 300)}`,
    };
  } catch (err) {
    return { configured: true, connected: false, error: err instanceof Error ? err.message : String(err) };
  }
}
