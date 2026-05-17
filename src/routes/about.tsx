import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '@/features/pocket-dev/Pages'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})
