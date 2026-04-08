import { IShortLinkRepository } from '@/domain/short-link/repositories/short-link-repository.interface'
import { Slug } from '@/domain/short-link/value-objects/slug'
import { ShortLinkNotFoundError } from '../errors/application-error'

export class DeleteShortLinkUseCase {
  constructor(
    private readonly deps: { shortLinkRepository: IShortLinkRepository }
  ) {}

  async execute(slugStr: string): Promise<void> {
    const slug = Slug.create(slugStr)

    const wasDeleted = await this.deps.shortLinkRepository.delete(slug)
    if (wasDeleted === false) {
      throw new ShortLinkNotFoundError(
        `Short link with slug "${slugStr}" not found`
      )
    }
  }
}
