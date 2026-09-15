"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Sun, Moon, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Web & Software", path: "/web-software" },
  { name: "IT Support", path: "/it-support" },
  { name: "About", path: "/about" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => setIsAdmin(Boolean(data.isAdmin)))
      .catch(() => setIsAdmin(false));
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    // The hero is light, so the bar stays light-on-light throughout —
    // scrolling only adds the separating shadow and border.
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-sm border-b border-border"
          : "bg-background/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 h-18 flex items-center justify-between py-3">
        <Link href="/" className="flex items-center group" aria-label="MudhoTech Solutions — home">
          <Image
            src="/images/mudhotech-logo.png"
            alt="MudhoTech Solutions"
            width={271}
            height={247}
            priority
            // The logo artwork is navy; it needs inverting to stay legible
            // against the dark-theme surface.
            className="h-12 w-auto transition-transform duration-300 group-hover:scale-105 dark:brightness-0 dark:invert"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                pathname === link.path
                  ? "text-accent bg-accent/10"
                  : "text-foreground/80 hover:text-accent hover:bg-accent/10"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 inline-flex items-center gap-1.5 ${
                pathname === "/admin"
                  ? "text-accent bg-accent/10"
                  : "text-foreground/80 hover:text-accent hover:bg-accent/10"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Link href="/quote" className="hidden lg:block">
            <Button variant="accent" size="sm" className="shadow-md font-semibold px-5">
              Get a Quote
            </Button>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                      pathname === link.path
                        ? "text-accent bg-accent/15"
                        : "text-foreground/70 hover:text-accent hover:bg-accent/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`px-4 py-3 rounded-lg text-base font-semibold transition-colors inline-flex items-center gap-2 ${
                      pathname === "/admin"
                        ? "text-accent bg-accent/15"
                        : "text-foreground/70 hover:text-accent hover:bg-accent/5"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}
                <Link href="/quote" className="mt-4">
                  <Button variant="accent" className="w-full font-semibold">
                    Get a Quote
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
