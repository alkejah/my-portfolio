import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProjectsCarousel } from "@/components/sections/projects-carousel";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import type { ProjectDTO } from "@/types/project";

type ProjectsSectionProps = {
  projects: ProjectDTO[];
  latestProjectId: string | null;
};
export function ProjectsSection({
  projects,
  latestProjectId,
}: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="scroll-mt-16 border-t lg:h-[calc(100svh-4rem)]"
    >
      <Container className="flex min-h-[calc(100svh-4rem)] w-full flex-col justify-center py-8 sm:py-10 lg:h-full lg:min-h-0 lg:py-6">
        <div className="space-y-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Selected Work"
              title="Projects I've built and contributed with."
              description="A selection of applications and experiences I've designed and developed."
            />

            {projects.length > 0 ? (
              <Link
                href="/projects"
                className={buttonVariants({
                  variant: "outline",
                })}
              >
                View All Projects
                <ArrowRight className="size-4" />
              </Link>
            ) : null}
          </div>

          {projects.length > 0 ? (
            <ProjectsCarousel
              projects={projects}
              latestProjectId={latestProjectId}
            />
          ) : (
            <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
              <p className="font-medium">Projects coming soon.</p>

              <p className="mt-2 text-sm text-muted-foreground">
                Published projects will appear here.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
