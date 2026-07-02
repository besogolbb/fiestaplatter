import Script from "next/script";

/**
 * Applies the saved theme before hydration to avoid a flash of the wrong
 * theme. Default is light — the `dark` class is only added when the user
 * has explicitly toggled dark mode before (persisted in localStorage).
 */
const THEME_INIT = `(function(){try{var t=localStorage.getItem('fp-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export function ThemeScript() {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- this IS the root layout; the rule doesn't recognize App Router's root layout.tsx.
    <Script id="theme-init" strategy="beforeInteractive">
      {THEME_INIT}
    </Script>
  );
}
