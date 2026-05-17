const deviceWordmarkLetters = ['P', 'O', 'C', 'K', 'E', 'T', 'D', 'E', 'V'] as const

export function DeviceWordmark() {
  return (
    <section className="device-brand-row" aria-label="Device hardware top controls">
      <p className="wordmark" aria-label="Pocket Dev wordmark">
        {deviceWordmarkLetters.map((letter, index) => (
          <span key={`${letter}-${index}`}>{letter}</span>
        ))}
      </p>
    </section>
  )
}
