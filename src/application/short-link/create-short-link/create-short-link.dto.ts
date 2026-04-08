export type CreateShortLinkInput = {
  originalUrl: string
  customSlug?: string
  title?: string
}

export type CreateShortLinkOutput = {
  id: string
  slug: string
  originalUrl: string
  createdAt: string
  updatedAt: string
  clicks: number
  title: string | null
}
