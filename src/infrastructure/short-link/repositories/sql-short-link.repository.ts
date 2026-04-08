import { ShortLinkNotFoundError } from '@/application/short-link/errors/application-error'
import { ShortLink } from '@/domain/short-link/entities/short-link'
import { IShortLinkRepository } from '@/domain/short-link/repositories/short-link-repository.interface'
import { LinkUrl } from '@/domain/short-link/value-objects/link-url'
import { Slug } from '@/domain/short-link/value-objects/slug'
import { db } from '@/infrastructure/sqlite/client'
import { linksTable } from '@/infrastructure/sqlite/schema'
import { eq } from 'drizzle-orm'
import { SQLiteOperationError } from '../errors'

export class SQLShortLinkRepository implements IShortLinkRepository {
  async save(shortLink: ShortLink): Promise<void> {
    const shortLinkToPrimitives = shortLink.toPrimitives()
    await db
      .insert(linksTable)
      .values({
        ...shortLinkToPrimitives,
        clicks: shortLinkToPrimitives.clicks.toString(),
        createdAt: new Date(shortLinkToPrimitives.createdAt).toISOString(),
        updatedAt: new Date(shortLinkToPrimitives.createdAt).toISOString()
      })
      .run()
  }

  async delete(slug: Slug): Promise<boolean> {
    try {
      const result = await db
        .delete(linksTable)
        .where(eq(linksTable.slug, slug.toString()))
        .returning()
        .execute()
      console.log('Delete result:', result)
      return result.length > 0
    } catch (error) {
      console.error('Error deleting short link:', error)
      throw new SQLiteOperationError(
        `Error deleting register ${slug.toString()}`,
        error
      )
    }
  }

  async findBySlug(slug: Slug): Promise<ShortLink | null> {
    const resutl = await db
      .select()
      .from(linksTable)
      .where(eq(linksTable.slug, slug.toString()))
      .limit(1)
      .execute()
    if (resutl.length === 0) {
      return null
    }
    const linkRow = resutl[0]
    const shortLink = ShortLink.create({
      id: linkRow.slug,
      slug: Slug.create(linkRow.slug),
      originalUrl: LinkUrl.create(linkRow.originalUrl),
      title: linkRow.title,
      updatedAt: new Date(linkRow.updatedAt),
      createdAt: new Date(linkRow.createdAt),
      clicks: parseInt(linkRow.clicks, 10)
    })
    return shortLink
  }

  async findAll(): Promise<ShortLink[]> {
    const result = await db.select().from(linksTable).execute()
    return result.map((linkRow) =>
      ShortLink.create({
        id: linkRow.slug,
        slug: Slug.create(linkRow.slug),
        originalUrl: LinkUrl.create(linkRow.originalUrl),
        title: linkRow.title,
        updatedAt: new Date(linkRow.updatedAt),
        createdAt: new Date(linkRow.createdAt),
        clicks: parseInt(linkRow.clicks, 10)
      })
    )
  }

  async update(shortLink: ShortLink): Promise<void> {
    await db
      .update(linksTable)
      .set({
        originalUrl: shortLink.originalUrl.toString(),
        title: shortLink.title,
        updatedAt: new Date().toISOString(),
        clicks: shortLink.clicks.toString()
      })
      .where(eq(linksTable.slug, shortLink.slug.toString()))
      .run()
  }

  async resolve(slug: Slug): Promise<ShortLink | null> {
    const transaction = await db.transaction(async (tx) => {
      const shortLink = await tx
        .select()
        .from(linksTable)
        .where(eq(linksTable.slug, slug.toString()))
        .limit(1)
        .execute()

      if (shortLink.length === 0) {
        throw new ShortLinkNotFoundError('Short link not found')
      }
      const linkRow = shortLink[0]
      const link = ShortLink.create({
        id: linkRow.slug,
        slug: Slug.create(linkRow.slug),
        originalUrl: LinkUrl.create(linkRow.originalUrl),
        title: linkRow.title,
        updatedAt: new Date(linkRow.updatedAt),
        createdAt: new Date(linkRow.createdAt),
        clicks: parseInt(linkRow.clicks, 10)
      })
      link.incrementClicks()
      const newClicks = link.clicks
      // Incrementar el contador de clicks
      await tx
        .update(linksTable)
        .set({
          clicks: newClicks.toString()
        })
        .where(eq(linksTable.slug, link.slug.toString()))
        .run()
      return link
    })
    return transaction
  }
}
