# Requirements: PediDose (Medicamentos)

**Defined:** 2026-05-05
**Core Value:** Absolute clinical determinism. The app must present exactly what the protocol dictates—including correct presentations, dilution volumes, and max doses—without hidden or unsafe automatic mathematical generalizations.

## v1 Requirements

### Data Integrity

- [ ] **DATA-01**: Complete the parsing and integration of ~70 remaining medications from `lote1.json` through `lote8.json` into `src/data.ts`.
- [ ] **DATA-02**: Ensure all integrated medications follow the exact `MedicineDose` structure (dose-level presentations).
- [ ] **DATA-03**: Validate the absence of hallucinated variables across all new doses.

### Architecture & Refactoring

- [ ] **ARCH-01**: Refactor `App.tsx` by extracting the `InfusionCalculator` into a standalone component (`src/components/InfusionCalculator.tsx`).
- [ ] **ARCH-02**: Extract `ReferenceView` into a standalone component (`src/components/ReferenceView.tsx`).
- [ ] **ARCH-03**: Extract `AdminView` into a standalone component (`src/components/AdminView.tsx`).
- [ ] **ARCH-04**: Extract `SearchView` into a standalone component (`src/components/SearchView.tsx`).

### UX & Lost Features

- [ ] **UX-01**: Restore any previously lost frontend functionalities (e.g. "print" or "export" functions if they existed).
- [ ] **UX-02**: Ensure the layout strictly matches the existing aesthetic (Tailwind utilities) during refactoring. No visual regressions.

## v2 Requirements

### Backend & Scalability

- **BACK-01**: Integrate Supabase for centralized database management.
- **BACK-02**: Implement user authentication to secure the "Admin" view.
- **BACK-03**: Migrate from local storage modifications to server-side updates.
- **BACK-04**: Sync clinical protocols remotely to allow instant updates without app rebuilds.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Visual Redesign | Explicitly requested by the user to maintain the current layout while implementing the refactor and data ingestion. |
| Automated Hydration Calculations | Holliday-Segar logic was removed as it is deprecated in current pediatric protocols for isotonic solutions. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 1 | Pending |
| ARCH-01 | Phase 2 | Pending |
| ARCH-02 | Phase 2 | Pending |
| ARCH-03 | Phase 2 | Pending |
| ARCH-04 | Phase 2 | Pending |
| UX-01 | Phase 3 | Pending |
| UX-02 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 9 total
- Mapped to phases: 9
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-05*
*Last updated: 2026-05-05 after initial definition*
