"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { QueryProvider } from "@/components/admin/QueryProvider";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { NotificationPreferences } from "@/components/admin/NotificationPreferences";
import { apiFetch } from "@/lib/api/client";

export function AdminDashboard() {
  const router = useRouter();

  const signOut = async () => {
    await apiFetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <QueryProvider>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Lead Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Triage, reply to, and export enquiries.</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="contacts">
          <TabsList className="mb-8">
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
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
    </QueryProvider>
  );
}
