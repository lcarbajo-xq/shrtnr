// Crear el esquema de validación para la URL usando Zod y el objeto de dominio Link
import { z } from 'zod'

export const urlSchema = z.object({
  url: z.url('Invalid URL format')
})

export type UrlSchema = z.infer<typeof urlSchema>
