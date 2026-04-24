import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FastifyInstance } from "fastify";
import { createPrintJobSchema, updatePrintJobStatusSchema } from "@printbridge/shared";
import { claimNextJob, createJob, jobs, listJobsByAgent, updateJobStatus } from "../lib/store.js";

export async function jobRoutes(app: FastifyInstance) {
  app.get("/jobs", async () => jobs);

  app.get("/agents/:agentId/jobs", async (request) => {
    const { agentId } = request.params as { agentId: string };
    return listJobsByAgent(agentId);
  });

  app.post("/agents/:agentId/jobs/claim", async (request, reply) => {
    const { agentId } = request.params as { agentId: string };
    const job = claimNextJob(agentId);
    if (!job) return reply.code(204).send();
    return job;
  });

  app.patch("/jobs/:jobId/status", async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const parsed = updatePrintJobStatusSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const job = updateJobStatus(jobId, parsed.data.status, parsed.data.error);
    if (!job) return reply.code(404).send({ error: "Job not found" });
    return job;
  });

  app.post("/jobs/upload", async (request, reply) => {
    const file = await request.file();
    if (!file) return reply.code(400).send({ error: "No file uploaded" });

    const uploadsDir = path.resolve(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const safeName = `${Date.now()}-${file.filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const outputPath = path.join(uploadsDir, safeName);
    const buffer = await file.toBuffer();
    await writeFile(outputPath, buffer);

    const host = request.headers.host || `127.0.0.1:4000`;
    const protocol = (request.headers["x-forwarded-proto"] as string) || "http";
    return reply.code(201).send({
      fileName: file.filename,
      storedName: safeName,
      mimeType: file.mimetype,
      fileUrl: `${protocol}://${host}/uploads/${encodeURIComponent(safeName)}`,
    });
  });

  app.post("/jobs", async (request, reply) => {
    const parsed = createPrintJobSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    return reply.code(201).send(createJob(parsed.data));
  });
}
