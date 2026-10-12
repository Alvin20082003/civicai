# CivicAI — Technical Audit Report (Part 2)
## Module Documentation, Page-by-Page, System Architecture

---

# PART 4 — MODULE-BY-MODULE DOCUMENTATION

## Module 1: AI Assistant (AI Caseworker)

| Field | Detail |
|---|---|
| **Purpose** | Natural-language conversational interface for scheme discovery |
| **User Input** | Text or voice in 13 languages |
| **Processing** | buildCaseworkerPrompt() → InvokeLLM with JSON schema → 45s timeout |
| **Output** | Structured JSON: detected_language, intent, recommended_schemes[], confidence, policy_version, rule_matched, audit_log_id |
| **Pages** | AIChat.jsx |
| **Components** | MessageBubble, StructuredRecommendations, SchemeCard, VoiceInputButton |
| **Backend** | base44.integrations.Core.InvokeLLM |
| **Entities** | None (chat history in-memory) |
| **Status** | **Implemented** |
| **Limitations** | No chat persistence; no conversation memory; no streaming |

## Module 2: Smart Citizen Dashboard

| Field | Detail |
|---|---|
| **Purpose** | Single-view dashboard aggregating profile, household, documents, schemes, applications, notifications |
| **Pages** | Dashboard.jsx |
| **Components** | AadhaarProfileCard, HouseholdAnalysisCard, DocumentWalletCard, EligibleSchemesCard, RecentApplicationsCard, NotificationCenter |
| **Status** | **Implemented** (mock data + live notifications) |

## Module 3: Scheme Recommendation Engine

| Field | Detail |
|---|---|
| **Purpose** | Browse, search, filter government schemes; view details and apply |
| **Input** | Text search, category filter |
| **Pages** | Schemes.jsx |
| **Data** | 8 schemes with real portal URLs (pmkisan.gov.in, scholarships.gov.in, pmjay.gov.in) |
| **Status** | **Implemented** (8 schemes; UI claims "200+") |

## Module 4: Explainable AI

| Field | Detail |
|---|---|
| **Purpose** | Show why AI decisions were made (rule matched, documents, policy, confidence) |
| **Pages** | ExplainableAI.jsx |
| **Status** | **Prototype / Simulated** (3 hardcoded explanations with legacy Singapore references) |

## Module 5: Citizen Profile

| Field | Detail |
|---|---|
| **Purpose** | Display Aadhaar-linked identity with trust score |
| **Components** | AadhaarProfileCard.jsx |
| **Status** | **Prototype / Simulated** (hardcoded mock citizen "Arjun Kumar") |

## Module 6: Household / Family Linking

| Field | Detail |
|---|---|
| **Purpose** | Manage household members; calculate family-wide benefit eligibility |
| **Input** | Multi-step form (name, relation, age, gender, occupation, income, flags) |
| **Processing** | FamilyMember.list() → calculateHouseholdBenefits() → display totals |
| **Output** | Total benefit (₹4,85,000), category breakdown, per-member eligible schemes |
| **Pages** | Family.jsx |
| **Components** | MemberBenefitCard, MemberDetailModal, LinkMemberForm |
| **Backend** | FamilyMember.list(), .bulkCreate(), .create(), .delete() |
| **Entities** | **FamilyMember** (persisted) |
| **Rule Engine** | calculateHouseholdBenefits() + calculateMemberEligibility() |
| **Status** | **Implemented** (full CRUD + deterministic rule engine) |

## Module 7: Digital Document Vault

| Field | Detail |
|---|---|
| **Purpose** | Store government documents with expiry tracking and missing alerts |
| **Pages** | Documents.jsx, DocumentWalletCard.jsx |
| **Status** | **Prototype / Simulated** (12 mock documents; non-functional actions) |

## Module 8: Document Intelligence

| Field | Detail |
|---|---|
| **Purpose** | Extract data from uploaded documents for auto-filling |
| **Status** | **Future Integration** (Base44 ExtractDataFromUploadedFile available but unused) |

## Module 9: Form Filling Agent

