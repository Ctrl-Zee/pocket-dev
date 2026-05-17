import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '@/features/pocket-dev/Pages'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})
