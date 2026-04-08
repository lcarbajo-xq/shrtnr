export abstract class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = new.target.name
  }
}

export class ShortLinkNotFoundError extends ApplicationError {
  constructor(slug: string) {
    super(`Short link not found for slug: ${slug}`, 'SHORT_LINK_NOT_FOUND')
  }
}

export class UnableToGenerateUniqueSlugError extends ApplicationError {
  constructor() {
    super('Unable to generate a unique slug', 'UNABLE_TO_GENERATE_UNIQUE_SLUG')
  }
}
