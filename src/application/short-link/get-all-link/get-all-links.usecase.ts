import { IShortLinkRepository } from '@/domain/short-link/repositories/short-link-repository.interface'
import { GetAllLinksInput } from './get-all-links.dto'
import { ShortLink } from '@/domain/short-link/entities/short-link'

export class GetAllLinksUseCase {
  constructor(
    private readonly deps: {
      shortLinkRepository: IShortLinkRepository
    }
  ) {}

  async execute(input?: GetAllLinksInput): Promise<ShortLink[]> {
    return await this.deps.shortLinkRepository.findAll(input || {})
  }
}
