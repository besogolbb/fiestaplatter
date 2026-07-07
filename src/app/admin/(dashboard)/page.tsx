import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { fetchOrdersFromGoogleSheet, checkGoogleSheetsConnection } from "@/lib/google-sheets";
import { checkGoogleCalendarConnection } from "@/lib/google-calendar";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

// Always fetch fresh order data per request — must not be statically cached
// (and won't reliably self-detect as dynamic during a build where
// GOOGLE_SHEETS_WEBHOOK_URL happens to be unset).
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [orders, connection, calendarConnection] = await Promise.all([
    fetchOrdersFromGoogleSheet(),
    checkGoogleSheetsConnection(),
    checkGoogleCalendarConnection(),
  ]);

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-foreground">Orders</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Live from your Google Sheet — refresh this page for the latest submissions.
      </p>

      {connection.connected ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-600/30 bg-green-600/10 px-4 py-2.5 text-sm font-medium text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Connected to Google Sheets
        </div>
      ) : (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Not connected to Google Sheets{connection.error ? ` — ${connection.error}` : ""}. Orders are still
            being accepted normally on the site; they just aren&apos;t being logged to the sheet right now. See{" "}
            <code className="rounded bg-destructive/10 px-1 py-0.5">docs/08-Google-Sheets-Setup.md</code>.
          </span>
        </div>
      )}

      {calendarConnection.connected ? (
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-green-600/30 bg-green-600/10 px-4 py-2.5 text-sm font-medium text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Connected to Google Calendar
        </div>
      ) : calendarConnection.configured ? (
        <div className="mt-2 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Not connected to Google Calendar{calendarConnection.error ? ` — ${calendarConnection.error}` : ""}.
            Orders still go through fine; calendar events just aren&apos;t being created right now. See{" "}
            <code className="rounded bg-destructive/10 px-1 py-0.5">docs/09-Google-Calendar-Setup.md</code>.
          </span>
        </div>
      ) : (
        <div className="mt-2 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-700 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Google Calendar isn&apos;t set up yet — orders won&apos;t create calendar events or reminders until
            it is. See{" "}
            <code className="rounded bg-amber-500/10 px-1 py-0.5">docs/09-Google-Calendar-Setup.md</code>.
          </span>
        </div>
      )}

      <div className="mt-6">
        <AdminDashboard orders={orders} />
      </div>
    </>
  );
}
