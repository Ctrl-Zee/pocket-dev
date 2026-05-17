import '../pocket-dev.css'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { PocketDevDevice as DeviceHardware } from '@/components/device'
import type { DeviceMoveDirection } from '@/components/device/types'
import { resumeContent } from '@/content/resume/resumeContent'
import { getContactTargetWindowTarget } from '../contact/contactTargets'
import { useDeviceKeyboardControls } from '../hooks/useDeviceKeyboardControls'
import { useMobileLandscape } from '../hooks/useMobileLandscape'
import { useLcdSelection } from '../navigation/lcdSelection'
import type { SelectionDelta } from '../navigation/lcdSelection'
import { pageCatalog } from '../navigation/pageCatalog'
import { RotatePage } from '../pages/RotatePage'
import { SecretSnakeUnlockPage } from '../pages/SecretSnakeUnlockPage'
import { useDeviceSfx } from '../sfx/deviceSfx'
import { DeviceNavigationContext } from './DeviceNavigationContext'

interface PocketDevDeviceProps {
  children: ReactNode
}

type KonamiInput = DeviceMoveDirection | 'a' | 'b'

const konamiSequence = [
  'up',
  'up',
  'down',
  'down',
  'left',
  'right',
  'left',
  'right',
  'b',
  'a',
] as const satisfies readonly KonamiInput[]

export function PocketDevDevice({ children }: PocketDevDeviceProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const konamiProgressRef = useRef(0)
  const isHomeRoute = location.pathname === '/'
  const isContactRoute = location.pathname === '/contact'
  const shouldShowRotatePrompt = useMobileLandscape()
  const [isShowingSnakeUnlock, setIsShowingSnakeUnlock] = useState(false)
  const homeSelection = useLcdSelection(pageCatalog.length)
  const contactSelection = useLcdSelection(resumeContent.contactTargets.length, {
    resetKey: isContactRoute ? location.pathname : undefined,
  })
  const { isMuted, playDeviceSfx, toggleMute } = useDeviceSfx()

  const trackKonamiInput = useCallback(
    (input: KonamiInput) => {
      const nextProgress = getNextKonamiProgress(konamiProgressRef.current, input)

      konamiProgressRef.current = nextProgress

      if (nextProgress !== konamiSequence.length) return false

      konamiProgressRef.current = 0
      setIsShowingSnakeUnlock(true)
      playDeviceSfx('konami')

      return true
    },
    [playDeviceSfx],
  )

  const moveSelection = useCallback(
    (delta: SelectionDelta, direction: DeviceMoveDirection) => {
      trackKonamiInput(direction)

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
    [contactSelection, homeSelection, isContactRoute, isHomeRoute, playDeviceSfx, trackKonamiInput],
  )

  const activateSelection = useCallback(() => {
    if (trackKonamiInput('a')) return

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
    trackKonamiInput,
  ])

  const returnHome = useCallback(() => {
    trackKonamiInput('b')
    playDeviceSfx('back')
    void navigate({ to: '/' })
  }, [navigate, playDeviceSfx, trackKonamiInput])

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

  let lcdContent = children

  if (isShowingSnakeUnlock) {
    lcdContent = <SecretSnakeUnlockPage />
  }

  if (shouldShowRotatePrompt) {
    lcdContent = <RotatePage />
  }

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
          {lcdContent}
        </DeviceHardware>
      </DeviceNavigationContext.Provider>

      <p className="control-hint">ARROWS MOVE / ENTER A / ESC B</p>
    </div>
  )
}

function getNextKonamiProgress(currentProgress: number, input: KonamiInput) {
  if (input === konamiSequence[currentProgress]) return currentProgress + 1
  if (input === konamiSequence[0]) return 1
  return 0
}
