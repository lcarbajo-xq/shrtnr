export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = new.target.name
  }
}

export class SlugAlreadyExistsError extends DomainError {
  constructor(slug: string) {
    super(`Slug already exists: ${slug}`, 'SLUG_ALREADY_EXISTS')
  }
}

export class InvalidLinkUrlError extends DomainError {
  constructor(value: string) {
    super(`Invalid link URL: ${value}`, 'INVALID_LINK_URL')
  }
}

export class InvalidSlugError extends DomainError {
  constructor(reason?: string) {
    super(reason ? `Invalid slug: ${reason}` : 'Invalid slug', 'INVALID_SLUG')
  }
}
