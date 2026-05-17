import { clsx } from 'clsx'
import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react'

type LcdPanelElement = 'article' | 'div' | 'section'
type LcdScrollableAreaElement = 'article' | 'div' | 'section'
type LcdSelectableListElement = 'div' | 'nav'

interface LcdPageProps extends PropsWithChildren {
  title: string
}

type DeviceScreenProps = PropsWithChildren

interface LcdPanelProps extends PropsWithChildren {
  'aria-label'?: string
  as?: LcdPanelElement
  className?: string
}

interface LcdScrollableAreaProps extends PropsWithChildren {
  'aria-label'?: string
  as?: LcdScrollableAreaElement
  className?: string
  role?: ComponentPropsWithoutRef<'div'>['role']
}

interface LcdSelectableListProps extends PropsWithChildren {
  'aria-label'?: string
  as?: LcdSelectableListElement
  className?: string
}

interface LcdSelectableLinkProps extends ComponentPropsWithoutRef<'a'> {
  as?: ElementType
  isSelected?: boolean
  to?: string
}

type LcdActionLinkProps = ComponentPropsWithoutRef<'a'>
type LcdSelectableButtonProps = ComponentPropsWithoutRef<'button'> & {
  isSelected?: boolean
}

interface LcdPixelListProps {
  className?: string
  items: readonly string[]
}

export function DeviceScreen({ children }: DeviceScreenProps) {
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

export function LcdPanel({
  'aria-label': ariaLabel,
  as: Component = 'section',
  children,
  className,
}: LcdPanelProps) {
  return (
    <Component className={clsx('lcd-section', className)} aria-label={ariaLabel}>
      {children}
    </Component>
  )
}

export function LcdScrollableArea({
  'aria-label': ariaLabel,
  as: Component = 'div',
  children,
  className,
  role,
}: LcdScrollableAreaProps) {
  return (
    <Component
      className={clsx('lcd-page', className)}
      aria-label={ariaLabel}
      role={role ?? (ariaLabel ? 'region' : undefined)}
    >
      {children}
    </Component>
  )
}

export function LcdSelectableList({
  'aria-label': ariaLabel,
  as: Component = 'nav',
  children,
  className,
}: LcdSelectableListProps) {
  return (
    <Component className={clsx('lcd-selectable-list', className)} aria-label={ariaLabel}>
      {children}
    </Component>
  )
}

export function LcdSelectableLink({
  as: Component = 'a',
  children,
  className,
  isSelected = false,
  ...props
}: LcdSelectableLinkProps) {
  const selectedDataValue = isSelected ? 'true' : undefined

  return (
    <Component
      {...props}
      className={clsx('lcd-selectable-link', className, isSelected && 'is-selected')}
      data-selected={selectedDataValue}
    >
      {children}
    </Component>
  )
}

export function LcdSelectableButton({
  children,
  className,
  isSelected = false,
  type = 'button',
  ...props
}: LcdSelectableButtonProps) {
  const selectedDataValue = isSelected ? 'true' : undefined

  return (
    <button
      {...props}
      className={clsx('lcd-selectable-link', className, isSelected && 'is-selected')}
      data-selected={selectedDataValue}
      type={type}
    >
      {children}
    </button>
  )
}

export function LcdActionLink({ children, className, ...props }: LcdActionLinkProps) {
  return (
    <a className={clsx('lcd-action-link', className)} {...props}>
      {children}
    </a>
  )
}

export function LcdPixelList({ className, items }: LcdPixelListProps) {
  return (
    <ul className={clsx('pixel-list', className)}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
