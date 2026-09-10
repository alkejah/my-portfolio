const requiredVariables = [
  "MONGODB_URI",
  "MONGODB_DB",

  "ADMIN_USERNAME",
  "ADMIN_PASSWORD_HASH",
  "AUTH_SECRET",

  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",

  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
  "CONTACT_FROM_EMAIL",
  "CONTACT_RATE_LIMIT_SECRET",
]

const missingVariables =
  requiredVariables.filter(
    (name) =>
      !process.env[name]?.trim()
  )

const problems = []

if (
  missingVariables.length >
  0
) {
  problems.push(
    `Missing environment variables: ${missingVariables.join(", ")}`
  )
}

const authSecret =
  process.env.AUTH_SECRET ?? ""

if (
  authSecret &&
  authSecret.length < 32
) {
  problems.push(
    "AUTH_SECRET must contain at least 32 characters."
  )
}

const rateLimitSecret =
  process.env
    .CONTACT_RATE_LIMIT_SECRET ??
  ""

if (
  rateLimitSecret &&
  rateLimitSecret.length < 32
) {
  problems.push(
    "CONTACT_RATE_LIMIT_SECRET must contain at least 32 characters."
  )
}

const passwordHash =
  process.env
    .ADMIN_PASSWORD_HASH ??
  ""

if (
  passwordHash &&
  !passwordHash.startsWith(
    "scrypt:"
  )
) {
  problems.push(
    "ADMIN_PASSWORD_HASH does not use the expected scrypt format."
  )
}

const mongoUri =
  process.env.MONGODB_URI ?? ""

if (
  mongoUri &&
  !(
    mongoUri.startsWith(
      "mongodb://"
    ) ||
    mongoUri.startsWith(
      "mongodb+srv://"
    )
  )
) {
  problems.push(
    "MONGODB_URI does not appear to be a MongoDB connection URI."
  )
}

if (problems.length > 0) {
  console.error(
    "\nEnvironment check failed:\n"
  )

  for (
    const problem of problems
  ) {
    console.error(
      `- ${problem}`
    )
  }

  console.error()

  process.exit(1)
}

console.log(
  `Environment check passed. ${requiredVariables.length} required variables are configured.`
)