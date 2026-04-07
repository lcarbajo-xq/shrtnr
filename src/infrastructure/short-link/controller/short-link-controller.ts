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

  async generate(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()

      const validation = validateData(createShortLinkSchema, body)
      if (!validation.success) {
        return validation.error
      }

      await this.serviceContainer.shortLink.generate.execute({
        originalUrl: validation.data.originalUrl,
        title: validation.data.title,
        customSlug: validation.data.customSlug
      })

      return NextResponse.json({ status: 201 }, { status: 201 })
    } catch (error) {
      console.error('Error creating link:', error)
      return mapErrorToHttp(error)
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
      console.error('Error fetching links:', error)
      return mapErrorToHttp(error)
    }
  }

  async getBySlug({
    params
  }: {
    params: Promise<{ slug: string }>
  }): Promise<NextResponse> {
    try {
      const resolvedParams = await params

      const validation = validateData(slugParamSchema, resolvedParams)
      if (!validation.success) {
        return validation.error
      }

      const link = await this.serviceContainer.shortLink.getBySlug.execute(
        validation.data.slug
      )

      return NextResponse.json(link.toPrimitives(), { status: 200 })
    } catch (error) {
      console.error('Error fetching link:', error)
      return mapErrorToHttp(error)
    }
  }

  async delete({
    params
  }: {
    params: Promise<{ slug: string }>
  }): Promise<NextResponse> {
    try {
      const resolvedParams = await params

      const validation = validateData(slugParamSchema, resolvedParams)
      if (!validation.success) {
        return validation.error
      }

      await this.serviceContainer.shortLink.delete.execute(validation.data.slug)
      return NextResponse.json({ status: 200 })
    } catch (error) {
      console.error('Error deleting short link:', error)
      return mapErrorToHttp(error)
    }
  }

  async update(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
  ): Promise<NextResponse> {
    try {
      const resolvedParams = await params

      const paramsValidation = validateData(slugParamSchema, resolvedParams)
      if (!paramsValidation.success) {
        return paramsValidation.error
      }

      const body = await request.json()

      const bodyValidation = validateData(updateShortLinkSchema, body)
      if (!bodyValidation.success) {
        return bodyValidation.error
      }

      await this.serviceContainer.shortLink.update.execute({
        slugStr: paramsValidation.data.slug,
        originalUrl: bodyValidation.data.originalUrl,
        title: bodyValidation.data.title
      })

      return NextResponse.json({ status: 200 })
    } catch (error) {
      console.error('Error updating link:', error)
      return mapErrorToHttp(error)
    }
  }

  async resolve({ params }: { params: Promise<{ slug: string }> }) {
    try {
      const resolvedParams = await params

      const validation = validateData(slugParamSchema, resolvedParams)
      if (!validation.success) {
        return validation.error
      }

      const url = await this.serviceContainer.shortLink.resolve.execute(
        validation.data.slug
      )
      return NextResponse.json({ url }, { status: 200 })
    } catch (error) {
      console.error('Error resolving short link:', error)
      return mapErrorToHttp(error)
    }
  }
}
