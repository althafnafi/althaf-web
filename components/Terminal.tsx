"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { executeCommand } from "@/lib/commands";
import { pathToString } from "@/lib/filesystem";
import { getCompletions } from "@/lib/autocomplete";
import TerminalLine from "./TerminalLine";

type Line = {
  id: number;
  type: "input" | "output" | "boot";
  content: string;
  outputType?: "output" | "error" | "success" | "navigate" | "game";
  path?: string;
};

const BOOT_LINES = [
  "althaf.dev — personal terminal v1.0.0",
  "Type 'help' to see available commands.",
  "",
];

const BOOT_DELAY = 30;
const LINE_DELAY = 150;

interface Props {
  onMinimize: () => void;
  onSnakeCommand: () => void;
}

export default function Terminal({ onMinimize, onSnakeCommand }: Props) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booting, setBooting] = useState(true);
  const [confirming, setConfirming] = useState<null | { prompt: string; onConfirm: () => void }>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Boot sequence
  useEffect(() => {
    let cancelled = false;
    let id = 0;

    async function runBoot() {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, i === 0 ? 200 : LINE_DELAY));
        if (cancelled) return;

        const line = BOOT_LINES[i];
        if (i === 0) {
          for (let j = 0; j <= line.length; j++) {
            if (cancelled) return;
            setLines([{
              id: id++,
              type: "boot",
              content: line.slice(0, j) + (j < line.length ? "█" : ""),
            }]);
            await new Promise((r) => setTimeout(r, BOOT_DELAY));
          }
        } else {
          setLines((prev) => [
            ...prev.filter((l) => !l.content.endsWith("█")),
            { id: id++, type: "boot", content: line },
          ]);
        }
      }
      setBooting(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }

    runBoot();
    return () => { cancelled = true; };
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, input]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      const cmd = input.trim();
      const pathStr = pathToString(currentPath);

      const inputLine: Line = {
        id: Date.now(),
        type: "input",
        content: cmd,
        path: pathStr,
      };

      // Handle y/n confirmation responses
      if (confirming) {
        const answer = cmd.toLowerCase();
        setConfirming(null);
        if (answer === "y" || answer === "yes") {
          setLines((prev) => [...prev, inputLine, {
            id: Date.now() + 1, type: "output", content: "Opening resume.pdf...", outputType: "success",
          }]);
          confirming.onConfirm();
        } else {
          setLines((prev) => [...prev, inputLine, {
            id: Date.now() + 1, type: "output", content: "Cancelled.", outputType: "output",
          }]);
        }
        setHistory((h) => [cmd, ...h.slice(0, 99)]);
        setHistoryIndex(-1);
        setInput("");
        return;
      }

      // Intercept resume.pdf to show y/n confirmation
      if (/^cat\s+(.+\/)?resume\.pdf$/.test(cmd)) {
        setLines((prev) => [...prev, inputLine, {
          id: Date.now() + 1, type: "output", content: "Open resume.pdf in a new tab? [y/n]", outputType: "output",
        }]);
        setConfirming({ prompt: "Open resume.pdf in a new tab? [y/n]", onConfirm: () => window.open("/resume.pdf", "_blank") });
        setHistory((h) => [cmd, ...h.slice(0, 99)]);
        setHistoryIndex(-1);
        setInput("");
        return;
      }

      if (cmd === "clear") {
        setLines([]);
        setInput("");
        setHistory((h) => [cmd, ...h]);
        setHistoryIndex(-1);
        return;
      }

      const result = executeCommand(cmd, currentPath);

      const outputLines: Line[] = result.output
        .filter((o) => o.type !== "game")
        .map((o, i) => ({
          id: Date.now() + i + 1,
          type: "output" as const,
          content: o.text,
          outputType: o.type,
        }));

      setLines((prev) => [...prev, inputLine, ...outputLines]);
      setHistory((h) => [cmd, ...h.slice(0, 99)]);
      setHistoryIndex(-1);
      setInput("");

      if (result.newPath !== undefined) setCurrentPath(result.newPath);

      const navOutput = result.output.find((o) => o.navigateTo);
      if (navOutput?.navigateTo) {
        setTimeout(() => router.push(navOutput.navigateTo!), 400);
      }

      if (result.output.some((o) => o.type === "game")) {
        setTimeout(onSnakeCommand, 200);
      }
    },
    [input, currentPath, router, onSnakeCommand]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(next);
        setInput(history[next] ?? "");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = historyIndex - 1;
        if (next < 0) { setHistoryIndex(-1); setInput(""); }
        else { setHistoryIndex(next); setInput(history[next] ?? ""); }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const { completed, options } = getCompletions(input, currentPath);
        if (options.length > 1) {
          const pathStr = pathToString(currentPath);
          setLines((prev) => [
            ...prev,
            { id: Date.now(), type: "input", content: input, path: pathStr },
            { id: Date.now() + 1, type: "output", content: options.join("  "), outputType: "output" },
          ]);
        }
        if (completed !== input) setInput(completed);
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setLines([]);
      } else if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        const pathStr = pathToString(currentPath);
        setLines((prev) => [
          ...prev,
          { id: Date.now(), type: "input", content: input + "^C", path: pathStr },
        ]);
        setInput("");
      }
    },
    [historyIndex, history, input, currentPath]
  );

  return (
    <div
      className="w-full max-w-5xl mx-auto h-[80vh] flex flex-col rounded-lg overflow-hidden border border-gray-700 shadow-2xl shadow-black/80 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* macOS window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1c2128] border-b border-gray-700 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="w-3 h-3 rounded-full bg-red-500 opacity-80 hover:opacity-100 transition-opacity"
          title="close"
        />
        <button
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          className="w-3 h-3 rounded-full bg-yellow-500 opacity-80 hover:opacity-100 transition-opacity"
          title="minimize"
        />
        <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
        <span className="ml-3 text-gray-400 text-base font-mono">
          althaf@althaf.dev: {pathToString(currentPath)}
        </span>
      </div>

      {/* tmux top status bar */}
      <div className="flex items-center bg-[#1a2e1f] text-green-400 text-base font-mono px-0 shrink-0 select-none">
        <span className="bg-[#0d1117] text-green-400 px-3 py-0.5">[althaf.dev]</span>
        <span className="bg-[#0f3a1a] text-green-400 px-3 py-0.5 font-bold border-r border-green-400/20">0:terminal*</span>
        <Link href="/projects" className="px-3 py-0.5 hover:bg-[#0f3a1a] transition-colors border-r border-green-400/20">1:projects</Link>
        <Link href="/blog"     className="px-3 py-0.5 hover:bg-[#0f3a1a] transition-colors border-r border-green-400/20">2:blog</Link>
        <Link href="/about"    className="px-3 py-0.5 hover:bg-[#0f3a1a] transition-colors border-r border-green-400/20">3:about</Link>
        <Link href="/contact"  className="px-3 py-0.5 hover:bg-[#0f3a1a] transition-colors border-r border-green-400/20">4:contact</Link>
        <Link href="/work"     className="px-3 py-0.5 hover:bg-[#0f3a1a] transition-colors">5:work</Link>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-[#0d1117]">
        {lines.map((line) => (
          <TerminalLine key={line.id} line={line} />
        ))}

        {!booting && (
          <form onSubmit={handleSubmit} className="flex items-center gap-1 font-mono text-base">
            <span className="shrink-0">
              <span className="text-blue-400">althaf</span>
              <span className="text-gray-500">@</span>
              <span className="text-purple-400">althaf.dev</span>
              <span className="text-gray-500">:</span>
              <span className="text-yellow-400">{pathToString(currentPath)}</span>
              <span className="text-green-400">$</span>
            </span>
            <div className="relative flex-1 ml-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white outline-none caret-transparent font-mono text-base"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="terminal input"
              />
              <span
                className="absolute top-0 bottom-0 w-[0.6em] bg-green-400 opacity-80 cursor-blink pointer-events-none"
                style={{ left: `${input.length}ch` }}
              />
            </div>
          </form>
        )}

        <div ref={bottomRef} />
      </div>

      {/* tmux bottom status bar */}
      <TmuxStatusBar path={pathToString(currentPath)} />
    </div>
  );
}

function TmuxStatusBar({ path }: { path: string }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
      setDate(now.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between bg-[#1a2e1f] text-green-400 text-base font-mono px-0 shrink-0 select-none">
      <div className="flex items-center">
        <span className="bg-[#0d1117] text-green-400 px-3 py-0.5">althaf.dev</span>
        <span className="bg-[#0f3a1a] text-green-400 px-3 py-0.5 border-x border-green-400/20"> {path} </span>
      </div>
      <div className="flex items-center">
        <span className="bg-[#0f3a1a] text-green-400 px-3 py-0.5 border-x border-green-400/20">{date}</span>
        <span className="bg-[#0d1117] text-green-400 px-3 py-0.5">{time}</span>
      </div>
    </div>
  );
}
