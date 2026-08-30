# CivicAI — Technical Audit Report (Part 1)
## Executive Summary, Implementation Status, Technology Stack, Folder Structure

> **Document Version:** 1.0  
> **Audit Date:** 10 July 2026  
> **Project:** CivicAI — India's Responsible AI Government Platform  
> **Platform:** Built on Base44 (Backend-as-a-Service)

---

## How to Read the Status Labels

| Label | Meaning |
|---|---|
| **Implemented** | The feature genuinely exists and works in the current codebase |
| **Prototype / Simulated** | The feature is built in the UI but uses mock data or a simulated integration |
| **Future Integration** | The feature is planned but not yet built |

> **Critical honesty rule:** CivicAI does **not** have live Aadhaar, DigiLocker, PAN, OTP gateway, payment, or government database connections. All government identity and document data is **simulated mock data**.

---

# PART 1 — EXECUTIVE PROJECT SUMMARY

| Field | Detail |
|---|---|
| **Project Name** | CivicAI |
| **Product Category** | Government Technology (GovTech) — AI-powered citizen services super-app |
| **Main Objective** | Enable every Indian citizen to discover, apply for, and manage government schemes, welfare benefits, and documents through an AI assistant that speaks their language — with explainable, policy-backed, auditable guidance |
| **Target Users** | Indian citizens (especially rural, low-literacy, non-English-speaking), government caseworkers, policy administrators |
| **Main Problem Solved** | Citizens don't know which schemes they qualify for; portals are fragmented; eligibility rules are complex; most services are English-only |
| **Core Value Proposition** | One AI assistant that understands your family profile, speaks your language, tells you exactly which schemes you qualify for and why, and links you to the official portal — with every recommendation traceable to a policy source and a deterministic rule |
| **One-Line Description** | India's AI-powered digital government super-app combining Aadhaar-linked identity, household benefit analysis, multilingual voice AI, and explainable rule-based eligibility |
| **Current Maturity Level** | Hackathon-grade working prototype |

### 30-Second Pitch

> CivicAI is India's Responsible AI Government Platform. A citizen asks a question in Tamil, Hindi, or English — by text or voice — and the AI instantly recommends government schemes they qualify for, explains exactly why using policy rules and verified sources, and links them to the official portal. It analyzes the entire household. Every decision is auditable, explainable, and human-reviewable.

### One-Minute Pitch

> Millions of Indians miss out on government benefits simply because they don't know they exist or can't navigate the complexity. CivicAI solves this. A citizen speaks in their language — the AI detects the language, understands the intent, retrieves the citizen's verified profile and household, runs a deterministic rule engine against 8+ government schemes, and returns a structured recommendation with confidence score, policy version, required documents, application steps, and the official portal URL. The AI explains every decision. The household view shows total family benefits — ₹4.85 lakh for a 6-member family in the demo. Built on Base44 with React, Tailwind, an LLM integration, and a Deno backend function.

### Key Innovation

**Hybrid Rule Engine + LLM Architecture:** The deterministic Rule Engine decides eligibility (yes/no/conditional) using fixed policy rules. The LLM explains the result in the citizen's language. This separation prevents AI hallucination from affecting eligibility decisions — the AI can explain, but it cannot decide.

### Why CivicAI Is Different from a Normal Chatbot

| Normal Chatbot | CivicAI |
|---|---|
| Generates free-text answers | Returns structured JSON with confidence, policy source, rule matched |
| No eligibility validation | Deterministic Rule Engine validates every eligibility claim |
| No policy traceability | Every recommendation cites policy version and government portal URL |
| Single-language | 13 languages with voice input/output |
| Single-user focus | Household-level benefit analysis |
| No audit trail | Every decision logged with audit ID and human review status |
| No governance | Dedicated AI Governance Center |

### What Is Implemented (Genuinely Working)

