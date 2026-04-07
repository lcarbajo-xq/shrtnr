import { ShortLink } from '@/domain/short-link/entities/short-link'
import { IShortLinkRepository } from '@/domain/short-link/repositories/short-link-repository.interface'
import { LinkUrl } from '@/domain/short-link/value-objects/link-url'
import { Slug } from '@/domain/short-link/value-objects/slug'
import { ShortLinkNotFoundError } from '../errors/application-error'
import { sl } from 'zod/locales'

export class UpdateShortLinkUseCase {
  constructor(
    private readonly deps: { shortLinkRepository: IShortLinkRepository }
  ) {}

  async execute(input: {
    slugStr: string
    title?: string
    originalUrl?: string
  }): Promise<void> {
    const slug = Slug.create(input.slugStr)
    const exists = await this.deps.shortLinkRepository.findBySlug(slug)

    if (!exists) {
      throw new ShortLinkNotFoundError(input.slugStr)
    }

    const shortLinkToUpdate = ShortLink.create({
      createdAt: exists.createdAt,
      id: exists.id,
      slug,
      title: input.title ?? exists.title,
      originalUrl: input.originalUrl
        ? LinkUrl.create(input.originalUrl)
        : exists.originalUrl
    })

    await this.deps.shortLinkRepository.update(shortLinkToUpdate)
  }
}
