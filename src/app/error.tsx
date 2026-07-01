"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
        <AlertTriangle className="h-8 w-8" aria-hidden />
      </span>
      <h1 className="mt-6 font-display text-2xl font-extrabold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-foreground/60">
        Sorry, an unexpected error occurred. Please try again — or reach us directly and
        we&apos;ll take your order right away.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="h-4 w-4" /> Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
