import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ProjectDTO } from "@/types/project"

type RecentProjectsProps = {
  projects: ProjectDTO[]
}

function formatProjectDate(
  date: string
) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function RecentProjects({
  projects,
}: RecentProjectsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>
              Recent Projects
            </CardTitle>

            <CardDescription>
              Your most recently created
              portfolio projects.
            </CardDescription>
          </div>

          <Link
            href="/admin/projects"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
          >
            Manage projects

            <ArrowRight className="size-4" />
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-10 text-center">
            <p className="font-medium">
              No projects yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your recently created projects
              will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {project.title}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span>
                      {formatProjectDate(
                        project.createdAt
                      )}
                    </span>

                    <span>
                      {
                        project
                          .technologies
                          .length
                      }{" "}
                      technologies
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={
                      project.published
                        ? "default"
                        : "secondary"
                    }
                  >
                    {project.published
                      ? "Published"
                      : "Draft"}
                  </Badge>

                  {project.featured ? (
                    <Badge variant="outline">
                      Featured
                    </Badge>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}