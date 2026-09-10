import { z } from "zod"

import {
  MAX_HOMEPAGE_PROJECT_LIMIT,
  MIN_HOMEPAGE_PROJECT_LIMIT,
} from "@/lib/site-settings"

export const homepageSettingsSchema =
  z.strictObject({
    homepageProjectLimit:
      z.coerce
        .number()
        .int()
        .min(
          MIN_HOMEPAGE_PROJECT_LIMIT,
          {
            error:
              `Show at least ${MIN_HOMEPAGE_PROJECT_LIMIT} project.`,
          }
        )
        .max(
          MAX_HOMEPAGE_PROJECT_LIMIT,
          {
            error:
              `You can show at most ${MAX_HOMEPAGE_PROJECT_LIMIT} projects.`,
          }
        ),
  })