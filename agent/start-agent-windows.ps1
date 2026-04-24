param(
  [string]$BackendUrl = "http://localhost:4000",
  [string]$AgentId = "windows-local-test",
  [string]$AgentName = "Windows Local Test",
  [string]$AgentHost = $env:COMPUTERNAME,
  [string]$AgentIp = ""
)

$env:BACKEND_URL = $BackendUrl
$env:AGENT_ID = $AgentId
$env:AGENT_NAME = $AgentName
$env:AGENT_HOST = $AgentHost
$env:AGENT_IP = $AgentIp

Write-Host "Starting PrintBridge agent..." -ForegroundColor Cyan
Write-Host "BACKEND_URL=$env:BACKEND_URL"
Write-Host "AGENT_ID=$env:AGENT_ID"
Write-Host "AGENT_NAME=$env:AGENT_NAME"
Write-Host "AGENT_HOST=$env:AGENT_HOST"

npm run dev:agent
