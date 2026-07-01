import * as React from "react";

/** Consistent prose styling for legal pages without a Tailwind typography plugin. */
export function LegalContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 text-[15px] leading-relaxed text-ink/75 [&_a]:font-medium [&_a]:text-brand [&_a:hover]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:ml-1 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
      {children}
    </div>
  );
}
