"use client";

import { useEffect, useState } from "react";

/**
 * Delays propagating a fast-changing value.
 *
 * The admin leads table put `search` straight into its TanStack Query key,
 * so typing "tendai" fired six authenticated round-trips through Next to
 * Django, each running four `icontains` scans — and the results flickered
 * as the out-of-order responses landed.
 */
export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
