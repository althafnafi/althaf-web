import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center font-mono">
      <div className="text-center space-y-4">
        <p className="text-green-400 text-sm">404</p>
        <h1 className="text-white text-2xl font-bold">Not Found</h1>
        <p className="text-gray-400 text-sm">
          No such file or directory.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-green-400 hover:text-green-300 text-sm transition-colors"
        >
          → cd ~
        </Link>
      </div>
    </div>
  );
}
