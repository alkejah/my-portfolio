import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, Sparkles, Star, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiGithub } from "react-icons/si";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/shared/container";
import { ProjectDetailImage } from "@/components/shared/project-detail-image";
import { ProjectFeature } from "@/components/shared/project-feature";
import { TechIcon } from "@/components/shared/tech-icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getLatestPublishedProjectId,
  getPublishedProjectBySlug,
} from "@/lib/projects/queries";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: project.title,

    description: project.shortDescription,

    alternates: {
      canonical: `/projects/${project.slug}`,
    },

    openGraph: {
      title: project.title,

      description: project.shortDescription,

      url: `/projects/${project.slug}`,

      type: "article",

      images: project.coverImage
        ? [
            {
              url: project.coverImage.url,

              alt: project.coverImage.alt,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  const [project, latestProjectId] = await Promise.all([
    getPublishedProjectBySlug(slug),

    getLatestPublishedProjectId(),
  ]);

  if (!project) {
    notFound();
  }

  const isLatest = project.id === latestProjectId;

  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        <section className="border-b">
          <Container className="py-12 sm:py-16 lg:py-20">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to projects
            </Link>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="space-y-6">
                {isLatest || project.featured || project.contributor ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {isLatest ? (
                      <Badge className="border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300">
                        <Sparkles className="size-3" />
                        Latest
                      </Badge>
                    ) : null}

                    {project.featured ? (
                      <Badge className="border border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300">
                        <Star className="size-3" />
                        Featured
                      </Badge>
                    ) : null}

                    {project.contributor ? (
                      <Badge className="border border-sky-500/40 bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 dark:text-sky-300">
                        <Users className="size-3" />
                        Contributor
                      </Badge>
                    ) : null}
                  </div>
                ) : null}

                <div className="space-y-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                      {project.title}
                    </h1>

                    {project.contributor && project.contributorRole ? (
                      <span className="text-base font-normal text-muted-foreground sm:text-lg lg:text-xl">
                        / {project.contributorRole}
                      </span>
                    ) : null}
                  </div>

                  <p className="max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
                    {project.shortDescription}
                  </p>
                </div>
              </div>

              {project.liveUrl || project.repositoryUrl ? (
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  {project.liveUrl ? (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({
                        size: "lg",
                      })}
                    >
                      <ExternalLink className="size-4" />
                      Live Project
                    </Link>
                  ) : null}

                  {project.repositoryUrl ? (
                    <Link
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({
                        variant: "outline",

                        size: "lg",
                      })}
                    >
                      <SiGithub className="size-4" />
                      Source Code
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-14">
          <Container>
            <ProjectDetailImage
              image={project.coverImage}
              title={project.title}
              eager
            />
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_0.6fr]">
              <div className="space-y-6">
                <p className="font-mono text-sm font-medium text-muted-foreground">
                  About the Project
                </p>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Project Overview
                </h2>

                <div className="whitespace-pre-line text-base leading-8 text-muted-foreground sm:text-lg">
                  {project.description}
                </div>
              </div>

              <aside className="space-y-5">
                <p className="font-mono text-sm font-medium text-muted-foreground">
                  Technology Stack
                </p>

                {project.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <div
                        key={`${technology.name}-${technology.iconKey}`}
                        className="inline-flex items-center gap-2 rounded-full border border-dashed border-emerald-500/50 bg-emerald-500/5 px-3 py-2 text-sm font-medium"
                      >
                        <TechIcon
                          iconKey={technology.iconKey}
                          name={technology.name}
                          className="size-4"
                        />

                        <span>{technology.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Technology details are not available.
                  </p>
                )}
              </aside>
            </div>
          </Container>
        </section>

        {project.screenshots.length > 0 ? (
          <section className="border-t py-16 sm:py-20 lg:py-24">
            <Container className="space-y-12">
              <div className="max-w-2xl space-y-4">
                <p className="font-mono text-sm font-medium text-muted-foreground">
                  Key Features
                </p>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Inside the project.
                </h2>

                <p className="leading-7 text-muted-foreground sm:text-lg">
                  A closer look at the features and interfaces that make up this
                  project.
                </p>
              </div>

              <div className="space-y-16">
                {project.screenshots.map((screenshot, index) => (
                  <ProjectFeature
                    key={`${screenshot.url}-${index}`}
                    screenshot={screenshot}
                    index={index}
                  />
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        <section className="border-t py-16 sm:py-20">
          <Container>
            <div className="flex flex-col gap-6 rounded-2xl border bg-muted/30 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xl font-semibold">
                  Explore more of my work.
                </p>

                <p className="mt-2 text-muted-foreground">
                  Return to the portfolio to see my other projects.
                </p>
              </div>

              <Link
                href="/#projects"
                className={buttonVariants({
                  variant: "outline",
                })}
              >
                <ArrowLeft className="size-4" />
                All Projects
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
