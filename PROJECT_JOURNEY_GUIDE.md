# Project Journey Guide

## Financial Statement Parser - From Zero to Launch

This guide walks you through building, deploying, and monetizing your bank statement parser app.

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- A Google account (for Gemini API key)

### Installation

```bash
# 1. Navigate to project folder
cd expenses

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Get Your Free API Key
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with Google
3. Click "Create API Key"
4. Copy and paste into the app

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **UI Framework** | React 18 | Component-based, fast, huge ecosystem |
| **Build Tool** | Vite | Lightning fast dev server, optimized builds |
| **Styling** | Tailwind CSS | Utility-first, rapid prototyping, small bundle |
| **OCR Engine** | Tesseract.js | Runs in browser, no server needed, free |
| **AI/LLM** | Google Gemini | Free tier, fast, good at structured extraction |
| **Export** | xlsx + file-saver | Client-side Excel/CSV generation |
| **Icons** | Lucide React | Clean, consistent, lightweight |

### Why No Backend?
- **Zero server costs** - Everything runs in the browser
- **Privacy** - User files never leave their device
- **Simplicity** - No database, no auth, no deployment complexity
- **Speed** - No network latency for file processing

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                     React App                           ││
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐             ││
│  │  │  Upload   │ │  Results  │ │  Export   │             ││
│  │  │   Page    │ │   Table   │ │  Buttons  │             ││
│  │  └─────┬─────┘ └─────▲─────┘ └─────┬─────┘             ││
│  │        │             │             │                    ││
│  │        ▼             │             ▼                    ││
│  │  ┌───────────────────┴───────────────────┐             ││
│  │  │           App State (useState)         │             ││
│  │  └───────────────────┬───────────────────┘             ││
│  └──────────────────────┼──────────────────────────────────┘│
│                         │                                    │
│  ┌──────────────────────┼──────────────────────────────────┐│
│  │                Processing Pipeline                       ││
│  │                      │                                   ││
│  │     ┌────────────────┼────────────────┐                 ││
│  │     ▼                ▼                ▼                 ││
│  │  ┌──────┐      ┌──────────┐     ┌──────────┐           ││
│  │  │ File │      │Tesseract │     │  Gemini  │           ││
│  │  │Upload│ ───▶ │   OCR    │ ──▶ │   API    │           ││
│  │  └──────┘      └──────────┘     └────┬─────┘           ││
│  │                                       │                  ││
│  │                                       ▼                  ││
│  │                              ┌──────────────┐            ││
│  │                              │ Transactions │            ││
│  │                              │    Array     │            ││
│  │                              └──────────────┘            ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │                    localStorage                          ││
│  │  • API Key (obfuscated)                                  ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
                 ┌────────────────────────┐
                 │   Google Gemini API    │
                 │  (External Service)    │
                 └────────────────────────┘
```

### Data Flow

```
USER JOURNEY:
─────────────

1. FIRST VISIT
   │
   ├─▶ Has API Key? ─── No ──▶ Show API Key Input
   │         │
   │        Yes
   │         │
   └─────────┴─▶ Show Upload Screen

2. UPLOAD FILE
   │
   ├─▶ Validate (type, size)
   │         │
   │        Pass
   │         ▼
   ├─▶ Tesseract.js OCR
   │   └─▶ Extract text from image
   │         │
   │         ▼
   ├─▶ Gemini API
   │   └─▶ Parse text into structured JSON
   │         │
   │         ▼
   └─▶ Display Results Table

3. REVIEW & EXPORT
   │
   ├─▶ User edits cells (optional)
   │
   ├─▶ Click Export CSV
   │   └─▶ Generate file client-side
   │   └─▶ Trigger download
   │
   └─▶ Click Export Excel
       └─▶ Generate .xlsx client-side
       └─▶ Trigger download
```

---

## File Structure

