import '../pocket-dev.css'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useCallback, useMemo } from 'react'
import { PocketDevDevice as DeviceHardware } from '@/components/device'
import { resumeContent } from '@/content/resume/resumeContent'
import { getContactTargetWindowTarget } from '../contact/contactTargets'
import { useDeviceKeyboardControls } from '../hooks/useDeviceKeyboardControls'
import { useMobileLandscape } from '../hooks/useMobileLandscape'
import { useLcdSelection } from '../navigation/lcdSelection'
import { pageCatalog } from '../navigation/pageCatalog'
import { RotatePage } from '../pages/RotatePage'
import { DeviceNavigationContext } from './DeviceNavigationContext'
import type { ChildrenProps, SelectionDelta } from './types'

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

  useDeviceKeyboardControls({ activateSelection, moveSelection, returnHome })

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
