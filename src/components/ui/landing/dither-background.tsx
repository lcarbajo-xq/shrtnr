'use client'

import { useEffect, useState } from 'react'
import Dither from './dither'

export function DitherBackground() {
  const [disableAnimation, setDisableAnimation] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const derive = () =>
      setDisableAnimation(
        motionQuery.matches || document.visibilityState === 'hidden'
      )

    derive()

    motionQuery.addEventListener('change', derive)
    document.addEventListener('visibilitychange', derive)

    return () => {
      motionQuery.removeEventListener('change', derive)
      document.removeEventListener('visibilitychange', derive)
    }
  }, [])

  return (
    <Dither
      waveColor={[0.3, 0.5, 0.4]}
      disableAnimation={disableAnimation}
      enableMouseInteraction
      mouseRadius={0.3}
      colorNum={4}
      waveAmplitude={0.3}
      waveFrequency={3}
      waveSpeed={0.05}
    />
  )
}
