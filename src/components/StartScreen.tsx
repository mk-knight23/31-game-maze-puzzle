import { motion } from 'framer-motion'
import { Play, Settings, Info, Volume2, VolumeX, Timer, Camera } from 'lucide-react'
import { useState } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { DIFFICULTY_CONFIGS, type Difficulty } from '@/types/game'

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const { settings, setDifficulty, toggleSound, toggleTimer, toggleCameraMode } = useGameStore()
  
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'extreme']
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-game-bg via-gray-900 to-black z-20">
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-4 max-w-lg"
      >
        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold font-game mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <span className="text-game-accent text-shadow-glow">ASTRAY</span>
        </motion.h1>
        
        <motion.p
          className="text-gray-400 mb-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Navigate the ball through the 3D maze
        </motion.p>
        
        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-black/60 backdrop-blur-sm rounded-xl p-6 mb-6"
          >
            <h3 className="text-xl font-bold text-white font-game mb-4">Settings</h3>
            
            {/* Difficulty */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-2 justify-center">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`px-4 py-2 rounded-lg font-game text-sm transition-all ${
                      settings.difficulty === diff
                        ? 'bg-game-accent text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {DIFFICULTY_CONFIGS[diff].name}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Maze size: {DIFFICULTY_CONFIGS[settings.difficulty].startSize}x{DIFFICULTY_CONFIGS[settings.difficulty].startSize}
              </p>
            </div>
            
            {/* Toggles */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={toggleSound}
                className={`p-3 rounded-lg transition-all ${
                  settings.soundEnabled ? 'bg-game-accent text-white' : 'bg-gray-700 text-gray-400'
                }`}
                title="Sound"
              >
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              
              <button
                onClick={toggleTimer}
                className={`p-3 rounded-lg transition-all ${
                  settings.showTimer ? 'bg-game-accent text-white' : 'bg-gray-700 text-gray-400'
                }`}
                title="Show Timer"
              >
                <Timer className="w-5 h-5" />
              </button>
              
              <button
                onClick={toggleCameraMode}
                className={`p-3 rounded-lg transition-all ${
                  settings.cameraMode === 'follow' ? 'bg-game-accent text-white' : 'bg-gray-700 text-gray-400'
                }`}
                title={`Camera: ${settings.cameraMode}`}
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}
        
        {/* Help Panel */}
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-black/60 backdrop-blur-sm rounded-xl p-6 mb-6 text-left"
          >
            <h3 className="text-xl font-bold text-white font-game mb-4 text-center">How to Play</h3>
            
            <div className="space-y-3 text-gray-300 text-sm">
              <p>Use the <span className="text-game-accent">arrow keys</span> or <span className="text-game-accent">WASD</span> to move the ball.</p>
              <p>Navigate through the maze to find the <span className="text-game-success">green exit</span>.</p>
              <p>Each level increases the maze size and difficulty.</p>
              <p className="text-gray-500">Vim users: h, j, k, l keys also work!</p>
            </div>
            
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 text-gray-400 hover:text-white transition-colors w-full text-center"
            >
              Close
            </button>
          </motion.div>
        )}
        
        {/* Buttons */}
        {!showSettings && !showHelp && (
          <div className="space-y-4">
            {/* Start Button */}
            <motion.button
              onClick={onStart}
              className="w-full group relative px-12 py-4 bg-game-accent text-white font-bold font-game text-xl rounded-xl shadow-lg shadow-game-accent/30 hover:shadow-game-accent/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-3">
                <Play className="w-6 h-6" />
                START GAME
              </span>
            </motion.button>
            
            {/* Secondary buttons */}
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="w-5 h-5" />
                Settings
              </motion.button>
              
              <motion.button
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Info className="w-5 h-5" />
                Help
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
