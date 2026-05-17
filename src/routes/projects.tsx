import { createFileRoute } from '@tanstack/react-router'
import { ProjectsPage } from '@/features/pocket-dev/Pages'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})
