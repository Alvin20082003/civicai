# API Documentation — CivicAI

> Complete API reference for all implemented, simulated, and future endpoints

---

## Authentication APIs (Base44 SDK)

### Login — Email/Password

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.auth.loginViaEmailPassword(email, password)` |
| **Purpose** | Authenticate user with email and password |
| **Authentication** | Public |
| **Authorization** | None |
| **Input** | `{ email: string, password: string }` |
| **Output** | Sets session token; redirects to `/` |
| **Example Request** | `await base44.auth.loginViaEmailPassword("user@example.com", "password123")` |
| **Example Response** | Session token set; `window.location.href = '/'` |
| **Validation** | Email format, password non-empty |
| **Possible Errors** | Invalid credentials, unverified email |
| **Status Codes** | 200 (success), 401 (invalid credentials) |
| **Status** | **Implemented** |

### Login — Google OAuth

| Field | Detail |
|---|---|
| **Method** | SDK call (OAuth redirect) |
| **Endpoint** | `base44.auth.loginWithProvider('google', fromUrl)` |
| **Purpose** | Authenticate user via Google OAuth |
| **Authentication** | Public |
| **Authorization** | None |
| **Input** | `{ provider: "google", fromUrl: string }` |
| **Output** | Redirects to Google → back to app with token |
| **Example Request** | `await base44.auth.loginWithProvider("google", "/dashboard")` |
| **Example Response** | OAuth redirect flow |
| **Validation** | None |
| **Possible Errors** | OAuth provider error, user cancels |
| **Status Codes** | 200 (success), 400 (provider error) |
| **Status** | **Implemented** |

### Register

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.auth.register({ email, password })` |
| **Purpose** | Register a new user (does NOT log in — requires OTP verification) |
| **Authentication** | Public |
| **Authorization** | None |
| **Input** | `{ email: string, password: string }` |
| **Output** | Creates unverified user; OTP sent to email |
| **Example Request** | `await base44.auth.register({ email: "user@example.com", password: "password123" })` |
| **Example Response** | `{ success: true }` — user created but unverified |
| **Validation** | Email format, password strength |
| **Possible Errors** | Email already registered, invalid email |
| **Status Codes** | 201 (created), 400 (invalid input), 409 (already exists) |
| **Status** | **Implemented** |

### Verify OTP

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.auth.verifyOtp({ email, otpCode })` |
| **Purpose** | Verify OTP code after registration |
| **Authentication** | Public |
| **Authorization** | None |
| **Input** | `{ email: string, otpCode: string }` |
| **Output** | Returns access_token → set token → redirect to `/` |
| **Example Request** | `await base44.auth.verifyOtp({ email: "user@example.com", otpCode: "123456" })` |
| **Example Response** | `{ access_token: "eyJ..." }` → `base44.auth.setToken(token)` → redirect |
| **Validation** | OTP is 6 digits, email matches registered user |
| **Possible Errors** | Invalid OTP, OTP expired, email not found |
| **Status Codes** | 200 (success), 400 (invalid OTP), 404 (email not found) |
| **Status** | **Implemented** |

### Resend OTP

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.auth.resendOtp(email)` |
| **Purpose** | Resend OTP to email |
| **Authentication** | Public |
| **Input** | `{ email: string }` |
| **Output** | OTP resent |
| **Example Request** | `await base44.auth.resendOtp("user@example.com")` |
| **Status Codes** | 200 (success), 404 (email not found) |
| **Status** | **Implemented** |

