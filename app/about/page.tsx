import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "about — althaf.dev",
  description: "Computer Engineering graduate from Universitas Indonesia. Software engineer across mobile, web, robotics, and AI.",
};

const skills = [
  {
    category: "Mobile",
    items: ["Swift", "SwiftUI", "UIKit", "Dart", "Flutter"],
  },
  {
    category: "Web",
    items: ["TypeScript", "Python", "Go", "Next.js", "FastAPI", "Django", "Echo", "Hono", "Express", "Tailwind"],
  },
  {
    category: "Data & Infra",
    items: ["PostgreSQL", "MongoDB", "Redis", "Docker", "RabbitMQ", "Firebase"],
  },
  {
    category: "IoT & Robotics",
    items: ["C/C++", "ROS", "OpenCV", "Raspberry Pi", "Arduino", "ESP32", "MQTT"],
  },
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
                Hi, I&apos;m <span className="text-white font-semibold">Althaf Nafi Anwar</span> — a software engineer
                based in Jakarta, Indonesia.
              </p>
              <p>
                I graduated with a Computer Engineering degree from Universitas Indonesia (GPA 3.85/4.00),
                where I worked on everything from iOS apps with ML at the Apple Developer Academy,
                to autonomous underwater vehicles running ROS and computer vision.
              </p>
              <p>
                I like working across the stack — mobile, web, robotics, AI. If it&apos;s an interesting
                problem, I&apos;m probably already thinking about how to build it.
              </p>
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-gray-500 text-xs mb-4 uppercase tracking-wider">education</h2>
            <div className="border border-gray-800 rounded-lg p-4 bg-[#161b22]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white font-semibold text-sm">Universitas Indonesia</p>
                  <p className="text-gray-400 text-sm">B.Eng, Computer Engineering</p>
                  <p className="text-gray-500 text-xs mt-1">GPA 3.85 / 4.00</p>
                </div>
                <span className="text-gray-500 text-xs shrink-0">2021 – 2025</span>
              </div>
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
                  <span>Open to new opportunities</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-400 shrink-0">→</span>
                  <span>Continuously learning — currently exploring systems programming and distributed systems</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
