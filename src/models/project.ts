import type { Collection } from "mongodb"

import { getDatabase } from "@/lib/mongodb"
import type { ProjectDocument } from "@/types/project"

export const PROJECTS_COLLECTION_NAME = "projects"

let projectIndexesPromise: Promise<void> | null = null

async function ensureProjectIndexes(
  collection: Collection<ProjectDocument>
) {
  if (!projectIndexesPromise) {
    projectIndexesPromise = Promise.all([
      collection.createIndex(
        {
          slug: 1,
        },
        {
          name: "projects_slug_unique",
          unique: true,
        }
      ),

      collection.createIndex(
        {
          published: 1,
          featured: -1,
          order: 1,
          createdAt: -1,
        },
        {
          name: "projects_public_listing",
        }
      ),
    ])
      .then(() => undefined)
      .catch((error) => {
        projectIndexesPromise = null
        throw error
      })
  }

  await projectIndexesPromise
}

export async function getProjectsCollection() {
  const db = await getDatabase()

  const collection = db.collection<ProjectDocument>(
    PROJECTS_COLLECTION_NAME
  )

  await ensureProjectIndexes(collection)

  return collection
}