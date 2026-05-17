import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '@/features/pocket-dev/pages/AboutPage'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})
