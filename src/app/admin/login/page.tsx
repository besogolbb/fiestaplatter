import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAdmin } from "./actions";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-warm px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-xl">
        <Logo className="justify-center" />

        <div className="mt-6 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="mt-3 font-display text-lg font-extrabold text-foreground">Admin Sign In</h1>
          <p className="mt-1 text-sm text-foreground/60">Order records &amp; dashboard</p>
        </div>

        <form action={loginAdmin} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next ?? "/admin"} />
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <Input id="password" name="password" type="password" required autoFocus autoComplete="current-password" />
          </div>

          {error ? (
            <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              Incorrect password. Try again.
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
