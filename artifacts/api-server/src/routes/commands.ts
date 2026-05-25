import { Router } from "express";
import { db, commandsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { ExecuteCommandBody } from "@workspace/api-zod";

const router = Router();

const COMMAND_OUTPUTS: Record<string, string> = {
  "open browser": "Browser launched. Neural interface connected.",
  "tell time": `Current neural timestamp: ${new Date().toLocaleTimeString()}`,
  "show cpu": "CPU utilization scan complete. Reporting to dashboard.",
  "open calculator": "Quantum calculator module initialized.",
  "search files": "File search protocol activated. Scanning memory banks...",
  "activate focus mode": "Focus Mode engaged. Distractions filtered. Cognitive bandwidth optimized.",
  "study mode": "Study Protocol initiated. Memory consolidation enhanced by 40%.",
  "productivity analysis": "Running productivity analytics... Score: 87/100. Peak hours: 18:00-21:00.",
  "cortex status": "All systems nominal. Neural core at 97% efficiency.",
  "help": "Available commands: open browser, tell time, show cpu, search files, activate focus mode, study mode, productivity analysis, cortex status",
};

router.get("/", async (_req, res) => {
  const commands = await db
    .select()
    .from(commandsTable)
    .orderBy(desc(commandsTable.executedAt))
    .limit(50);
  res.json(commands.map(c => ({ ...c, executedAt: c.executedAt.toISOString() })));
});

router.post("/", async (req, res) => {
  const parsed = ExecuteCommandBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { command } = parsed.data;
  const lowerCmd = command.toLowerCase().trim();
  const output = COMMAND_OUTPUTS[lowerCmd] ?? `Command executed: ${command}. Neural processing complete.`;

  const [cmd] = await db
    .insert(commandsTable)
    .values({ command, output, status: "success" })
    .returning();

  res.json({ ...cmd, executedAt: cmd.executedAt.toISOString() });
});

export default router;
