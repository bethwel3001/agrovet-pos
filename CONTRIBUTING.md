# Contributing to AgroVet POS

## Branching Strategy

```
main (protected — no direct pushes)
  └── feat/module-a-infra        ← Dev 1
  └── feat/module-b-bot          ← Dev 2
  └── feat/module-c-etims        ← Dev 3
  └── feat/module-d-receipt      ← Dev 4
  └── feat/module-e-web          ← Dev 5
```

**Rules:**
- Nobody pushes directly to `main`
- All changes go through a Pull Request
- Every PR needs at least **1 approval** from another team member before merging
- Keep PRs scoped to your module — don't touch other modules without discussing first

---

## Workflow

### 1. Clone & setup
```bash
git clone https://github.com/savin2001/agrovet-pos.git && cd agrovet-pos
bash infra/scripts/setup.sh
```

### 2. Create your branch
```bash
git checkout -b feat/module-[letter]-[your-name]
# Examples:
# git checkout -b feat/module-a-james
# git checkout -b feat/module-b-mercy
# git checkout -b feat/module-e-brian
```

### 3. Work on your module
- Read your module's `README.md` first
- Read `docs-technical/PRD.md` for full context
- Only edit files within your module's directory

### 4. Commit often with clear messages
```bash
git add apps/api/src/parser/command.parser.ts
git commit -m "feat(bot): add sell command parser with unit detection"
```

**Commit message format:**
```
type(module): short description

Types: feat, fix, docs, chore, test
Modules: infra, db, bot, etims, receipt, web
```

### 5. Push your branch
```bash
git push -u origin feat/module-b-mercy
```

### 6. Open a Pull Request
- Go to https://github.com/savin2001/agrovet-pos/pulls
- Click "New Pull Request"
- Base: `main` ← Compare: your branch
- Add a description of what you built
- Request review from at least 1 teammate
- **Do NOT merge your own PR** — wait for approval

### 7. Review others' PRs
- Check the "Pull Requests" tab regularly
- Review code, leave comments, approve or request changes
- Approve → the author merges

---

## Module Ownership

| Module | Directory | Owner |
|--------|-----------|-------|
| A — Infra & DB | `infra/`, `packages/db/` | TBD |
| B — WhatsApp Bot | `apps/api/src/webhook/`, `parser/`, `session/`, `openwa/` | TBD |
| C — KRA eTIMS | `apps/api/src/etims/` | TBD |
| D — Receipt Gen | `apps/api/src/receipt/` | TBD |
| E — Web Dashboard | `apps/web/` | TBD |

Update this table with actual names once modules are assigned.

---

## Staying in Sync

Pull latest `main` into your branch regularly to avoid merge conflicts:

```bash
git checkout main
git pull origin main
git checkout feat/module-b-mercy
git merge main
# Resolve conflicts if any, then continue working
```

---

## Need Help?

- Check your module's `README.md` for implementation guide
- Check `docs-technical/PRD.md` for the full spec
- Ask in the team group chat before making changes outside your module
