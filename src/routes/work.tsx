import { createFileRoute } from '@tanstack/react-router'
import { WorkPage } from '@/features/pocket-dev/pages/WorkPage'

export const Route = createFileRoute('/work')({
  component: WorkPage,
})
