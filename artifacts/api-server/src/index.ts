import { exec } from "child_process";
  import path from "path";
  import { fileURLToPath } from "url";
  import app from "./app";
  import { logger } from "./lib/logger";

  const rawPort = process.env["PORT"];
  if (!rawPort) throw new Error("PORT environment variable is required but was not provided.");
  const port = Number(rawPort);
  if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);

  app.listen(port, (err) => {
    if (err) { logger.error({ err }, "Error listening on port"); process.exit(1); }
    logger.info({ port }, "Server listening");

    if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
      const repoRoot = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "../../..");
      logger.info({ repoRoot }, "Running database migration...");
      exec("pnpm --filter @workspace/db run push", { cwd: repoRoot }, (error) => {
        if (error) logger.error({ error }, "DB migration failed");
        else logger.info("DB migration complete");
      });
    }
  });
  