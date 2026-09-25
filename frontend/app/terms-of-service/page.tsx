import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalPage } from "@/components/layout/LegalPage";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms governing services provided by ${company.name} — quotations, project agreements, payment, warranties, and support.`,
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Terms of Service" }]}
        eyebrow="Legal"
        title="Terms of Service"
        lead="The terms governing our services and engagements."
        hueShift={10}
      />

      {/* Date of the last change to the wording below, from git history. */}
      <LegalPage updated="2026-09-16">
        <p>
          These terms govern services provided by {company.name}. Engaging us for any service constitutes acceptance of
          these terms.
        </p>

        <h2>Services</h2>
        <p>
          We provide software development, web and mobile application development, cloud solutions, ICT consulting,
          software installation and support, hardware installation and repair, and networking services.
        </p>

        <h2>Quotations</h2>
        <p>
          Quotations are estimates based on the scope described at the time of enquiry. They remain valid for 30 days
          unless stated otherwise. Changes to scope may change cost and timeline; we will confirm any such change with
          you before proceeding.
        </p>

        <h2>Project Agreements</h2>
        <p>
          Larger engagements are governed by a written agreement setting out scope, deliverables, timeline, acceptance
          criteria, and payment schedule. Where that agreement conflicts with these terms, the agreement prevails.
        </p>

        <h2>Payment</h2>
        <p>
          Payment terms are set out in each quotation or agreement. Development projects typically require a deposit
          before work begins, with the balance due on delivery or per an agreed milestone schedule.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          On full payment, ownership of custom-developed deliverables transfers to the client. Pre-existing tools,
          libraries, frameworks, and third-party components remain the property of their respective owners and are
          supplied under their own licences.
        </p>

        <h2>Client Responsibilities</h2>
        <p>
          You agree to provide timely access to information, systems, and personnel needed to deliver the work, and to
          hold appropriate licences for any software you ask us to install or configure. Delays in providing these may
          affect timelines.
        </p>

        <h2>Warranties</h2>
        <p>
          Development work carries a defect-correction period as stated in the relevant agreement. Hardware repairs
          carry a workmanship warranty; replacement parts carry their manufacturer&apos;s warranty. Warranties do not
          cover subsequent physical damage, liquid damage, or third-party modification.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the extent permitted by law, our liability arising from any engagement is limited to the amount paid for
          that engagement. We are not liable for indirect or consequential loss, including loss of profit or data. You
          are responsible for maintaining your own backups; we will advise on backup strategy but cannot guarantee
          recovery of data that was not backed up.
        </p>

        <h2>Confidentiality</h2>
        <p>
          We treat client business information as confidential and do not disclose it to third parties except as needed
          to deliver the agreed services or as required by law.
        </p>

        <h2>Termination</h2>
        <p>
          Either party may terminate an engagement with written notice. Work completed up to the termination date
          remains payable.
        </p>

        <h2>Support</h2>
        <p>
          Post-delivery support is provided per the terms of the relevant agreement or support package. Our standard
          hours are {company.hours.weekdays}; {company.hours.saturday.toLowerCase()}.
        </p>

        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of Zimbabwe.</p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these terms as our services change. The version in force at the time of your engagement applies
          to that engagement.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms: <a href={`mailto:${company.contact.email}`}>{company.contact.email}</a> or{" "}
          {company.contact.phone}. Registered office: {company.registeredOffice}.
        </p>
      </LegalPage>
    </>
  );
}
