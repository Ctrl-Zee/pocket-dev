const speakerSlotCount = 5

export function SpeakerGrill() {
  return (
    <div className="speaker-grill" aria-label="Speaker grill">
      {Array.from({ length: speakerSlotCount }, (_, slotIndex) => (
        <span key={slotIndex} />
      ))}
    </div>
  )
}
