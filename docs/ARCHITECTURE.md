# Architecture — CivicAI

> Complete system architecture documentation with text-based diagrams

---

## Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CITIZEN INTERFACE                         │
│                                                                   │
│  Web Browser (React SPA)                                          │
│  ┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │  Landing     │ │ Dashboard│ │ AI Chat  │ │  Schemes     │    │
│  │  Page        │ │          │ │          │ │  Catalog     │    │
│  └─────────────┘ └──────────┘ └──────────┘ └──────────────┘    │
│  ┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │  Family      │ │Documents │ │ Life     │ │  Map         │    │
│  │  Calculator  │ │  Vault   │ │ Events   │ │  Services    │    │
│  └─────────────┘ └──────────┘ └──────────┘ └──────────────┘    │
│  ┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │  Governance  │ │ Risk     │ │ Decision │ │  Predictive  │    │
│  │  Center      │ │ Dashboard│ │ Log      │ │  Analytics   │    │
│  └─────────────┘ └──────────┘ └──────────┘ └──────────────┘    │
│                                                                   │
│  13 Languages · Voice Input (STT) · Voice Output (TTS)           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION LAYER                          │
│                                                                   │
│  Base44 Auth (Platform-Managed)                                   │
│  • Email/Password · Google OAuth · OTP Verification              │
│  • Password Reset · Session Tokens · HTTP-only Cookies           │
│  • ProtectedRoute Guards · Role-Based Access (admin/user)        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                  │
│                                                                   │
│  Base44 SDK (src/api/base44Client.js)                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐    │
│  │ Entity CRUD  │ │ Integrations │ │ Backend Functions    │    │
│  │ • FamilyMember│ │ • InvokeLLM  │ │ • notifyStatusChange │    │
│  │ • Notification│ │ • UploadFile │ │                      │    │
│  │ • User        │ │ • SendEmail  │ │                      │    │
│  └──────────────┘ └──────────────┘ └──────────────────────┘    │
│  ┌──────────────┐                                                 │
│  │ Real-time    │                                                 │
│  │ Subscriptions │                                                │
│  └──────────────┘                                                 │
└──────┬───────────────┬───────────────┬───────────┬──────────────┘
       │               │               │           │
       ▼               ▼               ▼           ▼
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐
│  USER       │ │ HOUSEHOLD  │ │  SCHEME    │ │ NOTIFICATION │
│  SERVICE    │ │  SERVICE   │ │  SERVICE   │ │   SERVICE    │
│             │ │            │ │            │ │              │
│ User entity │ │FamilyMember│ │ 8 schemes  │ │Notification  │
│ (built-in)  │ │  entity +  │ │ (mock data │ │ entity +     │
│ + mock      │ │ rule engine│ │  in        │ │ backend      │
│ citizen     │ │            │ │ indiaData) │ │ function     │
│ profile     │ │            │ │            │ │              │
│ Implemented │ │ Implemented│ │ Prototype  │ │ Implemented  │
└────────────┘ └────────────┘ └────────────┘ └──────────────┘
       │               │               │           │
       └───────────────┴───────┬───────┴───────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AI ORCHESTRATION LAYER                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Prompt Builder (src/lib/aiPrompt.js)                    │    │
