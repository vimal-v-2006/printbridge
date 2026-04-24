# 13 - Manual Test

## Step 1 - Upload a PDF
Use PowerShell or curl against the backend.

### PowerShell example
```powershell
curl.exe -X POST http://localhost:4000/jobs/upload -F "file=@C:\path\to\test.pdf"
```

This returns JSON including `fileUrl`.

## Step 2 - Create a print job
Use the printer values you already discovered.

### Example payload
```json
{
  "printerId": "windows-local-test-printer-2",
  "printerName": "Microsoft Print to PDF",
  "agentId": "windows-local-test",
  "fileName": "test.pdf",
  "fileUrl": "http://172.31.248.79:4000/uploads/123-test.pdf",
  "mimeType": "application/pdf",
  "settings": {
    "copies": 1,
    "colorMode": "color",
    "orientation": "portrait",
    "duplex": "none",
    "paperSize": "A4"
  }
}
```

### PowerShell example
```powershell
$body = @'
{
  "printerId": "windows-local-test-printer-2",
  "printerName": "Microsoft Print to PDF",
  "agentId": "windows-local-test",
  "fileName": "test.pdf",
  "fileUrl": "http://172.31.248.79:4000/uploads/123-test.pdf",
  "mimeType": "application/pdf",
  "settings": {
    "copies": 1,
    "colorMode": "color",
    "orientation": "portrait",
    "duplex": "none",
    "paperSize": "A4"
  }
}
'@
Invoke-RestMethod http://localhost:4000/jobs -Method POST -ContentType 'application/json' -Body $body
```

## Step 3 - Watch jobs
```powershell
Invoke-RestMethod http://localhost:4000/jobs
```
