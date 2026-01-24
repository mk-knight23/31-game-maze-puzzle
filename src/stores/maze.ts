import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useSettingsStore } from './settings'
import { useStatsStore } from './stats'
import { useAudio } from '@/composables/useAudio'
import { STORAGE_KEYS } from '@/utils/constants'

export type GameStatus = 'idle' | 'playing' | 'gameover' | 'victory'

export const useMazeStore = defineStore('maze', () => {
  const settings = useSettingsStore()
  const stats = useStatsStore()
  const { playWin, playError } = useAudio()

  const status = ref<GameStatus>('idle')
  const level = ref<number>(1)
  const mazeSize = ref<number>(11)
  const time = ref<number>(0)
  const timerInterval = ref<number | null>(null)

  const bestTime = computed(() => stats.bestTime)

  function startLevel() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
    status.value = 'playing'
    mazeSize.value = settings.currentMazeSize
    time.value = 0
    timerInterval.value = window.setInterval(() => {
      time.value++
    }, 1000)
  }

  function win() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    status.value = 'victory'
    playWin()
    stats.recordWin(time.value)
    localStorage.setItem(STORAGE_KEYS.GAME, JSON.stringify({ level: level.value }))
  }

  function gameover() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    status.value = 'gameover'
    playError()
    stats.recordLoss()
  }

  function nextLevel() {
    level.value++
    startLevel()
  }

  function resetGame() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    level.value = 1
    status.value = 'idle'
  }

  function restartLevel() {
    startLevel()
  }

  function loadProgress() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GAME)
      if (stored) {
        const data = JSON.parse(stored)
        level.value = data.level || 1
      }
    } catch (e) {
      console.warn('Failed to load game progress:', e)
    }
  }

  watch(
    () => settings.difficulty,
    () => {
      if (status.value === 'idle') {
        mazeSize.value = settings.currentMazeSize
      }
    }
  )

  return {
    status,
    level,
    mazeSize,
    time,
    bestTime,
    startLevel,
    win,
    gameover,
    nextLevel,
    resetGame,
    restartLevel,
    loadProgress,
  }
})
