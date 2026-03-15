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
      "Part of the mobile Demands and Ads team — maintained and developed new features for the Grab passenger app.",
      "Implemented snapshot and unit tests across major app flows, improving release confidence in CI.",
      "Collaborated with designers, backend engineers, and PMs through code reviews and documentation.",
    ],
  },
  {
    role: "Junior Developer",
    company: "Apple Developer Academy",
    location: "Jakarta, Indonesia",
    period: "Mar 2024 – Dec 2024",
    bullets: [
      "Built multiple iOS apps using SwiftUI, UIKit, and Core frameworks, focusing on performance and clean architecture.",
      "Worked on projects involving computer vision, IMU (CoreMotion), and on-device ML (CoreML, Vision).",
      "Implemented real-time data handling and background processing for mobile applications.",
    ],
  },
  {
    role: "Software Engineer (Robotics)",
    company: "Autonomous Marine Vehicle UI",
    location: "Depok, Indonesia",
    period: "Feb 2022 – Aug 2024",
    bullets: [
      "Led a team of 6 engineers building autonomous and manual control systems for underwater and surface vehicles.",
      "Designed modular perception and localization pipelines using YOLO and visual odometry, deployed on real-world robotic systems.",
      "Built software pipelines integrating IMU and camera for localization and navigation.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "PT Inti Utama Solusindo (Pharos Group)",
    location: "Jakarta, Indonesia",
    period: "Jan 2024 – Feb 2024",
    bullets: [
      "Built a real-time computer vision system with backend management for a scalable product management system using Django.",
      "Integrated async job queues with RabbitMQ and Pika to handle communication between the admin interface and object detection system.",
    ],
  },
  {
    role: "Laboratory Teaching Assistant",
    company: "Network Laboratory, Universitas Indonesia",
    location: "Depok, Indonesia",
    period: "Aug 2023 – Dec 2024",
    bullets: [
      "Instructed ~80 computer engineering students across OOP (Java), Computer Networks (CCNA), and Database Systems (SQL, API, Systems Design).",
    ],
  },
  {
    role: "Web Developer",
    company: "CEO FTUI",
    location: "Depok, Indonesia",
    period: "Jun 2023 – Aug 2023",
    bullets: [
      "Built the website for CEO FTUI's yearly event, spotlighting job prospects for Engineering Faculty students.",
    ],
  },
];

const awards = [
  {
    title: "People's Award",
    event: "NUS Medical Grand Challenge 2024",
    location: "Singapore (International)",
    year: "2024",
  },
  {
    title: "Finalist",
    event: "Singapore Autonomous Underwater Vehicle Challenge",
    location: "Singapore (International)",
    year: "2024",
  },
  {
    title: "National Finalist & 2nd Place Regional",
    event: "KRBAI 2023",
    location: "Semarang (National)",
    year: "2023",
  },
  {
    title: "3rd Place — ROV Category",
    event: "Technogine 2023",
    location: "Bandung (National)",
    year: "2023",
  },
  {
    title: "4th Place — Autonomous Control Ship",
    event: "KKCTBN 2023",
    location: "Depok (National)",
    year: "2023",
  },
  {
    title: "2nd Place — Autonomous Control Ship",
    event: "KKCTBN 2022",
    location: "Surabaya (National)",
    year: "2022",
  },
  {
    title: "Finalist",
    event: "Singapore Autonomous Underwater Vehicle Challenge",
    location: "Singapore (International)",
    year: "2022",
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
            Where I&apos;ve worked.
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

          {/* Resume */}
          <section>
            <h2 className="text-gray-500 text-xs mb-4 uppercase tracking-wider">resume</h2>
            <div className="border border-gray-800 rounded-lg p-4 bg-[#161b22] flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold text-sm">Althaf Nafi Anwar — CV</p>
                <p className="text-gray-500 text-xs mt-0.5">Last updated 2025</p>
              </div>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-400 hover:text-green-300 transition-colors shrink-0"
              >
                → download
              </a>
            </div>
          </section>

          {/* Awards */}
          <section>
            <h2 className="text-gray-500 text-xs mb-4 uppercase tracking-wider">awards & recognition</h2>
            <div className="space-y-3">
              {awards.map((award) => (
                <div
                  key={`${award.title}-${award.year}`}
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
