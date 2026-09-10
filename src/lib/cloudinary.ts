import {
  v2 as cloudinary,
  type UploadApiResponse,
} from "cloudinary"

import type { UploadImagePurpose } from "@/types/media"

const PROJECT_MEDIA_PREFIX =
  "portfolio/projects/"

let configured = false

function configureCloudinary() {
  if (configured) {
    return
  }

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME

  const apiKey =
    process.env.CLOUDINARY_API_KEY

  const apiSecret =
    process.env.CLOUDINARY_API_SECRET

  if (!cloudName) {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME is not configured."
    )
  }

  if (!apiKey) {
    throw new Error(
      "CLOUDINARY_API_KEY is not configured."
    )
  }

  if (!apiSecret) {
    throw new Error(
      "CLOUDINARY_API_SECRET is not configured."
    )
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })

  configured = true
}

function getUploadFolder(
  purpose: UploadImagePurpose
) {
  if (purpose === "cover") {
    return `${PROJECT_MEDIA_PREFIX}covers`
  }

  return `${PROJECT_MEDIA_PREFIX}screenshots`
}

export function isPortfolioCloudinaryPublicId(
  publicId: string
) {
  return publicId.startsWith(
    PROJECT_MEDIA_PREFIX
  )
}

export async function uploadProjectImage(
  buffer: Buffer,
  purpose: UploadImagePurpose
): Promise<UploadApiResponse> {
  configureCloudinary()

  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder:
              getUploadFolder(purpose),

            resource_type: "image",

            unique_filename: true,
            overwrite: false,
          },
          (error, result) => {
            if (error) {
              reject(error)
              return
            }

            if (!result) {
              reject(
                new Error(
                  "Cloudinary did not return an upload result."
                )
              )

              return
            }

            resolve(result)
          }
        )

      uploadStream.end(buffer)
    }
  )
}

export async function deleteCloudinaryImage(
  publicId: string
) {
  if (
    !isPortfolioCloudinaryPublicId(
      publicId
    )
  ) {
    throw new Error(
      "Refusing to delete an asset outside the portfolio project folder."
    )
  }

  configureCloudinary()

  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "image",
      invalidate: true,
    }
  )
}

export async function deleteCloudinaryImages(
  publicIds: string[]
) {
  const uniquePublicIds = [
    ...new Set(
      publicIds.filter(
        isPortfolioCloudinaryPublicId
      )
    ),
  ]

  if (uniquePublicIds.length === 0) {
    return
  }

  const results =
    await Promise.allSettled(
      uniquePublicIds.map((publicId) =>
        deleteCloudinaryImage(publicId)
      )
    )

  results.forEach(
    (result, index) => {
      if (
        result.status === "rejected"
      ) {
        console.error(
          `Unable to delete Cloudinary image "${uniquePublicIds[index]}":`,
          result.reason
        )
      }
    }
  )
}