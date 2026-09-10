import { z } from "zod";

const titleSchema = z
  .string()
  .trim()
  .min(2, {
    error: "Project title must contain at least 2 characters.",
  })
  .max(120, {
    error: "Project title cannot exceed 120 characters.",
  });

const shortDescriptionSchema = z
  .string()
  .trim()
  .min(10, {
    error: "Short description must contain at least 10 characters.",
  })
  .max(300, {
    error: "Short description cannot exceed 300 characters.",
  });

const descriptionSchema = z
  .string()
  .trim()
  .min(20, {
    error: "Description must contain at least 20 characters.",
  })
  .max(10000, {
    error: "Description is too long.",
  });

const httpUrlSchema = z
  .string()
  .trim()
  .url({
    error: "Must be a valid URL.",
  })
  .refine(
    (value) => {
      try {
        const protocol = new URL(value).protocol;

        return (
          protocol === "http:" ||
          protocol === "https:"
        );
      } catch {
        return false;
      }
    },
    {
      error: "URL must use http or https.",
    },
  );

const nullableUrlSchema = z
  .union([
    httpUrlSchema,
    z.literal(""),
    z.null(),
  ])
  .transform((value) => {
    if (value === "") {
      return null;
    }

    return value;
  });

export const projectImageSchema =
  z.strictObject({
    url: httpUrlSchema,

    publicId: z
      .string()
      .trim()
      .min(1)
      .nullable()
      .default(null),

    alt: z
      .string()
      .trim()
      .min(2, {
        error: "Image alt text is required.",
      })
      .max(200, {
        error:
          "Image alt text cannot exceed 200 characters.",
      }),
  });

export const projectScreenshotSchema =
  projectImageSchema.extend({
    title: z
      .string()
      .trim()
      .min(2, {
        error: "Screenshot title is required.",
      })
      .max(120),

    description: z
      .string()
      .trim()
      .max(500)
      .default(""),
  });

export const projectTechnologySchema =
  z.strictObject({
    name: z
      .string()
      .trim()
      .min(1, {
        error: "Technology name is required.",
      })
      .max(60),

    iconKey: z
      .string()
      .trim()
      .min(1, {
        error:
          "Technology icon key is required.",
      })
      .max(60)
      .regex(/^[a-z0-9-]+$/, {
        error:
          "Icon key may only contain lowercase letters, numbers, and hyphens.",
      }),
  });

export const createProjectSchema =
  z
    .strictObject({
      title: titleSchema,

      shortDescription:
        shortDescriptionSchema,

      description:
        descriptionSchema,

      coverImage:
        projectImageSchema
          .nullable()
          .default(null),

      screenshots: z
        .array(
          projectScreenshotSchema,
        )
        .max(20, {
          error:
            "A project cannot contain more than 20 screenshots.",
        })
        .default([]),

      technologies: z
        .array(
          projectTechnologySchema,
        )
        .max(20, {
          error:
            "A project cannot contain more than 20 technologies.",
        })
        .default([]),

      liveUrl:
        nullableUrlSchema.default(
          null,
        ),

      repositoryUrl:
        nullableUrlSchema.default(
          null,
        ),

      contributor: z
        .boolean()
        .default(false),

      contributorRole: z
        .string()
        .trim()
        .max(120, {
          error:
            "Contributor role cannot exceed 120 characters.",
        })
        .nullable()
        .default(null),

      featured: z
        .boolean()
        .default(false),

      published: z
        .boolean()
        .default(false),

      order: z
        .number()
        .int()
        .min(0)
        .max(9999)
        .default(0),
    })
    .superRefine(
      (
        project,
        context,
      ) => {
        if (
          project.contributor &&
          !project.contributorRole?.trim()
        ) {
          context.addIssue({
            code: "custom",

            path: [
              "contributorRole",
            ],

            message:
              "Enter the role you acted as on this project.",
          });
        }
      },
    );

export const updateProjectSchema =
  z
    .strictObject({
      title:
        titleSchema.optional(),

      shortDescription:
        shortDescriptionSchema.optional(),

      description:
        descriptionSchema.optional(),

      coverImage:
        projectImageSchema
          .nullable()
          .optional(),

      screenshots: z
        .array(
          projectScreenshotSchema,
        )
        .max(20)
        .optional(),

      technologies: z
        .array(
          projectTechnologySchema,
        )
        .max(20)
        .optional(),

      liveUrl:
        nullableUrlSchema.optional(),

      repositoryUrl:
        nullableUrlSchema.optional(),

      contributor: z
        .boolean()
        .optional(),

      contributorRole: z
        .string()
        .trim()
        .max(120, {
          error:
            "Contributor role cannot exceed 120 characters.",
        })
        .nullable()
        .optional(),

      featured: z
        .boolean()
        .optional(),

      published: z
        .boolean()
        .optional(),

      order: z
        .number()
        .int()
        .min(0)
        .max(9999)
        .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length >
        0,
      {
        error:
          "At least one project field must be provided.",
      },
    )
    .superRefine(
      (
        project,
        context,
      ) => {
        if (
          project.contributor ===
            true &&
          !project.contributorRole?.trim()
        ) {
          context.addIssue({
            code: "custom",

            path: [
              "contributorRole",
            ],

            message:
              "Enter the role you acted as on this project.",
          });
        }
      },
    );