# CivicAI — India's Responsible AI Government Platform

> An AI-powered digital government super-app enabling every Indian citizen to discover, apply for, and manage government schemes, welfare benefits, and documents through an AI assistant that speaks their language — with explainable, policy-backed, auditable guidance.

---

## Project Overview

CivicAI combines Aadhaar-linked citizen identity, household-level benefit analysis, multilingual voice AI, and a deterministic rule-based eligibility engine into a single, trusted citizen experience. Every AI recommendation is traceable to a specific policy source and rule evaluation. High-stakes decisions escalate to human review.

**Current Maturity:** Working prototype with live LLM integration, persistent database entities, deterministic rule engine, and 13-language multilingual support.

---

## Vision

Millions of Indians miss out on government benefits because they don't know schemes exist, can't navigate fragmented portals, can't understand complex eligibility rules, and can't access services in their language. CivicAI exists to close this gap — with AI that speaks their language, explains its reasoning, and earns their trust.

---

## Features

### Implemented (Genuinely Working)

| Feature | Description |
|---|---|
| AI Caseworker Chat | LLM-powered natural language chat with structured JSON response |
| Deterministic Rule Engine | Fixed scoring rules for 8 government schemes — no hallucination in eligibility |
| Household Benefit Analysis | Family-level eligibility across 8 schemes (6 members × 8 = 48 evaluations) |
| 13-Language Multilingual | i18n with 8 complete + 5 partial translations |
| Voice Input (STT) | Speech-to-Text via Web Speech API with Indian locales |
| Voice Output (TTS) | Text-to-Speech via SpeechSynthesis API |
| Family Entity Persistence | Full CRUD on FamilyMember entity (database-backed) |
| Notification System | Bilingual status notifications via backend function |
| Scheme Catalog | 8 real schemes with official portal URLs and policy versions |
| Document Vault | Expiry tracking, missing document alerts (simulated data) |
| 17+ Fully Designed Pages | Complete citizen and governance UI |
| Authentication | Email/password, Google OAuth, OTP via Base44 Auth |
| Route Protection | All authenticated routes guarded |
| Custom Domain | civicai.online (DNS configured) |

### Prototype / Simulated

| Feature | What's Simulated |
|---|---|
| Aadhaar-linked identity | Mock citizen profile with masked Aadhaar |
| DigiLocker documents | 12 mock documents |
| Scheme catalog depth | 8 schemes (UI designed for 200+) |
| Decision log | 7 mock entries |
| Governance metrics | Static values |
| Consent management | Local state (not persisted) |
| Risk dashboard | Mock risk alerts |
| Proactive alerts | Hardcoded array |
| Predictive analytics | Mock charts |
| Policy intelligence | Mock policy updates |
| Application tracking | 4 mock applications |

### Future Integration

- Live Aadhaar/UIDA e-KYC API
- Live DigiLocker document retrieval
- Real government scheme database (200+ schemes)
- Persistent Application, Consent, AuditLog entities
- RAG with vector database
- Government SSO / e-Pramaan
- Payment integration
- Admin dashboard
- Document intelligence (OCR)
- Form filling agent
- Autonomous workflow agent

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend Framework | React | 18.2 |
| Build Tool | Vite | — |
| Styling | Tailwind CSS + CSS custom properties | — |
| UI Components | shadcn/ui (Radix UI) | — |
| Animation | Framer Motion | 11.x |
| Routing | React Router DOM | 6.x |
| State Management | React hooks + Context API | — |
| Data Fetching | @tanstack/react-query | 5.x |
| Charts | Recharts | 2.x |
| Maps | react-leaflet | 4.x |
| Markdown | react-markdown | 9.x |
| Icons | lucide-react | 0.475 |
| Backend Runtime | Deno (Deno Deploy) | — |
| SDK | @base44/sdk | 0.8.x |
| Database | Base44 managed NoSQL | — |
| AI | Base44 Core.InvokeLLM | — |
| Voice STT | Web Speech Recognition API | Browser-native |
| Voice TTS | SpeechSynthesis API | Browser-native |
| Auth | Base44 Auth | — |
| Hosting | Base44 Platform | — |

