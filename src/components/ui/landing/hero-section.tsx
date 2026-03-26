'use client'

import { urlSchema } from '@/lib/schemas/url'
import {
  ClipboardCopyIcon,
  LinkIcon,
  LoaderCircle,
  TerminalSquare
} from 'lucide-react'
import { useState } from 'react'

export function HeroSection() {
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cleanUrls = () => {
    setUrl('')
    setShortenedUrl(null)
    setError(null)
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    // validar con Zod y enviar a la API

    const urlToValidate = urlSchema.safeParse({ url })

    if (!urlToValidate.success) {
      setError(urlToValidate.error.issues[0].message)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: urlToValidate.data.url })
      })
      if (!response.ok) {
        throw new Error('Failed to shorten URL')
      }
      const data = await response.json()
      console.log('Shortened URL:', data)
      // Aquí podrías actualizar el estado para mostrar la URL acortada o redirigir al usuario
      setShortenedUrl(data.shortenedUrl)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }
  if (shortenedUrl && !loading) {
    // Si el usuario ha ingresado algo pero no es válido, mostrar error
    // Mostrar la url devuelta si es existosa
    return (
      <div className='max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center'>
        <h1 className='font-mono text-5xl md:text-8xl font-bold tracking-tighter text-[#e8f0d0] leading-none mb-8'>
          SUCCESS
        </h1>

        <p className='text-[#4a5c30] font-mono text-sm max-w-2xl mb-12 uppercase tracking-wide'>
          Your URL has been shortened successfully!
        </p>
        <button
          className='flex items-center gap-2 mb-6 text-primary font-mono text-lg font-bold uppercase tracking-wide hover:underline'
          onClick={() => navigator.clipboard.writeText(shortenedUrl)}>
          {shortenedUrl}
          <ClipboardCopyIcon className='text-lg text-primary' />
        </button>
        <button
          onClick={cleanUrls}
          className='bg-primary-container text-on-primary-container font-mono font-bold uppercase tracking-[0.2em] px-12 py-5 flex items-center justify-center gap-3 hover:bg-primary-fixed transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(168,232,50,0.2)]'>
          SHORTEN ANOTHER
        </button>
      </div>
    )
  }
  if (error) {
    return (
      <div className='max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center'>
        <h1 className='font-mono text-5xl md:text-8xl font-bold tracking-tighter text-[#e8f0d0] leading-none mb-8'>
          ERROR
        </h1>
        <p className='text-[#4a5c30] font-mono text-sm max-w-2xl mb-12 uppercase tracking-wide'>
          {error}
        </p>
        <button
          onClick={cleanUrls}
          className='bg-primary-container text-on-primary-container font-mono font-bold uppercase tracking-[0.2em] px-12 py-5 flex items-center justify-center gap-3 hover:bg-primary-fixed transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(168,232,50,0.2)]'>
          TRY AGAIN
        </button>
      </div>
    )
  }

  return (
    <section className='flex flex-col items-center justify-center py-20 lg:py-32'>
      <div className='text-center mb-12'>
        <div className='inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant mb-6'>
          <span className='text-[10px] font-label text-primary font-bold tracking-[0.2em] uppercase'>
            Tactical Link Intelligence
          </span>
        </div>
        <h1 className='text-5xl lg:text-7xl font-headline font-bold tracking-tighter mb-6 max-w-4xl leading-[0.9]'>
          COMMAND YOUR <span className='text-primary'>TRAFFIC</span> WITH
          SURGICAL PRECISION.
        </h1>
        <p className='text-zinc-400 font-label text-sm max-w-xl mx-auto uppercase tracking-wide'>
          The next-generation redirection engine for high-stakes digital
          operations.
        </p>
      </div>
      <div className='w-full max-w-3xl glass-panel p-1 border border-outline-variant focus-within:border-primary transition-all duration-300'>
        <form
          className='flex flex-col md:flex-row gap-1'
          onSubmit={handleSubmit}>
          <div className='relative grow'>
            <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
              <LinkIcon className='text-zinc-500 text-sm' />
            </div>
            <input
              className='w-full bg-surface-container-lowest border-none text-on-surface font-label placeholder:text-zinc-600 py-4 pl-12 pr-4 focus:ring-0 text-sm outline-none'
              placeholder='PASTE TARGET COORDINATES (URL)...'
              type='url'
              name='url'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            className='bg-primary text-on-primary font-label font-bold px-8 py-4 flex items-center justify-center gap-2 hover:opacity-90 transition-all uppercase tracking-tighter active:scale-95'
            type='submit'
            disabled={loading}
            aria-busy={loading}>
            {loading ? (
              <>
                PROCESSING <LoaderCircle className='text-lg animate-spin' />
              </>
            ) : (
              <>
                SHRTN IT <TerminalSquare className='text-lg' />
              </>
            )}
          </button>
        </form>
      </div>
      <div className='mt-4 font-label text-[10px] text-zinc-600 uppercase tracking-widest flex gap-4'>
        <span>[ STATUS: READY ]</span>
        <span>[ BYPASS_MODE: ENABLED ]</span>
        <span>[ AUTH: CL-4 ]</span>
      </div>
    </section>
  )
}
