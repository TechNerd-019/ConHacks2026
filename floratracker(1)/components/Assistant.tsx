import React, { useState, useRef, useEffect } from 'react';
import { Send, Droplets, ArrowUp } from 'lucide-react';
import { Message } from '../types.ts';
import { motion } from 'motion/react';

interface AssistantProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function Assistant({ messages, onSendMessage }: AssistantProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-background-primary relative">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-8 pb-40"
      >
        <div className="flex justify-center mb-4">
          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full uppercase tracking-widest">TODAY</span>
        </div>

        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {message.role === 'bot' && (
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-2">Flora Assistant</span>
            )}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`max-w-[85%] px-5 py-4 rounded-[24px] shadow-sm leading-relaxed text-sm font-medium ${
                message.role === 'user'
                  ? 'bg-primary-container text-white rounded-br-none'
                  : 'bg-inverse-primary text-text-primary rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </motion.div>
          </div>
        ))}

        <div className="flex gap-2">
           <button className="bg-white border border-zinc-100 text-text-primary text-xs font-bold px-5 py-3 rounded-full shadow-sm flex items-center gap-2 hover:bg-zinc-50 transition-colors">
             <Droplets className="w-4 h-4 text-primary-container" />
             Log Watering Now
           </button>
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-5 py-4 bg-white/80 backdrop-blur-md border-t border-zinc-100 z-40">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-zinc-100 border-none rounded-full py-4 pl-6 pr-14 text-sm font-medium focus:ring-2 focus:ring-primary-container/20 outline-none transition-all"
            placeholder="Ask about your plants..."
          />
          <button 
            type="submit"
            className="absolute right-1.5 top-1.5 w-11 h-11 bg-primary-container text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-md"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
