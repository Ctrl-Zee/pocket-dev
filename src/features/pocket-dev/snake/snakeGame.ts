export type SnakeGameStatus = 'start' | 'running' | 'game-over'
export type SnakeDirection = 'up' | 'down' | 'left' | 'right'

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
  direction: SnakeDirection
  lastDirection: SnakeDirection
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
  (_, index) => getBoardCellFromIndex(snakeBoard, index),
)

export const snakeTickMs = 400
const snakeSpeedStepMs = 20
const snakeMinTickMs = 200

const initialSnake: SnakeCell[] = [
  { row: 3, column: 5 },
  { row: 3, column: 4 },
  { row: 3, column: 3 },
]
const initialFood: SnakeCell = { row: 5, column: 8 }
const initialDirection: SnakeDirection = 'right'
const oppositeSnakeDirections: Record<SnakeDirection, SnakeDirection> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

export function createSnakeStartState(): SnakeGameState {
  return {
    status: 'start',
    board: { ...snakeBoard },
    direction: initialDirection,
    lastDirection: initialDirection,
    snake: initialSnake.map((cell) => ({ ...cell })),
    food: { ...initialFood },
    score: 0,
  }
}

export function startSnakeGame(currentGame: SnakeGameState): SnakeGameState {
  if (currentGame.status === 'running') return currentGame
  if (currentGame.status === 'game-over') {
    return { ...createSnakeStartState(), status: 'running' }
  }

  return { ...currentGame, status: 'running', score: 0 }
}

export function advanceSnake(currentGame: SnakeGameState): SnakeGameState {
  if (currentGame.status !== 'running') return currentGame

  const nextHead = getNextHead(currentGame.snake[0], currentGame.direction)

  if (!isInsideBoard(nextHead, currentGame.board)) {
    return { ...currentGame, status: 'game-over' }
  }

  const hasCollectedFood = isSameSnakeCell(nextHead, currentGame.food)
  const nextSnake = hasCollectedFood
    ? [nextHead, ...currentGame.snake]
    : [nextHead, ...currentGame.snake.slice(0, -1)]

  if (isSnakeCellOccupied(nextSnake.slice(1), nextHead)) {
    return { ...currentGame, status: 'game-over' }
  }

  const nextGame = {
    ...currentGame,
    lastDirection: currentGame.direction,
    snake: nextSnake,
  }

  if (!hasCollectedFood) return nextGame

  return {
    ...nextGame,
    food: getNextFoodCell(currentGame.board, nextSnake, currentGame.food),
    score: currentGame.score + 1,
  }
}

export function changeSnakeDirection(
  currentGame: SnakeGameState,
  nextDirection: SnakeDirection,
): SnakeGameState {
  if (
    currentGame.snake.length > 1 &&
    areOppositeDirections(currentGame.lastDirection, nextDirection)
  ) {
    return currentGame
  }

  return { ...currentGame, direction: nextDirection }
}

export function getSnakeTickMs(currentGame: SnakeGameState) {
  const scoreGrowthSteps = currentGame.score
  const lengthGrowthSteps = currentGame.snake.length - initialSnake.length
  const speedIncreaseSteps = Math.max(scoreGrowthSteps, lengthGrowthSteps, 0)

  return Math.max(snakeMinTickMs, snakeTickMs - speedIncreaseSteps * snakeSpeedStepMs)
}

export function getSnakeCellKey(cell: SnakeCell) {
  return `${cell.row}:${cell.column}`
}

export function isSameSnakeCell(firstCell: SnakeCell, secondCell: SnakeCell) {
  return firstCell.row === secondCell.row && firstCell.column === secondCell.column
}

function getBoardCellFromIndex(board: SnakeBoard, index: number): SnakeCell {
  return {
    row: Math.floor(index / board.columns) + 1,
    column: (index % board.columns) + 1,
  }
}

function getCellIndex(board: SnakeBoard, cell: SnakeCell) {
  return (cell.row - 1) * board.columns + (cell.column - 1)
}

function getNextFoodCell(board: SnakeBoard, snake: SnakeCell[], previousFood: SnakeCell) {
  const boardCellCount = board.rows * board.columns
  const previousFoodIndex = getCellIndex(board, previousFood)

  for (let offset = 1; offset <= boardCellCount; offset += 1) {
    const candidate = getBoardCellFromIndex(board, (previousFoodIndex + offset) % boardCellCount)

    if (!isSnakeCellOccupied(snake, candidate)) return candidate
  }

  return previousFood
}

function isSnakeCellOccupied(snake: SnakeCell[], cell: SnakeCell) {
  return snake.some((segment) => isSameSnakeCell(segment, cell))
}

function getNextHead(head: SnakeCell, direction: SnakeDirection): SnakeCell {
  switch (direction) {
    case 'up':
      return { row: head.row - 1, column: head.column }
    case 'down':
      return { row: head.row + 1, column: head.column }
    case 'left':
      return { row: head.row, column: head.column - 1 }
    case 'right':
      return { row: head.row, column: head.column + 1 }
  }
}

function areOppositeDirections(firstDirection: SnakeDirection, secondDirection: SnakeDirection) {
  return oppositeSnakeDirections[firstDirection] === secondDirection
}

function isInsideBoard(cell: SnakeCell, board: SnakeBoard) {
  return (
    cell.row >= 1 && cell.row <= board.rows && cell.column >= 1 && cell.column <= board.columns
  )
}
