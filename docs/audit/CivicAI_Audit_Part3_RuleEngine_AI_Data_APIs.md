# CivicAI — Technical Audit Report (Part 3)
## Rule Engine, AI/RAG, Multilingual/Voice, Data Model, APIs

---

# PART 7 — TECHNICAL FLOW

## Scenario A: Tamil text query "எனக்கு என்ன அரசு திட்டங்கள் கிடைக்கும்?"

| Step | What Happens | Implementation |
|---|---|---|
| Input Capture | User types Tamil text; presses Enter | `handleSend()` in AIChat.jsx |
| Language Detection | LLM detects Tamil from query | Prompt instruction #1; returns `detected_language: "ta"` |
| Intent Detection | LLM identifies "citizen wants eligible schemes" | Returns `intent_summary` |
| Profile Retrieval | Mock citizen (Arjun Kumar) injected | `buildCaseworkerPrompt()` uses `citizen` from indiaData.js |
| Household Retrieval | Mock family members injected | `buildCaseworkerPrompt()` uses `familyMembers` |
| Knowledge Retrieval | 8 schemes injected as catalog | `buildCaseworkerPrompt()` uses `governmentSchemes` |
| Rule Evaluation | LLM includes `rule_matched`; actual engine runs separately | Prompt #8; `householdCalculator.js` |
| Eligibility Decision | LLM returns `eligibility_status` per scheme | JSON schema |
| LLM Explanation | LLM returns `why_recommended`, `ai_guidance` in Tamil | JSON schema |
| Confidence Score | LLM returns `confidence_score` (0-100) | JSON schema |
| Source Citation | LLM returns `government_url`, `policy_version`, `source_verified` | JSON schema |
| Response Translation | LLM responds in Tamil | Prompt #1 |
| Text-to-Speech | User clicks voice button; `speak()` uses `ta-IN` | `useVoiceAssistant.js` |
| Audit Logging | Response includes `audit_log_id` | JSON schema |
| Human Escalation | Response includes `humanReview: true` | JSON schema |

## Scenario B: Hindi voice input

| Step | Implementation |
|---|---|
| Input Capture | `handleVoiceToggle()` → `startListening("hi", callback)` |
| Speech-to-Text | `recognition.lang = "hi-IN"` (Web Speech API) |
| Remaining steps | Same as Scenario A |

## Scenario C: Schemes for a family member

| Step | Implementation |
|---|---|
| Input | "What schemes is my father eligible for?" |
| Household | Prompt includes all family members with attributes |
| Rule Evaluation | `schemeRules["pm-kisan"](father)` → farmer? +40, age≥18? +30... |
| Response | LLM returns father's eligible schemes (PM-KISAN, Fasal Bima) |

## Scenario D: Upload income certificate

| Step | Status |
|---|---|
| Upload | **Future Integration** — Base44 `UploadFile` available but unused |
| Document Intelligence | **Future Integration** — `ExtractDataFromUploadedFile` available |
| Verification | **Future Integration** |

## Scenario E: Check scholarship eligibility

| Step | Implementation |
|---|---|
| Input | "Am I eligible for the engineering scholarship?" |
| Profile | Citizen: age 24, student, income ₹1.8L |
| Rule Engine | `nsp-engineering`: student? +40, age 18-30? +30, income<2L? +25, Aadhaar? +5 = 100 → eligible |
| Response | "Eligible" with 97% confidence |
| Source | `government_url: "https://scholarships.gov.in"`, `policy_version: "NSP-EDU-2025-v3.0"` |

## Scenario F: Start an application

| Step | Implementation |
|---|---|
| Action | Click "Apply" → `<a href={scheme.portal} target="_blank">` |
| Form Pre-fill | **Not implemented** |
| Submission | Opens official portal in new tab |
| Notification | `notifyStatusChange` can create "Application Pending" notification |
| Status | **Partially Implemented** (external link only) |

---

# PART 8 — RULE ENGINE DOCUMENTATION

## How the Rule Engine Works

### Rule Source
JavaScript functions in `src/lib/householdCalculator.js`. Each scheme has a dedicated scoring function.

### Rule Format
```javascript
"scheme-id": (member) => {
  const score =
    (condition1 ? points1 : 0) +
    (condition2 ? points2 : 0) + ...;
  return { match: Math.min(score + base, maxMatch), eligible: score >= threshold, benefit: amount };
}
```

### Rule Storage
Hardcoded in client-side JavaScript (not in database, not versioned, not admin-editable).

