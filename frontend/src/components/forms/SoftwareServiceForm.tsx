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
import { softwareServiceRequestSchema, type SoftwareServiceRequestFormValues } from "@/lib/schemas";
import { softwareServices } from "@/data/services";

const DETAILS_MAX = 2000;

export function SoftwareServiceForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SoftwareServiceRequestFormValues>({
    resolver: zodResolver(softwareServiceRequestSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: SoftwareServiceRequestFormValues) => {
    try {
      await apiFetch("/api/submissions/software-service", { method: "POST", body: JSON.stringify(values) });
      toast.success("Request sent — we'll get back to you shortly.");
      reset();
      setSent(true);
    } catch (error) {
      if (error instanceof ApiClientError && error.fields) {
        for (const [field, message] of Object.entries(error.fields)) {
          setError(field as keyof SoftwareServiceRequestFormValues, { message });
        }
      }
      toast.error(error instanceof ApiClientError ? error.message : "Something went wrong. Please try again.");
    }
  };

  const detailsLength = watch("details")?.length ?? 0;

  if (sent) {
    return (
      <FormSuccess
        title="Request received"
        message="We'll look at what you've described and come back with next steps — usually within one business day. Diagnostics are free."
        resetLabel="Send another request"
        onReset={() => setSent(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <HoneypotField register={register} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="sw-name" label="Name" error={errors.name?.message}>
          {(field) => <Input {...field} autoComplete="name" {...register("name")} />}
        </Field>
        <Field id="sw-email" label="Email" error={errors.email?.message}>
          {(field) => <Input {...field} type="email" autoComplete="email" {...register("email")} />}
        </Field>
      </div>

      <Field id="sw-category" label="Service Category" error={errors.serviceCategory?.message}>
        {(field) => (
          <Controller
            control={control}
            name="serviceCategory"
            render={({ field: controlled }) => (
              <Select onValueChange={controlled.onChange} value={controlled.value}>
                <SelectTrigger {...field}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {softwareServices.map((service) => (
                    <SelectItem key={service.title} value={service.title}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
      </Field>

      <Field
        id="sw-details"
        label="What do you need?"
        error={errors.details?.message}
        hint={`${detailsLength}/${DETAILS_MAX} characters — include the device or system affected.`}
      >
        {(field) => <Textarea {...field} rows={5} maxLength={DETAILS_MAX} {...register("details")} />}
      </Field>

      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Request Service"}
      </Button>
    </form>
  );
}
