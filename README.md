# PrintBridge

Print to printers on other PCs in your local network through a simple web app.

## About

PrintBridge is a local-network print bridge with a simple browser UI.

It lets you:
- run a **host PC** with the web app and backend
- run a **printer node PC** on a different machine that already has a printer installed
- upload a PDF from the host PC
- print it through the printer node PC

## Core roles

### Host PC
The **host PC** is the machine that:
- does **not** need to have a printer connected
- runs the backend
- runs the frontend
- opens the PrintBridge web UI in the browser

### Printer node PC
The **printer node PC** is the machine that:
- **does** have the printer connected or installed
- runs the PrintBridge agent
- discovers local printers
- receives and executes print jobs

## Current scope

Working now:
- Windows printer agent support
- local-network printer discovery
- PDF upload and job creation
- remote printer selection from the web UI
- basic default printing
- multiple copies support
- multiple printer PCs on the same LAN

Current limitation:
- custom page-range printing is not exposed yet because the current default print path does not enforce page ranges reliably across different PDF handlers

---

# Installation for Windows

## Prerequisites

Install **Node.js** first:
- https://nodejs.org/

Then verify:

```powershell
node --version
```

```powershell
npm --version
```

---

## 1) Set up the host PC

Use this section on the PC that:
- does **not** have the printer connected
- wants to print through **another PC on the same local network** that **does** have the printer connected
- will open the PrintBridge web UI
- will send print jobs to that other printer PC over the local network

### Important

This firewall and port forwarding step is for **Windows host PCs only**.

If your host machine is **Linux**, do **not** use these Windows `netsh` commands.

On the **host Windows PC**, open **PowerShell as Administrator** and run:

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

### Run the host

```powershell
git clone https://github.com/vimal-v-2006/printbridge
```

```powershell
cd printbridge
```

**Windows only:** do **not** use the next command on Linux.

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
npm run dev:backend
```

Open a second terminal in the same folder:

```powershell
cd printbridge
```

```powershell
npm run dev:frontend
```

Then open:

```text
http://localhost:5173
```

---

## 2) Set up the printer node PC

Use this section on the **other Windows PC** that:
- **has the printer connected or installed**
- will act as the print executor
- will receive jobs from the host PC over the local network

### Find the host PC IP address

You need the IP address of the **host PC**, not the printer node PC.

The **host PC** is the machine from section **1**, the one running:
- `npm run dev:backend`
- `npm run dev:frontend`

On that **host Windows PC**, run:

```powershell
ipconfig
```

Look for the active LAN adapter and copy its **IPv4 Address**.

Example:

```text
192.168.0.148
```

**Note it down carefully.** You will use this same host IP in the next command when starting the printer node.

If your host is Linux, run:

```bash
hostname -I
```

Use that host IP with port `4000`.

### Run the printer node

```powershell
git clone https://github.com/vimal-v-2006/printbridge
```

```powershell
cd printbridge
```

**Windows only:** do **not** use the next command on Linux.

```powershell
Set-ExecutionPolicy -Scope Process Bypass
```

```powershell
npm install
```

```powershell
npm audit fix --force
```

**Use the host PC IP address that you noted in the previous step.**

Syntax:

```powershell
npm run dev:agent -- --backendUrl http://<HOST-IP>:4000
```

Example:

```powershell
npm run dev:agent -- --backendUrl=http://192.168.0.148:4000
```

### What this does

- starts the Windows print agent
- discovers printers installed on that PC
- connects to the host PC backend you specify
- if you still get a connection error, first make sure the backend is running and reachable from the printer node PC at `http://<HOST-IP>:4000/health`
- registers that PC as a printer node
- makes its printers available inside the web UI

---

## 3) Use PrintBridge

Once both sides are running:

1. open `http://localhost:5173` on the host PC
2. choose the printer node
3. choose one of its printers
4. upload a PDF
5. set copies if needed
6. click **Print PDF**

---

## Notes

- PrintBridge is for **local network use only**
- for printer nodes, the recommended setup is to explicitly pass the host backend URL
- Windows printing currently uses the standard default print path

## Development

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
