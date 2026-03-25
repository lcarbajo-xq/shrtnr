import { urlSchema } from '@/lib/schemas/url'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = urlSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: 'Invalid URL' }, { status: 400 })
    }
    const { url } = result.data
    console.log('Received URL:', url)
    const shortenedUrl = `https://shrtnr.com/${Math.random().toString(36).substring(2, 8)}`
    return NextResponse.json({ message: 'URL received', shortenedUrl })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { message: 'Error processing request' },
      { status: 500 }
    )
  }
}
