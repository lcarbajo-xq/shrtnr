import { shortLinkController } from '@/infrastructure/short-link/shared/dependencies'
import { NextRequest } from 'next/server'

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await shortLinkController.resolve({ params })
}
