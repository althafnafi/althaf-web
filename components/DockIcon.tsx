"use client";

interface Props {
  onClick: () => void;
  gameActive: boolean;
}

export default function DockIcon({ onClick, gameActive }: Props) {
  return (
    <div className="pointer-events-auto flex flex-col items-center gap-1.5 animate-[dockAppear_0.35s_ease_forwards]">
      <button
        onClick={onClick}
        title={gameActive ? "restore terminal (ends snake)" : "restore terminal"}
        className="group relative w-16 h-16 rounded-2xl bg-[#161b22] border border-gray-700 shadow-2xl shadow-black/70 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-150 cursor-pointer"
      >
        {/* Mini terminal preview */}
        <div className="w-10 h-8 rounded bg-[#0d1117] border border-gray-700 flex flex-col overflow-hidden">
          <div className="flex items-center gap-0.5 px-1 py-0.5 bg-[#1c2128]">
            <div className="w-1 h-1 rounded-full bg-red-500/80" />
            <div className="w-1 h-1 rounded-full bg-yellow-500/80" />
            <div className="w-1 h-1 rounded-full bg-green-500/80" />
          </div>
          <div className="px-1 pt-0.5 flex flex-col gap-0.5">
            <div className="h-0.5 w-4 bg-green-400/60 rounded" />
            <div className="h-0.5 w-3 bg-gray-600 rounded" />
          </div>
        </div>

        {/* Snake indicator */}
        {gameActive && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0d1117] animate-pulse" />
        )}
      </button>

      {/* Running dot */}
      <div className="w-1 h-1 rounded-full bg-gray-500" />

      <span className="text-gray-500 text-xs font-mono">
        {gameActive ? "snake" : "terminal"}
      </span>
    </div>
  );
}
