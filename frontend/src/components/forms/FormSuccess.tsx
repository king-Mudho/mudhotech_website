"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl, WHATSAPP_GREETING, telHref } from "@/lib/whatsapp";
import { company } from "@/data/company";

interface FormSuccessProps {
  title: string;
  message: string;
  /** Label for the "send another" reset action. */
  resetLabel?: string;
  onReset: () => void;
}

/**
 * Shown in place of the form after a successful submission.
 *
 * A toast alone is not a receipt: it disappears after a few seconds, it is
 * easy to miss on a phone, and it leaves the visitor staring at the form
 * they just filled in wondering whether it went. This replaces the form
 * with an unmistakable confirmation, says what happens next, and offers the
 * faster channel for anyone who does not want to wait for a reply.
 */
export function FormSuccess({ title, message, resetLabel = "Send another message", onReset }: FormSuccessProps) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-whatsapp/30 bg-whatsapp/5 p-8 text-center"
    >
      <div className="mx-auto mb-4 w-fit rounded-full bg-whatsapp/15 p-3">
        <CheckCircle2 className="h-7 w-7 text-whatsapp" />
      </div>

      <h3 className="mb-2 font-heading text-xl font-bold">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">{message}</p>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="outline" onClick={onReset}>
          {resetLabel}
        </Button>
        <Button asChild variant="whatsapp">
          <a href={whatsappUrl(WHATSAPP_GREETING)} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp instead
          </a>
        </Button>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        In a hurry? Call{" "}
        <a href={telHref()} className="font-medium text-accent hover:underline">
          {company.contact.phone}
        </a>{" "}
        during business hours.
      </p>
    </div>
  );
}
