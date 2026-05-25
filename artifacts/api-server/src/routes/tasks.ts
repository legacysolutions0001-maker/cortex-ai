import { Router } from "express";
import { db, tasksTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { CreateTaskBody, UpdateTaskBody, UpdateTaskParams, DeleteTaskParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const tasks = await db
    .select()
    .from(tasksTable)
    .orderBy(desc(tasksTable.createdAt));
  res.json(tasks.map(t => ({ ...t, createdAt: t.createdAt.toISOString() })));
});

router.post("/", async (req, res) => {
  const parsed = CreateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const [task] = await db.insert(tasksTable).values(parsed.data).returning();
  res.status(201).json({ ...task, createdAt: task.createdAt.toISOString() });
});

router.patch("/:id", async (req, res) => {
  const paramsParsed = UpdateTaskParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateTaskBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const [task] = await db
    .update(tasksTable)
    .set(bodyParsed.data)
    .where(eq(tasksTable.id, paramsParsed.data.id))
    .returning();
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json({ ...task, createdAt: task.createdAt.toISOString() });
});

router.delete("/:id", async (req, res) => {
  const parsed = DeleteTaskParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(tasksTable).where(eq(tasksTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
