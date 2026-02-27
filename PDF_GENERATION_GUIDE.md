# How to Convert Documentation to PDF

The documentation is available in two formats:

## Option 1: Use the HTML File (Recommended for Best Formatting)

### Browser Print-to-PDF (No Tools Required)
1. Open `MKUTANO_DOCUMENTATION.html` in your browser
   - Simply open the file directly, or
   - Use: `npx http-server` and visit http://localhost:8080/MKUTANO_DOCUMENTATION.html

2. Press `Ctrl+P` (Windows) or `Cmd+P` (Mac) to open print dialog

3. Set printer to "Save as PDF"

4. Click "Save" to generate PDF

### Result
- Clean 50+ page PDF with proper formatting
- All links, tables, and diagrams preserved
- Professional print styling (no navigation elements)
- Color-coded sections for easy reading

---

## Option 2: Use Node.js PDF Generator Script

If you'd like to automate PDF generation, create `scripts/generate-pdf.js`:

```javascript
const fs = require('fs');
const path = require('path');
const jsPDF = require('jspdf');
const html2canvas = require('html2canvas');

async function generatePDF() {
  const htmlPath = path.join(__dirname, '../MKUTANO_DOCUMENTATION.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Parse and convert to PDF using html2pdf
  const element = document.querySelector('#mkutano-docs');
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  
  const imgWidth = 210; // A4 width
  const pageHeight = 297; // A4 height
  let heightLeft = canvas.height * imgWidth / canvas.width;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, canvas.height * imgWidth / canvas.width);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - canvas.height * imgWidth / canvas.width;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, canvas.height * imgWidth / canvas.width);
    heightLeft -= pageHeight;
  }

  pdf.save('Mkutano_Documentation.pdf');
}

generatePDF();
```

Install dependencies:
```bash
npm install --save-dev jspdf html2canvas
node scripts/generate-pdf.js
```

---

## Option 3: Use Markdown File

A comprehensive Markdown version is also available at `COMPREHENSIVE_DOCUMENTATION.md`.

Convert to PDF using:
```bash
# Install markdown-pdf (one-time)
npm install -g markdown-pdf

# Generate PDF
markdown-pdf COMPREHENSIVE_DOCUMENTATION.md
```

---

## Documentation Contents

Both files contain:

✅ **Application Overview** - What Mkutano does and who uses it  
✅ **Core Features** - All 8+ dashboard modules and capabilities  
✅ **System Architecture** - How the app is built  
✅ **Technology Stack** - All tools and libraries used  
✅ **User Roles & Permissions** - 5 roles with detailed access control  
✅ **Data Model** - 12 database tables and relationships  
✅ **Application Structure** - Complete file organization  
✅ **Key Features by Module** - Detailed breakdown of each page  
✅ **Enterprise Edition** - NGO and MFI platforms  
✅ **Authentication & Security** - RLS policies, audit trails  
✅ **Offline-First & PWA** - Service worker and sync  
✅ **Getting Started** - Installation and deployment  
✅ **Demo Accounts** - 5 pre-configured test accounts  
✅ **API Integration** - Supabase integration guide  
✅ **Troubleshooting** - Common issues and solutions  

---

## Recommended Format

**For PDF Distribution**: Use Option 1 (HTML Print-to-PDF)
- Produces cleanest, most readable PDF
- All formatting preserved
- Professional appearance
- No code required

**For Version Control**: Keep both MARKDOWN and HTML
- Markdown: Easy to edit and version in Git
- HTML: Print-ready with styling

---

## File Locations

```
MKUTANO APP/
├── COMPREHENSIVE_DOCUMENTATION.md    (Markdown, 50+ pages)
├── MKUTANO_DOCUMENTATION.html        (HTML, print-ready)
└── [Generate PDF from above files]
```

Both files cover the complete system and can be used interchangeably.
