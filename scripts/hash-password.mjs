import {
  randomBytes,
  scryptSync,
} from "node:crypto"

const SCRYPT_N = 16384
const SCRYPT_R = 8
const SCRYPT_P = 1
const KEY_LENGTH = 64
const MAX_MEMORY = 64 * 1024 * 1024

function readHidden(prompt) {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin
    const stdout = process.stdout

    if (
      !stdin.isTTY ||
      typeof stdin.setRawMode !== "function"
    ) {
      reject(
        new Error(
          "This script requires an interactive terminal."
        )
      )

      return
    }

    const previousRawMode = stdin.isRaw
    let value = ""

    function cleanup() {
      stdin.off("data", handleData)
      stdin.setRawMode(Boolean(previousRawMode))
      stdin.pause()
    }

    function handleData(chunk) {
      for (const character of chunk) {
        // Enter
        if (
          character === "\r" ||
          character === "\n"
        ) {
          cleanup()
          stdout.write("\n")
          resolve(value)
          return
        }

        // Ctrl + C
        if (character === "\u0003") {
          cleanup()
          stdout.write("\n")
          process.exit(130)
        }

        // Backspace
        if (
          character === "\u007f" ||
          character === "\u0008"
        ) {
          if (value.length > 0) {
            value = value.slice(0, -1)
            stdout.write("\b \b")
          }

          continue
        }

        value += character
        stdout.write("*")
      }
    }

    stdout.write(prompt)

    stdin.setEncoding("utf8")
    stdin.setRawMode(true)
    stdin.resume()
    stdin.on("data", handleData)
  })
}

async function main() {
  const password = await readHidden(
    "Enter admin password: "
  )

  if (password.length < 12) {
    console.error(
      "Password must contain at least 12 characters."
    )

    process.exit(1)
  }

  const confirmation = await readHidden(
    "Confirm admin password: "
  )

  if (password !== confirmation) {
    console.error("Passwords do not match.")
    process.exit(1)
  }

  const salt = randomBytes(16)

  const derivedKey = scryptSync(
    password,
    salt,
    KEY_LENGTH,
    {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
      maxmem: MAX_MEMORY,
    }
  )

const encodedHash = [
  "scrypt",
  SCRYPT_N,
  SCRYPT_R,
  SCRYPT_P,
  salt.toString("hex"),
  derivedKey.toString("hex"),
].join(":")

  console.log("\nPassword hash:\n")
  console.log(encodedHash)
  console.log(
    "\nPaste this value into ADMIN_PASSWORD_HASH."
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})