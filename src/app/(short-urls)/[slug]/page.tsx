import { notFound, redirect, RedirectType } from 'next/navigation'

export default async function ShortLinkPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const response = await fetch(
    `http://localhost:3000/api/links/${slug}/resolve`,
    {
      method: 'POST'
    }
  )
  const data = await response.json()

  if (!response.ok || !data.url) {
    notFound()
  }

  if (data.url) redirect(data.url, RedirectType.replace)
}
