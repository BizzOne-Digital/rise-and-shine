# Creates the browser favicon / app icons from public/brand/logo.png (the supplied 1280x720 black-background logo).
# Crops to the house + sun emblem. Usage (from the project root):  powershell -File scripts/make-favicon.ps1
Add-Type -AssemblyName System.Drawing
$src = Join-Path $PSScriptRoot "..\public\brand\logo.png"
if (-not (Test-Path $src)) { Write-Error "Save the logo as public\brand\logo.png first."; exit 1 }
$img = [System.Drawing.Image]::FromFile((Resolve-Path $src))
$sx = [math]::Round($img.Width / 1280.0, 4)
$crop = New-Object System.Drawing.Rectangle ([int](685 * $sx)), ([int](170 * $sx)), ([int](340 * $sx)), ([int](340 * $sx))
function Save-Icon($size, $path) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.Clear([System.Drawing.Color]::Black)
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $size, $size), $crop, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose(); $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
}
$app = Join-Path $PSScriptRoot "..\src\app"
Save-Icon 512 (Join-Path $app "icon.png")
Save-Icon 180 (Join-Path $app "apple-icon.png")
$img.Dispose()
Write-Host "Created src/app/icon.png and src/app/apple-icon.png"
