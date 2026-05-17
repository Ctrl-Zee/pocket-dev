import type { DeviceChildrenProps } from './types'
import { PowerLed } from './PowerLed'

export function DeviceScreen({ children }: DeviceChildrenProps) {
  return (
    <section className="lcd-bezel" aria-label="Device display bezel">
      <PowerLed />
      <div className="lcd-screen" role="region" aria-label="LCD screen">
        {children}
      </div>
    </section>
  )
}
