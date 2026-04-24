# 01 - Product Plan

## Problem

People want a simple browser-based way to print to printers attached to other PCs on the same local network.

## Constraints

- Browsers cannot safely or consistently access arbitrary network printers directly.
- Printing must happen through the OS print system of the machine that already has printer access.
- Different operating systems use different print stacks.

## Solution

Build a web app plus a lightweight local print agent.

## User flow

1. User opens web app.
2. Web app shows available printer-host machines.
3. User drags in a file.
4. User picks printer and print settings.
5. Backend sends the job to the right local agent.
6. Agent prints using the machine's normal print system.
7. Web app shows live status.

## MVP features

- Local login or simple admin passcode
- Agent registration to backend
- Printer listing per agent
- File upload
- Print job creation
- Job queue/status
- Basic print options:
  - copies
  - paper size
  - color/grayscale
  - orientation
  - duplex if supported

## Non-goals for MVP

- Cloud printing over the public internet
- Full enterprise SSO
- Advanced accounting/billing
- Editing Office docs in browser

## Success criteria

- User can print a PDF/image to a printer attached to another LAN PC in under 30 seconds.
- Job failures are visible and understandable.
- Setup is simple enough for a small office.
