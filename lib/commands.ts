import {
  filesystem,
  resolvePath,
  normalizePath,
  pathToString,
  FSNode,
} from "./filesystem";

export interface CommandOutput {
  text: string;
  type: "output" | "error" | "success" | "navigate";
  navigateTo?: string;
}

export interface CommandResult {
  output: CommandOutput[];
  newPath?: string[];
}

function getNode(path: string[]): FSNode | null {
  return resolvePath(filesystem, path);
}

export function executeCommand(
  input: string,
  currentPath: string[]
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: [] };

  const [cmd, ...args] = trimmed.split(/\s+/);

  switch (cmd.toLowerCase()) {
    case "help":
      return cmdHelp();
    case "ls":
      return cmdLs(currentPath, args);
    case "cd":
      return cmdCd(currentPath, args[0]);
    case "cat":
      return cmdCat(currentPath, args[0]);
    case "pwd":
      return cmdPwd(currentPath);
    case "whoami":
      return cmdWhoami();
    case "clear":
      return { output: [{ text: "__clear__", type: "output" }] };
    case "open":
      return cmdOpen(args[0]);
    case "echo":
      return { output: [{ text: args.join(" "), type: "output" }] };
    case "exit":
      return {
        output: [{ text: "There's no escape. You're here forever.", type: "output" }],
      };
    default:
      return {
        output: [
          {
            text: `zsh: command not found: ${cmd}`,
            type: "error",
          },
        ],
      };
  }
}

function cmdHelp(): CommandResult {
  return {
    output: [
      {
        text: `Available commands:

  ls [-la]          List files in current directory
  cd <dir>          Change directory
  cat <file>        Read file contents
  pwd               Print working directory
  whoami            Who am I?
  open <section>    Navigate to a section (projects, blog, about, contact)
  clear             Clear the terminal
  help              Show this help message

Sections: projects · blog · about · contact`,
        type: "output",
      },
    ],
  };
}

function cmdLs(currentPath: string[], args: string[]): CommandResult {
  const node = getNode(currentPath);
  if (!node || node.type !== "dir" || !node.children) {
    return { output: [{ text: "ls: cannot access directory", type: "error" }] };
  }

  const detailed = args.includes("-la") || args.includes("-l") || args.includes("-a");
  const entries = Object.values(node.children);

  if (entries.length === 0) {
    return { output: [{ text: "(empty directory)", type: "output" }] };
  }

  if (detailed) {
    const lines = entries.map((e) => {
      const isDir = e.type === "dir";
      const prefix = isDir ? "d" : "-";
      const perm = isDir ? "rwxr-xr-x" : "rw-r--r--";
      const name = isDir ? `\x1b[36m${e.name}/\x1b[0m` : e.name;
      const desc = e.description ? `  # ${e.description}` : "";
      return `${prefix}${perm}  althaf  ${name}${desc}`;
    });
    return { output: [{ text: lines.join("\n"), type: "output" }] };
  }

  const names = entries.map((e) =>
    e.type === "dir" ? `${e.name}/` : e.name
  );
  return { output: [{ text: names.join("  "), type: "output" }] };
}

function cmdCd(currentPath: string[], target?: string): CommandResult {
  if (!target || target === "~" || target === "/") {
    return { output: [], newPath: [] };
  }

  const newPath = normalizePath(currentPath, target);
  const node = getNode(newPath);

  if (!node) {
    return {
      output: [{ text: `cd: no such file or directory: ${target}`, type: "error" }],
    };
  }

  if (node.type !== "dir") {
    return {
      output: [{ text: `cd: not a directory: ${target}`, type: "error" }],
    };
  }

  return { output: [], newPath };
}

function cmdCat(currentPath: string[], target?: string): CommandResult {
  if (!target) {
    return { output: [{ text: "cat: missing file operand", type: "error" }] };
  }

  const filePath = normalizePath(currentPath, target);
  const node = getNode(filePath);

  if (!node) {
    return {
      output: [{ text: `cat: ${target}: No such file or directory`, type: "error" }],
    };
  }

  if (node.type === "dir") {
    return {
      output: [{ text: `cat: ${target}: Is a directory`, type: "error" }],
    };
  }

  if (node.type === "link" && node.link) {
    return {
      output: [
        { text: node.content || `→ ${node.link}`, type: "success" },
      ],
    };
  }

  return {
    output: [{ text: node.content || "(empty file)", type: "output" }],
  };
}

function cmdPwd(currentPath: string[]): CommandResult {
  return {
    output: [{ text: `/home/althaf/${pathToString(currentPath)}`, type: "output" }],
  };
}

function cmdWhoami(): CommandResult {
  return {
    output: [
      {
        text: `althaf — software engineer, builder of things.
type 'cat about.txt' or 'open about' to learn more.`,
        type: "success",
      },
    ],
  };
}

function cmdOpen(section?: string): CommandResult {
  const sections: Record<string, string> = {
    projects: "/projects",
    blog: "/blog",
    about: "/about",
    contact: "/contact",
    home: "/",
    "~": "/",
  };

  if (!section) {
    return {
      output: [
        {
          text: `open: specify a section\nAvailable: ${Object.keys(sections).join(", ")}`,
          type: "error",
        },
      ],
    };
  }

  const route = sections[section.toLowerCase()];
  if (!route) {
    return {
      output: [
        {
          text: `open: unknown section '${section}'\nAvailable: ${Object.keys(sections).join(", ")}`,
          type: "error",
        },
      ],
    };
  }

  return {
    output: [
      {
        text: `→ navigating to ${section}...`,
        type: "success",
        navigateTo: route,
      },
    ],
  };
}
