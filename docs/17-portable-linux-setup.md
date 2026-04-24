# 17 - Portable Linux Setup

## Goal
Mirror the easier Windows setup flow for Linux host and Linux printer-node usage.

## Added

### Host role
- `portable/linux/PrintBridge-Host-Setup.sh`

### Printer node role
- `portable/linux/PrintBridge-Printer-Node-Setup.sh`

## Host setup behavior
- installs workspace dependencies
- detects LAN IP
- opens firewall for TCP 4000 when supported tools are available
- launches backend and frontend in separate terminals when possible

## Printer node behavior
- installs workspace dependencies
- auto-discovers backend on the local subnet when possible
- auto-fills agent metadata
- starts the agent

## Caveats
- Linux printer discovery still requires `lpstat` / CUPS tools.
- backend auto-discovery assumes a typical `/24` LAN and port `4000`.
- GUI terminal auto-launch depends on tools like `gnome-terminal`, `konsole`, or `x-terminal-emulator`.
