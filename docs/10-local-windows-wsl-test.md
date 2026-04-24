# 10 - Local Windows + WSL Test

## Goal

Test the bridge on one machine first:
- backend runs inside WSL
- agent runs on Windows
- Windows virtual printers (doPDF, PDF24, etc.) are discovered and synced into the backend

## Expected architecture for this test

- WSL: backend at `http://localhost:4000`
- Windows: agent connects to that backend
- Windows printer list should appear through the agent

## Why this should work

WSL2 commonly forwards localhost between Windows and WSL. So if the backend is running in WSL on port 4000, Windows can often reach it at:

- `http://localhost:4000`

If that fails, use the WSL IP instead.

## Step 1 - Keep backend running in WSL

Inside WSL:

```bash
cd /home/vimal/.openclaw/workspace/printbridge
npm run dev:backend
```

## Step 2 - Confirm Windows can see the backend

In Windows PowerShell:

```powershell
Invoke-WebRequest http://localhost:4000/health
```

Expected result: JSON with `ok: true`

If localhost fails, get the WSL IP from WSL:

```bash
hostname -I
```

Then test from Windows PowerShell:

```powershell
Invoke-WebRequest http://<WSL-IP>:4000/health
```

## Step 3 - Run the agent on Windows

Open PowerShell in the project folder and run:

```powershell
cd <path-to-printbridge>
.\agent\start-agent-windows.ps1
```

Or explicitly:

```powershell
cd <path-to-printbridge>
.\agent\start-agent-windows.ps1 -BackendUrl "http://localhost:4000"
```

## Step 4 - What success looks like

The agent console should say it synced printer(s).

The discovered printers should include your Windows virtual printers, such as:
- doPDF
- PDF24
- Microsoft Print to PDF

## Step 5 - Backend verification

From WSL or browser:

- `http://localhost:4000/agents`
- `http://localhost:4000/agents/windows-local-test/printers`

## If PowerShell script execution is blocked

Run this once in that PowerShell session:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
```

Then run the script again.

## Important limitation of current test

This confirms:
- Windows printer discovery works
- agent can register to backend
- printer list can bridge into backend

This does **not yet** confirm real print-job execution. That is the next implementation step.
