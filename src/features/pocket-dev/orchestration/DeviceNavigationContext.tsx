import { createContext, useContext } from 'react'
import type { LcdSelection } from '../navigation/lcdSelection'

interface DeviceNavigationValue {
  contactSelection: LcdSelection
  homeSelection: LcdSelection
  isSnakeUnlocked: boolean
  openSnake: () => void
}

export const DeviceNavigationContext = createContext<DeviceNavigationValue | null>(null)

export function useDeviceNavigation() {
  const deviceNavigation = useContext(DeviceNavigationContext)

  if (!deviceNavigation) {
    throw new Error('Page must render inside the Pocket Dev Device')
  }

  return deviceNavigation
}
