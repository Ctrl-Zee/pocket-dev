import type { ReactNode } from 'react'
import { LcdPanel } from '@/components/lcd'

interface LcdEntryPanelProps {
  children?: ReactNode
  className?: string
  kicker?: ReactNode
  summary?: ReactNode
  title: ReactNode
  titleLevel?: 2 | 3
}

export function LcdEntryPanel({
  children,
  className,
  kicker,
  summary,
  title,
  titleLevel = 2,
}: LcdEntryPanelProps) {
  const Heading = titleLevel === 2 ? 'h2' : 'h3'

  return (
    <LcdPanel as="article" className={className}>
      {kicker ? <p className="work-kicker">{kicker}</p> : null}
      <Heading>{title}</Heading>
      {summary ? <p>{summary}</p> : null}
      {children}
    </LcdPanel>
  )
}
