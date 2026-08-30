# Contributing Guidelines — CivicAI

> Developer guidelines for contributing to the CivicAI project

---

## Coding Standards

### General Principles

| Principle | Description |
|---|---|
| **SOLID** | Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion |
| **DRY** | Don't Repeat Yourself — extract reusable logic |
| **KISS** | Keep It Simple, Stupid — avoid over-engineering |
| **Separation of Concerns** | UI, business logic, and data access in separate layers |
| **Clean Architecture** | Presentation → Business Logic → Data Access → Infrastructure |

### JavaScript/React Standards

- Use **functional components** with hooks (no class components)
- Use **arrow functions** for component definitions
- Export components as **default exports**, named same as file
- Use **camelCase** for variables and functions
- Use **PascalCase** for component names and file names
- Use **UPPER_SNAKE_CASE** for constants
- Use **Tailwind CSS** for styling (no inline styles)
- Use **shadcn/ui** components from `@/components/ui/`
- Use **lucide-react** for icons (only icons that exist)
- Every import must resolve to a real file or package

### Code Style

```javascript
// ✅ Good
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icon";

export default function MyComponent({ prop }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await base44.entities.MyEntity.list();
    setData(result);
  };

  return (
    <div className="p-6">
      <Button onClick={loadData}>Refresh</Button>
    </div>
  );
}

// ❌ Bad — class component, inline styles, missing default export
class MyComponent extends React.Component {
  render() {
    return <div style={{ padding: "24px" }}>Hello</div>;
  }
}
```

### Tailwind CSS Standards

- Use **literal class strings** (Tailwind purge removes dynamic classes)
- Use **design tokens** from `src/index.css` (`bg-primary`, `text-foreground`, etc.)
- No hardcoded colors (`bg-[#ffffff]`, `bg-white`)
- No inline styles (`style={{ background: "#fff" }}`)
- Use `cn()` utility from `@/lib/utils` for conditional classes

```javascript
// ✅ Good
<div className="bg-primary text-primary-foreground rounded-xl p-4">
<div className={cn("p-4", isActive && "bg-primary")}>

// ❌ Bad
<div style={{ background: "#0052CC", padding: "16px" }}>
<div className={`bg-${color}-500`}>
```

### Entity Standards

- Entity schemas are full JSON objects — no comments or placeholders
- Entity files are stored as `base44/entities/{EntityName}.jsonc`
- Always use `write_file` for entity files (not `find_replace`)
- Built-in attributes (id, created_date, updated_date, created_by_id) are never declared

### Backend Function Standards

- Everything inside `Deno.serve(async (req) => { ... })`
- Return `Response` objects (not strings/objects)
- `await` all Base44 SDK calls
- Validate user auth with `base44.auth.me()`
- try/catch the handler body
- Declare variables before use
- No local imports (files deploy independently)
- Use `npm:` prefix for external deps
- JavaScript, not TypeScript (despite .ts extension — use JS syntax)

---

## Folder Structure

### Standard File Locations

| Type | Location | Example |
|---|---|---|
| Pages | `src/pages/` | `src/pages/Dashboard.jsx` |
| Components | `src/components/` | `src/components/MyCard.jsx` |
| UI Primitives | `src/components/ui/` | `src/components/ui/Button.jsx` |
| Layouts | `src/components/` | `src/components/AppLayout.jsx` |
| Hooks | `src/hooks/` | `src/hooks/useMyFeature.js` |
| Business Logic | `src/lib/` | `src/lib/calculator.js` |
| API/SDK | `src/api/` | `src/api/base44Client.js` |
| Context | `src/lib/` | `src/lib/AuthContext.jsx` |
| Entities | `base44/entities/` | `base44/entities/Task.jsonc` |
| Backend Functions | `base44/functions/` | `base44/functions/myFunc/entry.ts` |
| Workflows | `base44/workflows/` | `base44/workflows/MyFlow.jsonc` |
| Agents | `base44/agents/` | `base44/agents/myAgent.jsonc` |
| Documentation | `docs/` | `docs/README.md` |

### Import Aliases

- Always use `@/` alias for imports (never relative `../` paths)
- `@/` maps to `src/`
- Example: `import { base44 } from "@/api/base44Client"`

