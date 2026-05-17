import type { ComponentPropsWithoutRef } from 'react'
import { LcdSelectableLink } from '@/components/lcd'

type LcdActionRowLinkProps = Omit<
  ComponentPropsWithoutRef<typeof LcdSelectableLink>,
  'children' | 'isSelected'
> & {
  isSelected: boolean
  label: string
  value: string
}

export function LcdActionRowLink({
  isSelected,
  label,
  value,
  ...linkProps
}: LcdActionRowLinkProps) {
  return (
    <LcdSelectableLink isSelected={isSelected} {...linkProps}>
      <span>{label}</span>
      <strong>{value}</strong>
    </LcdSelectableLink>
  )
}
