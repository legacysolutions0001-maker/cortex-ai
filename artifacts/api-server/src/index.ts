import app from "./app";
  import { logger } from "./lib/logger";
  import { pool } from "@workspace/db";

  const rawPort = process.env["PORT"];
  if (!rawPort) throw new Error("PORT is required");
  const port = Number(rawPort);
  if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT: "${rawPort}"`);

  // Run CREATE TABLE IF NOT EXISTS for every table directly via the pg pool.
  // This is more reliable than exec("pnpm --filter @workspace/db run push") at runtime.
  async function runMigrations(): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id          serial    PRIMARY KEY,
          role        text      NOT NULL,
          content     text      NOT NULL,
          created_at  timestamp NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS memories (
          id          serial    PRIMARY KEY,
          type        text      NOT NULL DEFAULT 'general',
          content     text      NOT NULL,
          importance  integer   NOT NULL DEFAULT 1,
          created_at  timestamp NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS activity_logs (
          id          serial    PRIMARY KEY,
          action      text      NOT NULL,
          module      text      NOT NULL,
          details     text,
          timestamp   timestamp NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS tasks (
          id          serial    PRIMARY KEY,
          title       text      NOT NULL,
          description text,
          status      text      NOT NULL DEFAULT 'pending',
          priority    text      NOT NULL DEFAULT 'medium',
          due_date    text,
          created_at  timestamp NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS notes (
          id          serial    PRIMARY KEY,
          title       text      NOT NULL,
          content     text      NOT NULL DEFAULT '',
          tags        text,
          created_at  timestamp NOT NULL DEFAULT now(),
          updated_at  timestamp NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS insights (
          id          serial    PRIMARY KEY,
          category    text      NOT NULL,
          title       text      NOT NULL,
          description text      NOT NULL,
          confidence  real      NOT NULL DEFAULT 0.8,
          created_at  timestamp NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS notifications (
          id          serial    PRIMARY KEY,
          type        text      NOT NULL DEFAULT 'info',
          title       text      NOT NULL,
          message     text      NOT NULL,
          read        boolean   NOT NULL DEFAULT false,
          created_at  timestamp NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS commands (
          id          serial    PRIMARY KEY,
          command     text      NOT NULL,
          output      text,
          status      text      NOT NULL DEFAULT 'success',
          executed_at timestamp NOT NULL DEFAULT now()
        );
      `);
      logger.info("DB migration complete — all tables ready");
    } catch (err) {
      logger.error({ err }, "DB migration failed — server still running");
    } finally {
      client.release();
    }
  }

  // Bind port first — Render health check passes immediately.
  // Then migrate in the background (safe, idempotent, no external commands needed).
  app.listen(port, () => {
    logger.info({ port }, "Server listening");
    if (process.env.DATABASE_URL) {
      runMigrations().catch(err => logger.error({ err }, "Unexpected migration error"));
    }
  });
  