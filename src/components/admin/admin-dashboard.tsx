"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  TrendingUp,
  Package,
  CalendarDays,
  Award,
  Plus,
  Trash2,
  Loader2,
  Truck,
  Eye,
  type LucideIcon,
} from "lucide-react";
import type { OrderRecord } from "@/lib/google-sheets";
import { deleteOrderAction, setOrderDeliveredAction } from "@/app/admin/(dashboard)/actions";
import { AddOrderModal } from "@/components/admin/add-order-modal";
import { OrderDetailModal } from "@/components/admin/order-detail-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseTotal(v: string): number {
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatPHP(n: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Color-codes the Status badge — see docs/10-AI-Sales-Agent-System-Prompt.md Section 4g for the lifecycle. */
function statusBadgeClass(status: string): string {
  switch (status) {
    case "Confirmed":
    case "Delivered":
      return "border-green-600/30 bg-green-600/10 text-green-700 dark:text-green-400";
    case "Payment Submitted":
    case "Ongoing":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";
    case "Cancelled":
      return "border-destructive/30 bg-destructive/10 text-destructive";
    default:
      // "Created" and anything unrecognized
      return "border-border bg-muted/50 text-foreground/60";
  }
}

export function AdminDashboard({ orders }: { orders: OrderRecord[] }) {
  const now = new Date();
  const router = useRouter();
  const [monthCursor, setMonthCursor] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<OrderRecord | null>(null);
  const [deletingRef, setDeletingRef] = useState<string | null>(null);
  const [togglingRef, setTogglingRef] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete(reference: string) {
    if (!window.confirm(`Delete order ${reference}? This cannot be undone.`)) return;
    setDeletingRef(reference);
    startTransition(async () => {
      const result = await deleteOrderAction(reference);
      if (result.success) {
        toast.success(`Order ${reference} deleted.`);
        router.refresh();
      } else {
        toast.error(result.error ?? "Could not delete the order.");
      }
      setDeletingRef(null);
    });
  }

  function handleToggleDelivered(reference: string, delivered: boolean) {
    setTogglingRef(reference);
    startTransition(async () => {
      const result = await setOrderDeliveredAction(reference, delivered);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.error ?? "Could not update delivery status.");
      }
      setTogglingRef(null);
    });
  }

  const totalOrders = orders.length;
  // Only delivered orders count as actual sales — everything else is still
  // just a reservation until it's marked delivered.
  const deliveredOrders = orders.filter((o) => o.delivered === "Yes");
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + parseTotal(o.estimatedTotal), 0);
  // Partial figure — only reflects add-ons with known cost data; bundles/packages
  // have no cost breakdown, so this understates true margin on package orders.
  const totalProfit = deliveredOrders.reduce((sum, o) => sum + parseTotal(o.estimatedProfit), 0);
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthCount = orders.filter((o) => o.deliveryDate?.startsWith(thisMonthKey)).length;

  const topPackage = useMemo(() => {
    const counts = new Map<string, number>();
    orders.forEach((o) => {
      if (!o.packageName) return;
      counts.set(o.packageName, (counts.get(o.packageName) ?? 0) + 1);
    });
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? "—";
  }, [orders]);

  const ordersByDay = useMemo(() => {
    const map = new Map<string, OrderRecord[]>();
    orders.forEach((o) => {
      if (!o.deliveryDate) return;
      const arr = map.get(o.deliveryDate) ?? [];
      arr.push(o);
      map.set(o.deliveryDate, arr);
    });
    return map;
  }, [orders]);

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay();

  const cells: (string | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }

  const filtered = useMemo(() => {
    let rows = orders;
    if (selectedDate) rows = rows.filter((o) => o.deliveryDate === selectedDate);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter(
        (o) =>
          o.name?.toLowerCase().includes(q) ||
          o.phone?.toLowerCase().includes(q) ||
          o.reference?.toLowerCase().includes(q) ||
          o.packageName?.toLowerCase().includes(q),
      );
    }
    return [...rows].sort((a, b) => (b.submittedAt || "").localeCompare(a.submittedAt || ""));
  }, [orders, selectedDate, query]);

  return (
    <div className="space-y-6">
      {showAddModal ? <AddOrderModal onClose={() => setShowAddModal(false)} /> : null}
      {viewingOrder ? (
        <OrderDetailModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
      ) : null}

      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" /> Add Order
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={Package} label="Total Orders" value={String(totalOrders)} />
        <StatCard icon={TrendingUp} label="Total Sales" value={formatPHP(totalRevenue)} />
        <StatCard icon={TrendingUp} label="Net Profit" value={formatPHP(totalProfit)} />
        <StatCard icon={CalendarDays} label="This Month" value={String(thisMonthCount)} />
        <StatCard icon={Award} label="Top Package" value={topPackage} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Calendar */}
        <div className="h-fit rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonthCursor(new Date(year, month - 1, 1))}
              className="rounded-lg p-1.5 text-foreground/60 hover:bg-muted hover:text-foreground"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="font-display text-sm font-bold text-foreground">
              {monthCursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            <button
              type="button"
              onClick={() => setMonthCursor(new Date(year, month + 1, 1))}
              className="rounded-lg p-1.5 text-foreground/60 hover:bg-muted hover:text-foreground"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-foreground/50">
            {WEEKDAYS.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((dateStr, i) => {
              if (!dateStr) return <div key={`blank-${i}`} />;
              const dayOrders = ordersByDay.get(dateStr) ?? [];
              const isSelected = selectedDate === dateStr;
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-xs transition-colors",
                    isSelected
                      ? "bg-brand text-white"
                      : dayOrders.length
                        ? "bg-brand/10 font-semibold text-brand hover:bg-brand/20"
                        : "text-foreground/70 hover:bg-muted",
                  )}
                >
                  <span>{Number(dateStr.slice(-2))}</span>
                  {dayOrders.length ? <span className="text-[10px] leading-none">{dayOrders.length}</span> : null}
                </button>
              );
            })}
          </div>

          {selectedDate ? (
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="mt-3 text-xs font-semibold text-brand underline underline-offset-2"
            >
              Clear date filter ({selectedDate})
            </button>
          ) : (
            <p className="mt-3 text-xs text-foreground/50">Tap a date to filter orders by delivery day.</p>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border p-4">
            <Search className="h-4 w-4 shrink-0 text-foreground/40" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, reference, package…"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/40"
            />
            <span className="shrink-0 text-xs text-foreground/50">
              {filtered.length} of {orders.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-foreground/50">
                  <th className="px-4 py-2.5 font-semibold">Reference</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold">Customer</th>
                  <th className="px-4 py-2.5 font-semibold">Event</th>
                  <th className="px-4 py-2.5 font-semibold">Delivery</th>
                  <th className="px-4 py-2.5 font-semibold">Package</th>
                  <th className="px-4 py-2.5 font-semibold">Payment</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Total</th>
                  <th className="px-4 py-2.5 text-center font-semibold">Delivered</th>
                  <th className="px-4 py-2.5 text-right font-semibold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-foreground/50">
                      No orders {selectedDate || query ? "match your filters." : "yet."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((o) => (
                    <tr
                      key={`${o.reference}-${o.submittedAt}`}
                      className="border-b border-border last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-4 py-2.5 font-mono text-xs text-foreground/70">{o.reference}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                            statusBadgeClass(o.status),
                          )}
                        >
                          {o.status || "Created"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-foreground">{o.name}</p>
                        <p className="text-xs text-foreground/50">{o.phone}</p>
                      </td>
                      <td className="px-4 py-2.5 text-foreground/80">
                        {o.eventType}
                        {o.guests ? ` · ${o.guests} pax` : ""}
                      </td>
                      <td className="px-4 py-2.5 text-foreground/80">
                        {o.deliveryDate} {o.deliveryTime}
                      </td>
                      <td className="px-4 py-2.5 text-foreground/80">
                        {o.packageName}
                        {o.addOns ? ` +${o.addOns.split(",").filter(Boolean).length}` : ""}
                      </td>
                      <td className="px-4 py-2.5 text-foreground/80">{o.paymentMethod}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-brand">
                        {formatPHP(parseTotal(o.estimatedTotal))}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleDelivered(o.reference, o.delivered !== "Yes")}
                          disabled={pending && togglingRef === o.reference}
                          aria-pressed={o.delivered === "Yes"}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50",
                            o.delivered === "Yes"
                              ? "border-green-600/30 bg-green-600/10 text-green-700 hover:bg-green-600/20 dark:text-green-400"
                              : "border-border text-foreground/50 hover:border-brand/40 hover:text-brand",
                          )}
                        >
                          {pending && togglingRef === o.reference ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Truck className="h-3.5 w-3.5" />
                          )}
                          {o.delivered === "Yes" ? "Delivered" : "Mark delivered"}
                        </button>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingOrder(o)}
                            aria-label={`View order ${o.reference}`}
                            className="rounded-lg p-1.5 text-foreground/40 transition-colors hover:bg-brand/10 hover:text-brand"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(o.reference)}
                            disabled={pending && deletingRef === o.reference}
                            aria-label={`Delete order ${o.reference}`}
                            className="rounded-lg p-1.5 text-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                          >
                            {pending && deletingRef === o.reference ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <Icon className="h-5 w-5 text-brand" aria-hidden />
      <p className="mt-2 truncate font-display text-xl font-extrabold text-foreground">{value}</p>
      <p className="text-xs font-medium text-foreground/50">{label}</p>
    </div>
  );
}
