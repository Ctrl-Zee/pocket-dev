import type { ReactNode } from 'react'

interface LcdLabeledBlockProps {
  children: ReactNode
  label: string
}

export function LcdLabeledBlock({ children, label }: LcdLabeledBlockProps) {
  return (
    <div className="resume-preview-section">
      <p className="resume-preview-label">{label}</p>
      {children}
    </div>
  )
}
