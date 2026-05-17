import { describe, expect, it } from 'vitest'
import {
  advanceSnake,
  changeSnakeDirection,
  createInitialSnakeGame,
  toggleSnakeGame,
  type SnakeGameState,
} from './snakeGame'

describe('Snake game rules', () => {
  it('changes direction while blocking an immediate 180-degree reversal', () => {
    const game = createInitialSnakeGame()

    expect(changeSnakeDirection(game, 'down').direction).toBe('down')
    expect(changeSnakeDirection(game, 'left').direction).toBe('right')
  })

  it('grows, scores, and places the next food when the head eats', () => {
    const game: SnakeGameState = {
      ...createInitialSnakeGame(),
      status: 'running',
      food: { row: 3, column: 6 },
    }

    const nextGame = advanceSnake(game)

    expect(nextGame.score).toBe(1)
    expect(nextGame.snake).toEqual([
      { row: 3, column: 6 },
      { row: 3, column: 5 },
      { row: 3, column: 4 },
      { row: 3, column: 3 },
    ])
    expect(nextGame.food).toEqual({ row: 3, column: 7 })
  })

  it('sets a game-over state on wall and self collisions', () => {
    const wallCollisionGame: SnakeGameState = {
      ...createInitialSnakeGame(),
      status: 'running',
      snake: [
        { row: 3, column: 10 },
        { row: 3, column: 9 },
        { row: 3, column: 8 },
      ],
    }
    const selfCollisionGame: SnakeGameState = {
      ...createInitialSnakeGame(),
      status: 'running',
      direction: 'up',
      lastDirection: 'up',
      snake: [
        { row: 3, column: 3 },
        { row: 3, column: 4 },
        { row: 2, column: 4 },
        { row: 2, column: 3 },
        { row: 2, column: 2 },
      ],
    }

    expect(advanceSnake(wallCollisionGame).status).toBe('game-over')
    expect(advanceSnake(selfCollisionGame).status).toBe('game-over')
  })

  it('restarts from game over when the player presses A or Start again', () => {
    const gameOverGame = advanceSnake({
      ...createInitialSnakeGame(),
      status: 'running',
      snake: [
        { row: 3, column: 10 },
        { row: 3, column: 9 },
        { row: 3, column: 8 },
      ],
    })

    expect(toggleSnakeGame(gameOverGame)).toMatchObject({
      status: 'running',
      score: 0,
      snake: [
        { row: 3, column: 5 },
        { row: 3, column: 4 },
        { row: 3, column: 3 },
      ],
    })
  })
})
