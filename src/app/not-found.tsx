import Link from "next/link";
import { Home, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-warm px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
        <UtensilsCrossed className="h-8 w-8" aria-hidden />
      </span>
      <p className="mt-6 font-display text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-md text-foreground/60">
        The page you&apos;re looking for has moved or doesn&apos;t exist. Let&apos;s get you
        back to the good stuff.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" /> Back to home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/menu">Browse the menu</Link>
        </Button>
      </div>
    </div>
  );
}
