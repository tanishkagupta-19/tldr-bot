"use client"

import { ArrowLeft, Github, Linkedin, Moon, Sun, Users, Zap, Target } from "lucide-react"
import { useTheme } from "../theme-provider"
import Link from "next/link"

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === "dark"
  const bgGradient = isDark
    ? "linear-gradient(135deg, #0f172a 0%, #1a1f3a 50%, #2d1b4e 100%)"
    : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #f9fafb 100%)"

  const glassStyle = {
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
  }

  const textColor = isDark ? "#ffffff" : "#1f2937"
  const textSecondary = isDark ? "#d1d5db" : "#6b7280"
  const textMuted = isDark ? "#6b7280" : "#9ca3af"

  return (
    <div className="min-h-screen" style={{ background: bgGradient }}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border transition-colors" style={glassStyle}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold flex items-center gap-2 transition" style={{ color: textColor }}>
            <ArrowLeft size={20} />
            TLDR Bot
          </Link>

          <nav className="flex items-center gap-8">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                color: textColor,
              }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{
              background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            About TLDR Bot
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: textSecondary }}>
            We're on a mission to help you stay informed without information overload. TLDR Bot uses cutting-edge AI to
            find the most relevant articles and deliver the knowledge you need in seconds, not hours.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-8" style={{ color: textColor }}>
            Our Mission
          </h2>
          <div
            className="rounded-xl p-8 backdrop-blur-md border transition-all"
            style={{
              backgroundColor: glassStyle.backgroundColor,
              borderColor: glassStyle.borderColor,
            }}
          >
            <p className="leading-relaxed" style={{ color: textSecondary }}>
              In a world where billions of articles are published daily, finding reliable information has become
              challenging. Most people spend hours reading articles, only to realize they could have gotten the key
              points in minutes. TLDR Bot changes that. We combine semantic search, AI summarization, and conversational
              AI to give you the knowledge you need, instantly. No fluff. No wasted time. Just pure information.
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-8" style={{ color: textColor }}>
            Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Value Card 1 */}
            <div
              className="rounded-xl p-6 backdrop-blur-md border transition-all"
              style={{
                backgroundColor: glassStyle.backgroundColor,
                borderColor: glassStyle.borderColor,
              }}
            >
              <div className="mb-4">
                <Zap size={32} style={{ color: "#a78bfa" }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: textColor }}>
                Speed
              </h3>
              <p style={{ color: textSecondary }}>
                Get answers in seconds, not hours. We prioritize efficiency above all else.
              </p>
            </div>

            {/* Value Card 2 */}
            <div
              className="rounded-xl p-6 backdrop-blur-md border transition-all"
              style={{
                backgroundColor: glassStyle.backgroundColor,
                borderColor: glassStyle.borderColor,
              }}
            >
              <div className="mb-4">
                <Target size={32} style={{ color: "#60a5fa" }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: textColor }}>
                Accuracy
              </h3>
              <p style={{ color: textSecondary }}>
                Our AI models are trained to understand context and deliver precise summaries.
              </p>
            </div>

            {/* Value Card 3 */}
            <div
              className="rounded-xl p-6 backdrop-blur-md border transition-all"
              style={{
                backgroundColor: glassStyle.backgroundColor,
                borderColor: glassStyle.borderColor,
              }}
            >
              <div className="mb-4">
                <Users size={32} style={{ color: "#a78bfa" }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: textColor }}>
                User-Centric
              </h3>
              <p style={{ color: textSecondary }}>
                We design every feature with the user in mind. Your experience matters.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-8" style={{ color: textColor }}>
            How It Works
          </h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Search", description: "Enter any topic or query you're interested in." },
              {
                step: 2,
                title: "AI Discovery",
                description: "Our semantic search engine finds the most relevant articles across the web.",
              },
              {
                step: 3,
                title: "Instant Summary",
                description: "Get a concise AI summary of each article in seconds.",
              },
              {
                step: 4,
                title: "Deep Dive",
                description: "Chat with articles to ask questions and explore topics in depth.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl p-6 backdrop-blur-md border transition-all flex gap-4"
                style={{
                  backgroundColor: glassStyle.backgroundColor,
                  borderColor: glassStyle.borderColor,
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)" }}
                >
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: textColor }}>
                    {item.title}
                  </h3>
                  <p style={{ color: textSecondary }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-xl p-8 backdrop-blur-md border transition-all text-center"
            style={{
              backgroundColor: glassStyle.backgroundColor,
              borderColor: glassStyle.borderColor,
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
              Ready to Skip the Reading?
            </h2>
            <p className="mb-6" style={{ color: textSecondary }}>
              Start using TLDR Bot today and reclaim your time.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-lg font-semibold transition-all text-white"
              style={{ background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)" }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8 mt-20 transition-colors"
        style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
      >
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: textMuted }}>
            © 2025 TLDR Bot. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#github" className="transition" style={{ color: textMuted }}>
              <Github size={20} />
            </a>
            <a href="#linkedin" className="transition" style={{ color: textMuted }}>
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
