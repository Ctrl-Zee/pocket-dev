import { createFileRoute } from '@tanstack/react-router'
import { ResumePage } from '@/features/pocket-dev/HomePage'

export const Route = createFileRoute('/resume')({
  component: ResumePage,
})
