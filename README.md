# PrintBridge

Print to printers on other PCs in your local network through a simple web app.

## About

PrintBridge lets you use one machine as a clean web-based print control panel and other machines as printer nodes.

In plain words:
- open the web app
- choose a printer from another PC on your LAN
- upload a PDF
- send the print job
- let the printer-host PC handle the actual printing

This is useful when:
- the printer is connected to a different PC
- you want a simple browser UI instead of manually moving files around
- multiple machines on the same local network need access to one or more printers
- you want a lightweight local print bridge without exposing anything publicly

## How it works

PrintBridge has 3 main parts:

- **Frontend** — the web UI where you choose a printer and upload a PDF
- **Backend** — the local network service that tracks agents, printers, uploads, and jobs
- **Agent** — the small node that runs on the PC that has printer access

Typical setup:
- one **host PC** runs the backend and frontend
- one or more **printer PCs** run the agent
- all communication stays inside the **local network**

## Current scope

Working now:
- local-network printer discovery
- Windows printer agent support
- Linux printer agent groundwork
- PDF upload and job creation
- remote printer selection from the web UI
- basic default printing
- multiple copies support
- multiple printer PCs on the same LAN

Current limitation:
- custom page-range printing is not exposed yet because the current default print path does not enforce page ranges reliably across different PDF handlers

## Project structure

- `frontend/` — React + Vite web app
- `backend/` — Fastify API and job routing
- `agent/` — printer node agent
- `shared/` — shared schemas and types
- `docs/` — design and implementation notes
- `infra/` — infra placeholders

---

# Installation for Windows

## Prerequisites

Before using PrintBridge on Windows, install **Node.js** first.

Download it here:
- https://nodejs.org/

After installing, verify:

```powershell
node --version
```

```powershell
npm --version
```

---

## 1) If your PC does **not** have a printer, and you want to print through another local PC that **does** have a printer

This PC acts as the **host PC**.

### Run the host

```powershell
cd C:\Users\Public\printbridge
```

```powershell
npm install
```

```powershell
npm audit fix --force
```

```powershell
npm run dev:backend
```

Open a second terminal in the same folder:

```powershell
cd C:\Users\Public\printbridge
```

```powershell
npm run dev:frontend
```

Then open the web app:

```text
http://localhost:5173
```

### What this does

- starts the backend on port `4000`
- starts the frontend UI on port `5173`
- lets other PCs on the same LAN connect as printer nodes
- gives you a browser interface to choose a remote printer and send a print job

---

## 2) On the other Windows PC that **has the printer connected**

This PC acts as the **printer node**.

### Prerequisites for this printer PC

Install **Node.js** if it is not already installed:
- https://nodejs.org/

Then verify:

```powershell
node --version
```

```powershell
npm --version
```

### Important

On the **host Windows PC**, first open **PowerShell as Administrator**.

This is needed for firewall and port forwarding commands.

Run these commands on the **host PC**:

```powershell
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=4000 connectaddress=172.31.248.79 connectport=4000
```

```powershell
netsh advfirewall firewall add rule name="PrintBridge 4000" dir=in action=allow protocol=TCP localport=4000
```

```powershell
netsh interface portproxy show all
```

> If your backend is not running inside WSL, you may not need the `portproxy` command. The firewall rule is still useful.

### Run the printer node

```powershell
cd C:\Users\Public\printbridge
```

```powershell
Set-ExecutionPolicy -Scope Process Bypass
```

```powershell
npm install
```

```powershell
npm audit fix --force
```

```powershell
.\agent\start-agent-windows.ps1
```

### What this does

- starts the Windows print agent
- automatically discovers printers installed on that PC
- automatically tries to connect to the PrintBridge backend on the local network
- registers that PC as a printer node
- makes its printers available inside the web UI

---

## 3) Using PrintBridge

Once both sides are running:

1. open `http://localhost:5173` on the host PC
2. choose the printer node
3. choose one of its printers
4. upload a PDF
5. click **Print PDF**

The printer-host PC will receive the job and print it.

---

## Notes

- PrintBridge is designed for **local network use only**
- users should not need to manually set agent id, host name, or local IP for normal setup
- if backend auto-discovery fails on a printer node, a manual backend URL may still be needed as a fallback
- Windows printing currently uses the standard default print path

## Development

From the project root:

```bash
npm install
npm run build
```

Useful commands:

```bash
npm run dev:backend
npm run dev:frontend
npm run dev:agent
```
