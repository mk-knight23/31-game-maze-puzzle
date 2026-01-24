export const STORAGE_KEYS = {
  SETTINGS: 'astray-settings',
  STATS: 'astray-stats',
  GAME: 'astray-game',
  BEST_TIME: 'maze-best-time',
} as const

export const DIFFICULTY_PRESETS = {
  easy: { mazeSize: 11, name: 'Easy' },
  medium: { mazeSize: 15, name: 'Medium' },
  hard: { mazeSize: 19, name: 'Hard' },
  expert: { mazeSize: 23, name: 'Expert' },
} as const

export const KEYBOARD_SHORTCUTS = [
  { key: 'ArrowUp / W', action: 'Move Up' },
  { key: 'ArrowDown / S', action: 'Move Down' },
  { key: 'ArrowLeft / A', action: 'Move Left' },
  { key: 'ArrowRight / D', action: 'Move Right' },
  { key: 'Space', action: 'Start/Restart' },
  { key: 'Escape', action: 'Open Settings' },
  { key: 'H', action: 'Toggle Help' },
] as const