---

## Folder Structure

```
civicai/
├── docs/                               # Enterprise documentation (this directory)
│   ├── README.md                       # Project overview & setup guide
│   ├── ARCHITECTURE.md                 # System architecture diagrams
│   ├── API.md                          # Complete API documentation
│   ├── DATABASE.md                     # Entity schemas & data model
│   ├── AI.md                           # AI pipeline & LLM documentation
│   ├── RULE_ENGINE.md                  # Rule engine & eligibility logic
│   ├── SECURITY.md                     # Security & privacy documentation
│   ├── AI_GOVERNANCE.md                # Responsible AI & NIST RMF alignment
│   ├── DEPLOYMENT.md                   # Hosting & deployment guide
│   └── CONTRIBUTING.md                 # Developer guidelines
├── index.html                          # Page title, favicon, meta tags
├── package.json                        # Dependencies
├── tailwind.config.js                  # Tailwind theme + safelist
├── vite.config.js                      # Vite build config
├── jsconfig.json                       # Path aliases (@/ → src/)
├── base44/
│   ├── config.jsonc                    # Base44 app config
│   ├── entities/
│   │   ├── User.jsonc                  # Built-in user entity
│   │   ├── FamilyMember.jsonc          # Household member entity
│   │   └── Notification.jsonc          # Notification entity
│   ├── functions/
│   │   └── notifyStatusChange/
│   │       └── entry.ts               # Backend function (bilingual notifications)
│   ├── agents/                         # (empty — future AI agents)
│   └── workflows/                      # (empty — future automation)
├── src/
│   ├── main.jsx                        # React entry point
│   ├── App.jsx                         # Router + auth wrapper
│   ├── index.css                       # Design tokens + Tailwind layers
│   ├── api/
│   │   └── base44Client.js             # Pre-initialized Base44 SDK
│   ├── lib/                            # Business logic & data layer
│   │   ├── indiaData.js                # Mock citizen, schemes, documents, life events
│   │   ├── householdCalculator.js      # Deterministic rule engine
│   │   ├── aiPrompt.js                 # LLM prompt builder + JSON schema
│   │   ├── i18n.jsx                    # 13-language translation context
│   │   ├── AuthContext.jsx             # Auth state management
│   │   ├── officeData.js               # Mock government office data
│   │   ├── mockData.js                 # Legacy mock data (governance, risk, etc.)
│   │   ├── app-params.js               # App parameter handling
│   │   ├── query-client.js             # React Query client
│   │   ├── PageNotFound.jsx            # 404 page
│   │   └── utils.js                    # cn() utility for class merging
│   ├── hooks/                          # Custom React hooks
│   │   ├── useVoiceAssistant.js        # TTS + STT hook
│   │   ├── useUnreadNotifications.js   # Notification badge counter
│   │   ├── use-size.jsx                # shadcn size hook
│   │   └── use-mobile.jsx              # shadcn mobile detection
│   ├── pages/                          # Route-level page components
│   │   ├── Landing.jsx                 # Public landing page
│   │   ├── Dashboard.jsx               # Citizen dashboard
│   │   ├── AIChat.jsx                  # AI caseworker chat
│   │   ├── Schemes.jsx                 # Scheme catalog + detail modal
│   │   ├── Family.jsx                  # Household benefit calculator
│   │   ├── LifeEvents.jsx              # Life-event-based scheme discovery
│   │   ├── Documents.jsx               # Document vault
│   │   ├── MapServices.jsx             # Government office finder (Leaflet)
│   │   ├── Proactive.jsx               # Proactive AI alerts
│   │   ├── Governance.jsx              # AI governance center
│   │   ├── ExplainableAI.jsx           # Decision explanations
│   │   ├── RuleEngine.jsx              # Rule engine flow visualization
│   │   ├── DecisionLog.jsx             # AI decision audit trail
│   │   ├── Consent.jsx                 # Consent management
│   │   ├── Risk.jsx                    # AI risk dashboard
│   │   ├── PolicyIntelligence.jsx      # Policy change monitoring
│   │   ├── Predictive.jsx              # Predictive analytics dashboard
│   │   ├── Architecture.jsx            # System architecture diagram
│   │   ├── Login.jsx                   # Login page
│   │   ├── Register.jsx                # Registration + OTP
│   │   ├── ForgotPassword.jsx          # Password reset request
│   │   └── ResetPassword.jsx           # Password reset form
│   ├── components/                     # Reusable UI components
│   │   ├── AppLayout.jsx               # Main layout (sidebar + topbar)
│   │   ├── Sidebar.jsx                 # Navigation sidebar
│   │   ├── Topbar.jsx                  # Top navigation bar
│   │   ├── PageHeader.jsx              # Reusable page header
│   │   ├── TrustBadges.jsx             # Trust badge strip
│   │   ├── LanguageSelector.jsx        # Language dropdown
│   │   ├── VoiceButton.jsx             # TTS play/stop button
│   │   ├── NotificationCenter.jsx      # Notification dropdown
│   │   ├── AadhaarProfileCard.jsx      # Citizen profile card
│   │   ├── HouseholdAnalysisCard.jsx   # Household benefit summary
│   │   ├── DocumentWalletCard.jsx      # Document vault summary
│   │   ├── ProtectedRoute.jsx          # Auth route guard
│   │   ├── AuthLayout.jsx              # Auth page wrapper
│   │   ├── ScrollToTop.jsx             # Scroll restoration
│   │   ├── ui/                         # shadcn/ui primitive components (40+)
│   │   │   ├── Icon.jsx                # Custom icon mapper
│   │   │   ├── GlassCard.jsx           # Glass-morphism card
│   │   │   ├── KpiCard.jsx             # KPI metric card
│   │   │   └── ...                     # button, card, dialog, tabs, etc.
│   │   ├── ai/                         # AI-specific components
│   │   │   ├── SchemeCard.jsx          # AI-recommended scheme card
│   │   │   └── VoiceInputButton.jsx    # STT toggle button
│   │   └── family/                     # Family-specific components
│   │       └── LinkMemberForm.jsx      # Multi-step family member form
│   └── utils/
│       └── index.ts                    # Utility exports
└── .github/
    ├── dependabot.yml
    └── workflows/
        ├── ci.yml
        └── dependabot-auto-merge.yml
```

