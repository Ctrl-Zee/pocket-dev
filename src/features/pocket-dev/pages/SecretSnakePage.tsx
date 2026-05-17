import { LcdPage } from '@/components/lcd'
import { snakeBoard, type SnakeCell, type SnakeGameState } from '../snake/snakeGame'

interface SecretSnakePageProps {
  game: SnakeGameState
}

const snakeBoardCells = Array.from({ length: snakeBoard.rows * snakeBoard.columns }, (_, index) => ({
  row: Math.floor(index / snakeBoard.columns) + 1,
  column: (index % snakeBoard.columns) + 1,
}))

export function SecretSnakePage({ game }: SecretSnakePageProps) {
  return (
    <LcdPage title="Snake">
      <div className="snake-game-page" aria-label="SNAKE game">
        <div
          aria-colcount={snakeBoard.columns}
          aria-label="SNAKE board"
          aria-rowcount={snakeBoard.rows}
          className="snake-game-grid"
          role="grid"
        >
          {snakeBoardCells.map((cell) => {
            const snakeSegmentIndex = game.snake.findIndex((segment) => isSameCell(segment, cell))
            const isSnakeSegment = snakeSegmentIndex >= 0
            const isSnakeHead = snakeSegmentIndex === 0
            const isFood = isSameCell(game.food, cell)

            return (
              <span
                aria-colindex={cell.column}
                aria-label={getSnakeCellLabel(cell, snakeSegmentIndex, isFood)}
                aria-rowindex={cell.row}
                className={getSnakeCellClassName(isSnakeSegment, isSnakeHead, isFood)}
                key={`${cell.row}-${cell.column}`}
                role="gridcell"
              />
            )
          })}
        </div>
        <div className="snake-game-status" aria-label="SNAKE shell status">
          <p>State {getSnakeStatusLabel(game.status)}</p>
          <p>Dir {game.direction.toUpperCase()}</p>
          <p>Score {game.score.toString().padStart(3, '0')}</p>
        </div>
      </div>
    </LcdPage>
  )
}

function getSnakeCellClassName(isSnakeSegment: boolean, isSnakeHead: boolean, isFood: boolean) {
  return [
    'snake-game-cell',
    isSnakeSegment ? 'snake-game-segment' : '',
    isSnakeHead ? 'snake-game-head' : '',
    isFood ? 'snake-game-food' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function getSnakeCellLabel(cell: SnakeCell, snakeSegmentIndex: number, isFood: boolean) {
  if (snakeSegmentIndex === 0) return `Snake head row ${cell.row} column ${cell.column}`
  if (snakeSegmentIndex > 0) return `Snake segment row ${cell.row} column ${cell.column}`
  if (isFood) return `Food row ${cell.row} column ${cell.column}`

  return `Empty row ${cell.row} column ${cell.column}`
}

function getSnakeStatusLabel(status: SnakeGameState['status']) {
  return status === 'game-over' ? 'GAME OVER' : status.toUpperCase()
}

function isSameCell(firstCell: SnakeCell, secondCell: SnakeCell) {
  return firstCell.row === secondCell.row && firstCell.column === secondCell.column
}
