import { z } from "zod";
import { HONEYPOT_FIELD_NAME } from "@/lib/honeypot";

/**
 * Every rule below carries an explicit message.
 *
 * Zod's defaults ("String must contain at least 2 character(s)", "Invalid
 * email") are developer diagnostics, and they were being rendered verbatim
 * underneath the inputs on the public contact, quote, and service forms.
 * These messages are read by a prospect deciding whether to keep typing, so
 * they say what to do rather than describing a failed assertion.
 *
 * The same schemas re-validate server-side in the Route Handlers, so the
 * wording is identical whichever layer rejects the input.
 */

const honeypot = {
  [HONEYPOT_FIELD_NAME]: z.string().max(0).optional().or(z.literal("")),
};

const name = z
  .string({ required_error: "Please enter your name." })
  .trim()
  .min(2, "Please enter your full name.")
  .max(100, "That name is too long — 100 characters maximum.");

const email = z
  .string({ required_error: "Please enter your email address." })
  .trim()
  .min(1, "Please enter your email address.")
  .email("Please enter a valid email address, e.g. name@company.co.zw.");

/**
 * Optional, but checked when something *is* typed — a silently-accepted
 * "0771" leaves a lead nobody can call back. Deliberately permissive about
 * formatting (spaces, dashes, brackets, a leading +) and strict only about
 * there being enough digits to dial.
 */
const phone = z
  .string()
  .trim()
  .refine((value) => value === "" || /^[+\d][\d\s()\-]{6,}$/.test(value), {
    message: "Please enter a reachable phone number, e.g. +263 77 123 4567.",
  })
  .optional();

const longText = (label: string, example: string) =>
  z
    .string({ required_error: `Please tell us about your ${label}.` })
    .trim()
    .min(10, `Please add a little more detail — ${example}`)
    .max(2000, "That is over 2,000 characters. Please shorten it, or send the detail by email.");

export const contactSchema = z.object({
  name,
  email,
  phone,
  subject: z
    .string({ required_error: "Please add a subject." })
    .trim()
    .min(2, "Please add a short subject line.")
    .max(150, "That subject is too long — 150 characters maximum."),
  message: longText("message", "a sentence or two about what you need is plenty."),
  ...honeypot,
});
export type ContactFormValues = z.infer<typeof contactSchema>;

export const quoteSchema = z.object({
  name,
  business: z.string().trim().max(150, "That business name is too long — 150 characters maximum.").optional(),
  email,
  phone,
  serviceType: z.string().min(1, "Please choose the service you need."),
  description: longText("project", "what you want built and roughly when you need it."),
  preferredContact: z.enum(["email", "phone", "whatsapp"]).optional(),
  ...honeypot,
});
export type QuoteFormValues = z.infer<typeof quoteSchema>;

export const softwareServiceRequestSchema = z.object({
  name,
  email,
  serviceCategory: z.string().min(1, "Please choose a service category."),
  details: longText("request", "what is happening and which device or system it affects."),
  ...honeypot,
});
export type SoftwareServiceRequestFormValues = z.infer<typeof softwareServiceRequestSchema>;

export const newsletterSchema = z.object({
  email,
  ...honeypot,
});
export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const serviceTypeOptions = [
  "Web Development",
  "Mobile App Development",
  "E-Commerce Solution",
  "Custom Software",
  "Cloud Solutions",
  "IT Support & Maintenance",
  "Hardware Installation/Repair",
  "Networking",
  "Cybersecurity",
  "Other",
];
