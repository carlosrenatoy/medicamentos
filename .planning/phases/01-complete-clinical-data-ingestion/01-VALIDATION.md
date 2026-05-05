# Phase 1: Complete Clinical Data Ingestion - Validation

**Defined:** 2026-05-05

## Context
This validation strategy ensures that the automated ingestion of the `loteX.json` files correctly populates `data.ts` without introducing regressions or type errors.

## Strategy
1. **Pre-Flight**: Verify `data.ts` compiles (`tsc --noEmit`). Count the number of entries currently in `INITIAL_MEDICINES`.
2. **Execution**: Run the ingestion script to parse `lote1.json` through `lote8.json` and rewrite `data.ts`.
3. **Post-Flight**:
   - Verify `tsc --noEmit` passes.
   - Run a test script to import `INITIAL_MEDICINES` and count its length to ensure it reaches ~140.
   - Inspect a sample injected object to verify the `MedicineDose` structure is strictly adhered to.
