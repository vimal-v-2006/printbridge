# 12 - Print Job Pipeline

## What exists now

### Backend
- `POST /jobs/upload` — upload a file and get back a `fileUrl`
- `POST /jobs` — create a print job
- `GET /jobs` — view all jobs
- `GET /agents/:agentId/jobs` — list jobs for one agent
- `POST /agents/:agentId/jobs/claim` — agent claims next queued job
- `PATCH /jobs/:jobId/status` — agent updates job status
- static file serving from `/uploads/...`

### Agent
- polls for jobs every 5 seconds
- downloads job file
- tries Windows `PrintTo` for the selected printer
- updates backend with completed/failed status

## First test target
Use a PDF and a virtual printer like:
- Microsoft Print to PDF
- Adobe PDF
- PDF24

## Current limitation
Windows printing is best-effort through the registered PDF file handler using PowerShell `PrintTo`.
Different PDF apps may behave differently.

## Test flow
1. Upload PDF
2. Create job with `printerId`, `printerName`, `agentId`, `fileUrl`, `fileName`, `mimeType`
3. Watch `/jobs`
4. Agent should move status through:
   - `queued`
   - `downloading`
   - `printing`
   - `completed` or `failed`
