# 06 - Backend + Shared Bootstrap

## What exists now

### shared/
- Zod schemas for:
  - Agent
  - Printer
  - PrintSettings
  - PrintJob
  - CreatePrintJob

### backend/
- Fastify server scaffold
- CORS + multipart plugins
- In-memory store for MVP bootstrapping
- Routes:
  - `GET /health`
  - `GET /agents`
  - `POST /agents/register`
  - `GET /agents/:agentId/printers`
  - `POST /agents/:agentId/printers`
  - `GET /jobs`
  - `POST /jobs`

## Next recommended coding step

1. Install dependencies in project root
2. Run backend in dev mode
3. Test endpoints with sample payloads
4. Then build the agent against these contracts
