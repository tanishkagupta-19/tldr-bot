"use client"

import { ArrowLeft, Copy, Download, Share2, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { useTheme } from "../theme-provider"
import Link from "next/link"

export default function SummaryPage() {
  const { theme, toggleTheme } = useTheme()
  const [copied, setCopied] = useState(false)

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

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const summary = `This comprehensive article explores the transformative impact of artificial intelligence on modern business and society. Key findings include: (1) AI adoption is accelerating across all industries, with 72% of enterprises implementing AI solutions; (2) Machine learning models are becoming increasingly sophisticated, enabling better predictive analytics; (3) Ethical considerations and data privacy remain critical challenges; (4) Companies investing in AI talent and infrastructure are seeing 40% productivity improvements; (5) The future demands responsible AI development with proper oversight mechanisms.`

  return (
    <div className="min-h-screen" style={{ background: bgGradient }}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border transition-colors" style={glassStyle}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/search"
            className="text-xl font-bold flex items-center gap-2 transition"
            style={{ color: textColor }}
          >
            <ArrowLeft size={20} />
            Back
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
        <div className="max-w-4xl mx-auto">
          {/* Article Info */}
          <div className="mb-12">
            <div className="mb-4">
              <p style={{ color: "#a78bfa" }} className="text-sm font-semibold">
                Tech Daily
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: textColor }}>
              The Future of AI in 2024
            </h1>
            <p className="text-lg" style={{ color: textSecondary }}>
              Generated summary • ~2 min read
            </p>
          </div>

          {/* Summary Card */}
          <div
            className="rounded-xl p-8 backdrop-blur-md border transition-all mb-8"
            style={{
              backgroundColor: glassStyle.backgroundColor,
              borderColor: glassStyle.borderColor,
            }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: textColor }}>
              AI Summary
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: textSecondary }}>
              {summary}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all text-white"
                style={{ background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)" }}
              >
                <Copy size={16} />
                {copied ? "Copied!" : "Copy Summary"}
              </button>
              <button
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                  color: textColor,
                }}
              >
                <Download size={16} />
                Download
              </button>
              <button
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                  color: textColor,
                }}
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>

          {/* Full Article Link */}
          <div
            className="rounded-xl p-6 backdrop-blur-md border transition-all"
            style={{
              backgroundColor: glassStyle.backgroundColor,
              borderColor: glassStyle.borderColor,
            }}
          >
            <p style={{ color: textSecondary }} className="mb-4">
              Want to read the full article? Visit the original source:
            </p>
            <a
              href="#"
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-all text-white"
              style={{ background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)" }}
            >
              Read Full Article →
            </a>
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
        </div>
      </footer>
    </div>
  )
}
