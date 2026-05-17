import { createFileRoute } from '@tanstack/react-router'
import { WorkPage } from '@/features/pocket-dev/HomePage'

export const Route = createFileRoute('/work')({
  component: WorkPage,
})
