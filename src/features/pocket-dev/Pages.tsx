import { Link } from '@tanstack/react-router'
import { resumeContent, type ProjectEntry } from '@/content/resume/resumeContent'
import { LcdPage, LcdSection } from './LCD'
import { opensContactTargetInCurrentTab } from './contactTargets'
import { pageCatalog } from './pageCatalog'
import { useDeviceNavigation } from './Device'
import type { ChildrenProps } from './types'

const workExperienceHighlightLimit = 3
const workSoftCompetencyLimit = 4
const resumePdfHref = '/assets/Andrew_Smith_Resume.pdf'
const resumePreviewSkillRows = [
  resumeContent.skills.slice(0, 3).map((skill) => skill.name),
  resumeContent.skills.slice(3, 6).map((skill) => skill.name),
] as const

interface WorkSectionProps extends ChildrenProps {
  headingId: string
  title: string
}

interface ProjectCardProps {
  project: ProjectEntry
}

export function HomePage() {
  const { homeSelection } = useDeviceNavigation()

  return (
    <LcdPage title="Home">
      <div className="home-screen">
        <div>
          <p className="home-wordmark">POCKET DEV</p>
          <p className="home-version">ANDREW SMITH / SOFTWARE ENGINEER</p>
        </div>

        <nav className="home-menu" aria-label="Home menu">
          {pageCatalog.map((item, itemIndex) => {
            const isSelected = itemIndex === homeSelection.selectedIndex

            return (
              <Link
                className={isSelected ? 'is-selected' : undefined}
                data-selected={isSelected ? 'true' : undefined}
                key={item.href}
                onFocus={() => homeSelection.setSelectedIndex(itemIndex)}
                to={item.href}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </LcdPage>
  )
}

export function AboutPage() {
  const { identity, activities } = resumeContent

  return (
    <LcdPage title="About">
      <article className="lcd-page about-page">
        <header className="about-hero">
          <h2>
            {identity.name} / {identity.publicTitle}
          </h2>
          <p>{identity.location}</p>
        </header>

        <p>{identity.summary}</p>
        <p>
          Andrew builds practical web applications across front-end, back-end, and delivery work. He
          likes clear interfaces, maintainable code, and teams that can keep improving a product
          after launch.
        </p>

        <section aria-labelledby="about-activities">
          <h3 id="about-activities">After hours</h3>
          <ul className="pixel-list">
            {activities.map((activity) => (
              <li key={activity}>{activity}</li>
            ))}
          </ul>
        </section>
      </article>
    </LcdPage>
  )
}

export function WorkPage() {
  return (
    <LcdPage title="Work">
      <WorkDetails />
    </LcdPage>
  )
}

export function ProjectsPage() {
  return (
    <LcdPage title="Projects">
      <div className="lcd-page projects-page">
        <p className="lcd-intro">Selected projects from Resume Data.</p>

        <div className="project-card-list">
          {resumeContent.projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </LcdPage>
  )
}

export function ResumePage() {
  const { identity, highlights } = resumeContent

  return (
    <LcdPage title="Resume">
      <div className="resume-page">
        <LcdSection className="resume-preview" aria-label="Compact resume preview">
          <div className="resume-preview-header">
            <p className="resume-preview-name">{identity.name}</p>
            <p>{identity.publicTitle}</p>
            <p>{identity.location}</p>
          </div>

          <div className="resume-preview-section">
            <p className="resume-preview-label">SUMMARY</p>
            <p>{identity.summary}</p>
          </div>

          <div className="resume-preview-section">
            <p className="resume-preview-label">TOOLS</p>
            {resumePreviewSkillRows.map((skillRow) => (
              <p key={skillRow.join('/')}>{skillRow.join(' / ')}</p>
            ))}
          </div>

          <div className="resume-preview-section">
            <p className="resume-preview-label">SIGNAL</p>
            <p>{highlights[0]}</p>
          </div>
        </LcdSection>

        <a className="resume-open-pdf" href={resumePdfHref} target="_blank" rel="noreferrer">
          OPEN PDF
        </a>
      </div>
    </LcdPage>
  )
}

export function ContactPage() {
  const { contactSelection } = useDeviceNavigation()

  return (
    <LcdPage title="Contact">
      <div className="lcd-page contact-page">
        <p className="lcd-intro">Direct links for reaching Andrew.</p>

        <nav className="contact-list" aria-label="Contact links">
          {resumeContent.contactTargets.map((contactTarget, contactTargetIndex) => {
            const isSelected = contactTargetIndex === contactSelection.selectedIndex
            const opensInCurrentTab = opensContactTargetInCurrentTab(contactTarget.href)

            return (
              <a
                className={isSelected ? 'is-selected' : undefined}
                data-selected={isSelected ? 'true' : undefined}
                href={contactTarget.href}
                key={contactTarget.label}
                onFocus={() => contactSelection.setSelectedIndex(contactTargetIndex)}
                rel={opensInCurrentTab ? undefined : 'noreferrer'}
                target={opensInCurrentTab ? undefined : '_blank'}
              >
                <span>{contactTarget.label}</span>
                <strong>{contactTarget.value}</strong>
              </a>
            )
          })}
        </nav>
      </div>
    </LcdPage>
  )
}

function WorkDetails() {
  return (
    <div className="lcd-page work-page" role="region" aria-label="Work details">
      <WorkSection headingId="work-experience-heading" title="Experience">
        {resumeContent.experience.map((entry) => (
          <LcdSection
            as="article"
            className="work-entry"
            key={`${entry.employer}-${entry.role}`}
          >
            <p className="work-kicker">
              {entry.startYear}-{entry.endYear}
            </p>
            <h3>
              {entry.role} / {entry.employer}
            </h3>
            <p>{entry.summary}</p>
            <ul>
              {entry.highlights.slice(0, workExperienceHighlightLimit).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </LcdSection>
        ))}
      </WorkSection>

      <WorkSection headingId="work-skills-heading" title="Technical Kit">
        <div className="work-skill-list">
          {resumeContent.skills.map((skill) => (
            <p key={skill.name}>
              <strong>{skill.name}</strong>: {skill.summary}
            </p>
          ))}
        </div>
      </WorkSection>

      <WorkSection headingId="work-soft-heading" title="Team Moves">
        <ul>
          {resumeContent.softCompetencies.slice(0, workSoftCompetencyLimit).map((competency) => (
            <li key={competency}>{competency}</li>
          ))}
        </ul>
      </WorkSection>

      <WorkSection headingId="work-education-heading" title="Education">
        {resumeContent.education.map((entry) => (
          <p key={`${entry.school}-${entry.degree}`}>
            {entry.degree} / {entry.school} / {entry.startYear}-{entry.endYear}
          </p>
        ))}
      </WorkSection>
    </div>
  )
}

function WorkSection({ headingId, title, children }: WorkSectionProps) {
  return (
    <section className="work-section" aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      {children}
    </section>
  )
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <h2>{project.name}</h2>
      <p>{project.summary}</p>
      <p className="project-stack">
        <span>Stack:</span> {project.stack.join(' / ')}
      </p>
    </article>
  )
}
