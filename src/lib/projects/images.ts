import type {
  ProjectDocument,
  ProjectDTO,
} from "@/types/project"

type ProjectMediaSource =
  | ProjectDocument
  | ProjectDTO

export function getProjectImagePublicIds(
  project: ProjectMediaSource
) {
  const publicIds: string[] = []

  if (project.coverImage?.publicId) {
    publicIds.push(
      project.coverImage.publicId
    )
  }

  for (const screenshot of project.screenshots) {
    if (screenshot.publicId) {
      publicIds.push(
        screenshot.publicId
      )
    }
  }

  return [...new Set(publicIds)]
}