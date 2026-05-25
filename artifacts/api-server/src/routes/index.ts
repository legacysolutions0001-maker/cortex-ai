import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import memoryRouter from "./memory";
import activityRouter from "./activity";
import tasksRouter from "./tasks";
import notesRouter from "./notes";
import systemRouter from "./system";
import analyticsRouter from "./analytics";
import insightsRouter from "./insights";
import notificationsRouter from "./notifications";
import commandsRouter from "./commands";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/chat/messages", chatRouter);
router.use("/memory", memoryRouter);
router.use("/activity", activityRouter);
router.use("/tasks", tasksRouter);
router.use("/notes", notesRouter);
router.use("/system", systemRouter);
router.use("/analytics", analyticsRouter);
router.use("/insights", insightsRouter);
router.use("/notifications", notificationsRouter);
router.use("/commands", commandsRouter);

export default router;
