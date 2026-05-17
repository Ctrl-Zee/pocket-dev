import { LcdPage } from '@/components/lcd'

export function SecretSnakePage() {
  return (
    <LcdPage title="Snake">
      <div className="snake-game-page" aria-label="SNAKE game">
        <div className="snake-game-grid" aria-hidden="true">
          <span className="snake-game-segment snake-game-head" />
          <span className="snake-game-segment" />
          <span className="snake-game-segment" />
          <span className="snake-game-food" />
        </div>
        <p>Score 000</p>
      </div>
    </LcdPage>
  )
}
