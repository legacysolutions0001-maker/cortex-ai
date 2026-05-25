import { useGetInsights } from "@workspace/api-client-react";
import { Lightbulb, Sparkles, TrendingUp } from "lucide-react";

export default function Insights() {
  const { data: insights } = useGetInsights();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-glow tracking-widest text-accent flex items-center gap-3">
        <Sparkles className="w-6 h-6" />
        AI INSIGHTS
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights?.map(insight => (
          <div key={insight.id} className="glass-panel p-6 rounded-xl border border-accent/20 relative overflow-hidden group hover:border-accent transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full blur-2xl" />
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/30 text-accent text-xs font-mono">
                <Lightbulb className="w-3 h-3" />
                {insight.category}
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-success">
                <TrendingUp className="w-3 h-3" />
                {insight.confidence}% CONF
              </div>
            </div>

            <h3 className="text-xl font-heading text-foreground mb-2 relative z-10">{insight.title}</h3>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
