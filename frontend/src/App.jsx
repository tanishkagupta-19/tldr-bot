import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { 
  Search, 
  Sparkles, 
  MessageSquare, 
  Github, 
  Twitter, 
  Linkedin,
  Menu,
  X,
  ChevronRight,
  Send,
  FileText,
  Brain,
  LoaderCircle,
  ExternalLink
} from "lucide-react";

// --- Configuration ---
const API_URL = "http://127.0.0.1:8000";

// --- Utility Function ---
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// --- Animated Background Hook ---
const useAnimatedDots = (canvasRef) => {
  const animationFrameId = useRef(null);
  const dotsRef = useRef([]);
  const gridRef = useRef({});
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const mousePositionRef = useRef({ x: null, y: null });

  const DOT_SPACING = 30;
  const BASE_OPACITY_MIN = 0.1;
  const BASE_OPACITY_MAX = 0.3;
  const BASE_RADIUS = 1.2;
  const INTERACTION_RADIUS = 120;
  const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;
  const OPACITY_BOOST = 0.5;
  const RADIUS_BOOST = 1.5;
  const GRID_CELL_SIZE = Math.max(50, Math.floor(INTERACTION_RADIUS / 1.5));

  const createDots = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    if (width === 0 || height === 0) return;

    const newDots = [];
    const newGrid = {};
    const cols = Math.ceil(width / DOT_SPACING);
    const rows = Math.ceil(height / DOT_SPACING);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * DOT_SPACING + DOT_SPACING / 2;
        const y = j * DOT_SPACING + DOT_SPACING / 2;
        const cellX = Math.floor(x / GRID_CELL_SIZE);
        const cellY = Math.floor(y / GRID_CELL_SIZE);
        const cellKey = `${cellX}_${cellY}`;

        if (!newGrid[cellKey]) {
          newGrid[cellKey] = [];
        }

        const dotIndex = newDots.length;
        newGrid[cellKey].push(dotIndex);

        const baseOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
        newDots.push({
          x,
          y,
          targetOpacity: baseOpacity,
          currentOpacity: baseOpacity,
          opacitySpeed: (Math.random() * 0.005) + 0.002,
          baseRadius: BASE_RADIUS,
          currentRadius: BASE_RADIUS,
        });
      }
    }
    dotsRef.current = newDots;
    gridRef.current = newGrid;
  }, [DOT_SPACING, GRID_CELL_SIZE, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;

    if (canvas.width !== width || canvas.height !== height ||
      canvasSizeRef.current.width !== width || canvasSizeRef.current.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvasSizeRef.current = { width, height };
      createDots();
    }
  }, [createDots, canvasRef]);

  const animateDots = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const dots = dotsRef.current;
    const grid = gridRef.current;
    const { width, height } = canvasSizeRef.current;
    const { x: mouseX, y: mouseY } = mousePositionRef.current;

    if (!ctx || !dots || !grid || width === 0 || height === 0) {
      animationFrameId.current = requestAnimationFrame(animateDots);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const activeDotIndices = new Set();
    if (mouseX !== null && mouseY !== null) {
      const mouseCellX = Math.floor(mouseX / GRID_CELL_SIZE);
      const mouseCellY = Math.floor(mouseY / GRID_CELL_SIZE);
      const searchRadius = Math.ceil(INTERACTION_RADIUS / GRID_CELL_SIZE);
      for (let i = -searchRadius; i <= searchRadius; i++) {
        for (let j = -searchRadius; j <= searchRadius; j++) {
          const checkCellX = mouseCellX + i;
          const checkCellY = mouseCellY + j;
          const cellKey = `${checkCellX}_${checkCellY}`;
          if (grid[cellKey]) {
            grid[cellKey].forEach(dotIndex => activeDotIndices.add(dotIndex));
          }
        }
      }
    }

    dots.forEach((dot, index) => {
      dot.currentOpacity += dot.opacitySpeed;
      if (dot.currentOpacity >= dot.targetOpacity || dot.currentOpacity <= BASE_OPACITY_MIN) {
        dot.opacitySpeed = -dot.opacitySpeed;
        dot.currentOpacity = Math.max(BASE_OPACITY_MIN, Math.min(dot.currentOpacity, BASE_OPACITY_MAX));
        dot.targetOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
      }

      let interactionFactor = 0;
      dot.currentRadius = dot.baseRadius;

      if (mouseX !== null && mouseY !== null && activeDotIndices.has(index)) {
        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < INTERACTION_RADIUS_SQ) {
          const distance = Math.sqrt(distSq);
          interactionFactor = Math.max(0, 1 - distance / INTERACTION_RADIUS);
          interactionFactor = interactionFactor * interactionFactor;
        }
      }

      const finalOpacity = Math.min(1, dot.currentOpacity + interactionFactor * OPACITY_BOOST);
      dot.currentRadius = dot.baseRadius + interactionFactor * RADIUS_BOOST;

      ctx.beginPath();
      ctx.fillStyle = `rgba(139, 92, 246, ${finalOpacity.toFixed(3)})`;
      ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(animateDots);
  }, [canvasRef, GRID_CELL_SIZE, INTERACTION_RADIUS, INTERACTION_RADIUS_SQ, OPACITY_BOOST, RADIUS_BOOST, BASE_OPACITY_MIN, BASE_OPACITY_MAX]);
  
  const handleMouseMove = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      mousePositionRef.current = { x: null, y: null };
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    mousePositionRef.current = { x: canvasX, y: canvasY };
  }, [canvasRef]);

  useEffect(() => {
    handleResize();
    const handleMouseLeave = () => {
      mousePositionRef.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    animationFrameId.current = requestAnimationFrame(animateDots);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleResize, handleMouseMove, animateDots]);
};

