"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiFetch, ApiClientError } from "@/lib/api/client";

type Preferences = Record<string, boolean>;

const labels: Record<string, string> = {
  new_contact: "New contact form submissions",
  new_quote: "New quote requests",
  new_newsletter_signup: "New newsletter signups",
};

export function NotificationPreferences() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Preferences>({
    queryKey: ["notification-preferences"],
    queryFn: () => apiFetch<Preferences>("/api/admin/notification-preferences"),
  });

  const mutation = useMutation({
    mutationFn: (next: Preferences) =>
      apiFetch("/api/admin/notification-preferences", { method: "PUT", body: JSON.stringify(next) }),
    onSuccess: () => {
      toast.success("Preferences saved.");
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    },
    onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Failed to save."),
  });

  if (isLoading || !data) {
    return <p className="text-muted-foreground py-10 text-center">Loading preferences…</p>;
  }

  return (
    <div className="max-w-lg space-y-1">
      <h3 className="font-heading font-semibold text-lg mb-2">Email Notifications</h3>
      <p className="text-muted-foreground text-sm mb-6">
        Choose which events send you an email. Applies to your account only.
      </p>

      {Object.entries(labels).map(([eventType, label]) => (
        <div key={eventType} className="flex items-center justify-between rounded-xl bg-card border border-border p-4">
          <Label htmlFor={`pref-${eventType}`} className="cursor-pointer">
            {label}
          </Label>
          <Switch
            id={`pref-${eventType}`}
            checked={data[eventType] ?? true}
            onCheckedChange={(checked) => mutation.mutate({ ...data, [eventType]: checked })}
          />
        </div>
      ))}
    </div>
  );
}
