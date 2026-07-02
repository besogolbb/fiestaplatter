import { LogOut } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { logoutAdmin } from "../login/actions";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-brand">
              Admin
            </span>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:border-brand/40 hover:text-brand"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </form>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
