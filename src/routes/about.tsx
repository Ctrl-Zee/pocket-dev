import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '@/features/pocket-dev/HomePage'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})
