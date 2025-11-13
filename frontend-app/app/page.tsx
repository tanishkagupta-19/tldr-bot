"use client"

import { Search, Sparkles, Brain, MessageCircle, Github, Linkedin, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { useTheme } from "./theme-provider"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === "dark"
  const bgGradient = isDark
    ? "linear-gradient(135deg, #0D1117 0%, #0B0F14 100%)"
    : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #f9fafb 100%)"

  const glassStyle = {
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
  }

  const textColor = isDark ? "var(--tldr-text-primary)" : "#1f2937"
  const textSecondary = isDark ? "var(--tldr-text-secondary)" : "#6b7280"
  const tagBgColor = isDark ? "rgba(167, 139, 250, 0.2)" : "rgba(167, 139, 250, 0.15)"
  const tagBorderColor = isDark ? "rgba(167, 139, 250, 0.5)" : "rgba(167, 139, 250, 0.4)"
  const tagTextColor = isDark ? "rgba(167, 139, 250, 0.8)" : "rgba(167, 139, 250, 0.9)"

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen" style={{ background: bgGradient }}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border transition-colors" style={glassStyle}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg"
              style={{ backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
            >
              {/* Logo will be inserted here */}
            </div>
            <span className="text-xl font-bold" style={{ color: textColor }}>
              TLDR Bot
            </span>
          </div>

          <nav className="flex items-center gap-8">
            <a href="/about" className="transition" style={{ color: textSecondary }}>
              About
            </a>
            <a href="#features" className="transition" style={{ color: textSecondary }}>
              Features
            </a>
            <a href="#github" className="transition" style={{ color: textSecondary }}>
              <Github size={20} />
            </a>
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

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div
          className="max-w-4xl mx-auto rounded-2xl p-12 backdrop-blur-md border transition-all"
          style={{
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)",
            borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="text-center">
            {/* Tag */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 border transition-all"
              style={{ backgroundColor: tagBgColor, borderColor: tagBorderColor }}
            >
              <Sparkles size={16} style={{ color: "#a78bfa" }} />
              <span className="text-sm" style={{ color: tagTextColor }}>
                Skip the reading, get the knowledge.
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className="text-6xl md:text-7xl font-bold mb-8 leading-tight"
              style={{
                color: isDark ? "#ffffff" : "#0D1117",
                fontWeight: "300",
              }}
            >
              find the article,
              <br />
              skip the reading
            </h1>

            {/* Sub-headline */}
            <p className="text-lg mb-12 leading-relaxed max-w-2xl mx-auto" style={{ color: textSecondary }}>
              An intelligent bot that cuts through the internet's noise. Find articles with semantic search and get
              instant summaries.
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 mb-16">
              <div
                className="rounded-xl flex-1 flex items-center px-4 py-3 gap-3 backdrop-blur-md border transition-all"
                style={glassStyle}
              >
                <input
                  type="text"
                  placeholder="Search for any topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="bg-transparent outline-none flex-1"
                  style={{ color: textColor }}
                />
              </div>
              <button
                onClick={handleSearch}
                className="rounded-xl px-6 py-3 flex items-center gap-2 font-semibold transition-all text-white"
                style={{ background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)" }}
              >
                <Search size={20} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div
            className="rounded-xl p-8 backdrop-blur-md border transition-all"
            style={{ backgroundColor: glassStyle.backgroundColor, borderColor: glassStyle.borderColor }}
          >
            <div className="mb-6 flex justify-center">
              <Search size={32} style={{ color: "#a78bfa", boxShadow: "0 0 20px 0 rgba(167, 139, 250, 0.5)" }} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: textColor }}>
              Semantic Search
            </h3>
            <p className="text-center" style={{ color: textSecondary }}>
              Intelligent search that understands context and finds exactly what you're looking for, even with natural
              language queries.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div
            className="rounded-xl p-8 backdrop-blur-md border transition-all"
            style={{ backgroundColor: glassStyle.backgroundColor, borderColor: glassStyle.borderColor }}
          >
            <div className="mb-6 flex justify-center">
              <Brain size={32} style={{ color: "#a78bfa", boxShadow: "0 0 20px 0 rgba(167, 139, 250, 0.5)" }} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: textColor }}>
              AI Summaries
            </h3>
            <p className="text-center" style={{ color: textSecondary }}>
              Get concise, accurate summaries of lengthy articles powered by advanced AI models that understand nuance
              and context.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div
            className="rounded-xl p-8 backdrop-blur-md border transition-all"
            style={{ backgroundColor: glassStyle.backgroundColor, borderColor: glassStyle.borderColor }}
          >
            <div className="mb-6 flex justify-center">
              <MessageCircle size={32} style={{ color: "#a78bfa", boxShadow: "0 0 20px 0 rgba(167, 139, 250, 0.5)" }} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: textColor }}>
              Article Chat
            </h3>
            <p className="text-center" style={{ color: textSecondary }}>
              Ask questions about articles and get instant answers. Chat with the content to dive deeper into topics you
              care about.
            </p>
          </div>
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
