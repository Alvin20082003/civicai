# CivicAI — Developer Handover Documentation

> **Audience:** Developers taking over the CivicAI codebase
> **Purpose:** Complete technical reference for codebase understanding, maintenance, and future development
> **Core Principle:** Every claim is labeled — Implemented, Prototype / Simulated, or Future Integration

---

## 1. PROJECT OVERVIEW

| Field | Detail |
|---|---|
| **Project Name** | CivicAI |
| **Category** | Government Technology (GovTech) — AI-powered citizen services super-app |
| **Platform** | Base44 (Backend-as-a-Service) |
| **Repository** | Base44 builder (browser-based IDE) |
| **Domain** | civicai.online (DNS configured, SSL pending verification) |
| **Maturity** | Hackathon-grade working prototype |

### Objective
Enable Indian citizens to discover, apply for, and manage government schemes via an AI assistant that speaks their language, with explainable, policy-backed, auditable guidance.

### Core Innovation
**Rule Engine + LLM Hybrid:** Deterministic rule engine (`householdCalculator.js`) decides eligibility. LLM (Base44 InvokeLLM) explains the decision in the citizen's language. This prevents AI hallucination from affecting eligibility decisions.

---

## 2. TECHNOLOGY STACK

### Frontend (All Implemented)

| Component | Technology | Version |
|---|---|---|
| Framework | React | 18.2 |
| Build Tool | Vite | — |
| Styling | Tailwind CSS + CSS custom properties | — |
| UI Components | shadcn/ui (Radix UI primitives) | — |
| Animation | Framer Motion | 11.x |
| Routing | React Router DOM | 6.x |
| State Management | React hooks (useState, useEffect, useContext) | — |
| Data Fetching | @tanstack/react-query | 5.x |
| Charts | Recharts | 2.x |
| Icons | lucide-react | 0.475 |
| Maps | react-leaflet | 4.x |
| Markdown | react-markdown | 9.x |
| Forms | react-hook-form | 7.x |
| Dates | date-fns + moment | 3.x / 2.x |
| Utilities | lodash | 4.x |
| Drag & Drop | @hello-pangea/dnd | 17.x (installed, not actively used) |

### Backend (All Implemented)

| Component | Technology |
|---|---|
| Runtime | Deno (Deno Deploy) |
| Server Pattern | `Deno.serve(async (req) => {...})` |
| SDK | @base44/sdk 0.8.x |
| Auth | Base44 Auth (createClientFromRequest) |
| API Structure | Single-path POST endpoints |
| Validation | Manual parameter checking |
| Error Handling | try/catch with JSON error responses |

### Database (All Implemented)

| Component | Technology |
|---|---|
| Type | NoSQL document store (Base44 managed) |
| Entities | JSON schema definitions (.jsonc files) |
| Query | base44.entities.EntityName.list/filter/create/update/delete |
| Real-time | base44.entities.EntityName.subscribe() |

### AI (Mixed Implementation)

| Component | Technology | Status |
|---|---|---|
| LLM Provider | Base44 Core.InvokeLLM | Implemented |
| Prompt Engineering | buildCaseworkerPrompt() in aiPrompt.js | Implemented |
| Response Schema | JSON Schema (caseworkerResponseSchema) | Implemented |
| Rule Engine | householdCalculator.js — deterministic JS | Implemented |
| RAG | Prompt includes scheme catalog as context | Prototype / Simulated (not vector DB) |
| Knowledge Base | governmentSchemes array (8 schemes) | Prototype / Simulated |
| Language Detection | LLM auto-detects | Implemented |
| Voice Input | Web Speech Recognition API | Implemented |
| Voice Output | SpeechSynthesis API | Implemented |
| Hallucination Control | Rule engine separation + source_verified flag | Implemented |
| Human Review | humanReview flag + backend template | Prototype / Simulated |

### Infrastructure (All Implemented)

