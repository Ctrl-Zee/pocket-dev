import './pocket-dev.css'

const homeMenuItems = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
] as const

const deviceWordmarkSegments = ['P', 'O', 'C', 'K', 'E', 'T DEV'] as const
const speakerSlotCount = 5

export function HomePage() {
  return (
    <div className="pocket-dev-stage">
      <main className="pocket-dev-device" aria-label="Pocket Dev Device">
        <div className="device-surface">
          <DeviceScreen />
          <DeviceBrandRow />
          <DeviceControls />
          <DeviceSystemControls />
        </div>
      </main>

      <p className="control-hint">ARROWS MOVE / ENTER A / ESC B</p>
    </div>
  )
}

function DeviceScreen() {
  return (
    <section className="lcd-bezel" aria-label="Device display bezel">
      <span className="power-led" aria-label="Power LED" />
      <div className="lcd-screen" role="region" aria-label="LCD screen">
        <div className="lcd-content">
          <h1 className="lcd-title">&gt; HOME</h1>

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

          <p className="lcd-footer">D-PAD MOVE / A SELECT / B HOME</p>
        </div>
      </div>
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
