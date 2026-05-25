import { Router } from "express";
import { db, notesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { CreateNoteBody, UpdateNoteBody, UpdateNoteParams, DeleteNoteParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const notes = await db
    .select()
    .from(notesTable)
    .orderBy(desc(notesTable.updatedAt));
  res.json(notes.map(n => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  })));
});

router.post("/", async (req, res) => {
  const parsed = CreateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const [note] = await db.insert(notesTable).values(parsed.data).returning();
  res.status(201).json({
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  });
});

router.patch("/:id", async (req, res) => {
  const paramsParsed = UpdateNoteParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateNoteBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const [note] = await db
    .update(notesTable)
    .set({ ...bodyParsed.data, updatedAt: new Date() })
    .where(eq(notesTable.id, paramsParsed.data.id))
    .returning();
  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }
  res.json({
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  });
});

router.delete("/:id", async (req, res) => {
  const parsed = DeleteNoteParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(notesTable).where(eq(notesTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
