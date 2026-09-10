import type { ProjectDTO, ProjectWithId } from "@/types/project";

export function projectToDTO(project: ProjectWithId): ProjectDTO {
  const { _id, ...rest } = project;

  return {
    ...rest,

    contributor: rest.contributor ?? false,

    contributorRole: rest.contributorRole ?? null,

    id: _id.toString(),

    createdAt: project.createdAt.toISOString(),

    updatedAt: project.updatedAt.toISOString(),
  };
}
