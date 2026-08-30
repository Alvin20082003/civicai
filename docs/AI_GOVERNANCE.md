# AI Governance Documentation — CivicAI

> Responsible AI principles, NIST AI RMF alignment, and governance framework

---

## Responsible AI Principles

CivicAI is built on the following responsible AI principles. Every principle has an implementation in the codebase, though some are currently simulated.

### Core Principles

| Principle | Description | Implementation | Status |
|---|---|---|---|
| **Transparency** | Citizens can understand why an AI decision was made | Every AI response shows why_recommended, rule_matched, policy_version, confidence_score | Implemented (in AI chat) |
| **Accountability** | Every AI decision is traceable to a specific rule and can be reviewed | audit_log_id in every response; humanReview flag for high-stakes cases | Prototype / Simulated |
| **Fairness** | AI treats all citizens equally; no discrimination | Deterministic rule engine applies same rules to all citizens; bias detection metric | Prototype / Simulated (bias detection is mock) |
| **Privacy by Design** | Citizen data is protected with consent and minimization | Consent management, data minimization, user-scoped data access | Prototype / Simulated (consent is local state) |
| **Security by Design** | AI system is protected from unauthorized access | Authentication, route protection, encryption, user-scoped access | Implemented |
| **Explainability** | AI decisions can be explained in human-understandable terms | Structured JSON with eligibility_reasons, why_recommended, ai_guidance | Implemented |
| **Human-in-the-Loop** | High-stakes decisions are reviewed by human officers | humanReview flag; human_review notification template; risk escalation | Prototype / Simulated (no actual review workflow) |
| **Auditability** | Every AI decision is logged and can be audited | Decision log page; audit_log_id in responses | Prototype / Simulated (mock data) |

---

## NIST AI Risk Management Framework Mapping

CivicAI is **designed with reference to** the NIST AI Risk Management Framework (AI RMF). CivicAI is **not certified by** NIST.

### NIST AI RMF Overview

The NIST AI RMF consists of four functions:

| Function | Purpose | CivicAI Alignment |
|---|---|---|
| **GOVERN** | Policies, processes, accountability structures | Governance Center, responsible AI principles, human-in-the-loop |
| **MAP** | Context, risk identification | Risk Dashboard, bias detection, policy conflict detection |
| **MEASURE** | Testing, evaluation, monitoring | Governance metrics, confidence scoring, decision log |
| **MANAGE** | Risk treatment, response | Human escalation, auto-escalation, risk mitigation |

### GOVERN Function

**Purpose:** Establish policies, processes, and accountability structures for AI.

| CivicAI Feature | NIST Alignment | Status |
|---|---|---|
| Governance Center page | Leadership commitment to responsible AI | Prototype / Simulated |
| Responsible AI Principles | Organizational policies (Transparency, Accountability, Fairness, Privacy) | Implemented (principles defined) |
| Human-in-the-loop review | Human oversight and accountability | Prototype / Simulated |
| Audit log (simulated) | Documentation and record-keeping | Prototype / Simulated |
| Consent management (simulated) | Citizen rights and consent | Prototype / Simulated |
| Rule Engine + LLM separation | Accountability — rule engine decides, LLM explains | Implemented |
| Policy version citation | Traceability to specific policy versions | Implemented (in AI response) |

### MAP Function

**Purpose:** Identify context, risks, and potential impacts.

| CivicAI Feature | NIST Alignment | Status |
|---|---|---|
| Risk Dashboard | Risk identification and classification | Prototype / Simulated |
| AI risk level monitoring (Low/Medium/High) | Risk assessment | Prototype / Simulated |
| Policy conflict detection (simulated) | Risk from policy changes | Prototype / Simulated |
| Fraud alert detection (simulated) | Risk from malicious activity | Prototype / Simulated |
| Bias detection (simulated) | Fairness risk identification | Prototype / Simulated |
| Document rejection trends (simulated) | Quality risk monitoring | Prototype / Simulated |

### MEASURE Function

**Purpose:** Test, evaluate, and monitor AI system performance.

| CivicAI Feature | NIST Alignment | Status |
|---|---|---|
| Governance metrics (Transparency 98%, Fairness 97%, etc.) | Performance measurement | Prototype / Simulated (static values) |
| Confidence scoring (0-100 per recommendation) | Model performance tracking | Implemented |
| Decision log (simulated) | Decision audit trail | Prototype / Simulated |
| Document rejection trends (simulated) | Quality monitoring | Prototype / Simulated |
| Application bottleneck tracking (simulated) | Performance monitoring | Prototype / Simulated |
| Rule engine match scores | Deterministic performance measurement | Implemented |

