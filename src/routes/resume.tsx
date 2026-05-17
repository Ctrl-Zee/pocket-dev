import { createFileRoute } from '@tanstack/react-router'
import { ResumePage } from '@/features/pocket-dev/Pages'

export const Route = createFileRoute('/resume')({
  component: ResumePage,
})
