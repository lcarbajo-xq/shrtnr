'use client'

import { useEffect, useState } from 'react'

type LinkItem = {
  id: string
  originalUrl: string
  slug: string
  title?: string | null
  clicks: number
  shortUrl: string
  createdAt: string
  updatedAt: string
}

type FormState = {
  originalUrl: string
  title: string
  customSlug: string
}

const initialForm: FormState = {
  originalUrl: '',
  title: '',
  customSlug: ''
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [form, setForm] = useState<FormState>(initialForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function loadLinks() {
    const res = await fetch('/api/links')
    const data = await res.json()
    setLinks(data)
  }

  useEffect(() => {
    loadLinks()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingId) {
        await fetch(`/api/links/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originalUrl: form.originalUrl,
            title: form.title || null,
            slug: form.customSlug || undefined
          })
        })
      } else {
        await fetch('/api/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originalUrl: form.originalUrl,
            title: form.title || undefined,
            customSlug: form.customSlug || undefined
          })
        })
      }

      //   setForm(initialForm)
      setEditingId(null)
      await loadLinks()
    } finally {
      setLoading(false)
    }
  }

  function startEdit(link: LinkItem) {
    setEditingId(link.id)
    setForm({
      originalUrl: link.originalUrl,
      title: link.title ?? '',
      customSlug: link.slug
    })
  }

  async function removeLink(id: string) {
    await fetch(`/api/links/${id}`, {
      method: 'DELETE'
    })

    await loadLinks()
  }

  return (
    <main className='relative max-w-225 my-10 mx-auto p-6 bg-secondary-container'>
      <h1>Gestión de links</h1>

      <form
        onSubmit={onSubmit}
        style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        <input
          placeholder='https://example.com'
          value={form.originalUrl}
          onChange={(e) =>
            setForm((s) => ({ ...s, originalUrl: e.target.value }))
          }
        />

        <input
          placeholder='Título opcional'
          value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
        />

        <input
          placeholder='Slug opcional'
          value={form.customSlug}
          onChange={(e) =>
            setForm((s) => ({ ...s, customSlug: e.target.value }))
          }
        />

        <div style={{ display: 'flex', gap: 12 }}>
          <button disabled={loading} type='submit'>
            {editingId ? 'Guardar cambios' : 'Crear link'}
          </button>

          {editingId && (
            <button
              type='button'
              onClick={() => {
                setEditingId(null)
                setForm(initialForm)
              }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: '32px 0' }} />

      <ul style={{ display: 'grid', gap: 16, padding: 0, listStyle: 'none' }}>
        {links.map((link) => (
          <li
            key={link.id}
            style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
            <strong>{link.title || link.slug}</strong>
            <p>Destino: {link.originalUrl}</p>
            <p>Short URL: {`http://short.rl/${link.slug}`}</p>
            <p>Clicks: {link.clicks}</p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => startEdit(link)}>Editar</button>
              <button onClick={() => removeLink(link.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
