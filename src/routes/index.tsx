import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/features/pocket-dev/HomePage'

export const Route = createFileRoute('/')({
  component: HomePage,
})
