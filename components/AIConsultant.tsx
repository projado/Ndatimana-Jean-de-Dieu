import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageSquare } from 'lucide-react';
import { chatWithConsultant } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIConsultant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Muraho! I'm the Projado Edu AI Assistant. I can help you with university options, visa requirements for Rwandans, or scholarship advice. What's on your mind today?",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithConsultant(userMsg.text, history);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] md:w-[400px] h-[500px] rounded-2xl shadow-2xl flex flex-col mb-4 border border-slate-200 overflow-hidden">
          {/* Header - Red Brick Theme */}
          <div className="bg-red-900 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Projado Assistant</h3>
                <p className="text-xs text-red-200">Online • AI Powered</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-red-800 text-white rounded-br-none'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about visas, universities..."
                className="flex-1 p-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800 border-none"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-red-800 text-white p-2 rounded-lg hover:bg-red-900 disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button - Red Brick */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-900 hover:bg-red-950 text-white p-4 rounded-full shadow-lg shadow-red-900/30 transition-transform hover:scale-110 flex items-center gap-2 font-semibold"
        >
          <MessageSquare size={24} />
          <span className="hidden md:inline">Ask Projado AI</span>
        </button>
      )}
    </div>
  );
};