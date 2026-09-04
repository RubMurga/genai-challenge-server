# Agent notes

## Before committing

Always do both of these and only commit if they succeed:

1. **Build** the apps to catch TypeScript errors:

```bash
bun run build --filter=@backend/api --filter=@frontend/web
```

2. **Run the test suite** (use non-watch mode for API):

```bash
bun run --filter @backend/api test:run
```

Do not commit or push if either step fails. Fix the failures first, then re-run build and tests.

## Auth and sessions

Hard-won rules live in `.cursor/rules/auth-session.mdc`. Do not re-learn them in a new `.md`. If you change login or cookies, update that rule in the same change as the code.

## Markdown

Do not add README, ARCHITECTURE, LESSONS, or other `.md` files unless the user asks. Durable guidance belongs in `AGENTS.md` and `.cursor/rules/*.mdc`, next to the code they describe. If a rule and the code disagree, fix both together — never add a third doc.
