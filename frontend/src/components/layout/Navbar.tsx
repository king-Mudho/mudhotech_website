"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Sun, Moon, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Web & Software", path: "/web-software" },
  { name: "IT Support", path: "/it-support" },
  { name: "About", path: "/about" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

/**
 * A section is "current" for its own page and everything beneath it, so
 * reading /blog/cloud-computing-small-businesses still highlights Blog.
 * Matching on strict equality left the visitor with no indication of where
 * they were on every nested route.
 */
function isCurrent(pathname: string, path: string): boolean {
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  // Once per page load, not once per navigation: this used to re-run on
  // every route change, firing an authenticated round-trip to Django for
  // every visitor clicking through the site — none of whom are staff.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setIsAdmin(Boolean(data.isAdmin));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const linkClass = (active: boolean, mobile = false) =>
    [
      mobile
        ? "px-4 py-3 rounded-lg text-base font-semibold"
        : "px-3.5 py-2 text-sm font-semibold rounded-lg",
      "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      active
        ? `text-accent ${mobile ? "bg-accent/15" : "bg-accent/10"}`
        : "text-foreground/80 hover:text-accent hover:bg-accent/10",
    ].join(" ");

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
      <nav
        aria-label="Main"
        className="container mx-auto flex h-18 items-center justify-between px-4 py-3"
      >
        <Link
          href="/"
          className="group flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="MudhoTech Solutions — home"
        >
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

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = isCurrent(pathname, link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                aria-current={active ? "page" : undefined}
                className={linkClass(active)}
              >
                {link.name}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              aria-current={isCurrent(pathname, "/admin") ? "page" : undefined}
              className={`${linkClass(isCurrent(pathname, "/admin"))} inline-flex items-center gap-1.5`}
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
            className="relative"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            {/* The label states the destination, not the current state — a
                button announced as "Dark" gives no clue what pressing it does.
                Driven by CSS rather than `resolvedTheme`, which is undefined
                during SSR: an aria-label computed from it renders one value on
                the server and the other on the client, which is a hydration
                mismatch. next-themes sets the `dark` class before hydration,
                so these resolve correctly on the very first paint. */}
            <span className="sr-only dark:hidden">Switch to dark theme</span>
            <span className="sr-only hidden dark:inline">Switch to light theme</span>
          </Button>

          <Link href="/quote" className="hidden lg:block">
            <Button variant="accent" size="sm" className="px-5 font-semibold shadow-md">
              Get a Quote
            </Button>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              {/* Radix requires a title on every dialog surface; without one
                  the sheet opens as an unnamed dialog to a screen reader. */}
              <SheetTitle className="sr-only">Site menu</SheetTitle>
              <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = isCurrent(pathname, link.path);
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      aria-current={active ? "page" : undefined}
                      className={linkClass(active, true)}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                {isAdmin && (
                  <Link
                    href="/admin"
                    aria-current={isCurrent(pathname, "/admin") ? "page" : undefined}
                    className={`${linkClass(isCurrent(pathname, "/admin"), true)} inline-flex items-center gap-2`}
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
