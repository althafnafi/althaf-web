import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "projects — althaf.dev",
  description: "Things I've built.",
};

const projects = [
  {
    name: "PotaBot v2",
    description: "Discord automation bot with moderation, custom commands, and PostgreSQL-backed persistence.",
    stack: ["Python", "discord.py", "PostgreSQL"],
    status: "active",
    repo: "https://github.com/althaf/potabotV2",
  },
  {
    name: "althaf.dev",
    description: "This site — interactive terminal landing page built with Next.js and Tailwind CSS.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    status: "active",
    repo: "https://github.com/althaf/althaf-web",
  },
];

const statusColor: Record<string, string> = {
  active: "text-green-400",
  archived: "text-gray-500",
  wip: "text-yellow-400",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-gray-500 text-sm mb-1">ls ~/projects</p>
          <h1 className="text-2xl font-bold text-white">projects</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Things I&apos;ve built, shipped, or abandoned halfway through.
          </p>
        </div>

        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.name}
              className="border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-colors bg-[#161b22]"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-white font-semibold text-lg">{project.name}</h2>
                <span className={`text-xs shrink-0 ${statusColor[project.status] || "text-gray-400"}`}>
                  ● {project.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 rounded bg-[#0d1117] border border-gray-700 text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-400 hover:text-green-300 transition-colors"
                >
                  → {project.repo.replace("https://", "")}
                </a>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
