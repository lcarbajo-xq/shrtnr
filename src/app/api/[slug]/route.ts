import { serviceContainer } from '@/infrastructure/short-link/shared/service-container'
import { mapErrorToHttp } from '@/presentation/short-link/mapErrorToHttp'
import { slugParamSchema } from '@/lib/schemas/url'
import { validateData } from '@/lib/validation'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params

    const validation = validateData(slugParamSchema, resolvedParams)
    if (!validation.success) {
      return validation.error
    }

    const link = await serviceContainer.shortLink.getBySlug.execute(
      validation.data.slug
    )

    return NextResponse.redirect(link.originalUrl.toString(), 302)
  } catch (error) {
    console.error('Error resolving slug:', error)
    return mapErrorToHttp(error)
  }
}
