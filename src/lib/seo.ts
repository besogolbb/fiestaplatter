import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  /** Absolute or root-relative OG image. Defaults to the site OG image. */
  image?: string;
}

/** Consistent per-page metadata (canonical, OpenGraph, Twitter). */
export function pageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
}: PageMetaOptions): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} · ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_PH",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${siteConfig.name}`,
      description,
      images: [image],
    },
  };
}
