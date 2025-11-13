"use client"

import { Search, ArrowLeft, Brain, MessageCircle, ExternalLink, Github, Linkedin, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { useTheme } from "../theme-provider"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [newQuery, setNewQuery] = useState(query)
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

  // Mock search results
  const results = [
    {
      id: 1,
      title: "The Future of AI in 2024",
      summary:
        "Exploring emerging trends in artificial intelligence and machine learning technologies that are reshaping industries.",
      source: "Tech Daily",
      url: "#",
    },
    {
      id: 2,
      title: "Climate Change Impact on Global Economy",
      summary:
        "A comprehensive analysis of how climate change is affecting economic growth and investment patterns worldwide.",
      source: "Global News",
      url: "#",
    },
    {
      id: 3,
      title: "Web Development Trends This Year",
      summary: "Latest frameworks, tools, and best practices that developers should know about in 2024.",
      source: "Dev Magazine",
      url: "#",
    },
    {
      id: 4,
      title: "The Rise of Remote Work Culture",
      summary: "How remote work is transforming company cultures and what the future of work looks like.",
      source: "Business Insider",
      url: "#",
    },
  ]

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

      <section className="container mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex gap-2">
            <div
              className="rounded-xl flex-1 flex items-center px-4 py-3 gap-3 backdrop-blur-md border transition-all"
              style={glassStyle}
            >
              <input
                type="text"
                placeholder="Search for any topic..."
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                className="bg-transparent outline-none flex-1"
                style={{ color: textColor, "--placeholder-color": textSecondary } as any}
              />
            </div>
            <button
              className="rounded-xl px-6 py-3 flex items-center gap-2 font-semibold transition-all text-white"
              style={{ background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)" }}
            >
              <Search size={20} />
              <span>Search</span>
            </button>
          </div>

          {query && (
            <p className="mt-6 text-lg" style={{ color: textSecondary }}>
              Results for:{" "}
              <span className="font-semibold" style={{ color: textColor }}>
                "{query}"
              </span>
            </p>
          )}
        </div>

        {/* Results Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="rounded-xl p-6 backdrop-blur-md border transition-all hover:border-opacity-100"
              style={{
                backgroundColor: glassStyle.backgroundColor,
                borderColor: glassStyle.borderColor,
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>
                    {result.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#a78bfa" }}>
                    {result.source}
                  </p>
                </div>
                <button
                  className="p-2 rounded-lg transition-all flex-shrink-0"
                  style={{
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                    color: textColor,
                  }}
                >
                  <ExternalLink size={20} />
                </button>
              </div>

              <p className="mb-4 leading-relaxed" style={{ color: textSecondary }}>
                {result.summary}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => (window.location.href = "/summary")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all text-white"
                  style={{ background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)" }}
                >
                  <Brain size={16} />
                  Get Summary
                </button>
                <button
                  onClick={() => (window.location.href = "/chat")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                    color: textColor,
                  }}
                >
                  <MessageCircle size={16} />
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8 mt-20 transition-colors"
        style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
      >
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>
            © 2025 TLDR Bot. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#github" className="transition" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>
              <Github size={20} />
            </a>
            <a href="#linkedin" className="transition" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
