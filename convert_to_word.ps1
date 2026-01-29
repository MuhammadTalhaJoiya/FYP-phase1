# PowerShell script to convert Markdown to Word document
# Requires Pandoc to be installed (https://pandoc.org/installing.html)

param(
    [string]$InputFile = "FYP_I_Report_Muhammad_Talha_BSCS_153.md",
    [string]$OutputFile = "FYP_I_Report_Muhammad_Talha_BSCS_153.docx"
)

# Check if Pandoc is installed
$pandocInstalled = Get-Command pandoc -ErrorAction SilentlyContinue

if (-not $pandocInstalled) {
    Write-Host "Pandoc is not installed. Please install Pandoc first:" -ForegroundColor Red
    Write-Host "1. Download from: https://pandoc.org/installing.html" -ForegroundColor Yellow
    Write-Host "2. Add to PATH environment variable" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    exit 1
}

# Check if input file exists
if (-not (Test-Path $InputFile)) {
    Write-Host "Input file '$InputFile' not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Converting $InputFile to $OutputFile..." -ForegroundColor Green

# Convert markdown to Word document
try {
    & pandoc $InputFile -o $OutputFile --reference-doc="reference.docx" --toc --toc-depth=3
    Write-Host "Conversion completed successfully!" -ForegroundColor Green
    Write-Host "Output file: $OutputFile" -ForegroundColor Cyan
} catch {
    Write-Host "Error during conversion: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nConversion complete! You can now open $OutputFile in Microsoft Word." -ForegroundColor Green
Write-Host "The document includes table of contents and proper formatting." -ForegroundColor Cyan
