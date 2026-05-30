'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface GameState {
  carX: number;
  carY: number;
  carAngle: number;
  speed: number;
  score: number;
  time: number;
  gameOver: boolean;
  obstacles: Array<{ x: number; y: number; size: number }>;
}

export default function CarGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    carX: 400,
    carY: 500,
    carAngle: 0,
    speed: 0,
    score: 0,
    time: 0,
    gameOver: false,
    obstacles: [],
  });

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    gameLoopRef.current = setInterval(() => {
      setGameState((prev) => {
        if (prev.gameOver) return prev;

        let newState = { ...prev };

        // Controls
        if (keysPressed.current['arrowleft'] || keysPressed.current['a']) {
          newState.carAngle -= 5;
        }
        if (keysPressed.current['arrowright'] || keysPressed.current['d']) {
          newState.carAngle += 5;
        }
        if (keysPressed.current['arrowup'] || keysPressed.current['w']) {
          newState.speed = Math.min(newState.speed + 0.5, 8);
        } else {
          newState.speed *= 0.95;
        }

        // Update position
        newState.carX += Math.sin((newState.carAngle * Math.PI) / 180) * newState.speed;
        newState.carY -= Math.cos((newState.carAngle * Math.PI) / 180) * newState.speed;

        // Bounds
        newState.carX = Math.max(20, Math.min(780, newState.carX));
        newState.carY = Math.max(20, Math.min(580, newState.carY));

        // Spawn obstacles
        if (Math.random() < 0.02) {
          newState.obstacles.push({
            x: Math.random() * 800,
            y: -20,
            size: 40,
          });
        }

        // Move obstacles
        newState.obstacles = newState.obstacles
          .map((obs) => ({ ...obs, y: obs.y + 3 }))
          .filter((obs) => obs.y < 600);

        // Collision detection
        newState.obstacles.forEach((obs) => {
          const dist = Math.hypot(newState.carX - obs.x, newState.carY - obs.y);
          if (dist < 30) {
            newState.gameOver = true;
          }
        });

        newState.score += Math.floor(newState.speed);
        newState.time += 0.016;

        return newState;
      });
    }, 1000 / 60);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 800, 600);

    // Draw road lines
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 600);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw obstacles
    ctx.fillStyle = '#e74c3c';
    gameState.obstacles.forEach((obs) => {
      ctx.fillRect(obs.x - obs.size / 2, obs.y - obs.size / 2, obs.size, obs.size);
    });

    // Draw car
    ctx.save();
    ctx.translate(gameState.carX, gameState.carY);
    ctx.rotate((gameState.carAngle * Math.PI) / 180);
    ctx.fillStyle = '#3498db';
    ctx.fillRect(-15, -20, 30, 40);
    ctx.fillStyle = '#2980b9';
    ctx.fillRect(-10, -15, 8, 15);
    ctx.fillRect(2, -15, 8, 15);
    ctx.restore();

    // UI
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Score: ${Math.floor(gameState.score)}`, 10, 30);
    ctx.fillText(`Time: ${gameState.time.toFixed(1)}s`, 10, 60);
    ctx.fillText(`Speed: ${gameState.speed.toFixed(1)}`, 10, 90);

    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', 400, 250);
      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${Math.floor(gameState.score)}`, 400, 310);
      ctx.fillText(`Time: ${gameState.time.toFixed(1)}s`, 400, 350);
    }
  }, [gameState]);

  const restart = () => {
    setGameState({
      carX: 400,
      carY: 500,
      carAngle: 0,
      speed: 0,
      score: 0,
      time: 0,
      gameOver: false,
      obstacles: [],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <div className="mb-4">
        <Link href="/games" className="text-blue-400 hover:text-blue-300 mb-2 inline-block">
          ← Back to Games
        </Link>
        <h1 className="text-4xl font-bold text-center mb-2">🚗 Car Game</h1>
        <p className="text-gray-400 text-center">Avoid obstacles! Arrow keys or WASD to control.</p>
      </div>

      <div className="border-4 border-blue-600 rounded-lg overflow-hidden shadow-lg mb-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="block"
        />
      </div>

      {gameState.gameOver && (
        <div className="mt-6">
          <button
            onClick={restart}
            className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded font-bold text-lg"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="mt-6 text-gray-400 text-sm max-w-2xl">
        <p>🎮 Controls: Arrow keys or WASD to drive. Avoid red obstacles. Build up your score by driving continuously!</p>
      </div>
    </div>
  );
}
