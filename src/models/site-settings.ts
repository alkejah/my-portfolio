import type {
  Collection,
} from "mongodb"

import { getDatabase } from "@/lib/mongodb"
import type {
  SiteSettingsDocument,
} from "@/types/site-settings"

const COLLECTION_NAME =
  "site_settings"

let indexesPromise:
  | Promise<void>
  | null = null

async function ensureIndexes(
  collection:
    Collection<SiteSettingsDocument>
) {
  if (!indexesPromise) {
    indexesPromise =
      collection
        .createIndex(
          {
            key: 1,
          },
          {
            unique: true,

            name:
              "site_settings_key_unique",
          }
        )
        .then(() => undefined)
        .catch((error) => {
          indexesPromise = null

          throw error
        })
  }

  await indexesPromise
}

export async function getSiteSettingsCollection() {
  const db =
    await getDatabase()

  const collection =
    db.collection<SiteSettingsDocument>(
      COLLECTION_NAME
    )

  await ensureIndexes(
    collection
  )

  return collection
}