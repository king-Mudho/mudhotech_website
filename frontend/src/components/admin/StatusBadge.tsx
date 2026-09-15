import { cn } from "@/lib/utils";
import type { SubmissionStatus } from "@/types/api";

const styles: Record<SubmissionStatus, string> = {
  new: "bg-accent/15 text-accent",
  read: "bg-muted text-muted-foreground",
  replied: "bg-whatsapp/15 text-whatsapp",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span className={cn("inline-block px-2.5 py-1 rounded-md text-xs font-medium capitalize", styles[status])}>
      {status}
    </span>
  );
}
