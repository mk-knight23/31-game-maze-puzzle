<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useMazeStore } from './stores/maze'
import { useSettingsStore } from './stores/settings'
import { useStatsStore } from './stores/stats'
import { useAudio } from './composables/useAudio'
import { useKeyboardControls, type KeyAction } from './composables/useKeyboardControls'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, Stars } from '@tresjs/cientos'
import { generateMaze } from './utils/mazeGenerator'
import {
  Trophy,
  Settings,
  Github,
  Maximize2,
  Play,
  RotateCcw,
} from 'lucide-vue-next'
import SettingsPanel from './components/ui/SettingsPanel.vue'

const store = useMazeStore()
const settings = useSettingsStore()
const stats = useStatsStore()
const { playClick, playMove } = useAudio()
const { lastAction, clearAction } = useKeyboardControls()

const mazeData = ref<number[][]>([])
const ballPos = ref<[number, number, number]>([1, 0, 1])

onMounted(() => {
  store.loadProgress()
  regenerateMaze()
})

watch(() => store.level, regenerateMaze)

watch(lastAction, (action: KeyAction) => {
  if (action === 'none') return

  switch (action) {
    case 'up':
      handleMove(0, -1)
      break
    case 'down':
      handleMove(0, 1)
      break
    case 'left':
      handleMove(-1, 0)
      break
    case 'right':
      handleMove(1, 0)
      break
    case 'start':
      if (store.status === 'idle') {
        playClick()
        store.startLevel()
      }
      break
  }

  setTimeout(clearAction, 100)
})

function regenerateMaze() {
  mazeData.value = generateMaze(store.mazeSize)
  ballPos.value = [1, 0, 1]
}

function handleMove(dx: number, dz: number) {
  if (store.status !== 'playing') return

  playMove()
  const nextX = ballPos.value[0] + dx
  const nextZ = ballPos.value[2] + dz

  if (nextX >= 0 && nextX < store.mazeSize && nextZ >= 0 && nextZ < store.mazeSize) {
    if (mazeData.value[Math.floor(nextX)][Math.floor(nextZ)] === 0) {
      ballPos.value = [nextX, 0, nextZ]
      if (nextX === store.mazeSize - 1 && Math.floor(nextZ) === store.mazeSize - 2) {
        store.win()
      }
    }
  }
}

