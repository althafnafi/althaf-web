"use client";

import { useEffect, useRef } from "react";

const SEG = 14;
const STEP_MS = 110;
const TURN_CHANCE = 0.07;
const LEN = 18;
const NUM_SNAKES = 2;

type Seg = [number, number];
interface BgSnake {
  segs: Seg[];
  dx: number;
  dy: number;
  dead: boolean;
  respawnAt: number;
}

function spawnSnake(w: number, h: number): BgSnake {
  const edge = Math.floor(Math.random() * 4);
  let x: number, y: number, dx: number, dy: number;
  switch (edge) {
    case 0: x = Math.floor(Math.random() * Math.floor(w / SEG)) * SEG; y = -SEG;      dx = 0;  dy = 1;  break;
    case 1: x = Math.floor(Math.random() * Math.floor(w / SEG)) * SEG; y = h + SEG;   dx = 0;  dy = -1; break;
    case 2: x = -SEG;    y = Math.floor(Math.random() * Math.floor(h / SEG)) * SEG;   dx = 1;  dy = 0;  break;
    default:x = w + SEG; y = Math.floor(Math.random() * Math.floor(h / SEG)) * SEG;   dx = -1; dy = 0;  break;
  }
  return { segs: [[x, y]], dx, dy, dead: false, respawnAt: 0 };
}

export default function SnakeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;
    let snakes: BgSnake[] = [];
    let now = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    }

    function stepSnake(s: BgSnake) {
      if (s.dead) return;
      // maybe turn
      if (Math.random() < TURN_CHANCE) {
        if (Math.random() < 0.5) { const t = s.dx; s.dx = -s.dy; s.dy = t; }
        else                      { const t = s.dx; s.dx = s.dy;  s.dy = -t; }
      }
      const [hx, hy] = s.segs[0];
      s.segs.unshift([hx + s.dx * SEG, hy + s.dy * SEG]);
      if (s.segs.length > LEN) s.segs.pop();

      const allOff = s.segs.every(([x, y]) =>
        x < -SEG * 3 || x > w + SEG * 3 || y < -SEG * 3 || y > h + SEG * 3
      );
      if (allOff) {
        s.dead = true;
        s.respawnAt = now + 800 + Math.random() * 1500;
      }
    }

    function drawSnake(s: BgSnake) {
      s.segs.forEach(([x, y], i) => {
        const alpha = ((LEN - i) / LEN) * 0.13;
        ctx.fillStyle = `rgba(74,222,128,${alpha})`;
        ctx.fillRect(x + 1, y + 1, SEG - 2, SEG - 2);
      });
    }

    resize();
    snakes = Array.from({ length: NUM_SNAKES }, (_, i) => {
      const s = spawnSnake(w, h);
      s.respawnAt = i * 600;
      s.dead = true;
      return s;
    });

    window.addEventListener("resize", resize);

    const id = setInterval(() => {
      now += STEP_MS;
      ctx.clearRect(0, 0, w, h);
      for (const s of snakes) {
        if (s.dead && now >= s.respawnAt) {
          Object.assign(s, spawnSnake(w, h));
        }
        stepSnake(s);
        drawSnake(s);
      }
    }, STEP_MS);

    return () => {
      clearInterval(id);
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
