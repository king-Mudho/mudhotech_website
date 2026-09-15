import { z } from "zod";
import { HONEYPOT_FIELD_NAME } from "@/lib/honeypot";

const honeypot = { [HONEYPOT_FIELD_NAME]: z.string().max(0).optional().or(z.literal("")) };

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2).max(150),
  message: z.string().min(10).max(2000),
  ...honeypot,
});
export type ContactFormValues = z.infer<typeof contactSchema>;

export const quoteSchema = z.object({
  name: z.string().min(2).max(100),
  business: z.string().max(150).optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  serviceType: z.string().min(1, "Please select a service"),
  description: z.string().min(10).max(2000),
  preferredContact: z.enum(["email", "phone", "whatsapp"]).optional(),
  ...honeypot,
});
export type QuoteFormValues = z.infer<typeof quoteSchema>;

export const softwareServiceRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  serviceCategory: z.string().min(1, "Please select a category"),
  details: z.string().min(10).max(2000),
  ...honeypot,
});
export type SoftwareServiceRequestFormValues = z.infer<typeof softwareServiceRequestSchema>;

export const newsletterSchema = z.object({
  email: z.string().email(),
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
