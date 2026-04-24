import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import type { FastifyInstance } from "fastify";

export async function registerBasePlugins(app: FastifyInstance) {
  await app.register(cors, { origin: true });
  await app.register(multipart);
}
