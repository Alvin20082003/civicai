# AI Module Documentation — CivicAI

> Complete documentation of the AI pipeline, LLM usage, RAG, voice processing, and hallucination reduction

---

## AI Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       AI PIPELINE                                │
│                                                                   │
│  Citizen Input (text or voice)                                   │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────┐                                                  │
│  │  1. INPUT    │  Text: captured from textarea                   │
│  │  CAPTURE     │  Voice: STT via Web Speech API → transcribed    │
│  └──────┬──────┘                                                  │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────┐                                                  │
│  │  2. CONTEXT  │  buildCaseworkerPrompt(query)                   │
│  │  INJECTION   │  • Citizen profile (mock)                       │
│  │              │  • Family members (from entity)                 │
│  │              │  • Scheme catalog (8 schemes)                   │
│  │              │  • Document wallet (mock)                       │
│  └──────┬──────┘                                                  │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────┐                                                  │
│  │  3. LLM CALL │  base44.integrations.Core.InvokeLLM({           │
│  │              │    prompt, response_json_schema                 │
│  │              │  })                                             │
│  │              │  Model: "automatic"                             │
│  │              │  Timeout: 45 seconds                            │
│  └──────┬──────┘                                                  │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────┐                                                  │
│  │  4. RESPONSE │  Structured JSON (enforced by schema)           │
│  │  PARSING     │  • detected_language                            │
│  │              │  • intent_summary                               │
│  │              │  • recommended_schemes[]                        │
│  │              │  • confidence_scores                            │
│  │              │  • policy_citations                             │
│  └──────┬──────┘                                                  │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────┐                                                  │
│  │  5. RENDER   │  Display in citizen's language                  │
│  │              │  • Greeting + summary                           │
│  │              │  • Scheme cards with details                    │
│  │              │  • Trust badges + audit log ID                  │
│  └──────┬──────┘                                                  │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────┐                                                  │
│  │  6. VOICE    │  Optional: citizen clicks "Read Aloud"          │
│  │  OUTPUT      │  TTS via SpeechSynthesis API                    │
│  │              │  Locale: detected_language                      │
│  └─────────────┘                                                  │
│                                                                   │
│  PARALLEL: Rule Engine runs separately (deterministic)            │
│  The LLM references rule_matched but cannot override it           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Status: Implemented** (except chat history persistence and conversation memory)

---

## Prompt Flow

### Location
`src/lib/aiPrompt.js`

### Function
```javascript
buildCaseworkerPrompt(userQuery: string): string
```

### Prompt Structure

The prompt builder constructs a comprehensive prompt with:

#### 1. System Instructions
- Role: "You are CivicAI, an AI Digital Caseworker for Indian government services"
- Language: "DETECT the language of the citizen's query automatically. Respond in the SAME language"
- Mixed language: "If mixed language, detect the dominant language"
- Safety: "NEVER generate fake government information"

#### 2. Citizen Context (Injected)
```javascript
// From indiaData.js (mock)
const citizen = {
  name: "Arjun Kumar",
  age: 24,
  occupation: "Engineering Student",
  annual_income: 180000,
  aadhaar_linked: true,
  state: "Tamil Nadu",
  district: "Chennai"
};
```

#### 3. Family Context (From Entity)
```javascript
// From FamilyMember entity (database)
const familyMembers = await base44.entities.FamilyMember.list();
// Injected as formatted text: "Father: Rajesh, 55, Farmer, Income ₹1.8L..."
```

#### 4. Scheme Catalog (Injected)
```javascript
// From indiaData.js (8 schemes)
const schemes = governmentSchemes.map(s => `
  - ${s.name}: ${s.benefit}
    Eligibility: ${s.eligibility}
    Portal: ${s.portal}
    Policy: ${s.policyVersion}
`).join('\n');
```

#### 5. Document Context (Injected)
```javascript
// From indiaData.js (mock)
const documents = documentWallet.map(d => `${d.name}: ${d.status}`);
```

#### 6. Response Instructions
- Return structured JSON matching `caseworkerResponseSchema`
- Include `detected_language`, `intent_summary`, `greeting`, `summary`
- For each scheme: `confidence_score`, `why_recommended`, `rule_matched`, `policy_version`, `government_url`, `source_verified`, `humanReview`
- Generate `audit_log_id`

### Status: Implemented

---

## LLM Usage

### Provider
Base44 Core.InvokeLLM integration

