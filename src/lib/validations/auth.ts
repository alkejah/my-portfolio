import { z } from "zod"

export const adminLoginSchema =
  z.strictObject({
    username: z
      .string()
      .trim()
      .min(1, {
        error: "Username is required.",
      })
      .max(100),

    password: z
      .string()
      .min(1, {
        error: "Password is required.",
      })
      .max(256),
  })