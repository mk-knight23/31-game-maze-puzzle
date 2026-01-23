import { motion } from 'framer-motion'
import { useGameStore } from '@/stores/gameStore'
import { DIFFICULTY_CONFIGS } from '@/types/game'

export function GameHUD() {
  const { level, elapsedTime, settings, mazeSize } = useGameStore()
  const config = DIFFICULTY_CONFIGS[settings.difficulty]
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 10)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`
  }
  
  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto flex justify-between items-start">
        {/* Level info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2"
        >
          <p className="text-game-gold font-bold font-game text-lg">
            Level {level}
          </p>
          <p className="text-gray-400 text-xs">
            {config.name} • {mazeSize}x{mazeSize}
          </p>
        </motion.div>
        
        {/* Timer */}
        {settings.showTimer && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2"
          >
            <p className="text-game-accent font-mono text-xl font-bold">
              {formatTime(elapsedTime)}
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Controls hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-4 text-gray-500 text-xs"
      >
        Arrow keys / WASD to move • ESC to pause
      </motion.div>
    </div>
  )
}
