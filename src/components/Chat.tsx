import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSRHChatResponse } from '../lib/gemini';
import { auth, db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

interface Message {
  id?: string;
  role: 'user' | 'model';
  content: string;
  createdAt?: Timestamp | Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! Habari! I'm your private SRH assistant. How can I help you today? You can ask about contraceptives, STIs, or clinic locations." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "Contraceptive options",
    "Missed my pill help",
    "STI symptoms",
    "Find nearby clinics"
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const responseText = await getSRHChatResponse([...messages, userMsg]);
      const aiMsg: Message = { role: 'model', content: responseText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white glass-card overflow-hidden">
      {/* Chat Header */}
      <div className="bg-sage-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold leading-none">Smart Assistant</h3>
            <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Online & Private</span>
          </div>
        </div>
        <button className="text-white/60 hover:text-white transition-colors">
          <Info size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-model'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="chat-bubble-model flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              <span className="text-xs italic text-slate-400">Typing...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {quickReplies.map((reply) => (
          <button
            key={reply}
            onClick={() => handleSend(reply)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-sage-50 text-sage-600 border border-sage-100 text-xs font-bold hover:bg-sage-600 hover:text-white transition-all active:scale-95"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-50 border-t border-sage-100">
        <form 
          className="flex gap-2"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-white border border-sage-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-600/20"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-sage-600 text-white p-3 rounded-2xl shadow-lg hover:bg-sage-700 disabled:opacity-50 disabled:grayscale transition-all active:scale-90"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
