import type { ReactNode } from 'react'

export type DeviceMoveDelta = -1 | 1
export type DeviceMoveDirection = 'up' | 'down' | 'left' | 'right'

export interface DeviceChildrenProps {
  children: ReactNode
}
