import { useEffect } from 'react'
import type { SelectionDelta } from '../navigation/lcdSelection'
import type { DeviceMoveDirection } from '@/components/device/types'

interface DeviceKeyboardControls {
  activateSelection: () => void
  moveSelection: (delta: SelectionDelta, direction: DeviceMoveDirection) => void
  returnHome: () => void
}

export function useDeviceKeyboardControls({
  activateSelection,
  moveSelection,
  returnHome,
}: DeviceKeyboardControls) {
  useEffect(() => {
    function handleKeyboardControls(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key

      switch (key) {
        case 'ArrowUp':
          event.preventDefault()
          moveSelection(-1, 'up')
          return
        case 'ArrowLeft':
          event.preventDefault()
          moveSelection(-1, 'left')
          return
        case 'ArrowDown':
          event.preventDefault()
          moveSelection(1, 'down')
          return
        case 'ArrowRight':
          event.preventDefault()
          moveSelection(1, 'right')
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
}
