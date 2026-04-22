"use client"

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, Send, Loader2, ChevronDown, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentName?: string;
  agentType?: string;
  timestamp: Date;
}

interface ChatTabProps {
  simulationData: any[]; // Posts for agent list
  onNewSimulation?: () => void;
}

export default function ChatTab({ simulationData }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('ReportAgent (Global View)');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const agents = [
    'ReportAgent (Global View)',
    ...(simulationData.slice(0, 10).map((post: any) => `${post.agentName} (${post.agentType})` || 'Agent')),
  ].filter((agent, index, self) => self.indexOf(agent) === index);

  const suggestions = [
    "What was the turning point?",
    "Which actor was most influential?", 
    "What could have changed the outcome?",
    "Summarize the final consensus",
    "What risks remain unaddressed?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          agentName: selectedAgent.includes('ReportAgent') ? 'ReportAgent' : selectedAgent.split(' (')[0],
          agentType: selectedAgent.includes('(') ? selectedAgent.split(' (')[1].slice(1, -1) : undefined,
          simulationData,
        }),
      });

      if (!response.ok) throw new Error('Chat API failed');

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        agentName: selectedAgent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't process that. Try asking about the simulation or agents.",
        agentName: selectedAgent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, selectedAgent, simulationData, isLoading]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-black/30 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-black/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00f5d4] to-white bg-clip-text text-transparent mb-1">
              Interrogate the Simulation
            </h1>
            <p className="text-white/60">Ask the world what it thinks, or interview individual agents</p>
          </div>
          <select 
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="flex-1 md:flex-none bg-black/50 border border-white/20 text-white rounded-xl px-4 py-2 focus:border-[#00f5d4] focus:outline-none focus:ring-2 focus:ring-[#00f5d4]/30"
          >
            {agents.map(agent => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pr-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-white/50">
            <MessageCircle className="w-24 h-24 mb-8 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">Start a conversation</h3>
            <p>Choose an agent and ask about the simulation</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-3xl",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg font-bold text-xs ${agentColors[message.agentType || 'neutral'] || 'bg-gray-500'}`}>
                  {message.agentName?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className={cn(
                "p-6 rounded-2xl max-w-2xl flex-shrink-0 shadow-xl",
                message.role === 'user' 
                  ? "bg-gradient-to-r from-[#00f5d4] to-cyan-400 text-black" 
                  : "bg-black/50 backdrop-blur-xl border border-white/20"
              )}>
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <span className="font-bold text-white truncate max-w-max">{message.agentName}</span>
                    {message.agentType && (
                      <span className={`px-2 py-px rounded-full text-xs font-mono capitalize ${agentColors[message.agentType]}`}>
                        {message.agentType}
                      </span>
                    )}
                  </div>
                )}
                <ReactMarkdown 
                  className={cn(
                    "prose prose-sm max-w-none leading-relaxed",
                    message.role === 'user' ? "prose-invert text-black/90" : "prose-invert text-white/90"
                  )}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-6"
          >
            <div className="w-10 h-10 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center flex-shrink-0">
              <div className="flex gap-1">
                <motion.div className="w-2 h-2 bg-white/60 rounded-full" animate={{ opacity: [0.4, 1] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0 }} />
                <motion.div className="w-2 h-2 bg-white/60 rounded-full" animate={{ opacity: [0.4, 1] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} />
                <motion.div className="w-2 h-2 bg-white/60 rounded-full" animate={{ opacity: [0.4, 1] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} />
              </div>
            </div>
            <div className="text-white/80">ReportAgent is typing...</div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/10 bg-black/20">
        <div className="flex items-end gap-3 mb-4">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about this scenario..."
            className="flex-1 bg-black/50 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-white/50 focus:border-[#00f5d4] focus:outline-none focus:ring-2 focus:ring-[#00f5d4]/30 resize-none"
            disabled={isLoading}
          />
          <motion.button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gradient-to-r from-[#00f5d4] to-cyan-400 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>

        {showSuggestions && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <motion.button
                key={suggestion}
                onClick={() => useSuggestion(suggestion)}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-white/10 border border-white/30 text-white/80 text-sm rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all font-mono"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

