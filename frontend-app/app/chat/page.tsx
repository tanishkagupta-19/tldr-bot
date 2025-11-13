"use client"

import { ArrowLeft, Send, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { useTheme } from "../theme-provider"
import Link from "next/link"

export default function ChatPage() {
  const { theme, toggleTheme } = useTheme()
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "What's this article about?",
      sender: "user",
    },
    {
      id: 2,
      text: "This article discusses how AI is transforming industries in 2024. It covers key trends like machine learning adoption, ethical considerations, and the competitive advantages companies gain from AI investment.",
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")

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

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: input,
          sender: "user",
        },
      ])
      setInput("")

      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "That's a great question! Based on the article, I can provide more insights on that specific topic. What would you like to know more about?",
            sender: "bot",
          },
        ])
      }, 500)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bgGradient }}>
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

          <div>
            <h1 className="text-xl font-bold" style={{ color: textColor }}>
              Chat about article
            </h1>
            <p className="text-sm" style={{ color: textSecondary }}>
              The Future of AI in 2024
            </p>
          </div>

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
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 container mx-auto px-6 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className="rounded-xl px-6 py-4 max-w-2xl"
                style={
                  message.sender === "user"
                    ? {
                        backgroundColor: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)",
                        color: "#ffffff",
                      }
                    : {
                        backgroundColor: glassStyle.backgroundColor,
                        borderColor: glassStyle.borderColor,
                        color: textSecondary,
                        border: "1px solid",
                      }
                }
              >
                <p className="leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div
        className="sticky bottom-0 border-t py-4 transition-colors"
        style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto flex gap-3">
            <div
              className="rounded-xl flex-1 flex items-center px-4 py-3 gap-3 backdrop-blur-md border transition-all"
              style={glassStyle}
            >
              <input
                type="text"
                placeholder="Ask a question about the article..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="bg-transparent outline-none flex-1"
                style={{ color: textColor, "--placeholder-color": textSecondary } as any}
              />
            </div>
            <button
              onClick={handleSend}
              className="rounded-xl px-6 py-3 flex items-center gap-2 font-semibold transition-all text-white"
              style={{ background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)" }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
