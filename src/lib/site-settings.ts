import { getSiteSettingsCollection } from "@/models/site-settings"
import type {
  SiteSettingsDTO,
} from "@/types/site-settings"

export const DEFAULT_HOMEPAGE_PROJECT_LIMIT =
  6

export const MIN_HOMEPAGE_PROJECT_LIMIT =
  1

export const MAX_HOMEPAGE_PROJECT_LIMIT =
  12

export async function getSiteSettings(): Promise<SiteSettingsDTO> {
  const collection =
    await getSiteSettingsCollection()

  const settings =
    await collection.findOne({
      key: "portfolio",
    })

  return {
    homepageProjectLimit:
      settings
        ?.homepageProjectLimit ??
      DEFAULT_HOMEPAGE_PROJECT_LIMIT,
  }
}

export async function updateHomepageProjectLimit(
  homepageProjectLimit: number
): Promise<SiteSettingsDTO> {
  const collection =
    await getSiteSettingsCollection()

  const now =
    new Date()

  await collection.updateOne(
    {
      key: "portfolio",
    },

    {
      $set: {
        homepageProjectLimit,
        updatedAt: now,
      },

      $setOnInsert: {
        key: "portfolio",
        createdAt: now,
      },
    },

    {
      upsert: true,
    }
  )

  return {
    homepageProjectLimit,
  }
}