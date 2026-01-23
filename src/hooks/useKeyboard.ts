import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

interface UseKeyboardOptions {
  onMove: (direction: THREE.Vector2) => void
  enabled?: boolean
}

export function useKeyboard({ onMove, enabled = true }: UseKeyboardOptions) {
  const keysPressed = useRef<Set<string>>(new Set())
  const directionRef = useRef(new THREE.Vector2(0, 0))
  
  const updateDirection = useCallback(() => {
    const dir = new THREE.Vector2(0, 0)
    
    // Arrow keys and WASD
    if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('KeyA') || keysPressed.current.has('KeyH')) {
      dir.x -= 1
    }
    if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('KeyD') || keysPressed.current.has('KeyL')) {
      dir.x += 1
    }
    if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('KeyS') || keysPressed.current.has('KeyJ')) {
      dir.y -= 1
    }
    if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('KeyW') || keysPressed.current.has('KeyK')) {
      dir.y += 1
    }
    
    // Normalize for diagonal movement
    if (dir.length() > 0) {
      dir.normalize()
    }
    
    directionRef.current = dir
    onMove(dir)
  }, [onMove])
  
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return
      
      const key = e.code
      
      // Prevent default for game keys
      if ([
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'KeyW', 'KeyA', 'KeyS', 'KeyD',
        'KeyH', 'KeyJ', 'KeyK', 'KeyL',
      ].includes(key)) {
        e.preventDefault()
      }
      
      if (!keysPressed.current.has(key)) {
        keysPressed.current.add(key)
        updateDirection()
      }
    },
    [enabled, updateDirection]
  )
  
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code)
      updateDirection()
    },
    [updateDirection]
  )
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])
  
  return directionRef
}
