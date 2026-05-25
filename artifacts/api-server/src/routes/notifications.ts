import { Router } from "express";
import { db, notificationsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { MarkNotificationReadParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const notifications = await db
    .select()
    .from(notificationsTable)
    .orderBy(desc(notificationsTable.createdAt));
  res.json(notifications.map(n => ({ ...n, createdAt: n.createdAt.toISOString() })));
});

router.patch("/:id/read", async (req, res) => {
  const parsed = MarkNotificationReadParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [notification] = await db
    .update(notificationsTable)
    .set({ read: true })
    .where(eq(notificationsTable.id, parsed.data.id))
    .returning();
  if (!notification) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }
  res.json({ ...notification, createdAt: notification.createdAt.toISOString() });
});

export default router;