### Password Reset Request

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.auth.resetPasswordRequest(email)` |
| **Purpose** | Request password reset email |
| **Authentication** | Public |
| **Input** | `{ email: string }` |
| **Output** | Always shows generic success (API hides whether email exists) |
| **Example Request** | `await base44.auth.resetPasswordRequest("user@example.com")` |
| **Status Codes** | 200 (always generic success) |
| **Status** | **Implemented** |

### Password Reset

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.auth.resetPassword({ resetToken, newPassword })` |
| **Purpose** | Reset password using token from email |
| **Authentication** | Public (token-based) |
| **Input** | `{ resetToken: string, newPassword: string }` |
| **Output** | Password updated; redirect to `/login` |
| **Example Request** | `await base44.auth.resetPassword({ resetToken: "token_from_url", newPassword: "newpass123" })` |
| **Validation** | Token valid, password strength |
| **Possible Errors** | Invalid token, token expired |
| **Status Codes** | 200 (success), 400 (invalid token) |
| **Status** | **Implemented** |

### Get Current User

| Field | Detail |
|---|---|
| **Method** | SDK call (GET internally) |
| **Endpoint** | `base44.auth.me()` |
| **Purpose** | Get authenticated user's profile |
| **Authentication** | Required |
| **Authorization** | Self only |
| **Input** | None |
| **Output** | `{ id, email, full_name, role, created_date }` |
| **Example Request** | `const user = await base44.auth.me()` |
| **Example Response** | `{ id: "usr_123", email: "user@example.com", full_name: "Arjun Kumar", role: "user" }` |
| **Possible Errors** | Not authenticated, token expired |
| **Status Codes** | 200 (success), 401 (unauthorized) |
| **Status** | **Implemented** |

### Check Authentication

| Field | Detail |
|---|---|
| **Method** | SDK call |
| **Endpoint** | `base44.auth.isAuthenticated()` |
| **Purpose** | Check if user is authenticated |
| **Authentication** | N/A |
| **Input** | None |
| **Output** | `Promise<boolean>` |
| **Example Request** | `const isAuth = await base44.auth.isAuthenticated()` |
| **Status Codes** | N/A (returns boolean) |
| **Status** | **Implemented** |

### Logout

| Field | Detail |
|---|---|
| **Method** | SDK call |
| **Endpoint** | `base44.auth.logout(redirectUrl?)` |
| **Purpose** | Log out current user |
| **Authentication** | Required |
| **Input** | `{ redirectUrl?: string }` (optional) |
| **Output** | Session cleared; redirect |
| **Example Request** | `await base44.auth.logout("/login")` |
| **Status Codes** | 200 (success) |
| **Status** | **Implemented** |

### Invite User

| Field | Detail |
|---|---|
| **Method** | SDK call |
| **Endpoint** | `base44.users.inviteUser(email, role)` |
| **Purpose** | Invite a new user to the app |
| **Authentication** | Required |
| **Authorization** | Admin only (for role="admin"); user can invite role="user" |
| **Input** | `{ email: string, role: "admin" | "user" }` |
| **Output** | Invitation email sent |
| **Example Request** | `await base44.users.inviteUser("newuser@example.com", "user")` |
| **Possible Errors** | Not authorized, email already registered |
| **Status Codes** | 200 (success), 403 (forbidden) |
| **Status** | **Implemented** |

---

## Entity APIs (Base44 SDK)

### FamilyMember — List

| Field | Detail |
|---|---|
| **Method** | SDK call (GET internally) |
| **Endpoint** | `base44.entities.FamilyMember.list(sort?, limit?)` |
| **Purpose** | List all family members for authenticated user |
| **Authentication** | Required |
| **Authorization** | User-scoped (only own family members) |
| **Input** | `{ sort?: string, limit?: number }` (e.g., `'-created_date', 50`) |
| **Output** | `FamilyMember[]` |
| **Example Request** | `const members = await base44.entities.FamilyMember.list()` |
| **Example Response** | `[{ id: "fm_1", name: "Rajesh Kumar", relation: "Father", age: 55, ... }]` |
| **Validation** | None |
| **Possible Errors** | Not authenticated |
| **Status Codes** | 200 (success), 401 (unauthorized) |
| **Status** | **Implemented** |

### FamilyMember — Filter

