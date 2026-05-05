# Roadmap: PediDose (Medicamentos)

## Overview

The journey to stabilize, complete, and scale the PediDose clinical calculator. This roadmap focuses on achieving clinical data parity with the original ~140 medication spreadsheet, refactoring the legacy monolithic codebase into scalable components via Spec-driven development, and ultimately preparing the app for backend integration without disrupting the current frontend layout.

## Phases

- [ ] **Phase 1: Complete Clinical Data Ingestion** - Parse and inject `lote1.json` through `lote8.json` into the `data.ts` catalog.
- [ ] **Phase 2: Architectural Refactoring** - Extract `App.tsx` views into standalone components while preserving the UI.
- [ ] **Phase 3: UX & Lost Functionalities** - Reintroduce missing UX flows and ensure component parity with legacy versions.
- [ ] **Phase 4: Backend Strategy** - Plan and initiate the migration to Supabase for centralized protocol management.

## Phase Details

### Phase 1: Complete Clinical Data Ingestion
**Goal**: Reach parity with the original 140-item medication spreadsheet.
**Depends on**: Nothing (first phase)
**Requirements**: [DATA-01, DATA-02, DATA-03]
**Success Criteria** (what must be TRUE):
  1. The app lists approximately 140 distinct medications in the search view.
  2. All newly imported medications use the `MedicineDose` format with dose-level presentations.
  3. No legacy generalized calculators (like Holliday) are present in the new items.
**Plans**: 1 plan

Plans:
- [ ] 01-01: Parse `lote1.json` through `lote8.json` and append to `INITIAL_MEDICINES` in `src/data.ts`.

### Phase 2: Architectural Refactoring
**Goal**: Break down the monolithic `App.tsx` into scalable, spec-driven components.
**Depends on**: Phase 1
**Requirements**: [ARCH-01, ARCH-02, ARCH-03, ARCH-04]
**Success Criteria** (what must be TRUE):
  1. `App.tsx` is primarily a state orchestrator and router, not a massive UI file.
  2. The frontend layout looks completely identical to the pre-refactor state.
  3. Spec-driven development boundaries (Props, State) are clearly defined.
**Plans**: 2 plans

Plans:
- [ ] 02-01: Extract `InfusionCalculator` and `ReferenceView`.
- [ ] 02-02: Extract `AdminView` and `SearchView`.

### Phase 3: UX & Lost Functionalities
**Goal**: Restore functionalities that were lost during past iterations and improve specific UX flows.
**Depends on**: Phase 2
**Requirements**: [UX-01, UX-02]
**Success Criteria** (what must be TRUE):
  1. Missing user flows (e.g. specific calculator behaviors, printing) are identified and restored.
  2. Component layout remains consistent.
**Plans**: 1 plan

Plans:
- [ ] 03-01: Audit UX vs original codebase and restore missing features.

### Phase 4: Backend Strategy
**Goal**: Prepare the app for centralized updates to bypass `localStorage` limitations.
**Depends on**: Phase 3
**Requirements**: [BACK-01, BACK-02, BACK-03, BACK-04] (Deferred to v2)
**Success Criteria** (what must be TRUE):
  1. Supabase project initialized and schema mapped to `MedicineDose`.
  2. "Admin" users can sync protocol updates remotely.
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Complete Clinical Data Ingestion | 0/1 | Not started | - |
| 2. Architectural Refactoring | 0/2 | Not started | - |
| 3. UX & Lost Functionalities | 0/1 | Not started | - |
| 4. Backend Strategy | 0/0 | Not started | - |
