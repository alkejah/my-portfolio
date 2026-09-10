import { ArrowRight, ExternalLink, Sparkles, Star, Users } from "lucide-react";

import Link from "next/link";
import { SiGithub } from "react-icons/si";

import { ProjectCoverImage } from "@/components/shared/project-cover-image";
import { TechIcon } from "@/components/shared/tech-icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { ProjectDTO } from "@/types/project";

type ProjectCardProps = {
  project: ProjectDTO;
  eagerCover?: boolean;
  isLatest?: boolean;
};

const MAX_VISIBLE_TECHNOLOGIES = 4;

export function ProjectCard({
  project,
  eagerCover = false,
  isLatest = false,
}: ProjectCardProps) {
  const visibleTechnologies = project.technologies.slice(
    0,
    MAX_VISIBLE_TECHNOLOGIES,
  );

  const remainingTechnologyCount = Math.max(
    0,
    project.technologies.length - visibleTechnologies.length,
  );

  return (
    <article className="group flex h-full origin-center flex-col overflow-hidden rounded-xl border-2 border-solid border-border/60 bg-card shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:scale-[1.01] hover:border-dashed hover:border-emerald-500/80 hover:shadow-[inset_0_0_40px_rgba(16,185,129,0.22)]">
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`View ${project.title}`}
        className="block"
      >
        <ProjectCoverImage
          image={project.coverImage}
          title={project.title}
          eager={eagerCover}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3.5 p-4">
        <div className="space-y-2.5">
          {isLatest || project.featured || project.contributor ? (
            <div className="flex flex-wrap items-center gap-2">
              {isLatest ? (
                <Badge className="border border-dashed border-emerald-500/60 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300">
                  <Sparkles className="size-3" />
                  Latest
                </Badge>
              ) : null}

              {project.featured ? (
                <Badge className="border border-dashed border-amber-500/60 bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300">
                  <Star className="size-3" />
                  Featured
                </Badge>
              ) : null}

              {project.contributor ? (
                <Badge className="border border-dashed border-sky-500/60 bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 dark:text-sky-300">
                  <Users className="size-3" />
                  Contributor
                </Badge>
              ) : null}
            </div>
          ) : null}

          <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
            <Link
              href={`/projects/${project.slug}`}
              className="transition-opacity hover:opacity-70"
            >
              {project.title}
            </Link>
          </h3>
        </div>

        {visibleTechnologies.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {visibleTechnologies.map((technology) => (
              <div
                key={`${technology.name}-${technology.iconKey}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-emerald-500/50 bg-emerald-500/5 px-2.5 py-1 text-xs font-medium"
              >
                <TechIcon
                  iconKey={technology.iconKey}
                  name={technology.name}
                  className="size-3.5"
                />

                <span>{technology.name}</span>
              </div>
            ))}

            {remainingTechnologyCount > 0 ? (
              <span className="inline-flex items-center rounded-full border border-dashed border-emerald-500/50 bg-emerald-500/5 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                +{remainingTechnologyCount}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 border-t pt-3.5">
          <Link
            href={`/projects/${project.slug}`}
            className={buttonVariants({
              size: "sm",
            })}
          >
            View Project
            <ArrowRight className="size-4" />
          </Link>

          {project.liveUrl ? (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open live version of ${project.title}`}
              className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur-md transition-all hover:border-emerald-500/70 hover:bg-emerald-500/20 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:text-emerald-300 dark:hover:text-emerald-200"
            >
              <ExternalLink className="size-4" />
              Live
            </Link>
          ) : null}

          {project.repositoryUrl ? (
            <Link
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open source code for ${project.title}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
              })}
            >
              <SiGithub className="size-4" />
              Source
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