### Call Pattern
```javascript
const response = await base44.integrations.Core.InvokeLLM({
  prompt: buildCaseworkerPrompt(userQuery),
  response_json_schema: caseworkerResponseSchema,
  // model: "automatic" (default)
});
```

### Available Models

| Model | Use Case | Web Search | Credit Cost |
|---|---|---|---|
| `automatic` (default) | General purpose | No | Standard |
| `gpt_5_mini` | Fast, simple tasks | No | Lower |
| `gemini_3_flash` | Fast + web search | Yes | Lower |
| `gpt_5_4` / `gpt_5_5` | High quality | No | Higher |
| `gemini_3_1_pro` | High quality + web search | Yes | Higher |
| `claude_sonnet_4_6` | Complex reasoning | No | Higher |
| `claude_opus_4_6` / `4_7` / `4_8` | Highest quality | No | Highest |
| `claude-sonnet-5` | Latest Claude | No | Higher |

### Current Usage
- **Model:** "automatic" (default)
- **Web search:** Disabled (no `add_context_from_internet`)
- **File attachments:** Not used
- **Timeout:** 45 seconds
- **Status:** Implemented

### What the LLM Does

| Task | Status |
|---|---|
| Natural language understanding | Implemented |
| Language detection (13 Indian languages) | Implemented |
| Intent identification | Implemented |
| Scheme recommendation (from injected context) | Implemented |
| Explanation generation (in citizen's language) | Implemented |
| Confidence scoring (0-100 per scheme) | Implemented |
| Policy version citation | Implemented |
| Portal URL citation | Implemented |
| Conversational greeting | Implemented |
| Intent summarization | Implemented |
| Audit log ID generation | Implemented |
| Human review flagging | Implemented |

### What the LLM Does NOT Do

| Task | Who Does It | Why |
|---|---|---|
| Eligibility decision (yes/no) | Rule Engine | Prevents hallucination |
| Match score calculation | Rule Engine | Deterministic |
| Benefit amount determination | Scheme catalog (hardcoded) | Prevents fabrication |
| Application approval | Human officer / Portal | AI cannot approve |
| Policy creation | Government | AI cannot create policy |

---

## RAG (Retrieval-Augmented Generation)

### Current Implementation: Prompt-Based Context Injection

**Status: Prototype / Simulated**

CivicAI's current RAG approach is **prompt-based context injection** — not a true vector database RAG:

1. **Knowledge Base:** `governmentSchemes` array in `indiaData.js` (8 schemes)
2. **Retrieval:** All 8 schemes are injected into the LLM prompt as a text catalog
3. **Generation:** LLM uses injected context + training knowledge
4. **Citation:** LLM cites `policy_version` and `government_url` from the injected catalog

### How It Works

```javascript
// All schemes are injected into the prompt
const schemeCatalog = governmentSchemes.map(s => `
  Scheme: ${s.name}
  Benefit: ${s.benefit}
  Eligibility: ${s.eligibility}
  Documents: ${s.requiredDocuments.join(', ')}
  Portal: ${s.portal}
  Policy Version: ${s.policyVersion}
`).join('\n---\n');

// The prompt includes the full catalog
prompt += `\n\nAVAILABLE GOVERNMENT SCHEMES:\n${schemeCatalog}`;
```

### Limitations of Current Approach

| Limitation | Impact |
|---|---|
| No vector database | All schemes injected — doesn't scale beyond ~20 schemes |
| No semantic search | No embedding-based retrieval |
| No document chunking | Full text injected, no granular retrieval |
| No similarity scoring | Can't rank results by relevance |
| Limited knowledge base | Only 8 schemes |

### Future RAG Implementation (Future Integration)

```
┌─────────────────────────────────────────────────────────┐
│  FUTURE RAG PIPELINE                                     │
│                                                          │
│  1. INGEST                                               │
│     • Policy documents → PolicySource entity             │
│     • Scheme details → GovernmentScheme entity           │
│     • Eligibility rules → EligibilityRule entity         │
│                                                          │
│  2. EMBED                                                │
│     • Generate embeddings for each document/policy       │
│     • Use embedding model (e.g., text-embedding-004)     │
│     • Store embeddings in vector database                │
│       (Pinecone, Weaviate, or pgvector)                  │
│                                                          │
│  3. RETRIEVE                                             │
│     • On citizen query: embed the query                  │
│     • Vector search → retrieve top-K relevant policies   │
│     • Score by cosine similarity                         │
│                                                          │
│  4. GENERATE                                             │
│     • Inject top-K results into LLM prompt               │
│     • LLM generates response grounded in retrieved docs  │
│     • Cite specific policy sections                      │
│                                                          │
│  Status: Future Integration (Phase 3)                    │
└─────────────────────────────────────────────────────────┘
```

---

## Knowledge Base

### Location
`src/lib/indiaData.js` → `governmentSchemes` array

### Contents (8 Schemes)

| Scheme | Category | Benefit | Portal | Status |
|---|---|---|---|---|
| PM-KISAN | Agriculture | ₹6,000/year | pmkisan.gov.in | Implemented (mock data) |
| NSP Engineering | Education | ₹50,000/year | scholarships.gov.in | Implemented (mock data) |
| Ayushman Bharat | Healthcare | ₹5,00,000 cover | pmjay.gov.in | Implemented (mock data) |
| PMAY | Housing | ₹1,50,000 | pmaymis.gov.in | Implemented (mock data) |
| Old Age Pension | Welfare | ₹12,000/year | indiapost.gov.in | Implemented (mock data) |
| Beti Bachao Beti Padhao | Welfare | ₹25,000 | wcdf.gov.in | Implemented (mock data) |
| Stand-Up India | Business | ₹1,00,000 loan | standupmitra.in | Implemented (mock data) |
| Skill India | Employment | ₹15,000 | msde.gov.in | Implemented (mock data) |

### Each Scheme Includes
- `id`: Unique identifier
- `name`: English name
- `name_ta`: Tamil name
- `name_hi`: Hindi name
- `category`: Scheme category
- `benefit`: Benefit description and amount
- `eligibility`: Eligibility criteria text
- `requiredDocuments`: Array of required document types
- `applicationSteps`: Array of step descriptions
- `portal`: Official portal name
- `portalUrl`: Official portal URL
- `policyVersion`: Policy version string
- `processingTime`: Expected processing time
- `office`: Processing office name
- `aiGuidance`: AI-generated guidance text

### Status: Prototype / Simulated (8 of 200+ planned schemes)

---

## Embeddings

**Status: Future Integration**

CivicAI does not currently use embeddings. Future implementation will:

1. Generate embeddings for policy documents using an embedding model
2. Store embeddings in a vector database
3. Use embeddings for semantic search on citizen queries
4. Retrieve top-K most relevant policy sections for LLM context

### Planned Embedding Model
- Google `text-embedding-004` or similar
- 768-dimensional vectors
- Cosine similarity for retrieval

---

## Vector Search

**Status: Future Integration**

CivicAI does not currently use vector search. Future implementation will:

1. Store policy embeddings in a vector database (Pinecone, Weaviate, or pgvector)
2. On citizen query: embed query → vector search → retrieve top-K
3. Inject retrieved policy sections into LLM prompt
4. Cite specific sections in the response

---

## Explainability

### Status: Implemented

Every AI response includes explainability fields:

| Field | Purpose | Example |
|---|---|---|
| `why_recommended` | Why the scheme matches the citizen | "You qualify as a student with income below ₹2L threshold" |
| `eligibility_reasons` | Array of specific reasons | ["Student status: true", "Income below ₹2L", "Age 18-30"] |
| `rule_matched` | Which deterministic rule applied | "nsp-engineering" |
| `policy_version` | Which policy version was cited | "NSP-EDU-2025-v3.0" |
| `government_url` | Official portal URL | "https://scholarships.gov.in" |
| `source_verified` | LLM confidence in the URL | true / false |
| `confidence_score` | Overall confidence (0-100) | 97 |
| `audit_log_id` | Traceable decision ID | "CAI-2025-001234" |
| `humanReview` | Whether human review is needed | false |
| `rule_engine_validation` | Confirmation rule engine was used | "Deterministic scoring applied" |

### Explainable AI Page
- **Location:** `src/pages/ExplainableAI.jsx`
- **Status:** Prototype / Simulated (3 hardcoded explanations with legacy data)
- **Future:** Connect to real AI decision log

---

## Confidence Scores

### Status: Implemented

### Dual Confidence System

| Source | Method | Range |
|---|---|---|
| LLM | Returns `confidence_score` per scheme | 0-100 |
| Rule Engine | Returns `match` percentage from deterministic scoring | 0-99 |

### LLM Confidence
- The LLM assesses how well the citizen's profile matches the scheme
- Based on injected context (profile, family, documents)
- Subjective — may vary between calls

### Rule Engine Match
- Deterministic scoring: `match = Math.min(score + base, maxMatch)`
- Based on fixed conditions and point values
- Always returns the same result for the same input

### Display
- **AI Chat:** LLM `confidence_score` displayed per scheme
- **Family Page:** Rule Engine `match` percentage displayed per member per scheme

### Confidence Interpretation

| Score | Meaning | UI Color |
|---|---|---|
| 90-100 | Very confident | Green |
| 70-89 | Fairly confident | Blue |
| 50-69 | Moderately confident | Yellow |
| Below 50 | Low confidence | Gray |

---

## Language Detection

### Status: Implemented

### How It Works
1. LLM is instructed: "DETECT the language of the citizen's query automatically. Respond in the SAME language."
2. LLM analyzes the query text
3. Returns `detected_language` code in JSON response

### Supported Languages

| Code | Language | Status |
|---|---|---|
| en | English | Implemented |
| ta | Tamil | Implemented |
| hi | Hindi | Implemented |
| te | Telugu | Implemented |
| ml | Malayalam | Implemented |
| kn | Kannada | Implemented |
| bn | Bengali | Implemented |
| mr | Marathi | Implemented |
| gu | Gujarati | Implemented |
| pa | Punjabi | Implemented |
| ur | Urdu | Implemented |
| or | Odia | Implemented |
| as | Assamese | Implemented |

### Mixed Language Handling
- Prompt instruction: "If mixed language (e.g., Tamil+English), detect the dominant language."
- LLM determines the dominant language and responds in that language

---

## Voice Processing

### Status: Implemented (browser-dependent)

### Speech-to-Text (STT)

**Location:** `src/hooks/useVoiceAssistant.js`

**Technology:** Web Speech Recognition API (browser-native)

**How It Works:**
```javascript
const recognition = new window.SpeechRecognition();
recognition.lang = "ta-IN";  // Indian Tamil locale
recognition.interimResults = true;
recognition.continuous = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // Pass transcript to AI chat
};

recognition.start();
```

**Indian Locales Supported:**
- `ta-IN` (Tamil), `hi-IN` (Hindi), `en-IN` (English)
- `te-IN` (Telugu), `ml-IN` (Malayalam), `kn-IN` (Kannada)
- `bn-IN` (Bengali), `mr-IN` (Marathi)
- `gu-IN` (Gujarati), `pa-IN` (Punjabi), `ur-IN` (Urdu)
- `or-IN` (Odia), `as-IN` (Assamese)

**Features:**
- Interim results (shows transcription as user speaks)
- Final transcript captured
- Language set based on selected UI language

### Text-to-Speech (TTS)

**Location:** `src/hooks/useVoiceAssistant.js`

**Technology:** SpeechSynthesis API (browser-native)

**How It Works:**
```javascript
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = "ta-IN";  // Indian Tamil locale
utterance.rate = 0.9;
utterance.pitch = 1;

// Find matching voice
const voices = window.speechSynthesis.getVoices();
const voice = voices.find(v => v.lang === "ta-IN");
if (voice) utterance.voice = voice;

window.speechSynthesis.speak(utterance);
```

**Features:**
- Language set based on LLM's `detected_language`
- Voice selection: finds voice matching language locale
- Rate: 0.9 (slightly slower for clarity)
- Pitch: 1 (normal)
- User clicks "Read Aloud" button to play
- "Stop" button to cancel playback

### Browser Compatibility

| Browser | STT Support | TTS Support |
|---|---|---|
| Chrome | ✅ Full | ✅ Full |
| Edge | ✅ Full | ✅ Full |
| Safari | ✅ Partial | ✅ Full |
| Firefox | ❌ Limited | ✅ Full |

### Limitations
- Voice quality depends on browser/OS
- Not all browsers support all Indian locales
- Some languages may not have voices installed
- No wake word detection (user must click button)
- No continuous listening mode

---

## Hallucination Reduction

### Status: Implemented

### Techniques

| Technique | How It Works | Status |
|---|---|---|
| **Rule Engine Separation** | LLM cannot change eligibility — only the deterministic rule engine decides | Implemented |
| **Structured JSON Schema** | Forces specific fields, less room for free-form hallucination | Implemented |
| **Context Injection** | Full scheme catalog provided in prompt — LLM doesn't recall from memory | Implemented |
| **source_verified Flag** | LLM must set true/false — if unsure about URL, must say so | Implemented |
| **Policy Version Citation** | Every recommendation must include `policy_version` | Implemented |
| **Rule Matched String** | LLM must include `rule_matched` identifying which rule applied | Implemented |
| **Human Review Flag** | High-stakes or uncertain cases flagged for human review | Implemented |
| **Disclaimer** | UI shows "AI-generated recommendations. Please verify with official sources." | Implemented |

### Why This Matters

The core principle:

> **The Rule Engine decides eligibility. The LLM explains the outcome.**

The LLM:
- ✅ Can explain why a citizen is eligible
- ✅ Can recommend relevant schemes
- ✅ Can generate multilingual responses
- ❌ CANNOT change the eligibility decision
- ❌ CANNOT fabricate benefit amounts
- ❌ CANNOT override the rule engine

### Example

**Citizen asks:** "Am I eligible for PM-KISAN?"

**Rule Engine evaluates:**
- Farmer? → No → +0 points
- Score: 0 (below threshold of 60)
- Result: NOT ELIGIBLE

**LLM explains:**
> "Based on your profile, you are not eligible for PM-KISAN because this scheme is specifically for farmers. Your occupation is listed as 'Engineering Student.' However, you may be eligible for the National Scholarship Portal — would you like me to check?"

The LLM **cannot** say "You are eligible for PM-KISAN" because the rule engine has already determined the citizen is NOT eligible.

---

## Human Review

### Status: Prototype / Simulated

### When Human Review Is Triggered

| Trigger | Implementation | Status |
|---|---|---|
| LLM confidence < 80 | Prompt instructs LLM to set `humanReview: true` | Implemented |
| High-stakes schemes | Prompt instructs to flag housing, loan, pension schemes | Implemented |
| LLM uncertainty | `source_verified: false` flag | Implemented |
| Backend function template | `human_review` notification template exists | Implemented |

### How It Works

1. LLM includes `humanReview: true` in JSON response
2. Response displayed with "Human Review Required" badge
3. Backend function can create `human_review` notification
4. **Future:** Human officer reviews in admin queue (Future Integration)

### Current Limitations
- No actual review queue exists
- No officer dashboard
- No review workflow
- `humanReview` flag is informational only

---

## Model Limitations

### LLM Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| Possible hallucination | LLM may fabricate explanatory text | Rule engine prevents eligibility errors; source_verified flag |
| No conversation memory | Each message is independent | Future: persist chat sessions |
| Language quality varies | Some Indian languages may have lower quality | Future: Sarvam AI / AI4Bharat models |
| 45-second timeout | Complex queries may time out | Optimize prompt; future: streaming responses |
| No chat persistence | History resets on page refresh | Future: ChatSession entity |
| No streaming | User waits for full response | Future: streaming responses |

### Voice Model Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| Browser-dependent | Voice quality varies by browser/OS | Test on target browsers; text fallback |
| Indian locale support varies | Some languages may not have voices | Premium TTS (Base44 GenerateSpeech) available |
| No wake word | User must click button | Future: continuous listening |
| No continuous mode | Single utterance per activation | Future: continuous listening |

### Rule Engine Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| Simplified scoring | Not full policy text | Future: full policy rule definitions |
| No policy versioning | Rules can't be versioned | Future: EligibilityRule entity |
| No rule update workflow | Rules can't be updated via admin | Future: admin dashboard |
| No rule conflict detection | Conflicting rules not detected | Future: conflict detection |
| Client-side execution | Rules visible in source code | Future: server-side rule execution |
| No audit logging | Rule evaluations not logged | Future: AuditLog entity |

---

## Future AI Improvements

| Improvement | Description | Phase |
|---|---|---|
| Chat history persistence | Save chat sessions to database | Phase 2 |
| Conversation memory | Context across multiple messages | Phase 2 |
| Streaming responses | Real-time token streaming | Phase 2 |
| RAG with vector database | Semantic policy retrieval | Phase 3 |
| Server-side rule engine | Move eligibility evaluation to backend | Phase 2 |
| Audit logging | Log every AI call and decision | Phase 2 |
| Indic language models | Sarvam AI / AI4Bharat for better Indian languages | Phase 3 |
| Multi-modal input | Image/document upload for AI analysis | Phase 3 |
| Proactive AI | AI initiates conversations based on life events | Phase 4 |
| AI agent | Autonomous case management | Phase 5 |
| Predictive models | ML-based demand forecasting | Phase 5 |
| Bias detection | Real-time bias monitoring | Phase 3 |
| Model performance tracking | Track accuracy and drift | Phase 3 |

---

*Last updated: July 2026*