| Field | Detail |
|---|---|
| **Method** | SDK call (GET internally) |
| **Endpoint** | `base44.entities.FamilyMember.filter(query, sort?, limit?)` |
| **Purpose** | Filter family members by query |
| **Authentication** | Required |
| **Authorization** | User-scoped |
| **Input** | `{ query: object, sort?: string, limit?: number }` |
| **Output** | `FamilyMember[]` |
| **Example Request** | `const fathers = await base44.entities.FamilyMember.filter({ relation: "Father" })` |
| **Example Response** | `[{ id: "fm_1", name: "Rajesh Kumar", relation: "Father", ... }]` |
| **Validation** | Query must be valid MongoDB-style filter |
| **Possible Errors** | Not authenticated, invalid query |
| **Status Codes** | 200 (success), 401 (unauthorized), 400 (invalid query) |
| **Status** | **Implemented** |

### FamilyMember — Create

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.entities.FamilyMember.create(data)` |
| **Purpose** | Create a new family member |
| **Authentication** | Required |
| **Authorization** | User-scoped (created_by_id set to current user) |
| **Input** | `{ name: string, relation: string, age: number, gender: string, occupation: string, annual_income?: number, aadhaar_linked?: boolean, student?: boolean, senior_citizen?: boolean, disability?: boolean, bpl_category?: boolean, avatar?: string }` |
| **Output** | Created `FamilyMember` object with `id` |
| **Example Request** | `const member = await base44.entities.FamilyMember.create({ name: "Priya", relation: "Daughter", age: 20, gender: "Female", occupation: "Student" })` |
| **Example Response** | `{ id: "fm_new", name: "Priya", relation: "Daughter", age: 20, ... }` |
| **Validation** | `name`, `relation`, `age`, `gender`, `occupation` are required |
| **Possible Errors** | Not authenticated, validation error |
| **Status Codes** | 201 (created), 400 (validation error), 401 (unauthorized) |
| **Status** | **Implemented** |

### FamilyMember — Bulk Create

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.entities.FamilyMember.bulkCreate(dataArray)` |
| **Purpose** | Create multiple family members at once |
| **Authentication** | Required |
| **Authorization** | User-scoped |
| **Input** | `FamilyMember[]` (array of member objects) |
| **Output** | Created `FamilyMember[]` with IDs |
| **Example Request** | `const members = await base44.entities.FamilyMember.bulkCreate([{ name: "Rajesh", ... }, { name: "Priya", ... }])` |
| **Example Response** | `[{ id: "fm_1", ... }, { id: "fm_2", ... }]` |
| **Validation** | Each item must meet schema requirements |
| **Possible Errors** | Not authenticated, validation error |
| **Status Codes** | 201 (created), 400 (validation error), 401 (unauthorized) |
| **Status** | **Implemented** |

### FamilyMember — Update

| Field | Detail |
|---|---|
| **Method** | SDK call (PUT internally) |
| **Endpoint** | `base44.entities.FamilyMember.update(id, data)` |
| **Purpose** | Update an existing family member |
| **Authentication** | Required |
| **Authorization** | User-scoped (only own family members) |
| **Input** | `{ id: string, data: Partial<FamilyMember> }` |
| **Output** | Updated `FamilyMember` object |
| **Example Request** | `await base44.entities.FamilyMember.update("fm_1", { age: 56 })` |
| **Example Response** | `{ id: "fm_1", age: 56, ... }` |
| **Validation** | ID must exist and belong to user |
| **Possible Errors** | Not authenticated, not found, validation error |
| **Status Codes** | 200 (success), 404 (not found), 401 (unauthorized) |
| **Status** | **Implemented** |

### FamilyMember — Delete

| Field | Detail |
|---|---|
| **Method** | SDK call (DELETE internally) |
| **Endpoint** | `base44.entities.FamilyMember.delete(id)` |
| **Purpose** | Delete a family member |
| **Authentication** | Required |
| **Authorization** | User-scoped (only own family members) |
| **Input** | `{ id: string }` |
| **Output** | Deletion confirmation |
| **Example Request** | `await base44.entities.FamilyMember.delete("fm_1")` |
| **Validation** | ID must exist and belong to user |
| **Possible Errors** | Not authenticated, not found |
| **Status Codes** | 200 (success), 404 (not found), 401 (unauthorized) |
| **Status** | **Implemented** |

