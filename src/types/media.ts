export type UploadedImageDTO = {
  url: string
  publicId: string
}

export type UploadImagePurpose =
  | "cover"
  | "screenshot"