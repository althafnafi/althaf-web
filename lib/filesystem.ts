export type FileType = "file" | "dir" | "link";

export interface FSNode {
  type: FileType;
  name: string;
  description?: string;
  content?: string;
  children?: Record<string, FSNode>;
  link?: string; // for links like resume.pdf
}

export const filesystem: FSNode = {
  type: "dir",
  name: "~",
  children: {
    "about.txt": {
      type: "file",
      name: "about.txt",
      description: "short bio",
      content: `Name    : Althaf
Role    : Software Engineer
Location: Earth 🌍

I build things for the web — fast, reliable, and sometimes a little weird.
Passionate about clean code, great developer experience, and products
that actually make people's lives better.

When I'm not coding, you'll find me tinkering with side projects,
reading about distributed systems, or trying to convince myself
that I don't need another mechanical keyboard.

Type 'open about' to visit the full about page.`,
    },
    "resume.pdf": {
      type: "link",
      name: "resume.pdf",
      description: "link to resume",
      link: "/resume.pdf",
      content: `Opening resume...
→ /resume.pdf`,
    },
    "contact.txt": {
      type: "file",
      name: "contact.txt",
      description: "email + socials",
      content: `Email   : hello@althaf.dev
GitHub  : github.com/althaf
Twitter : @althaf
LinkedIn: linkedin.com/in/althaf

Type 'open contact' to send a message.`,
    },
    projects: {
      type: "dir",
      name: "projects",
      description: "portfolio projects",
      children: {
        "potabot/": {
          type: "dir",
          name: "potabot",
          description: "Discord automation bot",
          children: {
            "README.md": {
              type: "file",
              name: "README.md",
              content: `# PotaBot v2

A Discord automation bot built with Python.

Stack   : Python, discord.py, PostgreSQL
Status  : Active
GitHub  : github.com/althaf/potabotV2

Features:
  - Automated moderation
  - Custom commands
  - Database-backed persistence
  - Slash command support

Type 'open projects' to see all projects.`,
            },
          },
        },
        "althaf.dev/": {
          type: "dir",
          name: "althaf.dev",
          description: "this website",
          children: {
            "README.md": {
              type: "file",
              name: "README.md",
              content: `# althaf.dev

My personal website — the one you're looking at right now.

Stack   : Next.js, TypeScript, Tailwind CSS
Status  : Active
Deploy  : Vercel

Features:
  - Interactive terminal landing page
  - MDX blog
  - Projects showcase
  - Dark theme throughout

Meta moment: you're exploring the source of the explorer.`,
            },
          },
        },
      },
    },
    blog: {
      type: "dir",
      name: "blog",
      description: "blog posts",
      children: {
        "hello-world.md": {
          type: "file",
          name: "hello-world.md",
          description: "first post",
          content: `# Hello, World.

Published: 2025-01-01

Every developer blog starts with this post. Mine is no different.

I've been meaning to start writing for years — notes on things I've
learned, projects I've built, ideas I can't stop thinking about.

This is that start. Let's see where it goes.

Type 'open blog' to read the full post.`,
        },
        "building-a-terminal.md": {
          type: "file",
          name: "building-a-terminal.md",
          description: "how I built this terminal",
          content: `# Building a Terminal in React

Published: 2025-02-15

When I decided to build my personal site, I knew I didn't want
another generic portfolio. I wanted something that felt like *me*.

So I built a terminal.

The core idea: represent my portfolio as a virtual filesystem.
Visitors navigate it with real Unix commands — ls, cd, cat.
It's a little unconventional, but it's fun.

→ Written with Next.js, TypeScript, and a lot of string parsing.

Type 'open blog' to read more.`,
        },
      },
    },
  },
};

export function resolvePath(
  root: FSNode,
  parts: string[]
): FSNode | null {
  let node: FSNode = root;
  for (const part of parts) {
    if (part === "" || part === ".") continue;
    if (!node.children) return null;
    const child = node.children[part] || node.children[part + "/"];
    if (!child) return null;
    node = child;
  }
  return node;
}

export function normalizePath(current: string[], segment: string): string[] {
  if (segment === "/" || segment === "~") return [];
  const parts = segment.split("/").filter(Boolean);
  const result = [...current];
  for (const p of parts) {
    if (p === "..") {
      result.pop();
    } else if (p !== ".") {
      result.push(p);
    }
  }
  return result;
}

export function pathToString(parts: string[]): string {
  if (parts.length === 0) return "~";
  return "~/" + parts.join("/");
}
