interface SystemButtonProps {
  ariaLabel: string
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
      <SystemButton
        ariaLabel="Select mute sound"
        isPressed={isMuted}
        onPress={onSelect}
      />
      <SystemButton ariaLabel="Start" onPress={onStart} />
    </div>
  )
}

export function SystemButton({ ariaLabel, isPressed, onPress }: SystemButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={isPressed}
      className="system-button"
      type="button"
      onClick={onPress}
    />
  )
}
