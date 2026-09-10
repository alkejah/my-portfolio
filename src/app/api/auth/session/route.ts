import { NextResponse } from "next/server"

import { getAdminSession } from "@/lib/auth/session"

export const runtime = "nodejs"

export async function GET() {
  const session =
    await getAdminSession()

  return NextResponse.json(
    {
      success: true,

      data: {
        authenticated:
          session !== null,

        username:
          session?.username ?? null,
      },
    },
    {
      status: 200,
    }
  )
}