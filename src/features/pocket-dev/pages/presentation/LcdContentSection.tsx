import type { ReactNode } from 'react'

interface LcdContentSectionProps {
  children: ReactNode
  headingId: string
  title: string
}

export function LcdContentSection({ children, headingId, title }: LcdContentSectionProps) {
  return (
    <section className="work-section" aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      {children}
    </section>
  )
}
