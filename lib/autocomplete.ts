import { filesystem, resolvePath, normalizePath, FSNode } from "./filesystem";

const COMMANDS = ["cat", "cd", "clear", "echo", "help", "ls", "open", "pwd", "whoami"];
const OPEN_SECTIONS = ["about", "blog", "contact", "home", "projects"];

export interface CompletionResult {
  completed: string;       // the new input value to set
  options: string[];       // all matches (shown when >1)
}

export function getCompletions(input: string, currentPath: string[]): CompletionResult {
  const noResult: CompletionResult = { completed: input, options: [] };

  // Split on first run of whitespace, preserving the trailing space state
  const hasTrailingSpace = input.endsWith(" ");
  const parts = input.trimEnd().split(/\s+/);
  const cmd = parts[0] ?? "";
  const argPart = parts.length > 1 ? parts[parts.length - 1] : "";

  // --- Complete the command itself ---
  if (parts.length === 1 && !hasTrailingSpace) {
    const matches = COMMANDS.filter((c) => c.startsWith(cmd));
    if (matches.length === 0) return noResult;
    if (matches.length === 1) return { completed: matches[0] + " ", options: [] };
    const common = commonPrefix(matches);
    return { completed: common, options: matches };
  }

  // --- Complete arguments ---
  if (parts.length < 1) return noResult;
  const command = cmd.toLowerCase();

  if (command === "open") {
    const matches = OPEN_SECTIONS.filter((s) => s.startsWith(argPart));
    if (matches.length === 0) return noResult;
    if (matches.length === 1) return { completed: `${cmd} ${matches[0]}`, options: [] };
    const common = commonPrefix(matches);
    return { completed: `${cmd} ${common}`, options: matches };
  }

  if (["cd", "cat", "ls"].includes(command)) {
    const dirsOnly = command === "cd";
    const filesOnly = command === "cat";
    return completeFilesystem(cmd, argPart, currentPath, dirsOnly, filesOnly);
  }

  return noResult;
}

function completeFilesystem(
  cmd: string,
  argPart: string,
  currentPath: string[],
  dirsOnly: boolean,
  filesOnly: boolean
): CompletionResult {
  const noResult = { completed: `${cmd} ${argPart}`, options: [] };

  // Split argPart into directory prefix + partial name
  const lastSlash = argPart.lastIndexOf("/");
  const dirPart = lastSlash >= 0 ? argPart.slice(0, lastSlash + 1) : "";
  const namePart = lastSlash >= 0 ? argPart.slice(lastSlash + 1) : argPart;

  // Resolve the directory we're completing inside
  const lookupPath = dirPart
    ? normalizePath(currentPath, dirPart)
    : currentPath;

  const node = resolvePath(filesystem, lookupPath);
  if (!node || node.type !== "dir" || !node.children) return noResult;

  const entries = Object.values(node.children).filter((child) => {
    if (dirsOnly && child.type !== "dir") return false;
    if (filesOnly && child.type === "dir") return false;
    return child.name.startsWith(namePart);
  });

  if (entries.length === 0) return noResult;

  const names = entries.map((e) =>
    e.type === "dir" ? e.name + "/" : e.name
  );

  if (names.length === 1) {
    const completed = `${cmd} ${dirPart}${names[0]}`;
    // Add trailing space only for files (dirs may want further completion)
    return {
      completed: entries[0].type === "file" ? completed + " " : completed,
      options: [],
    };
  }

  const common = commonPrefix(names);
  return {
    completed: `${cmd} ${dirPart}${common}`,
    options: names,
  };
}

function commonPrefix(strs: string[]): string {
  if (strs.length === 0) return "";
  let prefix = strs[0];
  for (const s of strs.slice(1)) {
    while (!s.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}
