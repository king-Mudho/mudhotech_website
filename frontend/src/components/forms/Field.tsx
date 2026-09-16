import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldRenderProps {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
}

interface FieldProps {
  id: string;
  label: string;
  /** Rendered in muted type next to the label, e.g. "optional". */
  note?: string;
  /** Always-visible helper text, announced with the field. */
  hint?: string;
  error?: string;
  className?: string;
  children: (props: FieldRenderProps) => ReactNode;
}

/**
 * One wrapper for every public form field.
 *
 * Previously each form hand-rolled `<Label>` + control + `<p className="text-destructive">`.
 * That renders an error a sighted user can see but a screen-reader user
 * never hears: `aria-invalid` was set, yet nothing connected the message to
 * the input, and nothing announced it when it appeared. This wires
 * `aria-describedby` to the hint and the error, and marks the error as a
 * live region so it is read out the moment validation fails.
 */
export function Field({ id, label, note, hint, error, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="flex items-baseline gap-1.5">
        {label}
        {note && <span className="text-xs font-normal text-muted-foreground">({note})</span>}
      </Label>

      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}

      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-xs font-medium text-destructive-emphasis">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
