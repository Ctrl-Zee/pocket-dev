import { clsx } from 'clsx'
import type { ChildrenProps } from './types'

interface LcdPageProps extends ChildrenProps {
  title: string
}

type LcdSectionElement = 'article' | 'section'

interface LcdSectionProps extends ChildrenProps {
  'aria-label'?: string
  as?: LcdSectionElement
  className?: string
}

export function LcdPage({ title, children }: LcdPageProps) {
  return (
    <div className="lcd-content">
      <h1 className="lcd-title">&gt; {title.toUpperCase()}</h1>
      {children}
    </div>
  )
}

export function LcdSection({
  'aria-label': ariaLabel,
  as: Component = 'section',
  children,
  className,
}: LcdSectionProps) {
  return (
    <Component className={clsx('lcd-section', className)} aria-label={ariaLabel}>
      {children}
    </Component>
  )
}
