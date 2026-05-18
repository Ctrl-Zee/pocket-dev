import { describe, expect, it } from 'vitest'
import {
  advanceSnake,
  changeSnakeDirection,
  createSnakeStartState,
  getSnakeCellKey,
  isSameSnakeCell,
  startSnakeGame,
  type SnakeGameState,
} from './snakeGame'

const expectedSnakeStartState: SnakeGameState = {
  status: 'start',
  board: {
    rows: 6,
    columns: 10,
  },
  direction: 'right',
  lastDirection: 'right',
  snake: [
    { row: 3, column: 5 },
    { row: 3, column: 4 },
    { row: 3, column: 3 },
  ],
  food: { row: 5, column: 8 },
  score: 0,
}

describe('Snake game Start state', () => {
  it('creates a clean Start state with board, snake, food, and zero score data', () => {
    expect(createSnakeStartState()).toEqual(expectedSnakeStartState)
  })

  it('returns independent Start state snapshots', () => {
    const firstState = createSnakeStartState()
    const secondState = createSnakeStartState()

    expect(firstState).toEqual(secondState)
    expect(firstState).not.toBe(secondState)
    expect(firstState.board).not.toBe(secondState.board)
    expect(firstState.snake).not.toBe(secondState.snake)
    expect(firstState.snake[0]).not.toBe(secondState.snake[0])
    expect(firstState.food).not.toBe(secondState.food)
  })

  it('keeps reusable cell helpers for rendering snake and food positions', () => {
    expect(getSnakeCellKey({ row: 3, column: 5 })).toBe('3:5')
    expect(isSameSnakeCell({ row: 3, column: 5 }, { row: 3, column: 5 })).toBe(true)
    expect(isSameSnakeCell({ row: 3, column: 5 }, { row: 5, column: 8 })).toBe(false)
  })

  it('starts play from the Start state with zero score', () => {
    expect(startSnakeGame(createSnakeStartState())).toMatchObject({
      status: 'running',
      score: 0,
      snake: expectedSnakeStartState.snake,
    })
  })

  it('advances a running snake one cell to the right on each movement tick', () => {
    const nextGame = advanceSnake(startSnakeGame(createSnakeStartState()))

    expect(nextGame.snake).toEqual([
      { row: 3, column: 6 },
      { row: 3, column: 5 },
      { row: 3, column: 4 },
    ])
  })

  it('changes movement direction before the next tick', () => {
    const nextGame = advanceSnake(
      changeSnakeDirection(startSnakeGame(createSnakeStartState()), 'down'),
    )

    expect(nextGame.snake).toEqual([
      { row: 4, column: 5 },
      { row: 3, column: 5 },
      { row: 3, column: 4 },
    ])
  })

  it('ignores direct and rapid reversal inputs before the next movement tick', () => {
    const runningGame = startSnakeGame(createSnakeStartState())
    const directReverseGame = changeSnakeDirection(runningGame, 'left')
    const rapidReverseGame = changeSnakeDirection(changeSnakeDirection(runningGame, 'down'), 'left')

    expect(directReverseGame.direction).toBe('right')
    expect(rapidReverseGame.direction).toBe('down')
  })

  it('ends the game when the snake moves into a wall', () => {
    const wallCollisionGame: SnakeGameState = {
      ...startSnakeGame(createSnakeStartState()),
      snake: [
        { row: 3, column: 10 },
        { row: 3, column: 9 },
        { row: 3, column: 8 },
      ],
    }

    expect(advanceSnake(wallCollisionGame).status).toBe('game-over')
  })
})