### Enterprise Architecture Mapping

For teams familiar with enterprise folder structures, here's how the CivicAI codebase maps to enterprise concepts:

| Enterprise Concept | CivicAI Location | Notes |
|---|---|---|
| Frontend pages | `src/pages/` | Route-level React components |
| Frontend components | `src/components/` | Reusable UI (ui/, ai/, family/) |
| Frontend layouts | `src/components/AppLayout.jsx` | Main layout with sidebar + topbar |
| Services / API layer | `src/api/base44Client.js` | Pre-initialized Base44 SDK |
| Business logic | `src/lib/` | Rule engine, AI prompt, i18n, data |
| Hooks | `src/hooks/` | Voice, notifications, responsive |
| Context / Store | `src/lib/AuthContext.jsx`, `src/lib/i18n.jsx` | Auth + language state |
| Routes | `src/App.jsx` | React Router configuration |
| Constants | `src/lib/indiaData.js` | Scheme catalog, citizen data |
| Backend functions | `base44/functions/` | Deno serverless functions |
| Database schemas | `base44/entities/` | JSON schema definitions |
| AI prompts | `src/lib/aiPrompt.js` | LLM prompt builder + response schema |
| Rule engine | `src/lib/householdCalculator.js` | Deterministic eligibility scoring |
| Integrations | `src/api/base44Client.js` | Base44 SDK (InvokeLLM, UploadFile, etc.) |

