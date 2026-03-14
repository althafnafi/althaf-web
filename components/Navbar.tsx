"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "~" },
  { href: "/projects", label: "~/projects" },
  { href: "/blog", label: "~/blog" },
  { href: "/about", label: "~/about" },
  { href: "/work", label: "~/work" },
  { href: "/contact", label: "~/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-800 bg-[#0d1117] px-6 py-3 flex items-center gap-6 font-mono text-sm">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors ${
              isActive
                ? "text-green-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
