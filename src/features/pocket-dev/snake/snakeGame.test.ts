import { describe, expect, it } from 'vitest'
import {
  advanceSnake,
  changeSnakeDirection,
  createSnakeStartState,
  getSnakeTickMs,
  getSnakeCellKey,
  isSameSnakeCell,
  snakeBoardCells,
  snakeTickMs,
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

    expect(nextGame.status).toBe('running')
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

  it('ends the game when the snake moves into its own body', () => {
    const selfCollisionGame: SnakeGameState = {
      ...startSnakeGame(createSnakeStartState()),
      direction: 'up',
      lastDirection: 'up',
      snake: [
        { row: 3, column: 5 },
        { row: 3, column: 6 },
        { row: 2, column: 6 },
        { row: 2, column: 5 },
        { row: 2, column: 4 },
      ],
    }

    expect(advanceSnake(selfCollisionGame).status).toBe('game-over')
  })

  it('collects food by increasing score, growing, and placing one new food in an empty cell', () => {
    const foodCollectionGame: SnakeGameState = {
      ...startSnakeGame(createSnakeStartState()),
      food: { row: 3, column: 6 },
    }

    const nextGame = advanceSnake(foodCollectionGame)

    expect(nextGame.status).toBe('running')
    expect(nextGame.score).toBe(1)
    expect(nextGame.snake).toEqual([
      { row: 3, column: 6 },
      { row: 3, column: 5 },
      { row: 3, column: 4 },
      { row: 3, column: 3 },
    ])
    expect(
      nextGame.snake.some((segment) => isSameSnakeCell(segment, nextGame.food)),
    ).toBe(false)
  })

  it('places replacement food in the only empty space left by a very long snake', () => {
    const food = { row: 1, column: 2 }
    const onlyAvailableFood = { row: 6, column: 10 }
    const longSnake = snakeBoardCells.filter(
      (cell) => !isSameSnakeCell(cell, food) && !isSameSnakeCell(cell, onlyAvailableFood),
    )
    const longSnakeGame: SnakeGameState = {
      ...startSnakeGame(createSnakeStartState()),
      food,
      snake: longSnake,
    }

    const nextGame = advanceSnake(longSnakeGame)

    expect(nextGame.score).toBe(1)
    expect(nextGame.snake).toHaveLength(59)
    expect(nextGame.food).toEqual(onlyAvailableFood)
    expect(
      nextGame.snake.some((segment) => isSameSnakeCell(segment, nextGame.food)),
    ).toBe(false)
  })

  it('increases movement speed gradually as the snake grows', () => {
    const runningGame = startSnakeGame(createSnakeStartState())
    const oneFoodGame: SnakeGameState = {
      ...runningGame,
      score: 1,
      snake: [{ row: 3, column: 6 }, ...runningGame.snake],
    }
    const longerGame: SnakeGameState = {
      ...runningGame,
      score: 10,
      snake: snakeBoardCells.slice(0, 13),
    }

    const startingTickMs = getSnakeTickMs(runningGame)
    const oneFoodTickMs = getSnakeTickMs(oneFoodGame)
    const longerTickMs = getSnakeTickMs(longerGame)

    expect(startingTickMs).toBe(snakeTickMs)
    expect(oneFoodTickMs).toBeLessThan(startingTickMs)
    expect(startingTickMs - oneFoodTickMs).toBeLessThanOrEqual(25)
    expect(longerTickMs).toBeLessThan(oneFoodTickMs)
    expect(longerTickMs).toBeGreaterThanOrEqual(200)
  })
})
