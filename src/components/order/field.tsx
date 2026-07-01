import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/** Consistent label + hint + error wrapper for a single form control. */
export function Field({
  label,
  htmlFor,
  error,
  required,
  hint,
  className,
  children,
}: FieldProps) {
  const errorId = `${htmlFor}-error`;
  const hintId = `${htmlFor}-hint`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="text-brand" aria-hidden>
            {" "}
            *
          </span>
        ) : (
          <span className="ml-1 text-xs font-normal text-ink/40">(optional)</span>
        )}
      </Label>
      {hint ? (
        <p id={hintId} className="text-xs text-ink/50">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
