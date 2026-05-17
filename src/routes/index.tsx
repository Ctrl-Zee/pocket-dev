import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/features/pocket-dev/pages/HomePage'

export const Route = createFileRoute('/')({
  component: HomePage,
})
