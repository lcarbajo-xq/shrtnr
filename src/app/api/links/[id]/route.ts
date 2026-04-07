import { type NextRequest } from 'next/server'
import { shortLinkController } from '@/infrastructure/short-link/shared/dependencies'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await shortLinkController.getBySlug({ params })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await shortLinkController.update(request, { params })
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await shortLinkController.delete({ params })
}
