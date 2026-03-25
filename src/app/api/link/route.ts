import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    console.log({ url })
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
