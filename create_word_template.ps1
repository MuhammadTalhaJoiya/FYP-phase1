# PowerShell script to create a Word template for FYP report formatting
# This creates a basic reference document that Pandoc can use for styling

param(
    [string]$TemplateFile = "fyp_template.docx"
)

Write-Host "Creating FYP Report Word Template..." -ForegroundColor Green

# Create a basic markdown template with Word styling hints
$templateContent = @"
---
title: "AI-POWERED RECRUITMENT PLATFORM"
subtitle: "Final Year Project Report"
author:
- "Muhammad Talha (22F-BSCS-153)"
- "Muhammad Sufyan (22F-BSCS-179)"
- "Adil Saif (22F-BSCS-154)"
- "Abdur Rehman (22F-BSCS-171)"
- "Aman Wassan (22F-BSCS-180)"
date: "December 2025"
geometry: margin=1in
fontsize: 12pt
lang: en-US
---

# Template for FYP Report

This is a template document for proper Word formatting.

## Section Headers

### Subsection Headers

#### Sub-subsection Headers

## Lists

- Item 1
- Item 2
- Item 3

## Numbered Lists

1. First item
2. Second item
3. Third item

## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |

## Code Blocks

```javascript
function hello() {
    console.log("Hello, World!");
}
```

## Bold and Italic Text

**Bold text** and *italic text* are supported.

---

End of template.
"@

# Save template as markdown first
$templateContent | Out-File -FilePath "template.md" -Encoding UTF8

# Convert to Word using Pandoc if available
$pandocInstalled = Get-Command pandoc -ErrorAction SilentlyContinue

if ($pandocInstalled) {
    Write-Host "Converting template to Word format..." -ForegroundColor Yellow
    & pandoc "template.md" -o $TemplateFile
    Remove-Item "template.md" -Force
    Write-Host "Template created: $TemplateFile" -ForegroundColor Green
} else {
    Write-Host "Pandoc not found. Template markdown file created: template.md" -ForegroundColor Yellow
    Write-Host "Install Pandoc to convert to Word format automatically." -ForegroundColor Cyan
}

Write-Host "`nTemplate creation complete!" -ForegroundColor Green
