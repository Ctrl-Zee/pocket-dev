interface FaceButtonsProps {
  onActivate: () => void
  onReturnHome: () => void
}

interface FaceButtonProps {
  button: 'A' | 'B'
  className: string
  onPress: () => void
}

export function FaceButtons({ onActivate, onReturnHome }: FaceButtonsProps) {
  return (
    <div className="face-buttons" aria-label="A and B buttons">
      <FaceButton button="B" className="button-b" onPress={onReturnHome} />
      <FaceButton button="A" className="button-a" onPress={onActivate} />
    </div>
  )
}

export function FaceButton({ button, className, onPress }: FaceButtonProps) {
  return (
    <button className={className} type="button" onClick={onPress}>
      {button}
    </button>
  )
}
