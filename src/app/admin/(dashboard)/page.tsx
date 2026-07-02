import type { Metadata } from "next";
import { fetchOrdersFromGoogleSheet } from "@/lib/google-sheets";
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
  const orders = await fetchOrdersFromGoogleSheet();
  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-foreground">Orders</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Live from your Google Sheet — refresh this page for the latest submissions.
      </p>
      <div className="mt-6">
        <AdminDashboard orders={orders} />
      </div>
    </>
  );
}
