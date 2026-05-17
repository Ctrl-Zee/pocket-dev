import { createFileRoute } from '@tanstack/react-router'
import { WorkPage } from '@/features/pocket-dev/Pages'

export const Route = createFileRoute('/work')({
  component: WorkPage,
})
