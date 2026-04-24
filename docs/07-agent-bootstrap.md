# 07 - Agent Bootstrap

## What exists now

- Agent TypeScript package scaffold
- Config loader from environment variables
- Backend client for:
  - agent registration
  - printer sync
- Demo printer detection function
- Periodic sync loop

## Current behavior

When the agent starts, it:
1. builds an `Agent` payload
2. registers with the backend
3. sends a demo printer list
4. repeats sync every `SYNC_INTERVAL_MS`

## Current limitation

Printer detection is mocked right now.

## Next recommended step

Implement real printer discovery per operating system:
- Linux/macOS: `lpstat`, `lpoptions`
- Windows: PowerShell printer queries

After that:
- add job polling
- add actual print execution
- add job status updates
