import type { ComponentPropsWithoutRef } from 'react'
import { LcdSelectableLink } from '@/components/lcd'

interface LcdActionRowLinkProps extends ComponentPropsWithoutRef<'a'> {
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