```javascript
// ✅ Good
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

// ❌ Bad
import { base44 } from "../../api/base44Client";
import { Button } from "../components/ui/button";
```

### Component Organization

- Small focused files: components of **50 lines or less**
- Every new component/page gets its **own file**
- Never add to an existing file
- Break oversized pages into components

---

## Branch Naming

### Branch Naming Convention

| Type | Format | Example |
|---|---|---|
| Feature | `feature/description` | `feature/ai-chat-persistence` |
| Bug Fix | `fix/description` | `fix/notification-unread-count` |
| Hotfix | `hotfix/description` | `hotfix/ssl-configuration` |
| Refactor | `refactor/description` | `refactor/rule-engine-extraction` |
| Documentation | `docs/description` | `docs/api-documentation` |
| Test | `test/description` | `test/rule-engine-unit-tests` |

### Rules
- Use lowercase with hyphens
- Be descriptive but concise
- Include ticket number if applicable: `feature/AI-123-chat-persistence`

---

## Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `chore` | Build process, dependencies, etc. |

### Examples

```
feat(ai-chat): add chat history persistence

- Create ChatSession entity for storing conversation history
- Update AIChat.jsx to load previous conversations
- Add conversation list sidebar

Closes #123
```

```
fix(rule-engine): correct PM-KISAN threshold edge case

Members with exactly 60 points were incorrectly marked as not eligible
due to using > instead of >= in the comparison.

Fixes #456
```

```
docs(api): add complete API documentation

Document all authentication, entity, and function APIs with examples.
```

