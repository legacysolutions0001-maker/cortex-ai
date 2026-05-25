import { useGetTasks, useCreateTask, useUpdateTask } from "@workspace/api-client-react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { useState } from "react";

export default function Tasks() {
  const { data: tasks } = useGetTasks();
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const [newTask, setNewTask] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    createMutation.mutate({ data: { title: newTask, priority: 'medium' } });
    setNewTask("");
  };

  const toggleStatus = (task: any) => {
    const next = task.status === 'completed' ? 'pending' : 'completed';
    updateMutation.mutate({ id: task.id, data: { status: next } });
  };

  const getPriorityColor = (p: string) => {
    if (p === 'critical') return "bg-destructive glow-destructive";
    if (p === 'high') return "bg-warning glow-warning";
    if (p === 'medium') return "bg-accent glow-accent";
    return "bg-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-glow tracking-widest text-primary">TASK INTELLIGENCE</h1>
      
      <form onSubmit={handleAdd} className="glass-panel p-4 rounded-xl flex gap-4">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Register new objective..."
          className="flex-1 bg-transparent border-none focus:outline-none font-mono text-lg text-primary placeholder:text-primary/30"
        />
        <button type="submit" className="px-6 py-2 bg-primary/20 text-primary border border-primary hover:bg-primary/40 rounded-md font-heading transition-all glow-primary">
          EXECUTE
        </button>
      </form>

      <div className="space-y-3">
        {tasks?.map(task => (
          <div key={task.id} className="glass-panel p-4 rounded-lg flex items-center justify-between hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-4">
              <button onClick={() => toggleStatus(task)} className="text-primary hover:text-primary/70 transition-colors">
                {task.status === 'completed' ? <CheckCircle2 className="w-6 h-6 text-success" /> : <Circle className="w-6 h-6" />}
              </button>
              <div>
                <div className={`font-mono text-lg ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(task.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-heading tracking-widest uppercase text-muted-foreground">{task.priority}</span>
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} animate-pulse`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
