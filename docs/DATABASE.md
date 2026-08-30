# Database Documentation — CivicAI

> Complete entity schemas, relationships, and data model documentation

---

## Database Overview

| Field | Detail |
|---|---|
| **Type** | NoSQL Document Store |
| **Provider** | Base44 Managed Database |
| **Status** | Implemented |
| **Scaling** | Auto-scaling (Base44-managed) |
| **Backup** | Base44-managed |
| **Encryption** | At-rest (Base44-managed) |

### Query Method

All database operations go through the Base44 SDK:

```javascript
import { base44 } from "@/api/base44Client";

// List
const members = await base44.entities.FamilyMember.list();

// Filter
const filtered = await base44.entities.FamilyMember.filter({ relation: "Father" });

// Create
const member = await base44.entities.FamilyMember.create({ name: "Rajesh", ... });

// Update
await base44.entities.FamilyMember.update(id, { age: 56 });

// Delete
await base44.entities.FamilyMember.delete(id);

// Real-time subscription
const unsubscribe = base44.entities.FamilyMember.subscribe((event) => { ... });
```

---

## Current Entities

### 1. User (Built-in — Base44 Managed)

| Field | Type | Required | Notes |
|---|---|---|---|
| id | string | Yes (auto) | Primary key |
| email | string | Yes | Unique, PII |
| full_name | string | No | Display name |
| role | string | Yes | "admin" or "user" (default: "user") |
| created_date | datetime | Yes (auto) | |
| updated_date | datetime | Yes (auto) | |

- **Purpose:** Authentication and authorization
- **Primary Key:** `id`
- **Indexes:** `email` (unique)
- **Sensitive Data:** Email (PII)
- **Access Control:**
  - Users can read their own record
  - Admins can list/update/delete other users
  - User records cannot be created/imported — users join via invites
- **Retention:** Until user is deleted by admin
- **Audit:** `created_date`, `updated_date`
- **Status:** **Implemented**

#### Example Record

```json
{
  "id": "usr_abc123",
  "email": "arjun.kumar@example.com",
  "full_name": "Arjun Kumar",
  "role": "user",
  "created_date": "2025-06-15T10:30:00Z",
  "updated_date": "2025-07-10T14:22:00Z"
}
```

---

### 2. FamilyMember

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | string | Yes (auto) | — | Primary key |
| name | string | Yes | — | Full name |
| relation | enum | Yes | — | Self, Father, Mother, Spouse, Son, Daughter, Brother, Sister, Grandfather, Grandmother, Other |
| age | number | Yes | — | Age in years |
| gender | enum | Yes | — | Male, Female, Other |
| occupation | string | Yes | — | Job/occupation |
| annual_income | number | No | 0 | Annual income in ₹ |
| aadhaar_linked | boolean | No | false | Whether Aadhaar is linked |
| student | boolean | No | false | Is a student |
| senior_citizen | boolean | No | false | Is senior citizen (age ≥ 60) |
| disability | boolean | No | false | Has disability |
| bpl_category | boolean | No | false | Below Poverty Line |
| avatar | string | No | — | Avatar image URL |
| created_date | datetime | Yes (auto) | — | |
| updated_date | datetime | Yes (auto) | — | |
| created_by_id | string | Yes (auto) | — | Owning user ID (foreign key → User) |

- **Purpose:** Household member tracking for benefit calculation
- **Primary Key:** `id`
- **Foreign Key:** `created_by_id` → User.id
- **Indexes:** `created_by_id` (user-scoped queries)
- **Sensitive Data:** Name, age, income, Aadhaar status (PII)
- **Access Control:** User-scoped — each user sees only their own family members
- **Retention:** Until user deletes
- **Audit:** `created_date`, `updated_date`, `created_by_id`
- **Status:** **Implemented** (full CRUD)

#### Example Record

