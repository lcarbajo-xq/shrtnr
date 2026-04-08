import { ShortLink } from '../entities/short-link'
import { Slug } from '../value-objects/slug'

export interface IShortLinkRepository {
  findBySlug(slug: Slug): Promise<ShortLink | null>
  findAll({
    userId,
    limit,
    offset
  }: {
    userId?: string
    limit?: number
    offset?: number
  }): Promise<ShortLink[]>
  save(shortLink: ShortLink): Promise<void>
  update(shortLink: ShortLink): Promise<void>
  delete(slug: Slug): Promise<boolean>
  resolve(slug: Slug): Promise<ShortLink | null>
}
