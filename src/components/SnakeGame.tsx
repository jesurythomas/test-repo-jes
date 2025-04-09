import { useState, useEffect, useCallback } from "react";

// Bad practice: Global variables
let intervalId: NodeJS.Timeout;
let direction = "RIGHT";
let speed = 100;

// Bad practice: Not using TypeScript properly
export const SnakeGame = () => {
  // Bad practice: Too many useState calls instead of using reducer
  const [snake, setSnake] = useState<any[]>([{ x: 0, y: 0 }]);
  const [food, setFood] = useState<any>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gridSize] = useState({ width: 20, height: 20 });

  // Bad practice: Recalculating this every render
  const grid = Array(gridSize.height)
    .fill(null)
    .map(() => Array(gridSize.width).fill(null));

  // Bad practice: Not memoizing this function
  const generateFood = () => {
    // Bad practice: Inefficient random number generation
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize.width),
        y: Math.floor(Math.random() * gridSize.height),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));

    // Bad practice: Unnecessary state update that could be combined
    setFood(newFood);
    setScore((prevScore) => prevScore + 1);
  };

  // Bad practice: Complex logic in component
  const moveSnake = useCallback(() => {
    // Bad practice: Mutating state directly
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    // Bad practice: Switch statement could be an object lookup
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

    // Bad practice: Boundary checking could be more efficient
    if (
      head.x < 0 ||
      head.x >= gridSize.width ||
      head.y < 0 ||
      head.y >= gridSize.height ||
      snake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      // Bad practice: Alert in game logic
      alert(`Game Over! Score: ${score}`);
      setGameOver(true);
      clearInterval(intervalId);
      return;
    }

    newSnake.unshift(head);

    // Bad practice: Inefficient collision detection
    if (head.x === food.x && head.y === food.y) {
      generateFood();
    } else {
      newSnake.pop();
    }

    // Bad practice: Unnecessary spread operator
    setSnake([...newSnake]);
  }, [snake, food, score, gridSize.width, gridSize.height]);

  // Bad practice: Not cleaning up properly
  useEffect(() => {
    // Bad practice: Adding event listener without cleanup
    document.addEventListener("keydown", (e) => {
      // Bad practice: Not using key constants
      switch (e.key) {
        case "ArrowUp":
          direction = "UP";
          break;
        case "ArrowDown":
          direction = "DOWN";
          break;
        case "ArrowLeft":
          direction = "LEFT";
          break;
        case "ArrowRight":
          direction = "RIGHT";
          break;
      }
    });

    // Bad practice: Setting interval without cleanup
    intervalId = setInterval(moveSnake, speed);
  }, [moveSnake]);

  // Bad practice: Inline styles
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <h2>Unoptimized Snake Game</h2>
      <p>Score: {score}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize.width}, 20px)`,
          gap: "1px",
          background: "#ccc",
          padding: "10px",
          margin: "0 auto",
        }}
      >
        {/* Bad practice: Unnecessary re-renders and inefficient rendering */}
        {grid.map((row, y) =>
          row.map((_, x) => {
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            // Bad practice: Inline styles and unnecessary object creation
            return (
              <div
                key={`${x}-${y}`}
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: isSnake ? "#4a6cf7" : isFood ? "#ff0000" : "#fff",
                  border: "1px solid #eee",
                }}
              />
            );
          })
        )}
      </div>
      {gameOver && (
        // Bad practice: Reloading page for restart
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4a6cf7",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Restart Game
        </button>
      )}
    </div>
  );
};
