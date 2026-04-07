export type GetAllLinksInput = {
  userId?: string
  limit?: number
  offset?: number
}

export type GetAllLinksOutput = {
  id: string
  slug: string
  originalUrl: string
  createdAt: string
  title: string
}[]
