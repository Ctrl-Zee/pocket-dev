import { LcdPage, LcdPanel, LcdScrollableArea } from '@/components/lcd'
import { resumeContent, type ProjectEntry } from '@/content/resume/resumeContent'

interface ProjectCardProps {
  project: ProjectEntry
}

export function ProjectsPage() {
  return (
    <LcdPage title="Projects">
      <LcdScrollableArea className="projects-page">
        <p className="lcd-intro">Selected projects from Resume Data.</p>

        <div className="project-card-list">
          {resumeContent.projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </LcdScrollableArea>
    </LcdPage>
  )
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <LcdPanel as="article" className="project-card">
      <h2>{project.name}</h2>
      <p>{project.summary}</p>
      <p className="project-stack">
        <span>Stack:</span> {project.stack.join(' / ')}
      </p>
    </LcdPanel>
  )
}
