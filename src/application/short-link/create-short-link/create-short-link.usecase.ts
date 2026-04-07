import { IShortLinkRepository } from '@/domain/short-link/repositories/short-link-repository.interface'
import { ISlugGenerator } from '@/domain/services/slug-generator.interface'
import { CreateShortLinkInput } from './create-short-link.dto'
import { Slug } from '@/domain/short-link/value-objects/slug'
import { LinkUrl } from '@/domain/short-link/value-objects/link-url'
import { ShortLink } from '@/domain/short-link/entities/short-link'
import { UnableToGenerateUniqueSlugError } from '../errors/application-error'

export class CreateShortLinkUseCase {
  constructor(
    private readonly deps: {
      shortLinkRepository: IShortLinkRepository
      slugGenerator: ISlugGenerator
    }
  ) {}

  async execute(input: CreateShortLinkInput): Promise<void> {
    const originalUrl = LinkUrl.create(input.originalUrl)
    const slug = input.customSlug
      ? Slug.create(input.customSlug)
      : await this.generateUniqueSlug()

    const shortLink = ShortLink.create({
      id: crypto.randomUUID(),
      originalUrl,
      slug,
      clicks: 0,
      updatedAt: new Date(),
      title: input.title ?? 'Untitled',
      createdAt: new Date()
    })
    await this.deps.shortLinkRepository.save(shortLink)
  }

  private async generateUniqueSlug(): Promise<Slug> {
    for (let i = 0; i < 5; i++) {
      const candidate = Slug.create(this.deps.slugGenerator.generate())
      const existing = await this.deps.shortLinkRepository.findBySlug(candidate)

      if (!existing) {
        return candidate
      }
    }

    throw new UnableToGenerateUniqueSlugError()
  }
}
