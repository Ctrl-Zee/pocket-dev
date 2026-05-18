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

interface SwipePoint {
  x: number
  y: number
}

type SwipeTouch = Pick<Touch, 'clientX' | 'clientY'>

const snakeStatusLabels: Record<SnakeGameState['status'], string> = {
  start: 'START',
  running: 'RUNNING',
  paused: 'PAUSED',
  'game-over': 'GAME OVER',
}
const snakeSwipeMinimumDistancePx = 24

export function SecretSnakePage({ game, onSwipeDirection }: SecretSnakePageProps) {
  const swipeStartPointRef = useRef<SwipePoint | null>(null)
  const snakeStatusLines = getSnakeStatusLines(game)

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
          {snakeStatusLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
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

function getSnakeStatusLines(game: SnakeGameState) {
  const statusLabel = snakeStatusLabels[game.status]

  switch (game.status) {
    case 'game-over':
      return [statusLabel, `Final Score ${game.score}`, 'A / START RESTART']
    case 'paused':
      return [
        statusLabel,
        'P/START RESUME',
        'A RESTART',
        `Score ${game.score}`,
      ]
    case 'running':
      return [
        statusLabel,
        'D-PAD/SWIPE TURN',
        'P/START PAUSE',
        `Score ${game.score}`,
      ]
    case 'start':
      return [
        statusLabel,
        'D-PAD/SWIPE TURN',
        'A / START BEGIN',
        `Score ${game.score}`,
      ]
  }
}

function getTouchPoint(touch: SwipeTouch | undefined): SwipePoint | null {
  if (!touch) return null

  return {
    x: touch.clientX,
    y: touch.clientY,
  }
}

function getSnakeSwipeDirection(
  startPoint: SwipePoint,
  endPoint: SwipePoint,
): SnakeDirection | null {
  const deltaX = endPoint.x - startPoint.x
  const deltaY = endPoint.y - startPoint.y
  const horizontalDistance = Math.abs(deltaX)
  const verticalDistance = Math.abs(deltaY)
  const largestDistance = Math.max(horizontalDistance, verticalDistance)

  if (largestDistance < snakeSwipeMinimumDistancePx || horizontalDistance === verticalDistance) {
    return null
  }

  if (horizontalDistance > verticalDistance) {
    if (deltaX > 0) return 'right'
    return 'left'
  }

  if (deltaY > 0) return 'down'
  return 'up'
}
