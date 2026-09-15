"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { apiFetch, ApiClientError } from "@/lib/api/client";

interface AdminReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  to: string;
  defaultSubject: string;
  submissionType: "contact" | "quote";
  submissionId: number | string;
  onSent: () => void;
}

export function AdminReplyDialog({
  open,
  onOpenChange,
  to,
  defaultSubject,
  submissionType,
  submissionId,
  onSent,
}: AdminReplyDialogProps) {
  const [subject, setSubject] = useState(`Re: ${defaultSubject}`);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    setSending(true);
    try {
      await apiFetch("/api/admin/reply", {
        method: "POST",
        body: JSON.stringify({ to, subject, message, submissionType, submissionId }),
      });
      toast.success("Reply sent.");
      setMessage("");
      onOpenChange(false);
      onSent();
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reply to {to}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reply-subject">Subject</Label>
            <Input id="reply-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reply-message">Message</Label>
            <Textarea id="reply-message" rows={8} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="accent" onClick={send} disabled={sending || !message.trim()}>
            {sending ? "Sending…" : "Send Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
