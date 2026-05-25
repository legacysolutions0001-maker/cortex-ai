import { useState, useRef, useEffect } from "react";
import { useGetChatMessages, useSendChatMessage } from "@workspace/api-client-react";
import { Send, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function Assistant() {
  const { data: messages } = useGetChatMessages();
  const sendMutation = useSendChatMessage();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMutation.isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMutation.isPending) return;
    sendMutation.mutate({ data: { content: input } });
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-panel rounded-xl overflow-hidden border border-primary/30">
      <div className="p-4 border-b border-primary/20 bg-[#020817]/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="text-primary w-5 h-5" />
          <span className="font-heading font-semibold text-primary tracking-widest text-glow">CORTEX INTERFACE</span>
        </div>
        <div className="flex gap-1">
          <motion.div animate={{ height: [10, 20, 10] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-primary/50" />
          <motion.div animate={{ height: [15, 25, 15] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 bg-primary/80" />
          <motion.div animate={{ height: [10, 18, 10] }} transition={{ repeat: Infinity, duration: 1.0 }} className="w-1 bg-primary/50" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages?.map((msg) => (
          <motion.div 
            key={msg.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-primary/20 border border-primary/50 text-foreground ml-12 rounded-tr-none' 
                : 'bg-secondary/10 border border-secondary/30 text-primary-foreground mr-12 rounded-tl-none font-mono text-sm'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {sendMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-secondary/10 border border-secondary/30 p-4 rounded-2xl rounded-tl-none flex gap-2">
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-2 h-2 bg-secondary rounded-full" />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-secondary rounded-full" />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-secondary rounded-full" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-[#020817]/90 border-t border-primary/20">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Awaiting command..."
            className="w-full bg-[#020817] border border-primary/30 rounded-lg py-3 px-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
          />
          <button 
            type="submit" 
            disabled={sendMutation.isPending || !input.trim()}
            className="absolute right-2 p-2 text-primary hover:text-primary-foreground hover:bg-primary/20 rounded-md transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
