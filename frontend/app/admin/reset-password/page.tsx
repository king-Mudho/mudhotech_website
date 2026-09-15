import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
};

export default function AdminResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-secondary/40">
      <div className="w-full max-w-sm rounded-2xl bg-card border border-border shadow-xl p-8 text-center">
        <div className="rounded-lg bg-accent/10 p-3 w-fit mx-auto mb-4">
          <KeyRound className="h-6 w-6 text-accent" />
        </div>
        <h1 className="font-heading text-2xl font-bold mb-3">Password Reset</h1>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          Admin accounts are provisioned manually — there is no public sign-up. To reset your password, contact the
          site administrator at{" "}
          <a href={`mailto:${company.contact.email}`} className="text-accent hover:underline">
            {company.contact.email}
          </a>
          .
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/login">Back to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
