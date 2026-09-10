import type {
  Metadata,
} from "next"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { HomepageProjectSettingsForm } from "@/components/admin/homepage-project-settings-form"
import { Container } from "@/components/shared/container"
import { getSiteSettings } from "@/lib/site-settings"

export const metadata: Metadata = {
  title:
    "Portfolio Settings",

  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminSettingsPage() {
  const settings =
    await getSiteSettings()

  return (
    <Container className="space-y-8 py-8 md:py-10">
      <AdminPageHeader
        title="Settings"
        description="Configure how content is displayed across the public portfolio."
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Homepage Projects
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Configure the
            projects carousel
            shown on the public
            homepage.
          </p>
        </div>

        <HomepageProjectSettingsForm
          initialLimit={
            settings.homepageProjectLimit
          }
        />
      </section>
    </Container>
  )
}