import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../context/StoreContext";
import { Sparkles, X, Send, Bot, User, MessageCircle, RefreshCw, ShoppingCart, ArrowUpRight, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export const AiAssistant: React.FC = () => {
  const { addToCart, products, cartSubtotal, minOrderValue, freeShippingThreshold, addNotification } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "### Namaste! I am your Daily Needs AI Assistant. 🌾\n\nI can help you:\n- **Find products** (e.g., 'Do you have rock salt?')\n- **Suggest delicious recipes** with direct cart additions (e.g., 'Suggest a Dal Tadka recipe')\n- **Optimize your cart** to reach free delivery (₹2,000) or check out minimum (₹1,000)\n- **Answer FAQs** about delivery, Rajesh Sharma, and timings.\n\nWhat can I get for you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Quick Action Buttons
  const QUICK_PROMPTS = [
    { label: "Suggest a healthy dinner recipe", prompt: "Suggest a simple healthy Indian dinner recipe and list its ingredients available at Daily Needs" },
    { label: "Check active coupons", prompt: "What are the active coupons, offers and discount codes currently available?" },
    { label: "Optimize my cart", prompt: "My current cart value is around ₹" + cartSubtotal + ". How can I optimize it, and which premium bestseller items do you recommend I add?" },
    { label: "Who is Rajesh Sharma?", prompt: "Who is the owner Rajesh Sharma, and what are the store timings and contact details?" }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMsgId,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      // Map history for API
      const history = messages.slice(1).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        text: m.text
      }));

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history })
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            text: data.reply,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error || "Failed to fetch response");
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "I apologize, but I am experiencing temporary connectivity difficulties. Please ensure you are connected to the network or try again soon. Rajesh Sharma and support are always available at **+91 9876543210**!",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse simple markdown formatting into JSX elements safely
  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100 mt-3 mb-1.5 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-emerald-500" />{line.substring(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-base font-extrabold text-neutral-900 dark:text-white mt-4 mb-2">{line.substring(3)}</h3>;
      }
      // Bullets
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-neutral-600 dark:text-neutral-300 my-1 leading-relaxed">
            {parseInlineMarkdown(line.substring(2))}
          </li>
        );
      }
      // Standard Paragraph
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed my-1">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Inline formatting parser for **bold**
  const parseInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-extrabold text-neutral-900 dark:text-white">{part.substring(2, part.length - 2)}</strong>;
      }
      return part;
    });
  };

  // Dynamic Product Link extractor: Looks for product names in the AI reply
  // and renders an immediate "Quick Add" catalog badge!
  const extractAndRenderProducts = (text: string) => {
    const lowerText = text.toLowerCase();
    const suggestedProducts = products.filter((p) => {
      // Look for brand + partial matches (e.g. "India Gate Basmati", "Aashirvaad Atta")
      const combinedName = `${p.brand} ${p.name}`.toLowerCase();
      return lowerText.includes(p.name.toLowerCase()) || lowerText.includes(p.brand.toLowerCase() + " " + p.name.toLowerCase().split(" ")[0]);
    }).slice(0, 3);

    if (suggestedProducts.length === 0) return null;

    return (
      <div className="mt-3.5 p-3 rounded-2xl bg-emerald-50/50 dark:bg-neutral-800/40 border border-emerald-100/50 dark:border-neutral-700/50 space-y-2">
        <p className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
          <ShoppingCart className="w-3 h-3" /> Quick Add Ingredients
        </p>
        <div className="flex flex-col gap-1.5">
          {suggestedProducts.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-2 p-1.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 text-xs shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <img src={p.images[0]} alt={p.name} className="w-8 h-8 object-cover rounded-lg" referrerPolicy="no-referrer" />
                <div className="min-w-0">
                  <p className="font-bold text-neutral-800 dark:text-neutral-100 truncate">{p.name}</p>
                  <p className="text-[10px] text-neutral-400">₹{p.sellingPrice} • {p.unit}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  addToCart(p);
                  addNotification(`Added ${p.name} to cart via AI Assistant!`, "success");
                }}
                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-extrabold flex items-center gap-0.5 shadow-sm shadow-emerald-500/10 transition-colors"
              >
                <span>ADD</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 w-[92vw] sm:w-[400px] h-[550px] flex flex-col overflow-hidden mb-4 mr-0"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative">
                  <Bot className="w-5.5 h-5.5" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-emerald-600 rounded-full animate-ping" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold flex items-center gap-1">Daily Needs AI <Sparkles className="w-3.5 h-3.5 text-yellow-300" /></h3>
                  <span className="text-[10px] text-emerald-100 font-medium">Powered by Gemini 3.5 Flash</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-emerald-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50 dark:bg-neutral-950/20 scrollbar-thin">
              {messages.map((m) => (
                <div key={m.id} className={`flex items-start gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/10">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div className="max-w-[82%] flex flex-col">
                    <div className={`p-3.5 rounded-2xl text-neutral-800 dark:text-neutral-100 shadow-sm border ${m.role === "user" ? "bg-emerald-500 text-white border-emerald-400 rounded-br-none" : "bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-800 rounded-bl-none"}`}>
                      {m.role === "user" ? (
                        <p className="text-xs font-semibold leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      ) : (
                        <div className="space-y-1">
                          {renderMarkdown(m.text)}
                          {extractAndRenderProducts(m.text)}
                        </div>
                      )}
                    </div>
                    <span className={`text-[9px] text-neutral-400 mt-1 ${m.role === "user" ? "text-right" : "text-left"}`}>
                      {m.timestamp.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="p-3.5 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm rounded-bl-none flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts Drawer */}
            <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 overflow-x-auto flex gap-2 scrollbar-none whitespace-nowrap">
              {QUICK_PROMPTS.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(qp.prompt)}
                  className="px-3 py-1.5 bg-white dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-neutral-700/50 hover:text-emerald-600 text-neutral-600 dark:text-neutral-300 border border-neutral-100 dark:border-neutral-800 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm transition-all shrink-0"
                >
                  <HelpCircle className="w-3 h-3 text-emerald-500" />
                  <span>{qp.label}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask recipe ingredients, order, support..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
                className="flex-1 bg-neutral-50 dark:bg-neutral-800 text-xs border border-neutral-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl disabled:opacity-40 transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center shadow-2xl relative z-50 shadow-emerald-500/30"
        title="Daily Needs AI Shopping Assistant"
      >
        {isOpen ? <X className="w-6 h-6 animate-spin-once" /> : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1.5 -right-1.5 animate-pulse" />
          </div>
        )}
      </motion.button>
    </div>
  );
};
