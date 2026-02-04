# Financial Statement Parser

> Extract transactions from bank statement images using AI. Export to Excel/CSV.

A privacy-first web app that runs entirely in your browser. No server, no database, no data collection.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **Drag & Drop Upload** - PNG, JPG, WEBP images, PDF files (max 20MB)
- **In-Browser OCR** - Text extraction using Tesseract.js
- **AI-Powered Parsing** - Transaction extraction via Google Gemini
- **Editable Results** - Review and correct data before export
- **Multiple Exports** - CSV and Excel (.xlsx) formats
- **100% Client-Side** - Your files never leave your browser

---

## Demo

```
1. Enter Gemini API key (free from Google)
2. Upload bank statement image
3. Review extracted transactions
4. Export to Excel or CSV
```

---

## Tech Stack

```
Frontend:     React 18 + Vite
Styling:      Tailwind CSS
OCR:          Tesseract.js (WASM)
AI:           Google Gemini API
Export:       xlsx + file-saver
Icons:        Lucide React
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Gemini API key ([Get free key](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd expenses

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

Output in `dist/` folder. Deploy to any static host.

---

## Project Structure

```
src/
├── components/          # React UI components
│   ├── ApiKeyInput.jsx     # API key entry form
│   ├── FileUpload.jsx      # Drag-drop file input
│   ├── ProcessingStatus.jsx # Progress indicator
│   ├── TransactionTable.jsx # Editable data table
│   ├── Summary.jsx          # Financial totals
│   ├── ExportButtons.jsx    # CSV/Excel download
│   ├── Header.jsx           # App header
│   ├── SettingsModal.jsx    # Key management
│   └── index.js             # Barrel exports
│
├── utils/               # Business logic
│   ├── storage.js          # localStorage helpers
│   ├── gemini.js           # Gemini API client
│   ├── ocr.js              # Tesseract.js wrapper
│   ├── export.js           # File generation
│   └── index.js
│
├── App.jsx              # Root component + state
├── main.jsx             # Entry point
└── index.css            # Tailwind imports
```

---

## Architecture

### Processing Pipeline

```
┌──────────┐    ┌───────────┐    ┌─────────┐    ┌────────┐
│  Image   │───▶│  OCR      │───▶│ Gemini  │───▶│ Table  │
│  Upload  │    │ (Browser) │    │  API    │    │ View   │
└──────────┘    └───────────┘    └─────────┘    └────────┘
     │                                               │
     │                                               ▼
     │                                         ┌────────┐
     └─────────────────────────────────────────│ Export │
                                               └────────┘
```

### Data Flow

```javascript
// 1. User uploads image
onFileSelect(file)

// 2. OCR extracts text
const text = await performOCR(file, onProgress)

// 3. AI parses transactions
const result = await extractTransactions(text, apiKey)
// Returns: { transactions: [...], bankName, period }

// 4. Display in table
setTransactions(result.transactions)

// 5. User exports
exportToExcel(transactions, filename)
```

---

## Key Components

### ApiKeyInput.jsx

Handles initial API key setup with validation.

```jsx
// Validates key format (starts with 'AIza')
// Tests key against Gemini API
// Stores in localStorage (obfuscated)
```

### FileUpload.jsx

Drag-and-drop file input with validation.

```jsx
// Accepts: PNG, JPG, WEBP, PDF
// Max size: 20MB
// Provides drag state feedback
```

### TransactionTable.jsx

Editable table with sorting.

```jsx
// Sortable columns: date, description, debit, credit
// Inline editing with save/cancel
// Row deletion
```

---

## Utils API

### storage.js

```javascript
saveApiKey(key)      // Save to localStorage
getApiKey()          // Retrieve key
hasApiKey()          // Check if exists
removeApiKey()       // Delete key
isValidKeyFormat(key) // Validate format
```

### gemini.js

```javascript
// Extract transactions from OCR text
const result = await extractTransactions(ocrText, apiKey)
// Returns: { transactions, bankName, period }

// Validate API key
const { valid, error } = await testApiKey(apiKey)
```

### ocr.js

```javascript
// Perform OCR on image file
const text = await performOCR(file, onProgress)
// onProgress: (percent) => void
```

### export.js

```javascript
// Export to CSV
exportToCSV(transactions, filename)

