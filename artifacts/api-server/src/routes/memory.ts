import { Router } from "express";
import { db, memoriesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { CreateMemoryBody, DeleteMemoryParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const memories = await db
    .select()
    .from(memoriesTable)
    .orderBy(desc(memoriesTable.createdAt));
  res.json(memories.map(m => ({ ...m, createdAt: m.createdAt.toISOString() })));
});

router.post("/", async (req, res) => {
  const parsed = CreateMemoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const [memory] = await db.insert(memoriesTable).values(parsed.data).returning();
  res.status(201).json({ ...memory, createdAt: memory.createdAt.toISOString() });
});

router.delete("/:id", async (req, res) => {
  const parsed = DeleteMemoryParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(memoriesTable).where(eq(memoriesTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
