import { useEffect } from 'react'
import type { SelectionDelta } from '../navigation/lcdSelection'
import type { DeviceMoveDirection } from '@/components/device/types'

interface DeviceKeyboardControls {
  activateSelection: () => void
  moveSelection: (delta: SelectionDelta, direction: DeviceMoveDirection) => void
  pressStart: () => void
  returnHome: () => void
  useWasdMovement?: boolean
}

interface KeyboardMovementControl {
  delta: SelectionDelta
  direction: DeviceMoveDirection
}

const arrowKeyMovementControls: Readonly<Record<string, KeyboardMovementControl>> = {
  ArrowUp: { delta: -1, direction: 'up' },
  ArrowLeft: { delta: -1, direction: 'left' },
  ArrowDown: { delta: 1, direction: 'down' },
  ArrowRight: { delta: 1, direction: 'right' },
}

const wasdMovementControls: Readonly<Record<string, KeyboardMovementControl>> = {
  w: { delta: -1, direction: 'up' },
  a: { delta: -1, direction: 'left' },
  s: { delta: 1, direction: 'down' },
  d: { delta: 1, direction: 'right' },
}

export function useDeviceKeyboardControls({
  activateSelection,
  moveSelection,
  pressStart,
  returnHome,
  useWasdMovement = false,
}: DeviceKeyboardControls) {
  useEffect(() => {
    function handleKeyboardControls(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key

      const movementControl = getKeyboardMovementControl(key, useWasdMovement)

      if (movementControl) {
        event.preventDefault()
        moveSelection(movementControl.delta, movementControl.direction)
        return
      }

      if (key === 'p' && useWasdMovement) {
        event.preventDefault()
        pressStart()
        return
      }

      switch (key) {
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
  }, [activateSelection, moveSelection, pressStart, returnHome, useWasdMovement])
}

function getKeyboardMovementControl(key: string, useWasdMovement: boolean) {
  const arrowKeyControl = arrowKeyMovementControls[key]

  if (arrowKeyControl) return arrowKeyControl
  if (!useWasdMovement) return undefined

  return wasdMovementControls[key]
}
