import { DeviceScreen } from './DeviceScreen'
import { DeviceShell } from './DeviceShell'
import { DeviceWordmark } from './DeviceWordmark'
import { Dpad } from './Dpad'
import { FaceButtons } from './FaceButtons'
import { SpeakerGrill } from './SpeakerGrill'
import { SystemButtons } from './SystemButtons'
import type { DeviceChildrenProps, DeviceMoveDelta } from './types'

interface PocketDevDeviceProps extends DeviceChildrenProps {
  onActivate: () => void
  onMove: (delta: DeviceMoveDelta) => void
  onReturnHome: () => void
}

export function PocketDevDevice({
  children,
  onActivate,
  onMove,
  onReturnHome,
}: PocketDevDeviceProps) {
  return (
    <main className="pocket-dev-device" aria-label="Pocket Dev Device">
      <DeviceShell>
        <DeviceScreen>{children}</DeviceScreen>
        <DeviceWordmark />
        <section className="controls-row" aria-label="Device controls">
          <Dpad onMove={onMove} />
          <FaceButtons onActivate={onActivate} onReturnHome={onReturnHome} />
        </section>
        <section className="system-row" aria-label="Device system controls">
          <SystemButtons />
          <SpeakerGrill />
        </section>
      </DeviceShell>
    </main>
  )
}
