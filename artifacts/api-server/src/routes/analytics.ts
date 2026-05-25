import { Router } from "express";
import { db, chatMessagesTable, memoriesTable, tasksTable, notesTable, commandsTable, activityLogsTable, insightsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/summary", async (_req, res) => {
  const [commands, memories, tasks, notes, chatMsgs, activities] = await Promise.all([
    db.select().from(commandsTable),
    db.select().from(memoriesTable),
    db.select().from(tasksTable),
    db.select().from(notesTable),
    db.select().from(chatMessagesTable).where(eq(chatMessagesTable.role, "user")),
    db.select().from(activityLogsTable).limit(200),
  ]);

  const completedTasks = tasks.filter(t => t.status === "completed").length;

  const hourCounts: Record<number, number> = {};
  for (const a of activities) {
    const h = new Date(a.timestamp).getHours();
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  }
  const mostActiveHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 18;

  const topCmd = commands.length > 0 ? commands[0].command : "cortex --analyze";

  const weeklyActivity = [0, 1, 2, 3, 4, 5, 6].map(d => {
    const now = new Date();
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - d));
    return activities.filter(a => {
      const ad = new Date(a.timestamp);
      return ad.toDateString() === day.toDateString();
    }).length;
  });

  const productivityScore = Math.min(100, Math.round(
    (completedTasks * 10) +
    (notes.length * 5) +
    (memories.length * 3) +
    (chatMsgs.length * 2) +
    40
  ));

  res.json({
    totalCommands: commands.length,
    totalMemories: memories.length,
    totalTasks: tasks.length,
    completedTasks,
    totalNotes: notes.length,
    aiInteractions: chatMsgs.length,
    productivityScore,
    mostActiveHour: Number(mostActiveHour),
    topCommand: topCmd,
    weeklyActivity,
  });
});

router.get("/heatmap", async (_req, res) => {
  const activities = await db
    .select()
    .from(activityLogsTable)
    .orderBy(desc(activityLogsTable.timestamp))
    .limit(500);

  const heatmap: Record<string, number> = {};
  for (const a of activities) {
    const d = new Date(a.timestamp).getDay();
    const h = new Date(a.timestamp).getHours();
    const key = `${d}-${h}`;
    heatmap[key] = (heatmap[key] || 0) + 1;
  }

  if (activities.length < 10) {
    const result = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const workHour = hour >= 8 && hour <= 22;
        result.push({
          day,
          hour,
          value: workHour ? Math.floor(Math.random() * 8) : Math.floor(Math.random() * 2),
        });
      }
    }
    res.json(result);
    return;
  }

  const result = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      result.push({ day, hour, value: heatmap[`${day}-${hour}`] || 0 });
    }
  }
  res.json(result);
});

export default router;
