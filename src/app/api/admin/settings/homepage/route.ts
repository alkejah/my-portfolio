import {
  NextResponse,
} from "next/server"

import {
  getAdminSession,
} from "@/lib/auth/session"
import {
  apiError,
  apiValidationError,
} from "@/lib/api"
import {
  getSiteSettings,
  updateHomepageProjectLimit,
} from "@/lib/site-settings"
import {
  homepageSettingsSchema,
} from "@/lib/validations/site-settings"

export const runtime =
  "nodejs"

export async function GET() {
  const session =
    await getAdminSession()

  if (!session) {
    return apiError(
      "Unauthorized.",
      401
    )
  }

  try {
    const settings =
      await getSiteSettings()

    return NextResponse.json({
      success: true,

      data: settings,
    })
  } catch (error) {
    console.error(
      "GET homepage settings error:",
      error
    )

    return apiError(
      "Unable to load settings.",
      500
    )
  }
}

export async function PATCH(
  request: Request
) {
  const session =
    await getAdminSession()

  if (!session) {
    return apiError(
      "Unauthorized.",
      401
    )
  }

  let body: unknown

  try {
    body =
      await request.json()
  } catch {
    return apiError(
      "Request body must contain valid JSON.",
      400
    )
  }

  const validation =
    homepageSettingsSchema.safeParse(
      body
    )

  if (!validation.success) {
    return apiValidationError(
      validation.error
    )
  }

  try {
    const settings =
      await updateHomepageProjectLimit(
        validation.data
          .homepageProjectLimit
      )

    return NextResponse.json({
      success: true,

      data: settings,
    })
  } catch (error) {
    console.error(
      "PATCH homepage settings error:",
      error
    )

    return apiError(
      "Unable to update settings.",
      500
    )
  }
}