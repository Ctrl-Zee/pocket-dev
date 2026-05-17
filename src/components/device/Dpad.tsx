import type { DeviceMoveDelta, DeviceMoveDirection } from './types'

const dpadButtons = [
  { label: 'Up', className: 'dpad-button-up', delta: -1, direction: 'up' },
  { label: 'Down', className: 'dpad-button-down', delta: 1, direction: 'down' },
  { label: 'Left', className: 'dpad-button-left', delta: -1, direction: 'left' },
  { label: 'Right', className: 'dpad-button-right', delta: 1, direction: 'right' },
] as const

interface DpadProps {
  onMove: (delta: DeviceMoveDelta, direction: DeviceMoveDirection) => void
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
          onPress={() => onMove(button.delta, button.direction)}
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
