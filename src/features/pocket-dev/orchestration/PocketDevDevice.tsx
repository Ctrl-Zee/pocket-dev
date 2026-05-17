import '../pocket-dev.css'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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
import { SecretSnakePage } from '../pages/SecretSnakePage'
import { SecretSnakeUnlockPage } from '../pages/SecretSnakeUnlockPage'
import { useDeviceSfx } from '../sfx/deviceSfx'
import {
  advanceSnake,
  changeSnakeDirection,
  createInitialSnakeGame,
  snakeTickMs,
  toggleSnakeGame,
} from '../snake/snakeGame'
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
  const [isSnakeUnlocked, setIsSnakeUnlocked] = useState(false)
  const [isShowingSnake, setIsShowingSnake] = useState(false)
  const [isShowingSnakeUnlock, setIsShowingSnakeUnlock] = useState(false)
  const [snakeGame, setSnakeGame] = useState(createInitialSnakeGame)
  const visibleHomeItemCount = isSnakeUnlocked ? pageCatalog.length + 1 : pageCatalog.length
  const homeSelection = useLcdSelection(visibleHomeItemCount)
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
      setIsSnakeUnlocked(true)
      setIsShowingSnakeUnlock(true)
      playDeviceSfx('konami')

      return true
    },
    [playDeviceSfx],
  )

  const moveSelection = useCallback(
    (delta: SelectionDelta, direction: DeviceMoveDirection) => {
      if (isShowingSnake) {
        setSnakeGame((currentGame) => changeSnakeDirection(currentGame, direction))
        playDeviceSfx('blip')
        return
      }

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
    [
      contactSelection,
      homeSelection,
      isContactRoute,
      isHomeRoute,
      isShowingSnake,
      playDeviceSfx,
      trackKonamiInput,
    ],
  )

  const toggleSnakeGameStatus = useCallback(() => {
    setSnakeGame(toggleSnakeGame)
  }, [])

  const resetSnakeGame = useCallback(() => {
    setSnakeGame(createInitialSnakeGame)
  }, [])

  const activateSelection = useCallback(() => {
    if (isShowingSnake) {
      toggleSnakeGameStatus()
      playDeviceSfx('confirm')
      return
    }

    if (trackKonamiInput('a')) return

    if (isHomeRoute) {
      const selectedPage = pageCatalog[homeSelection.selectedIndex]

      playDeviceSfx('confirm')
      if (!selectedPage && isSnakeUnlocked) {
        setIsShowingSnake(true)
        return
      }

      if (!selectedPage) return

      void navigate({ to: selectedPage.href })
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
    isShowingSnake,
    isSnakeUnlocked,
    navigate,
    playDeviceSfx,
    trackKonamiInput,
    toggleSnakeGameStatus,
  ])

  const returnHome = useCallback(() => {
    if (isShowingSnake) {
      setIsShowingSnake(false)
      resetSnakeGame()
      playDeviceSfx('back')
      void navigate({ to: '/' })
      return
    }

    trackKonamiInput('b')
    setIsShowingSnake(false)
    setIsShowingSnakeUnlock(false)
    playDeviceSfx('back')
    void navigate({ to: '/' })
  }, [isShowingSnake, navigate, playDeviceSfx, resetSnakeGame, trackKonamiInput])

  const openSnake = useCallback(() => {
    if (!isSnakeUnlocked) return

    setIsShowingSnakeUnlock(false)
    resetSnakeGame()
    setIsShowingSnake(true)
  }, [isSnakeUnlocked, resetSnakeGame])

  const handleSelect = useCallback(() => {
    playDeviceSfx('select')
    toggleMute()
  }, [playDeviceSfx, toggleMute])

  const handleStart = useCallback(() => {
    if (isShowingSnake) {
      toggleSnakeGameStatus()
      playDeviceSfx('start')
      return
    }

    playDeviceSfx('start')
  }, [isShowingSnake, playDeviceSfx, toggleSnakeGameStatus])

  useDeviceKeyboardControls({ activateSelection, moveSelection, returnHome })

  useEffect(() => {
    if (!isShowingSnake || snakeGame.status !== 'running') return

    const tickId = window.setInterval(() => {
      setSnakeGame(advanceSnake)
    }, snakeTickMs)

    return () => {
      window.clearInterval(tickId)
    }
  }, [isShowingSnake, snakeGame.status])

  const deviceNavigation = useMemo(
    () => ({
      contactSelection,
      homeSelection,
      isSnakeUnlocked,
      openSnake,
    }),
    [contactSelection, homeSelection, isSnakeUnlocked, openSnake],
  )

  let lcdContent = children

  if (isShowingSnakeUnlock) {
    lcdContent = <SecretSnakeUnlockPage />
  }

  if (isShowingSnake) {
    lcdContent = <SecretSnakePage game={snakeGame} />
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
