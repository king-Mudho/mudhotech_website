import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${company.shortName} collects, uses, stores, and protects your personal information.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lead="How we collect, use, and protect your information."
        hueShift={10}
      />

      <Section>
        <div className="max-w-3xl mx-auto prose-custom">
          <p>
            This policy explains how {company.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal information
            collected through this website. It reflects the systems actually in use on this site.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect only what you submit through our forms: your name, email address, phone number (optional),
            business name (optional), and the content of your message, quote request, or service request. If you
            subscribe to our newsletter, we store your email address.
          </p>

          <h2>How We Use It</h2>
          <p>
            Submitted information is used solely to respond to your enquiry, prepare quotations, deliver services you
            request, and — if you subscribed — send occasional updates. We do not sell your information.
          </p>

          <h2>Cookies</h2>
          <p>
            We use a first-party cookie to record your cookie-consent choice. Analytics cookies (Google Analytics 4)
            are loaded <strong>only if you accept</strong>. If you decline, analytics never loads. You can change your
            choice by clearing your cookies for this site.
          </p>

          <h2>Third Parties</h2>
          <p>
            Form submissions are stored on our application server and email notifications are delivered via
            <strong> Resend</strong>, a transactional email provider. If you accept cookies, usage analytics are
            processed by <strong>Google Analytics 4</strong>. These providers process data on our behalf under their
            own privacy terms.
          </p>

          <h2>Data Security</h2>
          <p>
            Submissions are transmitted over HTTPS and stored on access-controlled systems. Administrative access to
            lead data requires authentication and is restricted to authorised staff.
          </p>

          <h2>Data Retention</h2>
          <p>
            Enquiry and quote records are retained for as long as needed to serve you and to keep reasonable business
            records. You may request deletion at any time.
          </p>

          <h2>Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of the personal information we hold about you, and
            you may unsubscribe from our newsletter at any time. Contact us using the details below.
          </p>

          <h2>Children</h2>
          <p>
            This site is intended for business audiences and is not directed at children. We do not knowingly collect
            information from children.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy as our services change. Material changes will be reflected on this page.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy: <a href={`mailto:${company.contact.email}`}>{company.contact.email}</a> or{" "}
            {company.contact.phone}. Registered office: {company.registeredOffice}.
          </p>
        </div>
      </Section>
    </>
  );
}
