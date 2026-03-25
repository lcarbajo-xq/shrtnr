import type { Metadata } from 'next'
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Space_Grotesk,
  Inter
} from 'next/font/google'
import './globals.css'
import { DitherBackground } from '@/components/ui/landing/dither-background'

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700']
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700']
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Shrtnr | Acortador de URLs',
  description: 'Acorta, gestiona y comparte enlaces en segundos.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='es'
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning={true}>
      <body className='bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container w-full h-full'>
        <div className='fixed inset-0 pointer-events-none'>
          <DitherBackground />
        </div>
        {children}
      </body>
    </html>
  )
}
