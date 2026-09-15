"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { softwareServiceRequestSchema, type SoftwareServiceRequestFormValues } from "@/lib/schemas";
import { softwareServices } from "@/data/services";

export function SoftwareServiceForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SoftwareServiceRequestFormValues>({ resolver: zodResolver(softwareServiceRequestSchema) });

  const onSubmit = async (values: SoftwareServiceRequestFormValues) => {
    try {
      await apiFetch("/api/submissions/software-service", { method: "POST", body: JSON.stringify(values) });
      toast.success("Request sent — we'll get back to you shortly.");
      reset();
    } catch (error) {
      if (error instanceof ApiClientError && error.fields) {
        for (const [field, message] of Object.entries(error.fields)) {
          setError(field as keyof SoftwareServiceRequestFormValues, { message });
        }
      }
      toast.error(error instanceof ApiClientError ? error.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <HoneypotField register={register} />

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="sw-name">Name</Label>
          <Input id="sw-name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sw-email">Email</Label>
          <Input id="sw-email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sw-category">Service Category</Label>
        <Controller
          control={control}
          name="serviceCategory"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="sw-category" aria-invalid={!!errors.serviceCategory}>
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
        {errors.serviceCategory && <p className="text-destructive text-xs">{errors.serviceCategory.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sw-details">What do you need?</Label>
        <Textarea id="sw-details" rows={5} {...register("details")} aria-invalid={!!errors.details} />
        {errors.details && <p className="text-destructive text-xs">{errors.details.message}</p>}
      </div>

      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Request Service"}
      </Button>
    </form>
  );
}
