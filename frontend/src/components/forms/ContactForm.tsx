"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/forms/Field";
import { FormSuccess } from "@/components/forms/FormSuccess";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { contactSchema, type ContactFormValues } from "@/lib/schemas";
import { composeEnquiry, whatsappUrl } from "@/lib/whatsapp";

const MESSAGE_MAX = 2000;

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    // Re-validate as the visitor fixes a field rather than only on the next
    // submit — an error that stays on screen after it has been corrected
    // reads as "the form is broken".
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await apiFetch("/api/submissions/contact", { method: "POST", body: JSON.stringify(values) });
      toast.success("Message sent — we'll get back to you shortly.");
      reset();
      setSent(true);
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

  const messageLength = watched.message?.length ?? 0;

  if (sent) {
    return (
      <FormSuccess
        title="Message received"
        message="Thanks for getting in touch. A real person reads every enquiry — we typically reply within one business day."
        onReset={() => setSent(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <HoneypotField register={register} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label="Name" error={errors.name?.message}>
          {(field) => <Input {...field} autoComplete="name" {...register("name")} />}
        </Field>
        <Field id="contact-email" label="Email" error={errors.email?.message}>
          {(field) => <Input {...field} type="email" autoComplete="email" {...register("email")} />}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-phone" label="Phone" note="optional" error={errors.phone?.message}>
          {(field) => (
            <Input {...field} type="tel" inputMode="tel" autoComplete="tel" {...register("phone")} />
          )}
        </Field>
        <Field id="contact-subject" label="Subject" error={errors.subject?.message}>
          {(field) => <Input {...field} {...register("subject")} />}
        </Field>
      </div>

      <Field
        id="contact-message"
        label="Message"
        error={errors.message?.message}
        hint={`${messageLength}/${MESSAGE_MAX} characters`}
      >
        {(field) => <Textarea {...field} rows={6} maxLength={MESSAGE_MAX} {...register("message")} />}
      </Field>

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
