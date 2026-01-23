import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Difficulty, GameSettings, LevelRecord } from '@/types/game'
import { DIFFICULTY_CONFIGS } from '@/types/game'

interface GameStore {
  // Game state
  gameState: GameState
  level: number
  mazeSize: number
  elapsedTime: number
  
  // Settings
  settings: GameSettings
  isDarkMode: boolean
  
  // Records
  records: LevelRecord[]
  
  // Actions
  setGameState: (state: GameState) => void
  startGame: () => void
  nextLevel: () => void
  resetGame: () => void
  setElapsedTime: (time: number) => void
  
  // Settings actions
  setDifficulty: (difficulty: Difficulty) => void
  toggleSound: () => void
  toggleTimer: () => void
  toggleCameraMode: () => void
  toggleDarkMode: () => void
  
  // Record actions
  addRecord: (level: number, time: number) => void
  getBestTime: (level: number, difficulty: Difficulty) => number | null
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: 'idle',
      level: 1,
      mazeSize: DIFFICULTY_CONFIGS.medium.startSize,
      elapsedTime: 0,
      
      settings: {
        difficulty: 'medium',
        soundEnabled: true,
        showTimer: true,
        cameraMode: 'follow',
      },
      
      isDarkMode: true,
      records: [],
      
      // Game state actions
      setGameState: (gameState) => set({ gameState }),
      
      startGame: () => {
        const config = DIFFICULTY_CONFIGS[get().settings.difficulty]
        set({
          gameState: 'playing',
          level: 1,
          mazeSize: config.startSize,
          elapsedTime: 0,
        })
      },
      
      nextLevel: () => {
        const { level, settings, elapsedTime } = get()
        const config = DIFFICULTY_CONFIGS[settings.difficulty]
        const newLevel = level + 1
        const newSize = Math.min(
          config.startSize + (newLevel - 1) * config.sizeIncrement,
          config.maxSize
        )
        
        // Save record
        get().addRecord(level, elapsedTime)
        
        set({
          level: newLevel,
          mazeSize: newSize,
          elapsedTime: 0,
          gameState: 'transitioning',
        })
        
        // Transition back to playing after animation
        setTimeout(() => set({ gameState: 'playing' }), 1500)
      },
      
      resetGame: () => set({ 
        gameState: 'idle', 
        level: 1, 
        elapsedTime: 0,
        mazeSize: DIFFICULTY_CONFIGS[get().settings.difficulty].startSize,
      }),
      
      setElapsedTime: (elapsedTime) => set({ elapsedTime }),
      
      // Settings actions
      setDifficulty: (difficulty) => {
        const config = DIFFICULTY_CONFIGS[difficulty]
        set((state) => ({
          settings: { ...state.settings, difficulty },
          mazeSize: config.startSize,
        }))
      },
      
      toggleSound: () =>
        set((state) => ({
          settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled },
        })),
      
      toggleTimer: () =>
        set((state) => ({
          settings: { ...state.settings, showTimer: !state.settings.showTimer },
        })),
      
      toggleCameraMode: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            cameraMode: state.settings.cameraMode === 'follow' ? 'fixed' : 'follow',
          },
        })),
      
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      // Record actions
      addRecord: (level, time) => {
        const { settings } = get()
        const newRecord: LevelRecord = {
          level,
          time,
          difficulty: settings.difficulty,
          date: new Date().toISOString(),
        }
        
        set((state) => ({
          records: [...state.records, newRecord].slice(-100), // Keep last 100
        }))
      },
      
      getBestTime: (level, difficulty) => {
        const records = get().records.filter(
          (r) => r.level === level && r.difficulty === difficulty
        )
        if (records.length === 0) return null
        return Math.min(...records.map((r) => r.time))
      },
    }),
    {
      name: 'astray-maze-storage',
      partialize: (state) => ({
        settings: state.settings,
        isDarkMode: state.isDarkMode,
        records: state.records,
      }),
    }
  )
)
