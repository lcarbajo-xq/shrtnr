import { IShortLinkRepository } from '@/domain/short-link/repositories/short-link-repository.interface'
import { Slug } from '@/domain/short-link/value-objects/slug'
import { ShortLinkNotFoundError } from '../errors/application-error'

export class ResolveShortLinkUrlUseCase {
  constructor(
    private readonly deps: {
      shortLinkRepository: IShortLinkRepository
    }
  ) {}
  async execute(slugStr: string): Promise<string> {
    const slug = Slug.create(slugStr)

    const shortLink = await this.deps.shortLinkRepository.findBySlug(slug)
    if (!shortLink) {
      throw new ShortLinkNotFoundError('Short link not found')
    }

    return shortLink.originalUrl.toString()
  }
}
