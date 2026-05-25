import { exec } from "child_process";
  import path from "path";
  import app from "./app";
  import { logger } from "./lib/logger";

  const rawPort = process.env["PORT"];
  if (!rawPort) throw new Error("PORT is required");
  const port = Number(rawPort);
  if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT: "${rawPort}"`);

  // Bind port immediately so Render health check passes, then migrate in background
  app.listen(port, () => {
    logger.info({ port }, "Server listening");

    if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
      // import.meta.dirname = artifacts/api-server/dist/ → ../../.. = repo root
      const repoRoot = path.resolve(import.meta.dirname, "../../..");
      exec("pnpm --filter @workspace/db run push", { cwd: repoRoot }, (err) => {
        if (err) logger.error({ err }, "DB migration failed — server still running");
        else logger.info("DB migration complete");
      });
    }
  });
  