### Rule Execution
1. `FamilyMember.list()` retrieves household members from database
2. `calculateHouseholdBenefits(members)` iterates each member
3. For each member, `calculateMemberEligibility(member)` runs all 8 scheme rules
4. Each rule returns `{ match, eligible, benefit }`
5. Results aggregated: total benefit, eligible count, category breakdown

### Eligibility Conditions Per Scheme

| Scheme | Conditions (points) | Threshold | Benefit |
|---|---|---|---|
| PM-KISAN | Farmer +40, Age≥18 +30, Aadhaar +20, Income<5L +10 | ≥60 | ₹6,000 |
| NSP Engineering | Student +40, Age 18-30 +30, Income<2L +25, Aadhaar +5 | ≥60 | ₹50,000 |
| Ayushman Bharat | Senior/Age≥60 +40, BPL/Income<1L +35, Aadhaar +20 | ≥60 | ₹5,00,000 |
| PMAY | Income 1L-6L +30, Age≥18 +20, Female +15, Aadhaar +10 | ≥50 | ₹1,50,000 |
| Old Age Pension | Age≥60 +50, BPL/Income<1L +30, Aadhaar +15 | ≥60 | ₹12,000 |
| Beti Bachao | Female +40, Student +30, Age 9-25 +20, Income<2L +10 | ≥60 | ₹25,000 |
| Stand-Up India | Female +35, Age≥18 +25, Business +20, Aadhaar +10 | ≥50 | ₹1,00,000 |
| Skill India | Age 15-45 +40, Student/Unemployed +25, Aadhaar +15 | ≥50 | ₹15,000 |

### Missing Data Handling
Undefined attributes → condition evaluates to `false` (no points). Member still evaluated; may be "not eligible."

### Confidence Calculation
`match = Math.min(score + base, maxMatch)` — base offset ensures partial matches get meaningful percentages.

### Output Classification

| Classification | Condition | UI Color |
|---|---|---|
| Eligible | score ≥ threshold | Green (success) |
| Potentially Eligible | match ≥ 80 but score < threshold | Blue (primary) |
| Not Eligible | match < 80 and score < threshold | Gray (muted) |
| Human Review Required | Flagged by LLM or low confidence | Orange (warning) |

### Core Principle

> **"The Rule Engine decides eligibility. The LLM explains the result."**

### Example Rule (Human-Readable)

```
Scheme: National Scholarship Portal - Engineering
Policy Version: NSP-EDU-2025-v3.0
Portal: https://scholarships.gov.in

Rules:
- Age 18-30 → +30 points
- Student status = true → +40 points
- Annual income < ₹2,00,000 → +25 points
- Aadhaar linked → +5 points

Threshold: Score ≥ 60 = Eligible
Benefit: ₹50,000/year
```

### Limitations
- Simplified scoring (not full policy text)
- No policy versioning in rule engine
- No rule update workflow
- No rule conflict detection
- Client-side execution only
- No audit logging of evaluations

---

# PART 9 — AI AND RAG DOCUMENTATION

## What the LLM Is Used For

| Use Case | Implementation |
|---|---|
| Natural language understanding | Citizen asks in any language; LLM understands intent |
| Language detection | Returns `detected_language` code |
| Scheme recommendation | Recommends from context + training knowledge |
| Explanation generation | Explains why scheme matches, in citizen's language |
| Confidence scoring | Returns `confidence_score` (0-100) per scheme |
| Policy citation | Returns `policy_version`, `government_url`, `source_verified` |
| Intent summarization | Returns `intent_summary` |
| Conversational greeting | Returns `greeting` in detected language |

## What the LLM Is NOT Allowed to Decide

| Decision | Who Decides | Why |
|---|---|---|
| Eligibility (yes/no) | Rule Engine | Prevents hallucination |
| Match score | Rule Engine | Deterministic scoring |
| Benefit amount | Scheme catalog (hardcoded) | Prevents fabrication |
| Application approval | Human officer / Portal | AI cannot approve |

## How RAG Works (Current)

**Prompt-based context injection** (not vector database RAG):

1. **Knowledge Base:** `governmentSchemes` array (8 schemes)
2. **Retrieval:** All schemes injected into prompt as text catalog
3. **Generation:** LLM uses injected context + training knowledge
4. **Citation:** LLM cites `policy_version` and `government_url`

