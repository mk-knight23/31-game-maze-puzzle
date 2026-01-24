import { ref, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { KEYBOARD_SHORTCUTS } from '@/utils/constants'

export type KeyAction = 'up' | 'down' | 'left' | 'right' | 'start' | 'settings' | 'help' | 'none'

export function useKeyboardControls() {
  const settings = useSettingsStore()
  const keysPressed = ref<Set<string>>(new Set())
  const lastAction = ref<KeyAction>('none')

  const actionMap: Record<string, KeyAction> = {
    ArrowUp: 'up',
    KeyW: 'up',
    w: 'up',
    W: 'up',
    ArrowDown: 'down',
    KeyS: 'down',
    s: 'down',
    S: 'down',
    ArrowLeft: 'left',
    KeyA: 'left',
    a: 'left',
    A: 'left',
    ArrowRight: 'right',
    KeyD: 'right',
    d: 'right',
    D: 'right',
    Space: 'start',
    Enter: 'start',
    Escape: 'settings',
    KeyH: 'help',
    h: 'help',
    H: 'help',
    KeyM: 'none',
    m: 'none',
    M: 'none',
  }

  function getAction(key: string): KeyAction {
    return actionMap[key] || 'none'
  }

  function isPressed(key: string): boolean {
    return keysPressed.value.has(key)
  }

  function handleKeyDown(e: KeyboardEvent) {
    const action = getAction(e.key)

    if (action === 'settings' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      settings.toggleHelp()
      return
    }

    if (action === 'help' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      settings.toggleHelp()
      return
    }

    if (['up', 'down', 'left', 'right', 'start'].includes(action)) {
      e.preventDefault()
      lastAction.value = action
    }

    keysPressed.value.add(e.key)
  }

  function handleKeyUp(e: KeyboardEvent) {
    keysPressed.value.delete(e.key)

    if (getAction(e.key) === lastAction.value) {
      setTimeout(() => {
        lastAction.value = 'none'
      }, 50)
    }
  }

  function clearAction() {
    lastAction.value = 'none'
  }

  function getShortcuts() {
    return KEYBOARD_SHORTCUTS
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  })

  return {
    lastAction,
    isPressed,
    getAction,
    clearAction,
    getShortcuts,
  }
}
