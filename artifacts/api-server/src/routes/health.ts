import { Router, type IRouter } from "express";
  import { HealthCheckResponse } from "@workspace/api-zod";
  import { pool } from "@workspace/db";

  const router: IRouter = Router();

  router.get("/healthz", (_req, res) => {
    const data = HealthCheckResponse.parse({ status: "ok" });
    res.json(data);
  });

  const CREATE_STATEMENTS = [
    `CREATE TABLE IF NOT EXISTS chat_messages (id serial PRIMARY KEY, role text NOT NULL, content text NOT NULL, created_at timestamp NOT NULL DEFAULT now())`,
    `CREATE TABLE IF NOT EXISTS memories (id serial PRIMARY KEY, type text NOT NULL DEFAULT 'general', content text NOT NULL, importance integer NOT NULL DEFAULT 1, created_at timestamp NOT NULL DEFAULT now())`,
    `CREATE TABLE IF NOT EXISTS activity_logs (id serial PRIMARY KEY, action text NOT NULL, module text NOT NULL, details text, timestamp timestamp NOT NULL DEFAULT now())`,
    `CREATE TABLE IF NOT EXISTS tasks (id serial PRIMARY KEY, title text NOT NULL, description text, status text NOT NULL DEFAULT 'pending', priority text NOT NULL DEFAULT 'medium', due_date text, created_at timestamp NOT NULL DEFAULT now())`,
    `CREATE TABLE IF NOT EXISTS notes (id serial PRIMARY KEY, title text NOT NULL, content text NOT NULL DEFAULT '', tags text, created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now())`,
    `CREATE TABLE IF NOT EXISTS insights (id serial PRIMARY KEY, category text NOT NULL, title text NOT NULL, description text NOT NULL, confidence real NOT NULL DEFAULT 0.8, created_at timestamp NOT NULL DEFAULT now())`,
    `CREATE TABLE IF NOT EXISTS notifications (id serial PRIMARY KEY, type text NOT NULL DEFAULT 'info', title text NOT NULL, message text NOT NULL, read boolean NOT NULL DEFAULT false, created_at timestamp NOT NULL DEFAULT now())`,
    `CREATE TABLE IF NOT EXISTS commands (id serial PRIMARY KEY, command text NOT NULL, output text, status text NOT NULL DEFAULT 'success', executed_at timestamp NOT NULL DEFAULT now())`,
  ];

  export async function runMigrations(): Promise<{ ok: boolean; error?: string; tables?: string[] }> {
    const client = await pool.connect();
    const done: string[] = [];
    try {
      for (const sql of CREATE_STATEMENTS) {
        await client.query(sql);
        const match = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
        if (match) done.push(match[1]);
      }
      return { ok: true, tables: done };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, error: msg, tables: done };
    } finally {
      client.release();
    }
  }

  router.get("/migrate", async (_req, res) => {
    const result = await runMigrations();
    res.json(result);
  });

  export default router;
  