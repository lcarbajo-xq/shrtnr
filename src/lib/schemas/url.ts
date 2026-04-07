import { z } from 'zod'

// Schema base para URL
export const urlSchema = z.object({
  url: z.string().url('Invalid URL format')
})

export type UrlSchema = z.infer<typeof urlSchema>

// Schema para slug (alfanumérico, guiones, guiones bajos)
const slugRegex = /^[a-zA-Z0-9_-]+$/

export const slugSchema = z.string()
  .min(1, 'Slug cannot be empty')
  .max(50, 'Slug must be 50 characters or less')
  .regex(slugRegex, 'Slug can only contain letters, numbers, hyphens, and underscores')
  .refine((slug) => !slug.startsWith('-') && !slug.endsWith('-'), {
    message: 'Slug cannot start or end with a hyphen'
  })

// Schema para crear un short link (POST /api/links)
export const createShortLinkSchema = z.object({
  originalUrl: z.string().url('Invalid URL format'),
  title: z.string().min(1).max(200).optional(),
  customSlug: slugSchema.optional()
})

export type CreateShortLinkInput = z.infer<typeof createShortLinkSchema>

// Schema para actualizar un short link (PATCH /api/links/[id])
export const updateShortLinkSchema = z.object({
  originalUrl: z.string().url('Invalid URL format').optional(),
  title: z.string().min(1).max(200).optional()
}).refine((data) => data.originalUrl !== undefined || data.title !== undefined, {
  message: 'At least one field (originalUrl or title) must be provided'
})

export type UpdateShortLinkInput = z.infer<typeof updateShortLinkSchema>

// Schema para parámetros de ruta
export const slugParamSchema = z.object({
  slug: slugSchema
})

export const idParamSchema = z.object({
  id: slugSchema
})

export type SlugParam = z.infer<typeof slugParamSchema>
export type IdParam = z.infer<typeof idParamSchema>