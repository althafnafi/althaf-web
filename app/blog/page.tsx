import Navbar from "@/components/Navbar";
import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "blog — althaf.dev",
  description: "Writing on software, engineering, and things I find interesting.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-gray-500 text-sm mb-1">ls ~/blog</p>
          <h1 className="text-2xl font-bold text-white">blog</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Writing on software, engineering, and things I find interesting.
          </p>
        </div>

        <div className="space-y-1">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex items-baseline gap-4 py-3 px-2 -mx-2 rounded hover:bg-[#161b22] transition-colors group"
            >
              <span className="text-gray-600 text-xs shrink-0 w-24">{post.date}</span>
              <div>
                <span className="text-gray-200 group-hover:text-white transition-colors">
                  {post.title}
                </span>
                <p className="text-gray-500 text-sm mt-0.5">{post.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