| Component | Provider | Status |
|---|---|---|
| Hosting | Base44 platform | Implemented |
| Frontend | Base44 static hosting (Vite → dist) | Implemented |
| Backend | Deno Deploy (Base44 functions) | Implemented |
| Database | Base44 managed NoSQL | Implemented |
| File Storage | Base44 UploadFile / UploadPrivateFile | Available (unused) |
| Auth | Base44 Auth | Implemented |
| SSL | Base44-managed (Let's Encrypt) | Pending domain verification |
| CDN | Base44 CDN | Implemented |
| Domain | civicai.online | DNS configured, SSL pending |
| Deployment | Auto-deploy on save | Implemented |
| Secrets | Base44 dashboard | Implemented |

---

## 3. FOLDER STRUCTURE

```
civicai/
├── index.html                          # Page title, favicon, meta
├── package.json                        # Dependencies
├── tailwind.config.js                  # Theme + safelist
├── postcss.config.js                   # PostCSS config
├── vite.config.js                      # Vite build config
├── jsconfig.json                       # Path aliases (@/ → src/)
├── components.json                     # shadcn/ui config
├── base44/
│   ├── config.jsonc                    # Base44 app config
│   ├── entities/
│   │   ├── User.jsonc                  # Built-in user entity
│   │   ├── FamilyMember.jsonc          # Household member entity
│   │   └── Notification.jsonc          # Notification entity
│   ├── functions/
│   │   └── notifyStatusChange/
│   │       └── entry.ts               # Backend function
│   ├── agents/                         # Empty
│   └── workflows/                      # Empty
├── src/
│   ├── main.jsx                        # React entry
│   ├── App.jsx                         # Router + auth wrapper
│   ├── index.css                       # Design tokens + Tailwind
│   ├── api/
│   │   └── base44Client.js             # Pre-initialized SDK
│   ├── lib/
│   │   ├── indiaData.js                # Mock citizen, schemes, documents (765 lines)
│   │   ├── mockData.js                 # Legacy mock data (Singapore-era)
│   │   ├── householdCalculator.js      # Deterministic rule engine
│   │   ├── aiPrompt.js                 # LLM prompt builder + JSON schema
│   │   ├── i18n.jsx                    # 13-language translation context (1000+ lines)
│   │   ├── AuthContext.jsx             # Auth state
│   │   ├── app-params.js               # App parameter handling
│   │   ├── query-client.js             # React Query client
│   │   ├── PageNotFound.jsx            # 404 page
│   │   └── utils.js                    # cn() utility
│   ├── hooks/
│   │   ├── useVoiceAssistant.js        # TTS + STT hook
│   │   ├── useUnreadNotifications.js   # Notification counter
│   │   ├── use-size.jsx                # shadcn size hook
│   │   └── use-mobile.jsx              # shadcn mobile detection
│   ├── pages/                          # 20 page components
│   │   ├── Landing.jsx                 # Public landing
│   │   ├── Dashboard.jsx               # Citizen dashboard
│   │   ├── AIChat.jsx                  # AI caseworker chat
│   │   ├── Schemes.jsx                 # Scheme catalog
│   │   ├── Family.jsx                  # Household calculator
│   │   ├── LifeEvents.jsx              # Life event discovery
│   │   ├── Documents.jsx               # Document vault
│   │   ├── MapServices.jsx             # Government office map
│   │   ├── Proactive.jsx               # AI alerts
│   │   ├── Governance.jsx              # AI governance center
│   │   ├── ExplainableAI.jsx           # Decision explanations
│   │   ├── RuleEngine.jsx              # Pipeline visualization
│   │   ├── DecisionLog.jsx             # Audit trail
│   │   ├── Consent.jsx                 # Consent management
│   │   ├── Risk.jsx                    # Risk dashboard
│   │   ├── PolicyIntelligence.jsx      # Policy monitoring
│   │   ├── Predictive.jsx              # Predictive analytics
│   │   ├── Architecture.jsx            # System architecture
│   │   ├── Login.jsx                   # Login
│   │   ├── Register.jsx                # Registration + OTP
│   │   ├── ForgotPassword.jsx          # Password reset request
│   │   └── ResetPassword.jsx           # Password reset
│   └── components/
│       ├── AppLayout.jsx               # Main layout (sidebar + topbar)
│       ├── Sidebar.jsx                 # Navigation sidebar
│       ├── Topbar.jsx                  # Top bar
│       ├── PageHeader.jsx              # Reusable page header
│       ├── TrustBadges.jsx             # Trust badge strip
│       ├── LanguageSelector.jsx        # Language dropdown
│       ├── LanguageToggle.jsx          # Quick language toggle
│       ├── VoiceButton.jsx             # TTS play/stop
│       ├── VoiceCommandBar.jsx         # Voice command bar
│       ├── NotificationCenter.jsx      # Notification dropdown
│       ├── AadhaarProfileCard.jsx      # Citizen profile card
│       ├── HouseholdAnalysisCard.jsx   # Household summary
│       ├── DocumentWalletCard.jsx      # Document vault summary
│       ├── ScrollToTop.jsx             # Scroll restoration
│       ├── ProtectedRoute.jsx          # Auth route guard
│       ├── AuthLayout.jsx              # Auth page wrapper
│       ├── UserNotRegisteredError.jsx  # Error boundary
│       ├── GoogleIcon.jsx              # Google OAuth icon
│       ├── ui/                         # 40+ shadcn components
│       │   ├── Icon.jsx                # Custom icon mapper
│       │   ├── GlassCard.jsx           # Glass-morphism card
│       │   ├── KpiCard.jsx             # KPI metric card
│       │   └── (40+ shadcn primitives)
│       ├── ai/
│       │   ├── SchemeCard.jsx          # AI-recommended scheme card
│       │   └── VoiceInputButton.jsx    # STT toggle button
│       └── family/
│           └── LinkMemberForm.jsx      # Multi-step family member form
└── .github/
    ├── dependabot.yml
    └── workflows/
        ├── ci.yml
        └── dependabot-auto-merge.yml
```

### Known Organization Issues

| Issue | Recommendation |
|---|---|
| Duplicate data layer (indiaData.js + mockData.js) | Consolidate into single source |
| Mixed data sources (entity vs mock per page) | Migrate all to entity-backed data |
| Legacy Singapore references in ExplainableAI.jsx + mockData.js | Replace with India-specific data |
| Oversized files (indiaData.js 765 lines, i18n.jsx 1000+ lines) | Split by domain |
| No service layer (pages call base44.entities directly) | Create service modules |
| Consent not persisted (local useState) | Create Consent entity |

---

## 4. ENTITY SCHEMAS

### User (Built-in — Base44 Managed)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| email | string | Unique, required |
| full_name | string | Display name |
| role | string | "admin" / "user" |
| created_date | datetime (auto) | |
| updated_date | datetime (auto) | |

- **Status:** Implemented
- **Note:** User records cannot be created/imported — users join via invites

### FamilyMember

| Field | Type | Notes |
|---|---|---|
| name | string | Required |
| relation | enum | Self, Father, Mother, Spouse, Son, Daughter, Brother, Sister, Grandfather, Grandmother, Other |
| age | number | Required |
| gender | enum | Male, Female, Other |
| occupation | string | Required |
| annual_income | number | Default: 0 |
| aadhaar_linked | boolean | Default: false |
| student | boolean | Default: false |
| senior_citizen | boolean | Default: false |
| disability | boolean | Default: false |
| bpl_category | boolean | Default: false |
| avatar | string | URL |

- **Status:** Implemented (full CRUD)
- **Access:** User-scoped (created_by_id)

### Notification

| Field | Type | Notes |
|---|---|---|
| title_en | string | Required |
| title_ta | string | Required |
| description_en | string | Required |
| description_ta | string | Required |
| type | enum | success, warning, info, action_required |
| category | enum | status_change, action_required, document, policy, system |
| read | boolean | Default: false |
| application_id | string | Optional |
| service_name | string | Optional |
| action_label_en | string | Optional |
| action_label_ta | string | Optional |
| action_link | string | Optional |

- **Status:** Implemented (via backend function)

### Future Entities (Not Yet Created)

| Entity | Key Fields | Status |
|---|---|---|
| CitizenProfile | aadhaar_masked, pan_masked, state, district, trust_score | Future Integration |
| GovernmentScheme | name, category, ministry, benefit, eligibility[], portal_url, policy_version | Future Integration |
| EligibilityRule | scheme_id, conditions[], threshold, points[] | Future Integration |
| PolicySource | title, department, version, text | Future Integration |
| Document | name, type, number, verified, expiry, file_url | Future Integration |
| Consent | user_id, data_type, granted, purpose, expiry | Future Integration |
| Application | user_id, scheme_id, status, submitted_date | Future Integration |
| AIRecommendation | user_id, query, response, confidence, audit_id | Future Integration |
| AIDecision | user_id, decision, policy, confidence, human_review | Future Integration |
| AuditLog | user_id, action, entity, entity_id, timestamp | Future Integration |
| HumanReview | application_id, ai_decision, officer_id, review_status | Future Integration |

---

## 5. RULE ENGINE DOCUMENTATION

### Location
`src/lib/householdCalculator.js`

### How It Works

Each scheme has a scoring function:

```javascript
"scheme-id": (member) => {
  const score =
    (condition1 ? points1 : 0) +
    (condition2 ? points2 : 0) + ...;
  return { match: Math.min(score + base, maxMatch), eligible: score >= threshold, benefit: amount };
}
```

### Execution Flow

1. `FamilyMember.list()` retrieves household members from database
2. `calculateHouseholdBenefits(members)` iterates each member
3. For each member, `calculateMemberEligibility(member)` runs all 8 scheme rules
4. Each rule returns `{ match, eligible, benefit }`
5. Results aggregated: total benefit, eligible count, category breakdown

### Scheme Rules

| Scheme | Conditions (points) | Threshold | Benefit | Status |
|---|---|---|---|---|
| PM-KISAN | Farmer +40, Age≥18 +30, Aadhaar +20, Income<5L +10 | ≥60 | ₹6,000 | Implemented |
| NSP Engineering | Student +40, Age 18-30 +30, Income<2L +25, Aadhaar +5 | ≥60 | ₹50,000 | Implemented |
| Ayushman Bharat | Senior/Age≥60 +40, BPL/Income<1L +35, Aadhaar +20 | ≥60 | ₹5,00,000 | Implemented |
| PMAY | Income 1L-6L +30, Age≥18 +20, Female +15, Aadhaar +10 | ≥50 | ₹1,50,000 | Implemented |
| Old Age Pension | Age≥60 +50, BPL/Income<1L +30, Aadhaar +15 | ≥60 | ₹12,000 | Implemented |
| Beti Bachao | Female +40, Student +30, Age 9-25 +20, Income<2L +10 | ≥60 | ₹25,000 | Implemented |
| Stand-Up India | Female +35, Age≥18 +25, Business +20, Aadhaar +10 | ≥50 | ₹1,00,000 | Implemented |
| Skill India | Age 15-45 +40, Student/Unemployed +25, Aadhaar +15 | ≥50 | ₹15,000 | Implemented |

### Output Classification

| Classification | Condition | UI Color |
|---|---|---|
| Eligible | score ≥ threshold | Green (success) |
| Potentially Eligible | match ≥ 80 but score < threshold | Blue (primary) |
| Not Eligible | match < 80 and score < threshold | Gray (muted) |
| Human Review Required | Flagged by LLM or low confidence | Orange (warning) |

### Core Principle

> **"The Rule Engine decides eligibility. The LLM explains the result."**

### Limitations
- Simplified scoring (not full policy text)
- No policy versioning in rule engine
- No rule update workflow
- No rule conflict detection
- Client-side execution only
- No audit logging of evaluations

---

## 6. AI INTEGRATION DOCUMENTATION

### Location
- Prompt builder: `src/lib/aiPrompt.js`
- Chat page: `src/pages/AIChat.jsx`

### LLM Call

```javascript
const response = await base44.integrations.Core.InvokeLLM({
  prompt: buildCaseworkerPrompt(userQuery),
  response_json_schema: caseworkerResponseSchema,
  // model: "automatic" (default)
});
```

### Response Schema (caseworkerResponseSchema)

```json
{
  "detected_language": "string",
  "intent_summary": "string",
  "greeting": "string",
  "summary": "string",
  "total_estimated_benefit": "string",
  "recommended_schemes": [
    {
      "scheme_name": "string",
      "eligibility_status": "Eligible|Conditional|Not Eligible",
      "confidence_score": "number (0-100)",
      "why_recommended": "string",
      "eligibility_reasons": ["string"],
      "ai_guidance": "string",
      "required_documents": ["string"],
      "application_steps": ["string"],
      "government_portal": "string",
      "government_url": "string",
      "policy_version": "string",
      "source_verified": "boolean",
      "rule_matched": "string",
      "estimated_benefit": "string",
      "humanReview": "boolean"
    }
  ],
  "rule_engine_validation": "string",
  "audit_log_id": "string"
}
```

### Context Injection (buildCaseworkerPrompt)

The prompt builder injects:
- Citizen profile (mock — from `indiaData.js`)
- Family members (from FamilyMember entity — Implemented)
- Government schemes catalog (8 schemes — from `indiaData.js`)
- Document wallet (mock — from `indiaData.js`)
- Instructions for language detection, intent, confidence, policy citation

### What the LLM Does

| Use Case | Status |
|---|---|
| Natural language understanding | Implemented |
| Language detection | Implemented |
| Scheme recommendation (from context) | Implemented |
| Explanation generation | Implemented |
| Confidence scoring | Implemented |
| Policy citation | Implemented |
| Intent summarization | Implemented |
| Conversational greeting | Implemented |

### What the LLM Does NOT Do

| Decision | Who Decides | Why |
|---|---|---|
| Eligibility (yes/no) | Rule Engine | Prevents hallucination |
| Match score | Rule Engine | Deterministic |
| Benefit amount | Scheme catalog | Prevents fabrication |
| Application approval | Human officer / Portal | AI cannot approve |

### Hallucination Control

| Technique | Status |
|---|---|
| Rule engine separation | Implemented |
| Structured JSON schema | Implemented |
| Context injection | Implemented |
| source_verified flag | Implemented |
| Policy version citation | Implemented |
| Human review flag | Prototype / Simulated |

### Timeout
45 seconds with error fallback message in citizen's language.

### Limitations
- No chat history persistence (in-memory only)
- No conversation context across messages
- LLM may occasionally hallucinate explanatory text
- No streaming responses
- No RAG with vector database (prompt injection only)

---

## 7. BACKEND FUNCTION DOCUMENTATION

### notifyStatusChange

**Location:** `base44/functions/notifyStatusChange/entry.ts`

**Purpose:** Create bilingual (English/Tamil) status change notifications

**Input:**
```json
{
  "application_id": "string",
  "new_status": "string",
  "service_name": "string"
}
```

**Processing:**
1. Authenticates user via `base44.auth.me()`
2. Returns 401 if not authenticated
3. Selects bilingual template based on `new_status`
4. Creates Notification entity

**Output:**
```json
{
  "success": true,
  "notification": { ... }
}
```

**Status Templates:**
- `submitted` → "Application Submitted"
- `under_review` → "Under Review"
- `approved` → "Application Approved"
- `rejected` → "Application Rejected"
- `human_review` → "Human Review Required"

**Status:** Implemented

### Calling from Frontend

```javascript
import { base44 } from "@/api/base44Client";

const response = await base44.functions.invoke('notifyStatusChange', {
  application_id: "APP-001",
  new_status: "approved",
  service_name: "PM-KISAN"
});
// response.data = { success, notification }
```

---

## 8. MULTILINGUAL & VOICE DOCUMENTATION

### i18n System

**Location:** `src/lib/i18n.jsx`

**Usage:**
```jsx
import { useI18n } from "@/lib/i18n";

function MyComponent() {
  const { t, language, setLanguage } = useI18n();
  return <p>{t('dashboard_title')}</p>;
}
```

### Supported Languages

| Code | Language | Locale | Translation Status |
|---|---|---|---|
| en | English | en-IN | Complete |
| ta | Tamil | ta-IN | Complete |
| hi | Hindi | hi-IN | Complete |
| te | Telugu | te-IN | Complete |
| ml | Malayalam | ml-IN | Complete |
| kn | Kannada | kn-IN | Complete |
| bn | Bengali | bn-IN | Complete |
| mr | Marathi | mr-IN | Complete |
| gu | Gujarati | gu-IN | Partial |
| pa | Punjabi | pa-IN | Partial |
| ur | Urdu | ur-IN | Partial |
| or | Odia | or-IN | Partial |
| as | Assamese | as-IN | Partial |

### Voice Assistant

**Location:** `src/hooks/useVoiceAssistant.js`

**TTS (Text-to-Speech):**
```javascript
const { speak, stopSpeaking, isSpeaking } = useVoiceAssistant();
speak("வணக்கம்!", "ta");
```

Uses `SpeechSynthesis` API with Indian locale voices.

**STT (Speech-to-Text):**
```javascript
const { startListening, stopListening, isListening, transcript } = useVoiceAssistant();
startListening("ta", (finalTranscript) => {
  // Handle transcribed text
});
```

Uses `SpeechRecognition` API with Indian locales (`ta-IN`, `hi-IN`, etc.).

### Status: Implemented (browser-dependent quality)

---

## 9. PAGE-BY-PAGE REFERENCE

| Page | Route | Purpose | Data Source | Status |
|---|---|---|---|---|
| Landing | `/` | Marketing page | indiaData.js | Implemented |
| Dashboard | `/dashboard` | Citizen dashboard | indiaData.js + Notification entity | Implemented |
| AI Chat | `/chat` | AI caseworker | InvokeLLM + indiaData.js | Implemented |
| Schemes | `/schemes` | Scheme catalog | indiaData.js | Implemented |
| Family | `/family` | Household calculator | FamilyMember entity + householdCalculator.js | Implemented |
| Life Events | `/life-events` | Life event discovery | indiaData.js | Implemented |
| Documents | `/documents` | Document vault | indiaData.js | Prototype / Simulated |
| Map Services | `/map-services` | Office finder | officeData.js | Implemented |
| Proactive | `/proactive` | AI alerts | Hardcoded | Prototype / Simulated |
| Governance | `/governance` | AI governance | mockData.js | Prototype / Simulated |
| Explainable AI | `/explainable-ai` | Decision explanations | Hardcoded | Prototype / Simulated |
| Rule Engine | `/rule-engine` | Pipeline visualization | mockData.js | Prototype / Simulated |
| Decision Log | `/decision-log` | Audit trail | mockData.js | Prototype / Simulated |
| Consent | `/consent` | Consent management | mockData.js (local state) | Prototype / Simulated |
| Risk | `/risk` | Risk dashboard | mockData.js | Prototype / Simulated |
| Policy Intelligence | `/policy-intelligence` | Policy monitoring | mockData.js | Prototype / Simulated |
| Predictive | `/predictive` | Predictive analytics | mockData.js | Prototype / Simulated |
| Architecture | `/architecture` | System diagram | mockData.js | Implemented |
| Login | `/login` | Authentication | Base44 Auth | Implemented |
| Register | `/register` | Registration + OTP | Base44 Auth | Implemented |
| ForgotPassword | `/forgot-password` | Password reset request | Base44 Auth | Implemented |
| ResetPassword | `/reset-password` | Password reset | Base44 Auth | Implemented |

---

## 10. API REFERENCE

### Authentication (Base44 SDK — Implemented)

```javascript
// Login
await base44.auth.loginViaEmailPassword(email, password);

// Google OAuth
await base44.auth.loginWithProvider('google', fromUrl);

// Register (does NOT log in — requires OTP)
await base44.auth.register({ email, password });

// Verify OTP
await base44.auth.verifyOtp({ email, otpCode });

// Get current user
const user = await base44.auth.me();

// Logout
await base44.auth.logout();
```

### Entity CRUD (Base44 SDK — Implemented)

```javascript
// List
const members = await base44.entities.FamilyMember.list();

// Filter
const filtered = await base44.entities.FamilyMember.filter({ relation: "Father" });

// Create
const member = await base44.entities.FamilyMember.create({ name: "Rajesh", ... });

// Bulk create
const members = await base44.entities.FamilyMember.bulkCreate([{ ... }, { ... }]);

// Update
await base44.entities.FamilyMember.update(id, { age: 55 });

// Delete
await base44.entities.FamilyMember.delete(id);

// Real-time subscription
const unsubscribe = base44.entities.FamilyMember.subscribe((event) => {
  // event: { id, type: 'create'|'update'|'delete', data }
});
```

### Backend Function Invocation (Implemented)

```javascript
const response = await base44.functions.invoke('notifyStatusChange', {
  application_id: "APP-001",
  new_status: "approved",
  service_name: "PM-KISAN"
});
// response.data = { success, notification }
```

### LLM Integration (Implemented)

```javascript
const response = await base44.integrations.Core.InvokeLLM({
  prompt: buildCaseworkerPrompt(userQuery),
  response_json_schema: caseworkerResponseSchema
});
```

### Available But Unused Integrations

| Integration | Purpose | Status |
|---|---|---|
| Core.UploadFile | Upload file | Available (unused) |
| Core.ExtractDataFromUploadedFile | Document intelligence | Available (unused) |
| Core.SendEmail | Send email | Available (unused) |
| Core.GenerateImage | Generate AI image | Available (unused) |
| Core.GenerateSpeech | Premium TTS | Available (unused) |
| Core.UploadPrivateFile | Private file upload | Available (unused) |
| Core.CreateFileSignedUrl | Signed download URL | Available (unused) |

---

## 11. SECURITY DOCUMENTATION

### Current Security (Implemented)

| Control | Implementation |
|---|---|
| Authentication | Base44 Auth — email/password, Google OAuth, OTP |
| Route Protection | ProtectedRoute wraps authenticated routes |
| Session Management | Base44-managed tokens, HTTP-only cookies |
| Password Security | Base44-managed (hashed storage, reset flow) |
| OTP Verification | Base44-managed (register → OTP → verify → token) |
| Encryption in Transit | HTTPS (Base44-managed SSL) |
| Encryption at Rest | Base44-managed database encryption |
| User-Scoped Data | Entity reads scoped to created_by_id |
| Admin Role | User entity role field |
| Input Validation | Manual parameter checking in backend function |
| Secrets Management | Base44 dashboard + Deno.env.get() |
| Error Handling | try/catch with JSON error responses |

### Not Yet Implemented

| Control | Status | Recommendation |
|---|---|---|
| Rate Limiting | Future Integration | Add to backend functions and LLM calls |
| Input Sanitization | Future Integration | Add sanitization library |
| File Upload Security | Future Integration | Type validation, size limits, malware scanning |
| Audit Logging | Future Integration | Create AuditLog entity |
| Consent Enforcement | Future Integration | Create Consent entity |
| Data Minimization | Future Integration | Field-level access control |
| Data Retention | Future Integration | Define policies |
| Incident Reporting | Future Integration | Create workflow |

---

## 12. DEPLOYMENT DOCUMENTATION

### Build Process
1. Developer edits code in Base44 builder
2. On save: `npm install` + `npm run build` (Vite)
3. Static files deployed to Base44 CDN
4. Backend functions deployed to Deno Deploy
5. App live immediately

### Domain Configuration

```
DNS:
  NS: ns1038.ui-dns.com, ns1044.ui-dns.biz, ns1086.ui-dns.org, ns1092.ui-dns.de
  A record: civicai.online → 216.24.57.1 (Base44 IP)
  CNAME: www.civicai.online → base44.onrender.com

SSL: Pending domain verification in Base44 dashboard
```

### Environment Variables
- `BASE44_APP_ID` (pre-populated)
- Others configurable via Base44 dashboard → Settings → Environment Variables

### Secrets
Set via Base44 dashboard. Read in functions with `Deno.env.get("SECRET_NAME")`.

### Logging
Backend function logs available via `test_backend_function` tool and Base44 dashboard.

---

## 13. TESTING

### Current Status

| Test Type | Status |
|---|---|
| Unit testing | Not implemented |
| Integration testing | Not implemented |
| UI testing | Not implemented |
| API testing | Available (test_backend_function) |
| Rule engine testing | Not implemented |
| AI response testing | Not implemented |
| Security testing | Not implemented |
| Performance testing | Not implemented |

### Testing the Backend Function

```javascript
// Via test_backend_function tool or dashboard
test_backend_function('notifyStatusChange', {
  application_id: "APP-001",
  new_status: "approved",
  service_name: "PM-KISAN"
});
```

---

## 14. KNOWN ISSUES & TECHNICAL DEBT

| Issue | Impact | Recommendation |
|---|---|---|
| Duplicate data layer (indiaData.js + mockData.js) | Confusion, maintenance burden | Consolidate |
| Legacy Singapore references | Inconsistent data | Replace with India data |
| Oversized files (indiaData.js, i18n.jsx) | Slow editing, hard to maintain | Split by domain |
| No service layer | Tight coupling | Create service modules |
| Consent not persisted | Resets on refresh | Create Consent entity |
| Chat history not persisted | Resets on refresh | Create ChatSession entity |
| No conversation memory | Each message independent | Add conversation context |
| Client-side rule engine | Rules visible in source | Move to server-side |
| No rate limiting | Vulnerable to abuse | Add to functions |
| No audit logging | No real audit trail | Create AuditLog entity |

---

## 15. PRODUCTION ROADMAP

### Phase 1: Hackathon Prototype (Current)
- 17 pages, AI chat, rule engine, family linking
- Base44 InvokeLLM, Notification function
- Base44 auth, route protection
- civicai.online (SSL pending)

### Phase 2: MVP (Future Integration)
- Persistent chat history
- Application entity, Consent entity
- Real citizen profile linked to auth user
- Document upload (Base44 UploadFile)
- DigiLocker API
- 50+ schemes
- Rate limiting, input validation
- Real audit logging

### Phase 3: Government Pilot (Future Integration)
- Aadhaar e-KYC (UIDA API)
- Real application submission
- Workflow automation (Base44 workflows)
- RAG with vector database
- e-Pramaan SSO
- Portal APIs (NSP, PM-KISAN, PM-JAY)
- Penetration testing
- ISO 27001

### Phase 4: State-Level Deployment (Future Integration)
- All 13 languages fully translated
- Voice-first navigation
- Admin dashboard
- Officer review queue
- State government APIs
- CERT-In audit
- Multi-region deployment

### Phase 5: National-Scale Platform (Future Integration)
- 200+ schemes
- AI agent for autonomous case management
- Predictive resource allocation
- All central + state APIs
- UMANG integration
- Continuous monitoring
- 99.99% uptime SLA

---

## 16. DEVELOPER QUICK START

### To Run Locally
1. Open project in Base44 builder
2. App auto-builds and deploys
3. Navigate to civicai.online or use Base44 preview URL

### To Test AI Chat
1. Navigate to `/chat`
2. Type a query in any language (e.g., "What schemes am I eligible for?")
3. Or click a suggested question
4. Or use voice input (click microphone button)

### To Test Family Calculator
1. Navigate to `/family`
2. If no members exist, 6 default mock members are seeded
3. Click "Link Member" to add a new member
4. View household benefit calculation (₹4,85,000 for default family)
5. Click a member to see their eligible schemes

### To Test Notifications
```javascript
// In browser console or via test_backend_function
await base44.functions.invoke('notifyStatusChange', {
  application_id: "APP-001",
  new_status: "approved",
  service_name: "PM-KISAN"
});
```

### To Test Rule Engine
```javascript
// In browser console
import { calculateMemberEligibility } from "@/lib/householdCalculator";

const member = {
  name: "Test",
  age: 25,
  occupation: "Student",
  annual_income: 150000,
  student: true,
  aadhaar_linked: true,
  gender: "Male"
};

const results = calculateMemberEligibility(member);
// Returns array of { schemeId, match, eligible, benefit }
```

---

## 17. WHAT WE MUST NOT OVERCLAIM

1. Aadhaar is NOT live — simulated mock data
2. DigiLocker is NOT integrated — mock documents
3. PAN is NOT verified — masked mock number
4. Government APIs are NOT connected
5. "200+ schemes" is a claim — only 8 in knowledge base
6. Governance metrics are simulated — static values
7. Audit log is mock — hardcoded entries
8. Consent management is NOT persisted — local state
9. Predictive analytics is mock — hardcoded data
10. OTP works via Base44 — not custom gateway
11. No NIST certification — "designed with reference to"
12. No DPDP Act certification
13. Chat history is NOT persisted — resets on refresh
14. LLM may hallucinate — rule engine prevents eligibility errors only
15. Voice quality depends on browser

---

*End of Developer Handover Documentation*