import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/shared/json-ld";
import { localBusinessSchema, websiteSchema } from "@/lib/structured-data";
import { Analytics } from "@/components/shared/analytics";
import { ThemeScript } from "@/components/shared/theme-script";
import { CartProvider } from "@/components/cart/cart-provider";

// Fonts are self-hosted (src/app/fonts, OFL-licensed, from Fontsource) so
// builds never depend on reaching Google Fonts — the Docker build on the VPS
// failed when that fetch did. Latin subset, variable weight axis.

// Figtree: plain, legible UI voice for forms, labels and body copy.
const fontSans = localFont({
  src: "./fonts/figtree-latin-wght-normal.woff2",
  weight: "300 900",
  variable: "--font-sans",
  display: "swap",
});

// Baloo 2: round, warm display face for dish names, prices and headings —
// the hand-lettered fiesta-sign register, kept off body text.
const fontDisplay = localFont({
  src: "./fonts/baloo-2-latin-wght-normal.woff2",
  weight: "400 800",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "party trays",
    "Filipino catering",
    "bilao",
    "birthday food",
    "office catering",
    "palabok",
    "pancit",
    "lumpia",
    "party food Philippines",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "food",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF9F5" },
    { media: "(prefers-color-scheme: dark)", color: "#161310" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-PH"
      className={`${fontSans.variable} ${fontDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans">
        <CartProvider>{children}</CartProvider>
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{ className: "font-sans", duration: 5000 }}
        />
        <JsonLd id="ld-business" data={localBusinessSchema()} />
        <JsonLd id="ld-website" data={websiteSchema()} />
        <Analytics />
      </body>
    </html>
  );
}
