import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { LegalContent } from "@/components/shared/legal-content";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, mailtoLink } from "@/config/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Privacy Policy",
    description: `How ${siteConfig.name} collects, uses and protects your personal information when you order party trays or contact us.`,
    path: "/privacy",
  }),
  robots: { index: true, follow: true },
};

const updated = "July 1, 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        description={`Last updated: ${updated}`}
        crumbs={[{ name: "Privacy Policy", path: "/privacy" }]}
      />
      <Section className="bg-cream">
        <LegalContent>
          <p>
            {siteConfig.legalName} (&quot;we&quot;, &quot;us&quot;) respects your privacy.
            This policy explains what information we collect when you use our website or
            place an order, and how we use it. By using this site you agree to this policy.
          </p>

          <h2>Information We Collect</h2>
          <ul>
            <li>
              <strong>Order details</strong> you provide: name, phone number, optional email
              and Facebook profile, delivery address, delivery date and time, event type,
              estimated guests, selected package and special instructions.
            </li>
            <li>
              <strong>Communications</strong> you send us via the order form, Messenger,
              email, or phone.
            </li>
            <li>
              <strong>Basic usage data</strong> (such as pages viewed) if analytics tools are
              enabled, used only to improve the website.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To process, confirm and deliver your order.</li>
            <li>To contact you about your reservation, payment and delivery schedule.</li>
            <li>To respond to inquiries and provide customer support.</li>
            <li>To improve our menu, service and website experience.</li>
          </ul>

          <h2>Sharing of Information</h2>
          <p>
            We do not sell your personal information. We only share what is necessary with
            trusted providers who help us operate — for example, delivery riders and payment
            or messaging services — and only to fulfill your order.
          </p>

          <h2>Data Retention</h2>
          <p>
            We keep order information only as long as needed to serve you and to meet legal
            or accounting requirements, after which it is securely deleted.
          </p>

          <h2>Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal
            information at any time by contacting us. We comply with the Philippine Data
            Privacy Act of 2012 (RA 10173).
          </p>

          <h2>Contact Us</h2>
          <p>
            Questions about this policy? Email us at{" "}
            <a href={mailtoLink}>{siteConfig.contact.email}</a> or call{" "}
            {siteConfig.contact.phoneDisplay}.
          </p>
        </LegalContent>
      </Section>
    </>
  );
}
