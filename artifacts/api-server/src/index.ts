import { execSync } from "child_process";
  import path from "path";
  import app from "./app";
  import { logger } from "./lib/logger";

  const rawPort = process.env["PORT"];

  if (!rawPort) {
    throw new Error("PORT environment variable is required but was not provided.");
  }

  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  // Auto-run DB migration on startup in production
  if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
    try {
      logger.info("Running database migration...");
      execSync("pnpm --filter @workspace/db run push", {
        stdio: "inherit",
        cwd: path.resolve(import.meta.dirname, "../../.."),
      });
      logger.info("Database migration complete");
    } catch (err) {
      logger.error({ err }, "Database migration failed — continuing anyway");
    }
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
  