```json
{
  "id": "fm_xyz789",
  "name": "Rajesh Kumar",
  "relation": "Father",
  "age": 55,
  "gender": "Male",
  "occupation": "Farmer",
  "annual_income": 180000,
  "aadhaar_linked": true,
  "student": false,
  "senior_citizen": false,
  "disability": false,
  "bpl_category": false,
  "avatar": null,
  "created_date": "2025-06-15T10:35:00Z",
  "updated_date": "2025-06-15T10:35:00Z",
  "created_by_id": "usr_abc123"
}
```

#### Entity Schema (base44/entities/FamilyMember.jsonc)

```json
{
  "name": "FamilyMember",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "relation": {
      "type": "string",
      "enum": ["Self", "Father", "Mother", "Spouse", "Son", "Daughter",
               "Brother", "Sister", "Grandfather", "Grandmother", "Other"]
    },
    "age": { "type": "number" },
    "gender": { "type": "string", "enum": ["Male", "Female", "Other"] },
    "occupation": { "type": "string" },
    "annual_income": { "type": "number", "default": 0 },
    "aadhaar_linked": { "type": "boolean", "default": false },
    "student": { "type": "boolean", "default": false },
    "senior_citizen": { "type": "boolean", "default": false },
    "disability": { "type": "boolean", "default": false },
    "bpl_category": { "type": "boolean", "default": false },
    "avatar": { "type": "string" }
  },
  "required": ["name", "relation", "age", "gender", "occupation"]
}
```

---

### 3. Notification

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | string | Yes (auto) | — | Primary key |
| title_en | string | Yes | — | English title |
| title_ta | string | Yes | — | Tamil title |
| description_en | string | Yes | — | English description |
| description_ta | string | Yes | — | Tamil description |
| type | enum | Yes | "info" | success, warning, info, action_required |
| category | enum | Yes | "status_change" | status_change, action_required, document, policy, system |
| read | boolean | No | false | Whether notification has been read |
| application_id | string | No | — | Associated application ID |
| service_name | string | No | — | Associated government service |
| action_label_en | string | No | — | English action button label |
| action_label_ta | string | No | — | Tamil action button label |
| action_link | string | No | — | Action button link (internal or external) |
| created_date | datetime | Yes (auto) | — | |
| updated_date | datetime | Yes (auto) | — | |
| created_by_id | string | Yes (auto) | — | Owning user ID (foreign key → User) |

- **Purpose:** Bilingual status change notifications
- **Primary Key:** `id`
- **Foreign Key:** `created_by_id` → User.id
- **Indexes:** `created_by_id` (user-scoped queries), `read` (unread filter)
- **Sensitive Data:** Application ID (reference)
- **Access Control:** User-scoped
- **Retention:** Until user deletes
- **Audit:** `created_date`, `updated_date`, `created_by_id`
- **Status:** **Implemented** (via backend function `notifyStatusChange`)

#### Example Record

```json
{
  "id": "ntf_def456",
  "title_en": "Application Approved",
  "title_ta": "விண்ணப்பம் அங்கீகரிக்கப்பட்டது",
  "description_en": "Your PM-KISAN application (APP-001) has been approved. ₹6,000 will be transferred to your bank account.",
  "description_ta": "உங்கள் பிஎம்-கிசான் விண்ணப்பம் (APP-001) அங்கீகரிக்கப்பட்டது. ₹6,000 உங்கள் வங்கி கணக்கிற்கு மாற்றப்படும்.",
  "type": "success",
  "category": "status_change",
  "read": false,
  "application_id": "APP-001",
  "service_name": "PM-KISAN",
  "action_label_en": "View Details",
  "action_label_ta": "விவரங்களைக் காண்க",
  "action_link": "/schemes",
  "created_date": "2025-07-10T14:22:00Z",
  "updated_date": "2025-07-10T14:22:00Z",
  "created_by_id": "usr_abc123"
}
```

#### Entity Schema (base44/entities/Notification.jsonc)

