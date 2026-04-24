# 08 - Windows Printer Host Plan

## Your actual setup

- This machine is running WSL + Windows
- The printer is connected to another Windows PC on the local network

## Correct deployment model

The agent should run on the Windows PC that has the printer installed.

Why:
- that machine can query printers directly with PowerShell
- that machine can print using the normal Windows print stack
- WSL on a different machine is not the right place to discover or control that remote printer directly

## What runs where

### This current machine
- backend
- later frontend

### Remote Windows printer-host PC
- agent

## Connectivity requirement

The remote Windows PC must be able to reach the backend URL over the LAN.

Example:
- backend on your current machine: `http://<your-lan-ip>:4000`
- agent on remote Windows PC connects to that backend

## First practical test

1. Find your current machine's LAN IP
2. Keep backend running on port 4000
3. On remote Windows PC, run the agent with:
   - `BACKEND_URL=http://<your-lan-ip>:4000`
4. Agent discovers printers with PowerShell
5. Agent syncs printers to backend

## Important note

If Windows firewall blocks the backend port on your current machine, the remote PC will not reach it until that is allowed.
