import { Router } from "express";
import { db, activityLogsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { LogActivityBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 100;
  const logs = await db
    .select()
    .from(activityLogsTable)
    .orderBy(desc(activityLogsTable.timestamp))
    .limit(limit);
  res.json(logs.map(l => ({ ...l, timestamp: l.timestamp.toISOString() })));
});

router.post("/", async (req, res) => {
  const parsed = LogActivityBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const [log] = await db.insert(activityLogsTable).values(parsed.data).returning();
  res.status(201).json({ ...log, timestamp: log.timestamp.toISOString() });
});

export default router;
