import { LcdPage } from '@/components/lcd'
import type { DeviceMoveDirection } from '@/components/device/types'

export type SnakeShellStatus = 'ready' | 'running' | 'paused'

interface SecretSnakePageProps {
  direction: DeviceMoveDirection
  status: SnakeShellStatus
}

export function SecretSnakePage({ direction, status }: SecretSnakePageProps) {
  return (
    <LcdPage title="Snake">
      <div className="snake-game-page" aria-label="SNAKE game">
        <div className="snake-game-grid" aria-hidden="true">
          <span className="snake-game-segment snake-game-head" />
          <span className="snake-game-segment" />
          <span className="snake-game-segment" />
          <span className="snake-game-food" />
        </div>
        <div className="snake-game-status" aria-label="SNAKE shell status">
          <p>State {status.toUpperCase()}</p>
          <p>Dir {direction.toUpperCase()}</p>
          <p>Score 000</p>
        </div>
      </div>
    </LcdPage>
  )
}