| Field | Detail |
|---|---|
| **Purpose** | Auto-fill government application forms |
| **Status** | **Future Integration** |

## Module 10: Autonomous Workflow Agent

| Field | Detail |
|---|---|
| **Purpose** | Automated multi-step processes (expiry → notify → suggest → submit) |
| **Status** | **Future Integration** (no Base44 workflows created) |

## Module 11: Life Event Agent

| Field | Detail |
|---|---|
| **Purpose** | Recommend schemes based on life events (student, graduation, marriage, retirement...) |
| **Pages** | LifeEvents.jsx |
| **Status** | **Implemented** (8 life events with scheme mappings; mock data) |

## Module 12: Applications Tracking

| Field | Detail |
|---|---|
| **Purpose** | Track submitted application status |
| **Pages** | RecentApplicationsCard in Dashboard.jsx |
| **Status** | **Prototype / Simulated** (4 mock applications) |

## Module 13: Notifications

| Field | Detail |
|---|---|
| **Purpose** | Bilingual (English/Tamil) status change notifications |
| **Processing** | Backend function notifyStatusChange → selects template → creates Notification entity |
| **Pages** | NotificationCenter.jsx (dashboard + topbar) |
| **Backend** | notifyStatusChange (Deno function) |
| **Entities** | **Notification** (persisted) |
| **Status** | **Implemented** |

## Module 14: Policy Intelligence

| Field | Detail |
|---|---|
| **Purpose** | Monitor government policy changes and citizen impact |
| **Pages** | PolicyIntelligence.jsx |
| **Status** | **Prototype / Simulated** (mock data + charts) |

## Module 15: Predictive Governance

| Field | Detail |
|---|---|
| **Purpose** | Forecast demand, trends, workload, bottlenecks |
| **Pages** | Predictive.jsx |
| **Status** | **Prototype / Simulated** (6 charts with mock data) |

## Module 16: AI Governance Center

| Field | Detail |
|---|---|
| **Purpose** | Monitor AI transparency, privacy, fairness, security |
| **Pages** | Governance.jsx |
| **Status** | **Prototype / Simulated** (static mock metrics) |

## Module 17: Consent Management

| Field | Detail |
|---|---|
| **Purpose** | Control data access — purpose-bound, time-limited, revocable |
| **Pages** | Consent.jsx |
| **Status** | **Prototype / Simulated** (local state, not persisted) |

## Module 18: Audit Logs

| Field | Detail |
|---|---|
| **Purpose** | Audit trail of every AI decision |
| **Pages** | DecisionLog.jsx |
| **Status** | **Prototype / Simulated** (7 mock entries) |

## Module 19: Human Review

| Field | Detail |
|---|---|
| **Purpose** | Escalate high-stakes decisions to human officers |
| **Status** | **Prototype / Simulated** (humanReview flag + notification template; no actual workflow) |

## Module 20: Multilingual and Voice Support

| Field | Detail |
|---|---|
| **Purpose** | 13 Indian languages with voice input/output |
| **Components** | LanguageSelector, VoiceButton, VoiceInputButton, VoiceCommandBar |
| **Status** | **Implemented** (13 languages + Web Speech API voice) |

## Module 21: Authentication

| Field | Detail |
|---|---|
| **Purpose** | Secure auth with email/password, Google, OTP |
| **Pages** | Login.jsx, Register.jsx, ForgotPassword.jsx, ResetPassword.jsx |
| **Backend** | Base44 Auth (platform-managed) |
| **Status** | **Implemented** |

## Module 22: Administration Dashboard

| Field | Detail |
|---|---|
| **Status** | **Future Integration** (no in-app admin panel) |

## Module 23: Government Scheme Management

| Field | Detail |
|---|---|
| **Status** | **Prototype / Simulated** (hardcoded in indiaData.js; no entity) |

## Module 24: Rule Engine

