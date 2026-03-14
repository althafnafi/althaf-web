"use client";

import { CommandOutput } from "@/lib/commands";

interface TerminalLineProps {
  line: {
    type: "input" | "output" | "boot";
    content: string;
    outputType?: CommandOutput["type"];
    path?: string;
  };
}

export default function TerminalLine({ line }: TerminalLineProps) {
  if (line.type === "boot") {
    return (
      <div className="text-green-400 whitespace-pre-wrap font-mono text-sm leading-relaxed">
        {line.content}
      </div>
    );
  }

  if (line.type === "input") {
    return (
      <div className="flex items-start gap-1 font-mono text-sm">
        <span className="text-green-400 shrink-0">
          <span className="text-blue-400">althaf</span>
          <span className="text-gray-500">@</span>
          <span className="text-purple-400">althaf.dev</span>
          <span className="text-gray-500">:</span>
          <span className="text-yellow-400">{line.path || "~"}</span>
          <span className="text-green-400">$</span>
        </span>
        <span className="text-white ml-1">{line.content}</span>
      </div>
    );
  }

  // output lines
  const colorClass =
    line.outputType === "error"
      ? "text-red-400"
      : line.outputType === "success"
      ? "text-green-300"
      : "text-gray-300";

  return (
    <div className={`font-mono text-sm whitespace-pre-wrap leading-relaxed ${colorClass}`}>
      {line.content}
    </div>
  );
}
