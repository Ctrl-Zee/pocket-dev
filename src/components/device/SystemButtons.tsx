type SystemButtonLabel = 'Select' | 'Start'

interface SystemButtonProps {
  label: SystemButtonLabel
  isPressed?: boolean
  onPress: () => void
}

interface SystemButtonsProps {
  isMuted: boolean
  onSelect: () => void
  onStart: () => void
}

export function SystemButtons({ isMuted, onSelect, onStart }: SystemButtonsProps) {
  return (
    <div className="system-buttons" aria-label="Select and Start buttons">
      <SystemButton isPressed={isMuted} label="Select" onPress={onSelect} />
      <SystemButton label="Start" onPress={onStart} />
    </div>
  )
}

export function SystemButton({ isPressed, label, onPress }: SystemButtonProps) {
  return (
    <button
      aria-label={label === 'Select' ? `${label} mute sound` : label}
      aria-pressed={isPressed}
      className="system-button"
      type="button"
      onClick={onPress}
    />
  )
}
