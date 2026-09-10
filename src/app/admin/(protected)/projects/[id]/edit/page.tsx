import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ProjectForm } from "@/components/admin/project-form"
import { Container } from "@/components/shared/container"
import { getAdminProjectById } from "@/lib/projects/queries"

export const metadata: Metadata = {
  title: "Edit Project",

  robots: {
    index: false,
    follow: false,
  },
}

type EditProjectPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params

  const project =
    await getAdminProjectById(id)

  if (!project) {
    notFound()
  }

  return (
    <Container className="space-y-8 py-8 md:py-10">
      <AdminPageHeader
        title={`Edit ${project.title}`}
        description="Update the project's information, screenshots, technology stack, links, and publishing settings."
      />

      <ProjectForm
        mode="edit"
        project={project}
      />
    </Container>
  )
}