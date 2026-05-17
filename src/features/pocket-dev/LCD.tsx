import { clsx } from 'clsx'
import type { ChildrenProps } from './types'

interface LcdPageProps extends ChildrenProps {
  title: string
}

interface LcdSectionProps extends ChildrenProps {
  ariaLabel?: string
  as?: 'article' | 'section'
  className?: string
}

export function DeviceScreen({ children }: ChildrenProps) {
  return (
    <section className="lcd-bezel" aria-label="Device display bezel">
      <span className="power-led" aria-label="Power LED" />
      <div className="lcd-screen" role="region" aria-label="LCD screen">
        {children}
      </div>
    </section>
  )
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
  ariaLabel,
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
