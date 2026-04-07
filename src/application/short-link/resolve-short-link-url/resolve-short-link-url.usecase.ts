import { IShortLinkRepository } from '@/domain/short-link/repositories/short-link-repository.interface'
import { Slug } from '@/domain/short-link/value-objects/slug'
import { ShortLinkNotFoundError } from '../errors/application-error'

export class ResolveShortLinkUrlUseCase {
  constructor(
    private readonly deps: {
      shortLinkRepository: IShortLinkRepository
      baseUrl: string
    }
  ) {}
  async execute(slugStr: string): Promise<string> {
    console.log('Resolving short link URL for slug:', slugStr)
    const slug = Slug.create(slugStr)

    const shortLink = await this.deps.shortLinkRepository.findBySlug(slug)
    if (!shortLink) {
      throw new ShortLinkNotFoundError('Short link not found')
    }
    console.log('Found short link:', shortLink.originalUrl.toString())
    return shortLink.originalUrl.toString()
  }
}
