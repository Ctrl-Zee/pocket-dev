import { createFileRoute } from '@tanstack/react-router'
import { ProjectsPage } from '@/features/pocket-dev/HomePage'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})