function openSettings() {
  playClick()
  settings.toggleHelp()
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-maze-bg overflow-hidden font-sans dark:bg-slate-950">
    <SettingsPanel />

    <div class="absolute inset-0 z-0">
      <TresCanvas shadows alpha>
        <TresPerspectiveCamera :position="[store.mazeSize/2, 20, store.mazeSize]" :look-at="[store.mazeSize/2, 0, store.mazeSize/2]" />
        <OrbitControls :enable-zoom="true" />

        <Stars :radius="100" :count="3000" />
        <TresAmbientLight :intensity="0.4" />
        <TresDirectionalLight :position="[10, 10, 10]" :intensity="1" cast-shadow />

        <TresGroup>
           <template v-for="(row, i) in mazeData" :key="i">
              <template v-for="(cell, j) in row" :key="j">
                 <TresMesh v-if="cell === 1" :position="[i, 0.5, j]">
                    <TresBoxGeometry :args="[1, 1.2, 1]" />
                    <TresMeshStandardMaterial color="#1e1b4b" :metalness="0.5" :roughness="0.2" />
                 </TresMesh>
              </template>
           </template>
        </TresGroup>

        <TresMesh :position="[store.mazeSize - 1, 0.1, store.mazeSize - 2]">
           <TresBoxGeometry :args="[1, 0.2, 1]" />
           <TresMeshStandardMaterial color="#10b981" :emissiveIntensity="2" />
        </TresMesh>

        <TresMesh :position="ballPos" cast-shadow>
           <TresSphereGeometry :args="[0.3, 32, 32]" />
           <TresMeshStandardMaterial color="#00f3ff" :emissiveIntensity="1" />
        </TresMesh>

        <TresMesh :position="[store.mazeSize / 2, -0.1, store.mazeSize / 2]" :rotation="[-Math.PI / 2, 0, 0]">
           <TresPlaneGeometry :args="[store.mazeSize + 2, store.mazeSize + 2]" />
           <TresMeshStandardMaterial color="#050510" />
        </TresMesh>
      </TresCanvas>
    </div>

    <div class="relative z-10 h-full flex flex-col pointer-events-none p-6 md:p-10">
       <header class="flex justify-between items-start gap-4 flex-wrap">
          <div class="glass-panel p-4 md:p-6 flex items-center space-x-4 md:space-x-6">
             <div class="space-y-1">
                <span class="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-500">Level</span>
                <div class="flex items-center space-x-2 md:space-x-3">
                   <h1 class="text-2xl md:text-3xl font-display font-black text-white">{{ String(store.level).padStart(2, '0') }}</h1>
                </div>
             </div>
             <div class="h-8 md:h-10 w-px bg-white/10"></div>
             <div class="flex flex-col">
                <span class="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Size</span>
                <span class="text-sm md:text-base font-bold text-white tracking-tighter">{{ store.mazeSize }}x{{ store.mazeSize }}</span>
             </div>
          </div>

          <div class="glass-panel p-4 md:p-6 flex items-center space-x-4 text-white">
             <Trophy :size="18" class="text-amber-500" />
             <div class="flex flex-col">
                <span class="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Best</span>
                <span class="text-sm font-black">{{ store.bestTime >= 999999 ? '--:--' : formatTime(store.bestTime) }}</span>
             </div>
          </div>

          <button
            @click="openSettings"
            class="glass-panel p-4 text-white hover:bg-white/10 transition-colors pointer-events-auto"
            aria-label="Open settings"
          >
            <Settings :size="20" />
          </button>
       </header>

       <main class="flex-1 flex items-center justify-center">
          <div v-if="store.status === 'idle'" class="glass-panel p-8 md:p-12 text-center space-y-6 pointer-events-auto max-w-sm">
             <div class="space-y-2">
                <h2 class="text-3xl md:text-4xl font-display font-black uppercase text-white tracking-tighter leading-none">Quantum<br/>Labyrinth</h2>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">3D Maze Escape</p>
             </div>
             <button
               @click="store.startLevel()"
               class="w-full flex items-center justify-center space-x-2 bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-maze-neon transition-all pointer-events-auto"
             >
               <Play :size="18" />
               <span>Start</span>
             </button>
          </div>

          <div v-if="store.status === 'victory'" class="glass-panel p-8 md:p-12 text-center space-y-6 pointer-events-auto border-emerald-500/50 bg-emerald-950/20">
             <Trophy :size="48" md:size="64" class="text-emerald-500 mx-auto animate-pulse" />
             <div class="space-y-2 text-white">
                <h2 class="text-4xl md:text-5xl font-display font-black uppercase text-emerald-500">Victory!</h2>
                <p class="text-xs font-black uppercase tracking-widest text-white">Time: {{ formatTime(store.time) }}</p>
             </div>
             <div class="flex flex-col sm:flex-row gap-3">
                <button
                  @click="store.nextLevel()"
                  class="flex-1 flex items-center justify-center space-x-2 bg-emerald-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 pointer-events-auto"
                >
                  <span>Next Level</span>
                  <RotateCcw :size="16" />
                </button>
             </div>
          </div>

          <div v-if="store.status === 'playing'" class="glass-panel p-4 flex items-center space-x-4 text-slate-400 pointer-events-auto">
             <span class="text-lg font-mono text-white">{{ formatTime(store.time) }}</span>
             <div class="h-6 w-px bg-white/10"></div>
             <div class="flex items-center space-x-2">
                <Maximize2 :size="14" />
                <span class="text-xs font-bold uppercase tracking-widest">WASD / Arrows</span>
             </div>
          </div>
       </main>

       <footer class="flex justify-between items-end">
          <div class="flex items-center space-x-4 md:space-x-6 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-slate-500">
             <a href="https://github.com/mk-knight23/34-Astray-Maze-Puzzle" target="_blank" rel="noopener noreferrer" class="hover:text-white pointer-events-auto transition-colors flex items-center space-x-2">
               <Github :size="14" md:size="16" />
               <span class="hidden sm:inline">Source Code</span>
             </a>
          </div>
          <div class="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
             Press <kbd class="px-2 py-1 bg-white/10 rounded mx-1">H</kbd> for Help
          </div>
       </footer>
    </div>
  </div>
</template>
