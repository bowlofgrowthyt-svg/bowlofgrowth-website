import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bowl of Growth - Your Daily Dose of Self-Improvement",
    template: "%s | Bowl of Growth",
  },
  description: "Discover daily motivation, book summaries, brain games, and growth strategies. Transform your mindset and achieve your goals with Bowl of Growth.",
  keywords: ["self-improvement", "personal growth", "motivation", "book summaries", "productivity", "mindset", "success"],
  authors: [{ name: "Bowl of Growth" }],
  creator: "Bowl of Growth",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bowlofgrowth.in",
    siteName: "Bowl of Growth",
    title: "Bowl of Growth - Your Daily Dose of Self-Improvement",
    description: "Discover daily motivation, book summaries, brain games, and growth strategies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bowl of Growth",
    description: "Your Daily Dose of Self-Improvement",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
<!-- Fri 23 Jan 2026 15:44:28 EST -->
