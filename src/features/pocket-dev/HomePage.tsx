import './pocket-dev.css'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
const firstHomeMenuIndex = 0
const lastHomeMenuIndex = homeMenuItems.length - 1
type HomeSelectionDelta = -1 | 1
const workExperienceHighlightLimit = 3
const workSoftCompetencyLimit = 4

const dpadButtons = [
  { label: 'Up', className: 'dpad-button-up', delta: -1 },
  { label: 'Down', className: 'dpad-button-down', delta: 1 },
  { label: 'Left', className: 'dpad-button-left', delta: -1 },
  { label: 'Right', className: 'dpad-button-right', delta: 1 },
] as const

const placeholderPageContent = {
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

interface DeviceNavigationValue {
  selectedHomeIndex: number
  setSelectedHomeIndex: (index: number) => void
}

const DeviceNavigationContext = createContext<DeviceNavigationValue | null>(null)

interface WorkSectionProps extends ChildrenProps {
  headingId: string
  title: string
}

export function PocketDevDevice({ children }: ChildrenProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedHomeIndex, setSelectedHomeIndex] = useState(firstHomeMenuIndex)

  const isHomeRoute = location.pathname === '/'

  const moveHomeSelection = useCallback(
    (delta: HomeSelectionDelta) => {
      if (!isHomeRoute) return

      setSelectedHomeIndex((currentIndex) => {
        if (currentIndex === firstHomeMenuIndex && delta < 0) return lastHomeMenuIndex
        if (currentIndex === lastHomeMenuIndex && delta > 0) return firstHomeMenuIndex
        return currentIndex + delta
      })
    },
    [isHomeRoute],
  )

  const activateHomeSelection = useCallback(() => {
    if (!isHomeRoute) return

    void navigate({ to: homeMenuItems[selectedHomeIndex].href })
  }, [isHomeRoute, navigate, selectedHomeIndex])

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
          moveHomeSelection(-1)
          return
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault()
          moveHomeSelection(1)
          return
        case 'Enter':
        case ' ':
          event.preventDefault()
          activateHomeSelection()
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
  }, [activateHomeSelection, moveHomeSelection, returnHome])

  const deviceNavigation = useMemo(
    () => ({ selectedHomeIndex, setSelectedHomeIndex }),
    [selectedHomeIndex],
  )

  return (
    <div className="pocket-dev-stage">
      <DeviceNavigationContext.Provider value={deviceNavigation}>
        <main className="pocket-dev-device" aria-label="Pocket Dev Device">
          <div className="device-surface">
            <DeviceScreen>{children}</DeviceScreen>
            <DeviceBrandRow />
            <DeviceControls
              onActivate={activateHomeSelection}
              onMove={moveHomeSelection}
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

interface DeviceControlsProps {
  onActivate: () => void
  onMove: (delta: HomeSelectionDelta) => void
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