```
expenses/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── components/           # UI Components
│   │   ├── ApiKeyInput.jsx   # API key entry screen
│   │   ├── FileUpload.jsx    # Drag & drop upload
│   │   ├── ProcessingStatus.jsx
│   │   ├── TransactionTable.jsx
│   │   ├── Summary.jsx       # Financial totals
│   │   ├── ExportButtons.jsx
│   │   ├── Header.jsx
│   │   ├── SettingsModal.jsx
│   │   └── index.js          # Barrel exports
│   │
│   ├── utils/                # Business Logic
│   │   ├── storage.js        # localStorage helpers
│   │   ├── gemini.js         # API integration
│   │   ├── ocr.js            # Tesseract wrapper
│   │   ├── export.js         # CSV/Excel generation
│   │   └── index.js
│   │
│   ├── App.jsx               # Main app + state
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind imports
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## Development Phases

### Phase 1: Core MVP (Current)
- [x] API key input & validation
- [x] Image upload (drag & drop)
- [x] PDF support (using pdf.js)
- [x] OCR with Tesseract.js
- [x] AI extraction with Gemini
- [x] Editable results table
- [x] CSV/Excel export
- [x] Responsive design

### Phase 2: Enhancements
- [ ] Multiple file upload
- [ ] Transaction categorization
- [ ] Dark mode
- [ ] PWA (offline support)

### Phase 3: Growth Features
- [ ] Save history (IndexedDB)
- [ ] Charts & analytics
- [ ] Custom export templates
- [ ] Multi-language OCR

---

## Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, done!
```

### Option 2: Netlify

```bash
# Build
npm run build

# Drag 'dist' folder to netlify.com/drop
```

### Option 3: GitHub Pages

```bash
# Add to package.json scripts:
"deploy": "npm run build && npx gh-pages -d dist"

# Run
npm run deploy
```

**All options are FREE for static sites.**

---

## Monetization Strategies

### Strategy 1: Freemium (Recommended)

```
FREE TIER:
├── 5 extractions per day
├── Basic CSV export
└── Watermark on exports

PRO ($9/month):
├── Unlimited extractions
├── Excel export with formatting
├── No watermark
├── Priority support
└── Custom categories
```

**Implementation:**
- Track usage in localStorage (easy to bypass but OK for MVP)
- Add Stripe/LemonSqueezy for payments
- Use Supabase for user accounts when scaling

### Strategy 2: One-Time Purchase

```
FREE:
├── Full features
└── Limited to 3 files total

LIFETIME ($29):
├── Unlimited forever
└── All future features
```

**Best for:** Solo developers who don't want subscription management.

### Strategy 3: API Access

```
Offer your extraction as an API:
├── $0.05 per extraction
├── Bulk discounts
└── White-label option
```

**Requires:** Backend server, but high margin potential.

### Strategy 4: Affiliate/Referral

```
Partner with:
├── Accounting software (QuickBooks, Xero)
├── Tax preparation services
├── Bookkeeping services
└── Get referral fees
```

---

## Monetization Timeline

| Stage | Focus | Revenue Target |
|-------|-------|----------------|
| **Month 1-2** | Build & launch free version | $0 |
| **Month 3-4** | Add analytics, gather feedback | $0 |
| **Month 5-6** | Implement freemium | $100-500/mo |
| **Month 7-12** | Marketing, SEO, partnerships | $1,000-5,000/mo |

### Key Metrics to Track
- Daily active users
- Extractions per user
- Free → Paid conversion rate
- Export completion rate

---

## Marketing Tips

### Free Marketing Channels

1. **Product Hunt Launch**
   - Prepare screenshots, demo video
   - Launch Tuesday-Thursday
   - Engage with every comment

2. **Reddit**
   - r/smallbusiness
   - r/freelance
   - r/accounting
   - r/Entrepreneur

3. **SEO Content**
   - "How to convert bank statement to Excel"
   - "Extract transactions from PDF"
   - "Bank statement parser free"

4. **YouTube**
   - Demo videos
   - "How I built this" developer content

### Paid Marketing (Later)
- Google Ads for high-intent keywords
- Facebook/Instagram for small business owners

---

## Cost Structure

### Current (MVP)
| Item | Cost |
|------|------|
| Hosting (Vercel) | $0 |
| Domain | $12/year |
| Gemini API | $0 (user's key) |
| **Total** | **~$1/month** |

### Scaled (with backend)
| Item | Cost |
|------|------|
| Hosting | $0-20/month |
| Database (Supabase) | $0-25/month |
| Your Gemini API key | Usage-based |
| **Total** | **$20-100/month** |

---

## Success Checklist

- [ ] App works on mobile
- [ ] Error messages are helpful
- [ ] Loading states are clear
- [ ] Export files are properly formatted
- [ ] Privacy policy page exists
- [ ] Analytics installed (Plausible/Umami)
- [ ] Feedback mechanism (email/form)
- [ ] Social proof (testimonials, user count)

---

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Tesseract.js](https://tesseract.projectnaptha.com/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

## Support

Questions? Issues?
- Open an issue on GitHub
- Email: your-email@example.com

Good luck with your launch! 🚀
