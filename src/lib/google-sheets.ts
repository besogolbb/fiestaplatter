import { JWT } from "google-auth-library";
import type { OrderInput } from "@/lib/order-schema";
import type { OrderSummary } from "@/lib/order-format";

export interface OrderRecord {
  submittedAt: string;
  reference: string;
  name: string;
  phone: string;
  email: string;
  facebook: string;
  eventType: string;
  guests: string;
  deliveryDate: string;
  deliveryTime: string;
  address: string;
  packageName: string;
  addOns: string;
  paymentMethod: string;
  specialInstructions: string;
  estimatedTotal: string;
}

const SHEET_NAME = "Orders";
const RECORD_KEYS: (keyof OrderRecord)[] = [
  "submittedAt", "reference", "name", "phone", "email", "facebook",
  "eventType", "guests", "deliveryDate", "deliveryTime", "address",
  "packageName", "addOns", "paymentMethod", "specialInstructions", "estimatedTotal",
];
const HEADER_ROW = [
  "Submitted At", "Reference", "Name", "Phone", "Email", "Facebook",
  "Event Type", "Guests", "Delivery Date", "Delivery Time", "Address",
  "Package", "Add-ons", "Payment Method", "Special Instructions", "Estimated Total (PHP)",
];

let cachedClient: JWT | null | undefined;

/**
 * Service-account JWT client (OAuth 2.0 client-credentials-style grant —
 * no interactive consent, no refresh-token storage needed). Returns null
 * if the credentials aren't configured, so every caller degrades safely.
 */
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
    // Env vars store the PEM key with literal "\n" sequences — unescape them.
    key: rawKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return cachedClient;
}

/** Authenticated fetch against the Sheets API v4 for our one spreadsheet. Null if unconfigured. */
async function sheetsFetch(path: string, init?: RequestInit): Promise<Response | null> {
  const client = getAuthClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!client || !spreadsheetId) return null;

  const { token } = await client.getAccessToken();
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

export interface SheetsConnectionStatus {
  configured: boolean;
  connected: boolean;
  error?: string;
}

/**
 * Live check used by the admin dashboard to show whether the Google Sheets
 * integration is actually working, rather than leaving you to guess from
 * an empty orders table (which looks the same whether nothing's connected
 * or there just aren't any orders yet).
 */
export async function checkGoogleSheetsConnection(): Promise<SheetsConnectionStatus> {
  const missing = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY", "GOOGLE_SHEETS_SPREADSHEET_ID"]
    .filter((key) => !process.env[key]);
  if (missing.length > 0) {
    return { configured: false, connected: false, error: `Missing: ${missing.join(", ")}` };
  }

  try {
    const res = await sheetsFetch(`/values/${SHEET_NAME}!A1:A1`);
    if (!res) {
      return { configured: false, connected: false, error: "Not configured." };
    }
    if (res.ok) {
      return { configured: true, connected: true };
    }
    const body = await res.text();
    return {
      configured: true,
      connected: false,
      error: `Sheets API returned ${res.status}${res.status === 403 ? " (permission denied — has the sheet been shared with the service account email as Editor?)" : ""}${res.status === 404 ? " (spreadsheet not found — check GOOGLE_SHEETS_SPREADSHEET_ID)" : ""}: ${body.slice(0, 300)}`,
    };
  } catch (err) {
    return {
      configured: true,
      connected: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Appends a submitted order as a row in the "Orders" sheet (writing the
 * header row first if the sheet is empty). No-ops safely if
 * GOOGLE_SERVICE_ACCOUNT_EMAIL / _PRIVATE_KEY / GOOGLE_SHEETS_SPREADSHEET_ID
 * aren't all set — see docs/08-Google-Sheets-Setup.md.
 */
export async function appendOrderToGoogleSheet(order: OrderInput, summary: OrderSummary) {
  try {
    const headerCheck = await sheetsFetch(`/values/${SHEET_NAME}!A1:A1`);
    if (!headerCheck) return; // not configured

    if (headerCheck.ok) {
      const data = (await headerCheck.json()) as { values?: unknown[] };
      if (!data.values || data.values.length === 0) {
        await sheetsFetch(`/values/${SHEET_NAME}!A1:P1?valueInputOption=RAW`, {
          method: "PUT",
          body: JSON.stringify({ values: [HEADER_ROW] }),
        });
      }
    }

    const row = [
      new Date().toISOString(),
      summary.reference,
      order.name,
      order.phone,
      order.email ?? "",
      order.facebook ?? "",
      order.eventType,
      order.guests,
      order.deliveryDate,
      order.deliveryTime,
      order.address,
      summary.packageName,
      summary.addOns.map((a) => a.name).join(", "),
      order.paymentMethod,
      order.specialInstructions ?? "",
      summary.estimatedTotal ?? "",
    ];

    const res = await sheetsFetch(`/values/${SHEET_NAME}!A:P:append?valueInputOption=USER_ENTERED`, {
      method: "POST",
      body: JSON.stringify({ values: [row] }),
    });
    if (res && !res.ok) {
      console.error("[appendOrderToGoogleSheet] non-OK response:", res.status, await res.text());
    }
  } catch (err) {
    // Log server-side; never block the customer's order over a sheet write.
    console.error("[appendOrderToGoogleSheet] failed:", err);
  }
}

/**
 * Reads all order rows back from the sheet for the admin dashboard.
 * Returns an empty array if unconfigured or unreachable — the dashboard
 * renders an empty state rather than crash.
 */
export async function fetchOrdersFromGoogleSheet(): Promise<OrderRecord[]> {
  try {
    const res = await sheetsFetch(`/values/${SHEET_NAME}!A2:P`);
    if (!res) return [];
    if (!res.ok) {
      console.error("[fetchOrdersFromGoogleSheet] non-OK response:", res.status, await res.text());
      return [];
    }

    const data = (await res.json()) as { values?: string[][] };
    const rows = data.values ?? [];

    return rows.map((row) => {
      const record = {} as OrderRecord;
      RECORD_KEYS.forEach((key, i) => {
        record[key] = row[i] ?? "";
      });
      return record;
    });
  } catch (err) {
    console.error("[fetchOrdersFromGoogleSheet] failed:", err);
    return [];
  }
}
