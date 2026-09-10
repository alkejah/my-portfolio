import {
  getAdminPasswordHash,
  getAdminUsername,
} from "@/lib/auth/config"
import { verifyPasswordHash } from "@/lib/auth/password"

export async function verifyAdminCredentials(
  username: string,
  password: string
) {
  const expectedUsername =
    getAdminUsername()

  const passwordHash =
    getAdminPasswordHash()

  const passwordMatches =
    await verifyPasswordHash(
      password,
      passwordHash
    )

  const usernameMatches =
    username === expectedUsername

  return (
    usernameMatches &&
    passwordMatches
  )
}