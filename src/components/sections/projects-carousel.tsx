"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProjectCard } from "@/components/shared/project-card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { ProjectDTO } from "@/types/project";

type ProjectsCarouselProps = {
  projects: ProjectDTO[];
  latestProjectId: string | null;
};

const MINIMUM_LOOP_PROJECTS = 5;

export function ProjectsCarousel({
  projects,
  latestProjectId,
}: ProjectsCarouselProps) {
  const carouselProjects = React.useMemo(() => {
    if (projects.length === 0 || projects.length >= MINIMUM_LOOP_PROJECTS) {
      return projects;
    }

    const repeatCount = Math.ceil(MINIMUM_LOOP_PROJECTS / projects.length);

    return Array.from({
      length: repeatCount,
    })
      .flatMap(() => projects)
      .slice(0, Math.max(MINIMUM_LOOP_PROJECTS, projects.length * 2));
  }, [projects]);

  const [api, setApi] = React.useState<CarouselApi>();

  const [selectedSnap, setSelectedSnap] = React.useState(0);

  const [autoplay] = React.useState(() =>
    Autoplay({
      delay: 3500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,

      breakpoints: {
        "(prefers-reduced-motion: reduce)": {
          active: false,
        },
      },
    }),
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setSelectedSnap(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);

      api.off("reInit", handleSelect);
    };
  }, [api]);

  const snapCount = projects.length;

  return (
    <div className="space-y-4">
      <Carousel
        setApi={setApi}
        plugins={[autoplay]}
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 1,
        }}
        className="w-full"
      >
        <div className="relative">
          <CarouselContent className="-ml-3 items-stretch py-2 md:-ml-4">
            {carouselProjects.map((project, index) => (
              <CarouselItem
                key={`${project.id}-${index}`}
                className="flex basis-[88%] pl-3 sm:basis-[58%] md:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-[30%]"
              >
                <div className="h-full w-full px-1">
                  <ProjectCard
                    project={project}
                    eagerCover={index === 0}
                    isLatest={project.id === latestProjectId}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {projects.length > 1 ? (
            <>
              {/* Previous */}
              <div className="pointer-events-none absolute inset-y-0 left-0 z-30 flex items-center">
                <button
                  type="button"
                  aria-label="Previous projects"
                  onClick={() => api?.scrollPrev()}
                  className="pointer-events-auto ml-2 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur-md transition-all duration-300 hover:border-dashed hover:border-emerald-500/70 hover:bg-emerald-500/15 hover:text-emerald-600 hover:shadow-[inset_0_0_18px_rgba(16,185,129,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:hover:text-emerald-300 sm:ml-0 sm:-translate-x-1/2"
                >
                  <ChevronLeft className="size-4" />
                </button>
              </div>

              {/* Next */}
              <div className="pointer-events-none absolute inset-y-0 right-0 z-30 flex items-center">
                <button
                  type="button"
                  aria-label="Next projects"
                  onClick={() => api?.scrollNext()}
                  className="pointer-events-auto mr-2 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur-md transition-all duration-300 hover:border-dashed hover:border-emerald-500/70 hover:bg-emerald-500/15 hover:text-emerald-600 hover:shadow-[inset_0_0_18px_rgba(16,185,129,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:hover:text-emerald-300 sm:mr-0 sm:translate-x-1/2"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </>
          ) : null}
        </div>
      </Carousel>

      {projects.length > 1 ? (
        <div
          className="flex h-4 items-center justify-center gap-2"
          aria-label="Project carousel pages"
        >
          {Array.from({
            length: snapCount,
          }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to carousel page ${index + 1}`}
              aria-current={
                selectedSnap % projects.length === index ? "true" : undefined
              }
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2 rounded-full transition-[width,background-color] duration-300",

                selectedSnap % projects.length === index
                  ? "w-6 bg-foreground"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