### Notification — List

| Field | Detail |
|---|---|
| **Method** | SDK call (GET internally) |
| **Endpoint** | `base44.entities.Notification.list(sort?, limit?)` |
| **Purpose** | List all notifications for authenticated user |
| **Authentication** | Required |
| **Authorization** | User-scoped |
| **Input** | `{ sort?: string, limit?: number }` |
| **Output** | `Notification[]` |
| **Example Request** | `const notifications = await base44.entities.Notification.list('-created_date', 20)` |
| **Example Response** | `[{ id: "ntf_1", title_en: "Application Approved", title_ta: "விண்ணப்பம் அங்கீகரிக்கப்பட்டது", ... }]` |
| **Status Codes** | 200 (success), 401 (unauthorized) |
| **Status** | **Implemented** |

### Notification — Update (Mark as Read)

| Field | Detail |
|---|---|
| **Method** | SDK call (PUT internally) |
| **Endpoint** | `base44.entities.Notification.update(id, data)` |
| **Purpose** | Update notification (e.g., mark as read) |
| **Authentication** | Required |
| **Authorization** | User-scoped |
| **Input** | `{ id: string, data: { read?: boolean, ... } }` |
| **Output** | Updated `Notification` object |
| **Example Request** | `await base44.entities.Notification.update("ntf_1", { read: true })` |
| **Status Codes** | 200 (success), 404 (not found), 401 (unauthorized) |
| **Status** | **Implemented** |

### Entity — Real-time Subscription

| Field | Detail |
|---|---|
| **Method** | SDK call (WebSocket internally) |
| **Endpoint** | `base44.entities.EntityName.subscribe(callback)` |
| **Purpose** | Subscribe to real-time entity changes |
| **Authentication** | Required |
| **Input** | `callback: (event) => void` where `event = { id, type: 'create'|'update'|'delete', data }` |
| **Output** | Unsubscribe function |
| **Example Request** | `const unsub = base44.entities.Notification.subscribe((event) => { console.log(event); })` |
| **Status** | **Available** (implemented in SDK, used for notifications) |

---

## Backend Function APIs

### notifyStatusChange

| Field | Detail |
|---|---|
| **Method** | POST |
| **Endpoint** | `base44.functions.invoke('notifyStatusChange', payload)` |
| **Purpose** | Create a bilingual (English/Tamil) status change notification |
| **Authentication** | Required |
| **Authorization** | User-scoped (notification created for authenticated user) |
| **Input** | `{ application_id: string, new_status: string, service_name: string }` |
| **Output** | `{ success: boolean, notification: Notification }` |
| **Example Request** | `await base44.functions.invoke('notifyStatusChange', { application_id: "APP-001", new_status: "approved", service_name: "PM-KISAN" })` |
| **Example Response** | `{ success: true, notification: { id: "ntf_new", title_en: "Application Approved", title_ta: "விண்ணப்பம் அங்கீகரிக்கப்பட்டது", type: "success", category: "status_change", read: false, ... } }` |
| **Validation** | `application_id`, `new_status`, `service_name` required |
| **Possible Errors** | Not authenticated (401), missing parameters (400), template not found |
| **Status Codes** | 200 (success), 400 (bad request), 401 (unauthorized), 500 (server error) |
| **Status** | **Implemented** |

#### Status Templates

| new_status | title_en | title_ta | type |
|---|---|---|---|
| `submitted` | Application Submitted | விண்ணப்பம் சமர்ப்பிக்கப்பட்டது | info |
| `under_review` | Under Review | மதிப்பாய்வில் உள்ளது | info |
| `approved` | Application Approved | விண்ணப்பம் அங்கீகரிக்கப்பட்டது | success |
| `rejected` | Application Rejected | விண்ணப்பம் நிராகரிக்கப்பட்டது | warning |
| `human_review` | Human Review Required | மனித மதிப்பாய்வு தேவை | action_required |

