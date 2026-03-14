"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";

const socials = [
  { label: "Email", value: "althafnaa@gmail.com", href: "mailto:althafnaa@gmail.com" },
  { label: "GitHub", value: "github.com/althafnafi", href: "https://github.com/althafnafi" },
  { label: "LinkedIn", value: "linkedin.com/in/althafnafi", href: "https://linkedin.com/in/althafnafi" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate — wire up to a real endpoint (Resend, Formspree, etc.) when ready
    await new Promise((r) => setTimeout(r, 800));
    setStatus("sent");
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-gray-500 text-sm mb-1">cat ~/contact.txt</p>
          <h1 className="text-2xl font-bold text-white">contact</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Say hello. I&apos;m usually pretty quick to respond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Links */}
          <section>
            <h2 className="text-gray-500 text-xs mb-4 uppercase tracking-wider">find me at</h2>
            <div className="space-y-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <span className="text-gray-600 text-xs w-16 shrink-0">{s.label}</span>
                  <span className="text-gray-300 group-hover:text-green-400 transition-colors text-sm">
                    {s.value}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* Form */}
          <section>
            <h2 className="text-gray-500 text-xs mb-4 uppercase tracking-wider">send a message</h2>
            {status === "sent" ? (
              <div className="border border-green-800 bg-green-900/20 rounded-lg p-4 text-green-400 text-sm">
                Message sent. I&apos;ll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "name", label: "name", type: "text", required: true },
                  { id: "email", label: "email", type: "email", required: true },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-gray-500 text-xs mb-1">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      required={field.required}
                      value={form[field.id as "name" | "email"]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.id]: e.target.value }))}
                      className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-colors font-mono"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="block text-gray-500 text-xs mb-1">
                    message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-colors font-mono resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-black font-semibold text-sm py-2 px-4 rounded transition-colors"
                >
                  {status === "sending" ? "sending..." : "send message"}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
