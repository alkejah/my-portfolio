import {
  ArrowUpRight,
  Download,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";

import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

const footerNavigation = [
  {
    title: "Navigation",
    links: [
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
    ],
  },

  {
    title: "Work",
    links: [
      {
        label: "Selected Work",
        href: "/#projects",
      },
      {
        label: "All Projects",
        href: "/projects",
      },
      {
        label: "Download CV",
        href: "/cv.pdf",
        download: true,
      },
    ],
  },

  {
    title: "Connect",
    links: [
      {
        label: "Email",
        href: siteConfig.links.email,
        external: true,
      },
      {
        label: "LinkedIn",
        href: siteConfig.links.linkedin,
        external: true,
      },
    ],
  },

  {
    title: "Quick Links",
    links: [
      {
        label: "Let's Connect",
        href: "/#contact",
      },
      {
        label: "View Projects",
        href: "/projects",
      },
      {
        label: "View Pricing",
        href: "/#pricing",
      },
      {
        label: "Back to Top",
        href: "/#home",
      },
    ],
  },
] as const;

export function Footer() {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/20">
      <Container>
        <div className="py-10 sm:py-12 lg:py-14">
          {/* Main navigation */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {footerNavigation.map(
              (section) => (
                <div
                  key={section.title}
                  className="space-y-4"
                >
                  <p className="font-semibold text-foreground">
                    {section.title}
                  </p>

                  <nav
                    aria-label={`${section.title} footer navigation`}
                  >
                    <ul className="space-y-3">
                      {section.links.map(
                        (link) => {
                          const external =
                            "external" in link &&
                            link.external;

                          const download =
                            "download" in link &&
                            link.download;

                          return (
                            <li
                              key={
                                link.label
                              }
                            >
                              <Link
                                href={
                                  link.href
                                }
                                target={
                                  external
                                    ? "_blank"
                                    : undefined
                                }
                                rel={
                                  external
                                    ? "noreferrer"
                                    : undefined
                                }
                                download={
                                  download
                                    ? "richard_dela_peña_cv.pdf"
                                    : undefined
                                }
                                className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-emerald-500"
                              >
                                <span>
                                  {
                                    link.label
                                  }
                                </span>

                                {external ? (
                                  <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                                ) : null}
                              </Link>
                            </li>
                          );
                        },
                      )}
                    </ul>
                  </nav>
                </div>
              ),
            )}
          </div>

          {/* Divider */}
          <div className="my-8 border-t sm:my-10" />

          {/* Bottom */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                © {currentYear}{" "}
                <span className="font-medium text-foreground">
                  {siteConfig.name}
                </span>
                . All rights
                reserved.
              </p>

              <p className="text-xs text-muted-foreground">
                Full-stack
                developer portfolio.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* CV */}
              <a
                href="/cv.pdf"
                download="richard_dela_peña_cv.pdf"
                aria-label="Download CV"
                title="Download CV"
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-all duration-300 hover:border-dashed hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-500"
              >
                <Download className="size-4" />
              </a>

              {/* Email */}
              <Link
                href={
                  siteConfig.links.email
                }
                aria-label="Email"
                title="Email"
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-all duration-300 hover:border-dashed hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-500"
              >
                <Mail className="size-4" />
              </Link>

              {/* LinkedIn */}
              <Link
                href={
                  siteConfig.links.linkedin
                }
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-all duration-300 hover:border-dashed hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-500"
              >
                <FaLinkedin className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}