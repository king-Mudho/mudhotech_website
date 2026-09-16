"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/forms/Field";
import { FormSuccess } from "@/components/forms/FormSuccess";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { quoteSchema, serviceTypeOptions, type QuoteFormValues } from "@/lib/schemas";

const DESCRIPTION_MAX = 2000;

export function QuoteForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: QuoteFormValues) => {
    try {
      await apiFetch("/api/submissions/quote", { method: "POST", body: JSON.stringify(values) });
      toast.success("Quote request sent — we'll be in touch shortly.");
      reset();
      setSent(true);
    } catch (error) {
      if (error instanceof ApiClientError && error.fields) {
        for (const [field, message] of Object.entries(error.fields)) {
          setError(field as keyof QuoteFormValues, { message });
        }
      }
      toast.error(error instanceof ApiClientError ? error.message : "Something went wrong. Please try again.");
    }
  };

  const descriptionLength = watch("description")?.length ?? 0;

  if (sent) {
    return (
      <FormSuccess
        title="Quote request received"
        message="We'll review what you've described and come back with scope, timeline, and a clear cost estimate — usually within one business day. No obligation either way."
        resetLabel="Request another quote"
        onReset={() => setSent(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <HoneypotField register={register} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="quote-name" label="Name" error={errors.name?.message}>
          {(field) => <Input {...field} autoComplete="name" {...register("name")} />}
        </Field>
        <Field id="quote-business" label="Business" note="optional" error={errors.business?.message}>
          {(field) => <Input {...field} autoComplete="organization" {...register("business")} />}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="quote-email" label="Email" error={errors.email?.message}>
          {(field) => <Input {...field} type="email" autoComplete="email" {...register("email")} />}
        </Field>
        <Field id="quote-phone" label="Phone" note="optional" error={errors.phone?.message}>
          {(field) => (
            <Input {...field} type="tel" inputMode="tel" autoComplete="tel" {...register("phone")} />
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="quote-service" label="Service Needed" error={errors.serviceType?.message}>
          {(field) => (
            <Controller
              control={control}
              name="serviceType"
              render={({ field: controlled }) => (
                <Select onValueChange={controlled.onChange} value={controlled.value}>
                  <SelectTrigger {...field}>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          )}
        </Field>

        <Field id="quote-contact-method" label="Preferred Contact" note="optional">
          {(field) => (
            <Controller
              control={control}
              name="preferredContact"
              render={({ field: controlled }) => (
                <Select onValueChange={controlled.onChange} value={controlled.value}>
                  <SelectTrigger {...field}>
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          )}
        </Field>
      </div>

      <Field
        id="quote-description"
        label="Project Description"
        error={errors.description?.message}
        hint={`${descriptionLength}/${DESCRIPTION_MAX} characters — what you need, and roughly when.`}
      >
        {(field) => <Textarea {...field} rows={6} maxLength={DESCRIPTION_MAX} {...register("description")} />}
      </Field>

      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Request a Quote"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Free consultation · No obligation · We never share your details.
      </p>
    </form>
  );
}
