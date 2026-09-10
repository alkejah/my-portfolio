import { ArrowDown, ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[calc(100svh-4rem)] scroll-mt-16 overflow-hidden"
    >
      {/* Original background shading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/3 size-[30rem] -translate-x-1/2 rounded-full bg-muted/60 blur-3xl" />
      </div>

      <Container className="flex min-h-[calc(100svh-4rem)] flex-col py-8 sm:py-10 lg:py-12">
        {/* Main hero content */}
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* Left side */}
          <div className="max-w-4xl space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-emerald-500/50 bg-emerald-500/5 px-3 py-1.5 text-sm font-medium text-foreground">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.75)]" />
              Full-Stack Development
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl font-bold tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">
                Welcome to RCRDO Labs.
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                I&apos;m {siteConfig.name}, a full-stack developer focused on
                building scalable, responsive, and thoughtfully designed web
                applications.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/#projects"
                className={buttonVariants({
                  size: "lg",
                })}
              >
                View Projects
                <ArrowRight className="size-4" />
              </Link>

              <a
                href="/cv.pdf"
                download="richard_dela_peña_cv.pdf"
                className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-emerald-500/40 bg-emerald-500/10 px-6 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur-md transition-all hover:border-emerald-500/70 hover:bg-emerald-500/20 hover:text-emerald-800 hover:shadow-[0_0_24px_rgba(16,185,129,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:text-emerald-300 dark:hover:text-emerald-200"
              >
                <Download className="size-4" />
                Download CV
              </a>
            </div>
          </div>

          {/* Right side — floating logo */}
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
            <div className="hero-logo-float relative">
              <Image
                src="/images/logo.png"
                alt={`${siteConfig.name} logo`}
                width={560}
                height={560}
                loading="eager"
                className="h-auto w-[285px] object-contain drop-shadow-2xl sm:w-[345px] lg:w-[410px] xl:w-[450px]"
              />
            </div>
          </div>
        </div>

        {/* Bottom centered explore link */}
        <div className="flex justify-center pt-4 sm:pt-6">
          <Link
            href="/#projects"
            aria-label="Scroll to projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Explore my work
            <ArrowDown className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}