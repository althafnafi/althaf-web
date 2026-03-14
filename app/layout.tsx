import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "althaf.dev",
  description: "Software engineer. Builder of things.",
  openGraph: {
    title: "althaf.dev",
    description: "Software engineer. Builder of things.",
    url: "https://althaf.dev",
    siteName: "althaf.dev",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="bg-[#0d1117] text-white antialiased font-mono">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
