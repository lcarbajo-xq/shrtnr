import { InvalidLinkUrlError } from '../errors/domain-error'

export class LinkUrl {
  constructor(private readonly value: string) {}
  static create(raw: string): LinkUrl {
    const normalized = raw.trim()
    try {
      const url = new URL(normalized)

      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new InvalidLinkUrlError(raw)
      }
      return new LinkUrl(url.toString())
    } catch {
      throw new InvalidLinkUrlError(raw)
    }
  }

  toString() {
    return this.value
  }
}
