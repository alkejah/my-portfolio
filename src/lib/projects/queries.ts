import type { Filter } from "mongodb";

import { parseObjectId } from "@/lib/object-id";
import { projectToDTO } from "@/lib/projects/serialize";
import { getProjectsCollection } from "@/models/project";
import type { ProjectDocument } from "@/types/project";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getAdminDashboardStats() {
  const collection = await getProjectsCollection();

  const [totalProjects, publishedProjects, draftProjects, featuredProjects] =
    await Promise.all([
      collection.countDocuments(),

      collection.countDocuments({
        published: true,
      }),

      collection.countDocuments({
        published: false,
      }),

      collection.countDocuments({
        featured: true,
      }),
    ]);

  return {
    totalProjects,
    publishedProjects,
    draftProjects,
    featuredProjects,
  };
}

export async function getRecentProjects(limit = 5) {
  const collection = await getProjectsCollection();

  const safeLimit = Math.min(Math.max(limit, 1), 20);

  const projects = await collection
    .find({})
    .sort({
      createdAt: -1,
    })
    .limit(safeLimit)
    .toArray();

  return projects.map(projectToDTO);
}

export async function getAdminProjects(search = "") {
  const collection = await getProjectsCollection();

  const query = search.trim();

  let filter: Filter<ProjectDocument> = {};

  if (query) {
    const safeQuery = escapeRegex(query);

    filter = {
      $or: [
        {
          title: {
            $regex: safeQuery,
            $options: "i",
          },
        },
        {
          slug: {
            $regex: safeQuery,
            $options: "i",
          },
        },
        {
          shortDescription: {
            $regex: safeQuery,
            $options: "i",
          },
        },
      ],
    };
  }

  const projects = await collection
    .find(filter)
    .sort({
      featured: -1,
      order: 1,
      createdAt: -1,
    })
    .toArray();

  return projects.map(projectToDTO);
}

export async function getAdminProjectById(id: string) {
  const objectId = parseObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getProjectsCollection();

  const project = await collection.findOne({
    _id: objectId,
  });

  if (!project) {
    return null;
  }

  return projectToDTO(project);
}

export async function getPublishedProjects() {
  const collection = await getProjectsCollection();

  const projects = await collection
    .find({
      published: true,
    })
    .sort({
      featured: -1,
      order: 1,
      createdAt: -1,
    })
    .toArray();

  return projects.map(projectToDTO);
}

export async function getHomepageProjects(limit: number) {
  const collection = await getProjectsCollection();

  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 12));

  const projects = await collection
    .find({
      published: true,
    })
    .sort({
      featured: -1,
      order: 1,
      createdAt: -1,
    })
    .limit(safeLimit)
    .toArray();

  return projects.map(projectToDTO);
}

export async function getLatestPublishedProjectId() {
  const collection = await getProjectsCollection();

  const latestProject = await collection.findOne(
    {
      published: true,
    },
    {
      sort: {
        createdAt: -1,
      },

      projection: {
        _id: 1,
      },
    },
  );

  return latestProject ? latestProject._id.toString() : null;
}

export async function getPublishedProjectsPage(
  requestedPage: number,
  pageSize = 9,
) {
  const collection = await getProjectsCollection();

  const totalProjects = await collection.countDocuments({
    published: true,
  });

  const totalPages = Math.max(1, Math.ceil(totalProjects / pageSize));

  const safeRequestedPage = Number.isFinite(requestedPage)
    ? Math.max(1, Math.floor(requestedPage))
    : 1;

  const page = Math.min(safeRequestedPage, totalPages);

  const projects = await collection
    .find({
      published: true,
    })
    .sort({
      featured: -1,
      order: 1,
      createdAt: -1,
    })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  return {
    projects: projects.map(projectToDTO),

    page,

    pageSize,

    totalProjects,

    totalPages,
  };
}

export async function getPublishedProjectBySlug(slug: string) {
  const collection = await getProjectsCollection();

  const normalizedSlug = slug.trim().toLowerCase();

  if (!normalizedSlug) {
    return null;
  }

  const project = await collection.findOne({
    slug: normalizedSlug,
    published: true,
  });

  if (!project) {
    return null;
  }

  return projectToDTO(project);
}
