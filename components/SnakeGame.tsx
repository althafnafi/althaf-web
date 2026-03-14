"use client";

import { useEffect, useRef } from "react";

const CELL = 20;
const SPEED = 115;

type Pt = { x: number; y: number };
type Dir = { x: number; y: number };

interface Props {
  onExit: () => void;
}

export default function SnakeGame({ onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // all mutable game state lives in refs so the interval never goes stale
  const state = useRef({
    snake: [] as Pt[],
    dir: { x: 1, y: 0 } as Dir,
    nextDir: { x: 1, y: 0 } as Dir,
    food: { x: 0, y: 0 } as Pt,
    score: 0,
    cols: 0,
    rows: 0,
    over: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth || window.innerWidth;
    canvas.height = container.clientHeight || window.innerHeight;
    const ctx = canvas.getContext("2d")!;

    const s = state.current;
    s.cols = Math.floor(canvas.width / CELL);
    s.rows = Math.floor(canvas.height / CELL);

    function spawnFood() {
      const occupied = new Set(s.snake.map((p) => `${p.x},${p.y}`));
      let fx: number, fy: number;
      do {
        fx = Math.floor(Math.random() * s.cols);
        fy = Math.floor(Math.random() * s.rows);
      } while (occupied.has(`${fx},${fy}`));
      s.food = { x: fx, y: fy };
    }

    // init
    const cx = Math.floor(s.cols / 2);
    const cy = Math.floor(s.rows / 2);
    s.snake = [{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.score = 0;
    s.over = false;
    spawnFood();

    function draw() {
      const { width, height } = canvas!;
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, width, height);

      // subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= s.cols; x++) {
        ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, height); ctx.stroke();
      }
      for (let y = 0; y <= s.rows; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(width, y * CELL); ctx.stroke();
      }

      // food — pulsing red dot
      ctx.fillStyle = "#f87171";
      ctx.beginPath();
      ctx.roundRect(s.food.x * CELL + 3, s.food.y * CELL + 3, CELL - 6, CELL - 6, 3);
      ctx.fill();

      // snake
      s.snake.forEach((seg, i) => {
        const isHead = i === 0;
        const alpha = isHead ? 1 : Math.max(0.25, 1 - i * 0.025);
        ctx.fillStyle = isHead ? "#4ade80" : `rgba(74,222,128,${alpha})`;
        ctx.beginPath();
        ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, isHead ? 4 : 2);
        ctx.fill();
      });

      // hud
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = "rgba(74,222,128,0.9)";
      ctx.textAlign = "left";
      ctx.fillText(`score: ${s.score}`, 10, 18);
      ctx.fillStyle = "rgba(74,222,128,0.35)";
      ctx.font = "12px monospace";
      ctx.textAlign = "right";
      ctx.fillText("ctrl+c — exit", width - 10, 18);
      ctx.textAlign = "left";
    }

    function drawOver() {
      draw();
      const { width, height } = canvas!;
      ctx.fillStyle = "rgba(13,17,23,0.82)";
      ctx.fillRect(0, 0, width, height);

      ctx.textAlign = "center";
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 22px monospace";
      ctx.fillText("game over", width / 2, height / 2 - 24);
      ctx.font = "15px monospace";
      ctx.fillText(`score: ${s.score}`, width / 2, height / 2 + 6);
      ctx.fillStyle = "rgba(74,222,128,0.5)";
      ctx.font = "13px monospace";
      ctx.fillText("ctrl+c — back to terminal", width / 2, height / 2 + 34);
      ctx.textAlign = "left";
    }

    function tick() {
      if (s.over) return;
      s.dir = { ...s.nextDir };
      const head = s.snake[0];
      const next = {
        x: (head.x + s.dir.x + s.cols) % s.cols,
        y: (head.y + s.dir.y + s.rows) % s.rows,
      };
      if (s.snake.some((p) => p.x === next.x && p.y === next.y)) {
        s.over = true;
        drawOver();
        return;
      }
      s.snake.unshift(next);
      if (next.x === s.food.x && next.y === s.food.y) {
        s.score += 10;
        spawnFood();
      } else {
        s.snake.pop();
      }
      draw();
    }

    draw();
    const id = setInterval(tick, SPEED);

    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        onExit();
        return;
      }
      if (s.over) return;
      e.preventDefault();
      const d = s.dir;
      if (e.key === "ArrowUp"    && d.y !== 1)  s.nextDir = { x: 0,  y: -1 };
      if (e.key === "ArrowDown"  && d.y !== -1) s.nextDir = { x: 0,  y: 1  };
      if (e.key === "ArrowLeft"  && d.x !== 1)  s.nextDir = { x: -1, y: 0  };
      if (e.key === "ArrowRight" && d.x !== -1) s.nextDir = { x: 1,  y: 0  };
    }

    window.addEventListener("keydown", handleKey);
    canvas.focus();

    return () => {
      clearInterval(id);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onExit]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="block w-full h-full" tabIndex={0} />
    </div>
  );
}
