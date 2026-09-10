import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const pricingPlans = [
  {
    name: "Student",
    description:
      "A simple package for students who need a polished project or academic web application.",
    price: "₱3,500",
    priceLabel: "starting at",
    icon: GraduationCap,
    features: [
      "Responsive website",
      "Up to 5 pages",
      "Basic deployment",
      "Email support",
    ],
  },

  {
    name: "Professional",
    description:
      "For professionals and small businesses that need a production-ready digital presence.",
    price: "₱12,000",
    priceLabel: "starting at",
    icon: BriefcaseBusiness,
    featured: true,
    features: [
      "Full-stack application",
      "Custom responsive UI",
      "Database integration",
      "Deployment assistance",
    ],
  },

  {
    name: "Enterprise",
    description:
      "For larger and more complex systems requiring custom architecture and ongoing collaboration.",
    price: "Custom",
    priceLabel: "pricing",
    icon: Building2,
    features: [
      "Custom architecture",
      "Advanced integrations",
      "Scalable backend",
      "Priority collaboration",
    ],
  },
] as const;

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="scroll-mt-16 border-t"
    >
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="space-y-10">
          <SectionHeading
            eyebrow="Pricing"
            title="Choose a plan that fits."
            description="Flexible starting packages for students, professionals, and larger projects. Final pricing depends on project scope and requirements."
          />

          <div className="grid items-stretch gap-5 md:grid-cols-3">
            {pricingPlans.map(
              (plan) => {
                const Icon =
                  plan.icon;

                return (
                  <article
                    key={
                      plan.name
                    }
                    className="group flex h-full origin-center flex-col rounded-2xl border-2 border-dashed border-emerald-500/50 bg-card p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:scale-[1.01] hover:border-emerald-500/80 hover:shadow-[inset_0_0_40px_rgba(16,185,129,0.16)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex size-11 items-center justify-center rounded-xl border border-dashed border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                        <Icon className="size-5" />
                      </div>

                      {"featured" in
                        plan &&
                      plan.featured ? (
                        <span className="rounded-full border border-dashed border-emerald-500/60 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                          Popular
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-6">
                      <h3 className="text-2xl font-semibold tracking-tight">
                        {
                          plan.name
                        }
                      </h3>

                      <p className="mt-2 min-h-20 text-sm leading-6 text-muted-foreground">
                        {
                          plan.description
                        }
                      </p>
                    </div>

                    <div className="mt-6 border-y border-dashed py-5">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {
                          plan.priceLabel
                        }
                      </p>

                      <p className="mt-1 text-3xl font-bold tracking-tight">
                        {
                          plan.price
                        }
                      </p>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map(
                        (
                          feature,
                        ) => (
                          <li
                            key={
                              feature
                            }
                            className="flex items-center gap-3 text-sm"
                          >
                            <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />

                            <span>
                              {
                                feature
                              }
                            </span>
                          </li>
                        ),
                      )}
                    </ul>

                    <div className="mt-auto pt-8">
                      <Link
                        href="/#contact"
                        className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 text-sm font-medium text-emerald-700 transition-all hover:border-dashed hover:border-emerald-500/70 hover:bg-emerald-500/20 dark:text-emerald-300 dark:hover:text-emerald-200"
                      >
                        Get Started

                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </article>
                );
              },
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Pricing shown is
            preliminary and may
            vary depending on
            project complexity,
            features, and timeline.
          </p>
        </div>
      </Container>
    </section>
  );
}