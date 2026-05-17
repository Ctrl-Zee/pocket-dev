import type { DeviceChildrenProps } from './types'

export function DeviceShell({ children }: DeviceChildrenProps) {
  return <div className="device-surface" aria-label="Device shell">{children}</div>
}
