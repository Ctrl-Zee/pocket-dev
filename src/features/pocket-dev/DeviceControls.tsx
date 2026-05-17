import type { SelectionDelta } from './types'

const dpadButtons = [
  { label: 'Up', className: 'dpad-button-up', delta: -1 },
  { label: 'Down', className: 'dpad-button-down', delta: 1 },
  { label: 'Left', className: 'dpad-button-left', delta: -1 },
  { label: 'Right', className: 'dpad-button-right', delta: 1 },
] as const

const deviceWordmarkSegments = ['P', 'O', 'C', 'K', 'E', 'T DEV'] as const
const speakerSlotCount = 5

interface DeviceControlsProps {
  onActivate: () => void
  onMove: (delta: SelectionDelta) => void
  onReturnHome: () => void
}

export function DeviceBrandRow() {
  return (
    <section className="device-brand-row" aria-label="Device hardware top controls">
      <p className="wordmark" aria-label="Pocket Dev wordmark">
        {deviceWordmarkSegments.map((segment) => (
          <span key={segment}>{segment}</span>
        ))}
      </p>
    </section>
  )
}

export function DeviceControls({ onActivate, onMove, onReturnHome }: DeviceControlsProps) {
  return (
    <section className="controls-row" aria-label="Device controls">
      <div className="dpad" aria-label="D-pad">
        {dpadButtons.map((button) => (
          <button
            aria-label={button.label}
            className={`dpad-button ${button.className}`}
            key={button.label}
            type="button"
            onClick={() => onMove(button.delta)}
          />
        ))}
      </div>
      <div className="face-buttons" aria-label="A and B buttons">
        <button className="button-b" type="button" onClick={onReturnHome}>
          B
        </button>
        <button className="button-a" type="button" onClick={onActivate}>
          A
        </button>
      </div>
    </section>
  )
}

export function DeviceSystemControls() {
  return (
    <section className="system-row" aria-label="Device system controls">
      <div className="system-buttons" aria-label="Select and Start buttons">
        <span className="system-button" aria-label="Select" />
        <span className="system-button" aria-label="Start" />
      </div>
      <div className="speaker-grill" aria-label="Speaker grill">
        {Array.from({ length: speakerSlotCount }, (_, slotIndex) => (
          <span key={slotIndex} />
        ))}
      </div>
    </section>
  )
}
