import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  Activity, 
  BrainCircuit, 
  Database, 
  LayoutDashboard, 
  MessageSquare, 
  Terminal, 
  CheckSquare, 
  FileText,
  Lightbulb,
  Bell
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/assistant", label: "AI Assistant", icon: MessageSquare },
  { path: "/memory", label: "Memory Engine", icon: Database },
  { path: "/analytics", label: "Analytics", icon: Activity },
  { path: "/tasks", label: "Tasks", icon: CheckSquare },
  { path: "/notes", label: "Notes", icon: FileText },
  { path: "/system", label: "System", icon: BrainCircuit },
  { path: "/commands", label: "Terminal", icon: Terminal },
  { path: "/insights", label: "Insights", icon: Lightbulb },
  { path: "/notifications", label: "Notifications", icon: Bell },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 h-full border-r border-primary/20 bg-[#020817]/80 backdrop-blur-md flex flex-col z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-primary glow-primary flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
        </div>
        <span className="font-heading font-bold text-xl text-glow tracking-widest">CORTEX</span>
      </div>
      
      <nav className="flex-1 px-4 flex flex-col gap-2 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div className={`relative flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-white hover:bg-primary/10'}`}>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-primary/10 rounded-md border border-primary/30 glow-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-glow' : ''}`} />
                <span className="font-medium relative z-10">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-primary/20">
        <div className="flex items-center gap-3 px-4 py-2 bg-black/50 rounded-md border border-primary/10">
          <div className="w-2 h-2 rounded-full bg-success glow-success animate-pulse" />
          <span className="text-xs text-muted-foreground font-mono">SYSTEM ONLINE</span>
        </div>
      </div>
    </div>
  );
}
