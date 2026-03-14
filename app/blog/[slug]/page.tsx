import Navbar from "@/components/Navbar";
import { getAllPosts, getPost } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — althaf.dev`,
    description: post.description,
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/blog"
          className="text-gray-500 text-sm hover:text-gray-300 transition-colors mb-8 block"
        >
          ← back to blog
        </Link>

        <header className="mb-10">
          <p className="text-gray-500 text-xs mb-3">{post.date}</p>
          <h1 className="text-3xl font-bold text-white leading-tight">{post.title}</h1>
          {post.description && (
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">{post.description}</p>
          )}
        </header>

        <article className="prose prose-invert prose-sm max-w-none
          prose-headings:font-bold prose-headings:text-white
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline
          prose-code:text-green-300 prose-code:bg-[#161b22] prose-code:px-1 prose-code:rounded prose-code:text-sm
          prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-gray-800
          prose-strong:text-white
          prose-li:text-gray-300
          prose-hr:border-gray-800">
          <MDXRemote source={post.content} />
        </article>
      </main>
    </div>
  );
}
