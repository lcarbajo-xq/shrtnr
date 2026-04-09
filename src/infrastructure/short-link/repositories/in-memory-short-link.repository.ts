import { ShortLinkNotFoundError } from '@/application/short-link/errors/application-error'
import { ShortLink } from '@/domain/short-link/entities/short-link'
import { SlugAlreadyExistsError } from '@/domain/short-link/errors/domain-error'
import { IShortLinkRepository } from '@/domain/short-link/repositories/short-link-repository.interface'
import { Slug } from '@/domain/short-link/value-objects/slug'

export class InMemoryShortLinkRepository implements IShortLinkRepository {
  private readonly items = new Map<string, ShortLink>()

  async findBySlug(slug: Slug): Promise<ShortLink | null> {
    return await Promise.resolve(this.items.get(slug.toString()) ?? null)
  }

  async findAll({
    userId,
    limit = 10,
    offset = 0
  }: {
    userId?: string
    limit?: number
    offset?: number
  }): Promise<ShortLink[]> {
    // TODO: Filter by userId when multi-user support is adde
    return await Promise.resolve(
      Array.from(this.items.values()).slice(offset, offset + limit)
    )
  }

  async save(shortLink: ShortLink): Promise<void> {
    const exists = this.items.has(shortLink.slug.toString())

    if (exists) {
      throw new SlugAlreadyExistsError(shortLink.slug.toString())
    }

    await Promise.resolve(this.items.set(shortLink.slug.toString(), shortLink))
  }

  async update(shortLink: ShortLink): Promise<void> {
    const exists = this.items.has(shortLink.slug.toString())

    if (!exists) {
      throw new ShortLinkNotFoundError(shortLink.slug.toString())
    }
    await Promise.resolve(this.items.set(shortLink.slug.toString(), shortLink))
    return
  }

  async delete(slug: Slug): Promise<void> {
    const exists = this.items.has(slug.toString())
    if (!exists) {
      throw new ShortLinkNotFoundError(slug.toString())
    }
    await Promise.resolve(this.items.delete(slug.toString()))
    return
  }

  async resolve(slug: Slug): Promise<ShortLink | null> {
    const shortLink = this.items.get(slug.toString())
    if (!shortLink) {
      return null
    }
    shortLink.incrementClicks()
    await this.update(shortLink)
    return shortLink
  }
}
