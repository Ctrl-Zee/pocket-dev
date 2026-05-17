import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '@/features/pocket-dev/HomePage'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})
