import './pocket-dev.css'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { resumeContent, type ProjectEntry } from '@/features/resume-content/resumeContent'

const homeMenuItems = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
] as const

const deviceWordmarkSegments = ['P', 'O', 'C', 'K', 'E', 'T DEV'] as const
const speakerSlotCount = 5
const firstHomeMenuIndex = 0
const lastHomeMenuIndex = homeMenuItems.length - 1
type SelectionDelta = -1 | 1
const firstContactTargetIndex = 0
const lastContactTargetIndex = resumeContent.contactTargets.length - 1
const workExperienceHighlightLimit = 3
const workSoftCompetencyLimit = 4
const resumePdfHref = '/assets/Andrew_Smith_Resume.pdf'
const mobileLandscapeQuery = '(max-width: 900px) and (orientation: landscape)'
const resumePreviewSkillRows = [
  resumeContent.skills.slice(0, 3).map((skill) => skill.name),
  resumeContent.skills.slice(3, 6).map((skill) => skill.name),
] as const

const dpadButtons = [
  { label: 'Up', className: 'dpad-button-up', delta: -1 },
  { label: 'Down', className: 'dpad-button-down', delta: 1 },
  { label: 'Left', className: 'dpad-button-left', delta: -1 },
  { label: 'Right', className: 'dpad-button-right', delta: 1 },
] as const

function getWrappedSelectionIndex(
  currentIndex: number,
  delta: SelectionDelta,
  firstIndex: number,
  lastIndex: number,
) {
  if (currentIndex === firstIndex && delta < 0) return lastIndex
  if (currentIndex === lastIndex && delta > 0) return firstIndex
  return currentIndex + delta
}

function opensContactTargetInCurrentTab(href: string) {
  return href.startsWith('mailto:') || href.startsWith('tel:')
}

function getContactTargetWindowTarget(href: string) {
  return opensContactTargetInCurrentTab(href) ? '_self' : '_blank'
}

interface ChildrenProps {
  children: ReactNode
}

interface LcdPageProps extends ChildrenProps {
  title: string
}

interface DeviceNavigationValue {
  selectedHomeIndex: number
  selectedContactIndex: number
  setSelectedContactIndex: (index: number) => void
  setSelectedHomeIndex: (index: number) => void
}

const DeviceNavigationContext = createContext<DeviceNavigationValue | null>(null)

interface WorkSectionProps extends ChildrenProps {
  headingId: string
  title: string
}

interface ProjectCardProps {
  project: ProjectEntry
}

export function PocketDevDevice({ children }: ChildrenProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedHomeIndex, setSelectedHomeIndex] = useState(firstHomeMenuIndex)
  const shouldShowRotatePrompt = useMobileLandscape()
  const [selectedContactIndex, setSelectedContactIndex] = useState(firstContactTargetIndex)

  const isHomeRoute = location.pathname === '/'
  const isContactRoute = location.pathname === '/contact'

  const moveSelection = useCallback(
    (delta: SelectionDelta) => {
      if (isHomeRoute) {
        setSelectedHomeIndex((currentIndex) =>
          getWrappedSelectionIndex(currentIndex, delta, firstHomeMenuIndex, lastHomeMenuIndex),
        )
        return
      }

      if (isContactRoute) {
        setSelectedContactIndex((currentIndex) =>
          getWrappedSelectionIndex(
            currentIndex,
            delta,
            firstContactTargetIndex,
            lastContactTargetIndex,
          ),
        )
      }
    },
    [isContactRoute, isHomeRoute],
  )

  const activateSelection = useCallback(() => {
    if (isHomeRoute) {
      void navigate({ to: homeMenuItems[selectedHomeIndex].href })
      return
    }

    if (isContactRoute) {
      const contactTarget = resumeContent.contactTargets[selectedContactIndex]

      window.open(contactTarget.href, getContactTargetWindowTarget(contactTarget.href), 'noreferrer')
    }
  }, [isContactRoute, isHomeRoute, navigate, selectedContactIndex, selectedHomeIndex])

  const returnHome = useCallback(() => {
    void navigate({ to: '/' })
  }, [navigate])

  useEffect(() => {
    function handleKeyboardControls(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return

      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault()
          moveSelection(-1)
          return
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault()
          moveSelection(1)
          return
        case 'Enter':
        case ' ':
          event.preventDefault()
          activateSelection()
          return
        case 'Escape':
        case 'Backspace':
          event.preventDefault()
          returnHome()
      }
    }

    window.addEventListener('keydown', handleKeyboardControls)

    return () => {
      window.removeEventListener('keydown', handleKeyboardControls)
    }
  }, [activateSelection, moveSelection, returnHome])

  const deviceNavigation = useMemo(
    () => ({
      selectedContactIndex,
      selectedHomeIndex,
      setSelectedContactIndex,
      setSelectedHomeIndex,
    }),
    [selectedContactIndex, selectedHomeIndex],
  )

  return (
    <div className="pocket-dev-stage">
      <DeviceNavigationContext.Provider value={deviceNavigation}>
        <main className="pocket-dev-device" aria-label="Pocket Dev Device">
          <div className="device-surface">
            <DeviceScreen>{shouldShowRotatePrompt ? <RotatePage /> : children}</DeviceScreen>
            <DeviceBrandRow />
            <DeviceControls
              onActivate={activateSelection}
              onMove={moveSelection}
              onReturnHome={returnHome}
            />
            <DeviceSystemControls />
          </div>
        </main>
      </DeviceNavigationContext.Provider>

      <p className="control-hint">ARROWS MOVE / ENTER A / ESC B</p>
    </div>
  )
}

