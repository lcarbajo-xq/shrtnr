import { InvalidSlugError } from '../errors/domain-error'

export class Slug {
  private constructor(private readonly value: string) {}

  static create(raw: string): Slug {
    const normalized = raw.trim()

    if (normalized.length < 4) {
      throw new InvalidSlugError('must have at least 4 characters')
    }

    if (normalized.length > 32) {
      throw new InvalidSlugError('must have at most 32 characters')
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(normalized)) {
      throw new InvalidSlugError(
        'must contain only letters, numbers, hyphens or underscores'
      )
    }

    return new Slug(normalized)
  }

  toString(): string {
    return this.value
  }
}
