export type SubmissionStatus = "new" | "read" | "replied";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: SubmissionStatus;
  source: "contact" | "software_service";
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  business: string | null;
  email: string;
  phone: string | null;
  service_type: string;
  description: string;
  preferred_contact_method: "email" | "phone" | "whatsapp" | null;
  status: SubmissionStatus;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  confirmed: boolean;
  created_at: string;
}

export interface AdminNotificationPreference {
  id: string;
  event_type: "new_contact" | "new_quote" | "new_newsletter_signup";
  enabled: boolean;
}

export interface ApiErrorShape {
  success: false;
  error: {
    message: string;
    fields?: Record<string, string>;
  };
}
