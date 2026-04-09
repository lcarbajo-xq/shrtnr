import { GetAllLinksUseCase } from '@/application/short-link/get-all-link/get-all-links.usecase'
import { CreateShortLinkUseCase } from '@/application/short-link/create-short-link/create-short-link.usecase'
import { IShortLinkRepository } from '@/domain/short-link/repositories/short-link-repository.interface'
import { SimpleSlugGenerator } from '../../services/slug-generator'
import { GetShortLinkBySlugUseCase } from '@/application/short-link/get-link-by-slug/get-by-slug.usecase'
import { UpdateShortLinkUseCase } from '@/application/short-link/update-short-link/update-short-link.usecase'
import { DeleteShortLinkUseCase } from '@/application/short-link/delete-short-link/delete-short-link-usecase'
import { ResolveShortLinkUrlUseCase } from '@/application/short-link/resolve-short-link-url/resolve-short-link-url.usecase'
import { SQLShortLinkRepository } from '../repositories/sql-short-link.repository'

let shortLinkRepository: SQLShortLinkRepository | null = null

export function getShortLinkRepository(): SQLShortLinkRepository {
  if (!shortLinkRepository) {
    shortLinkRepository = new SQLShortLinkRepository()
  }

  return shortLinkRepository
}

const lazyShortLinkRepository: IShortLinkRepository = {
  findBySlug: (slug) => getShortLinkRepository().findBySlug(slug),
  findAll: () => getShortLinkRepository().findAll(),
  save: (shortLink) => getShortLinkRepository().save(shortLink),
  update: (shortLink) => getShortLinkRepository().update(shortLink),
  delete: (slug) => getShortLinkRepository().delete(slug),
  resolve: (slug) => getShortLinkRepository().resolve(slug)
}

const slugGenerator = new SimpleSlugGenerator()

export const serviceContainer = {
  shortLink: {
    getAll: new GetAllLinksUseCase({
      shortLinkRepository: lazyShortLinkRepository
    }),
    generate: new CreateShortLinkUseCase({
      shortLinkRepository: lazyShortLinkRepository,
      slugGenerator
    }),
    getBySlug: new GetShortLinkBySlugUseCase({
      shortLinkRepository: lazyShortLinkRepository
    }),
    update: new UpdateShortLinkUseCase({
      shortLinkRepository: lazyShortLinkRepository
    }),
    delete: new DeleteShortLinkUseCase({
      shortLinkRepository: lazyShortLinkRepository
    }),
    resolve: new ResolveShortLinkUrlUseCase({
      shortLinkRepository: lazyShortLinkRepository
    })
  }
}

export type ServiceContainer = typeof serviceContainer
