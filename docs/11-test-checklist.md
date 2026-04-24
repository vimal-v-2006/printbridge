# 11 - Test Checklist

## Local bridge test checklist

- [ ] Backend starts in WSL on port 4000
- [ ] Windows can open `http://localhost:4000/health`
- [ ] Agent starts on Windows
- [ ] Agent registers successfully
- [ ] Agent syncs at least one virtual printer
- [ ] Backend shows the agent in `/agents`
- [ ] Backend shows printers in `/agents/windows-local-test/printers`

## Suggested printers for first test

- Microsoft Print to PDF
- PDF24
- doPDF

## If no printers appear

Check:
- `Get-Printer` works in PowerShell
- backend URL is reachable from Windows
- firewall is not blocking port 4000
- you are running the agent in Windows, not WSL
