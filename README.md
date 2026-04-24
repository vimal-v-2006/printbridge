# PrintBridge

A clean local-network web printing app.

## Goal

Upload or drag-and-drop files in a web app, choose a printer connected to another PC on the same local network, and print with standard print options.

## Structure

- `frontend/` — web app UI
- `backend/` — Fastify API and job routing
- `agent/` — local print agent on printer-host PCs
- `shared/` — shared schemas/types
- `infra/` — deployment/local infra
- `docs/` — planning and implementation docs

## Current status

Scaffolded:
- monorepo root workspace config
- shared TypeScript contracts with Zod
- backend TypeScript Fastify API skeleton

## Commands

From this folder:

```bash
npm install
npm run dev:backend
```

## First backend endpoints

- `GET /health`
- `GET /agents`
- `POST /agents/register`
- `GET /agents/:agentId/printers`
- `POST /agents/:agentId/printers`
- `GET /jobs`
- `POST /jobs`
