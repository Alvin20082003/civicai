# Deployment Documentation — CivicAI

> Complete hosting, deployment, and operations guide

---

## Hosting Architecture

CivicAI is hosted entirely on the **Base44 platform** — a backend-as-a-service that manages frontend hosting, backend functions, database, authentication, and SSL certificates.

### Hosting Components

| Component | Provider | Status |
|---|---|---|
| Frontend Hosting | Base44 CDN (Vite build → static files) | Implemented |
| Backend Hosting | Deno Deploy (Base44 functions) | Implemented |
| Database Hosting | Base44 managed NoSQL | Implemented |
| File Storage | Base44 UploadFile / UploadPrivateFile | Available (unused) |
| Authentication | Base44 Auth | Implemented |
| SSL Certificates | Base44-managed (Let's Encrypt) | Pending verification |
| CDN | Base44 CDN | Implemented |
| Custom Domain | civicai.online | Configured (SSL pending) |

### Hosting Architecture Diagram

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
│  │  │ • Encryption    │  │ • OTP          │                 │  │
│  │  └────────────────┘  └────────────────┘                 │  │
│  │                                                           │  │
│  │  ┌────────────────┐                                      │  │
│  │  │ SSL/TLS        │   Status: Pending verification       │  │
│  │  │ (Let's Encrypt)│   (Base44-managed)                    │  │
│  │  └────────────────┘                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  civicai.online                           │  │
│  │                                                           │  │
│  │  DNS Configuration:                                       │  │
│  │  • NS: IONOS name servers                                 │  │
│  │  • A record: civicai.online → 216.24.57.1                │  │
│  │  • CNAME: www → base44.onrender.com                      │  │
│  │  • SSL: Pending domain verification                       │  │
│  │                                                           │  │
│  │  Status: Configured (SSL pending)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Hosting

### Provider
Base44 CDN

### How It Works
1. Developer saves code in Base44 builder
2. Base44 runs `npm install` + `npm run build` (Vite)
3. Built static files (`dist/`) deployed to Base44 CDN
4. Files served via CDN globally
5. App is live immediately

### Build Configuration
- **Build Tool:** Vite
- **Output:** `dist/` directory
- **Static Assets:** Served via CDN
- **Status:** Implemented

### Local Development Build
```bash
# If exporting for local development
npm install
npm run dev      # Development server with hot reload
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

---

## Backend Hosting

### Provider
Deno Deploy (via Base44 functions)

### How It Works
1. Backend functions written in `base44/functions/{functionName}/entry.ts`
2. On save, Base44 deploys function to Deno Deploy
3. Function auto-scales based on demand
4. Invoked via `base44.functions.invoke('functionName', payload)`

### Function Pattern
```typescript
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    
    // Business logic here
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
```

### Current Functions
| Function | Purpose | Status |
|---|---|---|
| `notifyStatusChange` | Create bilingual status notification | Implemented |

### Status: Implemented

---

## Database Hosting

### Provider
Base44 Managed NoSQL Database

### How It Works
- Database is auto-provisioned by Base44
- No manual setup required
- Auto-scaling based on demand
- Auto-backup (Base44-managed)
- At-rest encryption (Base44-managed)

### Entity Management
- **Create/modify:** Edit `.jsonc` files in `base44/entities/`
- **View data:** Base44 Dashboard → Database
- **Query:** Via SDK: `base44.entities.EntityName.list()`

### Current Entities
1. User (built-in)
2. FamilyMember
3. Notification

See [DATABASE.md](./DATABASE.md) for complete schema documentation.

### Status: Implemented

---

## Storage

### File Storage Options

| Type | Integration | Purpose | Status |
|---|---|---|---|
| Public file storage | `base44.integrations.Core.UploadFile` | Upload files to public storage | Available (unused) |
| Private file storage | `base44.integrations.Core.UploadPrivateFile` | Upload to private storage | Available (unused) |
| Signed URLs | `base44.integrations.Core.CreateFileSignedUrl` | Time-limited download URLs | Available (unused) |

### Future File Storage
- Document vault integration with DigiLocker (Phase 2-3)
- Citizen document uploads (Phase 2)
- Document intelligence with OCR (Phase 2-3)

---

## DNS Configuration

### Domain
`civicai.online`

### DNS Records

| Record Type | Name | Value | Purpose | Status |
|---|---|---|---|---|
| NS | civicai.online | ns1038.ui-dns.com | Name server (IONOS) | Configured |
| NS | civicai.online | ns1044.ui-dns.biz | Name server (IONOS) | Configured |
| NS | civicai.online | ns1086.ui-dns.org | Name server (IONOS) | Configured |
| NS | civicai.online | ns1092.ui-dns.de | Name server (IONOS) | Configured |
| A | civicai.online | 216.24.57.1 | Base44 IP address | Configured |
| CNAME | www.civicai.online | base44.onrender.com | WWW redirect to Base44 | Configured |

### DNS Provider
IONOS (1&1)

### Status: Configured

---

## SSL

### Provider
Base44-managed (Let's Encrypt)

### Status: Pending Domain Verification

### How to Complete SSL Setup
1. Log in to Base44 Dashboard
2. Navigate to Settings → Custom Domain
3. Verify domain ownership
4. SSL certificate is issued automatically after verification
5. HTTPS becomes active for civicai.online

### SSL Features
- **Automatic renewal:** Base44 manages renewal
- **HTTPS redirect:** All HTTP traffic redirected to HTTPS
- **HSTS:** HTTP Strict Transport Security enabled
- **TLS version:** TLS 1.2+ (Base44-managed)

---

## Domain Mapping

### Custom Domain Setup

1. **Purchase domain** (civicai.online — done via IONOS)
2. **Configure DNS** (done — A record + CNAME + NS records)
3. **Add domain in Base44 Dashboard:**
   - Go to Settings → Custom Domain
   - Enter `civicai.online`
   - Base44 provides DNS verification instructions
4. **Verify domain ownership**
5. **SSL certificate issued** automatically
6. **Domain is live** at https://civicai.online

### Current Status

| Step | Status |
|---|---|
| Domain purchased | ✅ Done (IONOS) |
| DNS configured | ✅ Done (A + CNAME + NS) |
| Domain added to Base44 | ✅ Done |
| Domain verified | ⏳ Pending verification in dashboard |
| SSL certificate issued | ⏳ Pending verification |
| Site live at HTTPS | ⏳ Pending SSL |

### How to Access Before SSL
- Use the Base44 preview URL (available in builder)
- Or access via HTTP (not recommended for production)

---

## Environment Variables

### Current Environment Variables

| Variable | Purpose | Status |
|---|---|---|
| `BASE44_APP_ID` | Base44 application identifier | Pre-populated by platform |

### Setting Environment Variables
1. Log in to Base44 Dashboard
2. Navigate to Settings → Environment Variables
3. Add variable name and value
4. Save
5. Variables available in backend functions via `Deno.env.get("VARIABLE_NAME")`

### Future Environment Variables

| Variable | Purpose | Phase |
|---|---|---|
| `AADHAAR_API_KEY` | UIDA e-KYC API key | Phase 3 |
| `DIGILOCKER_CLIENT_ID` | DigiLocker API client ID | Phase 2-3 |
| `DIGILOCKER_CLIENT_SECRET` | DigiLocker API client secret | Phase 2-3 |
| `VECTOR_DB_URL` | Vector database URL for RAG | Phase 3 |
| `VECTOR_DB_API_KEY` | Vector database API key | Phase 3 |

### Important Notes
- `BASE44_APP_ID` is pre-populated — do not modify
- Never request `BASE44_SERVICE_TOKEN` or `BASE44_SERVICE_ROLE_KEY` — these don't exist
- Auth comes from `createClientFromRequest(req)` in backend functions
- Service role from `base44.asServiceRole` in backend functions

---

## Build Process

### Automatic Build (Base44 Builder)

1. Developer edits code in Base44 builder (browser-based IDE)
2. On save, Base44 triggers:
   ```
   npm install
   npm run build
   ```
3. Vite builds the React SPA:
   - Compiles JSX/TSX
   - Bundles JavaScript
   - Processes Tailwind CSS
   - Optimizes assets
   - Outputs to `dist/`
4. Static files deployed to Base44 CDN
5. Backend functions deployed to Deno Deploy
6. App is live immediately (no manual deploy step)

### Build Output
```
dist/
├── index.html              # HTML entry point
├── assets/
│   ├── index-[hash].js     # Bundled JavaScript
│   ├── index-[hash].css    # Bundled CSS
│   └── ...                  # Other assets
└── ...
```

### Build Status: Implemented (auto-deploy on save)

---

## Deployment Pipeline

### Current Pipeline (Base44 Auto-Deploy)

```
Developer edits code
       │
       ▼
Base44 Builder (browser-based IDE)
       │
       ├── On Save:
       │   ├── npm install
       │   ├── npm run build (Vite)
       │   ├── Deploy static files → Base44 CDN
       │   └── Deploy backend functions → Deno Deploy
       │
       ▼
Application is live
       │
       ├── Frontend: Base44 CDN
       ├── Backend: Deno Deploy
       └── Database: Base44 managed NoSQL
```

### No CI/CD Pipeline Required
Base44 handles all deployment automatically. No GitHub Actions, Jenkins, or manual deployment steps needed.

### GitHub Integration (Available)
- GitHub Dependabot configured for dependency updates
- GitHub Actions CI workflow exists (`.github/workflows/ci.yml`)
- 2-way repo sync available if needed

---

## Production Deployment

### Current Production Status

| Aspect | Status | Notes |
|---|---|---|
| Domain | Configured | civicai.online |
| DNS | Configured | A record + CNAME + NS |
| SSL | Pending | Awaiting domain verification in dashboard |
| Frontend | Live | Via Base44 CDN |
| Backend | Live | Via Deno Deploy |
| Database | Live | Base44 managed NoSQL |
| Authentication | Live | Base44 Auth |
| Monitoring | Available | Base44 dashboard |
| Logging | Available | Base44 function logs |

### Production Checklist

- [x] Code committed to Base44
- [x] Dependencies installed (`npm install`)
- [x] Build succeeds (`npm run build`)
- [x] Domain purchased (civicai.online)
- [x] DNS configured (A + CNAME + NS)
- [x] Domain added to Base44
- [ ] Domain verified in Base44 dashboard
- [ ] SSL certificate issued
- [ ] HTTPS active
- [ ] Environment variables configured
- [ ] Backend functions tested
- [ ] Database entities created
- [ ] Seed data loaded (if needed)
- [ ] Monitoring alerts configured
- [ ] Backup strategy confirmed

### Status: SSL Pending Verification

---

## Rollback

### Current State
Base44 does not expose a direct rollback feature in the project configuration. However:

| Option | How | Status |
|---|---|---|
| Dashboard version history | Base44 dashboard may store previous deployments | Check dashboard |
| Git revert | If 2-way GitHub sync is enabled, revert via Git | Available if configured |
| Manual fix | Edit code and save (auto-deploys fix) | Always available |

### Recommended Rollback Strategy
1. If a deployment causes issues, edit the affected file(s)
2. Revert to previous code
3. Save — Base44 auto-deploys
4. Verify the fix in preview

---

## Monitoring

### Available Monitoring

| Feature | How | Status |
|---|---|---|
| App health | Base44 Dashboard → Overview | Implemented |
| Function logs | Base44 Dashboard → Code → Functions → Logs | Implemented |
| Entity management | Base44 Dashboard → Database | Implemented |
| User management | Base44 Dashboard → Users | Implemented |
| Function testing | `test_backend_function` tool or dashboard | Implemented |

### Future Monitoring

| Feature | Description | Phase |
|---|---|---|
| Uptime monitoring | Monitor site availability | Phase 2 |
| Performance monitoring | Track page load times | Phase 2 |
| Error tracking | Automated error capture (e.g., Sentry) | Phase 2 |
| AI performance monitoring | Track LLM response times and accuracy | Phase 3 |
| Database performance | Monitor query performance | Phase 3 |
| Real user monitoring | Track real user experience | Phase 3 |
| Alerting | Automated alerts for issues | Phase 3 |

---

## Scaling

### Current Scaling (Base44-Managed)

| Component | Scaling | Status |
|---|---|---|
| Frontend (CDN) | Auto-scaling (CDN handles traffic) | Implemented |
| Backend (Deno Deploy) | Auto-scaling (serverless) | Implemented |
| Database | Auto-scaling (Base44-managed) | Implemented |
| Authentication | Auto-scaling (Base44-managed) | Implemented |

### Future Scaling Considerations

| Aspect | Consideration | Phase |
|---|---|---|
| Database indexing | Add indexes for frequently queried fields | Phase 2 |
| Caching | Cache scheme catalog and policy data | Phase 2 |
| CDN optimization | Optimize static asset delivery | Phase 2 |
| Cold start optimization | Minimize backend function cold starts | Phase 3 |
| Connection pooling | Optimize database connections | Phase 3 |
| Multi-region deployment | Deploy to multiple regions for global reach | Phase 5 |
| Load testing | Test under concurrent user load | Phase 3 |

### Scalability Limitations (Current)

| Limitation | Impact | Mitigation |
|---|---|---|
| Client-side rule engine | Rules visible in source code | Move to server-side (Phase 2) |
| Prompt-based RAG | All 8 schemes injected — doesn't scale | Vector database RAG (Phase 3) |
| Mock data | Data not persisted | Migrate to entities (Phase 2) |
| No caching | Every request hits database | Add caching (Phase 2) |
| No rate limiting | Vulnerable to abuse | Add rate limiting (Phase 2) |

---

## Backup and Disaster Recovery

### Current State (Base44-Managed)

| Aspect | Status | Notes |
|---|---|---|
| Database backup | Base44-managed | Auto-backup frequency not visible |
| File backup | Base44-managed | If UploadFile is used |
| Code backup | Base44 builder | Code saved in builder |
| Disaster recovery | Base44-managed | RPO/RTO not defined |

### Recommended Backup Strategy

| Data | Backup Method | Frequency | Phase |
|---|---|---|---|
| Entity data | Export via SDK | Daily | Phase 2 |
| File storage | Base44-managed | Automatic | N/A |
| Code | Git (if 2-way sync) | On commit | Available |
| Environment variables | Document securely | On change | Phase 2 |

### Disaster Recovery Plan

| Step | Action | Phase |
|---|---|---|
| 1. Detect | Identify failure | Phase 3 |
| 2. Assess | Determine impact | Phase 3 |
| 3. Communicate | Notify stakeholders | Phase 3 |
| 4. Restore | Restore from backup | Phase 3 |
| 5. Verify | Verify system functioning | Phase 3 |
| 6. Review | Post-incident review | Phase 3 |

### RPO/RTO (Future)

| Metric | Target | Phase |
|---|---|---|
| RPO (Recovery Point Objective) | 1 hour | Phase 3 |
| RTO (Recovery Time Objective) | 4 hours | Phase 3 |

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- A Base44 account
- A modern browser (Chrome/Edge recommended for voice features)

### Steps
1. Open the project in Base44 Builder
2. Dependencies auto-install on first save
3. Preview available in the right panel
4. App auto-deploys on every save

### Local Vite Build (if exporting)
```bash
# Clone or download the project
npm install
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

### Environment Setup
- No `.env` file needed for Base44 builder
- `BASE44_APP_ID` is pre-populated by the platform
- For local development outside Base44, set up environment variables manually

---

## Deployment Checklist

### Pre-Deployment
- [ ] All code committed and saved in Base44
- [ ] Dependencies installed (`npm install`)
- [ ] Build succeeds (`npm run build`)
- [ ] Backend functions tested (`test_backend_function`)
- [ ] Entity schemas defined (`base44/entities/`)
- [ ] Seed data loaded (if needed)
- [ ] Environment variables configured
- [ ] Domain DNS configured

### Deployment
- [ ] Code saved in Base44 builder (auto-deploys)
- [ ] Frontend deployed to CDN
- [ ] Backend functions deployed to Deno Deploy
- [ ] Database entities created
- [ ] Authentication working

### Post-Deployment
- [ ] Domain verified in Base44 dashboard
- [ ] SSL certificate issued
- [ ] HTTPS active
- [ ] App accessible at civicai.online
- [ ] Authentication working (login, register, OTP)
- [ ] AI chat functional
- [ ] Family member CRUD working
- [ ] Notifications creating and displaying
- [ ] All 17 pages loading
- [ ] Voice features working (Chrome/Edge)
- [ ] Language switching working
- [ ] Monitoring dashboard accessible
- [ ] Function logs accessible

---

*Last updated: July 2026*