---

## Installation Guide

### Prerequisites

- Node.js 18+ (for local Vite development)
- A Base44 account (for hosting, database, auth, and AI)
- A modern browser (for Web Speech API voice features)

### Local Development Setup

CivicAI is built on the Base44 platform, which manages hosting, database, authentication, and AI integrations. The codebase runs in the Base44 builder environment.

1. **Open the project in Base44 Builder**
   - Log in to your Base44 account
   - Open the CivicAI project

2. **Dependencies are auto-installed**
   - Base44 runs `npm install` automatically on save
   - All dependencies are listed in `package.json`

3. **Environment Variables**
   - `BASE44_APP_ID` is pre-populated by the platform
   - No additional environment variables required for the prototype
   - For production, configure secrets via Base44 Dashboard → Settings → Environment Variables

---

## Running the Frontend

The frontend is a React SPA built with Vite:

1. **In Base44 Builder:** The app auto-builds and deploys on save
2. **Preview:** Available in the Base44 builder's right panel
3. **Production:** Served via Base44 CDN at civicai.online

### Local Vite Build (if exporting)

```bash
npm install
npm run dev      # Development server
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

---

## Running the Backend

The backend consists of Deno serverless functions deployed via Base44:

1. **Functions live in** `base44/functions/{functionName}/entry.ts`
2. **Auto-deployed** to Deno Deploy when saved in Base44 builder
3. **Invoked via** `base44.functions.invoke('functionName', payload)`

### Testing Backend Functions

Use the Base44 dashboard or `test_backend_function` tool:

```javascript
test_backend_function('notifyStatusChange', {
  application_id: "APP-001",
  new_status: "approved",
  service_name: "PM-KISAN"
});
```

---

## Environment Variables

| Variable | Purpose | Status |
|---|---|---|
| `BASE44_APP_ID` | Base44 application identifier | Pre-populated |
| Custom secrets | API keys for future integrations | Configure via dashboard |

### Future Environment Variables (Production)

| Variable | Purpose | Phase |
|---|---|---|
| `AADHAAR_API_KEY` | UIDA e-KYC API | Future Integration |
| `DIGILOCKER_CLIENT_ID` | DigiLocker API | Future Integration |
| `DIGILOCKER_CLIENT_SECRET` | DigiLocker API | Future Integration |
| `VECTOR_DB_URL` | RAG vector database | Future Integration |

---

## Database Setup

The database is Base44-managed NoSQL. No manual setup required.

### Entity Management
- **Create/modify entities:** Edit `.jsonc` files in `base44/entities/`
- **View data:** Base44 Dashboard → Database
- **Query:** Via SDK: `base44.entities.EntityName.list()`

### Current Entities
1. **User** (built-in) — Authentication and roles
2. **FamilyMember** — Household members with eligibility flags
3. **Notification** — Bilingual status notifications

See [DATABASE.md](./DATABASE.md) for complete schema documentation.

---

## AI Configuration

### LLM Integration
- **Provider:** Base44 Core.InvokeLLM
- **Model:** "automatic" (default)
- **Prompt Builder:** `src/lib/aiPrompt.js` → `buildCaseworkerPrompt()`
- **Response Schema:** `caseworkerResponseSchema` in `aiPrompt.js`

### Key Principle
> The Rule Engine decides eligibility. The LLM explains the outcome.

The LLM is used for:
- Language detection
- Intent understanding
- Scheme recommendation (from injected context)
- Explanation generation
- Confidence scoring
- Policy citation

The LLM is NOT used for:
- Eligibility decisions (rule engine does this)
- Match score calculation (rule engine does this)
- Benefit amount determination (hardcoded in catalog)
- Application approval (human/portal does this)

See [AI.md](./AI.md) for complete AI documentation.

---

## Rule Engine Configuration

### Location
`src/lib/householdCalculator.js`

### How It Works
Each of the 8 government schemes has a deterministic scoring function:
- Evaluates family member attributes (age, income, occupation, flags)
- Awards points for each matching condition
- If score ≥ threshold → eligible
- Returns `{ match, eligible, benefit }`

### Adding New Rules
Add a new entry to the `schemeRules` object in `householdCalculator.js`:

```javascript
"new-scheme-id": (member) => {
  const score =
    (member.age >= 18 ? 30 : 0) +
    (member.income < 500000 ? 40 : 0) +
    (member.aadhaar_linked ? 20 : 0);
  return { match: Math.min(score + 10, 99), eligible: score >= 60, benefit: 25000 };
}
```

See [RULE_ENGINE.md](./RULE_ENGINE.md) for complete documentation.

---

## Hosting

CivicAI is hosted entirely on the **Base44 platform**:

| Component | Provider |
|---|---|
| Frontend | Base44 CDN (Vite build → static files) |
| Backend | Deno Deploy (Base44 functions) |
| Database | Base44 managed NoSQL |
| Authentication | Base44 Auth |
| SSL | Base44-managed (Let's Encrypt) |
| Domain | civicai.online |

### DNS Configuration

```
NS: ns1038.ui-dns.com, ns1044.ui-dns.biz, ns1086.ui-dns.org, ns1092.ui-dns.de
A record: civicai.online → 216.24.57.1 (Base44 IP)
CNAME: www.civicai.online → base44.onrender.com
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment documentation.

