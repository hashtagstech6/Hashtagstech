"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, MessageCircle, Video, Minimize2, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatWidgetConfig, ChatMessage } from "@/types/chat-widget";
import { defaultHashtagTechConfig } from "@/types/chat-widget";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import WhatsAppButton from "./whatsapp-button";

/**
 * Chat Widget Component
 *
 * Reusable, configurable chat widget with collapsed and expanded states.
 * Supports custom branding for Hashtag Tech and Devmate Solutions.
 *
 * Features:
 * - Collapsed state: Two circular buttons (video call, chat)
 * - Expanded modal state: Chat interface with agent messages
 * - Motion.dev animations (slide up/down, fade in/out)
 * - Reduced motion support
 * - No focus trap (FR-068)
 * - Loaded with next/dynamic for code splitting (FR-056)
 *
 * @example
 * ```tsx
 * <ChatWidget />
 * // Or with custom config
 * <ChatWidget config={{ agentName: "Alex", ... }} />
 * ```
 */
interface ChatWidgetProps {
  /** Chat widget configuration (defaults to Hashtag Tech branding) */
  config?: Partial<ChatWidgetConfig>;
}

export function ChatWidget({ config = {} }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: defaultHashtagTechConfig.welcomeMessage,
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const prefersReducedMotion = useReducedMotion();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Merge config with defaults
  const fullConfig: ChatWidgetConfig = {
    ...defaultHashtagTechConfig,
    ...config,
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user" as const,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate agent response (in production, this would call an API)
    setTimeout(() => {
      const agentResponse = {
        id: (Date.now() + 1).toString(),
        content:
          "Thanks for your message! Our team will get back to you shortly.",
        sender: "agent" as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentResponse]);
    }, 1000);
  };

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Animation variants
  const slideUpVariants = prefersReducedMotion
    ? {
        closed: { opacity: 0, y: 0 },
        open: { opacity: 1, y: 0 },
      }
    : {
        closed: { opacity: 0, y: 100, scale: 0.8 },
        open: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        },
      };

  const fadeVariants = prefersReducedMotion
    ? {
        closed: { opacity: 0 },
        open: { opacity: 1 },
      }
    : {
        closed: { opacity: 0, scale: 0.8 },
        open: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.2,
          },
        },
      };



  return (
    <>
      {/* WhatsApp Button - Always visible when chat is closed, sits above the chat toggle */}
      <AnimatePresence>
        {!isOpen && (
          <WhatsAppButton 
            phoneNumber="+15551234567" // Sample number as requested
            message="Hi Hashtag Tech! I'd like to discuss a project."
            className="bottom-24 md:bottom-24 right-6 md:right-6"
          />
        )}
      </AnimatePresence>

      {/* Collapsed State - Floating Buttons */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={fadeVariants}
            className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
          >
            {/* Video Call Button (if enabled) */}
            {fullConfig.enableVideoCall && fullConfig.videoCallUrl && (
              <a
                href={fullConfig.videoCallUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Start video call"
              >
                <Video className="w-6 h-6 text-primary" />
              </a>
            )}

            {/* Chat Button with Magnetic Effect */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="group w-14 h-14 rounded-full bg-primary-deep shadow-lg flex items-center justify-center hover:scale-110 transition-transform overflow-hidden relative"
              aria-label="Open chat"
              style={{ backgroundColor: fullConfig.primaryColor }}
            >
              {/* Magnetic expanding circle */}
              <span 
                className="absolute rounded-full top-0 right-0 -translate-y-1/2 translate-x-1/2 w-0 h-0 opacity-0 bg-secondary transition-all duration-700 ease-out group-hover:w-[200px] group-hover:h-[200px] group-hover:opacity-100" 
                aria-hidden="true" 
              />
              <MessageCircle className="w-6 h-6 text-white relative z-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded State - Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40"
              aria-hidden="true"
            />

            {/* Chat Modal */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={slideUpVariants}
              className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3 text-white"
                style={{ backgroundColor: fullConfig.primaryColor }}
              >
                <div className="flex items-center gap-3">
                  {/* Company Logo */}
                  {fullConfig.companyLogo && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/20">
                      <Image
                        src={fullConfig.companyLogo}
                        alt={fullConfig.companyName}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">
                      {fullConfig.companyName}
                    </p>
                    <p className="text-xs opacity-90">Support Team</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Minimize Button */}
                  <button
                    type="button"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
                  >
                    {messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        agentAvatar={fullConfig.agentAvatar}
                        agentColor={fullConfig.primaryColor || "#F26B6B"}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Area */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-white border-t border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: fullConfig.primaryColor,
                          "--tw-ring-color": fullConfig.primaryColor,
                        } as React.CSSProperties}
                      />
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="p-2 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: fullConfig.primaryColor }}
                        aria-label="Send message"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Message Bubble Component
 */
function MessageBubble({
  message,
  agentAvatar,
  agentColor,
}: {
  message: ChatMessage;
  agentAvatar: string;
  agentColor: string;
}) {
  const isAgent = message.sender === "agent";

  return (
    <div className={cn("flex gap-3", isAgent ? "flex-row" : "flex-row-reverse")}>
      {/* Avatar */}
      {isAgent && (
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center border border-gray-200">
           {agentAvatar && agentAvatar !== "" && !agentAvatar.includes("sarah.jpg") ? (
             <Image src={agentAvatar} alt="Agent" fill className="object-cover" />
           ) : (
             <Bot className="w-5 h-5 text-gray-600" />
           )}
        </div>
      )}

      {/* Message */}
      <div
        className={cn(
          "max-w-[75%] px-4 py-2 rounded-2xl",
          isAgent
            ? "bg-blue-100 text-gray-900 rounded-tl-none"
            : "text-white rounded-tr-none",
          isAgent ? "" : "shadow-md"
        )}
        style={isAgent ? {} : { backgroundColor: agentColor }}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}

/**
 * Default export for dynamic import
 */
export default ChatWidget;
