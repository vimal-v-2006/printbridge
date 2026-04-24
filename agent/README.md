# Agent

Purpose: runs on PCs that have printer access.

## What it does now
- registers the agent with the backend
- discovers real printers depending on OS
- syncs printer list on an interval

## Best deployment for your setup
Run this agent on the **Windows PC that actually has the printer installed**.

## Good first test
Run backend in WSL and run agent in Windows on the same machine using virtual printers like PDF24, doPDF, or Microsoft Print to PDF.

## Detection behavior
- Windows: uses `powershell.exe` + `Get-Printer`
- Linux/macOS: uses `lpstat`

## Run in Windows for local WSL test

```powershell
cd <path-to-printbridge>
.\agent\start-agent-windows.ps1
```

## Run manually

```bash
npm run dev:agent
```

## Config
Set these before running if needed:

```bash
export BACKEND_URL=http://127.0.0.1:4000
export AGENT_ID=agent-local-1
export AGENT_NAME="Office PC"
export AGENT_HOST=office-pc
export AGENT_IP=
npm run dev:agent
```

## Next step
Add job polling and actual print execution.
