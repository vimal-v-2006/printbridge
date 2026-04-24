import type { FastifyInstance } from "fastify";
import { agentSchema, printerSchema } from "@printbridge/shared";
import { agents, printers, replacePrinters, upsertAgent } from "../lib/store.js";

export async function agentRoutes(app: FastifyInstance) {
  app.get("/agents", async () => agents);

  app.post("/agents/register", async (request, reply) => {
    const parsed = agentSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    return upsertAgent(parsed.data);
  });

  app.get("/agents/:agentId/printers", async (request) => {
    const { agentId } = request.params as { agentId: string };
    return printers.filter((printer) => printer.agentId === agentId);
  });

  app.post("/agents/:agentId/printers", async (request, reply) => {
    const { agentId } = request.params as { agentId: string };
    const parsed = printerSchema.array().safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    return replacePrinters(agentId, parsed.data);
  });
}