| Feature | Status |
|---|---|
| LLM-powered AI chat with structured JSON response | **Implemented** |
| Multilingual UI (13 languages via i18n context) | **Implemented** |
| Voice input (Speech-to-Text) via Web Speech API | **Implemented** |
| Voice output (Text-to-Speech) via SpeechSynthesis API | **Implemented** |
| Deterministic Rule Engine (household benefit calculator) | **Implemented** |
| FamilyMember entity persistence (CRUD via Base44 SDK) | **Implemented** |
| Notification entity + backend function (bilingual notifications) | **Implemented** |
| 8 government scheme catalog with real portal URLs | **Implemented** |
| Document vault with expiry tracking | **Implemented** (simulated data) |
| 17+ fully designed pages with responsive layouts | **Implemented** |
| Authentication (Base44 auth — email/password, Google, OTP) | **Implemented** |
| Route protection (ProtectedRoute) | **Implemented** |

### What Is Simulated (Prototype)

| Feature | Status |
|---|---|
| Aadhaar-linked citizen profile | **Prototype / Simulated** |
| DigiLocker document integration | **Prototype / Simulated** |
| Government scheme eligibility data | **Prototype / Simulated** |
| Policy intelligence / government policy updates | **Prototype / Simulated** |
| Predictive governance analytics | **Prototype / Simulated** |
| AI decision log | **Prototype / Simulated** |
| Consent management persistence | **Prototype / Simulated** |
| Risk dashboard | **Prototype / Simulated** |
| Proactive alerts | **Prototype / Simulated** |
| Recent applications tracking | **Prototype / Simulated** |
| Map services (government office locations) | **Prototype / Simulated** |
| Governance metrics | **Prototype / Simulated** |

### What Remains for Production

- Live Aadhaar/UIDA authentication API
- Live DigiLocker document retrieval API
- Real government scheme database (200+ schemes)
- Persistent Application, Consent, AuditLog entities
- Real RAG pipeline with vector database
- Production payment integration
- Government SSO / e-Pramaan integration
- Scalability testing
- Legal and regulatory compliance certification

---

# PART 2 — COMPLETE TECHNOLOGY STACK

## Frontend Stack

| Component | Technology | Purpose | Status |
|---|---|---|---|
| Framework | React 18.2 | UI component library | Implemented |
| Build Tool | Vite | Dev server + bundler | Implemented |
| Styling | Tailwind CSS + CSS custom properties | Design system | Implemented |
| Component System | shadcn/ui (Radix UI) | Accessible UI components | Implemented |
| Animation | Framer Motion 11.x | Transitions, modals | Implemented |
| Routing | React Router DOM 6.x | Client-side routing | Implemented |
| State Management | React hooks (useState, useEffect, useContext) | Component state | Implemented |
| Data Fetching | @tanstack/react-query 5.x | Server state (notifications) | Implemented |
| Charts | Recharts 2.x | Bar, line, area, pie, radial | Implemented |
| Icons | lucide-react 0.475 | Icon system | Implemented |
| Maps | react-leaflet 4.x | Government office map | Implemented |
| Markdown | react-markdown 9.x | AI response rendering | Implemented |
| Forms | react-hook-form 7.x | Form handling | Implemented |
| Dates | date-fns 3.x + moment 2.x | Date formatting | Implemented |
| Utilities | lodash 4.x | Helper functions | Implemented |

## Backend Stack

| Component | Technology | Purpose | Status |
|---|---|---|---|
| Backend Runtime | Deno (Deno Deploy) | Serverless function execution | Implemented |
| Server Pattern | `Deno.serve(async (req) => {...})` | HTTP handler | Implemented |
| SDK | @base44/sdk 0.8.x | Entity CRUD, auth, integrations | Implemented |
| Auth | Base44 Auth (createClientFromRequest) | Authentication | Implemented |
| API Structure | Single-path POST endpoints | Function invocation | Implemented |
| Validation | Manual parameter checking | Input validation | Implemented |
| Error Handling | try/catch with JSON error responses | Error propagation | Implemented |

## Database

| Component | Technology | Purpose | Status |
|---|---|---|---|
| Database Type | NoSQL document store (Base44 managed) | Entity storage | Implemented |
| Entities | JSON schema definitions (.jsonc files) | Data model | Implemented |
| Query Method | base44.entities.EntityName.list/filter/create/update/delete | SDK CRUD | Implemented |
| Real-time | base44.entities.EntityName.subscribe() | Live updates | Available |
| User Records | User entity (built-in) | Auth, roles | Implemented |
| Family Records | FamilyMember entity | Household members | Implemented |
| Notification Records | Notification entity | Bilingual notifications | Implemented |