### MANAGE Function

**Purpose:** Treat and respond to identified risks.

| CivicAI Feature | NIST Alignment | Status |
|---|---|---|
| Human escalation for high-stakes decisions | Risk mitigation | Prototype / Simulated |
| Human review queue (simulated) | Human oversight | Prototype / Simulated |
| Automatic escalation for low confidence | Risk response | Implemented (humanReview flag) |
| Risk mitigation checklist | Risk treatment plan | Prototype / Simulated |
| Consent revocation (simulated) | Citizen rights enforcement | Prototype / Simulated |
| Rule engine separation | Hallucination prevention | Implemented |

---

## Transparency

### Implementation

| Feature | How It Works | Status |
|---|---|---|
| `why_recommended` field | LLM explains why a scheme matches the citizen | Implemented |
| `eligibility_reasons` array | Specific reasons for eligibility (e.g., "Student: true", "Income < ₹2L") | Implemented |
| `rule_matched` string | Identifies which deterministic rule was applied | Implemented |
| `policy_version` | Cites which policy version was referenced | Implemented |
| `government_url` | Links to official government portal | Implemented |
| `source_verified` flag | LLM's confidence in the URL | Implemented |
| `confidence_score` | Overall confidence (0-100) | Implemented |
| `audit_log_id` | Traceable decision ID | Implemented (LLM-generated, not database-backed) |
| Trust badges | UI badges showing responsible AI features | Implemented |
| Disclaimer | "AI-generated recommendations. Please verify with official sources." | Implemented |

### Transparency Page
- **Explainable AI page:** `src/pages/ExplainableAI.jsx` — Prototype / Simulated (3 hardcoded explanations)
- **Decision Log page:** `src/pages/DecisionLog.jsx` — Prototype / Simulated (7 mock entries)

---

## Explainability

### Implementation

Every AI response includes structured explainability fields:

```json
{
  "recommended_schemes": [
    {
      "scheme_name": "National Scholarship Portal - Engineering",
      "eligibility_status": "Eligible",
      "confidence_score": 97,
      "why_recommended": "You qualify as a student with family income below ₹2 lakh threshold",
      "eligibility_reasons": [
        "Student status: true",
        "Age 18-30: true (24)",
        "Annual income ₹1.8L < ₹2L threshold",
        "Aadhaar linked: true"
      ],
      "rule_matched": "nsp-engineering",
      "policy_version": "NSP-EDU-2025-v3.0",
      "government_url": "https://scholarships.gov.in",
      "source_verified": true,
      "humanReview": false
    }
  ]
}
```

### What Makes CivicAI Explainable

1. **Rule Matched** — Citizens can see exactly which rule was evaluated
2. **Policy Version** — Citizens can verify against the specific policy version
3. **Government URL** — Citizens can verify on the official portal
4. **Confidence Score** — Citizens know how confident the AI is
5. **Eligibility Reasons** — Citizens see which specific conditions matched
6. **Source Verified** — Citizens know if the AI is confident in its sources
7. **Human Review** — Citizens know if a human should review the decision

### Status: Implemented

---

## Fairness

### Implementation

| Feature | How It Promotes Fairness | Status |
|---|---|---|
| Deterministic rule engine | Same rules applied to all citizens — no bias in eligibility decisions | Implemented |
| Equal scoring | All citizens evaluated by the same point system | Implemented |
| No demographic bias in rules | Rules based on objective criteria (income, age, occupation) — not caste, religion, etc. | Implemented |
| Bias detection metric | Governance Center shows "Bias Detected: None" | Prototype / Simulated (static value) |
| Multilingual support | All citizens can access services in their language regardless of English proficiency | Implemented |

### Fairness Limitations

- Bias detection is simulated (static value, not computed from real data)
- No real-time bias monitoring
- No demographic disparity analysis
- Rule engine criteria may inadvertently disadvantage certain groups (e.g., Aadhaar requirement may exclude marginalized citizens)

### Future Fairness Improvements

| Improvement | Description | Phase |
|---|---|---|
| Real bias detection | Compute bias metrics from actual decision data | Phase 3 |
| Demographic disparity analysis | Analyze outcomes across demographic groups | Phase 3 |
| Fairness testing | Automated tests for bias in rule engine | Phase 3 |
| Community feedback | Collect citizen feedback on perceived fairness | Phase 4 |

---

## Bias Mitigation

### Current State: Prototype / Simulated

CivicAI's rule engine is designed to be objective — eligibility is based on income, age, occupation, and government-defined criteria, not on caste, religion, gender (except where gender-specific schemes like Beti Bachao exist), or other protected characteristics.

