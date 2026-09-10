import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getPublishedProjects } from "@/lib/projects/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/+$/, "");

  const projects = await getPublishedProjects();

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,

    lastModified: new Date(project.updatedAt),

    changeFrequency: "monthly",

    priority: project.featured ? 0.9 : 0.7,
  }));

  return [
    {
      url: baseUrl,

      changeFrequency: "weekly",

      priority: 1,
    },

    {
      url: `${baseUrl}/projects`,

      changeFrequency: "weekly",

      priority: 0.9,
    },

    ...projectEntries,
  ];
}
