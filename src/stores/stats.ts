import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STORAGE_KEYS } from '@/utils/constants'

export const useStatsStore = defineStore('stats', () => {
  const totalGames = ref<number>(0)
  const totalWins = ref<number>(0)
  const totalLosses = ref<number>(0)
  const bestTime = ref<number>(999999)
  const totalTimePlayed = ref<number>(0)
  const currentStreak = ref<number>(0)
  const longestStreak = ref<number>(0)

  const winRate = computed(() => {
    if (totalGames.value === 0) return 0
    return Math.round((totalWins.value / totalGames.value) * 100)
  })

  const averageTime = computed(() => {
    if (totalWins.value === 0) return 0
    return Math.round(totalTimePlayed.value / totalWins.value)
  })

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS)
      if (stored) {
        const data = JSON.parse(stored)
        totalGames.value = data.totalGames ?? 0
        totalWins.value = data.totalWins ?? 0
        totalLosses.value = data.totalLosses ?? 0
        bestTime.value = data.bestTime ?? 999999
        totalTimePlayed.value = data.totalTimePlayed ?? 0
        currentStreak.value = data.currentStreak ?? 0
        longestStreak.value = data.longestStreak ?? 0
      }
    } catch (e) {
      console.warn('Failed to load stats:', e)
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(
        STORAGE_KEYS.STATS,
        JSON.stringify({
          totalGames: totalGames.value,
          totalWins: totalWins.value,
          totalLosses: totalLosses.value,
          bestTime: bestTime.value,
          totalTimePlayed: totalTimePlayed.value,
          currentStreak: currentStreak.value,
          longestStreak: longestStreak.value,
        })
      )
    } catch (e) {
      console.warn('Failed to save stats:', e)
    }
  }

  function recordWin(time: number) {
    totalGames.value++
    totalWins.value++
    totalTimePlayed.value += time
    currentStreak.value++
    if (currentStreak.value > longestStreak.value) {
      longestStreak.value = currentStreak.value
    }
    if (time < bestTime.value) {
      bestTime.value = time
    }
    saveToStorage()
  }

  function recordLoss() {
    totalGames.value++
    totalLosses.value++
    currentStreak.value = 0
    saveToStorage()
  }

  function resetStats() {
    totalGames.value = 0
    totalWins.value = 0
    totalLosses.value = 0
    totalTimePlayed.value = 0
    currentStreak.value = 0
    saveToStorage()
  }

  return {
    totalGames,
    totalWins,
    totalLosses,
    bestTime,
    totalTimePlayed,
    currentStreak,
    longestStreak,
    winRate,
    averageTime,
    loadFromStorage,
    saveToStorage,
    recordWin,
    recordLoss,
    resetStats,
  }
})
