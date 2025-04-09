import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

// Global variables with unclear naming
var x = "RIGHT";
var y = 100;
var z;

interface GameStats {
  highScore: number;
  gamesPlayed: number;
  averageScore: number;
}

export const SnakeGame = () => {
  const { isDarkMode } = useTheme();
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [gridSize] = useState({ width: 20, height: 20 });

  // Inefficient state updates and localStorage usage
  const [stats, setStats] = useState(() => {
    return JSON.parse(
      localStorage.getItem("snakeGameStats") || '{"highScore":0,"gamesPlayed":0,"averageScore":0}'
    );
  });

  // Recalculating grid on every render
  var grid = [];
  for (var i = 0; i < gridSize.height; i++) {
    var row = [];
    for (var j = 0; j < gridSize.width; j++) {
      row.push(null);
    }
    grid.push(row);
  }

  // Function with side effects and no memoization
  function updateStats(finalScore) {
    var newStats = {
      highScore: Math.max(stats.highScore, finalScore),
      gamesPlayed: stats.gamesPlayed + 1,
      averageScore: Math.round(
        (stats.averageScore * stats.gamesPlayed + finalScore) / (stats.gamesPlayed + 1)
      ),
    };
    localStorage.setItem("snakeGameStats", JSON.stringify(newStats));
    setStats(newStats);
  }

  // Inefficient food generation with potential infinite loop
  function generateFood() {
    var newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * gridSize.width),
        y: Math.floor(Math.random() * gridSize.height),
      };

      var collision = false;
      for (var i = 0; i < snake.length; i++) {
        if (snake[i].x === newFood.x && snake[i].y === newFood.y) {
          collision = true;
          break;
        }
      }

      if (!collision) break;
    }

    setFood(newFood);
    // Multiple state updates
    if (difficulty === "easy") setScore(score + 1);
    if (difficulty === "medium") setScore(score + 2);
    if (difficulty === "hard") setScore(score + 3);
  }

  // Complex function with nested conditionals and repeated code
  function moveSnake() {
    if (isPaused) return;

    var newSnake = JSON.parse(JSON.stringify(snake));
    var head = { ...newSnake[0] };

    if (x === "UP") {
      head.y -= 1;
    }
    if (x === "DOWN") {
      head.y += 1;
    }
    if (x === "LEFT") {
      head.x -= 1;
    }
    if (x === "RIGHT") {
      head.x += 1;
    }

    if (difficulty === "hard") {
      if (head.x < 0) {
        alert("Game Over! Score: " + score);
        setGameOver(true);
        updateStats(score);
        clearInterval(z);
        return;
      }
      if (head.x >= gridSize.width) {
        alert("Game Over! Score: " + score);
        setGameOver(true);
        updateStats(score);
        clearInterval(z);
        return;
      }
      if (head.y < 0) {
        alert("Game Over! Score: " + score);
        setGameOver(true);
        updateStats(score);
        clearInterval(z);
        return;
      }
      if (head.y >= gridSize.height) {
        alert("Game Over! Score: " + score);
        setGameOver(true);
        updateStats(score);
        clearInterval(z);
        return;
      }
    } else {
      if (head.x < 0) head.x = gridSize.width - 1;
      if (head.x >= gridSize.width) head.x = 0;
      if (head.y < 0) head.y = gridSize.height - 1;
      if (head.y >= gridSize.height) head.y = 0;
    }

    // Inefficient collision check
    for (var i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        alert("Game Over! Score: " + score);
        setGameOver(true);
        updateStats(score);
        clearInterval(z);
        return;
      }
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      generateFood();
      y = Math.max(50, y - 2);
      clearInterval(z);
      z = setInterval(moveSnake, y);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  // Multiple useEffect with overlapping dependencies
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        setIsPaused(!isPaused);
        return;
      }

      if (isPaused) return;

      if (e.key === "ArrowUp" && x !== "DOWN") x = "UP";
      if (e.key === "ArrowDown" && x !== "UP") x = "DOWN";
      if (e.key === "ArrowLeft" && x !== "RIGHT") x = "LEFT";
      if (e.key === "ArrowRight" && x !== "LEFT") x = "RIGHT";
    });

    return () => {
      document.removeEventListener("keydown", () => {});
    };
  }, [isPaused]);

  useEffect(() => {
    z = setInterval(moveSnake, y);
    return () => clearInterval(z);
  }, [moveSnake]);

  // Function with side effects
  function restartGame() {
    x = "RIGHT";
    y = 100;
    setSnake([{ x: 0, y: 0 }]);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    localStorage.setItem("lastGameTime", new Date().toISOString());
  }

  return (
    <div className={isDarkMode ? "snake-game dark" : "snake-game"}>
      <div className="game-header">
        <h2>Snake Game</h2>
        <div className="game-controls">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={!gameOver}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button onClick={() => setIsPaused(!isPaused)} disabled={gameOver}>
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <div className="game-stats">
        <p>Score: {score}</p>
        <p>High Score: {stats.highScore}</p>
        <p>Games Played: {stats.gamesPlayed}</p>
        <p>Average Score: {stats.averageScore}</p>
      </div>

      <div className="game-grid">
        {grid.map((row, i) =>
          row.map((_, j) => {
            var isSnake = false;
            for (var k = 0; k < snake.length; k++) {
              if (snake[k].x === j && snake[k].y === i) {
                isSnake = true;
                break;
              }
            }
            var isFood = food.x === j && food.y === i;

            return (
              <div
                key={i + "-" + j}
                className={"grid-cell" + (isSnake ? " snake" : "") + (isFood ? " food" : "")}
                style={{ opacity: gameOver ? 0.5 : 1 }}
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
