import { notFound, redirect, RedirectType } from 'next/navigation'

export default async function ShortLinkPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000'
  let data: { url?: string } = {}
  try {
    const response = await fetch(
      `${baseUrl}/api/links/${encodeURIComponent(slug)}/resolve`,
      {
        method: 'POST',
        cache: 'no-store'
      }
    )

    data = await response.json()
    if (!data.url) notFound()
  } catch {
    notFound()
  }

  if (data.url) redirect(data.url, RedirectType.replace)
}
