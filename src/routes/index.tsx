import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/features/pocket-dev/Pages'

export const Route = createFileRoute('/')({
  component: HomePage,
})
