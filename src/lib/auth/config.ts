export const ADMIN_SESSION_COOKIE =
  "portfolio_admin_session"

export const ADMIN_SESSION_MAX_AGE =
  60 * 60 * 8

export const ADMIN_SESSION_ISSUER =
  "portfolio-cms"

export const ADMIN_SESSION_AUDIENCE =
  "portfolio-admin"

export function getAdminUsername() {
  const username = process.env.ADMIN_USERNAME

  if (!username) {
    throw new Error(
      "ADMIN_USERNAME is not configured."
    )
  }

  return username
}

export function getAdminPasswordHash() {
  const passwordHash =
    process.env.ADMIN_PASSWORD_HASH

  if (!passwordHash) {
    throw new Error(
      "ADMIN_PASSWORD_HASH is not configured."
    )
  }

  return passwordHash
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not configured."
    )
  }

  if (secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must contain at least 32 characters."
    )
  }

  return secret
}