## AI Stack

| Component | Technology | Purpose | Status |
|---|---|---|---|
| LLM Provider | Base44 Core.InvokeLLM | AI chat, structured responses | Implemented |
| Prompt Engineering | buildCaseworkerPrompt() in aiPrompt.js | Context injection | Implemented |
| Response Schema | JSON Schema (caseworkerResponseSchema) | Structured output | Implemented |
| Rule Engine | householdCalculator.js — deterministic JS | Eligibility scoring | Implemented |
| RAG | Prompt includes scheme catalog as context | Context injection (not vector DB) | Prototype |
| Knowledge Base | governmentSchemes array (8 schemes) | Scheme data | Prototype |
| Language Detection | LLM auto-detects language | Returns detected_language | Implemented |
| Voice Input | Web Speech Recognition API | STT in 13 Indian locales | Implemented |
| Voice Output | SpeechSynthesis API | TTS with Indian locales | Implemented |
| Explainability | Structured JSON with why, rule, policy | Full transparency | Implemented |
| Confidence Scoring | LLM returns 0-100 + Rule Engine match % | Dual confidence | Implemented |
| Hallucination Control | Rule Engine decides; LLM explains | Separation of concerns | Implemented |
| Human Review | humanReview flag + backend template | Escalation signaling | Prototype |

## Infrastructure

| Component | Technology | Purpose | Status |
|---|---|---|---|
| Hosting | Base44 platform | Full-stack hosting | Implemented |
| Frontend Hosting | Base44 static hosting (Vite → dist) | CDN-served | Implemented |
| Backend Hosting | Deno Deploy (Base44 functions) | Serverless | Implemented |
| Database Hosting | Base44 managed database | NoSQL | Implemented |
| File Storage | Base44 UploadFile / UploadPrivateFile | Document upload | Available |
| Custom Domain | civicai.online | DNS configured | Configured (SSL pending) |
| DNS | IONOS name servers | A record + CNAME | Configured |
| SSL | Base44-managed certificate | HTTPS | Pending verification |
| Deployment | Base44 auto-deploy on save | No CI/CD needed | Implemented |
| Secrets | Base44 dashboard | Deno.env.get() | Implemented |
| Logging | Base44 function logs | Backend debugging | Implemented |

## Stack Summary Table

| Layer | Technology | Purpose | Status |
|---|---|---|---|
| Frontend Framework | React 18 + Vite | UI rendering | Implemented |
| Styling | Tailwind CSS + CSS tokens | Design system | Implemented |
| UI Components | shadcn/ui + custom | Accessible interface | Implemented |
| Animation | Framer Motion | Smooth UX | Implemented |
| Routing | React Router DOM 6 | Navigation | Implemented |
| Charts | Recharts | Data visualization | Implemented |
| Maps | react-leaflet | Office finder | Implemented |
| Markdown | react-markdown | AI response rendering | Implemented |
| Icons | lucide-react | Visual language | Implemented |
| Backend Runtime | Deno (Deno Deploy) | Serverless functions | Implemented |
| SDK | @base44/sdk | Entity/auth/integration | Implemented |
| Database | Base44 NoSQL | Data persistence | Implemented |
| AI | Base44 Core.InvokeLLM | LLM-powered chat | Implemented |
| Voice | Web Speech API | STT + TTS | Implemented |
| Auth | Base44 Auth | Email/Google/OTP | Implemented |
| Hosting | Base44 platform | Full-stack hosting | Implemented |
| Domain | civicai.online | Custom domain | Configured |

---

# PART 3 — FOLDER STRUCTURE

## Current Project Structure

