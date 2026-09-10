"use client";

import {
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useState,
} from "react";

import { Container } from "@/components/shared/container";
import { SkipLink } from "@/components/shared/skip-link";
import {
  buttonVariants,
} from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../shared/theme-toggle";

const navigationItems = [
  {
    label: "Home",
    href: "/#home",
  },
  {
    label: "Projects",
    href: "/#projects",
  },
  {
    label: "Pricing",
    href: "/#pricing",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
] as const;

export function Navbar() {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <>
      <SkipLink />

      <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link
              href="/#home"
              onClick={
                closeMobileMenu
              }
              className="shrink-0 text-lg font-bold tracking-tight transition-colors hover:text-emerald-500"
            >
              {siteConfig.name}
            </Link>

            {/* Desktop navigation */}
            <nav
              aria-label="Primary navigation"
              className="hidden items-center gap-8 md:flex"
            >
              {navigationItems.map(
                (item) => (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-emerald-500"
                  >
                    {
                      item.label
                    }
                  </Link>
                ),
              )}
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-3 md:flex">
              <ThemeToggle />

              <Link
                href="/#contact"
                className={cn(
                  buttonVariants({
                    size: "sm",
                  }),
                  "px-5",
                )}
              >
                Let&apos;s Connect
              </Link>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />

              <button
                type="button"
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={
                  mobileMenuOpen
                }
                onClick={() =>
                  setMobileMenuOpen(
                    (
                      current,
                    ) =>
                      !current,
                  )
                }
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md border border-border bg-background transition-all hover:border-dashed hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              >
                {mobileMenuOpen ? (
                  <X className="size-4" />
                ) : (
                  <Menu className="size-4" />
                )}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile navigation */}
        {mobileMenuOpen ? (
          <div className="border-t bg-background/95 backdrop-blur-xl md:hidden">
            <Container className="py-4">
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1"
              >
                {navigationItems.map(
                  (item) => (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      onClick={
                        closeMobileMenu
                      }
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-emerald-500/10 hover:text-emerald-500"
                    >
                      {
                        item.label
                      }
                    </Link>
                  ),
                )}

                <div className="mt-3 border-t pt-4">
                  <Link
                    href="/#contact"
                    onClick={
                      closeMobileMenu
                    }
                    className={cn(
                      buttonVariants({
                        size: "sm",
                      }),
                      "w-full",
                    )}
                  >
                    Let&apos;s
                    Connect
                  </Link>
                </div>
              </nav>
            </Container>
          </div>
        ) : null}
      </header>
    </>
  );
}