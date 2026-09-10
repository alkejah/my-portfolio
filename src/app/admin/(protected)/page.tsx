import type { Metadata } from "next"
import {
  Eye,
  FilePenLine,
  FolderKanban,
  Star,
} from "lucide-react"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { RecentProjects } from "@/components/admin/recent-projects"
import { StatCard } from "@/components/admin/stat-card"
import { Container } from "@/components/shared/container"
import {
  getAdminDashboardStats,
  getRecentProjects,
} from "@/lib/projects/queries"

export const metadata: Metadata = {
  title: "Admin Dashboard",

  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminPage() {
  const [
    stats,
    recentProjects,
  ] = await Promise.all([
    getAdminDashboardStats(),
    getRecentProjects(5),
  ])

  return (
    <Container className="space-y-8 py-8 md:py-10">
      <AdminPageHeader
        title="Dashboard"
        description="An overview of your portfolio projects and publishing activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          description="All portfolio projects"
          icon={FolderKanban}
        />

        <StatCard
          title="Published"
          value={stats.publishedProjects}
          description="Visible on your portfolio"
          icon={Eye}
        />

        <StatCard
          title="Drafts"
          value={stats.draftProjects}
          description="Not publicly visible"
          icon={FilePenLine}
        />

        <StatCard
          title="Featured"
          value={stats.featuredProjects}
          description="Marked as featured"
          icon={Star}
        />
      </div>

      <RecentProjects
        projects={recentProjects}
      />
    </Container>
  )
}