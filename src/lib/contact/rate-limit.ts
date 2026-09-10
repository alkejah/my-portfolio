import {
  createHmac,
} from "node:crypto"

import { getContactRateLimitCollection } from "@/models/contact-rate-limit"

const RATE_LIMIT_WINDOW_MS =
  10 * 60 * 1000

const MAX_REQUESTS_PER_WINDOW =
  5

function getRateLimitSecret() {
  const secret =
    process.env
      .CONTACT_RATE_LIMIT_SECRET

  if (!secret) {
    throw new Error(
      "CONTACT_RATE_LIMIT_SECRET is not configured."
    )
  }

  if (secret.length < 32) {
    throw new Error(
      "CONTACT_RATE_LIMIT_SECRET must contain at least 32 characters."
    )
  }

  return secret
}

function getClientIdentifier(
  request: Request
) {
  const forwardedFor =
    request.headers.get(
      "x-forwarded-for"
    )

  const forwardedAddress =
    forwardedFor
      ?.split(",")[0]
      ?.trim()

  const realIp =
    request.headers
      .get("x-real-ip")
      ?.trim()

  return (
    forwardedAddress ||
    realIp ||
    "local-development"
  )
}

function hashIdentifier(
  value: string
) {
  return createHmac(
    "sha256",
    getRateLimitSecret()
  )
    .update(value)
    .digest("hex")
}

export async function checkContactRateLimit(
  request: Request
) {
  const identifier =
    getClientIdentifier(request)

  const key =
    hashIdentifier(identifier)

  const now = new Date()

  const windowStart =
    new Date(
      now.getTime() -
        RATE_LIMIT_WINDOW_MS
    )

  const collection =
    await getContactRateLimitCollection()

  const recentRequests =
    await collection.countDocuments({
      key,

      createdAt: {
        $gte: windowStart,
      },
    })

  if (
    recentRequests >=
    MAX_REQUESTS_PER_WINDOW
  ) {
    return {
      allowed: false,
    } as const
  }

  await collection.insertOne({
    key,
    createdAt: now,
  })

  return {
    allowed: true,
  } as const
}