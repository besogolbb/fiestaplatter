import Link from "next/link";
import { CheckCircle2, MessageCircle, Home, Phone } from "lucide-react";
import type { OrderSummary } from "@/lib/order-format";
import { orderToMessengerText } from "@/lib/order-format";
import { messengerLink, telLink, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function OrderSuccess({ summary }: { summary: OrderSummary }) {
  const messenger = messengerLink(orderToMessengerText(summary));

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-lg sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-9 w-9" aria-hidden />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold text-foreground sm:text-3xl">
          Order Received! 🎉
        </h1>
        <p className="mt-2 text-foreground/70">
          Thank you, <strong>{summary.lines[0]?.value}</strong>! Your order reference is{" "}
          <strong className="text-brand">{summary.reference}</strong>.
        </p>
        <p className="mt-1 text-sm text-foreground/60">
          One last step — tap below to confirm on Messenger so we can lock in your slot and
          finalize your {siteConfig.ordering.downpaymentNote.toLowerCase()}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-[#0084FF] hover:bg-[#006fd6]">
            <a href={messenger} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" /> Confirm on Messenger
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={telLink}>
              <Phone className="h-5 w-5" /> Call to Confirm
            </a>
          </Button>
        </div>

        {/* Summary */}
        <div className="mt-8 rounded-2xl bg-background p-5 text-left">
          <h2 className="font-display text-base font-bold text-foreground">Order Summary</h2>
          <dl className="mt-3 divide-y divide-border">
            {summary.lines.map((line) => (
              <div key={line.label} className="flex justify-between gap-4 py-2 text-sm">
                <dt className="shrink-0 text-foreground/50">{line.label}</dt>
                <dd className="text-right font-medium text-foreground">{line.value}</dd>
              </div>
            ))}
            {summary.estimatedTotal !== null ? (
              <div className="flex justify-between gap-4 pt-3 text-base">
                <dt className="font-bold text-foreground">Estimated Total</dt>
                <dd className="font-display font-extrabold text-brand">
                  {formatPrice(summary.estimatedTotal)}
                </dd>
              </div>
            ) : null}
          </dl>
          <p className="mt-3 text-xs text-foreground/50">
            This is an estimate. We&apos;ll confirm the final total (including any delivery
            fee) when we process your order.
          </p>
        </div>

        <Button asChild variant="ghost" className="mt-6">
          <Link href="/">
            <Home className="h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
