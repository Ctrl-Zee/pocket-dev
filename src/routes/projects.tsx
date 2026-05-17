import { createFileRoute } from '@tanstack/react-router'
import { ProjectsPage } from '@/features/pocket-dev/pages/ProjectsPage'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})
