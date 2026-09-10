import {
  scrypt,
  timingSafeEqual,
} from "node:crypto"

const MAX_MEMORY = 64 * 1024 * 1024

function isHex(value: string) {
  return (
    value.length > 0 &&
    value.length % 2 === 0 &&
    /^[0-9a-f]+$/i.test(value)
  )
}

function deriveKey(
  password: string,
  salt: Buffer,
  keyLength: number,
  options: {
    N: number
    r: number
    p: number
    maxmem: number
  }
) {
  return new Promise<Buffer>(
    (resolve, reject) => {
      scrypt(
        password,
        salt,
        keyLength,
        options,
        (error, derivedKey) => {
          if (error) {
            reject(error)
            return
          }

          resolve(derivedKey)
        }
      )
    }
  )
}

export async function verifyPasswordHash(
  password: string,
  encodedHash: string
) {
  const parts = encodedHash.split(":")

  if (parts.length !== 6) {
    return false
  }

  const [
    scheme,
    nValue,
    rValue,
    pValue,
    saltHex,
    keyHex,
  ] = parts

  if (scheme !== "scrypt") {
    return false
  }

  if (!isHex(saltHex) || !isHex(keyHex)) {
    return false
  }

  const N = Number(nValue)
  const r = Number(rValue)
  const p = Number(pValue)

  if (
    !Number.isInteger(N) ||
    !Number.isInteger(r) ||
    !Number.isInteger(p)
  ) {
    return false
  }

  if (
    N < 2 ||
    N > 1_048_576 ||
    (N & (N - 1)) !== 0
  ) {
    return false
  }

  if (r < 1 || r > 32) {
    return false
  }

  if (p < 1 || p > 16) {
    return false
  }

  const salt = Buffer.from(
    saltHex,
    "hex"
  )

  const expectedKey = Buffer.from(
    keyHex,
    "hex"
  )

  try {
    const actualKey = await deriveKey(
      password,
      salt,
      expectedKey.length,
      {
        N,
        r,
        p,
        maxmem: MAX_MEMORY,
      }
    )

    if (
      actualKey.length !==
      expectedKey.length
    ) {
      return false
    }

    return timingSafeEqual(
      actualKey,
      expectedKey
    )
  } catch {
    return false
  }
}