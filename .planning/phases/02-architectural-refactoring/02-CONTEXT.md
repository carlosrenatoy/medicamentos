# Phase 2: Architectural Refactoring - Context

**Gathered:** 2026-05-05
**Status:** Ready for planning

<domain>
## Phase Boundary

**Goal**: Break down the monolithic `App.tsx` into scalable, spec-driven components.
This phase focuses strictly on reorganizing the internal codebase structure without changing any user-facing layout, logic, or behavior.
</domain>

<decisions>
## Implementation Decisions

### Component Granularity
- **D-01:** Extract only the major views (`SearchView`, `InfusionCalculator`, `AdminView`, `ReferenceView`). Do not extract deep atomic UI components (like Buttons or Inputs) in this phase to absolutely minimize the risk of visual regressions.

### State Management
- **D-02:** Use Prop Drilling. `App.tsx` will remain the central state orchestrator holding the `medicines`, `viewState`, and `searchParams`. It will pass these down explicitly as props to the extracted View components. Avoid React Context or external libraries (like Zustand) for now to keep the architecture simple and traceable.

### File Structure
- **D-03:** Use a flat `src/components/` directory for the extracted views (e.g., `src/components/SearchView.tsx`). Do not use domain-driven feature folders (e.g., `features/search`) as the app's scope is currently too small to warrant the extra boilerplate.

### the agent's Discretion
- The planner and executor have discretion on exactly how to type the Prop interfaces for the extracted components, as long as it adheres strictly to `src/types.ts`.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — Specifically `[ARCH-01, ARCH-02, ARCH-03, ARCH-04]` and the absolute constraint that there must be "No visual regressions" and layout must be identical.
- `.planning/codebase/ARCHITECTURE.md` — Outlines the core role of `App.tsx` as the single source of truth for the UI and state logic.
</canonical_refs>
