import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/shared/container";
import { ProjectCard } from "@/components/shared/project-card";
import { ProjectsPagination } from "@/components/shared/projects-pagination";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  getLatestPublishedProjectId,
  getPublishedProjectsPage,
} from "@/lib/projects/queries";

export const metadata: Metadata = {
  title: "Projects",

  description:
    "Explore my full collection of published web development projects.",
};

export const dynamic = "force-dynamic";

const PROJECTS_PER_PAGE = 9;

type ProjectsPageProps = {
  searchParams: Promise<{
    page?: string | string[] | undefined;
  }>;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params =
    await searchParams;

  const rawPage =
    typeof params.page === "string"
      ? params.page
      : "1";

  const requestedPage =
    Number.parseInt(
      rawPage,
      10,
    );

  const [
    {
      projects,
      page,
      totalPages,
      totalProjects,
    },
    latestProjectId,
  ] = await Promise.all([
    getPublishedProjectsPage(
      requestedPage,
      PROJECTS_PER_PAGE,
    ),

    getLatestPublishedProjectId(),
  ]);

  return (
    <>
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
      >
        <section className="py-16 sm:py-20 lg:py-24">
          <Container className="space-y-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Projects"
                title="All projects."
                description="Explore the complete collection of projects I've published."
              />

              <p className="text-sm text-muted-foreground">
                {totalProjects}{" "}
                {totalProjects === 1
                  ? "project"
                  : "projects"}
              </p>
            </div>

            {projects.length > 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map(
                    (project) => (
                      <ProjectCard
                        key={
                          project.id
                        }
                        project={
                          project
                        }
                        isLatest={
                          project.id ===
                          latestProjectId
                        }
                      />
                    ),
                  )}
                </div>

                <ProjectsPagination
                  page={page}
                  totalPages={
                    totalPages
                  }
                />
              </>
            ) : (
              <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
                <p className="font-medium">
                  No published
                  projects yet.
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  Projects will
                  appear here once
                  they are
                  published.
                </p>
              </div>
            )}
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}