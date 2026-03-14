export type FileType = "file" | "dir" | "link";

export interface FSNode {
  type: FileType;
  name: string;
  description?: string;
  content?: string;
  children?: Record<string, FSNode>;
  link?: string;
}

export const filesystem: FSNode = {
  type: "dir",
  name: "~",
  children: {
    "about.txt": {
      type: "file",
      name: "about.txt",
      description: "short bio",
      content: `Name    : Althaf Nafi Anwar
Location: Jakarta, Indonesia (UTC+7)
Email   : althafnaa@gmail.com

Computer Engineering graduate from Universitas Indonesia (GPA 3.85/4.00).
Recently finished a Software Engineer Internship at Grab on the mobile
Demands & Ads team.

I build across the stack — iOS apps, web backends, robotics systems,
and AI pipelines. Past work spans Apple Developer Academy, autonomous
underwater vehicles, and computer vision systems.

Type 'open about' to visit the full about page.`,
    },
    "resume.pdf": {
      type: "link",
      name: "resume.pdf",
      description: "download resume",
      link: "/resume.pdf",
      content: `Opening resume...
→ /resume.pdf`,
    },
    "contact.txt": {
      type: "file",
      name: "contact.txt",
      description: "email + socials",
      content: `Email   : althafnaa@gmail.com
GitHub  : github.com/althafnafi
LinkedIn: linkedin.com/in/althafnafi

Type 'open contact' to send a message.`,
    },
    projects: {
      type: "dir",
      name: "projects",
      description: "portfolio projects",
      children: {
        "mAIMeal/": {
          type: "dir",
          name: "mAIMeal",
          description: "AI meal planner startup",
          children: {
            "README.md": {
              type: "file",
              name: "README.md",
              content: `# mAIMeal — AI Meal Planner for Diet

Startup project. LLM-generated meal recommendations with a
RAG-powered chatbot built on LangChain.

Stack   : Python, LangChain, FastAPI, Flutter, NextJS,
          tRPC, Drizzle, PostgreSQL, Cloudflare
Year    : 2024

Type 'open projects' to see all projects.`,
            },
          },
        },
        "wizards/": {
          type: "dir",
          name: "wizards",
          description: "NUS Medical Grand Challenge 2024 — People's Award",
          children: {
            "README.md": {
              type: "file",
              name: "README.md",
              content: `# Wizards — NUS Medical Grand Challenge 2024

People's Award winner at NUS Medical Grand Challenge 2024, Singapore.

Stack   : Python, OpenCV, FastAPI, NextJS, MongoDB
Year    : 2024

- Vision-based action classifiers for hazardous event detection
- Real-time data visualization from backend inference pipelines

Type 'open projects' to see all projects.`,
            },
          },
        },
        "potabot/": {
          type: "dir",
          name: "potabot",
          description: "Discord automation bot",
          children: {
            "README.md": {
              type: "file",
              name: "README.md",
              content: `# PotaBot v2

Discord automation bot built with Python.

Stack   : Python, discord.py, PostgreSQL
GitHub  : github.com/althafnafi/potabotV2

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
GitHub  : github.com/althafnafi/althaf-web

Meta moment: you're exploring the source of the explorer.
Also — type 'snake' if you're feeling brave.`,
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
This is that start.

Type 'open blog' to read the full post.`,
        },
        "building-a-terminal.md": {
          type: "file",
          name: "building-a-terminal.md",
          description: "how I built this terminal",
          content: `# Building a Terminal in React

Published: 2025-02-15

I wanted a portfolio that felt like me. So I built a terminal.

Type 'open blog' to read more.`,
        },
      },
    },
  },
};

export function resolvePath(root: FSNode, parts: string[]): FSNode | null {
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
    if (p === "..") result.pop();
    else if (p !== ".") result.push(p);
  }
  return result;
}

export function pathToString(parts: string[]): string {
  if (parts.length === 0) return "~";
  return "~/" + parts.join("/");
}