### Bias Mitigation Techniques

| Technique | Implementation | Status |
|---|---|---|
| Objective criteria | Rules based on income, age, occupation — not demographic identity | Implemented |
| Deterministic evaluation | Same input always produces same output — no random variation | Implemented |
| Rule engine separation | AI cannot introduce bias into eligibility decisions | Implemented |
| Bias detection metric | Governance Center monitors for bias | Prototype / Simulated |
| Diverse scheme coverage | Schemes for farmers, students, women, seniors, differently-abled | Implemented |

### Potential Bias Risks

| Risk | Mitigation | Status |
|---|---|---|
| Aadhaar requirement may exclude marginalized citizens | Acknowledged; alternative verification in future | Future Integration |
| Digital literacy barrier | Voice-first design; multilingual support | Implemented |
| Internet access barrier | Future: offline mode, USSD access | Future Integration |
| Income threshold may not account for informal economy | Acknowledged; future: alternative income verification | Future Integration |

---

## Privacy by Design

### Implementation

| Principle | Implementation | Status |
|---|---|---|
| **Data Minimization** | Only necessary data collected (name, age, income, flags) | Implemented |
| **Purpose Specification** | Each data type has a specified purpose (consent page) | Prototype / Simulated |
| **Use Limitation** | Data only used for specified purpose | Prototype / Simulated |
| **Consent** | Citizens can grant/revoke access per data type | Prototype / Simulated (local state) |
| **User-Scoped Access** | Citizens only see their own data | Implemented |
| **Transparency** | Citizens can see what data is stored (family page, documents page) | Implemented |
| **Data Retention** | Data persists until user deletes | Partially Implemented |

### Privacy Controls

| Control | Implementation | Status |
|---|---|---|
| User-scoped entity reads | `created_by_id` filtering on all queries | Implemented |
| Consent management UI | Consent page with per-data-type toggles | Prototype / Simulated |
| Data display controls | Masked Aadhaar (XXXX-XXXX-7842), masked PAN (ABCD****E) | Implemented (mock data) |
| User data deletion | User can delete family members | Partially Implemented |
| Account deletion | Not available to users (admin only) | Future Integration |
| Data export | Not available | Future Integration |

### DPDP Act Alignment

CivicAI references the Digital Personal Data Protection Act (DPDP Act, 2023) but is **not certified** as compliant.

| DPDP Requirement | CivicAI Status | Phase |
|---|---|---|
| Consent for data processing | Prototype / Simulated (local state) | Phase 2 |
| Right to access | Partially (family page shows data) | Phase 2 |
| Right to correction | Not available | Phase 2 |
| Right to erasure | Partially (family member deletion) | Phase 2 |
| Data breach notification | Not implemented | Phase 3 |
| Data Protection Officer | Not appointed | Phase 3 |
| Privacy impact assessment | Not conducted | Phase 3 |

---

## Security by Design

### Implementation

| Control | Status | Detail |
|---|---|---|
| Authentication | Implemented | Email/password, Google OAuth, OTP |
| Route protection | Implemented | ProtectedRoute guards |
| Session management | Implemented | Base44 tokens |
| Encryption in transit | Implemented | HTTPS |
| Encryption at rest | Implemented | Base44 database encryption |
| User-scoped data | Implemented | `created_by_id` filtering |
| Admin role | Implemented | Role-based access |
| Secrets management | Implemented | Dashboard + Deno.env |

See [SECURITY.md](./SECURITY.md) for complete security documentation.

---

## Human-in-the-Loop

### Implementation

| Feature | How It Works | Status |
|---|---|---|
| `humanReview` flag | LLM sets to `true` for high-stakes or low-confidence cases | Implemented |
| Low confidence escalation | LLM instructed to flag when `confidence_score < 80` | Implemented |
| High-stakes scheme flagging | LLM instructed to flag housing, loan, pension schemes | Implemented |
| `human_review` notification template | Backend function can create human review notification | Implemented |
| Risk dashboard | Shows "Human Escalation" queue | Prototype / Simulated |

### When Human Review Is Triggered

| Trigger | Implementation | Status |
|---|---|---|
| LLM confidence < 80 | Prompt instruction → `humanReview: true` | Implemented |
| High-stakes schemes (housing, loans, pensions) | Prompt instruction → `humanReview: true` | Implemented |
| Source not verified | `source_verified: false` flag | Implemented |
| Manual escalation | Risk dashboard "resolve" button | Prototype / Simulated |

### Human Review Workflow (Future)

