const systemButtons = ['Select', 'Start'] as const

interface SystemButtonProps {
  label: (typeof systemButtons)[number]
}

export function SystemButtons() {
  return (
    <div className="system-buttons" aria-label="Select and Start buttons">
      {systemButtons.map((label) => (
        <SystemButton key={label} label={label} />
      ))}
    </div>
  )
}

export function SystemButton({ label }: SystemButtonProps) {
  return <span className="system-button" aria-label={label} />
}
