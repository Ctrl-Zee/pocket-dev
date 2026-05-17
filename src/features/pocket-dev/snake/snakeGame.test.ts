import { describe, expect, it } from 'vitest'
import {
  createSnakeStartState,
  getSnakeCellKey,
  isSameSnakeCell,
  type SnakeGameState,
} from './snakeGame'

const expectedSnakeStartState: SnakeGameState = {
  status: 'start',
  board: {
    rows: 6,
    columns: 10,
  },
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
})