export function HomePage() {
  const { selectedHomeIndex, setSelectedHomeIndex } = useDeviceNavigation()

  return (
    <LcdPage title="Home">
      <div className="home-screen">
        <div>
          <p className="home-wordmark">POCKET DEV</p>
          <p className="home-version">ANDREW SMITH / SOFTWARE ENGINEER</p>
        </div>

        <nav className="home-menu" aria-label="Home menu">
          {homeMenuItems.map((item, itemIndex) => {
            const isSelected = itemIndex === selectedHomeIndex

            return (
              <Link
                className={isSelected ? 'is-selected' : undefined}
                data-selected={isSelected ? 'true' : undefined}
                key={item.href}
                onFocus={() => setSelectedHomeIndex(itemIndex)}
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
        <section className="resume-preview" aria-label="Compact resume preview">
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
        </section>

        <a className="resume-open-pdf" href={resumePdfHref} target="_blank" rel="noreferrer">
          OPEN PDF
        </a>
      </div>
    </LcdPage>
  )
}

export function ContactPage() {
  const { selectedContactIndex, setSelectedContactIndex } = useDeviceNavigation()

  return (
    <LcdPage title="Contact">
      <div className="lcd-page contact-page">
        <p className="lcd-intro">Direct links for reaching Andrew.</p>

        <nav className="contact-list" aria-label="Contact links">
          {resumeContent.contactTargets.map((contactTarget, contactTargetIndex) => {
            const isSelected = contactTargetIndex === selectedContactIndex
            const opensInCurrentTab = opensContactTargetInCurrentTab(contactTarget.href)

            return (
              <a
                className={isSelected ? 'is-selected' : undefined}
                data-selected={isSelected ? 'true' : undefined}
                href={contactTarget.href}
                key={contactTarget.label}
                onFocus={() => setSelectedContactIndex(contactTargetIndex)}
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

function RotatePage() {
  return (
    <LcdPage title="Rotate">
      <div className="rotate-page">
        <p className="rotate-icon" aria-hidden="true">
          ↻
        </p>
        <p>Please rotate your device.</p>
        <p>Portrait mode keeps the Pocket Dev controls usable.</p>
      </div>
    </LcdPage>
  )
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

interface DeviceControlsProps {
  onActivate: () => void
  onMove: (delta: SelectionDelta) => void
  onReturnHome: () => void
}

function DeviceControls({ onActivate, onMove, onReturnHome }: DeviceControlsProps) {
  return (
    <section className="controls-row" aria-label="Device controls">
      <div className="dpad" aria-label="D-pad">
        {dpadButtons.map((button) => (
          <button
            aria-label={button.label}
            className={`dpad-button ${button.className}`}
            key={button.label}
            type="button"
            onClick={() => onMove(button.delta)}
          />
        ))}
      </div>
      <div className="face-buttons" aria-label="A and B buttons">
        <button className="button-b" type="button" onClick={onReturnHome}>
          B
        </button>
        <button className="button-a" type="button" onClick={onActivate}>
          A
        </button>
      </div>
    </section>
  )
}

function useDeviceNavigation() {
  const deviceNavigation = useContext(DeviceNavigationContext)

  if (!deviceNavigation) {
    throw new Error('Home Page must render inside the Pocket Dev Device')
  }

  return deviceNavigation
}

function useMobileLandscape() {
  const [isMobileLandscape, setIsMobileLandscape] = useState(() => getMobileLandscapeMatch())

  useEffect(() => {
    if (!window.matchMedia) return

    const mediaQuery = window.matchMedia(mobileLandscapeQuery)
    if (!mediaQuery) return

    const handleChange = () => setIsMobileLandscape(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isMobileLandscape
}

function getMobileLandscapeMatch() {
  if (typeof window === 'undefined' || !window.matchMedia) return false

  return Boolean(window.matchMedia(mobileLandscapeQuery)?.matches)
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
