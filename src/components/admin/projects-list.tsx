import {
  Pencil,
  Plus,
} from "lucide-react"
import Link from "next/link"

import { DeleteProjectButton } from "@/components/admin/delete-project-button"
import { ProjectStatus } from "@/components/admin/project-status"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ProjectDTO } from "@/types/project"

type ProjectsListProps = {
  projects: ProjectDTO[]
  searchQuery?: string
}

function formatProjectDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(new Date(date))
}

export function ProjectsList({
  projects,
  searchQuery = "",
}: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="max-w-md space-y-3">
            <h2 className="text-lg font-semibold">
              {searchQuery
                ? "No matching projects"
                : "No projects yet"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? `No projects matched "${searchQuery}". Try another search term.`
                : "Create your first portfolio project to begin building your project showcase."}
            </p>

            {!searchQuery ? (
              <div className="pt-2">
                <Link
                  href="/admin/projects/new"
                  className={buttonVariants()}
                >
                  <Plus className="size-4" />

                  Create project
                </Link>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Project
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Technologies
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Order
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Created
                </th>

                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="max-w-80 px-4 py-4 align-top">
                    <div className="space-y-1">
                      <p className="truncate font-medium">
                        {project.title}
                      </p>

                      <p className="truncate font-mono text-xs text-muted-foreground">
                        /{project.slug}
                      </p>

                      <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {
                          project.shortDescription
                        }
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <ProjectStatus
                      published={
                        project.published
                      }
                      featured={
                        project.featured
                      }
                    />
                  </td>

                  <td className="px-4 py-4 align-top">
                    <span className="text-muted-foreground">
                      {
                        project
                          .technologies
                          .length
                      }
                    </span>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <span className="text-muted-foreground">
                      {project.order}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 align-top text-muted-foreground">
                    {formatProjectDate(
                      project.createdAt
                    )}
                  </td>

                  <td className="px-4 py-4 align-top">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className={cn(
                          buttonVariants({
                            variant:
                              "outline",
                            size: "sm",
                          })
                        )}
                      >
                        <Pencil className="size-4" />

                        Edit
                      </Link>

                      <DeleteProjectButton
                        projectId={
                          project.id
                        }
                        projectTitle={
                          project.title
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="grid gap-4 md:hidden">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="space-y-5 p-5">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">
                      {project.title}
                    </h2>

                    <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                      /{project.slug}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    #{project.order}
                  </span>
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {
                    project.shortDescription
                  }
                </p>
              </div>

              <ProjectStatus
                published={project.published}
                featured={project.featured}
              />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Technologies
                  </p>

                  <p className="mt-1 font-medium">
                    {
                      project
                        .technologies
                        .length
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Created
                  </p>

                  <p className="mt-1 font-medium">
                    {formatProjectDate(
                      project.createdAt
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                  })}
                >
                  <Pencil className="size-4" />

                  Edit
                </Link>

                <DeleteProjectButton
                  projectId={project.id}
                  projectTitle={
                    project.title
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}