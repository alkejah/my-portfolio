import type {
  Collection,
} from "mongodb"

import { getDatabase } from "@/lib/mongodb"

type ContactRateLimitDocument = {
  key: string
  createdAt: Date
}

const COLLECTION_NAME =
  "contact_rate_limits"

const EXPIRE_AFTER_SECONDS =
  60 * 60

let indexesPromise:
  | Promise<void>
  | null = null

async function ensureIndexes(
  collection: Collection<ContactRateLimitDocument>
) {
  if (!indexesPromise) {
    indexesPromise = Promise.all([
      collection.createIndex(
        {
          createdAt: 1,
        },
        {
          name:
            "contact_rate_limit_ttl",

          expireAfterSeconds:
            EXPIRE_AFTER_SECONDS,
        }
      ),

      collection.createIndex(
        {
          key: 1,
          createdAt: -1,
        },
        {
          name:
            "contact_rate_limit_lookup",
        }
      ),
    ])
      .then(() => undefined)
      .catch((error) => {
        indexesPromise = null
        throw error
      })
  }

  await indexesPromise
}

export async function getContactRateLimitCollection() {
  const db = await getDatabase()

  const collection =
    db.collection<ContactRateLimitDocument>(
      COLLECTION_NAME
    )

  await ensureIndexes(collection)

  return collection
}