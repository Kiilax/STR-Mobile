# Stop le script à la première erreur
$ErrorActionPreference = "Stop"

if ($env:EXPO_TOKEN) {
  Write-Host "Clearing cached credentials..."
  Remove-Item -Recurse -Force "$HOME\.expo", "$HOME\.eas-cli" -ErrorAction SilentlyContinue

  Write-Host "Logging out previous user..."
  eas logout | Out-Null

  Write-Host "Logging in with EXPO_TOKEN..."
  $env:EXPO_TOKEN = $env:EXPO_TOKEN

  Write-Host "Checking authenticated user..."
  try {
    eas whoami
  }
  catch {
    Write-Error "Failed to authenticate with EXPO_TOKEN"
    exit 1
  }

  # Vérifie la présence de projectId dans app.json
  if (-not (Select-String -Path "app.json" -Pattern '"projectId"' -Quiet)) {
    Write-Host "Initializing EAS project..."
    try {
      eas init --non-interactive --force
    }
    catch {
      Write-Error "Failed to initialize EAS project"
      exit 1
    }
  }
}

Write-Host "Running EAS build..."
try {
  $json = eas build --platform android --profile apk --non-interactive --json --local
}
catch {
  Write-Error "eas build failed"
  exit 1
}

# Parse JSON (PowerShell natif)
$build = $json | ConvertFrom-Json
$buildId = if ($build.id) { $build.id } else { $build.buildId }

Write-Host "Fetching build details for ID: $buildId"
$resultOutput = eas build:view $buildId 2>&1

# Extraction URL APK
$artifactUrl = ($resultOutput | Select-String 'https://[^ ]*\.apk').Matches.Value | Select-Object -First 1

if (-not $artifactUrl) {
  $artifactUrl = ($resultOutput | Select-String 'https://expo\.dev/artifacts/eas/[^ ]*').Matches.Value |
  Select-Object -First 1
}

$artifactUrl = $artifactUrl.Trim('"', ',', ' ')

if (-not $artifactUrl) {
  Write-Error "No artifact URL found. Raw output:"
  Write-Host $resultOutput
  exit 1
}

Write-Host "Downloading APK from: $artifactUrl"

$outputDir = "output"
$outputFile = "$outputDir\app.apk"

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Invoke-WebRequest -Uri $artifactUrl -OutFile $outputFile

if (Test-Path $outputFile) {
  Write-Host "Download successful! APK saved to $outputFile"
  Get-Item $outputFile | Format-List Name, Length
}
else {
  Write-Error "Download failed!"
  Get-ChildItem $outputDir
  exit 1
}
