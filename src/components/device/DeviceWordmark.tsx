const deviceWordmarkSegments = ['P', 'O', 'C', 'K', 'E', 'T DEV'] as const

export function DeviceWordmark() {
  return (
    <section className="device-brand-row" aria-label="Device hardware top controls">
      <p className="wordmark" aria-label="Pocket Dev wordmark">
        {deviceWordmarkSegments.map((segment) => (
          <span key={segment}>{segment}</span>
        ))}
      </p>
    </section>
  )
}
