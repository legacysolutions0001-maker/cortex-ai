import { useGetMemories } from "@workspace/api-client-react";
import { Brain, Database, Network } from "lucide-react";
import { motion } from "framer-motion";

export default function Memory() {
  const { data: memories } = useGetMemories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-primary/20 pb-4">
        <Database className="w-8 h-8 text-secondary glow-secondary" />
        <h1 className="font-heading text-2xl text-glow tracking-widest text-primary">MEMORY ENGINE</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories?.map((memory, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={memory.id}
            className="glass-panel p-6 rounded-xl border border-secondary/20 hover:border-secondary/50 transition-colors relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-secondary">
                <Brain className="w-5 h-5" />
                <span className="font-mono text-sm uppercase">{memory.type}</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className={`w-1.5 h-4 rounded-sm ${j < memory.importance ? 'bg-secondary glow-secondary' : 'bg-muted'}`} />
                ))}
              </div>
            </div>
            
            <p className="text-foreground/90 font-medium leading-relaxed">
              {memory.content}
            </p>
            
            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>IDX: {memory.id.toString().padStart(4, '0')}</span>
              <div className="flex items-center gap-1">
                <Network className="w-3 h-3" />
                <span>SYNCED</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
