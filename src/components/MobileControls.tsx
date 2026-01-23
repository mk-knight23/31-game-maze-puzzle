import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef, useCallback } from 'react'

interface MobileControlsProps {
  onMove: (direction: { x: number; y: number }) => void
  visible: boolean
}

export function MobileControls({ onMove, visible }: MobileControlsProps) {
  const activeRef = useRef<string | null>(null)
  
  const handlePress = useCallback((direction: string) => {
    activeRef.current = direction
    const dirs: Record<string, { x: number; y: number }> = {
      up: { x: 0, y: 1 },
      down: { x: 0, y: -1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    }
    onMove(dirs[direction] || { x: 0, y: 0 })
  }, [onMove])
  
  const handleRelease = useCallback(() => {
    activeRef.current = null
    onMove({ x: 0, y: 0 })
  }, [onMove])
  
  if (!visible) return null
  
  const buttonClass = "w-14 h-14 rounded-xl bg-game-accent/60 backdrop-blur-sm flex items-center justify-center active:scale-90 active:bg-game-accent transition-all touch-none"
  
  return (
    <div className="fixed bottom-8 right-8 pointer-events-auto md:hidden">
      <div className="grid grid-cols-3 gap-2">
        <div />
        <motion.button
          onTouchStart={() => handlePress('up')}
          onTouchEnd={handleRelease}
          className={buttonClass}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-8 h-8 text-white" />
        </motion.button>
        <div />
        
        <motion.button
          onTouchStart={() => handlePress('left')}
          onTouchEnd={handleRelease}
          className={buttonClass}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-8 h-8 text-white" />
        </motion.button>
        
        <motion.button
          onTouchStart={() => handlePress('down')}
          onTouchEnd={handleRelease}
          className={buttonClass}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowDown className="w-8 h-8 text-white" />
        </motion.button>
        
        <motion.button
          onTouchStart={() => handlePress('right')}
          onTouchEnd={handleRelease}
          className={buttonClass}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight className="w-8 h-8 text-white" />
        </motion.button>
      </div>
    </div>
  )
}
