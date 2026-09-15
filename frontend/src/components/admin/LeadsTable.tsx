"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Download, FileText, Eye, Reply, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminReplyDialog } from "@/components/admin/AdminReplyDialog";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { contactColumns, quoteColumns, exportToCSV, exportToPDF } from "@/lib/exportUtils";
import type { ContactSubmission, QuoteRequest, SubmissionStatus } from "@/types/api";

type LeadType = "contact" | "quote";
type Row = ContactSubmission & QuoteRequest;

interface ListResponse {
  results: Row[];
  total: number;
  page: number;
  page_size: number;
}

export function LeadsTable({ type }: { type: LeadType }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [viewing, setViewing] = useState<Row | null>(null);
  const [replyingTo, setReplyingTo] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);

  const queryKey = ["submissions", type, search, statusFilter, page];

  const { data, isLoading } = useQuery<ListResponse>({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams({ type, page: String(page) });
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      return apiFetch<ListResponse>(`/api/admin/submissions?${params}`);
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["submissions"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
    setSelected(new Set());
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: SubmissionStatus }) =>
      apiFetch(`/api/admin/submissions/${id}?type=${type}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: invalidate,
    onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Update failed."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/admin/submissions/${id}?type=${type}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted.");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Delete failed."),
  });

  const bulkMutation = useMutation({
    mutationFn: (action: "markRead" | "markReplied" | "delete") =>
      apiFetch("/api/admin/submissions/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: Array.from(selected), action, type }),
      }),
    onSuccess: () => {
      toast.success("Bulk action applied.");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Bulk action failed."),
  });

  const rows = data?.results ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / (data?.page_size ?? 10)));
  const columns = type === "contact" ? contactColumns : quoteColumns;

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => (prev.size === rows.length ? new Set() : new Set(rows.map((r) => Number(r.id)))));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <label htmlFor={`${type}-search`} className="sr-only">
            Search {type} submissions
          </label>
          <Input
            id={`${type}-search`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search…"
            className="pl-9"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full lg:w-40" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(rows, columns, `mudhotech-${type}s`)}
            disabled={rows.length === 0}
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToPDF(rows, columns, `mudhotech-${type}s`, `${type === "contact" ? "Contact" : "Quote"} Submissions`)}
            disabled={rows.length === 0}
          >
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-secondary/60 border border-border p-3">
          <span className="text-sm text-muted-foreground mr-1">{selected.size} selected</span>
          <Button size="sm" variant="outline" onClick={() => bulkMutation.mutate("markRead")}>
            Mark Read
          </Button>
          <Button size="sm" variant="outline" onClick={() => bulkMutation.mutate("markReplied")}>
            Mark Replied
          </Button>
          <Button size="sm" variant="destructive" onClick={() => bulkMutation.mutate("delete")}>
            Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={rows.length > 0 && selected.size === rows.length}
                  onCheckedChange={toggleAll}
                  aria-label="Select all rows"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>{type === "contact" ? "Subject" : "Service"}</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  Loading…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  No submissions found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.has(Number(row.id))}
                      onCheckedChange={() => toggleRow(Number(row.id))}
                      aria-label={`Select ${row.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.email}</TableCell>
                  <TableCell className="max-w-[220px] truncate">
                    {type === "contact" ? row.subject : row.service_type}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={row.status}
                      onValueChange={(value) =>
                        statusMutation.mutate({ id: Number(row.id), status: value as SubmissionStatus })
                      }
                    >
                      <SelectTrigger className="w-[120px] h-8" aria-label={`Change status for ${row.name}`}>
                        <StatusBadge status={row.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString("en-ZW")}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button size="icon" variant="ghost" aria-label={`View ${row.name}`} onClick={() => setViewing(row)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label={`Reply to ${row.name}`} onClick={() => setReplyingTo(row)}>
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label={`Delete ${row.name}`} onClick={() => setDeleting(row)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} total · page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.name}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-medium">Email</dt>
                <dd className="text-muted-foreground">{viewing.email}</dd>
              </div>
              {viewing.phone && (
                <div>
                  <dt className="font-medium">Phone</dt>
                  <dd className="text-muted-foreground">{viewing.phone}</dd>
                </div>
              )}
              {type === "quote" && viewing.business && (
                <div>
                  <dt className="font-medium">Business</dt>
                  <dd className="text-muted-foreground">{viewing.business}</dd>
                </div>
              )}
              <div>
                <dt className="font-medium">{type === "contact" ? "Subject" : "Service"}</dt>
                <dd className="text-muted-foreground">{type === "contact" ? viewing.subject : viewing.service_type}</dd>
              </div>
              <div>
                <dt className="font-medium">{type === "contact" ? "Message" : "Description"}</dt>
                <dd className="text-muted-foreground whitespace-pre-wrap">
                  {type === "contact" ? viewing.message : viewing.description}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Received</dt>
                <dd className="text-muted-foreground">{new Date(viewing.created_at).toLocaleString("en-ZW")}</dd>
              </div>
            </dl>
          )}
        </DialogContent>
      </Dialog>

      {replyingTo && (
        <AdminReplyDialog
          open={!!replyingTo}
          onOpenChange={(open) => !open && setReplyingTo(null)}
          to={replyingTo.email}
          defaultSubject={type === "contact" ? replyingTo.subject : replyingTo.service_type}
          submissionType={type}
          submissionId={replyingTo.id}
          onSent={invalidate}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the record from {deleting?.name}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleting) deleteMutation.mutate(Number(deleting.id));
                setDeleting(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
