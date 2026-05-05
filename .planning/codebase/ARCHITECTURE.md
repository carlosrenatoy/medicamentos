# Architecture Map

## Overview
The application is a purely client-side React app serving as a clinical calculator and medical reference (PediDose).

## Core Modules
- **`src/App.tsx`**: Main entry point and the single source of truth for the UI and state logic. It manages view states (Search, Admin, Reference, Infusion Calculator) and holds the local storage cache (`pedidose-medicines-vX`).
- **`src/data.ts`**: Canonical database of medical drugs. Uses an array of `Medicine` objects where each medicine contains specific `doses`. Recently refactored to allow presentations at the dose level.
- **`src/types.ts`**: TypeScript definitions for `Medicine`, `MedicineDose`, `DosePresentation`, etc.

## Data Flow
- Initial data loads from `src/data.ts` into a local storage hook in `App.tsx`.
- User interacts with the UI, which filters the list based on search and selected routes.
- Calculations are performed locally on the client using the selected medicine's weight/dose constraints.

## Abstractions
- Custom hooks like `useLocalStorage` are used to persist custom edits to medications by the user (the "admin" functionality).
