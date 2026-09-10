import { z } from "zod"

export const deleteImageSchema =
  z.strictObject({
    publicId: z
      .string()
      .trim()
      .min(1, {
        error:
          "Cloudinary public ID is required.",
      })
      .refine(
        (value) =>
          value.startsWith(
            "portfolio/projects/"
          ),
        {
          error:
            "Invalid project image public ID.",
        }
      ),
  })