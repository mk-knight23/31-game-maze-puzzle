export type GameState = 'idle' | 'playing' | 'paused' | 'victory' | 'transitioning'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme'

export interface DifficultyConfig {
  name: string
  startSize: number
  sizeIncrement: number
  maxSize: number
  ballSpeed: number
  friction: number
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: 'Easy',
    startSize: 7,
    sizeIncrement: 2,
    maxSize: 15,
    ballSpeed: 8,
    friction: 0.92,
  },
  medium: {
    name: 'Medium',
    startSize: 9,
    sizeIncrement: 2,
    maxSize: 21,
    ballSpeed: 10,
    friction: 0.94,
  },
  hard: {
    name: 'Hard',
    startSize: 11,
    sizeIncrement: 2,
    maxSize: 27,
    ballSpeed: 12,
    friction: 0.95,
  },
  extreme: {
    name: 'Extreme',
    startSize: 13,
    sizeIncrement: 2,
    maxSize: 35,
    ballSpeed: 14,
    friction: 0.96,
  },
}

export interface MazeCell {
  x: number
  y: number
  isWall: boolean
}

export interface GameSettings {
  difficulty: Difficulty
  soundEnabled: boolean
  showTimer: boolean
  cameraMode: 'follow' | 'fixed'
}

export interface LevelRecord {
  level: number
  time: number
  difficulty: Difficulty
  date: string
}
