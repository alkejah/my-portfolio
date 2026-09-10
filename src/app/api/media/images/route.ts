import { NextResponse } from "next/server"

import {
  apiError,
  apiValidationError,
} from "@/lib/api"
import { getAdminSession } from "@/lib/auth/session"
import {
  deleteCloudinaryImage,
  uploadProjectImage,
} from "@/lib/cloudinary"
import { deleteImageSchema } from "@/lib/validations/media"
import type {
  UploadImagePurpose,
  UploadedImageDTO,
} from "@/types/media"

export const runtime = "nodejs"

const MAX_IMAGE_SIZE =
  8 * 1024 * 1024

const ALLOWED_IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ])

function isUploadPurpose(
  value: unknown
): value is UploadImagePurpose {
  return (
    value === "cover" ||
    value === "screenshot"
  )
}

export async function POST(
  request: Request
) {
  const session =
    await getAdminSession()

  if (!session) {
    return apiError(
      "Authentication required.",
      401
    )
  }

  let formData: FormData

  try {
    formData =
      await request.formData()
  } catch {
    return apiError(
      "Invalid upload request.",
      400
    )
  }

  const file =
    formData.get("file")

  const purpose =
    formData.get("purpose")

  if (!(file instanceof File)) {
    return apiError(
      "An image file is required.",
      400
    )
  }

  if (!isUploadPurpose(purpose)) {
    return apiError(
      "Invalid image purpose.",
      400
    )
  }

  if (
    !ALLOWED_IMAGE_TYPES.has(
      file.type
    )
  ) {
    return apiError(
      "Only JPEG, PNG, and WebP images are allowed.",
      415
    )
  }

  if (file.size <= 0) {
    return apiError(
      "The uploaded image is empty.",
      400
    )
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    return apiError(
      "Image must not exceed 8 MB.",
      413
    )
  }

  try {
    const arrayBuffer =
      await file.arrayBuffer()

    const buffer =
      Buffer.from(arrayBuffer)

    const result =
      await uploadProjectImage(
        buffer,
        purpose
      )

    const image: UploadedImageDTO = {
      url: result.secure_url,
      publicId: result.public_id,
    }

    return NextResponse.json(
      {
        success: true,
        data: image,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error(
      "POST /api/media/images error:",
      error
    )

    return apiError(
      "Unable to upload image.",
      500
    )
  }
}

export async function DELETE(
  request: Request
) {
  const session =
    await getAdminSession()

  if (!session) {
    return apiError(
      "Authentication required.",
      401
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return apiError(
      "Request body must contain valid JSON.",
      400
    )
  }

  const validation =
    deleteImageSchema.safeParse(body)

  if (!validation.success) {
    return apiValidationError(
      validation.error
    )
  }

  try {
    await deleteCloudinaryImage(
      validation.data.publicId
    )

    return NextResponse.json(
      {
        success: true,

        data: {
          publicId:
            validation.data
              .publicId,
        },
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "DELETE /api/media/images error:",
      error
    )

    return apiError(
      "Unable to delete image.",
      500
    )
  }
}