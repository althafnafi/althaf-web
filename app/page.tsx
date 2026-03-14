"use client";

import { useState } from "react";
import Terminal from "@/components/Terminal";
import SnakeBackground from "@/components/SnakeBackground";
import SnakeGame from "@/components/SnakeGame";
import DockIcon from "@/components/DockIcon";

export default function Home() {
  const [minimized, setMinimized] = useState(false);
  const [gameActive, setGameActive] = useState(false);

  const minimize = () => setMinimized(true);
  const startSnake = () => { setMinimized(true); setGameActive(true); };
  const restore = () => { setMinimized(false); setGameActive(false); };

  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-hidden">
      {/* Background layer — paused when snake game is running */}
      <SnakeBackground paused={gameActive} />

      {/* Snake game — full screen, shown when active */}
      {gameActive && (
        <div className="absolute inset-0 z-10">
          <SnakeGame onExit={restore} />
        </div>
      )}

      {/* Terminal window */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 md:p-8 pointer-events-none">
        <div
          className="w-full pointer-events-auto transition-all duration-500 ease-in-out"
          style={{
            transformOrigin: "center bottom",
            transform: minimized ? "scale(0.05) translateY(80vh)" : "scale(1) translateY(0)",
            opacity: minimized ? 0 : 1,
            pointerEvents: minimized ? "none" : "auto",
          }}
        >
          <Terminal
            onMinimize={minimize}
            onSnakeCommand={startSnake}
          />
        </div>
      </div>

      {/* Dock icon — shown when minimized */}
      {minimized && (
        <div className="absolute inset-0 z-30 flex items-end justify-center pb-8 pointer-events-none">
          <DockIcon onClick={restore} gameActive={gameActive} />
        </div>
      )}
    </div>
  );
}