---

## Deployment

### Auto-Deploy
1. Developer edits code in Base44 builder
2. On save: `npm install` + `npm run build` (Vite)
3. Static files deployed to Base44 CDN
4. Backend functions deployed to Deno Deploy
5. App is live immediately

### Custom Domain
1. Configure DNS (A record + CNAME) — Done
2. Verify domain in Base44 Dashboard → Settings → Custom Domain
3. SSL certificate issued automatically after verification

---

## Demo Flow

1. **Visit** civicai.online (or Base44 preview URL)
2. **Login** with email/password or Google OAuth
3. **Dashboard** — View citizen profile, household, documents, schemes
4. **AI Chat** — Ask "What schemes am I eligible for?" in Tamil/Hindi/English
5. **Family** — View household benefit calculation (₹4,85,000 for 6-member family)
6. **Schemes** — Browse 8 schemes, click "Apply" to visit official portal
7. **Documents** — Check document vault with expiry tracking
8. **Life Events** — Explore schemes by life event
9. **Map Services** — Find nearby government offices
10. **Governance** — View AI governance metrics

---

## Future Roadmap

| Phase | Focus | Key Deliverables |
|---|---|---|
| Phase 1 | Hackathon Prototype (Current) | 17 pages, AI chat, rule engine, family linking |
| Phase 2 | MVP | Persistent chat history, Application entity, DigiLocker, 50+ schemes |
| Phase 3 | Government Pilot | Aadhaar e-KYC, portal APIs, RAG, e-Pramaan SSO |
| Phase 4 | State Deployment | All 13 languages, admin dashboard, officer review queue |
| Phase 5 | National Scale | 200+ schemes, AI agent, predictive allocation |

---

## License

This project is proprietary. All rights reserved.

---

## Documentation Index

| Document | Purpose |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture with diagrams |
| [API.md](./API.md) | Complete API documentation |
| [DATABASE.md](./DATABASE.md) | Entity schemas and data model |
| [AI.md](./AI.md) | AI pipeline and LLM documentation |
| [RULE_ENGINE.md](./RULE_ENGINE.md) | Rule engine and eligibility logic |
| [SECURITY.md](./SECURITY.md) | Security and privacy documentation |
| [AI_GOVERNANCE.md](./AI_GOVERNANCE.md) | Responsible AI and NIST RMF alignment |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Hosting and deployment guide |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Developer guidelines |

---

*Last updated: July 2026*