// --- Main App Component ---
function App() {
  const canvasRef = useRef(null);
  useAnimatedDots(canvasRef);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [activeArticle, setActiveArticle] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setShowResults(true);

    try {
      const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search articles. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSummary = async (articleId) => {
    if (expandedCard === articleId) {
      setExpandedCard(null);
      return;
    }

    setExpandedCard(articleId);

    if (!summaries[articleId]) {
      try {
        setSummaries(prev => ({...prev, [articleId]: "Loading summary..."}));
        const response = await fetch(`${API_URL}/summarize/${articleId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch summary.");
        }
        const data = await response.json();
        setSummaries(prev => ({...prev, [articleId]: data.summary}));
      } catch (e) {
        setSummaries(prev => ({...prev, [articleId]: "Error loading summary."}));
        console.error(e);
      }
    }
  };
  
  const handleStartChat = (article) => {
    setActiveArticle(article);
    setChatMessages([]);
    setShowChat(true);
    setShowResults(false);
  }

  const handleChatSend = async () => {
    if (!chatInput.trim() || !activeArticle) return;

    const newUserMessage = { type: 'user', text: chatInput };
    setChatMessages(prev => [...prev, newUserMessage]);
    const currentChatInput = chatInput;
    setChatInput("");

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: activeArticle.id,
          question: currentChatInput,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get chat response.");
      }
      
      const data = await response.json();
      const botMessage = { type: 'bot', text: data.answer };
      setChatMessages(prev => [...prev, botMessage]);

    } catch (e) {
      const errorMessage = { type: 'bot', text: "Sorry, I couldn't get a response. Please try again." };
      setChatMessages(prev => [...prev, errorMessage]);
      console.error(e);
    }
  };

  return (
    <>
    <style>{`
      html, body, #root {
        width: 100%;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        scroll-behavior: smooth;
      }
    `}</style>
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050508] via-[#10101a] to-[#050508] text-white relative overflow-x-hidden font-sans flex flex-col">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" style={{ width: '100%', height: '100%' }} />
      <div className="absolute inset-0 z-1 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #050508 95%)' }}></div>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 w-full",
          isScrolled ? "bg-[#050508]/90 border-purple-500/20 shadow-lg" : "bg-transparent border-transparent"
        )}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold">TLDR Bot</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors">About</a>
            <a href="#features" className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors">Features</a>
            <a href="https://github.com/tanishkagupta-19/tldr-bot" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400 transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </nav>
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#050508]/95 border-t border-purple-500/20"
            >
              <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
                <a href="#about" className="text-sm hover:text-purple-400">About</a>
                <a href="#features" className="text-sm hover:text-purple-400">Features</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="relative z-10 flex-grow flex flex-col w-full">
        <AnimatePresence mode="wait">
          {!showResults && !showChat ? (
            <motion.section
              key="hero"
              id="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20"
            >
               <div className="w-full max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-block mb-6">
                  <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
                    Skip the reading, get the knowledge
                  </span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  find the article,<br />skip the reading.
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                  An intelligent bot that cuts through the internet's noise. Find articles with semantic search and get instant summaries.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full max-w-2xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for any topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full h-16 px-6 pr-16 text-lg bg-white/5 border-purple-500/30 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-white"
                      disabled={isLoading}
                    />
                    <button onClick={handleSearch} disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50">
                      {isLoading ? <LoaderCircle className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>
               </div>
            </motion.section>
          ) : showChat ? (
            <motion.section
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex-grow flex flex-col py-10"
            >
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-grow">
                <button onClick={() => {setShowChat(false); setShowResults(true)}} className="mb-6 border border-purple-500/30 hover:bg-purple-500/10 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-all self-start">
                  <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                  Back to Results
                </button>
                <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col">
                  <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden flex flex-col flex-grow">
                    <div className="p-6 border-b border-purple-500/20">
                      <h2 className="text-xl font-bold">{activeArticle?.headline}</h2>
                      <p className="text-sm text-gray-400"><a href={activeArticle?.url} target="_blank" rel="noopener noreferrer" className="hover:underline">Read Original</a></p>
                    </div>
                    <div className="flex-grow overflow-y-auto p-6 space-y-4">
                      {chatMessages.map((msg, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-3", msg.type === 'user' ? "justify-end" : "justify-start")}>
                          {msg.type === 'bot' && (
                            <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="h-4 w-4 text-purple-400" />
                            </div>
                          )}
                          <div className={cn("max-w-[70%] px-4 py-3 rounded-2xl", msg.type === 'user' ? "bg-purple-500 text-white" : "bg-white/5 border border-purple-500/20")}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-6 border-t border-purple-500/20">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ask about this article..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                          className="flex-1 bg-white/5 border-purple-500/30 rounded-md px-3 py-2 text-white focus:border-purple-500 outline-none"
                        />
                        <button onClick={handleChatSend} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg hover:shadow-purple-500/50 text-white font-bold py-2 px-4 rounded-md inline-flex items-center">
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full py-10"
            >
             <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <button onClick={() => {setShowResults(false); setError(null);}} className="mb-6 border border-purple-500/30 hover:bg-purple-500/10 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-all">
                <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                New Search
              </button>
              <h2 className="text-3xl font-bold mb-8">Top Results for "{searchQuery}"</h2>

              {isLoading && (
                <div className="flex justify-center items-center py-10">
                  <LoaderCircle className="animate-spin h-10 w-10 text-purple-400" />
                </div>
              )}
              {error && <p className="text-red-400 text-center">{error}</p>}

              <div className="grid gap-4 max-w-4xl mx-auto">
                {!isLoading && searchResults.map((result, idx) => (
                  <motion.div key={result.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all">
                    <h3 className="text-xl font-semibold mb-2">{result.headline}</h3>
                    <div className="flex gap-3 flex-wrap">
                       <a href={result.url} target="_blank" rel="noopener noreferrer" className="border border-purple-500/30 hover:bg-purple-500/10 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-all text-sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Article
                      </a>
                      <button onClick={() => handleToggleSummary(result.id)} className="border border-purple-500/30 hover:bg-purple-500/10 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-all text-sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Summary
                      </button>
                      <button onClick={() => handleStartChat(result)} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg hover:shadow-purple-500/50 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-all text-sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat with this Article
                      </button>
                    </div>
                    <AnimatePresence>
                      {expandedCard === result.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-purple-500/20">
                          <p className="text-gray-300 whitespace-pre-wrap">{summaries[result.id] || "Click to load summary..."}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
             </div>
            </motion.section>
          )}
        </AnimatePresence>
        
        <section id="features" className="w-full py-20 relative z-10">
         <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Powered by cutting-edge AI technology</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: <Search className="h-8 w-8" />, title: "Semantic Search", desc: "Find articles using natural language queries that understand your intent." },
              { icon: <Brain className="h-8 w-8" />, title: "AI Summaries", desc: "Get instant, concise TL;DR summaries of any article to save time." },
              { icon: <MessageSquare className="h-8 w-8" />, title: "Chat Interface", desc: "Ask specific, nuanced questions about the content of an article and get answers." },
            ].map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all flex flex-col">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-6 flex-shrink-0">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
         </div>
        </section>

      </main>

      <footer id="contact-footer" className="relative z-10 border-t border-purple-500/20 py-12 mt-auto w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="text-lg font-bold">TLDR Bot</span>
          </div>
          <p className="mb-4">© 2024 TLDR Bot. Built with passion by a solo developer.</p>
           <div className="flex gap-4 justify-center">
            <a href="mailto:tanishkagupta194@gmail.com" className="text-gray-400 hover:text-purple-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5v9a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 16.5v-9m19.5 0L12 13.5 2.25 7.5m19.5 0A2.25 2.25 0 0019.5 5.25H4.5A2.25 2.25 0 002.25 7.5" /></svg></a>
            <a href="https://github.com/tanishkagupta-19" className="text-gray-400 hover:text-purple-400"><Github className="h-5 w-5" /></a>
            <a href="https://www.linkedin.com/in/tanishkagupta19/" className="text-gray-400 hover:text-purple-400"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

export default App;

