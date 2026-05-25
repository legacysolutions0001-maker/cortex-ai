import { useGetSystemStats } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function System() {
  const { data: stats } = useGetSystemStats({ query: { refetchInterval: 3000 } });

  const getGaugeColor = (val: number) => {
    if (val >= 80) return "text-destructive stroke-destructive";
    if (val >= 60) return "text-warning stroke-warning";
    return "text-success stroke-success";
  };

  const renderGauge = (label: string, value: number, desc: string) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    const colorClass = getGaugeColor(value);

    return (
      <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center gap-4">
        <h3 className="font-heading text-muted-foreground">{label}</h3>
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
            <motion.circle 
              cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
              className={colorClass}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className={`absolute text-2xl font-bold font-mono ${colorClass.split(' ')[0]}`}>{Math.round(value)}%</div>
        </div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-glow tracking-widest text-primary">SYSTEM MONITOR</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderGauge("CPU USAGE", stats?.cpu ?? 0, "Neural Processing Unit")}
        {renderGauge("MEMORY ALLOC", stats?.ram ?? 0, `${stats?.ramUsed ?? 0}GB / ${stats?.ramTotal ?? 0}GB`)}
        {renderGauge("DATA CORE", stats?.disk ?? 0, `${stats?.diskUsed ?? 0}TB / ${stats?.diskTotal ?? 0}TB`)}
        {renderGauge("THERMAL", stats?.temperature ?? 0, "Core Temperature (°C)")}
      </div>

      <div className="glass-panel rounded-xl p-6">
        <h2 className="font-heading text-lg mb-4 text-primary">SYSTEM VITALS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
          <div className="bg-[#020817]/50 p-4 rounded border border-primary/10">
            <div className="text-muted-foreground mb-1">NETWORK LATENCY</div>
            <div className="text-xl text-success">{stats?.network ?? 0} ms</div>
          </div>
          <div className="bg-[#020817]/50 p-4 rounded border border-primary/10">
            <div className="text-muted-foreground mb-1">POWER CELL</div>
            <div className="text-xl text-accent">{stats?.battery ?? 0}%</div>
          </div>
          <div className="bg-[#020817]/50 p-4 rounded border border-primary/10">
            <div className="text-muted-foreground mb-1">UPTIME</div>
            <div className="text-xl text-secondary">{stats?.uptime ?? 0} hrs</div>
          </div>
          <div className="bg-[#020817]/50 p-4 rounded border border-primary/10">
            <div className="text-muted-foreground mb-1">PROCESSES</div>
            <div className="text-xl text-primary">{stats?.processes ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
