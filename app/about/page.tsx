import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "about — althaf.dev",
  description: "Software engineer. Builder of things.",
};

const skills = [
  { category: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "FastAPI", "PostgreSQL", "Redis"] },
  { category: "Tools", items: ["Git", "Docker", "Linux", "Vercel"] },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-gray-500 text-sm mb-1">cat ~/about.txt</p>
          <h1 className="text-2xl font-bold text-white">about</h1>
        </div>

        <div className="space-y-10">
          {/* Bio */}
          <section>
            <div className="text-gray-300 text-sm leading-relaxed space-y-4">
              <p>
                Hi, I&apos;m <span className="text-white font-semibold">Althaf</span> — a software engineer who builds things for the web.
              </p>
              <p>
                I&apos;m passionate about clean code, great developer experience, and products that actually make people&apos;s lives better.
                I enjoy the full stack — from wrangling databases to pixel-pushing frontends.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me tinkering with side projects, reading about distributed systems,
                or trying to convince myself that I don&apos;t need another mechanical keyboard.
              </p>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-gray-500 text-xs mb-4 uppercase tracking-wider">skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((group) => (
                <div key={group.category} className="border border-gray-800 rounded-lg p-4 bg-[#161b22]">
                  <h3 className="text-gray-400 text-xs mb-3 uppercase tracking-wider">{group.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="text-xs text-gray-300 px-2 py-1 bg-[#0d1117] border border-gray-700 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Currently */}
          <section>
            <h2 className="text-gray-500 text-xs mb-4 uppercase tracking-wider">currently</h2>
            <div className="border border-gray-800 rounded-lg p-4 bg-[#161b22] text-sm">
              <div className="space-y-2 text-gray-300">
                <div className="flex gap-3">
                  <span className="text-green-400 shrink-0">→</span>
                  <span>Building projects and sharpening my craft</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-400 shrink-0">→</span>
                  <span>Writing about things I learn along the way</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-400 shrink-0">→</span>
                  <span>Open to interesting opportunities</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