```
AI Decision (humanReview: true)
→ Notification created (human_review template)
→ Notification appears in citizen's notification center
→ Notification appears in officer's review queue (Future)
→ Officer reviews decision
→ Officer approves or rejects
→ Citizen notified of outcome
→ Decision logged in audit trail
```

### Current Limitations
- No actual review queue exists
- No officer dashboard
- No review workflow (approve/reject)
- `humanReview` flag is informational only — no automatic routing to human officer

**Status: Prototype / Simulated**

---

## Auditability

### Implementation

| Feature | How It Works | Status |
|---|---|---|
| `audit_log_id` in AI responses | Every AI response includes a traceable ID | Implemented (LLM-generated) |
| Decision Log page | Displays audit trail of AI decisions | Prototype / Simulated (mock data) |
| Rule matched | Every decision shows which rule was applied | Implemented |
| Policy version cited | Every decision references specific policy version | Implemented |
| Confidence score logged | Every decision includes confidence | Implemented |
| Timestamp | Decision log includes time | Prototype / Simulated |

### Audit Trail Components

| Component | What It Records | Status |
|---|---|---|
| AI decisions | Query, response, confidence, rule matched, policy | Prototype / Simulated (not persisted) |
| Entity operations | Create/update/delete on entities | Not logged |
| Authentication events | Login, logout, failed attempts | Not logged |
| Consent changes | Grant, revoke | Not logged (local state only) |
| Admin actions | User management, configuration | Not logged |

### Future Audit Logging

| Feature | Description | Phase |
|---|---|---|
| AuditLog entity | Persist every operation and AI call | Phase 2 |
| Searchable audit trail | Search by user, action, entity, date | Phase 2 |
| Audit log export | Export for compliance reviews | Phase 3 |
| Real-time audit monitoring | Alert on suspicious activity | Phase 3 |
| Immutable audit log | Tamper-proof audit trail | Phase 3 |

**Status: Future Integration**

---

## Risk Management

### Risk Dashboard

**Location:** `src/pages/Risk.jsx`

**Status:** Prototype / Simulated (mock data)

### Risk Levels

| Level | Meaning | UI Color | Status |
|---|---|---|---|
| Low | Minimal risk — AI operating normally | Green | Prototype / Simulated |
| Medium | Moderate risk — requires monitoring | Yellow | Prototype / Simulated |
| High | Significant risk — requires intervention | Red | Prototype / Simulated |

### Risk Categories

| Category | Description | Status |
|---|---|---|
| Document issues | Expired, missing, or unverified documents | Prototype / Simulated |
| Policy conflicts | Conflicting policy versions or rules | Prototype / Simulated |
| Fraud alerts | Suspicious activity detected | Prototype / Simulated |
| AI hallucination detected | AI response doesn't match rule engine | Prototype / Simulated |
| Human escalation needed | High-stakes decision requires human review | Prototype / Simulated |
| System errors | Backend function failures | Prototype / Simulated |

### Risk Mitigation Checklist

| Mitigation | Status |
|---|---|
| Rule engine separation prevents AI hallucination | Implemented |
| Human review for high-stakes decisions | Prototype / Simulated |
| Source verification flag | Implemented |
| Confidence score monitoring | Implemented |
| Policy version citation | Implemented |
| Audit trail (simulated) | Prototype / Simulated |
| Rate limiting | Future Integration |
| Input sanitization | Future Integration |

---

## Model Monitoring

### Current State: Prototype / Simulated

Governance metrics are static mock values. No real monitoring exists.

### Future Monitoring

| Metric | Description | Phase |
|---|---|---|
| AI accuracy | Track how often AI recommendations are correct | Phase 3 |
| Hallucination rate | Track instances of AI fabricating information | Phase 3 |
| Confidence calibration | Compare AI confidence to actual accuracy | Phase 3 |
| Response time | Track LLM response latency | Phase 2 |
| Error rate | Track failed AI calls | Phase 2 |
| Language detection accuracy | Track correct language identification | Phase 3 |
| Rule engine coverage | Track how many schemes have rules | Phase 2 |
| Bias metrics | Track demographic disparities in outcomes | Phase 3 |
| Model drift | Track changes in AI performance over time | Phase 3 |

---

## Incident Handling

### Current State: Not Implemented

No AI incident handling process exists.

### Future Incident Handling

| Step | Action | Phase |
|---|---|---|
| 1. Detect | Automated monitoring detects AI anomaly | Phase 3 |
| 2. Classify | Determine severity (low, medium, high) | Phase 3 |
| 3. Contain | Disable affected AI feature | Phase 3 |
| 4. Investigate | Determine root cause | Phase 3 |
| 5. Remediate | Fix the issue | Phase 3 |
| 6. Notify | Notify affected citizens (if required) | Phase 3 |
| 7. Document | Log incident in audit trail | Phase 3 |
| 8. Review | Post-incident review and improvements | Phase 3 |

