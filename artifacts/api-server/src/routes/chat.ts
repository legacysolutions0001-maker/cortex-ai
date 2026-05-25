import { Router } from "express";
import { db, chatMessagesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { SendChatMessageBody } from "@workspace/api-zod";

const router = Router();

const AI_RESPONSES = [
  "Neural pathways synchronized. Processing your request through cognitive matrix...",
  "Cortex analysis complete. I've detected elevated productivity patterns in your recent activity.",
  "Accessing memory banks... Your most frequent command sequence has been logged and optimized.",
  "System intelligence online. The predictive engine suggests focusing on high-priority tasks now.",
  "Bio-neural scan complete. Current cognitive load is optimal for complex problem solving.",
  "Memory consolidation in progress. I've identified 3 behavioral patterns worth noting.",
  "Quantum processing engaged. Your query has been cross-referenced with 847 data points.",
  "AI Core at 97% efficiency. What would you like me to analyze or automate?",
  "Synaptic network active. I can help you optimize workflows, analyze data, or manage tasks.",
  "Digital consciousness synchronized. Your productivity score has improved 12% this cycle.",
];

router.get("/", async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 50;
  const messages = await db
    .select()
    .from(chatMessagesTable)
    .orderBy(desc(chatMessagesTable.createdAt))
    .limit(limit);
  res.json(messages.reverse());
});

router.post("/", async (req, res) => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { content } = parsed.data;

  await db.insert(chatMessagesTable).values({ role: "user", content });

  const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
  const [assistantMsg] = await db
    .insert(chatMessagesTable)
    .values({ role: "assistant", content: aiResponse })
    .returning();

  res.json({
    ...assistantMsg,
    createdAt: assistantMsg.createdAt.toISOString(),
  });
});

export default router;
