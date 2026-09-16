"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Inbox, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { QueryProvider } from "@/components/admin/QueryProvider";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { NotificationPreferences } from "@/components/admin/NotificationPreferences";
import { apiFetch } from "@/lib/api/client";

interface AnalyticsTotals {
  totals: { contacts: number; quotes: number; new_contacts: number; new_quotes: number };
}

/**
 * Unanswered-lead count beside each tab label.
 *
 * The point of this dashboard is "what has come in that nobody has dealt
 * with yet", and answering that used to require opening both tabs and
 * reading the status column. The same query key the Analytics tab uses, so
 * the two never disagree and the data is fetched once.
 */
function PendingBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-semibold leading-none text-accent-foreground">
      {count > 99 ? "99+" : count}
      {/* Folds into the tab's accessible name so the count is not a
          sighted-only signal: "Contacts, 3 new". */}
      <span className="sr-only"> new</span>
    </span>
  );
}

function DashboardBody() {
  const router = useRouter();

  const { data } = useQuery<AnalyticsTotals>({
    queryKey: ["analytics", 30],
    queryFn: () => apiFetch<AnalyticsTotals>("/api/admin/analytics?days=30"),
  });

  const newContacts = data?.totals.new_contacts ?? 0;
  const newQuotes = data?.totals.new_quotes ?? 0;
  const pending = newContacts + newQuotes;

  const signOut = async () => {
    await apiFetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Wraps on a phone instead of crushing the title against the button. */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Lead Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pending > 0 ? (
              <>
                <span className="font-medium text-foreground">
                  {pending} {pending === 1 ? "enquiry needs" : "enquiries need"} a reply
                </span>{" "}
                · triage, respond, and export below.
              </>
            ) : (
              "Nothing outstanding — triage, reply to, and export enquiries here."
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="contacts">
        <TabsList className="mb-8 flex h-auto flex-wrap justify-start">
          <TabsTrigger value="contacts">
            <Inbox className="mr-1.5 h-3.5 w-3.5" />
            Contacts
            <PendingBadge count={newContacts} />
          </TabsTrigger>
          <TabsTrigger value="quotes">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Quotes
            <PendingBadge count={newQuotes} />
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <LeadsTable type="contact" />
        </TabsContent>
        <TabsContent value="quotes">
          <LeadsTable type="quote" />
        </TabsContent>
        <TabsContent value="analytics">
          <AdminAnalytics />
        </TabsContent>
        <TabsContent value="settings">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function AdminDashboard() {
  return (
    <QueryProvider>
      <DashboardBody />
    </QueryProvider>
  );
}
