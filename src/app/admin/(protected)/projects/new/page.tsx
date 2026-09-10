import type { Metadata } from "next"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ProjectForm } from "@/components/admin/project-form"
import { Container } from "@/components/shared/container"

export const metadata: Metadata = {
  title: "New Project",

  robots: {
    index: false,
    follow: false,
  },
}

export default function NewProjectPage() {
  return (
    <Container className="space-y-8 py-8 md:py-10">
      <AdminPageHeader
        title="Create Project"
        description="Add a new project to your portfolio. You can save it as a draft before publishing."
      />

      <ProjectForm mode="create" />
    </Container>
  )
}