$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$logPath = Join-Path $projectRoot 'BUILD_LAST_LOG.txt'
$exitCode = 0
$transcriptStarted = $false

Set-Location -LiteralPath $projectRoot

# The installer file name follows package.json, so a version bump never
# leaves the builder looking for a file that was never produced.
$appVersion = '0.0.0'
try {
    $packageJsonPath = Join-Path $projectRoot 'package.json'
    if (Test-Path -LiteralPath $packageJsonPath) {
        $appVersion = (Get-Content -LiteralPath $packageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json).version
    }
}
catch {
    $appVersion = '0.0.0'
}

try {
    if (Test-Path -LiteralPath $logPath) {
        Remove-Item -LiteralPath $logPath -Force
    }
    Start-Transcript -Path $logPath -Force | Out-Null
    $transcriptStarted = $true

    Write-Host '=========================================='
    Write-Host " KashKool v$appVersion - Windows installer builder"
    Write-Host '=========================================='
    Write-Host "Project folder: $projectRoot"
    Write-Host "Log file: $logPath"
    Write-Host ''

    $nodeCommand = Get-Command 'node.exe' -ErrorAction Stop
    $npmCommand = Get-Command 'npm.cmd' -ErrorAction Stop

    $nodeVersionText = (& $nodeCommand.Source --version).Trim()
    if ($LASTEXITCODE -ne 0 -or $nodeVersionText -notmatch '^v?(\d+)\.(\d+)\.(\d+)') {
        throw 'Could not read the installed Node.js version.'
    }

    $nodeMajor = [int]$Matches[1]
    $nodeMinor = [int]$Matches[2]
    Write-Host "Node.js: $nodeVersionText"

    if ($nodeMajor -lt 20 -or ($nodeMajor -eq 20 -and $nodeMinor -lt 19)) {
        throw 'Node.js 20.19 or newer is required. Node.js 24 is recommended.'
    }

    $npmVersionText = (& $npmCommand.Source --version).Trim()
    if ($LASTEXITCODE -ne 0) {
        throw 'npm was found but could not be started.'
    }
    Write-Host "npm: $npmVersionText"
    Write-Host ''

    Write-Host '[1/3] Installing the pinned build tools.'    Write-Host 'Development tools are explicitly included, even if npm is configured for production.'
    Write-Host 'This step may download packages. Please keep this window open.'
    & $npmCommand.Source install --include=dev --no-audit --no-fund --verbose
    $commandExitCode = $LASTEXITCODE
    if ($commandExitCode -ne 0) {
        throw "npm install failed with exit code $commandExitCode. Check the network/download error in this log."
    }

    $builderCommand = Join-Path $projectRoot 'node_modules\.bin\electron-builder.cmd'
    $electronPackage = Join-Path $projectRoot 'node_modules\electron\package.json'
    if (-not (Test-Path -LiteralPath $builderCommand)) {
        throw 'electron-builder was not installed in this project. Check npm install output and ensure development dependencies are not blocked.'
    }
    if (-not (Test-Path -LiteralPath $electronPackage)) {
        throw 'Electron was not installed in this project. Check npm install output and ensure development dependencies are not blocked.'
    }

    Write-Host ''
    Write-Host '[2/3] Checking project files and JavaScript syntax.'
    & $npmCommand.Source run check
    $commandExitCode = $LASTEXITCODE
    if ($commandExitCode -ne 0) {
        throw "Project checks failed with exit code $commandExitCode."
    }

    Write-Host ''
    Write-Host '[3/3] Building the Windows installer (NSIS).' 
    Write-Host 'The portable target is intentionally excluded from this build because it stalled after the installer was created.'
    Write-Host 'The installer is the primary Windows application and includes tray/background support.'
    & $npmCommand.Source run dist:win
    $commandExitCode = $LASTEXITCODE
    if ($commandExitCode -ne 0) {
        throw "Windows installer packaging failed with exit code $commandExitCode."
    }

    $installerPath = Join-Path $projectRoot "dist\KashKool Setup $appVersion.exe"
    $appPath = Join-Path $projectRoot 'dist\win-unpacked\KashKool.exe'
    if (-not (Test-Path -LiteralPath $installerPath)) {
        throw "electron-builder returned success but the installer was not found: $installerPath"
    }
    if (-not (Test-Path -LiteralPath $appPath)) {
        throw "electron-builder returned success but the unpacked application was not found: $appPath"
    }

    $installerInfo = Get-Item -LiteralPath $installerPath
    if ($installerInfo.Length -lt 5MB) {
        throw "The installer file looks incomplete (only $($installerInfo.Length) bytes): $installerPath"
    }

    Write-Host ''
    Write-Host '==========================================' -ForegroundColor Green
    Write-Host 'BUILD COMPLETED SUCCESSFULLY' -ForegroundColor Green
    Write-Host "Installer: $installerPath"
    Write-Host "Size: $([math]::Round($installerInfo.Length / 1MB, 1)) MB"
    Write-Host 'The output folder is dist.'
    Write-Host '==========================================' -ForegroundColor Green
}
catch {
    $exitCode = 1
    Write-Host ''
    Write-Host '[BUILD ERROR]' -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ''
    Write-Host 'The full diagnostic output is saved in BUILD_LAST_LOG.txt.'
}
finally {
    if ($transcriptStarted) {
        try {
            Stop-Transcript | Out-Null
        }
        catch {
            Write-Host 'Could not close the transcript cleanly.'
        }
    }
}

exit $exitCode
