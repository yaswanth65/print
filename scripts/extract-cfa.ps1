# extract-cfa.ps1
# Batch-extracts Canon print-archive files (*.cfa) into plain documents.
#
# A .cfa file is:  4-byte "QHBK" header + 4 reserved bytes + zlib stream
#   -> the zlib payload is a Microsoft Word .doc (OLE2 compound document).
#
# Usage:
#   pwsh ./scripts/extract-cfa.ps1                                     # scans current folder
#   pwsh ./scripts/extract-cfa.ps1 -SourceDir ".\testenv" -OutDir ".\converted" -Pdf
#
# Outputs per file (basename preserved):
#   <name>.doc   raw Word document (always)
#   <name>.txt   plain text (only with -Pdf/-Text, via MS Word)
#   <name>.pdf   print-ready PDF (only with -Pdf, via MS Word)
#
# Requirement: MS Word installed (for txt/pdf conversion). Without it,
# .doc files are still extracted.

param(
  [string]$SourceDir = (Get-Location).Path,
  [string]$OutDir = "",
  [switch]$Pdf
)

$ErrorActionPreference = 'Stop'

$SourceDir = [System.IO.Path]::GetFullPath($SourceDir)
if (-not $OutDir) {
  $OutDir = Join-Path $SourceDir "converted"
}
$OutDir = [System.IO.Path]::GetFullPath($OutDir)
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$files = Get-ChildItem -LiteralPath $SourceDir -Filter *.cfa -File
if ($files.Count -eq 0) {
  Write-Host "No .cfa files found in $SourceDir"
  exit 0
}
Write-Host "Found $($files.Count) .cfa file(s) in $SourceDir"

$word = $null
if ($Pdf) {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $word.DisplayAlerts = 0
}

foreach ($file in $files) {
  Write-Host ""
  Write-Host "==> $($file.Name)"
  $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
  if ($bytes.Length -lt 8) { Write-Host "    SKIP: too small"; continue }

  $magic = [System.Text.Encoding]::ASCII.GetString($bytes, 0, 4)
  try {
    if ($magic -eq 'QHBK') {
      $ms  = New-Object System.IO.MemoryStream(,$bytes[8..($bytes.Length - 1)])
      $zs  = New-Object System.IO.Compression.ZLibStream($ms, [System.IO.Compression.CompressionMode]::Decompress)
      $out = New-Object System.IO.MemoryStream
      $zs.CopyTo($out)
      $zs.Dispose()
      $payload = $out.ToArray()
    } else {
      # not a QHBK archive; try the file as-is
      $payload = $bytes
    }
  } catch {
    Write-Host "    ERROR: failed to decompress: $($_.Exception.Message)"
    continue
  }

  # OLE2 / Word .doc magic: D0 CF 11 E0 A1 B1 1A E1
  $isDoc = $payload.Length -ge 8 -and
           $payload[0] -eq 0xD0 -and $payload[1] -eq 0xCF -and
           $payload[2] -eq 0x11 -and $payload[3] -eq 0xE0
  if (-not $isDoc) {
    Write-Host "    SKIP: payload is not a Word OLE document"
    continue
  }

  $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
  $docPath  = Join-Path $OutDir "$baseName.doc"
  [System.IO.File]::WriteAllBytes($docPath, $payload)
  Write-Host "    -> $(Split-Path -Leaf $docPath)"

  if ($word) {
    try {
      $doc = $word.Documents.Open($docPath, $false, $true)
      $txtPath  = Join-Path $OutDir "$baseName.txt"
      $pdfPath  = Join-Path $OutDir "$baseName.pdf"
      $doc.SaveAs([string]$txtPath, 7)   # 7 = wdFormatText
      $doc.SaveAs([string]$pdfPath, 17)  # 17 = wdFormatPDF
      $doc.Close($false)
      Write-Host "    -> $(Split-Path -Leaf $txtPath)"
      Write-Host "    -> $(Split-Path -Leaf $pdfPath)"
    } catch {
      Write-Host "    ERROR converting with Word: $($_.Exception.Message)"
    }
  }
}

if ($word) {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}

Write-Host ""
Write-Host "Done. Output in: $OutDir"