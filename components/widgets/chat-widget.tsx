"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { BsRobot } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";

/**
 * AI-Powered Chat Widget
 *
 * Floating chatbot using Vercel AI SDK v6 + OpenAI GPT-4o-mini.
 * Features:
 * - Streaming responses via Edge Runtime
 * - Client-side greeting interception (saves API costs)
 * - Typing indicator with bouncing dots
 * - Markdown rendering with custom link styling
 * - Error handling with retry
 * - Auto-scroll & cleanup on unmount
 * - Premium animated floating button
 */

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hi! 👋 I'm the Hashtag Tech assistant. Ask me about our services, team, or anything else!",
      },
    ],
  },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    sendMessage,
    error,
    regenerate,
    stop,
    status,
    setMessages,
  } = useChat({
    messages: INITIAL_MESSAGES,
    experimental_throttle: 50,
  });

  const isLoading =
    status === "submitted" || status === "streaming" || isSimulating;

  // Auto-scroll to bottom
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Client-side greeting handling (saves LLM costs)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const lowerInput = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    const greetingMatches = [
      "hi",
      "hello",
      "hey",
      "salam",
      "assalamualikum",
      "assalamoalikum",
      "assalamu alaikum",
      "assalamo alaikum",
      "greetings",
      "assalmualikum",
      "asalamualikum",
      "asalam",
      "assalam",
      "hi there",
      "hello there",
    ];

    const isGreeting = greetingMatches.some(
      (g) => lowerInput === g || lowerInput.startsWith(g + " ")
    );

    if (isGreeting) {
      const fakeUserMessage: UIMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        parts: [{ type: "text", text: trimmed }],
      };

      let botReply = "Hi there! 👋 How can I help you today?";
      if (lowerInput.includes("salam") || lowerInput.includes("assalam")) {
        botReply = "Walaikum Assalam! 👋 How can I help you today?";
      }

      const botMessageId = `bot-${Date.now()}`;
      const emptyBotMessage: UIMessage = {
        id: botMessageId,
        role: "assistant",
        parts: [{ type: "text", text: "" }],
      };

      setMessages([...messages, fakeUserMessage, emptyBotMessage]);
      setIsSimulating(true);

      const thinkingDelay = Math.floor(Math.random() * 500) + 500;

      setTimeout(() => {
        let currentText = "";
        const chars = botReply.split("");
        let charIndex = 0;

        const streamInterval = setInterval(() => {
          if (charIndex < chars.length) {
            currentText += chars[charIndex];
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId
                  ? { ...msg, parts: [{ type: "text", text: currentText }] }
                  : msg
              )
            );
            charIndex++;
          } else {
            clearInterval(streamInterval);
            setIsSimulating(false);
          }
        }, 15);
      }, thinkingDelay);

      setInput("");
      return;
    }

    // Normal LLM flow
    sendMessage({ text: trimmed });
    setInput("");
  };

  const getMessageText = (message: (typeof messages)[0]) => {
    return (
      message.parts
        ?.filter((part) => part.type === "text")
        .map((part) => (part as { type: "text"; text: string }).text)
        .join("") || ""
    );
  };

  return (
    <>
      {/* WhatsApp Button removed as requested */}

      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Pulsing glow ring */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary opacity-40 blur-xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.15, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: isOpen ? 0 : [0, -6, 0],
          }}
          transition={
            isOpen
              ? { type: "spring", stiffness: 260, damping: 20 }
              : {
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  scale: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 0.4,
                  },
                  opacity: { duration: 0.4 },
                }
          }
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-primary hover:opacity-90 shadow-lg ring-1 ring-black/10"
              : "bg-primary shadow-lg hover:shadow-xl border border-white/20"
          }`}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {/* Hover Overlay Message */}
          {!isOpen && (
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Interact with Xena AI Assistant
              {/* Little arrow pointing right */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rotate-45" />
            </div>
          )}
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center text-white"
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="bot"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{
                  rotate: [0, -12, 12, -8, 8, 0],
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  rotate: -90,
                  opacity: 0,
                  scale: 0.5,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  rotate: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 1,
                  },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                className="absolute inset-0 flex items-center justify-center text-white"
              >
                <BsRobot size={26} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.9,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-[400px] h-[75vh] max-h-[600px] z-50 flex flex-col"
          >
            <div className="bg-transparent overflow-hidden flex flex-col h-full rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] ring-1 ring-border/50">
              {/* Header */}
              <div className="bg-secondary text-white p-4 relative overflow-hidden shrink-0 rounded-t-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                        <BsRobot className="text-white text-lg" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-secondary animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white tracking-wide text-sm">
                        Xena
                      </h3>
                      <p className="text-xs text-white/70 font-medium">
                        {status === "streaming" ||
                        (isSimulating &&
                          messages.length > 0 &&
                          getMessageText(messages[messages.length - 1]).length >
                            0)
                          ? "Typing..."
                          : status === "submitted" || isSimulating
                            ? "Thinking..."
                            : "Ask about our services"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0 [scrollbar-width:thin] bg-white"
              >
                <AnimatePresence initial={false}>
                  {messages.map((message) => {
                    const text = getMessageText(message);
                    const isAssistant = message.role === "assistant";

                    if (!text && isAssistant && !isLoading) return null;
                    if (!text && isAssistant && message.id === "welcome")
                      return null;

                    const showDots = !text && isAssistant && isLoading;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] px-5 py-3 shadow-sm ${
                            message.role === "user"
                              ? "bg-primary text-white rounded-t-2xl rounded-l-2xl rounded-br-sm"
                              : "bg-gray-100 text-gray-900 rounded-t-2xl rounded-r-2xl rounded-bl-sm shadow-md"
                          }`}
                        >
                          {showDots ? (
                            <div
                              className="flex gap-2 items-center h-4 py-1"
                              style={{
                                animation: "chatFadeIn 0.2s ease-out",
                              }}
                            >
                              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                            </div>
                          ) : isAssistant ? (
                            <div
                              className="text-sm leading-relaxed font-medium prose-chat"
                              style={{
                                animation: "chatFadeIn 0.3s ease-out",
                              }}
                            >
                              <ReactMarkdown
                                components={{
                                  a: ({ href, children }) => (
                                    <Link
                                      href={href || "#"}
                                      className="text-primary hover:underline font-semibold transition-colors"
                                    >
                                      {children}
                                    </Link>
                                  ),
                                  p: ({ children }) => (
                                    <p className="mb-1.5 last:mb-0">
                                      {children}
                                    </p>
                                  ),
                                  strong: ({ children }) => (
                                    <strong className="font-bold text-gray-900">
                                      {children}
                                    </strong>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="list-disc list-inside mb-1.5 space-y-0.5">
                                      {children}
                                    </ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="list-decimal list-inside mb-1.5 space-y-0.5">
                                      {children}
                                    </ol>
                                  ),
                                  li: ({ children }) => (
                                    <li className="text-sm">{children}</li>
                                  ),
                                }}
                              >
                                {text}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                              {text}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing indicator for submitted phase */}
                  {status === "submitted" &&
                  messages[messages.length - 1]?.role === "user" ? (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 rounded-t-2xl rounded-r-2xl rounded-bl-sm px-5 py-4 shadow-md">
                        <div className="flex gap-2 items-center h-4">
                          <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Error display with retry */}
                  {error ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%] bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-3 shadow-md">
                        <p className="text-sm font-medium mb-2">
                          Something went wrong. Please try again.
                        </p>
                        <button
                          onClick={() => regenerate()}
                          className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-full transition-colors font-medium"
                        >
                          ↻ Retry
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="p-3 sm:p-4 bg-white shrink-0 rounded-b-2xl border-t border-gray-200"
              >
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about our services..."
                    disabled={status !== "ready" && status !== "error"}
                    className="flex-1 bg-gray-50 focus:bg-white border border-gray-200 focus:border-primary/50 rounded-full px-5 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    whileHover={{
                      scale: isLoading || !input.trim() ? 1 : 1.05,
                    }}
                    whileTap={{
                      scale: isLoading || !input.trim() ? 1 : 0.95,
                    }}
                    className="bg-primary text-white flex items-center justify-center w-[46px] h-[46px] shrink-0 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 relative right-[1px]" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Default export for dynamic import
 */
export default ChatWidget;
