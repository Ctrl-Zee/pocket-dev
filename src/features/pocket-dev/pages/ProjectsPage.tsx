import { LcdPage, LcdScrollableArea } from '@/components/lcd'
import { resumeContent } from '@/content/resume/resumeContent'
import { LcdEntryPanel } from './presentation'

export function ProjectsPage() {
  return (
    <LcdPage title="Projects">
      <LcdScrollableArea className="projects-page">
        <p className="lcd-intro">Selected projects from Resume Data.</p>

        <div className="project-card-list">
          {resumeContent.projects.map((project) => (
            <LcdEntryPanel
              className="project-card"
              key={project.name}
              summary={project.summary}
              title={project.name}
            >
              <p className="project-stack">
                <span>Stack:</span> {project.stack.join(' / ')}
              </p>
            </LcdEntryPanel>
          ))}
        </div>
      </LcdScrollableArea>
    </LcdPage>
  )
}
