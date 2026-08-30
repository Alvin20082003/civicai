# Rule Engine Documentation — CivicAI

> Complete documentation of the deterministic eligibility rule engine

---

## Core Principle

> **The Rule Engine decides eligibility. The LLM explains the outcome.**

The deterministic Rule Engine in `src/lib/householdCalculator.js` makes the yes/no eligibility decision using fixed scoring rules. The LLM in `src/lib/aiPrompt.js` takes the citizen's natural language question, retrieves context, and generates a human-readable explanation of why the citizen is or isn't eligible — but the LLM **cannot** override the rule engine's decision.

### Why This Separation Exists

| Without Separation | With Separation (CivicAI) |
|---|---|
| LLM might say "eligible" when policy rules say "not eligible" | Rule engine decides — LLM can't override |
| LLM might fabricate benefit amounts | Benefit amounts are hardcoded in scheme catalog |
| LLM might hallucinate eligibility criteria | Criteria are fixed scoring rules |
| No auditability — can't trace why a decision was made | Every decision traceable to a specific rule |
| No consistency — same input might give different results | Deterministic — same input always gives same result |

---

## Rule Engine Architecture

### Location
`src/lib/householdCalculator.js`

### Status: Implemented

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   RULE ENGINE ARCHITECTURE                       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  INPUT: Family Member Object                             │    │
│  │  (from FamilyMember entity — database-backed)            │    │
│  │                                                          │    │
│  │  {                                                       │    │
│  │    name, relation, age, gender, occupation,              │    │
│  │    annual_income, aadhaar_linked, student,               │    │
│  │    senior_citizen, disability, bpl_category              │    │
│  │  }                                                       │    │
│  └──────────────────────────────┬──────────────────────────┘    │
│                                 │                                 │
│                                 ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SCHEME RULES (8 deterministic functions)                │    │
│  │                                                          │    │
│  │  schemeRules = {                                         │    │
│  │    "pm-kisan": (member) => { ... },                      │    │
│  │    "nsp-engineering": (member) => { ... },               │    │
│  │    "ayushman-bharat": (member) => { ... },               │    │
│  │    "pmay": (member) => { ... },                          │    │
│  │    "old-age-pension": (member) => { ... },               │    │
│  │    "beti-bachao": (member) => { ... },                   │    │
│  │    "stand-up-india": (member) => { ... },                │    │
│  │    "skill-india": (member) => { ... }                    │    │
│  │  }                                                       │    │
│  └──────────────────────────────┬──────────────────────────┘    │
│                                 │                                 │
│                                 ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SCORING (per scheme, per member)                        │    │
│  │                                                          │    │
│  │  For each scheme rule:                                   │    │
│  │  1. Evaluate member attributes against conditions        │    │
│  │  2. Award points for each matching condition             │    │
│  │  3. Sum total score                                      │    │
│  │  4. Determine eligibility: score >= threshold?           │    │
│  │  5. Calculate match: Math.min(score + base, maxMatch)    │    │
│  │  6. Return { match, eligible, benefit }                  │    │
│  └──────────────────────────────┬──────────────────────────┘    │
│                                 │                                 │
│                                 ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  OUTPUT: Per-Member Results                              │    │
│  │                                                          │    │
│  │  calculateMemberEligibility(member) returns:             │    │
│  │  [                                                       │    │
│  │    { schemeId, schemeName, match, eligible, benefit,     │    │
│  │      category },                                         │    │
│  │    ... (8 schemes)                                       │    │
│  │  ]                                                       │    │
│  └──────────────────────────────┬──────────────────────────┘    │
│                                 │                                 │
│                                 ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  HOUSEHOLD AGGREGATION                                   │    │
│  │                                                          │    │
│  │  calculateHouseholdBenefits(members) returns:            │    │
│  │  {                                                       │    │
│  │    totalBenefit: number,                                 │    │
│  │    memberCount: number,                                  │    │
│  │    eligibleSchemeCount: number,                          │    │
│  │    categoryBreakdown: { education: number, ... },        │    │
│  │    members: [ per-member results ]                       │    │
│  │  }                                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Rule Format

### Standard Rule Function Signature

