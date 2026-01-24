import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STORAGE_KEYS, DIFFICULTY_PRESETS } from '@/utils/constants'

export type Difficulty = keyof typeof DIFFICULTY_PRESETS
export type ThemeMode = 'dark' | 'light' | 'system'

export const useSettingsStore = defineStore('settings', () => {
  const soundEnabled = ref<boolean>(true)
  const difficulty = ref<Difficulty>('medium')
  const theme = ref<ThemeMode>('dark')
  const showHelp = ref<boolean>(false)
  const reducedMotion = ref<boolean>(false)

  const currentMazeSize = computed(() => DIFFICULTY_PRESETS[difficulty.value].mazeSize)

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (stored) {
        const data = JSON.parse(stored)
        soundEnabled.value = data.soundEnabled ?? true
        difficulty.value = data.difficulty ?? 'medium'
        theme.value = data.theme ?? 'dark'
        reducedMotion.value = data.reducedMotion ?? false
      }
    } catch (e) {
      console.warn('Failed to load settings:', e)
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify({
          soundEnabled: soundEnabled.value,
          difficulty: difficulty.value,
          theme: theme.value,
          reducedMotion: reducedMotion.value,
        })
      )
    } catch (e) {
      console.warn('Failed to save settings:', e)
    }
  }

  function setDifficulty(value: Difficulty) {
    difficulty.value = value
    saveToStorage()
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
    saveToStorage()
  }

  function setTheme(value: ThemeMode) {
    theme.value = value
    applyTheme()
    saveToStorage()
  }

  function applyTheme() {
    const isDark =
      theme.value === 'dark' ||
      (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleHelp() {
    showHelp.value = !showHelp.value
  }

  return {
    soundEnabled,
    difficulty,
    theme,
    showHelp,
    reducedMotion,
    currentMazeSize,
    loadFromStorage,
    saveToStorage,
    setDifficulty,
    toggleSound,
    setTheme,
    applyTheme,
    toggleHelp,
  }
})
