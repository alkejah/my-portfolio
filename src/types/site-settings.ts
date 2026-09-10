export type SiteSettingsDocument = {
  key: "portfolio"

  homepageProjectLimit: number

  createdAt: Date
  updatedAt: Date
}

export type SiteSettingsDTO = {
  homepageProjectLimit: number
}