```json
{
  "name": "Notification",
  "type": "object",
  "properties": {
    "title_en": { "type": "string" },
    "title_ta": { "type": "string" },
    "description_en": { "type": "string" },
    "description_ta": { "type": "string" },
    "type": {
      "type": "string",
      "enum": ["success", "warning", "info", "action_required"],
      "default": "info"
    },
    "category": {
      "type": "string",
      "enum": ["status_change", "action_required", "document", "policy", "system"],
      "default": "status_change"
    },
    "read": { "type": "boolean", "default": false },
    "application_id": { "type": "string" },
    "service_name": { "type": "string" },
    "action_label_en": { "type": "string" },
    "action_label_ta": { "type": "string" },
    "action_link": { "type": "string" }
  },
  "required": ["title_en", "title_ta", "description_en", "description_ta", "type", "category"]
}
```

---

## Entity Relationships

```
┌──────────┐           ┌──────────────┐           ┌──────────────┐
│   User    │ 1───────N │ FamilyMember  │           │ Notification │
│           │           │               │           │              │
│ id        │           │ id            │           │ id           │
│ email     │           │ name          │           │ title_en     │
│ full_name │           │ relation      │           │ title_ta     │
│ role      │           │ age           │           │ type         │
│           │           │ gender        │           │ category     │
│           │           │ occupation    │           │ read         │
│           │           │ annual_income │           │              │
│           │           │ aadhaar_linked│           │              │
│           │           │ student       │           │              │
│           │           │ senior_citizen│           │              │
│           │           │ disability    │           │              │
│           │           │ bpl_category  │           │              │
│           │           │ avatar        │           │              │
│           │           │ created_by_id │◄──────────│ created_by_id│
│           │           │   (FK→User)   │           │   (FK→User)  │
└──────────┘           └──────────────┘           └──────────────┘
      │                        │
      │                        │
      │                        │ evaluated by
      │                        ▼
      │                 ┌──────────────┐
      │                 │  Rule Engine  │
      │                 │ (client-side) │
      │                 │               │
      │                 │ 8 scheme      │
      │                 │ scoring       │
      │                 │ functions     │
      │                 └──────────────┘
      │                        │
      │                        │ references
      │                        ▼
      │                 ┌──────────────┐
      │                 │ Scheme Catalog│
      │                 │ (mock data)  │
      │                 │               │
      │                 │ indiaData.js  │
      │                 │ 8 schemes     │
      │                 └──────────────┘
      │
      │
      └── Future: ──── (N) Document (Future)
                ──── (N) Consent (Future)
                ──── (N) Application (Future) ──── (1) GovernmentScheme (Future)
                ──── (N) AIRecommendation (Future)
                ──── (N) AIDecision (Future) ──── (N) HumanReview (Future)
                ──── (N) AuditLog (Future)
```

### Relationship Details

| Relationship | Cardinality | Type | Status |
|---|---|---|---|
| User → FamilyMember | 1:N | `FamilyMember.created_by_id` → `User.id` | Implemented |
| User → Notification | 1:N | `Notification.created_by_id` → `User.id` | Implemented |
| User → Document | 1:N | Future | Future Integration |
| User → Consent | 1:N | Future | Future Integration |
| User → Application | 1:N | Future | Future Integration |
| Application → GovernmentScheme | N:1 | Future | Future Integration |
| User → AIRecommendation | 1:N | Future | Future Integration |
| User → AIDecision | 1:N | Future | Future Integration |
| AIDecision → HumanReview | N:1 | Future | Future Integration |
| User → AuditLog | 1:N | Future | Future Integration |

---

## Future Entities

### 4. CitizenProfile (Future Integration)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| aadhaar_masked | string | Masked Aadhaar (XXXX-XXXX-1234) |
| pan_masked | string | Masked PAN (ABCD****E) |
| state | string | Indian state |
| district | string | District |
| income | number | Annual income |
| occupation | string | Primary occupation |
| trust_score | number | Trust score (0-100) |
| verified | boolean | Identity verified |
| created_by_id | string | FK → User |

- **Purpose:** Extended citizen profile (replaces mock data in indiaData.js)
- **Status:** Future Integration

