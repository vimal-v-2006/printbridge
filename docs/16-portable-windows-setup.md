# 16 - Portable Windows Setup

## Goal
Make PrintBridge easier to run on arbitrary Windows PCs without manually typing the same setup commands every time.

## Added

### Host role
- `portable/windows/PrintBridge-Host-Setup.bat`
- `portable/windows/PrintBridge-Host-Setup.ps1`

### Printer node role
- `portable/windows/PrintBridge-Printer-Node-Setup.bat`
- `portable/windows/PrintBridge-Printer-Node-Setup.ps1`

## Host setup behavior
- installs workspace dependencies
- detects LAN IP
- detects WSL IP
- adds firewall allow rule for TCP 4000
- adds/refreshes portproxy 0.0.0.0:4000 -> WSL:4000 when WSL is present
- launches backend and frontend in separate terminals

## Printer node setup behavior
- installs workspace dependencies
- auto-discovers backend on local subnet when possible
- auto-fills agent name/id/host/IP
- starts the printer agent

## Design choice
The project already acts like a single merged portable folder because it is a monorepo rooted at `printbridge/`. These scripts are designed to run from that root on Windows copies of the project.

## Caveat
Backend auto-discovery assumes a typical `/24` LAN and port `4000`.
