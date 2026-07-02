import { siteConfig } from "@/config/site";
import { menu } from "@/data/menu";
import { faqs } from "@/data/faqs";
import { absoluteUrl } from "@/lib/utils";
import type { FaqItem } from "@/types";

/** FoodEstablishment / LocalBusiness — rendered site-wide in the root layout. */
export function localBusinessSchema() {
  const { contact, location, hours } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: contact.phoneE164,
    email: contact.email,
    image: absoluteUrl("/opengraph-image"),
    servesCuisine: "Filipino",
    priceRange: "₱₱",
    address: {
      "@type": "PostalAddress",
      streetAddress: location.streetAddress,
      addressLocality: location.city,
      addressRegion: location.region,
      postalCode: location.postalCode,
      addressCountry: location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.latitude,
      longitude: location.longitude,
    },
    areaServed: location.serviceArea,
    openingHoursSpecification: hours.spec.map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: s.days,
      opens: s.opens,
      closes: s.closes,
    })),
    sameAs: [contact.facebookUrl, contact.instagramUrl, contact.tiktokUrl].filter(Boolean),
  };
}

/** Menu + MenuItem list for the /menu page. */
export function menuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${siteConfig.name} Menu`,
    url: absoluteUrl("/menu"),
    hasMenuSection: {
      "@type": "MenuSection",
      name: "Party Trays & Bilao",
      hasMenuItem: menu.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description,
        image: absoluteUrl(item.image),
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: siteConfig.ordering.currency,
          availability: "https://schema.org/InStock",
        },
      })),
    },
  };
}

/** FAQPage schema for the /faq page. */
export function faqSchema(items: FaqItem[] = faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** BreadcrumbList schema. */
export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** WebSite schema with SearchAction (helps sitelinks). */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}
