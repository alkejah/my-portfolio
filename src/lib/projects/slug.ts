import type {
  Collection,
  Filter,
  ObjectId,
} from "mongodb"

import type { ProjectDocument } from "@/types/project"

export function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "project"
}

export async function generateUniqueProjectSlug(
  collection: Collection<ProjectDocument>,
  title: string,
  excludeId?: ObjectId
) {
  const baseSlug = slugify(title)

  let candidate = baseSlug
  let suffix = 2

  while (true) {
    const filter: Filter<ProjectDocument> =
      excludeId
        ? {
            slug: candidate,
            _id: {
              $ne: excludeId,
            },
          }
        : {
            slug: candidate,
          }

    const existingProject =
      await collection.findOne(filter, {
        projection: {
          _id: 1,
        },
      })

    if (!existingProject) {
      return candidate
    }

    candidate = `${baseSlug}-${suffix}`
    suffix += 1
  }
}