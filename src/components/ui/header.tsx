import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className='flex justify-between items-center w-full px-6 h-16 bg-[#0e0e0e]/70 border-b border-surface-container fixed top-0 right-0 z-50'>
      <nav className=' flex justify-between items-center px-6 h-full w-full'>
        {/* <div className='flex items-center gap-6'> */}
        <div className='text-2xl font-bold tracking-tighter text-[#aaeb35] font-space-grotesk'>
          SHRTNR
        </div>
        <div className='hidden md:flex gap-8 items-center'>
          <Link
            className='text-zinc-500 hover:text-[`#aaeb35`] hover:border-b-2 hover:border-[`#aaeb35`] font-mono hover:bg-surface-container-high transition-colors uppercase text-xs tracking-widest py-1 px-2'
            href='#'>
            Dashboard
          </Link>
          <Link
            className='text-zinc-500 hover:text-[`#aaeb35`] hover:border-b-2 hover:border-[`#aaeb35`] font-mono hover:bg-surface-container-high transition-colors uppercase text-xs tracking-widest py-1 px-2'
            href='#'>
            Analytics
          </Link>
          <Link
            className='text-zinc-500 hover:text-[`#aaeb35`] hover:border-b-2 hover:border-[`#aaeb35`] font-mono hover:bg-surface-container-high transition-colors uppercase text-xs tracking-widest py-1 px-2'
            href='#'>
            API Keys
          </Link>
        </div>
        <div className='flex items-center gap-4'>
          <button className='bg-primary text-on-primary font-mono text-xs font-bold px-4 py-2 hover:opacity-90 active:scale-95 duration-75 uppercase tracking-tighter'>
            Generate Credential
          </button>
          <div className='w-8 h-8 bg-surface-container-highest border border-outline-variant flex items-center justify-center overflow-hidden'>
            <Image
              alt='User Tactical Avatar'
              className='w-full h-full object-cover'
              data-alt='Cyberpunk tactical operator avatar in low-key lighting with green neon accents'
              src='https://lh3.googleusercontent.com/aida-public/AB6AXuC9oDjUPX2d8sJWX492tSEhkJNn6zylZskhapw9dXpnjUnA8fe0MVMbuY8BLLsrWzTdKNdDvT7lpj4c8c5A1wi3XUtPqdCtjJyPI7cU5w7b-y85EImaByWiGQjxV2PjbyxxuxnU9tBLYCuzBplfo8k0GWUcGKKYtMbewBJbXxoY0WNlBcj0ksQQtwhL4964htvjS0deI08aANgfmAYcwc5UXq2gF2VyzvdYGXetRynEjfwwplGhSDCtWOEhejiSUBq61PZrZbQ7X0OP'
              width={32}
              height={32}
            />
          </div>
        </div>
      </nav>
    </header>
  )
}
