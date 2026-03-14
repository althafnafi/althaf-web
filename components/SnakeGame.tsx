"use client";

import { useEffect, useRef } from "react";

const CELL = 20;
const SPEED = 115;
const NUM_SNAKES = 10;    // 1 player + 9 AI
const TURN_CHANCE = 0.07;

type Pt = { x: number; y: number };
type Dir = { x: number; y: number };

interface Snake {
  segs: Pt[];
  dir: Dir;
  nextDir: Dir;
  isPlayer: boolean;
  targetLen: number;
}

interface Props {
  onExit: () => void;
}

export default function SnakeGame({ onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const state = useRef({
    snakes: [] as Snake[],
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

    const DIRS: Dir[] = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];

    function initSnakes() {
      s.snakes = [];
      const cx = Math.floor(s.cols / 2);
      const cy = Math.floor(s.rows / 2);

      // Player — center, going right, length 10
      const playerSegs: Pt[] = [];
      for (let i = 0; i < 10; i++) playerSegs.push({ x: (cx - i + s.cols) % s.cols, y: cy });
      s.snakes.push({ segs: playerSegs, dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, isPlayer: true, targetLen: 10 });

      // AI snakes — random positions and directions, length 8–16
      for (let n = 1; n < NUM_SNAKES; n++) {
        const len = 8 + Math.floor(Math.random() * 9);
        const d = DIRS[Math.floor(Math.random() * DIRS.length)];
        // Spread across screen, avoid center cluster
        const sx = Math.floor(Math.random() * s.cols);
        const sy = Math.floor(Math.random() * s.rows);
        const segs: Pt[] = [];
        for (let i = 0; i < len; i++) {
          segs.push({
            x: ((sx - d.x * i) + s.cols * 10) % s.cols,
            y: ((sy - d.y * i) + s.rows * 10) % s.rows,
          });
        }
        s.snakes.push({ segs, dir: { ...d }, nextDir: { ...d }, isPlayer: false, targetLen: len });
      }
    }

    function spawnFood() {
      const occupied = new Set<string>();
      for (const sn of s.snakes) for (const p of sn.segs) occupied.add(`${p.x},${p.y}`);
      let fx: number, fy: number;
      do {
        fx = Math.floor(Math.random() * s.cols);
        fy = Math.floor(Math.random() * s.rows);
      } while (occupied.has(`${fx},${fy}`));
      s.food = { x: fx, y: fy };
    }

    initSnakes();
    spawnFood();
    s.score = 0;
    s.over = false;

    function stepSnake(sn: Snake) {
      if (sn.isPlayer) {
        sn.dir = { ...sn.nextDir };
      } else {
        // AI: random turn
        if (Math.random() < TURN_CHANCE) {
          if (Math.random() < 0.5) { const t = sn.dir.x; sn.dir = { x: -sn.dir.y, y: t }; }
          else                      { const t = sn.dir.x; sn.dir = { x: sn.dir.y, y: -t }; }
          sn.nextDir = { ...sn.dir };
        }
      }

      const head = sn.segs[0];
      const next: Pt = {
        x: (head.x + sn.dir.x + s.cols) % s.cols,
        y: (head.y + sn.dir.y + s.rows) % s.rows,
      };

      // Collision detection — player only
      if (sn.isPlayer) {
        for (const other of s.snakes) {
          const body = other.isPlayer ? other.segs.slice(1) : other.segs;
          if (body.some((p) => p.x === next.x && p.y === next.y)) {
            s.over = true;
            return;
          }
        }
      }

      sn.segs.unshift(next);

      if (sn.isPlayer && next.x === s.food.x && next.y === s.food.y) {
        s.score += 10;
        sn.targetLen++;
        spawnFood();
      }

      while (sn.segs.length > sn.targetLen) sn.segs.pop();
    }

    function drawGrid() {
      const { width, height } = canvas!;
      ctx.strokeStyle = "rgba(255,255,255,0.02)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= s.cols; x++) {
        ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, height); ctx.stroke();
      }
      for (let y = 0; y <= s.rows; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(width, y * CELL); ctx.stroke();
      }
    }

    function drawAISnake(sn: Snake) {
      sn.segs.forEach((seg, i) => {
        const alpha = Math.max(0.06, 0.22 - i * 0.012);
        ctx.fillStyle = `rgba(74,222,128,${alpha})`;
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      });
    }

    function drawPlayerSnake(sn: Snake) {
      sn.segs.forEach((seg, i) => {
        const isHead = i === 0;
        if (isHead) {
          // Glow
          ctx.shadowBlur = 14;
          ctx.shadowColor = "rgba(255,255,255,0.8)";
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.shadowBlur = 0;
          const alpha = Math.max(0.3, 1 - i * 0.025);
          ctx.fillStyle = `rgba(74,222,128,${alpha})`;
        }
        ctx.beginPath();
        ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, isHead ? 5 : 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // "YOU" indicator above (or below) the head
      const head = sn.segs[0];
      const hx = head.x * CELL + CELL / 2;
      const hy = head.y * CELL;
      const above = head.y > 2;
      const labelY = above ? hy - 5 : hy + CELL + 16;

      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText("YOU", hx, labelY);

      // Ring around head
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.strokeRect(head.x * CELL, head.y * CELL, CELL, CELL);
      ctx.textAlign = "left";
    }

    function drawHUD() {
      const { width, height } = canvas!;
      // Score — bigger than terminal text
      ctx.font = "bold 24px monospace";
      ctx.fillStyle = "rgba(74,222,128,0.95)";
      ctx.textAlign = "left";
      ctx.fillText(`score: ${s.score}`, 14, 32);

      // Exit hint
      ctx.font = "18px monospace";
      ctx.fillStyle = "rgba(74,222,128,0.4)";
      ctx.textAlign = "right";
      ctx.fillText("ctrl+c — exit", width - 14, 32);
      ctx.textAlign = "left";
    }

    function draw() {
      const { width, height } = canvas!;
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, width, height);
      drawGrid();

      // Food
      ctx.fillStyle = "#f87171";
      ctx.beginPath();
      ctx.roundRect(s.food.x * CELL + 3, s.food.y * CELL + 3, CELL - 6, CELL - 6, 4);
      ctx.fill();

      // AI snakes (behind player)
      for (const sn of s.snakes) if (!sn.isPlayer) drawAISnake(sn);

      // Player snake (in front)
      const player = s.snakes.find((sn) => sn.isPlayer);
      if (player) drawPlayerSnake(player);

      drawHUD();
    }

    function drawOver() {
      draw();
      const { width, height } = canvas!;
      ctx.fillStyle = "rgba(13,17,23,0.85)";
      ctx.fillRect(0, 0, width, height);

      ctx.textAlign = "center";
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 36px monospace";
      ctx.fillText("game over", width / 2, height / 2 - 30);

      ctx.font = "22px monospace";
      ctx.fillText(`score: ${s.score}`, width / 2, height / 2 + 10);

      ctx.fillStyle = "rgba(74,222,128,0.5)";
      ctx.font = "18px monospace";
      ctx.fillText("ctrl+c — back to terminal", width / 2, height / 2 + 46);
      ctx.textAlign = "left";
    }

    function tick() {
      if (s.over) return;
      for (const sn of s.snakes) stepSnake(sn);
      if (s.over) { drawOver(); return; }
      draw();
    }

    draw();
    const id = setInterval(tick, SPEED);

    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "c") { e.preventDefault(); onExit(); return; }
      if (s.over) return;
      e.preventDefault();
      const player = s.snakes.find((sn) => sn.isPlayer);
      if (!player) return;
      const d = player.dir;
      if (e.key === "ArrowUp"    && d.y !== 1)  player.nextDir = { x: 0,  y: -1 };
      if (e.key === "ArrowDown"  && d.y !== -1) player.nextDir = { x: 0,  y: 1  };
      if (e.key === "ArrowLeft"  && d.x !== 1)  player.nextDir = { x: -1, y: 0  };
      if (e.key === "ArrowRight" && d.x !== -1) player.nextDir = { x: 1,  y: 0  };
    }

    window.addEventListener("keydown", handleKey);
    canvas.focus();

    return () => { clearInterval(id); window.removeEventListener("keydown", handleKey); };
  }, [onExit]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="block w-full h-full" tabIndex={0} />
    </div>
  );
}
