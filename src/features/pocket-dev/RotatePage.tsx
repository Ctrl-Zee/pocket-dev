import { LcdPage } from '@/components/lcd'

export function RotatePage() {
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
