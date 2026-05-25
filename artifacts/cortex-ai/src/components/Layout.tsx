import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { NeuralBackground } from "./NeuralBackground";
import { BootSequence } from "./BootSequence";
import { motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [booting, setBooting] = useState(true);

  if (booting) {
    return <BootSequence onComplete={() => setBooting(false)} />;
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground selection:bg-primary/30">
      <NeuralBackground />
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
