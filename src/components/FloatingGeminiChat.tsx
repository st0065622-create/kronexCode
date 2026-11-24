import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Bot, User, X, Trash2, Copy, Check, RefreshCw, 
  Paperclip, Globe, Zap, Cpu, Maximize2, Minimize2, ChevronDown, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/sound';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  isGrounding?: boolean;
}

interface FloatingGeminiChatProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: (view: string, tab?: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hello! I am your Gemini 3.6 Flash AI assistant. How can I help you build workflows, generate code, or explore KRONEX AI today?',
    timestamp: 'Just now',
    model: 'gemini-3.6-flash'
  }
];

const PROMPT_SUGGESTIONS = [
  '⚡ Create an AI Workflow',
  '🧠 Explain Gemini 3.6 Pro',
  '💻 Write TypeScript Hook',
  '🔍 Search Google Grounding'
];

export default function FloatingGeminiChat({ isOpen, onToggle, onNavigate }: FloatingGeminiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.6-flash');
  const [searchGrounding, setSearchGrounding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundManager.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Chat session cleared. How can Gemini assist you next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel
      }
    ]);
    soundManager.playMenuClose();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || inputPrompt).trim();
    if (!promptText || isLoading) return;

    soundManager.playMessageSent();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      // Simulate/call Gemini response with high fidelity
      let aiResponseText = '';
      const lower = promptText.toLowerCase();

      if (lower.includes('workflow') || lower.includes('node') || lower.includes('pipeline')) {
        aiResponseText = `**Gemini AI Workflow Recommendation:**\n\nYou can use our new **Visual Node-based Workflow Builder** to connect Gemini 2.5 Flash with custom agents and Pinecone vector stores.\n\nKey advantages:\n- Real-time execution console\n- Multi-agent orchestrations\n- Automatic token tracking`;
        if (onNavigate) {
          setTimeout(() => onNavigate('dashboard', 'workflow-builder'), 1500);
        }
      } else if (lower.includes('code') || lower.includes('typescript') || lower.includes('react')) {
        aiResponseText = `Here is an optimized React hook for state management with sound effects:\n\`\`\`typescript\nimport { useState, useCallback } from 'react';\nimport { soundManager } from './utils/sound';\n\nexport function useSoundState<T>(initialValue: T) {\n  const [state, setState] = useState<T>(initialValue);\n  const setSoundState = useCallback((val: T) => {\n    soundManager.playClick();\n    setState(val);\n  }, []);\n  return [state, setSoundState] as const;\n}\n\`\`\``;
      } else if (lower.includes('search') || lower.includes('grounding') || searchGrounding) {
        aiResponseText = `**Google Search Grounded Result:**\n\nAccording to real-time search data, **Gemini 3.6 Flash** and **Gemini 3.1 Pro** provide state-of-the-art multimodal reasoning, zero-latency streaming, and built-in search grounding tools.`;
      } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        aiResponseText = `Hello! I'm your dedicated Gemini AI Assistant. Ask me anything about building AI agents, writing code, or running multi-model sandboxes!`;
      } else {
        aiResponseText = `**Gemini 3.6 Response:**\n\nRegarding "${promptText}": KRONEX AI platform enables high-density cognitive processing, autonomous agent loops, and seamless tool execution with sub-50ms response times.`;
      }

      setTimeout(() => {
        soundManager.playMessageReceived();
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: selectedModel,
          isGrounding: searchGrounding
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
      }, 900);

    } catch (error) {
      setIsLoading(false);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered a temporary connection glitch. Please retry your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="relative">
      {/* Expanded Floating Gemini Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-24 right-6 z-50 ${
              isExpanded ? 'w-[90vw] sm:w-[600px] h-[650px]' : 'w-88 sm:w-[420px] h-[520px]'
            } bg-[#0B0F19]/95 border border-[#7C5CFF]/40 rounded-3xl p-4 shadow-[0_20px_60px_rgba(124,92,255,0.25)] backdrop-blur-2xl flex flex-col justify-between overflow-hidden transition-all duration-300`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                  <div className="w-full h-full bg-[#0B0F19] rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#00D4FF] animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-[#F8FAFC]">Gemini AI Chatbot</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 text-[#00D4FF] text-[9px] font-mono font-bold">
                      PRO
                    </span>
                  </div>
                  <p className="text-[10px] text-[#94A3B8] font-mono">Multi-turn Cognitive Assistant</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handleClearHistory}
                  title="Clear Chat"
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Collapse' : 'Expand'}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={onToggle}
                  title="Close Gemini Chat"
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Model & Search Bar Settings */}
            <div className="py-2 flex items-center justify-between text-[10px] font-mono shrink-0 border-b border-white/[0.05]">
              <div className="flex items-center space-x-1.5">
                <Cpu className="w-3 h-3 text-[#00D4FF]" />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-[#131A2E] text-[#F8FAFC] border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-[#00D4FF] text-[10px]"
                >
                  <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                  <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
                  <option value="gemini-3.1-flash-lite">Gemini 3.1 Lite</option>
                </select>
              </div>

              <button
                onClick={() => setSearchGrounding(!searchGrounding)}
                className={`px-2.5 py-1 rounded-lg border font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                  searchGrounding
                    ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF]'
                    : 'bg-white/5 border-white/10 text-[#94A3B8] hover:text-white'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Search: {searchGrounding ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar my-2 space-y-3 pr-1 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${
                    msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                      msg.role === 'user'
                        ? 'bg-[#7C5CFF]/20 border-[#7C5CFF]/40 text-[#7C5CFF]'
                        : 'bg-[#00D4FF]/20 border-[#00D4FF]/40 text-[#00D4FF]'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[82%] p-3 rounded-2xl relative group ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#7C5CFF] to-[#6366F1] text-white font-medium rounded-tr-xs'
                        : 'bg-[#131A2E]/90 border border-white/[0.08] text-[#F8FAFC] rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[9px] text-white/50 font-mono">
                      <span>{msg.timestamp}</span>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="p-1 hover:text-white transition-colors cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-[#00D4FF] text-xs font-mono p-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar pb-2 shrink-0">
              {PROMPT_SUGGESTIONS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip.replace(/^[^\w\s]+/, '').trim())}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-[#CBD5E1] whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative shrink-0 flex items-center bg-[#131A2E] border border-white/10 rounded-2xl p-1.5 focus-within:border-[#00D4FF] transition-all"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask Gemini AI anything..."
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
              />

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="p-2 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white disabled:opacity-40 transition-all cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glowing Gemini Chat Button (Side by side with Mic Icon) */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          onToggle();
          soundManager.playClick();
        }}
        className={`relative w-[56px] h-[56px] rounded-2xl border shadow-xl flex items-center justify-center transition-all duration-200 cursor-pointer group backdrop-blur-xl ${
          isOpen
            ? 'bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] border-white/40 text-white shadow-[0_0_25px_rgba(0,212,255,0.6)]'
            : 'bg-[#131A2E]/80 border-white/15 hover:border-[#7C5CFF]/60 text-[#F8FAFC] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
        }`}
        title="Gemini AI Chatbot"
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#7C5CFF]/20 to-[#00D4FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#00D4FF] group-hover:scale-110 transition-transform duration-200" />
        </div>

        {/* Badge indicator */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D4FF]"></span>
        </span>
      </motion.button>
    </div>
  );
}
