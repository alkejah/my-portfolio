import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import { ContactForm } from "@/components/sections/contact-form";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/config/site";

const contactLinks = [
  {
    label: "Email",
    description: "Send me a message directly",
    href: siteConfig.links.email,
    icon: Mail,
  },

  {
    label: "LinkedIn",
    description: "Connect professionally",
    href: siteConfig.links.linkedin,
    icon: FaLinkedin,
  },
];

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-16 border-t lg:h-[calc(100svh-4rem)]"
    >
      <Container className="flex min-h-[calc(100svh-4rem)] w-full flex-col justify-center py-8 sm:py-10 lg:h-full lg:min-h-0 lg:py-8">
        <div className="space-y-7">
          <SectionHeading
            eyebrow="Let's Connect"
            title="Have a project or opportunity in mind?"
            description="Send me a message about a project, collaboration, opportunity, or anything else you'd like to discuss."
          />

          <div className="grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <ContactForm />

            <div className="space-y-3">
              {contactLinks.map((item) => {
                const Icon = item.icon;

                const external = !item.href.startsWith("mailto:");

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="group flex items-center justify-between gap-4 rounded-xl border p-3.5 transition-all duration-300 hover:border-dashed hover:border-emerald-500/60 hover:bg-emerald-500/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-emerald-500/10">
                        <Icon className="size-5 transition-colors group-hover:text-emerald-500" />
                      </div>

                      <div>
                        <p className="font-medium">{item.label}</p>

                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
