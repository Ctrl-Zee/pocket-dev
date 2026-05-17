export type SnakeGameStatus = 'start'

export interface SnakeCell {
  row: number
  column: number
}

export interface SnakeBoard {
  rows: number
  columns: number
}

export interface SnakeGameState {
  status: SnakeGameStatus
  board: SnakeBoard
  snake: SnakeCell[]
  food: SnakeCell
  score: number
}

export const snakeBoard = {
  rows: 6,
  columns: 10,
} as const

export const snakeBoardCells = Array.from(
  { length: snakeBoard.rows * snakeBoard.columns },
  (_, index) => getCellFromIndex(index),
)

const initialSnake: SnakeCell[] = [
  { row: 3, column: 5 },
  { row: 3, column: 4 },
  { row: 3, column: 3 },
]
const initialFood: SnakeCell = { row: 5, column: 8 }

export function createSnakeStartState(): SnakeGameState {
  return {
    status: 'start',
    board: { ...snakeBoard },
    snake: initialSnake.map((cell) => ({ ...cell })),
    food: { ...initialFood },
    score: 0,
  }
}

export function getSnakeCellKey(cell: SnakeCell) {
  return `${cell.row}:${cell.column}`
}

export function isSameSnakeCell(firstCell: SnakeCell, secondCell: SnakeCell) {
  return firstCell.row === secondCell.row && firstCell.column === secondCell.column
}

function getCellFromIndex(index: number): SnakeCell {
  return {
    row: Math.floor(index / snakeBoard.columns) + 1,
    column: (index % snakeBoard.columns) + 1,
  }
}
