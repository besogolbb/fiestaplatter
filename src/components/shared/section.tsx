import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
  containerClassName?: string;
  /** Remove the default max-width container. */
  bleed?: boolean;
}

/** Consistent vertical rhythm + centered container for every funnel block. */
export function Section({
  as: Tag = "section",
  className,
  containerClassName,
  bleed = false,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag className={cn("py-14 sm:py-20", className)} {...props}>
      {bleed ? children : <div className={cn("container", containerClassName)}>{children}</div>}
    </Tag>
  );
}
