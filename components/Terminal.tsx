"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { executeCommand } from "@/lib/commands";
import { pathToString } from "@/lib/filesystem";
import { getCompletions } from "@/lib/autocomplete";
import TerminalLine from "./TerminalLine";

type Line = {
  id: number;
  type: "input" | "output" | "boot";
  content: string;
  outputType?: "output" | "error" | "success" | "navigate";
  path?: string;
};

const BOOT_LINES = [
  "althaf.dev — personal terminal v1.0.0",
  "Type 'help' to see available commands.",
  "",
];

const BOOT_DELAY = 30; // ms per character
const LINE_DELAY = 150; // ms between lines

export default function Terminal() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booting, setBooting] = useState(true);
  const [lineCounter, setLineCounter] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const nextId = useCallback(() => {
    setLineCounter((c) => c + 1);
    return lineCounter;
  }, [lineCounter]);

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
        // type out the first line character by character
        if (i === 0) {
          for (let j = 0; j <= line.length; j++) {
            if (cancelled) return;
            setLines([
              {
                id: id++,
                type: "boot",
                content: line.slice(0, j) + (j < line.length ? "█" : ""),
              },
            ]);
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
    return () => {
      cancelled = true;
    };
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

      // Add input line
      const inputLine: Line = {
        id: Date.now(),
        type: "input",
        content: cmd,
        path: pathStr,
      };

      if (cmd === "clear") {
        setLines([]);
        setInput("");
        setHistory((h) => [cmd, ...h]);
        setHistoryIndex(-1);
        return;
      }

      const result = executeCommand(cmd, currentPath);

      const outputLines: Line[] = result.output.map((o, i) => ({
        id: Date.now() + i + 1,
        type: "output" as const,
        content: o.text,
        outputType: o.type,
      }));

      setLines((prev) => [...prev, inputLine, ...outputLines]);
      setHistory((h) => [cmd, ...h.slice(0, 99)]);
      setHistoryIndex(-1);
      setInput("");

      if (result.newPath !== undefined) {
        setCurrentPath(result.newPath);
      }

      // Handle navigation
      const navOutput = result.output.find((o) => o.navigateTo);
      if (navOutput?.navigateTo) {
        setTimeout(() => router.push(navOutput.navigateTo!), 400);
      }
    },
    [input, currentPath, router]
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
        if (next < 0) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(next);
          setInput(history[next] ?? "");
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const { completed, options } = getCompletions(input, currentPath);
        if (options.length > 1) {
          // Print all options as a new output line, then fill common prefix
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
          {
            id: Date.now(),
            type: "input",
            content: input + "^C",
            path: pathStr,
          },
        ]);
        setInput("");
      }
    },
    [historyIndex, history, input, currentPath]
  );

  return (
    <div
      className="h-screen w-full bg-[#0d1117] flex flex-col overflow-hidden cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-gray-800 shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
        <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
        <span className="ml-3 text-gray-500 text-xs font-mono">
          althaf@althaf.dev: {pathToString(currentPath)}
        </span>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {lines.map((line) => (
          <TerminalLine key={line.id} line={line} />
        ))}

        {/* Current input line */}
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
              {/* Block cursor */}
              <span
                className="absolute top-0 bottom-0 w-[0.6em] bg-green-400 opacity-80 cursor-blink pointer-events-none"
                style={{ left: `${input.length}ch` }}
              />
            </div>
          </form>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Mobile hint */}
      <div className="px-4 pb-2 text-gray-600 text-xs font-mono text-center shrink-0 md:hidden">
        tap anywhere to focus · type 'help' for commands
      </div>
    </div>
  );
}
