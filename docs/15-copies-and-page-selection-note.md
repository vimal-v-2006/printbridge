# 15 - Copies and Page Selection

## Added now
- Copies control in the frontend
- Windows agent prints the same file multiple times for the requested copy count

## Not added yet
- Custom page range selection

## Why page ranges are not exposed yet
The current print path uses the default Windows PDF handler via PowerShell `PrintTo`.
That path does not give us a reliable, cross-machine way to enforce page ranges across different PDF apps/printer setups.

## If page ranges become a hard requirement
We should switch to a more controllable PDF print engine on Windows, such as a dedicated CLI-capable PDF renderer/print tool.
