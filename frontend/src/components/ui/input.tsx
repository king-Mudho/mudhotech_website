import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // A field that failed validation should *look* wrong, not just
          // carry a message underneath it. aria-[invalid=true] rather than
          // aria-invalid: the latter is not one of Tailwind's built-in aria
          // variants, so it silently compiles to nothing.
          "aria-[invalid=true]:border-destructive-emphasis aria-[invalid=true]:ring-destructive-emphasis/30 aria-[invalid=true]:focus-visible:ring-destructive-emphasis",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
