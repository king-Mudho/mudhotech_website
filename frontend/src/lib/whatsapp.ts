import { company } from "@/data/company";

/**
 * Builds a wa.me deep link.
 *
 * wa.me requires the number in E.164 *without* the leading "+" or any
 * spaces — "+263 71 270 0941" must become "263712700941", or WhatsApp
 * silently opens to a blank chat instead of the business account. Stripping
 * every non-digit is the safest way to guarantee that regardless of how the
 * number is formatted in the content data.
 */
export function whatsappNumber(): string {
  return company.contact.whatsapp.replace(/\D/g, "");
}

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${whatsappNumber()}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Default opener used by the floating button and contact card. */
export const WHATSAPP_GREETING = "Hello MudhoTech, I'd like to enquire about your services.";

/** Click-to-call href — tel: tolerates the leading "+" but not spaces. */
export function telHref(): string {
  return `tel:${company.contact.phone.replace(/\s/g, "")}`;
}

export function mailtoHref(subject?: string): string {
  const base = `mailto:${company.contact.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/**
 * Composes an enquiry into a WhatsApp message. Used by the contact form's
 * "Send via WhatsApp" path — WhatsApp is the dominant business channel in
 * this market, and it gives the visitor an instant, no-inbox alternative to
 * the email form.
 */
export function composeEnquiry(fields: {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}): string {
  const lines = ["Hello MudhoTech, I'd like to make an enquiry.", ""];
  if (fields.name) lines.push(`Name: ${fields.name}`);
  if (fields.email) lines.push(`Email: ${fields.email}`);
  if (fields.subject) lines.push(`Subject: ${fields.subject}`);
  if (fields.message) lines.push("", fields.message);
  return lines.join("\n");
}