| Field | Detail |
|---|---|
| **Purpose** | Deterministic eligibility validation |
| **Input** | Family member attributes (age, income, occupation, flags) |
| **Processing** | householdCalculator.js — per-scheme scoring functions |
| **Output** | Eligible/not eligible, match %, benefit amount |
| **Pages** | Family.jsx, RuleEngine.jsx |
| **Status** | **Implemented** (8 schemes; deterministic scoring) |
| **Limitations** | Simplified rules; no versioning; client-side only |

## Module 25: Verified Knowledge Base

| Field | Detail |
|---|---|
| **Status** | **Prototype / Simulated** (governmentSchemes array; 8 schemes) |

---

# PART 5 — PAGE-BY-PAGE EXPLANATION

| Page | Route | Purpose | Status | Key Feature |
|---|---|---|---|---|
| Landing | `/` | Marketing landing page | Implemented | Hero, features, architecture preview |
| Dashboard | `/dashboard` | Citizen dashboard | Implemented | Profile, household, documents, schemes, notifications |
| AI Chat | `/chat` | AI caseworker conversation | Implemented | LLM + voice + structured JSON response |
| Schemes | `/schemes` | Scheme catalog browser | Implemented | 8 schemes, search, filter, detail modal |
| Family | `/family` | Household benefit calculator | Implemented | CRUD + rule engine + ₹4.85L total |
| Life Events | `/life-events` | Life-event scheme discovery | Implemented | 8 events with scheme mappings |
| Documents | `/documents` | Document vault | Prototype | 12 mock documents, expiry tracking |
| Map Services | `/map-services` | Government office finder | Implemented | Leaflet map, 10 offices, distance filter |
| Proactive | `/proactive` | AI-driven alerts | Prototype | 8 alerts, filter, dismiss |
| Governance | `/governance` | AI governance center | Prototype | Metrics, radial gauges, compliance |
| Explainable AI | `/explainable-ai` | Decision explanations | Prototype | 3 hardcoded explanations |
| Rule Engine | `/rule-engine` | Pipeline visualization | Prototype | 7-step flow diagram |
| Decision Log | `/decision-log` | AI decision audit trail | Prototype | 7 mock entries, filter, search |
| Consent | `/consent` | Data access permissions | Prototype | 6 items, toggle, local state |
| Risk | `/risk` | AI risk dashboard | Prototype | Risk levels, issues, chart |
| Policy Intelligence | `/policy-intelligence` | Policy change monitoring | Prototype | KPIs, impact chart, updates |
| Predictive | `/predictive` | Predictive analytics | Prototype | 6 charts with mock data |
| Architecture | `/architecture` | System architecture diagram | Implemented | 8-layer flow, tech stack |
| Login | `/login` | Authentication | Implemented | Email/password, Google, forgot |
| Register | `/register` | Registration + OTP | Implemented | Email → OTP → verify → redirect |

## Complete User Journey

```
Login → Profile (mock) → Language/Voice → AI Query → Scheme Discovery
→ Eligibility Validation (Rule Engine) → Explainability → Document Check
→ Apply (external portal link) → Status Tracking (mock) → Notification (real)
→ Human Review (flagged) → Audit Log (mock)
```

---

# PART 6 — SYSTEM ARCHITECTURE

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CITIZEN INTERFACE                        │
│  React SPA · 13 Languages · Voice I/O · 17 Pages             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION LAYER                       │
│  Base44 Auth · Email/Password · Google · OTP · ProtectedRoute│
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│  Base44 SDK · Entity CRUD · Integrations · Functions         │
└──────┬──────────┬──────────┬──────────┬─────────────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
  USER PROFILE  HOUSEHOLD   SCHEME    NOTIFICATION
  (mock + User  (FamilyMem  (mock     (Notification
   entity)      entity +    data)     entity + func)
                rule engine)
       │          │          │          │
       └──────────┴────┬─────┴──────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              AI ORCHESTRATION LAYER                          │
