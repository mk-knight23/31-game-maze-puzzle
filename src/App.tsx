import { useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { GameCanvas } from '@/components/GameCanvas'
import { StartScreen } from '@/components/StartScreen'
import { GameHUD } from '@/components/GameHUD'
import { LevelComplete } from '@/components/LevelComplete'
import { ThemeToggle } from '@/components/ThemeToggle'

function App() {
  const { gameState, startGame, isDarkMode } = useGameStore()
  
  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])
  
  return (
    <div className={`w-screen h-screen overflow-hidden bg-game-bg ${isDarkMode ? 'dark' : ''}`}>
      {/* Theme toggle */}
      <ThemeToggle />
      
      {/* Game canvas (always rendered for smooth transitions) */}
      {(gameState === 'playing' || gameState === 'transitioning') && (
        <>
          <GameCanvas />
          <GameHUD />
        </>
      )}
      
      {/* Start screen overlay */}
      {gameState === 'idle' && (
        <StartScreen onStart={startGame} />
      )}
      
      {/* Level complete overlay */}
      {gameState === 'transitioning' && (
        <LevelComplete />
      )}
      
      {/* Footer */}
      <div className="fixed bottom-2 left-0 right-0 text-center text-gray-600 text-xs pointer-events-none">
        Built with React Three Fiber + Rapier Physics
      </div>
    </div>
  )
}

export default App
