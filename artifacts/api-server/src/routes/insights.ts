import { Router } from "express";
import { db, insightsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  const insights = await db
    .select()
    .from(insightsTable)
    .orderBy(desc(insightsTable.createdAt));
  res.json(insights.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
});

export default router;
