import type { Metadata } from 'next'
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Space_Grotesk,
  Inter
} from 'next/font/google'
import './globals.css'
import Dither from '@/components/ui/landing/dither'

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
      lang='en'
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning={true}>
      <body className='bg-transparent text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container w-full h-full'>
        {/* <div className='fixed inset-0 dot-matrix pointer-events-none'></div>
        <div className='scanline pointer-events-none'></div> */}
        <div className='fixed inset-0 pointer-events-none'>
          <Dither
            waveColor={[0.3, 0.5, 0.4]}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.3}
            colorNum={4}
            waveAmplitude={0.3}
            waveFrequency={3}
            waveSpeed={0.05}
          />
        </div>

        {children}
      </body>
    </html>
  )
}
