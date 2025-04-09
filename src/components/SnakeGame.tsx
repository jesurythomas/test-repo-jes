import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";

// Bad practice: Global variables
let intervalId: NodeJS.Timeout;
let direction = "RIGHT";
let speed = 100;

interface GameStats {
  highScore: number;
  gamesPlayed: number;
  averageScore: number;
}

export const SnakeGame = () => {
  const { isDarkMode } = useTheme();
  const [snake, setSnake] = useState<any[]>([{ x: 0, y: 0 }]);
  const [food, setFood] = useState<any>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [gridSize] = useState({ width: 20, height: 20 });
  const [gameStats, setGameStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem("snakeGameStats");
    return saved ? JSON.parse(saved) : { highScore: 0, gamesPlayed: 0, averageScore: 0 };
  });

  const grid = Array(gridSize.height)
    .fill(null)
    .map(() => Array(gridSize.width).fill(null));

  const updateGameStats = useCallback((finalScore: number) => {
    setGameStats((prev) => {
      const newStats = {
        highScore: Math.max(prev.highScore, finalScore),
        gamesPlayed: prev.gamesPlayed + 1,
        averageScore: Math.round(
          (prev.averageScore * prev.gamesPlayed + finalScore) / (prev.gamesPlayed + 1)
        ),
      };
      localStorage.setItem("snakeGameStats", JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize.width),
        y: Math.floor(Math.random() * gridSize.height),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));

    setFood(newFood);
    setScore(
      (prevScore) => prevScore + (difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3)
    );
  };

  const moveSnake = useCallback(() => {
    if (isPaused) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }

    // Wall collision based on difficulty
    if (difficulty === "hard") {
      if (
        head.x < 0 ||
        head.x >= gridSize.width ||
        head.y < 0 ||
        head.y >= gridSize.height ||
        snake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        alert(`Game Over! Score: ${score}`);
        setGameOver(true);
        updateGameStats(score);
        clearInterval(intervalId);
        return;
      }
    } else {
      // Wrap around walls for easy/medium
      if (head.x < 0) head.x = gridSize.width - 1;
      if (head.x >= gridSize.width) head.x = 0;
      if (head.y < 0) head.y = gridSize.height - 1;
      if (head.y >= gridSize.height) head.y = 0;

      // Still check self collision
      if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        alert(`Game Over! Score: ${score}`);
        setGameOver(true);
        updateGameStats(score);
        clearInterval(intervalId);
        return;
      }
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      generateFood();
      // Speed up the snake slightly when eating food
      speed = Math.max(50, speed - 2);
      clearInterval(intervalId);
      intervalId = setInterval(moveSnake, speed);
    } else {
      newSnake.pop();
    }

    setSnake([...newSnake]);
  }, [snake, food, score, isPaused, difficulty, gridSize.width, gridSize.height, updateGameStats]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " ") {
        setIsPaused((prev) => !prev);
        return;
      }

      if (isPaused) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") direction = "UP";
          break;
        case "ArrowDown":
          if (direction !== "UP") direction = "DOWN";
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") direction = "LEFT";
          break;
        case "ArrowRight":
          if (direction !== "LEFT") direction = "RIGHT";
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    intervalId = setInterval(moveSnake, speed);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      clearInterval(intervalId);
    };
  }, [moveSnake, isPaused]);

  const restartGame = () => {
    direction = "RIGHT";
    speed = 100;
    setSnake([{ x: 0, y: 0 }]);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className={`snake-game ${isDarkMode ? "dark" : ""}`}>
      <div className="game-header">
        <h2>Snake Game</h2>
        <div className="game-controls">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
            disabled={!gameOver}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button onClick={() => setIsPaused((p) => !p)} disabled={gameOver}>
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <div className="game-stats">
        <p>Score: {score}</p>
        <p>High Score: {gameStats.highScore}</p>
        <p>Games Played: {gameStats.gamesPlayed}</p>
        <p>Average Score: {gameStats.averageScore}</p>
      </div>

      <div className="game-grid">
        {grid.map((row, y) =>
          row.map((_, x) => {
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={`${x}-${y}`}
                className={`grid-cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
              />
            );
          })
        )}
      </div>

      {gameOver && (
        <button className="restart-button" onClick={restartGame}>
          Restart Game
        </button>
      )}

      <div className="game-instructions">
        <h3>How to Play</h3>
        <p>Use arrow keys to control the snake</p>
        <p>Space bar to pause/resume</p>
        <p>Collect food to grow and score points</p>
        <p>{difficulty === "hard" ? "Don't hit the walls!" : "Walls are passable"}</p>
      </div>
    </div>
  );
};
