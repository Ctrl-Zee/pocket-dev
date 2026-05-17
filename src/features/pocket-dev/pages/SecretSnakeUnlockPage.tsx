import { LcdPage } from '@/components/lcd'

export function SecretSnakeUnlockPage() {
  return (
    <LcdPage title="Snake unlocked">
      <div className="snake-unlock-page" aria-label="SNAKE unlock payoff">
        <div className="snake-unlock-grid" aria-hidden="true">
          <span className="snake-segment snake-segment-head" />
          <span className="snake-segment" />
          <span className="snake-segment" />
          <span className="snake-food" />
        </div>
        <p>SNAKE is ready.</p>
      </div>
    </LcdPage>
  )
}
