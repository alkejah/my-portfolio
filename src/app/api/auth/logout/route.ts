import { NextResponse } from "next/server"

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/config"

export const runtime = "nodejs"

export async function POST() {
  const response = NextResponse.json(
    {
      success: true,
      data: {
        loggedOut: true,
      },
    },
    {
      status: 200,
    }
  )

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,

    secure:
      process.env.NODE_ENV ===
      "production",

    sameSite: "lax",

    path: "/",

    maxAge: 0,
  })

  return response
}