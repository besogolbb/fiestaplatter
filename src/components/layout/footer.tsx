import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Clock } from "lucide-react";
import { footerNav } from "@/config/nav";
import { siteConfig, telLink, mailtoLink, messengerLink } from "@/config/site";
import { Logo } from "@/components/layout/logo";
import { StarRating } from "@/components/shared/star-rating";

export function Footer() {
  const { contact, location, hours, stats } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#0d0b0a] text-white/80">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {siteConfig.description}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <StarRating rating={stats.ratingValue} />
              <span className="text-sm text-white/70">
                {stats.ratingValue} · {stats.ratingCount} reviews
              </span>
            </div>
            <div className="mt-5 flex gap-3">
              {contact.facebookUrl ? (
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-card/10 transition-colors hover:bg-brand"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              ) : null}
              {contact.instagramUrl ? (
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-card/10 transition-colors hover:bg-brand"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Link columns */}
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Contact strip */}
        <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <a href={telLink} className="flex items-start gap-3 text-sm hover:text-white">
            <Phone className="mt-0.5 h-5 w-5 text-accent" />
            <span>
              <span className="block text-white/50">Call / Text</span>
              {contact.phoneDisplay}
            </span>
          </a>
          <a
            href={messengerLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 text-sm hover:text-white"
          >
            <Facebook className="mt-0.5 h-5 w-5 text-accent" />
            <span>
              <span className="block text-white/50">Messenger</span>
              Chat with us
            </span>
          </a>
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="mt-0.5 h-5 w-5 text-accent" />
            <span>
              <span className="block text-white/50">Service Area</span>
              {location.serviceArea}
            </span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Clock className="mt-0.5 h-5 w-5 text-accent" />
            <span>
              <span className="block text-white/50">Hours</span>
              {hours.display}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <a href={mailtoLink} className="inline-flex items-center gap-1 hover:text-white">
              <Mail className="h-3.5 w-3.5" /> {contact.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
