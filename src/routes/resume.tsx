import { createFileRoute } from '@tanstack/react-router'
import { ResumePage } from '@/features/pocket-dev/pages/ResumePage'

export const Route = createFileRoute('/resume')({
  component: ResumePage,
})
