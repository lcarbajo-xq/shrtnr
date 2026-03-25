import { Header } from '@/components/ui/header'
import { HeroSection } from '@/components/ui/landing/hero-section'

export default function Home() {
  return (
    <main className='relative flex min-h-screen w-full flex-col bg-background/0 px-4 py-6 sm:px-6 lg:px-10 text'>
      <Header />
      <HeroSection />
    </main>
  )
}
