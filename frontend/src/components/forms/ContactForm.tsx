"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { contactSchema, type ContactFormValues } from "@/lib/schemas";
import { composeEnquiry, whatsappUrl } from "@/lib/whatsapp";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await apiFetch("/api/submissions/contact", { method: "POST", body: JSON.stringify(values) });
      toast.success("Message sent — we'll get back to you shortly.");
      reset();
    } catch (error) {
      if (error instanceof ApiClientError && error.fields) {
        for (const [field, message] of Object.entries(error.fields)) {
          setError(field as keyof ContactFormValues, { message });
        }
      }
      toast.error(error instanceof ApiClientError ? error.message : "Something went wrong. Please try again.");
    }
  };

  /**
   * Alternative send path. WhatsApp is the dominant business channel in this
   * market, and it gives the visitor an immediate reply route that does not
   * depend on our mail delivery.
   *
   * Rendered as a real anchor rather than a button calling window.open():
   * popup blockers can swallow window.open, and an anchor also supports
   * middle-click and "open in new tab". Deliberately not zod-validated —
   * whatever has been typed so far is carried across, and the conversation
   * continues in WhatsApp.
   */
  const watched = watch();
  const whatsappHref = whatsappUrl(
    composeEnquiry({
      name: watched.name,
      email: watched.email,
      subject: watched.subject,
      message: watched.message,
    }),
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <HoneypotField register={register} />

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone (optional)</Label>
          <Input id="contact-phone" {...register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-subject">Subject</Label>
          <Input id="contact-subject" {...register("subject")} aria-invalid={!!errors.subject} />
          {errors.subject && <p className="text-destructive text-xs">{errors.subject.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" rows={6} {...register("message")} aria-invalid={!!errors.message} />
        {errors.message && <p className="text-destructive text-xs">{errors.message.message}</p>}
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Sending…" : "Send Message"}
        </Button>

        {/* No aria-label: the visible text is already a good accessible name,
            and an aria-label that doesn't contain the visible text breaks
            voice control (WCAG 2.5.3, "Label in Name"). */}
        <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Send via WhatsApp
          </a>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Prefer to talk? WhatsApp opens with your details already filled in.
      </p>
    </form>
  );
}
