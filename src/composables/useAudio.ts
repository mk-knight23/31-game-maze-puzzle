import { ref, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export function useAudio() {
  const settings = useSettingsStore()
  const audioContext = ref<AudioContext | null>(null)
  const enabled = ref(true)

  onMounted(() => {
    enabled.value = settings.soundEnabled
  })

  function playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3
  ) {
    if (!enabled.value || !settings.soundEnabled) return

    try {
      if (!audioContext.value) {
        audioContext.value = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }

      const oscillator = audioContext.value.createOscillator()
      const gainNode = audioContext.value.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.value.destination)

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, audioContext.value.currentTime)

      gainNode.gain.setValueAtTime(volume, audioContext.value.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + duration)

      oscillator.start(audioContext.value.currentTime)
      oscillator.stop(audioContext.value.currentTime + duration)
    } catch (e) {
      console.warn('Audio playback failed:', e)
    }
  }

  function playMove() {
    playTone(440, 0.1, 'sine', 0.2)
  }

  function playWin() {
    playTone(523.25, 0.15, 'sine', 0.3)
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.3), 150)
    setTimeout(() => playTone(783.99, 0.2, 'sine', 0.3), 300)
  }

  function playClick() {
    playTone(800, 0.05, 'sine', 0.2)
  }

  function playError() {
    playTone(200, 0.3, 'sawtooth', 0.2)
  }

  function setEnabled(value: boolean) {
    enabled.value = value
  }

  return {
    playMove,
    playWin,
    playClick,
    playError,
    setEnabled,
    isEnabled: enabled,
  }
}
