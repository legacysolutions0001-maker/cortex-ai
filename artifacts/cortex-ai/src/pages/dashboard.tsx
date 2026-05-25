import { useGetSystemStats, useGetActivityLogs, useGetTasks } from "@workspace/api-client-react";
import { Activity, Cpu, HardDrive, MemoryStick } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: stats } = useGetSystemStats({ query: { refetchInterval: 3000 } });
  const { data: logs } = useGetActivityLogs({ limit: 5 });
  const { data: tasks } = useGetTasks();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "CPU CORE", value: `${stats?.cpu ?? 0}%`, icon: Cpu, color: "text-primary" },
          { label: "NEURAL RAM", value: `${stats?.ram ?? 0}%`, icon: MemoryStick, color: "text-secondary" },
          { label: "STORAGE", value: `${stats?.disk ?? 0}%`, icon: HardDrive, color: "text-accent" },
          { label: "NETWORK", value: `${stats?.network ?? 0}ms`, icon: Activity, color: "text-success" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 rounded-xl flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg bg-[#020817] border border-primary/20 ${stat.color} glow-primary`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
              <div className={`text-2xl font-heading font-bold ${stat.color} text-glow`}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 min-h-[400px] flex flex-col relative overflow-hidden">
          <h2 className="font-heading text-lg text-primary mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            CORE ACTIVITY
          </h2>
          <div className="flex-1 flex flex-col gap-4">
            {logs?.map((log, i) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-md bg-[#020817]/50 border border-primary/10"
              >
                <div className="w-1.5 h-1.5 rounded-full mt-2 bg-primary glow-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">{log.action}</div>
                  <div className="text-xs text-muted-foreground font-mono">{log.module} • {new Date(log.timestamp).toLocaleTimeString()}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6 flex flex-col">
          <h2 className="font-heading text-lg text-secondary mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            ACTIVE PROCESSES
          </h2>
          <div className="flex-1 flex flex-col gap-3">
            {tasks?.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-md bg-[#020817]/50 border border-primary/10">
                <div className="text-sm truncate pr-4">{task.title}</div>
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'critical' ? 'bg-destructive glow-destructive' :
                  task.priority === 'high' ? 'bg-warning glow-warning' :
                  task.priority === 'medium' ? 'bg-accent glow-accent' :
                  'bg-muted-foreground'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