---

## Integration APIs

### Core.InvokeLLM

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.integrations.Core.InvokeLLM({ prompt, response_json_schema?, model? })` |
| **Purpose** | Generate AI response with structured JSON output |
| **Authentication** | Required |
| **Input** | `{ prompt: string, response_json_schema?: object, model?: string, add_context_from_internet?: boolean, file_urls?: string[] }` |
| **Output** | Structured JSON (if schema provided) or string |
| **Example Request** | `const res = await base44.integrations.Core.InvokeLLM({ prompt: buildCaseworkerPrompt("What schemes am I eligible for?"), response_json_schema: caseworkerResponseSchema })` |
| **Example Response** | `{ detected_language: "ta", intent_summary: "...", recommended_schemes: [...], audit_log_id: "CAI-2025-001234" }` |
| **Validation** | `prompt` required; `response_json_schema` root must be type "object" |
| **Possible Errors** | Not authenticated, timeout (45s), invalid schema |
| **Status Codes** | 200 (success), 401 (unauthorized), 408 (timeout), 500 (server error) |
| **Status** | **Implemented** |

#### Available Models

| Model | Use Case | Credit Cost |
|---|---|---|
| `automatic` (default) | General purpose | Standard |
| `gpt_5_mini` | Fast, simple tasks | Lower |
| `gemini_3_flash` | Web search + fast | Lower |
| `gpt_5_4` / `gpt_5_5` | High quality | Higher |
| `gemini_3_1_pro` | Web search + high quality | Higher |
| `claude_sonnet_4_6` | Complex reasoning | Higher |
| `claude_opus_4_6` / `4_7` / `4_8` | Highest quality | Highest |

### Core.UploadFile

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.integrations.Core.UploadFile({ file })` |
| **Purpose** | Upload a file to user's files directory |
| **Authentication** | Required |
| **Input** | `{ file: File }` |
| **Output** | `{ file_url: string }` |
| **Example Request** | `const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile })` |
| **Status** | **Available** (not currently used) |

### Core.ExtractDataFromUploadedFile

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.integrations.Core.ExtractDataFromUploadedFile({ file_url, json_schema })` |
| **Purpose** | Extract structured data from uploaded file (CSV, XLSX, JSON, HTML, PNG, JPG, PDF) |
| **Authentication** | Required |
| **Input** | `{ file_url: string, json_schema: object }` |
| **Output** | `{ status: "success" | "error", details?: string, output?: list | dict }` |
| **Example Request** | `const res = await base44.integrations.Core.ExtractDataFromUploadedFile({ file_url: "https://...", json_schema: { type: "object", properties: { income: { type: "number" } } } })` |
| **Status** | **Available** (not currently used — Future Integration for document intelligence) |

### Core.SendEmail

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.integrations.Core.SendEmail({ to, subject, body, from_name? })` |
| **Purpose** | Send an email |
| **Authentication** | Required |
| **Input** | `{ to: string, subject: string, body: string, from_name?: string }` |
| **Output** | Email sent confirmation |
| **Status** | **Available** (not currently used) |

### Core.GenerateSpeech

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.integrations.Core.GenerateSpeech({ text, voice?, language_code? })` |
| **Purpose** | Generate premium TTS audio (MP3 URL) |
| **Authentication** | Required |
| **Input** | `{ text: string (max 5000 chars), voice?: "river"|"honey"|"sunny"|"storm"|"spark", language_code?: string }` |
| **Output** | `{ url: string }` (MP3 URL) |
| **Status** | **Available** (not currently used — CivicAI uses browser-native TTS instead) |

### Core.UploadPrivateFile

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.integrations.Core.UploadPrivateFile({ file })` |
| **Purpose** | Upload to private storage (requires signed URL for access) |
| **Authentication** | Required |
| **Input** | `{ file: File }` |
| **Output** | `{ file_uri: string }` |
| **Status** | **Available** (not currently used) |

