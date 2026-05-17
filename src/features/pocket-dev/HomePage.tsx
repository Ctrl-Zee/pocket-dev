import './pocket-dev.css'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

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

const dpadButtons = [
  { label: 'Up', className: 'dpad-button-up', delta: -1 },
  { label: 'Down', className: 'dpad-button-down', delta: 1 },
  { label: 'Left', className: 'dpad-button-left', delta: -1 },
  { label: 'Right', className: 'dpad-button-right', delta: 1 },
] as const

const placeholderPageContent = {
  About:
    'Andrew Smith is a Software Engineer. Placeholder About Page content will introduce the person inside this LCD.',
  Work: 'Experience placeholder for Work Page. This LCD Page will summarize roles, skills, and professional history.',
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

export function PocketDevDevice({ children }: ChildrenProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedHomeIndex, setSelectedHomeIndex] = useState(firstHomeMenuIndex)

  const isHomeRoute = location.pathname === '/'

  const moveHomeSelection = useCallback((delta: HomeSelectionDelta) => {
    if (!isHomeRoute) return

    setSelectedHomeIndex((currentIndex) => {
      if (currentIndex === firstHomeMenuIndex && delta < 0) return lastHomeMenuIndex
      if (currentIndex === lastHomeMenuIndex && delta > 0) return firstHomeMenuIndex
      return currentIndex + delta
    })
  }, [isHomeRoute])

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
  return <PlaceholderPage title="About" />
}

export function WorkPage() {
  return <PlaceholderPage title="Work" />
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

function DeviceControls({
  onActivate,
  onMove,
  onReturnHome,
}: DeviceControlsProps) {
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
