import type { DeviceMoveDirection } from '@/components/device/types'

export type SnakeGameStatus = 'ready' | 'running' | 'paused' | 'game-over'

export interface SnakeCell {
  row: number
  column: number
}

export interface SnakeGameState {
  status: SnakeGameStatus
  direction: DeviceMoveDirection
  lastDirection: DeviceMoveDirection
  snake: SnakeCell[]
  food: SnakeCell
  score: number
}

export const snakeBoard = {
  rows: 6,
  columns: 10,
} as const

export const snakeTickMs = 400

const initialDirection: DeviceMoveDirection = 'right'
const initialSnake: SnakeCell[] = [
  { row: 3, column: 5 },
  { row: 3, column: 4 },
  { row: 3, column: 3 },
]
const initialFood: SnakeCell = { row: 5, column: 8 }

export function createInitialSnakeGame(): SnakeGameState {
  return {
    status: 'ready',
    direction: initialDirection,
    lastDirection: initialDirection,
    snake: initialSnake.map((cell) => ({ ...cell })),
    food: { ...initialFood },
    score: 0,
  }
}

export function toggleSnakeGame(currentGame: SnakeGameState): SnakeGameState {
  if (currentGame.status === 'running') return { ...currentGame, status: 'paused' }
  if (currentGame.status === 'game-over') return { ...createInitialSnakeGame(), status: 'running' }

  return { ...currentGame, status: 'running' }
}

export function changeSnakeDirection(
  currentGame: SnakeGameState,
  nextDirection: DeviceMoveDirection,
): SnakeGameState {
  if (currentGame.snake.length > 1 && areOppositeDirections(currentGame.lastDirection, nextDirection)) {
    return currentGame
  }

  return { ...currentGame, direction: nextDirection }
}

export function advanceSnake(currentGame: SnakeGameState): SnakeGameState {
  if (currentGame.status !== 'running') return currentGame

  const nextHead = getNextHead(currentGame.snake[0], currentGame.direction)
  const willEatFood = isSameCell(nextHead, currentGame.food)
  const collisionSegments = willEatFood ? currentGame.snake : currentGame.snake.slice(0, -1)

  if (!isInsideBoard(nextHead) || collisionSegments.some((segment) => isSameCell(segment, nextHead))) {
    return { ...currentGame, status: 'game-over' }
  }

  const nextSnake = willEatFood
    ? [nextHead, ...currentGame.snake]
    : [nextHead, ...currentGame.snake.slice(0, -1)]

  return {
    ...currentGame,
    direction: currentGame.direction,
    lastDirection: currentGame.direction,
    snake: nextSnake,
    food: willEatFood ? placeNextFood(nextSnake, currentGame.food) : currentGame.food,
    score: currentGame.score + (willEatFood ? 1 : 0),
  }
}

function getNextHead(head: SnakeCell, direction: DeviceMoveDirection): SnakeCell {
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

function placeNextFood(snake: SnakeCell[], previousFood: SnakeCell): SnakeCell {
  const occupiedCells = new Set(snake.map(getCellKey))
  const totalCells = snakeBoard.rows * snakeBoard.columns
  const startIndex = getCellIndex(previousFood)

  for (let offset = 1; offset <= totalCells; offset += 1) {
    const candidate = getCellFromIndex((startIndex + offset) % totalCells)

    if (!occupiedCells.has(getCellKey(candidate))) return candidate
  }

  return previousFood
}

function getCellIndex(cell: SnakeCell) {
  return (cell.row - 1) * snakeBoard.columns + (cell.column - 1)
}

function getCellFromIndex(index: number): SnakeCell {
  return {
    row: Math.floor(index / snakeBoard.columns) + 1,
    column: (index % snakeBoard.columns) + 1,
  }
}

function getCellKey(cell: SnakeCell) {
  return `${cell.row}:${cell.column}`
}

function isInsideBoard(cell: SnakeCell) {
  return (
    cell.row >= 1 &&
    cell.row <= snakeBoard.rows &&
    cell.column >= 1 &&
    cell.column <= snakeBoard.columns
  )
}

function isSameCell(firstCell: SnakeCell, secondCell: SnakeCell) {
  return firstCell.row === secondCell.row && firstCell.column === secondCell.column
}

function areOppositeDirections(
  firstDirection: DeviceMoveDirection,
  secondDirection: DeviceMoveDirection,
) {
  return (
    (firstDirection === 'up' && secondDirection === 'down') ||
    (firstDirection === 'down' && secondDirection === 'up') ||
    (firstDirection === 'left' && secondDirection === 'right') ||
    (firstDirection === 'right' && secondDirection === 'left')
  )
}
