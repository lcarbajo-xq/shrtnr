import { mapErrorToHttp } from '@/presentation/short-link/mapErrorToHttp'
import {
  createShortLinkSchema,
  updateShortLinkSchema,
  slugParamSchema
} from '@/lib/schemas/url'
import { validateData } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'
import { type ServiceContainer } from '../shared/service-container'

export class ShortLinkController {
  constructor(private readonly serviceContainer: ServiceContainer) {}

  private async extractSlug(
    params: Promise<{ slug: string }>
  ): Promise<string | NextResponse> {
    const resolvedParams = await params
    const validation = validateData(slugParamSchema, resolvedParams)

    if (!validation.success) {
      return validation.error
    }

    return validation.data.slug
  }

  async generate(request: NextRequest): Promise<NextResponse> {
    let body: unknown
    try {
      body = await request.json()
      const validation = validateData(createShortLinkSchema, body)
      if (!validation.success) {
        return validation.error
      }

      const link = await this.serviceContainer.shortLink.generate.execute({
        originalUrl: validation.data.originalUrl,
        title: validation.data.title,
        customSlug: validation.data.customSlug
      })
      return NextResponse.json({ link }, { status: 201 })
    } catch (error) {
      return this.handleError('Error creating link:', error)
    }
  }

  async getAll(): Promise<NextResponse> {
    try {
      const links = await this.serviceContainer.shortLink.getAll.execute()

      return NextResponse.json(
        links.map((link) => link.toPrimitives()),
        { status: 200 }
      )
    } catch (error) {
      return this.handleError('Error fetching links:', error)
    }
  }

  async getBySlug({
    params
  }: {
    params: Promise<{ slug: string }>
  }): Promise<NextResponse> {
    try {
      const slug = await this.extractSlug(params)
      if (slug instanceof NextResponse) {
        return slug
      }

      const link = await this.serviceContainer.shortLink.getBySlug.execute(slug)

      return NextResponse.json(link.toPrimitives(), { status: 200 })
    } catch (error) {
      return this.handleError('Error fetching link by slug:', error)
    }
  }

  async delete({
    params
  }: {
    params: Promise<{ slug: string }>
  }): Promise<NextResponse> {
    try {
      const slug = await this.extractSlug(params)
      if (slug instanceof NextResponse) {
        return slug
      }

      await this.serviceContainer.shortLink.delete.execute(slug)
      return NextResponse.json({ status: 200 }, { status: 200 })
    } catch (error) {
      return this.handleError('Error deleting short link:', error)
    }
  }

  async update(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
  ): Promise<NextResponse> {
    let body: unknown
    try {
      const slug = await this.extractSlug(params)
      if (slug instanceof NextResponse) {
        return slug
      }

      body = await request.json()

      const bodyValidation = validateData(updateShortLinkSchema, body)
      if (!bodyValidation.success) {
        return bodyValidation.error
      }

      await this.serviceContainer.shortLink.update.execute({
        slugStr: slug,
        originalUrl: bodyValidation.data.originalUrl,
        title: bodyValidation.data.title
      })

      return NextResponse.json({ status: 200 }, { status: 200 })
    } catch (error) {
      return this.handleError('Error updating link:', error)
    }
  }

  async resolve({ params }: { params: Promise<{ slug: string }> }) {
    try {
      const slug = await this.extractSlug(params)
      if (slug instanceof NextResponse) {
        return slug
      }

      const url = await this.serviceContainer.shortLink.resolve.execute(slug)
      return NextResponse.json({ url }, { status: 200 })
    } catch (error) {
      return this.handleError('Error resolving short link:', error)
    }
  }

  private handleError(message: string, error: unknown): NextResponse {
    const response = mapErrorToHttp(error)
    if (response.status >= 500) {
      console.error(message, error)
    }
    return response
  }
}
