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

// Figtree carries the whole site: bold/extra-bold for headings, dish names and
// prices, regular for body and UI. One professional family, one download.
const fontSans = localFont({
  src: "./fonts/figtree-latin-wght-normal.woff2",
  weight: "300 900",
  variable: "--font-sans",
  display: "swap",
  // No auto Arial fallback here: it would sit between fontSans and fontSansExt
  // in the stack and win for ₱. fontSansExt keeps its own fallback instead.
  adjustFontFallback: false,
});

// Latin Extended half of Figtree — carries the peso sign (₱, U+20B1), which
// the Latin file lacks. Listed after fontSans in the stack, so the browser
// only uses it for glyphs the Latin file doesn't have.
const fontSansExt = localFont({
  src: "./fonts/figtree-latin-ext-wght-normal.woff2",
  weight: "300 900",
  variable: "--font-sans-ext",
  display: "swap",
});

// Manrope: geometric numerals for prices — crisp, even figures that read as
// premium retail pricing. Numbers only; the ₱ stays in Figtree.
const fontPrice = localFont({
  src: "./fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-price",
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
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
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
    images: [
      {
        url: siteConfig.brand.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.brand.ogImage],
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
      className={`${fontSans.variable} ${fontSansExt.variable} ${fontPrice.variable}`}
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
