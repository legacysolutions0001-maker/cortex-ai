import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = [
      { delay: 800, step: 1 },
      { delay: 1500, step: 2 },
      { delay: 2200, step: 3 },
      { delay: 2900, step: 4 },
      { delay: 3500, step: 5 },
      { delay: 4500, step: 6 }, // Complete
    ];

    let timeouts: NodeJS.Timeout[] = [];
    
    sequence.forEach(({ delay, step }) => {
      timeouts.push(
        setTimeout(() => {
          setStep(step);
          if (step === 6) {
            onComplete();
          }
        }, delay)
      );
    });

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020817] text-white font-mono overflow-hidden">
      {/* Background Neural Pulse */}
      <AnimatePresence>
        {step >= 1 && step < 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[600px] h-[600px] rounded-full bg-primary/20 blur-[100px]"
          />
        )}
      </AnimatePresence>

      {/* Core Orb */}
      <AnimatePresence>
        {step >= 1 && step < 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            className="relative w-32 h-32 rounded-full border-2 border-primary/50 flex items-center justify-center glow-primary z-10"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-24 h-24 rounded-full bg-primary/40 blur-md"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t-2 border-primary"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Lines (SVG) */}
      <AnimatePresence>
        {step >= 2 && step < 6 && (
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute w-full h-full pointer-events-none z-0"
          >
            <motion.line x1="50" y1="50" x2="20" y2="20" stroke="rgba(59,130,246,0.3)" strokeWidth="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
            <motion.line x1="50" y1="50" x2="80" y2="20" stroke="rgba(59,130,246,0.3)" strokeWidth="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.1 }} />
            <motion.line x1="50" y1="50" x2="20" y2="80" stroke="rgba(59,130,246,0.3)" strokeWidth="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }} />
            <motion.line x1="50" y1="50" x2="80" y2="80" stroke="rgba(59,130,246,0.3)" strokeWidth="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3 }} />
            <motion.line x1="50" y1="50" x2="50" y2="10" stroke="rgba(139,92,246,0.3)" strokeWidth="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.15 }} />
            <motion.line x1="50" y1="50" x2="50" y2="90" stroke="rgba(139,92,246,0.3)" strokeWidth="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.25 }} />
            <motion.line x1="50" y1="50" x2="10" y2="50" stroke="rgba(6,182,212,0.3)" strokeWidth="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }} />
            <motion.line x1="50" y1="50" x2="90" y2="50" stroke="rgba(6,182,212,0.3)" strokeWidth="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3 }} />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Boot Text */}
      <div className="absolute bottom-24 left-12 text-sm text-primary/80 font-mono flex flex-col gap-1 z-20">
        {step >= 1 && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>&gt; Initializing Neural Cortex...</motion.div>}
        {step >= 2 && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>&gt; Synchronizing Digital Memory...</motion.div>}
        {step >= 3 && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>&gt; Loading Cognitive Systems...</motion.div>}
        {step >= 4 && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>&gt; Activating AI Core...</motion.div>}
        {step >= 5 && <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="text-success glow-success font-bold mt-2">&gt; CORTEX ONLINE.</motion.div>}
      </div>

      {/* Final Logo Reveal */}
      <AnimatePresence>
        {step >= 5 && step < 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex items-center justify-center bg-[#020817]/90 z-30 backdrop-blur-sm"
          >
            <h1 className="text-6xl md:text-8xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow tracking-[0.2em]">
              CORTEX AI
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
