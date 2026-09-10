import { z } from "zod"

export const contactFormSchema =
  z.strictObject({
    name: z
      .string()
      .trim()
      .min(2, {
        error:
          "Name must contain at least 2 characters.",
      })
      .max(80, {
        error:
          "Name cannot exceed 80 characters.",
      }),

    email: z
      .string()
      .trim()
      .email({
        error:
          "Enter a valid email address.",
      })
      .max(200),

    subject: z
      .string()
      .trim()
      .min(3, {
        error:
          "Subject must contain at least 3 characters.",
      })
      .max(120, {
        error:
          "Subject cannot exceed 120 characters.",
      }),

    message: z
      .string()
      .trim()
      .min(20, {
        error:
          "Message must contain at least 20 characters.",
      })
      .max(3000, {
        error:
          "Message cannot exceed 3000 characters.",
      }),

    website: z
      .string()
      .max(200)
      .default(""),

    startedAt: z
      .number()
      .int()
      .positive(),
  })