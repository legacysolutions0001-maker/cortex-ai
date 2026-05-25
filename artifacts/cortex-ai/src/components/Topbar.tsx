import { Bell } from "lucide-react";
import { useLocation } from "wouter";
import { useHealthCheck } from "@workspace/api-client-react";

const routeNames: Record<string, string> = {
  "/": "Neural Dashboard",
  "/assistant": "AI Assistant",
  "/memory": "Memory Engine",
  "/analytics": "System Analytics",
  "/tasks": "Task Intelligence",
  "/notes": "Knowledge Base",
  "/system": "System Monitor",
  "/commands": "Command Terminal",
  "/insights": "AI Insights",
  "/notifications": "Alerts & Notifications",
};

export function Topbar() {
  const [location] = useLocation();
  const title = routeNames[location] || "CORTEX AI";
  const { data: health } = useHealthCheck({ query: { refetchInterval: 10000 } });

  return (
    <header className="h-16 border-b border-primary/20 bg-[#020817]/60 backdrop-blur-md flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-4">
        <h1 className="font-heading text-xl text-glow-accent text-accent font-semibold uppercase tracking-wider">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${health?.status === 'ok' ? 'bg-success glow-success' : 'bg-destructive glow-destructive'} animate-pulse`} />
          <span className="text-xs font-mono text-muted-foreground">
            {health?.status === 'ok' ? 'CORE STABLE' : 'CORE OFFLINE'}
          </span>
        </div>
        
        <div className="relative cursor-pointer hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full border border-[#020817]" />
        </div>
        
        <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-heading font-bold text-sm">
          OP
        </div>
      </div>
    </header>
  );
}
