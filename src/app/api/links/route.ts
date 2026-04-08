import { shortLinkController } from '@/infrastructure/short-link/shared/dependencies'

import { type NextRequest } from 'next/server'

export async function GET() {
  return await shortLinkController.getAll()
}

export async function POST(request: NextRequest) {
  return await shortLinkController.generate(request)
}
