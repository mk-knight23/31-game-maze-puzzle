# Astray - 3D Maze Puzzle

A modern 3D ball maze puzzle game with procedural maze generation and physics simulation. Navigate the ball through increasingly complex mazes to reach the exit.

## Features

- **3D Graphics** - Built with React Three Fiber for smooth WebGL rendering
- **Physics Simulation** - Realistic ball physics using Rapier physics engine
- **Procedural Mazes** - Unique mazes generated using recursive backtracking algorithm
- **Progressive Difficulty** - Maze size increases with each level
- **4 Difficulty Modes** - Easy, Medium, Hard, and Extreme with different settings
- **Time Tracking** - Track your completion time for each level
- **Best Times** - Personal records saved per level and difficulty
- **Dark/Light Mode** - Toggle between themes
- **Mobile Support** - Touch controls for mobile devices (D-pad)

## Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move Ball | Arrow keys / WASD | D-pad buttons |
| Vim Users | H, J, K, L | - |

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Three Fiber** - React renderer for Three.js
- **@react-three/rapier** - Physics engine bindings
- **@react-three/drei** - Three.js helpers
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management with persistence
- **Framer Motion** - UI animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/mk-knight23/34-Astray-Maze-Puzzle.git

# Navigate to project
cd 34-Astray-Maze-Puzzle

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
34-Astray-Maze-Puzzle/
├── public/
│   ├── ball.png         # Ball texture
│   ├── brick.png        # Wall texture
│   ├── concrete.png     # Ground texture
│   └── favicon.svg      # Site icon
├── src/
│   ├── components/
│   │   ├── GameCanvas.tsx      # 3D game scene
│   │   ├── StartScreen.tsx     # Title screen
│   │   ├── GameHUD.tsx         # Level/timer display
│   │   ├── LevelComplete.tsx   # Victory overlay
│   │   ├── ThemeToggle.tsx     # Theme switcher
│   │   └── MobileControls.tsx  # Touch D-pad
│   ├── hooks/
│   │   └── useKeyboard.ts      # Keyboard input
│   ├── stores/
│   │   └── gameStore.ts        # Zustand state
│   ├── types/
│   │   └── game.ts             # TypeScript types
│   ├── utils/
│   │   └── mazeGenerator.ts    # Maze generation algorithm
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Game Mechanics

### Difficulty Settings

| Level | Start Size | Max Size | Ball Speed |
|-------|------------|----------|------------|
| Easy | 7x7 | 15x15 | Slow |
| Medium | 9x9 | 21x21 | Medium |
| Hard | 11x11 | 27x27 | Fast |
| Extreme | 13x13 | 35x35 | Very Fast |

### Maze Generation

Mazes are procedurally generated using the **recursive backtracking algorithm**:
1. Start with a grid of walls
2. Begin at position (1,1)
3. Randomly carve passages by removing walls
4. Backtrack when no unvisited neighbors exist
5. Create exit at the maze edge

## Deployment

This project includes GitHub Actions workflow for automatic deployment to GitHub Pages.

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to `main` branch to trigger deployment

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Live Demo:** [https://mk-knight23.github.io/34-Astray-Maze-Puzzle/](https://mk-knight23.github.io/34-Astray-Maze-Puzzle/)