### Types of AI Incidents

| Incident | Description | Response |
|---|---|---|
| Hallucination | AI fabricates scheme details | Disable AI; review rule engine; fix prompt |
| Bias detected | AI disadvantages certain groups | Review rules; adjust scoring; audit |
| Privacy breach | Unauthorized data access | Notify affected users; review access controls |
| Eligibility error | AI says eligible but citizen isn't | Verify rule engine; review edge cases |
| System outage | AI service unavailable | Fallback to rule engine only; notify users |
| Slow response | AI timeout exceeds 45s | Optimize prompt; consider streaming |

**Status: Future Integration**

---

## Data Governance

### Current State

| Aspect | Status | Notes |
|---|---|---|
| Data ownership | Implemented | Each user owns their data (created_by_id) |
| Data classification | Partially | PII identified (email, name, income) but not formally classified |
| Data lineage | Not implemented | No tracking of data origin and transformations |
| Data quality | Not monitored | No data quality metrics |
| Data stewardship | Not assigned | No data steward role |
| Data lifecycle | Partially | Data persists until deleted; no retention policy |

### Future Data Governance

| Feature | Description | Phase |
|---|---|---|
| Data classification | Formal classification (public, internal, confidential, restricted) | Phase 2 |
| Data lineage | Track data origin and transformations | Phase 3 |
| Data quality metrics | Monitor completeness, accuracy, consistency | Phase 3 |
| Data steward role | Assign data steward responsibilities | Phase 3 |
| Data retention policy | Define retention periods per data type | Phase 2 |
| Data subject rights | Implement access, correction, erasure | Phase 2 |

---

## Policy Governance

### Current State

| Aspect | Status | Notes |
|---|---|---|
| Policy versioning | Implemented (in scheme catalog) | Each scheme has `policyVersion` string |
| Policy citation | Implemented | AI responses cite `policy_version` |
| Policy updates | Not automated | Manual update of indiaData.js |
| Policy conflict detection | Prototype / Simulated | Risk dashboard shows conflicts (mock) |
| Policy change impact analysis | Prototype / Simulated | Policy Intelligence page (mock data) |

### Future Policy Governance

| Feature | Description | Phase |
|---|---|---|
| PolicySource entity | Database-backed policy documents | Phase 3 |
| Policy change feed | Monitor government policy changes | Phase 3 |
| Automated impact analysis | Analyze impact of policy changes on citizens | Phase 3 |
| Policy version management | Track and manage policy versions | Phase 3 |
| Policy conflict resolution | Detect and resolve conflicting policies | Phase 3 |

---

## How CivicAI Aligns with Responsible AI Principles

### Summary

| Principle | Alignment | Status |
|---|---|---|
| **Transparency** | Every AI decision shows why, rule matched, policy version, confidence, and official source | Implemented (in AI chat) |
| **Accountability** | Audit log ID, human review flag, rule engine separation | Prototype / Simulated |
| **Fairness** | Deterministic rule engine, equal scoring, bias detection metric | Prototype / Simulated (bias is mock) |
| **Privacy by Design** | Consent management, data minimization, user-scoped access | Prototype / Simulated (consent is local state) |
| **Security by Design** | Authentication, encryption, route protection, user-scoped data | Implemented |
| **Explainability** | Structured JSON with all reasoning fields | Implemented |
| **Human-in-the-Loop** | humanReview flag, notification template, risk escalation | Prototype / Simulated |
| **Auditability** | Decision log, audit log ID, rule matched, policy version | Prototype / Simulated |

### Key Innovation: Rule Engine + LLM Hybrid

The most important responsible AI feature in CivicAI is the **separation of decision and explanation**:

> **The Rule Engine decides eligibility. The LLM explains the outcome.**

This means:
- The AI **cannot** make a wrong eligibility decision (rule engine decides)
- The AI **cannot** fabricate benefit amounts (hardcoded in catalog)
- The AI **can only** explain the rule engine's decision in the citizen's language
- Every decision is **traceable** to a specific deterministic rule
- Every decision is **reproducible** (same input → same output)
- Every decision is **auditable** (rule matched, policy version, confidence)

### Important Disclaimer

> CivicAI is **designed with reference to** the NIST AI Risk Management Framework and responsible AI principles. It is **not certified by** NIST, ISO, or any government standards body. All governance metrics displayed in the UI are simulated values for demonstration purposes. No government authorization or certification has been obtained.

---

*Last updated: July 2026*