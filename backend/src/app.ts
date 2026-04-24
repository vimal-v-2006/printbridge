import path from "node:path";
import Fastify from "fastify";
import { registerBasePlugins } from "./plugins/base.js";
import { healthRoutes } from "./routes/health.js";
import { agentRoutes } from "./routes/agents.js";
import { jobRoutes } from "./routes/jobs.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await registerBasePlugins(app);
  await app.register(import("@fastify/static"), {
    root: path.resolve(process.cwd(), "uploads"),
    prefix: "/uploads/",
  });
  await healthRoutes(app);
  await agentRoutes(app);
  await jobRoutes(app);

  return app;
}