### 5. GovernmentScheme (Future Integration)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| name | string | Scheme name |
| name_ta | string | Tamil name |
| name_hi | string | Hindi name |
| category | string | education, agriculture, healthcare, etc. |
| ministry | string | Government ministry |
| benefit | number | Benefit amount |
| benefit_unit | string | "yearly", "one-time", etc. |
| eligibility | array | Eligibility criteria |
| required_documents | array | Required document types |
| application_steps | array | Step-by-step process |
| portal_url | string | Official portal URL |
| policy_version | string | Policy version reference |
| processing_time | string | Expected processing time |
| office | string | Processing office |
| active | boolean | Scheme currently active |

- **Purpose:** Replace hardcoded scheme catalog with database-backed catalog
- **Status:** Future Integration

### 6. EligibilityRule (Future Integration)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| scheme_id | string | FK → GovernmentScheme |
| conditions | array | Condition objects |
| threshold | number | Minimum score for eligibility |
| points | array | Point values per condition |
| policy_version | string | Policy version |
| effective_date | datetime | When rule became effective |
| expiry_date | datetime | When rule expires (if applicable) |

- **Purpose:** Replace hardcoded rule engine with database-backed rules
- **Status:** Future Integration

### 7. PolicySource (Future Integration)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| title | string | Policy document title |
| department | string | Government department |
| version | string | Policy version |
| text | string | Full policy text |
| effective_date | datetime | Policy effective date |
| expiry_date | datetime | Policy expiry date |

- **Purpose:** Authoritative policy document repository for RAG
- **Status:** Future Integration

### 8. Document (Future Integration)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| name | string | Document name |
| type | string | aadhaar, pan, license, certificate, etc. |
| number | string | Document number (masked) |
| verified | boolean | Verification status |
| expiry_date | date | Expiry date |
| file_url | string | File storage URL |
| created_by_id | string | FK → User |

- **Purpose:** Replace mock document wallet with persisted documents
- **Status:** Future Integration

### 9. Consent (Future Integration)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| data_type | string | income, medical, license, etc. |
| granted | boolean | Consent granted |
| purpose | string | Purpose of access |
| expiry | datetime | Consent expiry date |
| revoked | boolean | Consent revoked |
| created_by_id | string | FK → User |

- **Purpose:** Replace local-state consent with persisted consent records
- **Status:** Future Integration

### 10. Application (Future Integration)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| scheme_id | string | FK → GovernmentScheme |
| status | string | submitted, under_review, approved, rejected |
| submitted_date | datetime | Submission date |
| confidence | number | AI confidence at submission |
| amount | number | Applied amount |
| created_by_id | string | FK → User |

- **Purpose:** Replace mock applications with real application tracking
- **Status:** Future Integration

### 11. AIRecommendation (Future Integration)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| query | string | Citizen's original query |
| response | object | Full LLM response JSON |
| confidence | number | Overall confidence |
| rule_matched | string | Rule engine result |
| policy_version | string | Policy version cited |
| audit_id | string | Audit log reference |
| created_by_id | string | FK → User |

- **Purpose:** Persist AI chat history and recommendations
- **Status:** Future Integration

### 12. AIDecision (Future Integration)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| decision | string | Decision description |
| policy | string | Policy referenced |
| confidence | number | Confidence score |
| documents | array | Documents used |
| human_review | boolean | Human review required |
| status | string | logged, under_review, reviewed |
| timestamp | datetime | Decision time |
| created_by_id | string | FK → User |

- **Purpose:** Replace mock decision log with persistent audit trail
- **Status:** Future Integration

### 13. AuditLog (Future Integration)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| action | string | create, update, delete, ai_call |
| entity | string | Entity name |
| entity_id | string | Entity ID |
| timestamp | datetime | Action time |
| details | object | Additional details |
| created_by_id | string | FK → User |

- **Purpose:** Enterprise audit trail of all operations
- **Status:** Future Integration

### 14. HumanReview (Future Integration)

| Field | Type | Notes |
|---|---|---|
| id | string (auto) | Primary key |
| application_id | string | FK → Application |
| ai_decision | string | AI's original decision |
| officer_id | string | FK → User (officer) |
| review_status | string | pending, approved, rejected |
| review_notes | string | Officer's notes |
| review_date | datetime | Review completion date |

