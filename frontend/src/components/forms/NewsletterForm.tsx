"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/schemas";

export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (values: NewsletterFormValues) => {
    try {
      await apiFetch("/api/newsletter", { method: "POST", body: JSON.stringify(values) });
      toast.success("Subscribed — thanks for signing up.");
      reset();
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto" noValidate>
      <HoneypotField register={register} />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="your@email.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-destructive text-xs mt-1 text-left">{errors.email.message}</p>}
        </div>
        <Button type="submit" variant="accent" disabled={isSubmitting}>
          {isSubmitting ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
    </form>
  );
}
