import { HONEYPOT_FIELD_NAME } from "@/lib/honeypot";
import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface HoneypotFieldProps<T extends FieldValues> {
  register: UseFormRegister<T>;
}

/**
 * Drop into every public form (Contact, Quote, Software Service, Newsletter)
 * alongside its zod schema's honeypot field. Hidden from sighted and
 * screen-reader users; visible to bots that fill every input blindly.
 */
export function HoneypotField<T extends FieldValues>({ register }: HoneypotFieldProps<T>) {
  return (
    <input
      type="text"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      {...register(HONEYPOT_FIELD_NAME as Path<T>)}
    />
  );
}