```javascript
"scheme-id": (member) => {
  // Evaluate conditions and award points
  const score =
    (condition1 ? points1 : 0) +
    (condition2 ? points2 : 0) +
    (condition3 ? points3 : 0) +
    (condition4 ? points4 : 0);

  // Calculate match percentage (with base offset)
  const match = Math.min(score + baseOffset, maxMatch);

  // Determine eligibility
  const eligible = score >= threshold;

  // Return result
  return { match, eligible, benefit };
}
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `member` | object | FamilyMember entity record |
| `score` | number | Total points from matching conditions |
| `baseOffset` | number | Offset added to score for match calculation |
| `maxMatch` | number | Maximum match percentage (typically 99) |
| `threshold` | number | Minimum score required for eligibility |
| `benefit` | number | Benefit amount in ₹ if eligible |

### Return Value

```javascript
{
  match: number,      // 0-99 — match percentage
  eligible: boolean,  // true if score >= threshold
  benefit: number     // benefit amount in ₹
}
```

---

## Rule Storage

### Current Storage
- **Location:** Hardcoded in `src/lib/householdCalculator.js`
- **Format:** JavaScript functions in a `schemeRules` object
- **Versioning:** None (no policy version tracking in rule engine)
- **Admin-editable:** No (requires code change)
- **Status:** Implemented

### Future Storage (Future Integration)
- **Location:** `EligibilityRule` entity (database)
- **Format:** JSON conditions + points + threshold
- **Versioning:** Yes (`policy_version`, `effective_date`, `expiry_date`)
- **Admin-editable:** Yes (via admin dashboard)
- **Status:** Future Integration

---

## Rule Evaluation

### Execution Flow

1. **Load family members** from database:
   ```javascript
   const members = await base44.entities.FamilyMember.list();
   ```

2. **Evaluate each member** against all 8 schemes:
   ```javascript
   const results = calculateMemberEligibility(member);
   // Returns array of { schemeId, match, eligible, benefit }
   ```

3. **Aggregate household benefits**:
   ```javascript
   const household = calculateHouseholdBenefits(members);
   // Returns { totalBenefit, members, categoryBreakdown }
   ```

### Per-Member Evaluation

```javascript
function calculateMemberEligibility(member) {
  return Object.entries(schemeRules).map(([schemeId, ruleFn]) => {
    const result = ruleFn(member);
    const scheme = getSchemeById(schemeId);
    return {
      schemeId,
      schemeName: scheme.name,
      match: result.match,
      eligible: result.eligible,
      benefit: result.benefit,
      category: scheme.category
    };
  });
}
```

### Household Aggregation

```javascript
function calculateHouseholdBenefits(members) {
  let totalBenefit = 0;
  let eligibleSchemeCount = 0;
  const categoryBreakdown = {};

  const memberResults = members.map(member => {
    const eligibility = calculateMemberEligibility(member);
    eligibility.forEach(result => {
      if (result.eligible) {
        totalBenefit += result.benefit;
        eligibleSchemeCount++;
        categoryBreakdown[result.category] =
          (categoryBreakdown[result.category] || 0) + result.benefit;
      }
    });
    return { member, eligibility };
  });

  return {
    totalBenefit,
    memberCount: members.length,
    eligibleSchemeCount,
    categoryBreakdown,
    members: memberResults
  };
}
```

### Demo Results (6-Member Family)

| Member | Eligible Schemes | Benefit |
|---|---|---|
| Father (farmer, 55) | PM-KISAN | ₹6,000 |
| Mother (homemaker, 50) | PMAY, Stand-Up India | ₹1,50,000 |
| Self (student, 24) | NSP Engineering, Skill India | ₹65,000 |
| Sister (student, 20) | Beti Bachao, NSP | ₹25,000 |
| Grandmother (senior, 68) | Old Age Pension, Ayushman Bharat | ₹5,12,000 |
| Brother (IT professional, 28) | PMAY | ₹1,50,000 |
| **Total Household** | | **₹4,85,000/year** |

---

## Eligibility Logic

### All 8 Scheme Rules

#### 1. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)

| Condition | Points |
|---|---|
| `member.occupation` includes "farmer" | +40 |
| `member.age >= 18` | +30 |
| `member.aadhaar_linked` | +20 |
| `member.annual_income < 500000` | +10 |

- **Threshold:** ≥ 60
- **Benefit:** ₹6,000/year
- **Category:** Agriculture
- **Status:** Implemented

#### 2. NSP Engineering (National Scholarship Portal — Engineering)

| Condition | Points |
|---|---|
| `member.student === true` | +40 |
| `member.age >= 18 && member.age <= 30` | +30 |
| `member.annual_income < 200000` | +25 |
| `member.aadhaar_linked` | +5 |

- **Threshold:** ≥ 60
- **Benefit:** ₹50,000/year
- **Category:** Education
- **Status:** Implemented

#### 3. Ayushman Bharat (PM-JAY)

| Condition | Points |
|---|---|
| `member.senior_citizen OR member.age >= 60` | +40 |
| `member.bpl_category OR member.annual_income < 100000` | +35 |
| `member.aadhaar_linked` | +20 |

- **Threshold:** ≥ 60
- **Benefit:** ₹5,00,000 (health cover)
- **Category:** Healthcare
- **Status:** Implemented

#### 4. PMAY (Pradhan Mantri Awas Yojana)

| Condition | Points |
|---|---|
| `member.annual_income >= 100000 && member.annual_income <= 600000` | +30 |
| `member.age >= 18` | +20 |
| `member.gender === "Female"` | +15 |
| `member.aadhaar_linked` | +10 |

- **Threshold:** ≥ 50
- **Benefit:** ₹1,50,000
- **Category:** Housing
- **Status:** Implemented

#### 5. Old Age Pension (Indira Gandhi National Old Age Pension Scheme)

| Condition | Points |
|---|---|
| `member.age >= 60` | +50 |
| `member.bpl_category OR member.annual_income < 100000` | +30 |
| `member.aadhaar_linked` | +15 |

- **Threshold:** ≥ 60
- **Benefit:** ₹12,000/year
- **Category:** Welfare
- **Status:** Implemented

#### 6. Beti Bachao Beti Padhao

| Condition | Points |
|---|---|
| `member.gender === "Female"` | +40 |
| `member.student === true` | +30 |
| `member.age >= 9 && member.age <= 25` | +20 |
| `member.annual_income < 200000` | +10 |

- **Threshold:** ≥ 60
- **Benefit:** ₹25,000
- **Category:** Welfare
- **Status:** Implemented

#### 7. Stand-Up India

| Condition | Points |
|---|---|
| `member.gender === "Female"` | +35 |
| `member.age >= 18` | +25 |
| `member.occupation` includes "business" | +20 |
| `member.aadhaar_linked` | +10 |

- **Threshold:** ≥ 50
- **Benefit:** ₹1,00,000 (loan)
- **Category:** Business
- **Status:** Implemented

#### 8. Skill India (Pradhan Mantri Kaushal Vikas Yojana)

| Condition | Points |
|---|---|
| `member.age >= 15 && member.age <= 45` | +40 |
| `member.student === true OR member.occupation includes "unemployed"` | +25 |
| `member.aadhaar_linked` | +15 |

- **Threshold:** ≥ 50
- **Benefit:** ₹15,000
- **Category:** Employment
- **Status:** Implemented

---

## Policy Versioning

### Current State
- **Status:** Not implemented in rule engine
- Policy versions exist only in the scheme catalog (`indiaData.js`) as strings
- Rules are not versioned — no `effective_date` or `expiry_date`
- No rule update workflow

### Future State (Future Integration)
- Create `EligibilityRule` entity with:
  - `policy_version`: string
  - `effective_date`: datetime
  - `expiry_date`: datetime
- Version rules when policies change
- Keep old versions for historical audit
- Admin can activate/deactivate rule versions

---

## Priority Rules

### Current State
- **Status:** Not implemented
- All 8 rules have equal priority
- No rule precedence system

### Future State (Future Integration)
- Assign priority levels to rules
- Higher-priority rules evaluated first
- If citizen qualifies for multiple mutually exclusive schemes, highest priority wins
- Example: If citizen qualifies for both PMAY and Stand-Up India, and they're mutually exclusive, priority determines which applies

---

## Conflict Resolution

### Current State
- **Status:** Not implemented
- No conflict detection between rules
- A member can be eligible for multiple schemes without conflict checking

### Future State (Future Integration)
- Detect when schemes are mutually exclusive
- Example: Can't receive both Old Age Pension and Indira Gandhi Widow Pension
- When conflict detected:
  1. Apply priority rules
  2. Notify citizen of alternative
  3. Log conflict in audit trail
  4. Flag for human review if needed

---

## Rule Examples

### Example 1: PM-KISAN — Eligible Farmer

**Input Member:**
```json
{
  "name": "Rajesh Kumar",
  "age": 55,
  "occupation": "Farmer",
  "annual_income": 180000,
  "aadhaar_linked": true,
  "student": false,
  "senior_citizen": false,
  "bpl_category": false
}
```

**Evaluation:**
| Condition | Result | Points |
|---|---|---|
| occupation includes "farmer" | ✅ true | +40 |
| age >= 18 | ✅ true (55) | +30 |
| aadhaar_linked | ✅ true | +20 |
| income < 500000 | ✅ true (180000) | +10 |

**Score:** 100
**Threshold:** 60
**Eligible:** ✅ true (100 ≥ 60)
**Match:** 99 (Math.min(100 + 10, 99) → capped at 99)
**Benefit:** ₹6,000/year

### Example 2: NSP Engineering — Eligible Student

**Input Member:**
```json
{
  "name": "Arjun Kumar",
  "age": 24,
  "occupation": "Engineering Student",
  "annual_income": 180000,
  "aadhaar_linked": true,
  "student": true
}
```

**Evaluation:**
| Condition | Result | Points |
|---|---|---|
| student === true | ✅ true | +40 |
| age 18-30 | ✅ true (24) | +30 |
| income < 200000 | ✅ true (180000) | +25 |
| aadhaar_linked | ✅ true | +5 |

**Score:** 100
**Threshold:** 60
**Eligible:** ✅ true
**Match:** 99
**Benefit:** ₹50,000/year

### Example 3: PM-KISAN — Not Eligible (Non-Farmer)

**Input Member:**
```json
{
  "name": "Arjun Kumar",
  "age": 24,
  "occupation": "Engineering Student",
  "annual_income": 180000,
  "aadhaar_linked": true,
  "student": true
}
```

**Evaluation:**
| Condition | Result | Points |
|---|---|---|
| occupation includes "farmer" | ❌ false | +0 |
| age >= 18 | ✅ true | +30 |
| aadhaar_linked | ✅ true | +20 |
| income < 500000 | ✅ true | +10 |

**Score:** 60
**Threshold:** 60
**Eligible:** ✅ true (60 ≥ 60 — barely meets threshold)
**Match:** 70 (Math.min(60 + 10, 99))

*Note: In this edge case, the student barely meets the PM-KISAN threshold despite not being a farmer. In production, the rule would likely require the farmer condition as mandatory, not just points-based.*

### Example 4: Old Age Pension — Not Eligible (Young)

**Input Member:**
```json
{
  "name": "Priya",
  "age": 20,
  "occupation": "Student",
  "annual_income": 0,
  "aadhaar_linked": true,
  "bpl_category": true
}
```

**Evaluation:**
| Condition | Result | Points |
|---|---|---|
| age >= 60 | ❌ false (20) | +0 |
| BPL or income < 1L | ✅ true | +30 |
| aadhaar_linked | ✅ true | +15 |

**Score:** 45
**Threshold:** 60
**Eligible:** ❌ false (45 < 60)
**Match:** 55 (Math.min(45 + 10, 99))
**Benefit:** ₹0

### Missing Data Handling

If a member attribute is `undefined` or `null`, the condition evaluates to `false`:

```json
{
  "name": "Test User",
  "age": null,  // null → age >= 18 is false → +0 points
  "occupation": null,  // null → includes "farmer" is false → +0 points
  "aadhaar_linked": undefined  // undefined → +0 points
}
```

The member is still evaluated — they may be "not eligible" if the score is below threshold.

---

## How AI Interacts with Rule Engine

### The Separation

```
┌─────────────────────────┐     ┌─────────────────────────┐
│     RULE ENGINE          │     │          LLM             │
│                           │     │                           │
│  DECIDES:                 │     │  EXPLAINS:                │
│  • Eligible? (yes/no)    │     │  • Why eligible/not       │
│  • Match % (0-99)        │     │  • How to apply           │
│  • Benefit amount (₹)    │     │  • What documents needed  │
│                           │     │  • In what language       │
│  Characteristics:         │     │  • Conversational tone    │
│  • Deterministic          │     │                           │
│  • No hallucination       │     │  Characteristics:         │
│  • Fixed rules            │     │  • Probabilistic          │
│  • Same input → same out  │     │  • Natural language       │
│  • Client-side JavaScript │     │  • Context-aware          │
│  • No AI involved         │     │  • May hallucinate text   │
│                           │     │                           │
│  Status: Implemented      │     │  Status: Implemented      │
└─────────────────────────┘     └─────────────────────────┘
```

### Interaction Points

| Point | How They Interact | Status |
|---|---|---|
| LLM references rule_matched | LLM includes `rule_matched` string in JSON response | Implemented |
| LLM cannot override eligibility | LLM cannot change the rule engine's decision | Implemented |
| LLM explains rule engine result | LLM takes rule result and explains in citizen's language | Implemented |
| Rule engine runs independently | Rule engine evaluates family members on Family page | Implemented |
| LLM runs independently | LLM processes queries on AI Chat page | Implemented |
| Both results shown | Rule engine match on Family page; LLM confidence on Chat page | Implemented |

### What the LLM Can Do
- ✅ Reference which rule matched (`rule_matched` field)
- ✅ Explain why the rule matched (`why_recommended` field)
- ✅ Suggest alternative schemes if not eligible
- ✅ Provide application guidance in citizen's language
- ✅ Score its own confidence in the recommendation

### What the LLM Cannot Do
- ❌ Change the eligibility decision (rule engine decides)
- ❌ Modify the match score (rule engine calculates)
- ❌ Change the benefit amount (hardcoded in catalog)
- ❌ Approve an application (human/portal does this)
- ❌ Create new rules (admin does this in future)

---

## Output Classification

| Classification | Condition | UI Color | Meaning |
|---|---|---|---|
| **Eligible** | `score >= threshold` | Green (success) | Citizen qualifies for this scheme |
| **Potentially Eligible** | `match >= 80` but `score < threshold` | Blue (primary) | Close to qualifying — may qualify with additional info |
| **Not Eligible** | `match < 80` and `score < threshold` | Gray (muted) | Does not qualify |
| **Human Review Required** | LLM flags `humanReview: true` or low confidence | Orange (warning) | High-stakes or uncertain — needs human officer |

---

## Adding New Rules

### To add a new scheme rule:

1. **Add scheme to catalog** in `src/lib/indiaData.js`:
```javascript
{
  id: "new-scheme",
  name: "New Government Scheme",
  category: "welfare",
  benefit: "₹10,000/year",
  eligibility: "Description of eligibility criteria",
  requiredDocuments: ["Aadhaar", "Income Certificate"],
  applicationSteps: ["Step 1", "Step 2"],
  portal: "New Scheme Portal",
  portalUrl: "https://new-scheme.gov.in",
  policyVersion: "NEW-SCHEME-2025-v1.0",
  processingTime: "30 days",
  office: "District Office"
}
```

2. **Add rule function** in `src/lib/householdCalculator.js`:
```javascript
"new-scheme": (member) => {
  const score =
    (member.age >= 18 ? 30 : 0) +
    (member.annual_income < 500000 ? 40 : 0) +
    (member.aadhaar_linked ? 20 : 0);
  return {
    match: Math.min(score + 10, 99),
    eligible: score >= 60,
    benefit: 10000
  };
}
```

3. **Test the rule** by adding a family member and viewing the Family page

### Rule Design Guidelines

- **Threshold:** Set so that all conditions matching = eligible (score = 100 > threshold)
- **Points:** Weight most important condition highest (e.g., farmer for PM-KISAN = 40)
- **Base offset:** Small offset (5-15) so partial matches show meaningful percentages
- **Max match:** Cap at 99 (never 100% — leave room for uncertainty)
- **Benefit:** Use actual government benefit amount
- **Conditions:** Base on actual policy eligibility criteria

---

## Limitations

| Limitation | Impact | Future Improvement |
|---|---|---|
| Simplified scoring | Not full policy text | Full policy rule definitions |
| No policy versioning | Rules can't be versioned | EligibilityRule entity |
| No rule update workflow | Rules require code change | Admin dashboard |
| No rule conflict detection | Mutually exclusive schemes not detected | Conflict detection |
| Client-side execution | Rules visible in source code | Server-side execution |
| No audit logging | Evaluations not logged | AuditLog entity |
| No rule testing framework | Can't automatically test rules | Unit tests for rules |
| Edge cases | Some members may barely meet thresholds | Mandatory conditions + points |

---

*Last updated: July 2026*