import { useEffect, useState } from 'react'

const mobileLandscapeQuery = '(max-width: 900px) and (orientation: landscape)'

export function useMobileLandscape() {
  const [isMobileLandscape, setIsMobileLandscape] = useState(() => getMobileLandscapeMatch())

  useEffect(() => {
    if (!window.matchMedia) return

    const mediaQuery = window.matchMedia(mobileLandscapeQuery)
    if (!mediaQuery) return

    const handleChange = () => setIsMobileLandscape(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isMobileLandscape
}

function getMobileLandscapeMatch() {
  if (typeof window === 'undefined' || !window.matchMedia) return false

  return Boolean(window.matchMedia(mobileLandscapeQuery)?.matches)
}
