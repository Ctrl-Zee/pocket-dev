import '../pocket-dev.css'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useCallback, useMemo, type ReactNode } from 'react'
import { PocketDevDevice as DeviceHardware } from '@/components/device'
import { resumeContent } from '@/content/resume/resumeContent'
import { getContactTargetWindowTarget } from '../contact/contactTargets'
import { useDeviceKeyboardControls } from '../hooks/useDeviceKeyboardControls'
import { useMobileLandscape } from '../hooks/useMobileLandscape'
import { useLcdSelection } from '../navigation/lcdSelection'
import type { SelectionDelta } from '../navigation/lcdSelection'
import { pageCatalog } from '../navigation/pageCatalog'
import { RotatePage } from '../pages/RotatePage'
import { useDeviceSfx } from '../sfx/deviceSfx'
import { DeviceNavigationContext } from './DeviceNavigationContext'

interface PocketDevDeviceProps {
  children: ReactNode
}

export function PocketDevDevice({ children }: PocketDevDeviceProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHomeRoute = location.pathname === '/'
  const isContactRoute = location.pathname === '/contact'
  const shouldShowRotatePrompt = useMobileLandscape()
  const homeSelection = useLcdSelection(pageCatalog.length)
  const contactSelection = useLcdSelection(resumeContent.contactTargets.length, {
    resetKey: isContactRoute ? location.pathname : undefined,
  })
  const { isMuted, playDeviceSfx, toggleMute } = useDeviceSfx()

  const moveSelection = useCallback(
    (delta: SelectionDelta) => {
      if (isHomeRoute) {
        playDeviceSfx('blip')
        homeSelection.moveSelection(delta)
        return
      }

      if (isContactRoute) {
        playDeviceSfx('blip')
        contactSelection.moveSelection(delta)
        return
      }

      playDeviceSfx('error')
    },
    [contactSelection, homeSelection, isContactRoute, isHomeRoute, playDeviceSfx],
  )

  const activateSelection = useCallback(() => {
    if (isHomeRoute) {
      playDeviceSfx('confirm')
      void navigate({ to: pageCatalog[homeSelection.selectedIndex].href })
      return
    }

    if (isContactRoute) {
      const contactTarget = resumeContent.contactTargets[contactSelection.selectedIndex]

      playDeviceSfx('confirm')
      window.open(contactTarget.href, getContactTargetWindowTarget(contactTarget.href), 'noreferrer')
      return
    }

    playDeviceSfx('error')
  }, [
    contactSelection.selectedIndex,
    homeSelection.selectedIndex,
    isContactRoute,
    isHomeRoute,
    navigate,
    playDeviceSfx,
  ])

  const returnHome = useCallback(() => {
    playDeviceSfx('back')
    void navigate({ to: '/' })
  }, [navigate, playDeviceSfx])

  const handleSelect = useCallback(() => {
    playDeviceSfx('select')
    toggleMute()
  }, [playDeviceSfx, toggleMute])

  const handleStart = useCallback(() => {
    playDeviceSfx('start')
  }, [playDeviceSfx])

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
          isMuted={isMuted}
          onActivate={activateSelection}
          onMove={moveSelection}
          onReturnHome={returnHome}
          onSelect={handleSelect}
          onStart={handleStart}
        >
          {shouldShowRotatePrompt ? <RotatePage /> : children}
        </DeviceHardware>
      </DeviceNavigationContext.Provider>

      <p className="control-hint">ARROWS MOVE / ENTER A / ESC B</p>
    </div>
  )
}
