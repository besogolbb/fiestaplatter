"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** Visually hide the title (it still names the dialog). */
  hideTitle?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Bottom sheet on phones, right-hand drawer from `md` up. Built on the native
 * <dialog> in modal mode, so focus trapping, Esc to close, the inert page
 * behind it and focus return come from the browser rather than custom code.
 */
export function Sheet({ open, onClose, title, hideTitle, children, footer, className }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      const root = document.documentElement;
      const prev = root.style.overflow;
      root.style.overflow = "hidden";
      return () => {
        root.style.overflow = prev;
      };
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // A click that lands on the <dialog> itself is a click on the backdrop.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "fixed inset-x-0 bottom-0 top-auto m-0 flex border-0 max-h-[88dvh] w-full max-w-none flex-col overflow-hidden rounded-t-[1.75rem] bg-card p-0 text-foreground shadow-[0_-12px_40px_rgba(20,12,6,0.25)] backdrop:bg-[rgb(20_12_6/0.55)]",
        "md:inset-y-0 md:left-auto md:right-0 md:h-dvh md:max-h-dvh md:w-[440px] md:rounded-none md:rounded-l-[1.75rem]",
        "motion-safe:animate-in motion-safe:slide-in-from-bottom motion-safe:duration-300 md:motion-safe:slide-in-from-right md:motion-safe:slide-in-from-bottom-0",
        "[&:not([open])]:hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 pb-3 pt-4">
        <span aria-hidden className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-foreground/15 md:hidden" />
        <h2
          id={titleId}
          className={cn("font-display text-xl font-extrabold leading-tight", hideTitle && "sr-only")}
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      {footer ? (
        <div className="border-t border-border bg-card px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          {footer}
        </div>
      ) : null}
    </dialog>
  );
}
