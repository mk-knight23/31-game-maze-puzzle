import { motion } from 'framer-motion'
import { Trophy, ArrowRight } from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'
import { DIFFICULTY_CONFIGS } from '@/types/game'

export function LevelComplete() {
  const { level, elapsedTime, settings, getBestTime } = useGameStore()
  const config = DIFFICULTY_CONFIGS[settings.difficulty]
  const bestTime = getBestTime(level, settings.difficulty)
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }
  
  const isNewBest = bestTime === null || elapsedTime <= bestTime
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-30"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center border border-game-success/30"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Trophy className="w-16 h-16 mx-auto text-game-gold mb-4" />
        </motion.div>
        
        <h2 className="text-3xl font-bold font-game text-game-success mb-2">
          LEVEL {level} COMPLETE!
        </h2>
        
        <p className="text-gray-400 mb-4">{config.name} Mode</p>
        
        <div className="bg-black/30 rounded-lg p-4 mb-4">
          <p className="text-gray-400 text-sm">Your Time</p>
          <p className="text-3xl font-mono font-bold text-white">
            {formatTime(elapsedTime)}
          </p>
          
          {isNewBest && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-game-gold text-sm mt-2"
            >
              New Best Time!
            </motion.p>
          )}
        </div>
        
        <div className="flex items-center justify-center gap-2 text-game-accent">
          <span className="font-game">Loading next level</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