### Rules
- Subject line: imperative mood, lowercase, no period
- Subject line: maximum 50 characters
- Body: wrap at 72 characters
- Body: explain what and why (not how — the code shows how)
- Footer: reference issues (Closes #123, Fixes #456)

---

## Code Review Process

### Pull Request Template

```markdown
## Description

[Brief description of what this PR does and why]

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactor (no functional changes)
- [ ] Performance improvement

## Changes Made

- [Change 1]
- [Change 2]
- [Change 3]

## Testing

- [ ] Tested locally
- [ ] All existing tests pass
- [ ] Added new tests (if applicable)
- [ ] Tested with `test_backend_function` (if backend changes)

## Checklist

- [ ] Code follows coding standards
- [ ] Self-reviewed code
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
- [ ] No new warnings
- [ ] Dependency changes documented
- [ ] Breaking changes documented

## Screenshots

[If UI changes, add before/after screenshots]

## Notes

[Any additional notes for reviewers]
```

### Review Criteria

Reviewers should check for:

| Criterion | Description |
|---|---|
| **Functionality** | Does the code do what it's supposed to do? |
| **Correctness** | Are there any bugs or edge cases? |
| **Security** | Are there security vulnerabilities? |
| **Performance** | Are there performance issues? |
| **Maintainability** | Is the code readable and maintainable? |
| **Standards** | Does it follow coding standards? |
| **Tests** | Are there adequate tests? |
| **Documentation** | Is the code documented? |
| **Breaking Changes** | Are breaking changes handled? |

### Review Process

1. Developer creates PR
2. At least one reviewer must approve
3. CI checks must pass
4. No merge conflicts
5. Developer merges after approval
6. Delete branch after merge

---

## Testing Guidelines

### Current Testing Status

| Test Type | Status |
|---|---|
| Unit tests | Not implemented |
| Integration tests | Not implemented |
| E2E tests | Not implemented |
| API testing | Available (test_backend_function) |
| Manual testing | Primary method |

### Testing Priorities (Future)

| Priority | Test Type | What to Test |
|---|---|---|
| High | Rule engine unit tests | Each scheme rule with various member profiles |
| High | Backend function tests | notifyStatusChange with all status types |
| Medium | Auth flow tests | Login, register, OTP, password reset |
| Medium | Entity CRUD tests | FamilyMember create/read/update/delete |
| Medium | AI response tests | LLM returns valid structured JSON |
| Low | UI component tests | Component rendering and interaction |
| Low | E2E tests | Full citizen journey |

### Testing Backend Functions

```javascript
// Via test_backend_function tool or Base44 dashboard
test_backend_function('notifyStatusChange', {
  application_id: "APP-001",
  new_status: "approved",
  service_name: "PM-KISAN"
});
// Check response and logs for errors
```

### Rule Engine Testing (Future)

```javascript
// Future unit test
describe('PM-KISAN Rule', () => {
  test('eligible farmer', () => {
    const member = { occupation: "Farmer", age: 55, aadhaar_linked: true, annual_income: 180000 };
    const result = schemeRules["pm-kisan"](member);
    expect(result.eligible).toBe(true);
    expect(result.benefit).toBe(6000);
  });

  test('not eligible non-farmer', () => {
    const member = { occupation: "Student", age: 24, aadhaar_linked: true, annual_income: 180000 };
    const result = schemeRules["pm-kisan"](member);
    // Check based on actual rule logic
  });
});
```

---

## Documentation Requirements

### When to Update Documentation

| Change Type | Documentation to Update |
|---|---|
| New feature | README.md, API.md, relevant docs |
| New API endpoint | API.md |
| New entity | DATABASE.md |
| New AI feature | AI.md |
| New rule engine rule | RULE_ENGINE.md |
| Security change | SECURITY.md |
| Deployment change | DEPLOYMENT.md |
| Governance change | AI_GOVERNANCE.md |
| Architecture change | ARCHITECTURE.md |

### Code Comments

- Comment **why**, not **what** (the code shows what)
- Comment complex business logic
- Comment non-obvious decisions
- Use JSDoc for function documentation

```javascript
/**
 * Calculates household benefit eligibility for all family members.
 * Uses deterministic scoring — no AI involved in eligibility decisions.
 * @param {Array} members - Array of FamilyMember entity records
 * @returns {Object} { totalBenefit, members, categoryBreakdown }
 */
function calculateHouseholdBenefits(members) {
  // ...
}
```

### README Updates

When adding a new feature, update:
1. **Features** section in `docs/README.md`
2. **Implementation Status** — label as Implemented, Prototype / Simulated, or Future Integration
3. Relevant documentation file (API.md, DATABASE.md, etc.)

---

## Best Practices

### Entity Design

- Use appropriate data types (string, number, boolean, enum)
- Set defaults for optional fields
- Use enums for fields with limited values
- Never store large content (base64, PDFs, blobs) — use UploadFile
- Mark required fields honestly
- Don't declare built-in attributes (id, created_date, updated_date, created_by_id)

### Backend Function Design

- Authenticate first: `base44.auth.me()`
- Return 401 for unauthenticated
- Return 403 for unauthorized (wrong role)
- Validate input parameters
- Use try/catch
- Return proper HTTP status codes
- Avoid heavy computations (use service role carefully)
- Paginate large queries

### Frontend Design

- Show loading indicators during async operations
- Handle error states
- Handle empty states
- Use Framer Motion for smooth transitions
- Design responsively (mobile + desktop)
- Use design tokens (not hardcoded values)
- Keep components small and focused

### AI / LLM Design

- Always use structured JSON schema for responses
- Inject context (don't rely on LLM memory)
- Use confidence scores
- Cite policy versions and portal URLs
- Include source_verified flag
- Flag for human review when uncertain
- Never let the LLM make eligibility decisions (rule engine does)

### Security

- Never hardcode secrets
- Never expose secrets to frontend
- Use `Deno.env.get()` for secrets in backend functions
- Validate and sanitize user input
- Use user-scoped entity access
- Check admin role for admin operations
- Use HTTPS (Base44-managed)
- Don't log sensitive data

### Performance

- Paginate database queries
- Use React Query for caching
- Lazy load heavy components
- Optimize images
- Minimize bundle size
- Use CDN (Base44-managed)

---

## Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/my-new-feature
```

### 2. Develop
- Edit code in Base44 builder (auto-deploys for testing)
- Test changes in preview
- Test backend functions with `test_backend_function`

### 3. Commit
```bash
git add .
git commit -m "feat(scope): description"
```

### 4. Push and Create PR
```bash
git push origin feature/my-new-feature
```
Create pull request with the template above.

### 5. Review and Merge
- Wait for reviewer approval
- Ensure CI passes
- Merge after approval
- Delete branch

---

## Contact

For questions about contributing to CivicAI:
- Review the documentation in `docs/`
- Check existing code for patterns
- Follow the standards in this document

---

*Last updated: July 2026*