- **Purpose:** Human officer review queue for high-stakes decisions
- **Status:** Future Integration

---

## Data Model Summary

| Entity | Purpose | Fields | Status |
|---|---|---|---|
| User | Authentication & roles | 6 | Implemented |
| FamilyMember | Household tracking | 15 | Implemented |
| Notification | Bilingual notifications | 15 | Implemented |
| CitizenProfile | Extended citizen profile | ~10 | Future Integration |
| GovernmentScheme | Scheme catalog | ~15 | Future Integration |
| EligibilityRule | Rule definitions | ~7 | Future Integration |
| PolicySource | Policy documents | ~7 | Future Integration |
| Document | Citizen documents | ~8 | Future Integration |
| Consent | Consent records | ~7 | Future Integration |
| Application | Scheme applications | ~7 | Future Integration |
| AIRecommendation | AI response log | ~8 | Future Integration |
| AIDecision | Decision log | ~8 | Future Integration |
| AuditLog | Audit trail | ~7 | Future Integration |
| HumanReview | Review queue | ~7 | Future Integration |

---

## Migration Strategy

### Current State (Phase 1)
- 3 entities implemented (User, FamilyMember, Notification)
- Schema defined in `.jsonc` files
- No migrations needed — Base44 auto-provisions

### Phase 2 Migration Plan
1. **Create new entities** (Application, Consent, AuditLog, AIRecommendation, Document)
2. **Migrate mock data** from `indiaData.js` to entity-backed data
3. **Migrate mock data** from `mockData.js` to entity-backed data
4. **Update frontend** to read from entities instead of mock arrays
5. **Create backend functions** for entity operations that need server-side logic

### Phase 3 Migration Plan
1. **Create GovernmentScheme entity** — migrate 8 schemes from indiaData.js
2. **Create EligibilityRule entity** — migrate rules from householdCalculator.js
3. **Create CitizenProfile entity** — replace mock citizen profile
4. **Move rule engine** to server-side (backend function)
5. **Implement RAG** with PolicySource entity and vector database

### Migration Approach
- **No breaking changes** — new entities added alongside existing mock data
- **Gradual migration** — page by page, switch from mock to entity
- **Backward compatibility** — mock data kept as fallback during transition
- **Data seeding** — use `bulkCreate` to seed initial data from mock arrays

---

## Data Access Patterns

### User-Scoped Queries
All entity reads are automatically scoped to the authenticated user via `created_by_id`:

```javascript
// Returns only family members created by the authenticated user
const members = await base44.entities.FamilyMember.list();
```

### Admin Queries
Admins can access all records using service role (backend functions only):

```javascript
// In backend function
const base44 = createClientFromRequest(req);
const user = await base44.auth.me();
if (user.role !== 'admin') {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}
const allMembers = await base44.asServiceRole.entities.FamilyMember.list();
```

### Real-time Subscriptions
```javascript
useEffect(() => {
  const unsubscribe = base44.entities.Notification.subscribe((event) => {
    if (event.type === 'create') {
      // New notification received
    }
  });
  return unsubscribe;
}, []);
```

---

## Data Security

### Encryption
- **At-rest:** Base44-managed database encryption
- **In-transit:** HTTPS/TLS (Base44-managed SSL)

### Access Control
- **User-scoped:** Entities filtered by `created_by_id`
- **Admin role:** Can access all records (via service role in backend functions)
- **Authentication required:** All entity operations require valid session token

### Sensitive Data Handling
- Aadhaar numbers are **masked** in display (XXXX-XXXX-1234)
- PAN numbers are **masked** in display (ABCD****E)
- Current implementation uses mock data — no real PII stored
- Future: Field-level encryption for Aadhaar, PAN, and sensitive documents

### Data Retention
- Current: Data persists until user deletes
- Future: Define retention policies per entity type
- Future: Implement automatic deletion for expired data

---

*Last updated: July 2026*