│  │  • Citizen profile injection (mock)                      │    │
│  │  • Family members injection (from entity)                │    │
│  │  • Scheme catalog injection (8 schemes)                  │    │
│  │  • Document wallet injection (mock)                      │    │
│  │  • Language detection instructions                       │    │
│  │  • Confidence scoring instructions                       │    │
│  │  • Policy citation instructions                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  LLM Call (base44.integrations.Core.InvokeLLM)           │    │
│  │  • Model: "automatic"                                    │    │
│  │  • Response: Structured JSON (caseworkerResponseSchema)  │    │
│  │  • Timeout: 45 seconds                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Structured JSON Response                                │    │
│  │  • detected_language                                     │    │
│  │  • intent_summary                                        │    │
│  │  • greeting (in citizen's language)                      │    │
│  │  • summary                                               │    │
│  │  • total_estimated_benefit                               │    │
│  │  • recommended_schemes[] (with confidence, rule, policy) │    │
│  │  • rule_engine_validation                                │    │
│  │  • audit_log_id                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────┬───────────────────────────────────────────┬──────────────┘
       │                                           │
       ▼                                           ▼
┌──────────────────────────┐     ┌─────────────────────────────────┐
│    RULE ENGINE            │     │    VERIFIED KNOWLEDGE BASE      │
│    (src/lib/              │     │    (src/lib/indiaData.js)       │
│     householdCalculator.js)│     │                                  │
│                            │     │    • 8 government schemes       │
│    Deterministic scoring   │     │    • Eligibility criteria       │
│    • 8 scheme rules        │     │    • Required documents         │
│    • Fixed thresholds      │     │    • Application steps          │
│    • No hallucination      │     │    • Portal URLs                │
│    • No AI in decisions    │     │    • Policy versions            │
│                            │     │    • Benefit amounts            │
│    Implemented             │     │    Prototype / Simulated        │
└──────────┬────────────────┘     └─────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXPLAINABILITY LAYER                           │
│                                                                   │
│  • Structured JSON with why_recommended, eligibility_reasons     │
│  • rule_matched string (which deterministic rule applied)        │
│  • policy_version (which policy version was cited)               │
│  • government_url (official portal link)                         │
│  • source_verified flag (LLM confidence in URL)                  │
│  • confidence_score (0-100 per recommendation)                   │
│  • humanReview flag (escalation for high-stakes)                 │
│  • audit_log_id (traceable decision ID)                         │
│  • Trust badges displayed in UI                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (Base44 NoSQL)                        │
│                                                                   │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  User     │  │ FamilyMember │  │ Notification │              │
│  │  (built-in)│  │  (full CRUD) │  │  (via func)  │              │
│  │           │  │              │  │              │              │
│  │ Implemented│  │ Implemented  │  │ Implemented  │              │
│  └──────────┘  └──────────────┘  └──────────────┘              │
│                                                                   │
│  Future: CitizenProfile, GovernmentScheme, EligibilityRule,      │
│  PolicySource, Document, Consent, Application,                   │
│  AIRecommendation, AIDecision, AuditLog, HumanReview             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│               AUDIT & GOVERNANCE LAYER                           │
│                                                                   │
│  • Governance Center (Prototype / Simulated metrics)             │
│  • Decision Log (Prototype / Simulated entries)                  │
│  • Risk Dashboard (Prototype / Simulated data)                   │
│  • Consent Management (Prototype / Simulated — local state)      │
│  • Explainable AI Page (Prototype / Simulated — hardcoded)       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│            GOVERNMENT PORTAL INTEGRATION                         │
│                                                                   │
│  External links to official portals (target="_blank"):           │
│  • pmkisan.gov.in (PM-KISAN)                                     │
│  • scholarships.gov.in (National Scholarship Portal)             │
│  • pmjay.gov.in (Ayushman Bharat)                                │
│  • pmaymis.gov.in (PMAY Housing)                                 │
│  • indiapost.gov.in (Old Age Pension)                            │
│  • wcdf.gov.in (Beti Bachao Beti Padhao)                        │
│  • standupmitra.in (Stand-Up India)                              │
│  • msde.gov.in (Skill India)                                     │
│                                                                   │
│  Status: Implemented (external links only, no API submission)    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                         │
│  React 18 + Tailwind CSS + shadcn/ui + Framer Motion          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌──────────────────────────────────────┐  │
│  │  ROUTING    │  │         PAGE COMPONENTS               │  │
│  │  (App.jsx)  │  │         (src/pages/)                  │  │
│  │             │  │                                        │  │
│  │  • Public   │  │  Landing  Dashboard  AIChat  Schemes  │  │
│  │    routes   │  │  Family   LifeEvents  Documents  Map  │  │
│  │  • Auth     │  │  Proactive Governance  ExplainableAI  │  │
│  │    routes   │  │  RuleEngine  DecisionLog  Consent     │  │
│  │  • Protected│  │  Risk  PolicyIntelligence  Predictive │  │
│  │    routes   │  │  Architecture  Login  Register  Reset │  │
│  └──────┬──────┘  └──────────────────┬───────────────────┘  │
│         │                            │                        │
│         ▼                            ▼                        │
│  ┌─────────────┐  ┌──────────────────────────────────────┐  │
│  │  LAYOUT     │  │         REUSABLE COMPONENTS           │  │
│  │  (AppLayout)│  │         (src/components/)             │  │
│  │             │  │                                        │  │
│  │  • Sidebar  │  │  ui/ (40+ shadcn primitives)          │  │
│  │  • Topbar   │  │  ai/ (SchemeCard, VoiceInputButton)   │  │
│  │  • Outlet   │  │  family/ (LinkMemberForm)             │  │
│  │             │  │  Shared: PageHeader, TrustBadges,     │  │
│  │             │  │  VoiceButton, NotificationCenter,     │  │
│  │             │  │  AadhaarProfileCard, etc.             │  │
│  └─────────────┘  └──────────────────────────────────────┘  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    BUSINESS LOGIC LAYER                       │
│  (src/lib/ + src/hooks/)                                      │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ Rule Engine  │ │ AI Prompt    │ │ i18n Context         │ │
│  │ (household   │ │ Builder      │ │ (i18n.jsx)           │ │
│  │  Calculator) │ │ (aiPrompt.js)│ │                      │ │
│  │              │ │              │ │ 13 languages         │ │
│  │ 8 schemes    │ │ Context      │ │ t(key) function      │ │
│  │ Deterministic│ │ injection    │ │ Fallback to English  │ │
│  │ scoring      │ │ JSON schema  │ │                      │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ Voice Hook   │ │ Auth Context │ │ Data Layer           │ │
│  │ (useVoice    │ │ (AuthContext)│ │ (indiaData.js)       │ │
│  │  Assistant)  │ │              │ │                      │ │
│  │ STT + TTS    │ │ User state   │ │ Citizen profile      │ │
│  │ Indian       │ │ Auth checks  │ │ Schemes (8)          │ │
│  │ locales      │ │              │ │ Documents (12)       │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    DATA ACCESS LAYER                          │
│  Base44 SDK (src/api/base44Client.js)                         │
│                                                               │
│  • base44.entities.FamilyMember.list/filter/create/update    │
│  • base44.entities.Notification.list/filter/create/update    │
│  • base44.integrations.Core.InvokeLLM()                      │
│  • base44.functions.invoke('notifyStatusChange', payload)    │
│  • base44.auth.me() / loginViaEmailPassword() / etc.         │
│  • base44.entities.EntityName.subscribe() (real-time)        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND ARCHITECTURE                       │
│                                                               │
│  Deno Serverless Functions (Deno Deploy)                      │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Function: notifyStatusChange                           │ │
│  │  (base44/functions/notifyStatusChange/entry.ts)         │ │
│  │                                                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │ │
│  │  │  AUTH       │  │  BUSINESS   │  │  DATA        │   │ │
│  │  │  CHECK      │  │  LOGIC      │  │  OPERATION   │   │ │
│  │  │             │  │             │  │              │   │ │
│  │  │  base44.    │  │  Select     │  │  Create      │   │ │
│  │  │  auth.me()  │  │  bilingual  │  │  Notification│   │ │
│  │  │             │  │  template   │  │  entity      │   │ │
│  │  │  401 if     │  │  based on   │  │              │   │ │
│  │  │  unauth     │  │  new_status │  │              │   │ │
│  │  └─────────────┘  └─────────────┘  └──────────────┘   │ │
│  │                                                          │ │
│  │  Input:  { application_id, new_status, service_name }   │ │
│  │  Output: { success: true, notification: {...} }         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Pattern: Deno.serve(async (req) => { ... })                 │
│  SDK:    createClientFromRequest(req) from @base44/sdk       │
│  Status: Implemented                                          │
│                                                               │
│  Future Functions:                                            │
│  • submitApplication (Future Integration)                    │
│  • checkEligibility (Future Integration)                     │
│  • generateAuditLog (Future Integration)                     │
│  • processConsentUpdate (Future Integration)                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## AI Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       AI ARCHITECTURE                            │
│                                                                   │
│  ┌─────────────┐                                                  │
│  │ USER QUERY  │  Text input or voice (STT transcribed)          │
│  └──────┬──────┘                                                  │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  PROMPT BUILDER (src/lib/aiPrompt.js)                    │    │
│  │                                                          │    │
│  │  buildCaseworkerPrompt(userQuery)                        │    │
│  │  ┌───────────────────────────────────────────────┐      │    │
│  │  │ INJECTED CONTEXT:                              │      │    │
│  │  │  • Citizen profile (mock — indiaData.js)       │      │    │
│  │  │  • Family members (from FamilyMember entity)   │      │    │
│  │  │  • Scheme catalog (8 schemes — indiaData.js)   │      │    │
│  │  │  • Document wallet (mock — indiaData.js)       │      │    │
│  │  │  • Life events (8 events — indiaData.js)       │      │    │
│  │  └───────────────────────────────────────────────┘      │    │
│  │  ┌───────────────────────────────────────────────┐      │    │
│  │  │ INSTRUCTIONS:                                  │      │    │
│  │  │  1. Detect language automatically              │      │    │
│  │  │  2. Identify citizen intent                    │      │    │
│  │  │  3. Recommend matching schemes                 │      │    │
│  │  │  4. Explain why (in citizen's language)        │      │    │
│  │  │  5. Score confidence (0-100)                   │      │    │
│  │  │  6. Cite policy_version and portal URL         │      │    │
│  │  │  7. Include rule_matched string                │      │    │
│  │  │  8. Set source_verified flag                   │      │    │
│  │  │  9. Flag humanReview if high-stakes            │      │    │
│  │  │ 10. Generate audit_log_id                      │      │    │
│  │  └───────────────────────────────────────────────┘      │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  LLM CALL                                                │    │
│  │  base44.integrations.Core.InvokeLLM({                    │    │
│  │    prompt: buildCaseworkerPrompt(query),                 │    │
│  │    response_json_schema: caseworkerResponseSchema        │    │
│  │  })                                                      │    │
│  │                                                          │    │
│  │  Model: "automatic" (default)                            │    │
│  │  Timeout: 45 seconds                                     │    │
│  │  Status: Implemented                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  STRUCTURED JSON RESPONSE                                │    │
│  │  (enforced by caseworkerResponseSchema)                  │    │
│  │                                                          │    │
│  │  {                                                       │    │
│  │    detected_language: "ta",                              │    │
│  │    intent_summary: "...",                                │    │
│  │    greeting: "வணக்கம்!",                                │    │
│  │    summary: "...",                                       │    │
│  │    total_estimated_benefit: "₹56,000/year",              │    │
│  │    recommended_schemes: [                                │    │
│  │      {                                                   │    │
│  │        scheme_name: "...",                               │    │
│  │        eligibility_status: "Eligible",                   │    │
│  │        confidence_score: 97,                             │    │
│  │        why_recommended: "...",                           │    │
│  │        required_documents: [...],                        │    │
│  │        application_steps: [...],                         │    │
│  │        government_portal: "...",                         │    │
│  │        government_url: "https://...",                    │    │
│  │        policy_version: "NSP-EDU-2025-v3.0",              │    │
│  │        source_verified: true,                            │    │
│  │        rule_matched: "nsp-engineering",                  │    │
│  │        humanReview: false                                │    │
│  │      }                                                   │    │
│  │    ],                                                    │    │
│  │    rule_engine_validation: "...",                        │    │
│  │    audit_log_id: "CAI-2025-001234"                      │    │
│  │  }                                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  RULE ENGINE (SEPARATE — runs in parallel)               │    │
│  │  (src/lib/householdCalculator.js)                        │    │
│  │                                                          │    │
│  │  • Deterministic eligibility scoring                     │    │
│  │  • 8 scheme-specific scoring functions                   │    │
│  │  • Fixed thresholds and point values                     │    │
│  │  • No AI involved in eligibility decision                │    │
│  │                                                          │    │
│  │  THE RULE ENGINE DECIDES ELIGIBILITY                     │    │
│  │  THE LLM EXPLAINS THE OUTCOME                            │    │
│  │                                                          │    │
│  │  Status: Implemented                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  HALLUCINATION CONTROL                                   │    │
│  │                                                          │    │
│  │  • LLM cannot change eligibility (rule engine decides)   │    │
│  │  • LLM must cite policy_version and portal URL           │    │
│  │  • LLM must set source_verified (true/false)             │    │
│  │  • LLM must include rule_matched string                  │    │
│  │  • Structured JSON schema limits free-form output        │    │
│  │  • Context injection (LLM doesn't recall from memory)    │    │
│  │  • humanReview flag for high-stakes escalation           │    │
│  │                                                          │    │
│  │  Status: Implemented                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  VOICE PIPELINE                                          │    │
│  │  (src/hooks/useVoiceAssistant.js)                        │    │
│  │                                                          │    │
│  │  INPUT (STT):                                            │    │
│  │  • Web Speech Recognition API                            │    │
│  │  • Indian locales (ta-IN, hi-IN, en-IN, etc.)            │    │
│  │  • Interim + final transcripts                           │    │
│  │  • Status: Implemented                                    │    │
│  │                                                          │    │
│  │  OUTPUT (TTS):                                           │    │
│  │  • SpeechSynthesis API                                   │    │
│  │  • Indian locale voices                                  │    │
│  │  • Rate: 0.9, Pitch: 1                                   │    │
│  │  • Status: Implemented                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  RAG (Retrieval-Augmented Generation)                    │    │
│  │                                                          │    │
│  │  Current: Prompt-based context injection                 │    │
│  │  • All 8 schemes injected into prompt as text            │    │
│  │  • No vector database                                    │    │
│  │  • No semantic search                                    │    │
│  │  • Status: Prototype / Simulated                         │    │
│  │                                                          │    │
│  │  Future: Vector database RAG                             │    │
│  │  • Embed policy documents                                │    │
│  │  • Store in vector DB (Pinecone/Weaviate)                │    │
│  │  • Semantic search on citizen query                      │    │
│  │  • Inject top-K results into prompt                      │    │
│  │  • Status: Future Integration                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Rule Engine Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   RULE ENGINE ARCHITECTURE                       │
│                                                                   │
│  Location: src/lib/householdCalculator.js                        │
│  Status: Implemented                                              │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  INPUT: Family Member Object                             │    │
│  │  {                                                       │    │
│  │    name, relation, age, gender, occupation,              │    │
│  │    annual_income, aadhaar_linked, student,               │    │
│  │    senior_citizen, disability, bpl_category              │    │
│  │  }                                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SCHEME RULES (8 deterministic functions)                │    │
│  │                                                          │    │
│  │  schemeRules = {                                         │    │
│  │    "pm-kisan": (member) => { ... },      // Farmer supp  │    │
│  │    "nsp-engineering": (member) => { ... }, // Scholarship│    │
│  │    "ayushman-bharat": (member) => { ... }, // Health ins │    │
│  │    "pmay": (member) => { ... },           // Housing     │    │
│  │    "old-age-pension": (member) => { ... }, // Pension    │    │
│  │    "beti-bachao": (member) => { ... },    // Girl child  │    │
│  │    "stand-up-india": (member) => { ... }, // Women busin │    │
│  │    "skill-india": (member) => { ... }     // Skill dev   │    │
│  │  }                                                       │    │
│  │                                                          │    │
│  │  Each function:                                          │    │
│  │  1. Evaluates member attributes                          │    │
│  │  2. Awards points for matching conditions                │    │
│  │  3. Returns { match, eligible, benefit }                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SCORING LOGIC (per scheme)                              │    │
│  │                                                          │    │
│  │  Example — PM-KISAN:                                     │    │
│  │  ┌──────────────────────────┬────────┐                   │    │
│  │  │ Condition                │ Points │                   │    │
│  │  ├──────────────────────────┼────────┤                   │    │
│  │  │ member.occupation farmer │   +40  │                   │    │
│  │  │ member.age >= 18         │   +30  │                   │    │
│  │  │ member.aadhaar_linked    │   +20  │                   │    │
│  │  │ member.annual_income <5L │   +10  │                   │    │
│  │  └──────────────────────────┴────────┘                   │    │
│  │  Threshold: score >= 60 → eligible                       │    │
│  │  Benefit: ₹6,000/year                                    │    │
│  │  Match: Math.min(score + base, 99)                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  OUTPUT: Per-Member Eligibility Results                  │    │
│  │                                                          │    │
│  │  [                                                       │    │
│  │    {                                                     │    │
│  │      schemeId: "pm-kisan",                               │    │
│  │      schemeName: "PM-KISAN",                             │    │
│  │      match: 99,          // 99% match                    │    │
│  │      eligible: true,     // Score ≥ threshold            │    │
│  │      benefit: 6000,      // ₹6,000/year                  │    │
│  │      category: "agriculture"                             │    │
│  │    },                                                    │    │
│  │    {                                                     │    │
│  │      schemeId: "nsp-engineering",                        │    │
│  │      match: 99,                                          │    │
│  │      eligible: true,                                     │    │
│  │      benefit: 50000,                                     │    │
│  │      category: "education"                               │    │
│  │    },                                                    │    │
│  │    ...                                                   │    │
│  │  ]                                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  HOUSEHOLD AGGREGATION                                   │    │
│  │                                                          │    │
│  │  calculateHouseholdBenefits(members)                     │    │
│  │  • Iterates all family members                           │    │
│  │  • Runs all 8 rules per member                           │    │
│  │  • Sums total household benefit                          │    │
│  │  • Groups by category                                    │    │
│  │  • Returns: { totalBenefit, members, categoryBreakdown } │    │
│  │                                                          │    │
│  │  Demo: 6 members × 8 schemes = 48 evaluations            │    │
│  │  Result: ₹4,85,000/year total household benefit          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SEPARATION FROM LLM                                     │    │
│  │                                                          │    │
│  │  ┌─────────────────┐     ┌─────────────────┐            │    │
│  │  │  RULE ENGINE    │     │      LLM        │            │    │
│  │  │                 │     │                 │            │    │
│  │  │  DECIDES:       │     │  EXPLAINS:      │            │    │
│  │  │  • Eligible?    │     │  • Why          │            │    │
│  │  │  • Match %      │     │  • How to apply │            │    │
│  │  │  • Benefit ₹    │     │  • In what lang │            │    │
│  │  │                 │     │                 │            │    │
│  │  │  Deterministic  │     │  Probabilistic  │            │    │
│  │  │  No hallucination│    │  Natural lang   │            │    │
│  │  │  Fixed rules    │     │  Context-aware  │            │    │
│  │  └─────────────────┘     └─────────────────┘            │    │
│  │                                                          │    │
│  │  The LLM CANNOT override the rule engine's decision.    │    │
│  │  The LLM CANNOT change eligibility.                     │    │
│  │  The LLM CANNOT modify benefit amounts.                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE ARCHITECTURE                          │
│                                                                   │
│  Type: Base44 Managed NoSQL Document Store                       │
│  Status: Implemented                                              │
│                                                                   │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   User    │    │ FamilyMember  │    │ Notification │          │
│  │ (built-in)│    │               │    │              │          │
│  │           │    │               │    │              │          │
│  │ id        │    │ id            │    │ id           │          │
│  │ email     │    │ name          │    │ title_en     │          │
│  │ full_name │    │ relation      │    │ title_ta     │          │
│  │ role      │    │ age           │    │ description_ │          │
│  │ created_  │    │ gender        │    │   en         │          │
│  │   date    │    │ occupation    │    │ description_ │          │
│  │ updated_  │    │ annual_income │    │   ta         │          │
│  │   date    │    │ aadhaar_link  │    │ type         │          │
│  │           │    │ student       │    │ category     │          │
│  │           │    │ senior_citizen│    │ read         │          │
│  │           │    │ disability    │    │ application_ │          │
│  │           │    │ bpl_category  │    │   id         │          │
│  │           │    │ avatar        │    │ service_name │          │
│  │           │    │ created_date  │    │ action_label │          │
│  │           │    │ updated_date  │    │ action_link  │          │
│  │           │    │ created_by_id │    │ created_date │          │
│  │           │    │               │    │ updated_date │          │
│  │           │    │   (CRUD)      │    │ created_by_  │          │
│  │           │    │ Implemented   │    │   id         │          │
│  │  Read-    │    │               │    │              │          │
│  │  only     │    │               │    │  (via func)  │          │
│  │           │    │               │    │ Implemented  │          │
│  └──────────┘    └──────────────┘    └──────────────┘          │
│                                                                   │
│  Relationships:                                                   │
│                                                                   │
│  User (1) ──────── (N) FamilyMember                              │
│    │                  │                                           │
│    │                  │ evaluated by                              │
│    │                  ▼                                           │
│    │            Rule Engine                                       │
│    │                  │                                           │
│    │                  │ references                                │
│    │                  ▼                                           │
│    │            Scheme Catalog (mock — indiaData.js)             │
│    │                                                              │
│    ├── (N) Notification                                           │
│    │                                                              │
│    └── Future Entities:                                           │
│         CitizenProfile, GovernmentScheme, EligibilityRule,       │
│         PolicySource, Document, Consent, Application,             │
│         AIRecommendation, AIDecision, AuditLog, HumanReview       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   SECURITY ARCHITECTURE                          │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐│
│  │  AUTHENTICATION │  │ ROUTE PROTECTION│  │ SESSION MGMT     ││
│  │                 │  │                 │  │                  ││
│  │  • Email/PW     │  │  • ProtectedRoute│  │  • Base44 tokens ││
│  │  • Google OAuth │  │  • Redirect to  │  │  • HTTP-only     ││
│  │  • OTP verify   │  │    /login       │  │    cookies       ││
│  │  • Password     │  │  • Role-based   │  │  • Auto-expire   ││
│  │    reset        │  │    access       │  │                  ││
│  │                 │  │                 │  │                  ││
│  │  Implemented    │  │  Implemented    │  │  Implemented     ││
│  └─────────────────┘  └─────────────────┘  └──────────────────┘│
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐│
│  │  DATA ACCESS    │  │ INPUT VALIDATION│  │  CONSENT (sim)   ││
│  │  CONTROL        │  │                 │  │                  ││
│  │  • User-scoped  │  │  • Manual param │  │  • Purpose-bound ││
│  │    entities     │  │    checking     │  │  • Time-limited  ││
│  │  • created_by_id│  │  • Function     │  │  • Revocable     ││
│  │    filtering    │  │    params       │  │                  ││
│  │  • Admin-only   │  │                 │  │                  ││
│  │    user mgmt    │  │                 │  │                  ││
│  │                 │  │                 │  │                  ││
│  │  Implemented    │  │  Basic          │  │  Prototype/Sim   ││
│  └─────────────────┘  └─────────────────┘  └──────────────────┘│
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐│
│  │  AUDIT LOG      │  │  ENCRYPTION     │  │  SECRETS MGMT    ││
│  │  (simulated)    │  │                 │  │                  ││
│  │  • Decision log │  │  • HTTPS/TLS    │  │  • Dashboard     ││
│  │  • Mock entries │  │    (Base44)     │  │    secrets       ││
│  │  • Not persist  │  │  • At-rest      │  │  • Deno.env      ││
│  │                 │  │    (Base44)     │  │    .get()        ││
│  │                 │  │                 │  │                  ││
│  │  Prototype/Sim  │  │  Implemented    │  │  Implemented     ││
│  └─────────────────┘  └─────────────────┘  └──────────────────┘│
│                                                                   │
│  Future Security Controls:                                       │
│  • Rate Limiting          (Future Integration)                   │
│  • Input Sanitization     (Future Integration)                   │
│  • File Upload Security   (Future Integration)                   │
│  • Real Audit Logging     (Future Integration)                   │
│  • Consent Enforcement    (Future Integration)                   │
│  • Data Retention Policies(Future Integration)                   │
│  • Penetration Testing    (Future Integration)                   │
│  • ISO 27001 Cert         (Future Integration)                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  DEPLOYMENT ARCHITECTURE                         │
│                                                                   │
│  ┌─────────────┐     ┌─────────────┐     ┌────────────────┐    │
│  │  DEVELOPER  │────▶│  BASE44     │────▶│  BUILD & DEPLOY │    │
│  │             │     │  PLATFORM   │     │                 │    │
│  │  Edit code  │     │  • Auto-    │     │  • npm install  │    │
│  │  in browser │     │    save     │     │  • Vite build   │    │
│  │             │     │  • Auto-    │     │  • Static files │    │
│  │             │     │    deploy   │     │  • Deno deploy  │    │
│  └─────────────┘     └──────┬──────┘     └───────┬────────┘    │
│                             │                    │              │
│                             ▼                    ▼              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    BASE44 CDN                             │  │
│  │                                                           │  │
│  │  ┌────────────────┐  ┌────────────────┐                 │  │
│  │  │ FRONTEND       │  │ BACKEND        │                 │  │
│  │  │ (Static Files) │  │ (Deno Deploy)  │                 │  │
│  │  │                │  │                │                 │  │
│  │  │ • React SPA    │  │ • Serverless   │                 │  │
│  │  │ • Tailwind CSS │  │   functions    │                 │  │
│  │  │ • shadcn/ui    │  │ • Auto-scaling │                 │  │
│  │  │ • Vite build   │  │                │                 │  │
│  │  └────────────────┘  └────────────────┘                 │  │
│  │                                                           │  │
│  │  ┌────────────────┐  ┌────────────────┐                 │  │
│  │  │ DATABASE       │  │ AUTH           │                 │  │
│  │  │ (Managed NoSQL)│  │ (Base44 Auth)  │                 │  │
│  │  │                │  │                │                 │  │
│  │  │ • Auto-scale   │  │ • Tokens       │                 │  │
│  │  │ • Auto-backup  │  │ • Sessions     │                 │  │
│  │  │ • Encryption   │  │ • OTP          │                 │  │
│  │  └────────────────┘  └────────────────┘                 │  │
│  │                                                           │  │
│  │  ┌────────────────┐                                      │  │
│  │  │ SSL/TLS        │   Status: Pending verification       │  │
│  │  │ (Let's Encrypt)│   (Base44-managed)                   │  │
│  │  └────────────────┘                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  civicai.online                           │  │
│  │                                                           │  │
│  │  DNS Configuration:                                       │  │
│  │  • NS: ns1038.ui-dns.com, ns1044.ui-dns.biz,             │  │
│  │         ns1086.ui-dns.org, ns1092.ui-dns.de (IONOS)      │  │
│  │  • A record: civicai.online → 216.24.57.1 (Base44 IP)    │  │
│  │  • CNAME: www.civicai.online → base44.onrender.com       │  │
│  │  • SSL: Pending domain verification in dashboard         │  │
│  │                                                           │  │
│  │  Status: Configured (SSL pending)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architecture Principles

### SOLID Principles Applied

| Principle | Application |
|---|---|
| **Single Responsibility** | Each file/module has one purpose (rule engine = eligibility, aiPrompt = LLM context, i18n = translations) |
| **Open/Closed** | Rule engine is extensible (add new scheme rules) without modifying existing rules |
| **Liskov Substitution** | All scheme rules follow the same interface: `(member) => { match, eligible, benefit }` |
| **Interface Segregation** | UI components are small and focused (SchemeCard, VoiceInputButton, LinkMemberForm) |
| **Dependency Inversion** | Frontend depends on Base44 SDK abstraction, not direct database access |

### Clean Architecture Layers

| Layer | Responsibility | Location |
|---|---|---|
| Presentation | UI rendering, user interaction | `src/pages/`, `src/components/` |
| Business Logic | Rule engine, AI prompt, i18n | `src/lib/`, `src/hooks/` |
| Data Access | Entity CRUD, API calls | `src/api/base44Client.js` |
| Infrastructure | Hosting, database, auth | Base44 platform |

### Separation of Concerns

| Concern | Handler | Status |
|---|---|---|
| Eligibility decisions | Rule Engine (`householdCalculator.js`) | Implemented |
| AI explanations | LLM (`InvokeLLM` via `aiPrompt.js`) | Implemented |
| Data persistence | Base44 SDK (`base44Client.js`) | Implemented |
| UI rendering | React components (`src/pages/`, `src/components/`) | Implemented |
| Authentication | Base44 Auth (`AuthContext.jsx`) | Implemented |
| Multilingual | i18n context (`i18n.jsx`) | Implemented |
| Voice I/O | Voice hook (`useVoiceAssistant.js`) | Implemented |
| Notifications | Backend function (`notifyStatusChange`) | Implemented |

---

*Last updated: July 2026*