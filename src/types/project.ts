import type { WithId } from "mongodb";

export type ProjectImage = {
  url: string;
  publicId: string | null;
  alt: string;
};

export type ProjectScreenshot = ProjectImage & {
  title: string;
  description: string;
};

export type ProjectTechnology = {
  name: string;
  iconKey: string;
};

export type ProjectDocument = {
  title: string;
  slug: string;

  shortDescription: string;
  description: string;

  coverImage: ProjectImage | null;
  screenshots: ProjectScreenshot[];

  technologies: ProjectTechnology[];

  liveUrl: string | null;
  repositoryUrl: string | null;

  contributor: boolean;
  contributorRole: string | null;

  featured: boolean;
  published: boolean;

  order: number;

  createdAt: Date;
  updatedAt: Date;
};

export type ProjectWithId = WithId<ProjectDocument>;

export type CreateProjectInput = Omit<
  ProjectDocument,
  "slug" | "createdAt" | "updatedAt"
>;

export type UpdateProjectInput = Partial<CreateProjectInput>;

export type ProjectDTO = Omit<ProjectDocument, "createdAt" | "updatedAt"> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
