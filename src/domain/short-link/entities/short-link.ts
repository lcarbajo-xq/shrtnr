import { LinkUrl } from '../value-objects/link-url'
import { Slug } from '../value-objects/slug'

type ShortLinkProperties = {
  id: string
  slug: Slug
  originalUrl: LinkUrl
  clicks: number
  updatedAt: Date
  createdAt: Date
  title: string | null
}

export type ShortLinkPrimitives = {
  id: string
  slug: string
  updatedAt: string
  clicks: number
  originalUrl: string
  createdAt: string
  title: string
}

export class ShortLink {
  private constructor(private readonly props: ShortLinkProperties) {}

  static create(props: ShortLinkProperties): ShortLink {
    return new ShortLink(props)
  }

  get id() {
    return this.props.id
  }

  get clicks() {
    return this.props.clicks
  }

  get slug() {
    return this.props.slug
  }

  get originalUrl() {
    return this.props.originalUrl
  }

  get createdAt() {
    return this.props.createdAt
  }

  get title() {
    return this.props.title
  }

  toPrimitives(): ShortLinkPrimitives {
    return {
      id: this.id,
      slug: this.slug.toString(),
      originalUrl: this.originalUrl.toString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
      clicks: this.props.clicks,
      title: this.title ?? 'Untitled'
    }
  }
}