// Export to Excel
exportToExcel(transactions, filename)

// Calculate summary
const { totalDebit, totalCredit, netFlow, count } = calculateSummary(transactions)

// Format helpers
formatCurrency(amount, 'INR')
formatDate(dateString)
```

---

## Gemini API Integration

### Endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

### Request Format

```javascript
{
  contents: [{
    parts: [{ text: prompt }]
  }],
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8192
  }
}
```

### Expected Response

```json
{
  "transactions": [
    {
      "date": "2024-01-15",
      "description": "AMAZON PAY",
      "debit": 2499.00,
      "credit": null,
      "balance": 45000.00,
      "reference": "UTR123456"
    }
  ],
  "bankName": "HDFC Bank",
  "period": "January 2024"
}
```

---

## State Management

Uses React's `useState` for simplicity. State structure:

```javascript
// Auth
const [isAuthenticated, setIsAuthenticated] = useState(hasApiKey())

// Processing
const [status, setStatus] = useState('idle')
// Values: idle | reading | ocr | extracting | complete | error

const [progress, setProgress] = useState(0)  // 0-100
const [error, setError] = useState(null)

// Data
const [transactions, setTransactions] = useState([])
const [bankName, setBankName] = useState(null)
const [period, setPeriod] = useState(null)
```

---

## Styling

Uses Tailwind CSS with default configuration.

### Color Palette

```
Primary:    blue-600
Success:    green-600
Error:      red-600
Muted:      gray-500
Background: gray-50
```

### Responsive Breakpoints

```
sm: 640px   (mobile landscape)
md: 768px   (tablet)
lg: 1024px  (desktop)
```

---

## Error Handling

### User Errors

| Error | Message |
|-------|---------|
| Invalid file type | "Please upload a PNG, JPG, WEBP image or PDF file" |
| File too large | "File too large. Maximum size is 20MB" |
| Invalid API key | Specific message from Google API |
| OCR failed | "Could not extract text. Please use a clearer image" |
| No transactions | "No transactions found. Please try a clearer image" |

### API Errors

```javascript
// Network error
{ valid: false, error: 'Network error. Check your connection.' }

// Invalid key
{ valid: false, error: 'API key not valid...' }

// Rate limit
{ valid: false, error: 'Rate limit exceeded...' }
```

---

## Security Considerations

### API Key Storage

```javascript
// Key is obfuscated (not encrypted) in localStorage
// Obfuscation: reverse + base64
const encoded = btoa(key.split('').reverse().join(''))
```

**Note:** This prevents casual inspection but is NOT secure encryption. API keys in browser apps are inherently exposed.

### Data Privacy

- Files processed entirely in browser
- OCR runs in Web Worker (Tesseract.js)
- Only extracted text sent to Gemini API
- No data stored on any server
- No analytics or tracking

---

## Browser Support

| Browser | Supported |
|---------|-----------|
| Chrome 90+ | ✅ |
| Firefox 90+ | ✅ |
| Safari 15+ | ✅ |
| Edge 90+ | ✅ |
| Mobile browsers | ✅ |

Requires:
- ES2020 support
- Web Workers
- Fetch API

---

## Performance

### Bundle Size (Production)

```
React + ReactDOM:  ~45 KB (gzipped)
Tesseract.js:      ~800 KB (lazy loaded)
xlsx:              ~200 KB (lazy loaded)
App code:          ~25 KB
Tailwind:          ~10 KB (purged)
```

### OCR Performance

- First run: 5-10 seconds (downloads language data)
- Subsequent: 2-5 seconds per image
- Cached in browser

---

## Scripts

```json
{
  "dev": "vite",              // Start dev server
  "build": "vite build",      // Production build
  "preview": "vite preview"   // Preview build locally
}
```

---

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload dist/ to Netlify
```

### Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## License

MIT License - use it however you want.

---

## Acknowledgments

- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR engine
- [Google Gemini](https://ai.google.dev/) - AI extraction
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons
- [SheetJS](https://sheetjs.com/) - Excel generation
#   e x p e n s e _ t r a c k e r  
 