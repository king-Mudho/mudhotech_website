"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/schemas";

export function NewsletterForm() {
  // Explicit state rather than RHF's isSubmitSuccessful: that flag is set
  // whenever the handler returns without throwing, which would also count a
  // request the API rejected.
  const [subscribed, setSubscribed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: NewsletterFormValues) => {
    try {
      await apiFetch("/api/newsletter", { method: "POST", body: JSON.stringify(values) });
      toast.success("Subscribed — thanks for signing up.");
      reset();
      setSubscribed(true);
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "Something went wrong. Please try again.");
    }
  };

  if (subscribed) {
    return (
      <p
        role="status"
        className="mx-auto inline-flex items-center gap-2 rounded-xl border border-whatsapp/30 bg-whatsapp/5 px-5 py-3 text-sm font-medium text-foreground"
      >
        <CheckCircle2 className="h-4 w-4 shrink-0 text-whatsapp" />
        You&apos;re on the list — thanks for subscribing.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-md" noValidate>
      <HoneypotField register={register} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Input
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="your@email.com"
            {...register("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "newsletter-email-error" : undefined}
          />
          {errors.email && (
            <p
              id="newsletter-email-error"
              role="alert"
              className="mt-1.5 text-left text-xs font-medium text-destructive-emphasis"
            >
              {errors.email.message}
            </p>
          )}
        </div>
        <Button type="submit" variant="accent" disabled={isSubmitting}>
          {isSubmitting ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Occasional practical guidance. Unsubscribe any time.</p>
    </form>
  );
}
