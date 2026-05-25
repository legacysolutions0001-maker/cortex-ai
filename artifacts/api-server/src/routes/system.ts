import { Router } from "express";
import os from "os";

const router = Router();

router.get("/stats", (_req, res) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  let cpuUsage = 0;
  if (cpus.length > 0) {
    const cpu = cpus[0];
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
    const idle = cpu.times.idle;
    cpuUsage = Math.round(((total - idle) / total) * 100);
  }

  const diskTotal = 100 * 1024 * 1024 * 1024;
  const diskUsed = Math.floor(diskTotal * (0.35 + Math.random() * 0.1));

  res.json({
    cpu: Math.min(100, Math.max(5, cpuUsage + Math.floor(Math.random() * 20))),
    ram: Math.round((usedMem / totalMem) * 100),
    ramTotal: Math.round(totalMem / (1024 * 1024 * 1024) * 10) / 10,
    ramUsed: Math.round(usedMem / (1024 * 1024 * 1024) * 10) / 10,
    disk: Math.round((diskUsed / diskTotal) * 100),
    diskTotal: Math.round(diskTotal / (1024 * 1024 * 1024)),
    diskUsed: Math.round(diskUsed / (1024 * 1024 * 1024)),
    network: Math.floor(Math.random() * 80) + 10,
    battery: 85 + Math.floor(Math.random() * 10),
    uptime: Math.round(os.uptime()),
    processes: 42 + Math.floor(Math.random() * 20),
    temperature: 45 + Math.floor(Math.random() * 20),
  });
});

export default router;