│  Prompt Builder · InvokeLLM · Language Detection            │
│  Intent · Confidence · Policy Citation                      │
└──────┬──────────────────────────────┬───────────────────────┘
       │                              │
       ▼                              ▼
  RULE ENGINE               VERIFIED KNOWLEDGE BASE
  (householdCalculator.js)   (indiaData.js — 8 schemes)
  Deterministic · No          Eligibility · Documents
  hallucination               Steps · Portal URLs
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│              EXPLAINABILITY + AUDIT LAYER                    │
│  Structured JSON · Trust Badges · Audit ID · Human Review    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (Base44 NoSQL)                         │
│  User · FamilyMember · Notification                          │
│  (Future: Application, Consent, AuditLog, Document)          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│        GOVERNMENT PORTAL INTEGRATION                         │
│  External links: pmkisan.gov.in · scholarships.gov.in · etc │
└─────────────────────────────────────────────────────────────┘
```

## Logical Architecture

```
┌─────────────────────────────────────────────────────┐
│  PRESENTATION: React + Tailwind + shadcn/ui + Framer │
├─────────────────────────────────────────────────────┤
│  BUSINESS LOGIC: Rule Engine · AI Prompt · i18n     │
├─────────────────────────────────────────────────────┤
│  DATA ACCESS: Base44 SDK (entities, integrations)    │
├─────────────────────────────────────────────────────┤
│  BACKEND: Deno Serverless (notifyStatusChange)       │
├─────────────────────────────────────────────────────┤
│  INFRASTRUCTURE: Base44 (hosting + DB + auth + CDN)  │
└─────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
Citizen Input (text/voice)
→ Language Detection (LLM)
→ Intent Detection (LLM)
→ Profile Retrieval (mock citizen + FamilyMember entity)
→ Household Retrieval (FamilyMember.list())
→ Knowledge Retrieval (governmentSchemes array)
→ Rule Evaluation (householdCalculator.js — deterministic)
→ Eligibility Decision (Eligible / Conditional / Not Eligible)
→ LLM Explanation (InvokeLLM with JSON schema)
→ Confidence Score (LLM 0-100 + Rule Engine match %)
→ Official Source Citation (policy_version, government_url)
→ Response Translation (LLM responds in detected language)
→ Text-to-Speech (SpeechSynthesis API)
→ Audit Logging (audit_log_id — mock)
→ Human Escalation (humanReview flag)
```

## AI Architecture

```
USER QUERY → PROMPT BUILDER (context injection) → LLM CALL (InvokeLLM)
                                                        │
                                                        ▼
                                               JSON SCHEMA RESPONSE
                                               (language, intent,
                                                schemes[], confidence,
                                                rules, policy)

RULE ENGINE (separate) ← references ← LLM
  • Deterministic eligibility    The Rule Engine DECIDES
  • Match %                       The LLM EXPLAINS
  • Benefit ₹

HALLUCINATION CONTROL:
  • LLM cannot change eligibility (rule engine does)
  • LLM must cite policy_version and portal URL
  • source_verified flag for URL confidence
  • humanReview flag for high-stakes
```

## Security Architecture

```
AUTHENTICATION          ROUTE PROTECTION       SESSION MGMT
• Email/Password        • ProtectedRoute        • Base44 tokens
• Google OAuth          • Redirect to /login    • HTTP-only cookies
• OTP                   • Role-based access

DATA ACCESS CONTROL     INPUT VALIDATION        CONSENT (simulated)
• User-scoped entities  • Manual checks         • Purpose-bound
• Admin user mgmt       • Function params       • Time-limited
                                                • Revocable

AUDIT LOG (simulated)   ENCRYPTION              SECRETS
• Decision log          • HTTPS (Base44)        • Dashboard secrets
• Mock data             • At-rest (Base44)      • Deno.env.get()
```

## Deployment Architecture

```
DEVELOPER → BASE44 PLATFORM → BUILD & DEPLOY (Vite)
                                │
                                ▼
                    BASE44 CDN
                    • Frontend static (dist/)
                    • Deno Deploy (functions)
                    • Managed database
                    • Managed auth
                    • Managed SSL
                                │
                                ▼
                    civicai.online
                    • A record → 216.24.57.1
                    • CNAME www → base44.onrender.com
                    • SSL pending verification
```

---

*Continued in Part 3: Rule Engine, AI/RAG, Multilingual, Data Model, APIs*