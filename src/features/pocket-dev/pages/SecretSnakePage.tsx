import { useRef, type TouchEvent } from 'react'
import { clsx } from 'clsx'
import { LcdPage } from '@/components/lcd'
import {
  getSnakeCellKey,
  isSameSnakeCell,
  snakeBoardCells,
  type SnakeCell,
  type SnakeDirection,
  type SnakeGameState,
} from '../snake/snakeGame'

interface SecretSnakePageProps {
  game: SnakeGameState
  onSwipeDirection: (direction: SnakeDirection) => void
}

interface SnakeSwipePoint {
  x: number
  y: number
}

interface SnakeTouchPoint {
  clientX: number
  clientY: number
}

const snakeStatusLabels: Record<SnakeGameState['status'], string> = {
  start: 'START',
  running: 'RUNNING',
  'game-over': 'GAME OVER',
}
const snakeSwipeMinDistance = 24

export function SecretSnakePage({ game, onSwipeDirection }: SecretSnakePageProps) {
  const swipeStartPointRef = useRef<SnakeSwipePoint | null>(null)

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    swipeStartPointRef.current = getTouchPoint(event.touches[0])
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startPoint = swipeStartPointRef.current
    const endPoint = getTouchPoint(event.changedTouches[0])

    swipeStartPointRef.current = null

    if (!startPoint || !endPoint) return

    const swipeDirection = getSnakeSwipeDirection(startPoint, endPoint)

    if (swipeDirection) onSwipeDirection(swipeDirection)
  }

  function handleTouchCancel() {
    swipeStartPointRef.current = null
  }

  return (
    <LcdPage title="Snake">
      <div
        className="snake-game-page"
        aria-label="SNAKE game"
        onTouchCancel={handleTouchCancel}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        <div
          aria-colcount={game.board.columns}
          aria-label="SNAKE board"
          aria-rowcount={game.board.rows}
          className="snake-game-grid"
          role="grid"
        >
          {snakeBoardCells.map((cell) => {
            const snakeSegmentIndex = game.snake.findIndex((segment) =>
              isSameSnakeCell(segment, cell),
            )
            const isSnakeSegment = snakeSegmentIndex >= 0
            const isSnakeHead = snakeSegmentIndex === 0
            const isFood = isSameSnakeCell(game.food, cell)

            return (
              <span
                aria-colindex={cell.column}
                aria-label={getSnakeCellLabel(cell, snakeSegmentIndex, isFood)}
                aria-rowindex={cell.row}
                className={getSnakeCellClassName(isSnakeSegment, isSnakeHead, isFood)}
                key={getSnakeCellKey(cell)}
                role="gridcell"
              />
            )
          })}
        </div>
        <div className="snake-game-status" aria-label="SNAKE shell status">
          <p>{getSnakeStatusLabel(game.status)}</p>
          <p>D-PAD/SWIPE TURN</p>
          <p>A / START BEGIN</p>
          <p>Score {game.score}</p>
        </div>
      </div>
    </LcdPage>
  )
}

function getSnakeCellClassName(isSnakeSegment: boolean, isSnakeHead: boolean, isFood: boolean) {
  return clsx(
    'snake-game-cell',
    isSnakeSegment && 'snake-game-segment',
    isSnakeHead && 'snake-game-head',
    isFood && 'snake-game-food',
  )
}

function getSnakeCellLabel(cell: SnakeCell, snakeSegmentIndex: number, isFood: boolean) {
  if (snakeSegmentIndex === 0) return `Snake head row ${cell.row} column ${cell.column}`
  if (snakeSegmentIndex > 0) return `Snake segment row ${cell.row} column ${cell.column}`
  if (isFood) return `Food row ${cell.row} column ${cell.column}`

  return `Empty row ${cell.row} column ${cell.column}`
}

function getSnakeStatusLabel(status: SnakeGameState['status']) {
  return snakeStatusLabels[status]
}

function getTouchPoint(touch: SnakeTouchPoint | undefined): SnakeSwipePoint | null {
  if (!touch) return null

  return {
    x: touch.clientX,
    y: touch.clientY,
  }
}

function getSnakeSwipeDirection(
  startPoint: SnakeSwipePoint,
  endPoint: SnakeSwipePoint,
): SnakeDirection | null {
  const deltaX = endPoint.x - startPoint.x
  const deltaY = endPoint.y - startPoint.y
  const absoluteDeltaX = Math.abs(deltaX)
  const absoluteDeltaY = Math.abs(deltaY)
  const largestDelta = Math.max(absoluteDeltaX, absoluteDeltaY)

  if (largestDelta < snakeSwipeMinDistance || absoluteDeltaX === absoluteDeltaY) return null
  if (absoluteDeltaX > absoluteDeltaY) return deltaX > 0 ? 'right' : 'left'

  return deltaY > 0 ? 'down' : 'up'
}
