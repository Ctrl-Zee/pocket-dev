import type { DeviceMoveDelta } from './types'

const dpadButtons = [
  { label: 'Up', className: 'dpad-button-up', delta: -1 },
  { label: 'Down', className: 'dpad-button-down', delta: 1 },
  { label: 'Left', className: 'dpad-button-left', delta: -1 },
  { label: 'Right', className: 'dpad-button-right', delta: 1 },
] as const

interface DpadProps {
  onMove: (delta: DeviceMoveDelta) => void
}

interface DpadButtonProps {
  className: string
  label: string
  onPress: () => void
}

export function Dpad({ onMove }: DpadProps) {
  return (
    <div className="dpad" aria-label="D-pad">
      {dpadButtons.map((button) => (
        <DpadButton
          className={button.className}
          key={button.label}
          label={button.label}
          onPress={() => onMove(button.delta)}
        />
      ))}
    </div>
  )
}

export function DpadButton({ className, label, onPress }: DpadButtonProps) {
  return (
    <button
      aria-label={label}
      className={`dpad-button ${className}`}
      type="button"
      onClick={onPress}
    />
  )
}
