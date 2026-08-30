# Security Documentation — CivicAI

> Complete security, privacy, and data protection documentation

---

## Security Overview

CivicAI's security is built on the Base44 platform's managed infrastructure, supplemented by application-level controls. This document covers all implemented security controls, simulated controls, and future security requirements.

### Security Principles

| Principle | Implementation | Status |
|---|---|---|
| **Authentication** | Every user must authenticate before accessing protected routes | Implemented |
| **Authorization** | User-scoped data access; admin role for management | Implemented |
| **Encryption** | HTTPS in transit; at-rest encryption via Base44 | Implemented |
| **Data Minimization** | Only necessary data collected | Prototype / Simulated |
| **Consent** | Purpose-bound, time-limited, revocable access | Prototype / Simulated |
| **Audit Trail** | Every AI decision logged | Prototype / Simulated |
| **Human Oversight** | High-stakes decisions escalate to humans | Prototype / Simulated |

---

## Authentication

### Implementation

| Aspect | Detail | Status |
|---|---|---|
| **Provider** | Base44 Auth (platform-managed) | Implemented |
| **Methods** | Email/Password, Google OAuth | Implemented |
| **OTP Verification** | Required after registration (register → OTP → verify → token) | Implemented |
| **Password Reset** | Email-based reset flow (request → email → reset token → new password) | Implemented |
| **Session Tokens** | Base44-managed tokens | Implemented |
| **Cookie Security** | HTTP-only cookies | Implemented |
| **Token Expiry** | Automatic expiry handled by Base44 | Implemented |

### Authentication Flow

```
Registration:
1. User enters email + password
2. base44.auth.register({ email, password })
3. User created but UNVERIFIED
4. OTP sent to email
5. User enters OTP code
6. base44.auth.verifyOtp({ email, otpCode })
7. Returns access_token
8. base44.auth.setToken(token)
9. Hard redirect to /

Login (Email/Password):
1. User enters email + password
2. base44.auth.loginViaEmailPassword(email, password)
3. Token set
4. Hard redirect to /

Login (Google OAuth):
1. User clicks "Sign in with Google"
2. base44.auth.loginWithProvider('google', fromUrl)
3. Redirect to Google OAuth
4. Redirect back to app with token
5. Token set automatically
```

### Status: Implemented

---

## Authorization

### Role-Based Access Control (RBAC)

| Role | Permissions | Status |
|---|---|---|
| **user** (default) | Read/update own data; manage own family members; use AI chat; view own notifications | Implemented |
| **admin** | All user permissions + list/update/delete other users; invite users | Implemented |

### User-Scoped Data Access

All entity operations are automatically scoped to the authenticated user:

```javascript
// Returns only family members where created_by_id === current user ID
const members = await base44.entities.FamilyMember.list();

// Returns only notifications where created_by_id === current user ID
const notifications = await base44.entities.Notification.list();
```

### Admin Operations

Admin operations use the service role (backend functions only):

```javascript
// In backend function
const base44 = createClientFromRequest(req);
const user = await base44.auth.me();
if (user.role !== 'admin') {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}
// Use service role for admin operations
const allRecords = await base44.asServiceRole.entities.FamilyMember.list();
```

### Status: Implemented

---

## Encryption

### Encryption in Transit

