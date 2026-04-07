export type CreateShortLinkInput = {
  originalUrl: string
  customSlug?: string
  title?: string
}

export type CreateShortLinkOutput = {
  id: string
  originalUrl: string
  slug: string
  createdAt: string
  title: string
}
