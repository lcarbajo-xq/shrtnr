import { IShortLinkRepository } from '@/domain/short-link/repositories/short-link-repository.interface'
import { Slug } from '@/domain/short-link/value-objects/slug'

export class DeleteShortLinkUseCase {
  constructor(
    private readonly deps: { shortLinkRepository: IShortLinkRepository }
  ) {}

  async execute(slugStr: string): Promise<void> {
    const slug = Slug.create(slugStr)

    await this.deps.shortLinkRepository.delete(slug)
  }
}
