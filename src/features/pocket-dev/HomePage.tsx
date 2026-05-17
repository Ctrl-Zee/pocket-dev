import './pocket-dev.css'
import type { ReactNode } from 'react'
import { resumeContent } from '@/features/resume-content/resumeContent'

const homeMenuItems = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
] as const

const deviceWordmarkSegments = ['P', 'O', 'C', 'K', 'E', 'T DEV'] as const
const speakerSlotCount = 5
const workExperienceHighlightLimit = 3
const workSoftCompetencyLimit = 4

const placeholderPageContent = {
  About:
    'Andrew Smith is a Software Engineer. Placeholder About Page content will introduce the person inside this LCD.',
  Projects:
    'Selected projects placeholder for Projects Page. This LCD Page will list factual project cards.',
  Resume: 'Formal resume placeholder for Resume Page. This LCD Page will link to the PDF artifact.',
  Contact:
    'Contact links placeholder for Contact Page. This LCD Page will expose email and profile links.',
} as const

type PlaceholderPageTitle = keyof typeof placeholderPageContent

interface ChildrenProps {
  children: ReactNode
}

interface LcdPageProps extends ChildrenProps {
  title: string
}

interface PlaceholderPageProps {
  title: PlaceholderPageTitle
}

interface WorkSectionProps extends ChildrenProps {
  headingId: string
  title: string
}

export function PocketDevDevice({ children }: ChildrenProps) {
  return (
    <div className="pocket-dev-stage">
      <main className="pocket-dev-device" aria-label="Pocket Dev Device">
        <div className="device-surface">
          <DeviceScreen>{children}</DeviceScreen>
          <DeviceBrandRow />
          <DeviceControls />
          <DeviceSystemControls />
        </div>
      </main>

      <p className="control-hint">ARROWS MOVE / ENTER A / ESC B</p>
    </div>
  )
}

export function HomePage() {
  return (
    <LcdPage title="Home">
      <div className="home-screen">
        <div>
          <p className="home-wordmark">POCKET DEV</p>
          <p className="home-version">ANDREW SMITH / SOFTWARE ENGINEER</p>
        </div>

        <nav className="home-menu" aria-label="Home menu">
          {homeMenuItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </LcdPage>
  )
}

export function AboutPage() {
  return <PlaceholderPage title="About" />
}

export function WorkPage() {
  return (
    <LcdPage title="Work">
      <WorkDetails />
    </LcdPage>
  )
}

export function ProjectsPage() {
  return <PlaceholderPage title="Projects" />
}

export function ResumePage() {
  return <PlaceholderPage title="Resume" />
}

export function ContactPage() {
  return <PlaceholderPage title="Contact" />
}

function DeviceScreen({ children }: ChildrenProps) {
  return (
    <section className="lcd-bezel" aria-label="Device display bezel">
      <span className="power-led" aria-label="Power LED" />
      <div className="lcd-screen" role="region" aria-label="LCD screen">
        {children}
      </div>
    </section>
  )
}

function LcdPage({ title, children }: LcdPageProps) {
  return (
    <div className="lcd-content">
      <h1 className="lcd-title">&gt; {title.toUpperCase()}</h1>
      {children}
      <p className="lcd-footer">D-PAD MOVE / A SELECT / B HOME</p>
    </div>
  )
}

function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <LcdPage title={title}>
      <div className="lcd-page">
        <p>{placeholderPageContent[title]}</p>
      </div>
    </LcdPage>
  )
}

function WorkDetails() {
  return (
    <div className="lcd-page work-page" role="region" aria-label="Work details">
      <WorkSection headingId="work-experience-heading" title="Experience">
        {resumeContent.experience.map((entry) => (
          <article className="work-entry" key={`${entry.employer}-${entry.role}`}>
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
          </article>
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

function DeviceBrandRow() {
  return (
    <section className="device-brand-row" aria-label="Device hardware top controls">
      <div className="volume-wheel" aria-label="Volume wheel" />
      <p className="wordmark" aria-label="Pocket Dev wordmark">
        {deviceWordmarkSegments.map((segment) => (
          <span key={segment}>{segment}</span>
        ))}
      </p>
    </section>
  )
}

function DeviceControls() {
  return (
    <section className="controls-row" aria-label="Device controls">
      <div className="dpad" aria-label="D-pad" />
      <div className="face-buttons" aria-label="A and B buttons">
        <span className="button-b">B</span>
        <span className="button-a">A</span>
      </div>
    </section>
  )
}

function DeviceSystemControls() {
  return (
    <section className="system-row" aria-label="Device system controls">
      <div className="pills" aria-label="Select and Start buttons">
        <span className="pill" aria-label="Select" />
        <span className="pill" aria-label="Start" />
      </div>
      <div className="speaker-grill" aria-label="Speaker grill">
        {Array.from({ length: speakerSlotCount }, (_, slotIndex) => (
          <span key={slotIndex} />
        ))}
      </div>
    </section>
  )
}
