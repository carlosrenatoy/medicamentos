# Concerns Map

## Technical Debt
- `App.tsx` is monolithic (>1300 lines) and manages almost all state and UI. It needs to be broken down into smaller, composable components (e.g. `InfusionCalculator`, `ReferenceView`, `AdminView`, etc.).
- Medical data import from spreadsheet was left incomplete; `lote1.json` through `lote8.json` remain unimported, leaving the active catalog at ~71 out of 140 intended medications.

## Bugs / Fragile Areas
- Local storage caching logic (`pedidose-medicines-v12`) can lead to state inconsistency if the base `data.ts` is updated and users have conflicting cached configurations. Version bumping handles this but deletes user customizations.
- The `InfusionCalculator` relies heavily on strict null checking and parse rules for weight. Removing legacy features (like Holliday) previously broke UI rendering due to unhandled variable references (`bicResult`).

## Security
- None. Fully client-side app, no exposed endpoints or sensitive data handled.

## Performance
- Loading massive JSON blocks into state on mount might block the main thread minimally, but not currently a pressing issue given modern devices.
- Re-renders in `App.tsx` could be optimized, as any state change triggers a render of the entire application structure.
