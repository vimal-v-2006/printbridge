# 02 - Architecture

## Components

### 1. Frontend
Responsibilities:
- drag-and-drop uploads
- printer/agent selection
- print settings form
- queue/status UI

Suggested stack:
- Next.js or React + Vite
- Tailwind CSS
- React Query
- WebSocket or SSE for live job updates

### 2. Backend
Responsibilities:
- auth/session
- store agents and printers
- receive uploads
- route jobs to the right agent
- maintain status lifecycle

Suggested stack:
- Node.js + Fastify or NestJS
- PostgreSQL
- Redis for queue/events (optional for MVP)
- WebSocket/SSE

### 3. Agent
Responsibilities:
- discover local printers on host machine
- register with backend
- accept assigned jobs
- print through OS print stack
- report success/failure

Suggested stack:
- Node.js service for faster shared-code reuse
- OS-specific adapters:
  - Windows: PowerShell / printer APIs
  - Linux: CUPS / lp / lpstat
  - macOS: CUPS / lp / lpstat

### 4. Shared
Responsibilities:
- API contracts
- job/printer/agent types
- validation schemas

## Network model

- Frontend talks to backend over HTTP/WebSocket.
- Backend talks to agents over secure local HTTP/WebSocket.
- Agents poll or maintain a socket connection to receive jobs.

## Recommended initial approach

Use agent-to-backend outbound connection.
Why:
- easier than backend trying to connect inbound into each machine
- simpler for firewalls and NAT-ish LAN setups
- cleaner status streaming

## Print file handling

Preferred MVP formats:
- PDF
- PNG/JPG

Later:
- DOCX/XLSX via server-side conversion or client rules

## Security basics

- Agent registration token
- Signed job requests
- Local network only for MVP
- File size/type validation
- Job retention cleanup
