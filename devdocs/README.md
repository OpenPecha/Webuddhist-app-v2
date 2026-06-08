# WeBuddhist v2 — Migration Dev Docs

Documentation hub for migrating **WeBuddhist** from **Flutter** (`WeBuddhist-app`) to
**React Native + Expo** (`Webuddhist-app-v2`).

These are **migration PRDs**: each one captures the source-of-truth behavior from the
Flutter app and defines what v2 must build to reach (or exceed) parity.

---

## How this folder is organized

```
devdocs/
├── README.md                  # This file — index + how to read/write PRDs
├── MIGRATION_OVERVIEW.md       # Program-level PRD (read this first)
├── templates/
│   └── FEATURE_PRD_TEMPLATE.md # Copy this to start a new PRD
├── parity/
│   └── PARITY_MATRIX.md        # Feature × route × status dashboard
├── foundation/                 # Cross-cutting PRDs (write/build first)
│   ├── 00-app-shell-navigation.md
│   ├── 01-auth-guest-onboarding.md
│   ├── 02-api-networking.md
│   ├── 03-local-storage-offline.md
│   ├── 04-i18n-theming.md
│   ├── 05-analytics.md
│   └── 06-notifications.md
└── features/                   # One PRD per feature domain
    ├── home.md
    ├── series.md
    ├── plans.md
    ├── reader.md
    ├── texts-library.md
    ├── ai-search.md
    ├── recitation.md
    ├── practice.md
    ├── story-view.md
    ├── meditation-prayer-of-day.md
    ├── settings-profile.md
    └── onboarding.md
```

---

## Reading order

1. **[MIGRATION_OVERVIEW.md](./MIGRATION_OVERVIEW.md)** — why, scope, stack mapping, phasing, risks.
2. **[parity/PARITY_MATRIX.md](./parity/PARITY_MATRIX.md)** — current status of every feature.
3. **Foundation PRDs** — navigation, auth, networking. These unblock everything else.
4. **Feature PRDs** — pick by priority wave (see overview).

## Writing a new PRD

1. Copy `templates/FEATURE_PRD_TEMPLATE.md`.
2. Fill every section. If a section is N/A, write "N/A — reason".
3. Map **every** in-scope Flutter screen/route to a v2 route (or mark "won't migrate").
4. Copy API request/response shapes from the Flutter `data/` layer — don't invent them.
5. Make acceptance criteria testable without reading Flutter source.
6. Add/update the feature's row in `parity/PARITY_MATRIX.md`.

## Status vocabulary

| Status | Meaning |
|--------|---------|
| `Not started` | No v2 code, no PRD |
| `PRD draft` | PRD being written |
| `PRD approved` | Reviewed by product + eng |
| `In progress` | v2 implementation underway |
| `Parity` | v2 matches Flutter behavior |
| `Improved` | v2 intentionally differs/better (documented) |
| `Won't migrate` | Deliberately dropped (documented) |

---

## Source-of-truth repos

| Repo | Role | Stack |
|------|------|-------|
| `WeBuddhist-app` | Baseline behavior (source of truth) | Flutter, Riverpod, GoRouter, Dio |
| `Webuddhist-app-v2` | Migration target | Expo SDK 56, Expo Router, React Query, Auth0, Uniwind |

Backend is shared and unchanged: `https://api.webuddhist.com/api/v1/`.
