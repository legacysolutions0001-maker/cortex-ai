import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const commandsTable = pgTable("commands", {
  id: serial("id").primaryKey(),
  command: text("command").notNull(),
  output: text("output"),
  status: text("status").notNull().default("success"),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
});

export const insertCommandSchema = createInsertSchema(commandsTable).omit({ id: true, executedAt: true });
export type InsertCommand = z.infer<typeof insertCommandSchema>;
export type Command = typeof commandsTable.$inferSelect;
