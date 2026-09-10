import type { Metadata } from "next"
import {
  Plus,
  Search,
} from "lucide-react"
import Link from "next/link"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ProjectsList } from "@/components/admin/projects-list"
import { Container } from "@/components/shared/container"
import {
  Button,
  buttonVariants,
} from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAdminProjects } from "@/lib/projects/queries"

export const metadata: Metadata = {
  title: "Projects",

  robots: {
    index: false,
    follow: false,
  },
}

type AdminProjectsPageProps = {
  searchParams: Promise<{
    q?:
      | string
      | string[]
      | undefined

    status?:
      | string
      | string[]
      | undefined
  }>
}

export default async function AdminProjectsPage({
  searchParams,
}: AdminProjectsPageProps) {
  const params = await searchParams

  const query =
    typeof params.q === "string"
      ? params.q.trim()
      : ""

  const status =
    typeof params.status === "string"
      ? params.status
      : ""

  const statusMessage =
    status === "created"
      ? "Project created successfully."
      : status === "updated"
        ? "Project updated successfully."
        : null

  const projects =
    await getAdminProjects(query)

  return (
    <Container className="space-y-8 py-8 md:py-10">
      <AdminPageHeader
        title="Projects"
        description="Create, edit, publish, feature, and remove portfolio projects."
        action={
          <Link
            href="/admin/projects/new"
            className={buttonVariants()}
          >
            <Plus className="size-4" />

            New Project
          </Link>
        }
      />

      {statusMessage ? (
        <div
          role="status"
          className="rounded-lg border bg-muted/40 px-4 py-3 text-sm"
        >
          {statusMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          action="/admin/projects"
          method="get"
          className="flex w-full max-w-xl flex-col gap-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search projects..."
              className="pl-9"
            />
          </div>

          <Button
            type="submit"
            variant="outline"
          >
            Search
          </Button>

          {query ? (
            <Link
              href="/admin/projects"
              className={buttonVariants({
                variant: "ghost",
              })}
            >
              Clear
            </Link>
          ) : null}
        </form>

        <p className="shrink-0 text-sm text-muted-foreground">
          {projects.length}{" "}
          {projects.length === 1
            ? "project"
            : "projects"}
        </p>
      </div>

      <ProjectsList
        projects={projects}
        searchQuery={query}
      />
    </Container>
  )
}