```
civicai/
├── index.html                          # Page title, favicon, meta
├── package.json                        # Dependencies
├── tailwind.config.js                  # Theme + safelist
├── vite.config.js                      # Build config
├── base44/
│   ├── config.jsonc                    # App config
│   ├── entities/
│   │   ├── User.jsonc                  # Built-in user entity
│   │   ├── FamilyMember.jsonc          # Household member entity
│   │   └── Notification.jsonc          # Notification entity
│   ├── functions/
│   │   └── notifyStatusChange/
│   │       └── entry.ts               # Backend function
│   ├── agents/                         # (empty)
│   └── workflows/                      # (empty)
├── src/
│   ├── main.jsx                        # React entry
│   ├── App.jsx                         # Router + auth wrapper
│   ├── index.css                       # Design tokens + Tailwind
│   ├── api/base44Client.js             # Pre-initialized SDK
│   ├── lib/
│   │   ├── indiaData.js                # Mock citizen, schemes, documents
│   │   ├── mockData.js                 # Legacy mock data (Singapore-era)
│   │   ├── householdCalculator.js      # Deterministic rule engine
│   │   ├── aiPrompt.js                 # LLM prompt builder + schema
│   │   ├── i18n.jsx                    # 13-language translation context
│   │   ├── AuthContext.jsx             # Auth state
│   │   └── utils.js                    # cn() utility
│   ├── hooks/
│   │   ├── useVoiceAssistant.js        # TTS + STT hook
│   │   └── useUnreadNotifications.js   # Notification counter
│   ├── pages/                          # 17+ page components
│   │   ├── Landing.jsx, Dashboard.jsx, AIChat.jsx, Schemes.jsx
│   │   ├── Family.jsx, LifeEvents.jsx, Documents.jsx, MapServices.jsx
│   │   ├── Proactive.jsx, Governance.jsx, ExplainableAI.jsx
│   │   ├── RuleEngine.jsx, DecisionLog.jsx, Consent.jsx, Risk.jsx
│   │   ├── PolicyIntelligence.jsx, Predictive.jsx, Architecture.jsx
│   │   └── Login.jsx, Register.jsx, ForgotPassword.jsx, ResetPassword.jsx
│   └── components/
│       ├── AppLayout.jsx, Sidebar.jsx, PageHeader.jsx
│       ├── TrustBadges.jsx, LanguageSelector.jsx
│       ├── VoiceButton.jsx, NotificationCenter.jsx
│       ├── AadhaarProfileCard.jsx, HouseholdAnalysisCard.jsx
│       ├── DocumentWalletCard.jsx, ProtectedRoute.jsx
│       ├── ui/                         # 40+ shadcn components
│       │   ├── Icon.jsx, GlassCard.jsx, KpiCard.jsx
│       │   └── button.jsx, card.jsx, dialog.jsx, ...
│       ├── ai/SchemeCard.jsx, ai/VoiceInputButton.jsx
│       └── family/LinkMemberForm.jsx
└── .github/workflows/ci.yml
```

## Recommended Production Structure

```
civicai/
├── frontend/src/
│   ├── pages/           # Route components
│   ├── components/      # Reusable UI (ui/, layout/, cards/, ai/, family/)
│   ├── hooks/           # Custom hooks
│   ├── services/        # API wrappers
│   ├── context/         # React contexts
│   ├── utils/           # Utilities
│   └── constants/       # Config
├── backend/
│   ├── modules/         # Domain modules (auth, citizen, household, schemes...)
│   ├── controllers/     # HTTP handlers
│   ├── middleware/      # Auth, rate-limit, validation
│   └── validators/      # Input schemas
├── ai/
│   ├── prompts/         # LLM templates
│   ├── schemas/         # Response schemas
│   ├── rag/             # Retrieval + embeddings + knowledge-base
│   └── rule-engine/     # Deterministic rules
├── database/
│   ├── entities/        # Schema definitions
│   ├── migrations/      # Schema changes
│   └── seeds/           # Seed data
├── integrations/        # aadhaar/, digilocker/, government-portals/
├── security/            # encryption/, auth/, audit/
├── docs/                # Technical docs
├── tests/               # unit/, integration/, e2e/
└── deployment/          # Configs
```

## Identified Organization Issues

| Issue | Recommendation |
|---|---|
| Duplicate data layer (indiaData.js + mockData.js) | Consolidate into single data source |
| Mixed data sources (entity vs mock per page) | Migrate all to entity-backed data |
| Legacy Singapore references in ExplainableAI.jsx + mockData.js | Replace with India-specific data |
| Oversized files (indiaData.js 765 lines, i18n.jsx 1000+ lines) | Split by domain |
| No service layer (pages call base44.entities directly) | Create service modules |
| Consent not persisted (local useState only) | Create Consent entity |

---

*Continued in Part 2: Module Documentation, Page-by-Page, System Architecture*