"use client";

import { useEffect, useRef } from "react";

const SEG = 20;
const STEP_MS = 110;
const TURN_CHANCE = 0.07;
const NUM_SNAKES = 10;

type Seg = [number, number];
interface BgSnake {
  segs: Seg[];
  dx: number;
  dy: number;
  dead: boolean;
  respawnAt: number;
  len: number;
}

function spawnSnake(w: number, h: number): BgSnake {
  const len = 8 + Math.floor(Math.random() * 9);
  const edge = Math.floor(Math.random() * 4);
  let x: number, y: number, dx: number, dy: number;
  switch (edge) {
    case 0: x = Math.floor(Math.random() * Math.floor(w / SEG)) * SEG; y = -SEG;      dx = 0;  dy = 1;  break;
    case 1: x = Math.floor(Math.random() * Math.floor(w / SEG)) * SEG; y = h + SEG;   dx = 0;  dy = -1; break;
    case 2: x = -SEG;    y = Math.floor(Math.random() * Math.floor(h / SEG)) * SEG;   dx = 1;  dy = 0;  break;
    default:x = w + SEG; y = Math.floor(Math.random() * Math.floor(h / SEG)) * SEG;   dx = -1; dy = 0;  break;
  }
  return { segs: [[x, y]], dx, dy, dead: false, respawnAt: 0, len };
}

interface Props { paused?: boolean; }

export default function SnakeBackground({ paused }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;
    let snakes: BgSnake[] = [];
    let lastStep = 0;
    let rafId = 0;
    let elapsed = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    }

    function stepSnake(s: BgSnake) {
      if (s.dead) return;
      if (Math.random() < TURN_CHANCE) {
        if (Math.random() < 0.5) { const t = s.dx; s.dx = -s.dy; s.dy = t; }
        else                      { const t = s.dx; s.dx = s.dy;  s.dy = -t; }
      }
      const [hx, hy] = s.segs[0];
      s.segs.unshift([hx + s.dx * SEG, hy + s.dy * SEG]);
      if (s.segs.length > s.len) s.segs.pop();
      const allOff = s.segs.every(([x, y]) =>
        x < -SEG * 3 || x > w + SEG * 3 || y < -SEG * 3 || y > h + SEG * 3
      );
      if (allOff) { s.dead = true; s.respawnAt = elapsed + 600 + Math.random() * 1200; }
    }

    function drawSnake(s: BgSnake) {
      s.segs.forEach(([x, y], i) => {
        const alpha = ((s.len - i) / s.len) * 0.13;
        ctx.fillStyle = `rgba(74,222,128,${alpha})`;
        ctx.fillRect(x + 1, y + 1, SEG - 2, SEG - 2);
      });
    }

    function loop(now: number) {
      rafId = requestAnimationFrame(loop);
      if (pausedRef.current) return;

      const delta = now - lastStep;
      if (delta < STEP_MS) return;
      lastStep = now;
      elapsed += delta;

      ctx.clearRect(0, 0, w, h);
      for (const s of snakes) {
        if (s.dead && elapsed >= s.respawnAt) Object.assign(s, spawnSnake(w, h));
        stepSnake(s);
        drawSnake(s);
      }
    }

    resize();
    snakes = Array.from({ length: NUM_SNAKES }, (_, i) => {
      const s = spawnSnake(w, h);
      s.respawnAt = i * 300;
      s.dead = true;
      return s;
    });

    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
