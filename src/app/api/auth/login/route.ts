import { NextResponse } from "next/server"

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
} from "@/lib/auth/config"
import { verifyAdminCredentials } from "@/lib/auth/credentials"
import { createAdminSessionToken } from "@/lib/auth/session"
import {
  apiError,
  apiValidationError,
} from "@/lib/api"
import { adminLoginSchema } from "@/lib/validations/auth"

export const runtime = "nodejs"

export async function POST(
  request: Request
) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return apiError(
      "Request body must contain valid JSON.",
      400
    )
  }

  const validation =
    adminLoginSchema.safeParse(body)

  if (!validation.success) {
    return apiValidationError(
      validation.error
    )
  }

  try {
    const { username, password } =
      validation.data

    const credentialsAreValid =
      await verifyAdminCredentials(
        username,
        password
      )

    if (!credentialsAreValid) {
      return apiError(
        "Invalid username or password.",
        401
      )
    }

    const token =
      await createAdminSessionToken(
        username
      )

    const response =
      NextResponse.json(
        {
          success: true,
          data: {
            username,
          },
        },
        {
          status: 200,
        }
      )

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,

      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",

      path: "/",

      maxAge:
        ADMIN_SESSION_MAX_AGE,

      priority: "high",
    })

    return response
  } catch (error) {
    console.error(
      "POST /api/auth/login error:",
      error
    )

    return apiError(
      "Unable to sign in.",
      500
    )
  }
}