### RAG Limitations
- No vector database (all schemes injected — doesn't scale beyond ~20)
- No semantic search
- No document chunking
- No similarity scoring

### Recommended Production RAG
1. Create PolicySource entity with policy text
2. Generate embeddings for each policy
3. Store in vector database (Pinecone, Weaviate)
4. On query: embed → vector search → retrieve top-K → inject into prompt
5. Cite specific policy sections

## How Hallucination Is Reduced

| Technique | Implementation |
|---|---|
| Structured JSON schema | LLM must return specific fields |
| Context injection | Scheme catalog provided in prompt |
| Rule engine separation | LLM cannot change eligibility |
| Source verification flag | `source_verified: true/false` |
| Policy version citation | Every recommendation includes `policy_version` |
| Human review flag | High-stakes cases flagged |

## How Multilingual Responses Work

1. Prompt: "DETECT language automatically. Respond in SAME language."
2. LLM returns `detected_language` code
3. LLM generates greeting, summary, ai_guidance in detected language
4. TTS uses detected language code (`ta-IN`, `hi-IN`)

## Mixed-Language Handling
Prompt: "If mixed language, detect dominant language. Respond in same language."

## Confidence Calculation

| Source | Method |
|---|---|
| LLM | Returns `confidence_score` (0-100) |
| Rule Engine | Returns `match` percentage from deterministic scoring |

## Unsafe Request Handling

| Technique | Implementation |
|---|---|
| Prompt instruction | "NEVER generate fake government information" |
| Source verification | `source_verified: false` for uncertain info |
| Human review | `humanReview: true` for high-stakes |
| Disclaimer | "AI-generated. Please verify with official sources." |

**Limitation:** No automated content filtering or safety classifier.

## Response Logging

| Aspect | Implementation |
|---|---|
| Audit log ID | LLM-generated string (not a real database ID) |
| Decision log | Mock data (not connected to real calls) |
| Chat history | In-memory only (resets on refresh) |

## Human Review Triggers

| Trigger | Implementation |
|---|---|
| LLM flag | `humanReview: true` in response |
| Low confidence | `confidence_score < 80` → flag |
| High-stakes | Prompt instructs to flag housing, loan, pension |
| Notification | Backend function `human_review` template |

## Separation of Concerns

| Type | What | Implementation |
|---|---|---|
| **Deterministic** | Eligibility, match score, benefit amount | Rule Engine (householdCalculator.js) |
| **Probabilistic AI** | Language, intent, explanation, recommendation | LLM (InvokeLLM) |
| **Human** | Approval, review, policy updates | Human officer (simulated) |

---

# PART 10 — MULTILINGUAL AND VOICE ARCHITECTURE

## Supported Languages

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
| gu | Gujarati | gu-IN | Partial (greetings + examples) |
| pa | Punjabi | pa-IN | Partial |
| ur | Urdu | ur-IN | Partial |
| or | Odia | or-IN | Partial |
| as | Assamese | as-IN | Partial |

## Voice Flow

```
Voice Input
→ Speech-to-Text (SpeechRecognition API)
  • recognition.lang = "ta-IN" (or hi-IN, en-IN...)
  • Interim results shown as user speaks
  • Final transcript captured
→ Language Detection (LLM auto-detects)
→ Intent Detection (LLM)
→ Rule Engine + RAG (context + deterministic scoring)
→ Response Generation (LLM structured JSON)
→ Translation (LLM responds in detected language)
→ Text-to-Speech (SpeechSynthesis API)
  • utterance.lang = "ta-IN"
  • Voice selection: find matching language
  • Rate: 0.9, Pitch: 1
  • User clicks "Read Aloud"
```

## Accessibility & Low-Literacy Support

| Feature | Implementation |
|---|---|
| Voice input | Citizens who can't read/write can speak |
| Voice output | Citizens who can't read can listen |
| Multilingual | Native language interaction |
| Natural examples | Suggested questions in each language |
| Simple UI | Large touch targets, clear icons |

---

# PART 11 — DATA MODEL

## Current Entities

### 1. User (Built-in)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| email | string | Unique, required |
| full_name | string | Display name |
| role | string | "admin" / "user" |
| created_date | datetime (auto) | |
| updated_date | datetime (auto) | |

- **Purpose:** Authentication and authorization
- **Sensitive Data:** Email (PII)
- **Access:** Admins manage other users; users see only themselves
- **Status:** **Implemented**

### 2. FamilyMember

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
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
| created_date | datetime (auto) | |
| updated_date | datetime (auto) | |
| created_by_id | string (auto) | Owning user |

- **Purpose:** Household tracking for benefit calculation
- **Sensitive Data:** Name, age, income, Aadhaar status
- **Access:** User-scoped
- **Status:** **Implemented** (full CRUD)

### 3. Notification

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
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
| created_date | datetime (auto) | |
| updated_date | datetime (auto) | |
| created_by_id | string (auto) | |

- **Purpose:** Bilingual status notifications
- **Status:** **Implemented** (via backend function)

## Future Entities

| Entity | Key Fields |
|---|---|
| CitizenProfile | aadhaar_masked, pan_masked, state, district, income, trust_score |
| GovernmentScheme | name, category, ministry, benefit, eligibility[], portal_url, policy_version |
| EligibilityRule | scheme_id, conditions[], threshold, points[], policy_version |
| PolicySource | title, department, version, text, effective_date |
| Document | name, type, number, verified, expiry, file_url |
| Consent | user_id, data_type, granted, purpose, expiry |
| Application | user_id, scheme_id, status, submitted_date, confidence, amount |
| AIRecommendation | user_id, query, response, confidence, rule_matched, audit_id |
| AIDecision | user_id, decision, policy, confidence, human_review, status |
| AuditLog | user_id, action, entity, entity_id, timestamp |
| HumanReview | application_id, ai_decision, officer_id, review_status |

## ERD

```
User (1) ──── (N) FamilyMember
  │
  ├── (N) Notification
  ├── (N) Document (Future)
  ├── (N) Consent (Future)
  ├── (N) Application (Future) ──── (1) GovernmentScheme (Future)
  ├── (N) AIRecommendation (Future)
  ├── (N) AIDecision (Future) ──── (N) HumanReview (Future)
  └── (N) AuditLog (Future)
```

---

# PART 12 — API DOCUMENTATION

## Implemented APIs

### Authentication (Base44 SDK)

| Method | Purpose | Input | Output | Auth | Status |
|---|---|---|---|---|---|
| SDK | Login | email, password | session token | Public | Implemented |
| SDK | Google OAuth | provider: "google" | redirect + token | Public | Implemented |
| SDK | Register | email, password | unverified user | Public | Implemented |
| SDK | Verify OTP | email, otpCode | access_token | Public | Implemented |
| SDK | Reset password request | email | generic success | Public | Implemented |
| SDK | Reset password | resetToken, newPassword | redirect | Public | Implemented |
| SDK | Get current user | — | user object | Authenticated | Implemented |
| SDK | Logout | — | redirect | Authenticated | Implemented |

### Entity APIs (Base44 SDK)

| Entity | Operation | Input | Auth | Status |
|---|---|---|---|---|
| FamilyMember | list() | — | Authenticated | Implemented |
| FamilyMember | filter(query) | query object | Authenticated | Implemented |
| FamilyMember | create(data) | member object | Authenticated | Implemented |
| FamilyMember | bulkCreate(data[]) | member array | Authenticated | Implemented |
| FamilyMember | update(id, data) | id, partial data | Authenticated | Implemented |
| FamilyMember | delete(id) | id | Authenticated | Implemented |
| Notification | list() | — | Authenticated | Implemented |
| Notification | filter(query) | query object | Authenticated | Implemented |
| Notification | create(data) | notification object | Authenticated | Implemented |
| Notification | update(id, data) | id, partial data | Authenticated | Implemented |

### Backend Function

| Method | Function | Input | Output | Auth | Status |
|---|---|---|---|---|---|
| POST | notifyStatusChange | application_id, new_status, service_name | { success, notification } | Authenticated | Implemented |

### Integration APIs

| Integration | Purpose | Status |
|---|---|---|
| Core.InvokeLLM | AI chat response | Implemented |
| Core.UploadFile | Upload file | Available (unused) |
| Core.ExtractDataFromUploadedFile | Extract data from file | Available (unused) |
| Core.SendEmail | Send email | Available (unused) |
| Core.GenerateImage | Generate AI image | Available (unused) |
| Core.GenerateSpeech | Premium TTS | Available (unused) |

## Prototype APIs (Simulated)

| API | Status |
|---|---|
| Scheme search | Prototype (client-side filter) |
| Eligibility check | Prototype (client-side rule engine) |
| Document upload | Prototype (non-functional) |
| Application submission | Prototype (external link) |
| Consent management | Prototype (local state) |
| Proactive alerts | Prototype (hardcoded) |
| Policy intelligence | Prototype (mock) |
| Predictive analytics | Prototype (mock) |

## Future APIs

| API | Purpose |
|---|---|
| Aadhaar e-KYC | Verify Aadhaar via UIDA |
| DigiLocker | Fetch documents |
| Government scheme database | Real scheme catalog |
| Application status | Real status check |
| Portal submission | Direct API submission |
| RAG retrieval | Vector search |
| Admin scheme management | CRUD for schemes |
| Audit log export | Export audit trail |

---

*Continued in Part 4: Security, AI Governance, Novelty, Hosting, Testing, Limitations, Roadmap, Slides, Q&A*