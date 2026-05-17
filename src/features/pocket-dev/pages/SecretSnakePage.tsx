import { clsx } from 'clsx'
import { LcdPage } from '@/components/lcd'
import {
  getSnakeCellKey,
  isSameSnakeCell,
  snakeBoardCells,
  type SnakeCell,
  type SnakeGameState,
} from '../snake/snakeGame'

interface SecretSnakePageProps {
  game: SnakeGameState
}

export function SecretSnakePage({ game }: SecretSnakePageProps) {
  return (
    <LcdPage title="Snake">
      <div className="snake-game-page" aria-label="SNAKE game">
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
          <p>D-PAD TURN</p>
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
  return status.toUpperCase()
}
