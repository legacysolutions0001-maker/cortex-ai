import { useGetAnalyticsSummary, useGetActivityHeatmap } from "@workspace/api-client-react";
import { Activity, BarChart3, Target, Zap } from "lucide-react";

export default function Analytics() {
  const { data: summary } = useGetAnalyticsSummary();

  const metrics = [
    { label: "PRODUCTIVITY", value: `${summary?.productivityScore ?? 0}%`, icon: Target, color: "text-success" },
    { label: "AI INTERACTIONS", value: summary?.aiInteractions ?? 0, icon: Zap, color: "text-accent" },
    { label: "COMPLETED TASKS", value: summary?.completedTasks ?? 0, icon: Activity, color: "text-primary" },
    { label: "TOTAL MEMORIES", value: summary?.totalMemories ?? 0, icon: BarChart3, color: "text-secondary" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-glow tracking-widest text-primary">SYSTEM ANALYTICS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="glass-panel p-6 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{m.label}</span>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <div className={`text-3xl font-heading font-bold ${m.color} text-glow`}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl min-h-[300px] flex flex-col">
          <h2 className="font-heading text-lg mb-6 text-primary border-b border-primary/20 pb-2">WEEKLY THROUGHPUT</h2>
          <div className="flex-1 flex items-end gap-2 justify-between mt-4">
            {summary?.weeklyActivity?.map((val, i) => (
              <div key={i} className="w-1/7 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-primary/30 rounded-t-sm transition-all group-hover:bg-primary glow-primary"
                  style={{ height: `${Math.max(10, val * 2)}px` }}
                />
                <span className="font-mono text-xs text-muted-foreground">D{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h2 className="font-heading text-lg mb-6 text-secondary border-b border-secondary/20 pb-2">BEHAVIORAL INSIGHTS</h2>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center p-3 bg-secondary/10 rounded border border-secondary/20">
              <span className="text-muted-foreground">Peak Active Hour</span>
              <span className="text-secondary font-bold">{summary?.mostActiveHour ?? 0}:00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-accent/10 rounded border border-accent/20">
              <span className="text-muted-foreground">Top Command</span>
              <span className="text-accent font-bold">{summary?.topCommand ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded border border-primary/20">
              <span className="text-muted-foreground">Database Notes</span>
              <span className="text-primary font-bold">{summary?.totalNotes ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
