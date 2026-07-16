# zip_helper.ps1
# Set Error Action
$ErrorActionPreference = "Stop"

Write-Host "Creating dist.zip..."
if (Test-Path "dist.zip") {
    Remove-Item "dist.zip" -Force
}
Compress-Archive -Path "dist/*" -DestinationPath "dist.zip" -Force
Write-Host "Successfully created dist.zip"

Write-Host "Creating backend.zip (excluding node_modules)..."
if (Test-Path "backend.zip") {
    Remove-Item "backend.zip" -Force
}

# Create temp dir
$tempDir = Join-Path $env:TEMP "backend_build_$(Get-Random)"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Copy everything from backend to temp dir, excluding node_modules
Get-ChildItem -Path "backend" | Where-Object { $_.Name -ne "node_modules" } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $tempDir -Recurse -Force
}

# Compress temp dir content
Compress-Archive -Path "$tempDir/*" -DestinationPath "backend.zip" -Force

# Clean up temp dir
Remove-Item -Path $tempDir -Recurse -Force
Write-Host "Successfully created backend.zip"
