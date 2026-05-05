# PediDose (Medicamentos)

## What This Is

PediDose is a client-side React application acting as a highly specific clinical calculator and medical reference for pediatric emergency care. It provides deterministic, protocol-validated dosage and dilution instructions based on a canonical Excel spreadsheet, avoiding unsafe automated approximations.

## Core Value

Absolute clinical determinism. The app must present exactly what the protocol dictates—including correct presentations, dilution volumes, and max doses—without hidden or unsafe automatic mathematical generalizations.

## Requirements

### Validated

- ✓ Client-side SPA architecture using React, Vite, Tailwind CSS.
- ✓ Base catalog of ~71 medications implemented in `data.ts`.
- ✓ Local UI with text search, route filtering, and basic CRUD ("Admin") using `useLocalStorage`.
- ✓ Refactored `InfusionCalculator` and `ReferenceView` with isolated, dose-specific presentations.
- ✓ Exterminated legacy Holliday-Segar fluid maintenance logic from the calculator.

### Active

- [ ] Complete the integration of the remaining ~70 medications from `lote1.json` to `lote8.json` into the `data.ts` catalog.
- [ ] Implement Spec-driven development by defining clear architectural boundaries and a scaling plan.
- [ ] Improve Frontend UX and restore any "lost functionalities" (e.g., custom UI components, specific flows) without breaking current layout initially.
- [ ] Plan and implement a backend/database layer (Supabase or similar) for scaling beyond local storage and allowing centralized protocol updates.

### Out of Scope

- [Immediate UI redesign] — The user explicitly requested to "manter o que temos e so trazer as melhorias e dados a mais da planilia sem mexer agora no layout".
- [Automated General Medical Calculators] — e.g. Holliday-Segar hydration or anything that guesses maintenance outside the strict medication guidelines.

## Context

- The project was previously built with a monolithic `App.tsx`.
- The user relies on a highly granular spreadsheet ("tabela medicamento copia...") containing ~140 medications.
- An AI assistant chunked the spreadsheet into 8 JSON files to avoid context limits, but stopped halfway through the integration.
- The user needs an architecture that scales robustly (Spec-driven development, Hardness Maps) because the application is dealing with critical pediatric medical data.

## Constraints

- **Clinical Accuracy**: No hallucinated dosages — strictly follow the provided protocols/JSONs.
- **Determinism**: Code must not auto-guess dilutions or max caps if not explicitly listed in the source data.
- **UX Stability**: Frontend UX is to be improved systematically later, current layout must be preserved.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Strict dose-specific presentations | Prevents dangerous cross-contamination of presentations (e.g. Adrenaline 1:1.000 vs 1:10.000) | ✓ Good |
| Remove Holliday-Segar | Pediatrics uses isotonic solutions now; old formula caused confusion and "30 mL/hora" defaults | ✓ Good |
| Spec-driven development | The user requested a robust scalable app with a clear PRD and scaling plan before major refactors | — Pending |

---
*Last updated: 2026-05-05 after initialization via GSD*
