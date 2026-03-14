import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "work — althaf.dev",
  description: "Work experience and awards.",
};

const experience = [
  {
    role: "Software Engineer Intern",
    company: "Grab",
    location: "Jakarta, Indonesia",
    period: "Feb 2025 – Jun 2025",
    bullets: [
      "Built features for the Grab passenger app on the Demands & Ads team.",
      "Worked across Swift, SwiftUI, and UIKit on iOS.",
    ],
  },
  {
    role: "Junior Developer",
    company: "Apple Developer Academy",
    location: "Jakarta, Indonesia",
    period: "Mar 2024 – Dec 2024",
    bullets: [
      "Developed iOS apps using Swift, SwiftUI, UIKit, SpriteKit, and CoreML.",
      "Followed challenge-based learning to ship polished app experiences.",
    ],
  },
  {
    role: "Software Engineer (Robotics)",
    company: "Autonomous Marine Vehicle UI",
    location: "Depok, Indonesia",
    period: "Feb 2022 – Aug 2024",
    bullets: [
      "Built software systems for an autonomous underwater vehicle.",
      "Worked with ROS, OpenCV, C/C++, and Raspberry Pi for perception and control.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "PT Inti Utama Solusindo",
    location: "Jakarta, Indonesia",
    period: "Jan 2024 – Feb 2024",
    bullets: [
      "Contributed to backend and infrastructure work during a short-term placement.",
    ],
  },
  {
    role: "Teaching Assistant — Network Lab",
    company: "Universitas Indonesia",
    location: "Depok, Indonesia",
    period: "Aug 2023 – Dec 2024",
    bullets: [
      "Assisted students in computer networking labs and practical sessions.",
    ],
  },
  {
    role: "Web Developer",
    company: "CEO FTUI",
    location: "Depok, Indonesia",
    period: "Jun 2023 – Aug 2023",
    bullets: [
      "Built and maintained web presence for the student organization.",
    ],
  },
];

const awards = [
  {
    title: "People's Award",
    event: "NUS Medical Grand Challenge 2024",
    location: "Singapore",
    year: "2024",
  },
  {
    title: "Funded Startup",
    event: "UI Incubate — mAIMeal",
    location: "Jakarta, Indonesia",
    year: "2024",
  },
];

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-gray-500 text-sm mb-1">ls ~/work</p>
          <h1 className="text-2xl font-bold text-white">work</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Where I&apos;ve worked and what I&apos;ve won.
          </p>
        </div>

        <div className="space-y-10">
          {/* Experience */}
          <section>
            <h2 className="text-gray-500 text-xs mb-4 uppercase tracking-wider">experience</h2>
            <div className="space-y-4">
              {experience.map((job) => (
                <div
                  key={`${job.company}-${job.period}`}
                  className="border border-gray-800 rounded-lg p-5 bg-[#161b22]"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">{job.role}</p>
                      <p className="text-green-400 text-sm">{job.company}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{job.location}</p>
                    </div>
                    <span className="text-gray-500 text-xs shrink-0">{job.period}</span>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-gray-400 text-sm">
                        <span className="text-gray-600 shrink-0">–</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Awards */}
          <section>
            <h2 className="text-gray-500 text-xs mb-4 uppercase tracking-wider">awards & recognition</h2>
            <div className="space-y-3">
              {awards.map((award) => (
                <div
                  key={award.title}
                  className="border border-gray-800 rounded-lg p-4 bg-[#161b22] flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="text-white font-semibold text-sm">{award.title}</p>
                    <p className="text-gray-400 text-sm">{award.event}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{award.location}</p>
                  </div>
                  <span className="text-gray-500 text-xs shrink-0">{award.year}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
