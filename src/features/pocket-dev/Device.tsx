import './pocket-dev.css'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PocketDevDevice as DeviceHardware } from '@/components/device'
import { resumeContent } from '@/content/resume/resumeContent'
import { RotatePage } from './RotatePage'
import { getContactTargetWindowTarget } from './contactTargets'
import { useLcdSelection, type LcdSelection } from './lcdSelection'
import { pageCatalog } from './pageCatalog'
import type { ChildrenProps, SelectionDelta } from './types'

const mobileLandscapeQuery = '(max-width: 900px) and (orientation: landscape)'

interface DeviceNavigationValue {
  contactSelection: LcdSelection
  homeSelection: LcdSelection
}

const DeviceNavigationContext = createContext<DeviceNavigationValue | null>(null)

export function PocketDevDevice({ children }: ChildrenProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHomeRoute = location.pathname === '/'
  const isContactRoute = location.pathname === '/contact'
  const shouldShowRotatePrompt = useMobileLandscape()
  const homeSelection = useLcdSelection(pageCatalog.length)
  const contactSelection = useLcdSelection(resumeContent.contactTargets.length, {
    resetKey: isContactRoute ? location.pathname : undefined,
  })

  const moveSelection = useCallback(
    (delta: SelectionDelta) => {
      if (isHomeRoute) {
        homeSelection.moveSelection(delta)
        return
      }

      if (isContactRoute) {
        contactSelection.moveSelection(delta)
      }
    },
    [contactSelection, homeSelection, isContactRoute, isHomeRoute],
  )

  const activateSelection = useCallback(() => {
    if (isHomeRoute) {
      void navigate({ to: pageCatalog[homeSelection.selectedIndex].href })
      return
    }

    if (isContactRoute) {
      const contactTarget = resumeContent.contactTargets[contactSelection.selectedIndex]

      window.open(contactTarget.href, getContactTargetWindowTarget(contactTarget.href), 'noreferrer')
    }
  }, [
    contactSelection.selectedIndex,
    homeSelection.selectedIndex,
    isContactRoute,
    isHomeRoute,
    navigate,
  ])

  const returnHome = useCallback(() => {
    void navigate({ to: '/' })
  }, [navigate])

  useEffect(() => {
    function handleKeyboardControls(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key

      switch (key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault()
          moveSelection(-1)
          return
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault()
          moveSelection(1)
          return
        case 'Enter':
        case ' ':
        case 'a':
          event.preventDefault()
          activateSelection()
          return
        case 'Escape':
        case 'Backspace':
        case 'b':
          event.preventDefault()
          returnHome()
      }
    }

    window.addEventListener('keydown', handleKeyboardControls)

    return () => {
      window.removeEventListener('keydown', handleKeyboardControls)
    }
  }, [activateSelection, moveSelection, returnHome])

  const deviceNavigation = useMemo(
    () => ({
      contactSelection,
      homeSelection,
    }),
    [contactSelection, homeSelection],
  )

  return (
    <div className="pocket-dev-stage">
      <DeviceNavigationContext.Provider value={deviceNavigation}>
        <DeviceHardware
          onActivate={activateSelection}
          onMove={moveSelection}
          onReturnHome={returnHome}
        >
          {shouldShowRotatePrompt ? <RotatePage /> : children}
        </DeviceHardware>
      </DeviceNavigationContext.Provider>

      <p className="control-hint">ARROWS MOVE / ENTER A / ESC B</p>
    </div>
  )
}

export function useDeviceNavigation() {
  const deviceNavigation = useContext(DeviceNavigationContext)

  if (!deviceNavigation) {
    throw new Error('Page must render inside the Pocket Dev Device')
  }

  return deviceNavigation
}

function useMobileLandscape() {
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
