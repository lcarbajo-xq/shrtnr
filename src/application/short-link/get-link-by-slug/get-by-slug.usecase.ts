import { IShortLinkRepository } from '@/domain/short-link/repositories/short-link-repository.interface'
import { Slug } from '@/domain/short-link/value-objects/slug'
import { ShortLinkNotFoundError } from '../errors/application-error'

export class GetShortLinkBySlugUseCase {
  constructor(
    private readonly deps: {
      shortLinkRepository: IShortLinkRepository
    }
  ) {}

  async execute(slugStr: string) {
    const slug = Slug.create(slugStr)
    const link = await this.deps.shortLinkRepository.findBySlug(slug)

    if (!link) {
      throw new ShortLinkNotFoundError(slug.toString())
    }

    return link
  }
}
