import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { LegalContent } from "@/components/shared/legal-content";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, mailtoLink } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: `The terms and conditions for ordering party trays and catering from ${siteConfig.name}.`,
  path: "/terms",
});

const updated = "July 1, 2026";

export default function TermsPage() {
  const { ordering } = siteConfig;
  return (
    <>
      <PageHero
        title="Terms of Service"
        description={`Last updated: ${updated}`}
        crumbs={[{ name: "Terms of Service", path: "/terms" }]}
      />
      <Section className="bg-cream">
        <LegalContent>
          <p>
            These Terms of Service govern your use of the {siteConfig.name} website and the
            ordering of our products. By placing an order you agree to these terms.
          </p>

          <h2>Orders &amp; Reservations</h2>
          <ul>
            <li>
              Orders are considered confirmed only after we acknowledge them and the required
              down payment is received.
            </li>
            <li>
              Please book at least {ordering.minLeadTimeHours} hours in advance. Peak dates
              (fiestas, Christmas, New Year) may require earlier booking.
            </li>
            <li>
              Prices shown are in Philippine Peso and may change without prior notice, though
              confirmed orders honor the price at the time of confirmation.
            </li>
          </ul>

          <h2>Payments</h2>
          <ul>
            <li>We accept {ordering.paymentMethods.join(", ")}.</li>
            <li>{ordering.downpaymentNote} The balance is settled upon delivery.</li>
          </ul>

          <h2>Delivery</h2>
          <ul>
            <li>
              We deliver within {siteConfig.location.serviceArea}. {ordering.deliveryNote}
            </li>
            <li>
              Delivery times are scheduled in good faith; conditions such as traffic or
              weather may cause minor adjustments, which we will communicate promptly.
            </li>
          </ul>

          <h2>Cancellations &amp; Rescheduling</h2>
          <ul>
            <li>
              You may reschedule or cancel at least 24 hours before your delivery date.
            </li>
            <li>
              Cancellations within 24 hours may forfeit the down payment, as ingredients are
              already prepared.
            </li>
          </ul>

          <h2>Food Quality &amp; Allergies</h2>
          <p>
            Our trays are freshly prepared and best enjoyed on the delivery date. If you have
            allergies or dietary requirements, please tell us in the order&apos;s special
            instructions so we can advise you. Our kitchen handles common allergens.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Email <a href={mailtoLink}>{siteConfig.contact.email}</a>{" "}
            or call {siteConfig.contact.phoneDisplay}.
          </p>
        </LegalContent>
      </Section>
    </>
  );
}