### Core.CreateFileSignedUrl

| Field | Detail |
|---|---|
| **Method** | SDK call (POST internally) |
| **Endpoint** | `base44.integrations.Core.CreateFileSignedUrl({ file_uri, expires_in? })` |
| **Purpose** | Create time-limited signed download URL for private file |
| **Authentication** | Required |
| **Input** | `{ file_uri: string, expires_in?: number }` (default 300 seconds) |
| **Output** | `{ signed_url: string }` |
| **Status** | **Available** (not currently used) |

---

## Prototype / Simulated APIs

These APIs are implemented as client-side functions (not real backend calls):

| API | Implementation | Status |
|---|---|---|
| Scheme search | Client-side filter on `governmentSchemes` array | Prototype / Simulated |
| Eligibility check | Client-side rule engine (`householdCalculator.js`) | Implemented (client-side) |
| Document upload | Non-functional button | Prototype / Simulated |
| Application submission | External link to government portal | Implemented (link only) |
| Consent management | Local React state | Prototype / Simulated |
| Proactive alerts | Hardcoded array in `Proactive.jsx` | Prototype / Simulated |
| Policy intelligence | Mock data from `mockData.js` | Prototype / Simulated |
| Predictive analytics | Mock chart data from `mockData.js` | Prototype / Simulated |
| Risk dashboard | Mock data from `mockData.js` | Prototype / Simulated |
| Decision log | Mock data from `mockData.js` | Prototype / Simulated |
| Governance metrics | Static values from `mockData.js` | Prototype / Simulated |
| Citizen profile | Hardcoded in `indiaData.js` | Prototype / Simulated |
| Document wallet | Hardcoded in `indiaData.js` | Prototype / Simulated |
| Life events | Hardcoded in `indiaData.js` | Prototype / Simulated |
| Government offices | Hardcoded in `officeData.js` | Prototype / Simulated |

---

## Future APIs (Not Yet Implemented)

| API | Method | Purpose | Phase |
|---|---|---|---|
| Aadhaar e-KYC | POST | Verify Aadhaar via UIDA | Phase 3 |
| DigiLocker Documents | GET | Fetch documents from DigiLocker | Phase 2-3 |
| Government Scheme Database | GET | Fetch real scheme catalog | Phase 2-3 |
| Application Status | GET | Check real application status from portal | Phase 3 |
| Portal Submission | POST | Submit application to government portal | Phase 3 |
| RAG Retrieval | POST | Vector search for policy documents | Phase 3 |
| Admin Scheme Management | CRUD | Manage scheme catalog | Phase 4 |
| Audit Log Export | GET | Export audit trail | Phase 3 |
| e-Pramaan SSO | GET | Government single sign-on | Phase 3 |
| Check Eligibility (Server-side) | POST | Server-side rule engine evaluation | Phase 2 |
| Generate Audit Log | POST | Log every AI call and decision | Phase 2 |
| Process Consent Update | POST | Persist consent changes | Phase 2 |
| Submit Application | POST | Submit to government portal API | Phase 3 |

---

## API Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message describing what went wrong",
  "status": 400
}
```

### Common Status Codes

| Code | Meaning | When |
|---|---|---|
| 200 | Success | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (create) |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Not authenticated, token expired |
| 403 | Forbidden | Not authorized (e.g., non-admin accessing admin route) |
| 404 | Not Found | Entity not found |
| 408 | Timeout | LLM call exceeds 45 seconds |
| 409 | Conflict | Duplicate email on register |
| 500 | Server Error | Unexpected server error |

### Error Handling in Frontend

CivicAI uses try/catch in user-facing flows (auth, forms) and lets errors bubble up in data fetching (handled by React Query). The AI chat has a 45-second timeout with a fallback error message in the citizen's detected language.

---

*Last updated: July 2026*