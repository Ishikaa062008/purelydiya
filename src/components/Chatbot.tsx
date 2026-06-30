import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, HelpCircle, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatbotProps {
  user: any;
  userSkinProfile: any;
}

const CONVERSATION_SUGGESTIONS = [
  "What is best for oily acne skin?",
  "Tell me about Beetroot benefits",
  "How do I apply Ubtan powder?",
  "What is in the Ultimate Glow Combo?",
];

export default function Chatbot({ user, userSkinProfile }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize with greeting
  useEffect(() => {
    let initialText = "Hello! I am Diya, your herbal skincare expert. 🌸 I can help you analyze your skin, suggest tailored daily routines, and recommend natural beauty products from our store. What skin concern can I solve for you today?";
    if (userSkinProfile) {
      initialText = `Welcome back! I see you have a ${userSkinProfile.skinType} skin profile. 🌿 I would love to suggest some amazing natural masks or answer questions about your routine! What is on your mind?`;
    }

    setMessages([
      {
        id: "initial",
        sender: "assistant",
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [userSkinProfile]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch response.");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div id="beauty-assistant-chatbot" className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Closed Button Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-850 hover:bg-emerald-850 text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative group transition-all duration-300 hover:scale-105"
        >
          <MessageSquare className="h-6 w-6 animate-pulse" />
          <span className="absolute right-14 bg-stone-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow border border-stone-800">
            Chat with Diya 🌸
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
        </button>
      )}

      {/* Open Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-stone-100 w-[360px] sm:w-[380px] h-[500px] flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-stone-900 p-4 text-white flex justify-between items-center border-b border-stone-800">
            <div className="flex items-center space-x-2.5">
              <div className="bg-white/10 p-2 rounded-full border border-white/5 relative">
                <Sparkles className="h-5 w-5 text-emerald-300 animate-spin" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-stone-900" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">Diya</h3>
                <p className="text-[10px] text-emerald-200">AI Beauty & Herbal Expert</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Node */}
          <div className="flex-1 p-4 overflow-y-auto bg-stone-50 space-y-3.5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-sm text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-stone-900 text-stone-100 rounded-tr-none"
                      : "bg-white border border-stone-150 text-stone-700 rounded-tl-none"
                  }`}
                >
                  {/* Handle newline rendering */}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <span className={`block text-[8px] mt-1 text-right ${msg.sender === "user" ? "text-stone-400" : "text-stone-400 font-mono"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-150 rounded-2xl p-3 shadow-sm rounded-tl-none flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 bg-emerald-800 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 bg-emerald-800 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 bg-emerald-800 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start space-x-2 text-rose-700 text-[10px]">
                <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Bubbles */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-stone-50/50 flex flex-wrap gap-1.5 border-t border-stone-100">
              {CONVERSATION_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSendMessage(sug)}
                  className="bg-white border border-stone-200 text-stone-600 px-2.5 py-1 rounded-full text-[10px] font-medium hover:border-emerald-800 hover:text-emerald-800 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Form Input */}
          <form onSubmit={handleFormSubmit} className="p-3.5 border-t border-stone-100 bg-white flex space-x-2">
            <input
              type="text"
              placeholder="Ask Diya about face packs, products..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:bg-white text-stone-800 placeholder-stone-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="bg-emerald-850 hover:bg-emerald-850 text-white p-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
