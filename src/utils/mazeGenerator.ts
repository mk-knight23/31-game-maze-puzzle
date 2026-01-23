/**
 * Generates a square maze using recursive backtracking algorithm
 * Returns a 2D boolean array where true = wall, false = path
 */
export function generateMaze(dimension: number): boolean[][] {
  // Ensure dimension is odd for proper maze generation
  const size = dimension % 2 === 0 ? dimension + 1 : dimension
  
  // Initialize maze with all walls
  const maze: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(true))
  
  // Recursive backtracking
  function carve(x: number, y: number): void {
    maze[x][y] = false
    
    // Directions: [dx, dy]
    const directions: [number, number][] = [
      [-2, 0], // left
      [2, 0],  // right
      [0, -2], // down
      [0, 2],  // up
    ]
    
    // Shuffle directions for randomness
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[directions[i], directions[j]] = [directions[j], directions[i]]
    }
    
    for (const [dx, dy] of directions) {
      const nx = x + dx
      const ny = y + dy
      
      // Check bounds and if cell is unvisited (still a wall)
      if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && maze[nx][ny]) {
        // Carve through the wall between current and next cell
        maze[x + dx / 2][y + dy / 2] = false
        carve(nx, ny)
      }
    }
  }
  
  // Start carving from (1, 1)
  carve(1, 1)
  
  // Create exit at the end
  maze[size - 1][size - 2] = false
  
  return maze
}

/**
 * Get maze walls as array of positions for 3D rendering
 */
export function getMazeWalls(maze: boolean[][]): { x: number; y: number }[] {
  const walls: { x: number; y: number }[] = []
  
  for (let x = 0; x < maze.length; x++) {
    for (let y = 0; y < maze[x].length; y++) {
      if (maze[x][y]) {
        walls.push({ x, y })
      }
    }
  }
  
  return walls
}

/**
 * Check if position is the exit
 */
export function isExit(x: number, y: number, mazeSize: number): boolean {
  const cellX = Math.floor(x + 0.5)
  const cellY = Math.floor(y + 0.5)
  return cellX >= mazeSize && cellY === mazeSize - 2
}
