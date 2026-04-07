export type GetAllLinksInput = {
  userId?: string
}

export type GetAllLinksOutput = {
  id: string
  slug: string
  originalUrl: string
  createdAt: string
  title: string
}[]
