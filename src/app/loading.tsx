import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-3 text-brand">
        <Loader2 className="h-9 w-9 animate-spin" aria-hidden />
        <p className="text-sm font-medium text-foreground/60">Preparing your feast…</p>
      </div>
    </div>
  );
}
