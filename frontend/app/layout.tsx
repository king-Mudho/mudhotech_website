import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton";
import { Analytics } from "@/components/layout/Analytics";
import { Toaster } from "@/components/ui/sonner";

// Only the weights actually used in the markup are requested — every extra
// weight is a separate woff2 download on the critical path. Headings use
// semibold/bold (plus one extrabold); body copy uses normal/medium/semibold.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const description =
  "Innovative Digital Solutions. Reliable IT Support. Simplified. MudhoTech Solutions is a Zimbabwean ICT company providing full-stack software development, digital transformation, and IT support services.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "MudhoTech Solutions",
    template: "%s | MudhoTech Solutions",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "MudhoTech Solutions",
    locale: "en_ZW",
    title: "MudhoTech Solutions",
    description,
    images: [{ url: "/images/hero-bg.jpg", width: 1200, height: 630, alt: "MudhoTech Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MudhoTech Solutions",
    description,
    images: ["/images/hero-bg.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${openSans.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <ScrollToTopButton />
          <CookieConsent />
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
