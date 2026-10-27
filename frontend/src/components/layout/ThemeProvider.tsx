"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    // No MotionConfig here any more: it pulled framer-motion into every page's
    // bundle. Public pages animate in CSS (the `.reveal` utility), which
    // honours "reduce motion" in globals.css.
    <NextThemesProvider {...props}>{children}</NextThemesProvider>
  );
}
