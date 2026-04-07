import { ShortLink } from '../entities/short-link'
import { Slug } from '../value-objects/slug'

export interface IShortLinkRepository {
  findBySlug(slug: Slug): Promise<ShortLink | null>
  findAll(): Promise<ShortLink[]>
  save(shortLink: ShortLink): Promise<void>
  update(shortLink: ShortLink): Promise<void>
  delete: (slug: Slug) => Promise<void>
}