| Aspect | Detail | Status |
|---|---|---|
| **HTTPS/TLS** | Base44-managed SSL certificate (Let's Encrypt) | Implemented |
| **SSL Status** | Pending domain verification for civicai.online | Pending |
| **HSTS** | Base44-managed | Implemented |
| **Certificate Renewal** | Automatic (Base44-managed) | Implemented |

### Encryption at Rest

| Aspect | Detail | Status |
|---|---|---|
| **Database** | Base44-managed at-rest encryption | Implemented |
| **File Storage** | Base44-managed (if UploadFile used) | Available |

### Field-Level Encryption (Future)

| Data | Current | Future |
|---|---|---|
| Aadhaar number | Masked (XXXX-XXXX-7842) in mock data | Encrypt at field level; store only masked version |
| PAN number | Masked (ABCD****E) in mock data | Encrypt at field level |
| Income | Plain in database | Encrypt sensitive financial data |
| Documents | Mock data | Encrypt file references |

**Status: Future Integration**

---

## Secrets Management

### Environment Variables

| Variable | Purpose | Status |
|---|---|---|
| `BASE44_APP_ID` | Base44 application identifier | Pre-populated |
| Custom secrets | API keys for integrations | Configurable via dashboard |

### Secret Storage
- **Location:** Base44 Dashboard → Settings → Environment Variables
- **Access:** Via `Deno.env.get("SECRET_NAME")` in backend functions
- **Security:** Secrets are never exposed to frontend code
- **Status:** Implemented

### Future Secrets

| Secret | Purpose | Phase |
|---|---|---|
| `AADHAAR_API_KEY` | UIDA e-KYC API | Phase 3 |
| `DIGILOCKER_CLIENT_ID` | DigiLocker API | Phase 2-3 |
| `DIGILOCKER_CLIENT_SECRET` | DigiLocker API | Phase 2-3 |
| `VECTOR_DB_URL` | Vector database for RAG | Phase 3 |
| `VECTOR_DB_API_KEY` | Vector database authentication | Phase 3 |

### Important Notes
- Never hardcode secrets in source code
- Never expose secrets to frontend code
- Use `Deno.env.get()` in backend functions only
- The following secrets do NOT exist and should never be requested:
  - `BASE44_SERVICE_TOKEN`
  - `BASE44_SERVICE_ROLE_KEY`
- Auth comes from `createClientFromRequest(req)`, service-role from `base44.asServiceRole`

---

## Data Protection

### Sensitive Data Classification

| Data Type | Sensitivity | Current Handling | Future Handling |
|---|---|---|---|
| Email | PII | Stored in User entity | Same + consent |
| Full name | PII | Stored in FamilyMember entity | Same + consent |
| Age | PII | Stored in FamilyMember entity | Same |
| Annual income | Sensitive PII | Stored in FamilyMember entity | Encrypt at field level |
| Aadhaar status | Sensitive PII | Boolean flag (not number) | Same |
| Aadhaar number | Highly sensitive | NOT stored (mock only) | Never store raw; use Virtual ID |
| PAN number | Sensitive PII | NOT stored (mock only) | Encrypt; store masked only |
| Documents | Sensitive | Mock data only | DigiLocker integration; encrypted storage |
| Family relationships | PII | Stored in FamilyMember entity | Same + consent |

### Data Access Controls

| Control | Implementation | Status |
|---|---|---|
| User-scoped entity reads | `created_by_id` filtering | Implemented |
| Admin-only user management | Role check in backend functions | Implemented |
| Route protection | ProtectedRoute component | Implemented |
| Session validation | Base44 token validation | Implemented |

### Data Retention

| Data | Current Retention | Future Policy |
|---|---|---|
| User account | Until deleted by admin | Define retention period |
| Family members | Until user deletes | Define retention period |
| Notifications | Until user deletes | Auto-delete after 90 days |
| AI chat history | Not persisted (in-memory) | Persist with retention policy |
| Audit logs | Not persisted (mock) | Permanent (compliance) |
| Consent records | Not persisted (local state) | Permanent until revoked |

**Status: Future Integration**

### Data Deletion (Right to Erasure)

| Aspect | Current | Future |
|---|---|---|
| User-initiated deletion | User can delete family members | Full account deletion (GDPR/DPDP style) |
| Admin deletion | Admin can delete users | Same + audit trail |
| Data export | Not available | Citizen can export their data |
| Deletion verification | Not available | Confirmation + audit log |

**Status: Partially Implemented (family member deletion only)**

---

## Consent

### Current Implementation: Prototype / Simulated

Consent management is built in the UI (`src/pages/Consent.jsx`) but uses local React state — consent choices are NOT persisted to the database and reset on page refresh.

### Consent Model

| Principle | Implementation | Status |
|---|---|---|
| Purpose-bound | Each consent specifies the purpose of data access | Prototype / Simulated |
| Time-limited | Consent has an expiry date | Prototype / Simulated |
| Revocable | Citizen can revoke consent at any time | Prototype / Simulated |
| Granular | Per-data-type consent (income, medical, license, etc.) | Prototype / Simulated |

### Consent Items (Simulated)

| Data Type | Purpose | Expiry | Status |
|---|---|---|---|
| Income certificate | Scheme eligibility verification | 90 days | Prototype / Simulated |
| Medical records | Health scheme eligibility | 30 days | Prototype / Simulated |
| Driving licence | Transport-related services | 365 days | Prototype / Simulated |
| Academic transcript | Scholarship eligibility | 180 days | Prototype / Simulated |
| Employment history | Employment scheme eligibility | 90 days | Prototype / Simulated |
| Tax records | Income verification | 365 days | Prototype / Simulated |

### Future Consent Implementation

| Feature | Description | Phase |
|---|---|---|
| Consent entity | Persist consent records to database | Phase 2 |
| Consent enforcement | Block data access without valid consent | Phase 2 |
| Consent expiry | Auto-expire consent after time limit | Phase 2 |
| Consent revocation | Immediate data access revocation | Phase 2 |
| Consent audit log | Log every consent grant/revoke | Phase 2 |
| Consent notification | Notify citizen when data is accessed | Phase 3 |

**Status: Future Integration**

---

## Audit Logs

### Current Implementation: Prototype / Simulated

The Decision Log page (`src/pages/DecisionLog.jsx`) displays 7 mock entries. No real audit logging exists.

### What Should Be Logged (Future)

| Event | Details to Log | Phase |
|---|---|---|
| User login | User ID, timestamp, IP, method | Phase 2 |
| User logout | User ID, timestamp | Phase 2 |
| Entity create | User ID, entity, entity ID, timestamp, data | Phase 2 |
| Entity update | User ID, entity, entity ID, timestamp, changes | Phase 2 |
| Entity delete | User ID, entity, entity ID, timestamp | Phase 2 |
| AI call | User ID, query, response, confidence, timestamp | Phase 2 |
| Rule engine evaluation | User ID, member ID, results, timestamp | Phase 2 |
| Consent grant | User ID, data type, purpose, expiry, timestamp | Phase 2 |
| Consent revoke | User ID, data type, timestamp | Phase 2 |
| Admin action | Admin ID, action, target, timestamp | Phase 2 |
| Human review | Officer ID, decision, application ID, timestamp | Phase 3 |
| Failed auth attempt | Email, IP, timestamp | Phase 2 |

### Audit Log Schema (Future)

```json
{
  "id": "audit_123",
  "user_id": "usr_abc",
  "action": "ai_call",
  "entity": "AIRecommendation",
  "entity_id": "rec_456",
  "timestamp": "2025-07-10T14:22:00Z",
  "details": {
    "query": "What schemes am I eligible for?",
    "confidence": 97,
    "rule_matched": "nsp-engineering"
  },
  "ip_address": "203.0.113.50",
  "user_agent": "Mozilla/5.0..."
}
```

**Status: Future Integration**

---

## API Security

### Current Controls

| Control | Implementation | Status |
|---|---|---|
| Authentication required | All entity and function operations require valid token | Implemented |
| User-scoped access | Entity reads filtered by `created_by_id` | Implemented |
| Backend function auth | `base44.auth.me()` check in `notifyStatusChange` | Implemented |
| 401 for unauthenticated | Backend function returns 401 if not authenticated | Implemented |

### Missing Controls

| Control | Risk | Priority | Phase |
|---|---|---|---|
| Rate limiting | Abuse, DDoS | High | Phase 2 |
| Input sanitization | XSS, injection | High | Phase 2 |
| CORS policy | Cross-origin attacks | Medium | Phase 2 |
| API key management | Unauthorized API access | Medium | Phase 2 |
| Request signing | Tampering | Low | Phase 3 |
| IP allowlisting | Unauthorized access | Low | Phase 3 |

### Rate Limiting (Future)

```javascript
// Future: Rate limiting in backend functions
const user = await base44.auth.me();
const rateLimitKey = `rate:${user.id}:notifyStatusChange`;
const count = await redis.incr(rateLimitKey);
if (count === 1) await redis.expire(rateLimitKey, 60); // 60 seconds
if (count > 10) {
  return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
}
```

**Status: Future Integration**

---

## File Upload Security

### Current State

File upload is NOT implemented in CivicAI. The Base44 `UploadFile` integration is available but unused.

### Future Requirements

| Control | Description | Phase |
|---|---|---|
| File type validation | Only allow specific types (PDF, JPG, PNG) | Phase 2 |
| File size limit | Maximum 10MB per file | Phase 2 |
| Malware scanning | Scan uploaded files for malware | Phase 3 |
| Virus scanning | Use antivirus API to scan files | Phase 3 |
| File name sanitization | Remove special characters from file names | Phase 2 |
| Storage isolation | Store files in isolated user directories | Phase 2 |
| Access control | Files only accessible by owner | Phase 2 |
| Signed URLs | Time-limited access URLs | Phase 2 |

**Status: Future Integration**

---

## Rate Limiting

### Current State: Not Implemented

No rate limiting is currently applied to API calls, entity operations, or AI calls.

### Future Implementation

| Resource | Limit | Window | Phase |
|---|---|---|---|
| AI chat messages | 20 per user | per hour | Phase 2 |
| Entity creates | 50 per user | per hour | Phase 2 |
| Backend function calls | 30 per user | per minute | Phase 2 |
| Auth attempts | 5 per email | per 15 minutes | Phase 2 |
| Password reset requests | 3 per email | per hour | Phase 2 |

**Status: Future Integration**

---

## OWASP Top 10 Considerations

| OWASP Risk | CivicAI Status | Mitigation |
|---|---|---|
| **A01: Broken Access Control** | **Implemented** — user-scoped entities, role checks | Continue enforcing `created_by_id` filtering |
| **A02: Cryptographic Failures** | **Implemented** — HTTPS, at-rest encryption | Add field-level encryption for PII |
| **A03: Injection** | **Low Risk** — SDK-based queries, no raw SQL | Add input sanitization for user text |
| **A04: Insecure Design** | **Partially Addressed** — rule engine separation prevents AI injection | Add threat modeling for new features |
| **A05: Security Misconfiguration** | **Implemented** — Base44 manages config | Monitor for misconfiguration |
| **A06: Vulnerable Components** | **Monitored** — Dependabot configured | Keep dependencies updated |
| **A07: Auth Failures** | **Implemented** — Base44 auth, OTP, password reset | Add rate limiting for auth attempts |
| **A08: Data Integrity Failures** | **Low Risk** — structured JSON schema | Validate all LLM responses against schema |
| **A09: Logging/Monitoring Failures** | **Not Addressed** — no real audit logging | Implement AuditLog entity (Phase 2) |
| **A10: SSRF** | **Low Risk** — no server-side URL fetching | Validate URLs before server-side fetch |

---

## Sensitive Data Handling

### Aadhaar Data

| Aspect | Current | Future |
|---|---|---|
| Storage | NOT stored (mock data only) | Never store raw Aadhaar number |
| Display | Masked (XXXX-XXXX-7842) | Same + consent before display |
| Verification | NOT implemented | UIDA e-KYC API (Phase 3) |
| Compliance | NOT compliant with Aadhaar Act | Aadhaar Act compliance (Phase 3) |

**Status: Prototype / Simulated (mock data only)**

### PAN Data

| Aspect | Current | Future |
|---|---|---|
| Storage | NOT stored (mock data only) | Encrypt; store masked only |
| Display | Masked (ABCD****E) | Same |
| Verification | NOT implemented | NSDL PAN verification (Phase 3) |

**Status: Prototype / Simulated (mock data only)**

### Income Data

| Aspect | Current | Future |
|---|---|---|
| Storage | Stored in FamilyMember entity (plain) | Encrypt at field level |
| Display | Shown in family member details | Require consent before display |
| Verification | NOT implemented | Income certificate verification (Phase 3) |

**Status: Implemented (plain text) → Future: Encrypted**

### Document Data

| Aspect | Current | Future |
|---|---|---|
| Storage | NOT stored (mock data only) | DigiLocker integration (Phase 2-3) |
| Display | Mock documents shown | Real documents from DigiLocker |
| Verification | NOT implemented | DigiLocker API verification (Phase 2-3) |

**Status: Prototype / Simulated (mock data only)**

---

## Security Incident Response

### Current State: Not Implemented

No incident response plan exists.

### Future Incident Response Plan

| Step | Action | Phase |
|---|---|---|
| 1. Detect | Automated monitoring detects anomaly | Phase 3 |
| 2. Report | Incident reported to security team | Phase 3 |
| 3. Assess | Determine severity and impact | Phase 3 |
| 4. Contain | Isolate affected systems | Phase 3 |
| 5. Eradicate | Remove threat | Phase 3 |
| 6. Recover | Restore services | Phase 3 |
| 7. Learn | Post-incident review and improvements | Phase 3 |
| 8. Notify | Notify affected citizens (if required by DPDP Act) | Phase 3 |

**Status: Future Integration**

---

## Security Compliance Roadmap

| Standard | Status | Phase |
|---|---|---|
| DPDP Act (Digital Personal Data Protection Act) | Referenced, not certified | Phase 3 |
| Aadhaar Act | Not compliant (simulated) | Phase 3 |
| IT Act | Referenced | Phase 3 |
| ISO 27001 | Not started | Phase 3-4 |
| SOC 2 | Not started | Phase 4 |
| CERT-In empanelment | Not started | Phase 4 |
| MeitY compliance | Not started | Phase 3 |

---

## Security Checklist

### Implemented ✅
- [x] Authentication (email/password, Google, OTP)
- [x] Route protection (ProtectedRoute)
- [x] Session management (Base44 tokens)
- [x] Password reset flow
- [x] OTP verification
- [x] HTTPS encryption in transit
- [x] At-rest database encryption
- [x] User-scoped data access
- [x] Admin role for user management
- [x] Secrets management (dashboard)
- [x] Error handling in backend functions
- [x] Dependabot for dependency updates

### Not Yet Implemented ❌
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] File upload security
- [ ] Malware scanning
- [ ] Real audit logging
- [ ] Consent enforcement (persistence)
- [ ] Data retention policies
- [ ] Data deletion (right to erasure)
- [ ] Field-level encryption
- [ ] Incident response plan
- [ ] Penetration testing
- [ ] Security certification (ISO 27001, SOC 2)
- [ ] CORS policy
- [ ] API key management
- [ ] IP allowlisting
- [ ] Security monitoring
- [ ] Anomaly detection

---

*Last updated: July 2026*