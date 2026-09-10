import { randomUUID } from "node:crypto"

import {
  jwtVerify,
  SignJWT,
} from "jose"
import { cookies } from "next/headers"

import {
  ADMIN_SESSION_AUDIENCE,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_ISSUER,
  ADMIN_SESSION_MAX_AGE,
  getAuthSecret,
} from "@/lib/auth/config"

export type AdminSession = {
  username: string
}

function getSessionSecret() {
  return new TextEncoder().encode(
    getAuthSecret()
  )
}

export async function createAdminSessionToken(
  username: string
) {
  const now = Math.floor(
    Date.now() / 1000
  )

  return new SignJWT({
    role: "admin",
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(username)
    .setIssuer(ADMIN_SESSION_ISSUER)
    .setAudience(
      ADMIN_SESSION_AUDIENCE
    )
    .setIssuedAt(now)
    .setExpirationTime(
      now + ADMIN_SESSION_MAX_AGE
    )
    .setJti(randomUUID())
    .sign(getSessionSecret())
}

export async function verifyAdminSessionToken(
  token: string
): Promise<AdminSession | null> {
  try {
    const { payload } =
      await jwtVerify(
        token,
        getSessionSecret(),
        {
          algorithms: ["HS256"],
          issuer:
            ADMIN_SESSION_ISSUER,
          audience:
            ADMIN_SESSION_AUDIENCE,
        }
      )

    if (
      payload.role !== "admin" ||
      typeof payload.sub !== "string"
    ) {
      return null
    }

    return {
      username: payload.sub,
    }
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()

  const token = cookieStore.get(
    ADMIN_SESSION_COOKIE
  )?.value

  if (!token) {
    return null
  }

  return verifyAdminSessionToken(token)
}