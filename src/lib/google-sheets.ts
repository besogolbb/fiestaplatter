import { JWT } from "google-auth-library";
import type { OrderInput } from "@/lib/order-schema";
import type { OrderSummary } from "@/lib/order-format";
import { generateReference } from "@/lib/order-format";

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
  /** "Yes" once marked delivered in /admin; blank/"No" otherwise. Only delivered orders count toward Total Sales. */
  delivered: string;
}

const SHEET_NAME = "Orders";
// Column range covering every field below, incl. the trailing Delivered
// column — kept in one place so append/header/read calls can't drift.
const LAST_COLUMN = "Q";
const RECORD_KEYS: (keyof OrderRecord)[] = [
  "submittedAt", "reference", "name", "phone", "email", "facebook",
  "eventType", "guests", "deliveryDate", "deliveryTime", "address",
  "packageName", "addOns", "paymentMethod", "specialInstructions", "estimatedTotal",
  "delivered",
];
const HEADER_ROW = [
  "Submitted At", "Reference", "Name", "Phone", "Email", "Facebook",
  "Event Type", "Guests", "Delivery Date", "Delivery Time", "Address",
  "Package", "Add-ons", "Payment Method", "Special Instructions", "Estimated Total (PHP)",
  "Delivered",
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

/** Writes the header row if the sheet is currently empty. */
async function ensureHeaderRow() {
  const headerCheck = await sheetsFetch(`/values/${SHEET_NAME}!A1:A1`);
  if (!headerCheck?.ok) return;
  const data = (await headerCheck.json()) as { values?: unknown[] };
  if (!data.values || data.values.length === 0) {
    await sheetsFetch(`/values/${SHEET_NAME}!A1:${LAST_COLUMN}1?valueInputOption=RAW`, {
      method: "PUT",
      body: JSON.stringify({ values: [HEADER_ROW] }),
    });
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
    const probe = await sheetsFetch(`/values/${SHEET_NAME}!A1:A1`);
    if (!probe) return; // not configured
    await ensureHeaderRow();

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
      summary.addOns.map((a) => (a.qty > 1 ? `${a.name} x${a.qty}` : a.name)).join(", "),
      order.paymentMethod,
      order.specialInstructions ?? "",
      summary.estimatedTotal ?? "",
      "No",
    ];

    const res = await sheetsFetch(`/values/${SHEET_NAME}!A:${LAST_COLUMN}:append?valueInputOption=USER_ENTERED`, {
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

export interface ManualOrderInput {
  name: string;
  phone: string;
  email?: string;
  facebook?: string;
  eventType: string;
  guests: string;
  deliveryDate: string;
  deliveryTime: string;
  address: string;
  packageName: string;
  addOns?: string;
  paymentMethod: string;
  specialInstructions?: string;
  estimatedTotal: string;
}

export interface ManualOrderResult {
  success: boolean;
  reference?: string;
  error?: string;
}

/**
 * Appends an order taken manually by the admin (e.g. a phone / Messenger
 * order) straight into the "Orders" sheet, bypassing the customer-facing
 * order form and its packageSlug/menu-slug validation entirely — the admin
 * can type any package or add-on description here.
 */
export async function appendManualOrder(input: ManualOrderInput): Promise<ManualOrderResult> {
  try {
    const probe = await sheetsFetch(`/values/${SHEET_NAME}!A1:A1`);
    if (!probe) return { success: false, error: "Google Sheets isn't configured." };
    await ensureHeaderRow();

    const reference = generateReference();
    const row = [
      new Date().toISOString(),
      reference,
      input.name,
      input.phone,
      input.email ?? "",
      input.facebook ?? "",
      input.eventType,
      input.guests,
      input.deliveryDate,
      input.deliveryTime,
      input.address,
      input.packageName,
      input.addOns ?? "",
      input.paymentMethod,
      input.specialInstructions ?? "",
      input.estimatedTotal,
      "No",
    ];

    const res = await sheetsFetch(`/values/${SHEET_NAME}!A:${LAST_COLUMN}:append?valueInputOption=USER_ENTERED`, {
      method: "POST",
      body: JSON.stringify({ values: [row] }),
    });
    if (!res || !res.ok) {
      const body = res ? await res.text() : "";
      console.error("[appendManualOrder] non-OK response:", res?.status, body);
      return { success: false, error: `Sheets API returned ${res?.status ?? "no response"}: ${body.slice(0, 200)}` };
    }
    return { success: true, reference };
  } catch (err) {
    console.error("[appendManualOrder] failed:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

let cachedOrdersSheetId: number | null | undefined;

/** Numeric sheetId (gid) of the "Orders" tab — needed for row-deletion requests. */
async function getOrdersSheetId(): Promise<number | null> {
  if (cachedOrdersSheetId !== undefined) return cachedOrdersSheetId;
  const res = await sheetsFetch(`?fields=sheets.properties`);
  if (!res || !res.ok) {
    cachedOrdersSheetId = null;
    return null;
  }
  const data = (await res.json()) as {
    sheets?: { properties: { sheetId: number; title: string } }[];
  };
  const sheet = data.sheets?.find((s) => s.properties.title === SHEET_NAME);
  cachedOrdersSheetId = sheet?.properties.sheetId ?? null;
  return cachedOrdersSheetId;
}

/**
 * Finds the 1-indexed sheet row number for an order reference (column B).
 * Looked up live each time since rows shift as others are added/removed.
 */
async function findOrderRowNumber(reference: string): Promise<number | null> {
  const res = await sheetsFetch(`/values/${SHEET_NAME}!B2:B`);
  if (!res || !res.ok) return null;
  const data = (await res.json()) as { values?: string[][] };
  const refs = (data.values ?? []).map((r) => r[0] ?? "");
  const index = refs.indexOf(reference);
  if (index === -1) return null;
  return index + 2; // +1 for the header row, +1 to convert 0-index to 1-index.
}

/**
 * Marks (or unmarks) an order as delivered — only delivered orders count
 * toward Total Sales on the admin dashboard.
 */
export async function setOrderDelivered(reference: string, delivered: boolean): Promise<ManualOrderResult> {
  try {
    const rowNumber = await findOrderRowNumber(reference);
    if (rowNumber === null) return { success: false, error: "Order not found in the sheet." };

    const res = await sheetsFetch(`/values/${SHEET_NAME}!${LAST_COLUMN}${rowNumber}?valueInputOption=RAW`, {
      method: "PUT",
      body: JSON.stringify({ values: [[delivered ? "Yes" : "No"]] }),
    });
    if (!res || !res.ok) {
      const body = res ? await res.text() : "";
      return { success: false, error: `Sheets API returned ${res?.status ?? "no response"}: ${body.slice(0, 200)}` };
    }
    return { success: true, reference };
  } catch (err) {
    console.error("[setOrderDelivered] failed:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Deletes the row matching the given order reference from the "Orders"
 * sheet. Looks up the row position live (rows shift as others are
 * added/removed) rather than trusting a cached index.
 */
export async function deleteOrderByReference(reference: string): Promise<ManualOrderResult> {
  try {
    const sheetId = await getOrdersSheetId();
    if (sheetId === null) return { success: false, error: "Google Sheets isn't configured." };

    const rowNumber = await findOrderRowNumber(reference);
    if (rowNumber === null) return { success: false, error: "Order not found in the sheet (already deleted?)." };

    const startIndex = rowNumber - 1; // deleteDimension range is 0-indexed.
    const del = await sheetsFetch(`:batchUpdate`, {
      method: "POST",
      body: JSON.stringify({
        requests: [
          {
            deleteDimension: {
              range: { sheetId, dimension: "ROWS", startIndex, endIndex: startIndex + 1 },
            },
          },
        ],
      }),
    });
    if (!del || !del.ok) {
      const body = del ? await del.text() : "";
      return { success: false, error: `Sheets API returned ${del?.status ?? "no response"}: ${body.slice(0, 200)}` };
    }
    return { success: true, reference };
  } catch (err) {
    console.error("[deleteOrderByReference] failed:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Reads all order rows back from the sheet for the admin dashboard.
 * Returns an empty array if unconfigured or unreachable — the dashboard
 * renders an empty state rather than crash.
 */
export async function fetchOrdersFromGoogleSheet(): Promise<OrderRecord[]> {
  try {
    const res = await sheetsFetch(`/values/${SHEET_NAME}!A2:${LAST_COLUMN}`);
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
