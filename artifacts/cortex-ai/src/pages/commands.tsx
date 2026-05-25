import { useState, useRef, useEffect } from "react";
import { useGetCommands, useExecuteCommand } from "@workspace/api-client-react";
import { Terminal } from "lucide-react";

export default function Commands() {
  const { data: commands } = useGetCommands();
  const executeMutation = useExecuteCommand();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commands]);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeMutation.mutate({ data: { command: input } });
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-[#020817] rounded-xl overflow-hidden border border-primary/30 font-mono">
      <div className="p-3 border-b border-primary/20 bg-primary/5 flex items-center gap-3">
        <Terminal className="text-primary w-5 h-5" />
        <span className="text-primary tracking-widest">CORTEX_TERMINAL // ROOT</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-success text-sm">
          CORTEX OS v10.4.2 [Initialized]<br/>
          Type a command to execute or 'help' for available commands.
        </div>
        
        {commands?.map((cmd) => (
          <div key={cmd.id} className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <span>$</span>
              <span>{cmd.command}</span>
            </div>
            {cmd.output && (
              <div className={`pl-4 whitespace-pre-wrap text-sm ${cmd.status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
                {cmd.output}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleExecute} className="p-4 border-t border-primary/20 flex items-center gap-2 text-primary bg-primary/5">
        <span>$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none focus:outline-none text-foreground"
          autoFocus
        />
      </form>
    </div>
  );
}
