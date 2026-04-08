import { GetAllLinksUseCase } from '@/application/short-link/get-all-link/get-all-links.usecase'
import { CreateShortLinkUseCase } from '@/application/short-link/create-short-link/create-short-link.usecase'
import { SimpleSlugGenerator } from '../../services/slug-generator'
import { GetShortLinkBySlugUseCase } from '@/application/short-link/get-link-by-slug/get-by-slug.usecase'
import { UpdateShortLinkUseCase } from '@/application/short-link/update-short-link/update-short-link.usecase'
import { DeleteShortLinkUseCase } from '@/application/short-link/delete-short-link/delete-short-link-usecase'
import { ResolveShortLinkUrlUseCase } from '@/application/short-link/resolve-short-link-url/resolve-short-link-url.usecase'
import { SQLShortLinkRepository } from '../repositories/sql-short-link.repository'

// const globalForRepo = globalThis as unknown as {
//   shortLinkRepository: SQLShortLinkRepository | undefined
// }

// const shortLinkRepository =
//   globalForRepo.shortLinkRepository ?? new SQLShortLinkRepository()

// if (process.env.NODE_ENV !== 'production') {
//   globalForRepo.shortLinkRepository = shortLinkRepository
// }

const shortLinkRepository = new SQLShortLinkRepository()
const slugGenerator = new SimpleSlugGenerator()

export const serviceContainer = {
  shortLink: {
    getAll: new GetAllLinksUseCase({
      shortLinkRepository
    }),
    generate: new CreateShortLinkUseCase({
      shortLinkRepository,
      slugGenerator
    }),
    getBySlug: new GetShortLinkBySlugUseCase({
      shortLinkRepository
    }),
    update: new UpdateShortLinkUseCase({
      shortLinkRepository
    }),
    delete: new DeleteShortLinkUseCase({
      shortLinkRepository
    }),
    resolve: new ResolveShortLinkUrlUseCase({
      shortLinkRepository
    })
  }
}

export type ServiceContainer = typeof serviceContainer
