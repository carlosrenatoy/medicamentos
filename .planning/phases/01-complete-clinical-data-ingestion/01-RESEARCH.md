# Phase 1: Complete Clinical Data Ingestion - Research

## Objective
Identify how to successfully parse 8 JSON batch files (`lote1.json` - `lote8.json`) and append them into the existing `src/data.ts` TypeScript file using the `MedicineDose` structure.

## Findings
- The `src/data.ts` file exports a `INITIAL_MEDICINES` array of type `Medicine[]`.
- Each item must conform to:
```typescript
interface Medicine {
  id: string;
  name: string;
  doses: MedicineDose[];
  comment?: string;
  isCustom?: boolean;
}
```
- The JSON files contain raw objects with keys like `Medicação`, `Dose_original`, `Concentracoes_para_app`, etc.
- A script will be needed to read these JSON files, map their keys to the new `MedicineDose` structure (including dose-specific `presentations`), and inject the new objects into `src/data.ts`.

## Validation Architecture
- **Method:** Automated script parsing and static type checking.
- **Verification:** Ensure `npm run lint` passes after modification and `src/data.ts` compiles correctly. Verify that the length of `INITIAL_MEDICINES` matches the total number of distinct medications from the batches + existing ones.
