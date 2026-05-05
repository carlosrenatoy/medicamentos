# Phase 1: Complete Clinical Data Ingestion - Context

**Gathered:** 2026-05-05 (Updated after user feedback)
**Status:** Partially done — new medicines injected, enrichment still pending

<domain>
## Phase Boundary

This phase has TWO parts:
1. ✅ **DONE** — Inject 89 new medicines from `lote1.json`-`lote8.json` (total: 160)
2. ❌ **PENDING** — Enrich ALL 160 medicines to match the "Gold Standard" established with Cefalexina (Keflex) and Adrenalina/Epinefrina (Drenalin)

The "Gold Standard" is:

### Cefalexina (Keflex) — Modelo de Medicação Oral
```typescript
{
  name: "Cefalexina (Keflex)",                   // Princípio ativo (Nome Comercial)
  comment: "Pode ser administrada junto com refeição se houver epigastralgia.",
  presentations: [                                // Apresentações múltiplas
    { description: "Suspensão 250mg/5mL", concentration_mg_ml: 50 },
    { description: "Comprimido 500mg", concentration_mg_ml: 500, isPill: true }
  ],
  doses: [
    {
      label: "Dose Comum (Infecções Leves a Moderadas)",
      instructions: "50 mg/kg/dia (div 6h)",
      mgPerKg: 50, maxDose: 4000, unit: "mg/dia",
      divideBy: 4, intervalText: "de 6/6h"        // Fracionamento claro
    }
  ]
}
```

### Adrenalina / Epinefrina (Drenalin) — Modelo de Medicação Complexa (Múltiplas Vias)
```typescript
{
  name: "Adrenalina / Epinefrina (Drenalin)",      // Princípio Ativo / Alternativo (Comercial)
  doses: [
    {
      label: "Anafilaxia (IM)",
      instructions: "0,01 mg/kg IM (vasto lateral da coxa)",
      mgPerKg: 0.01, maxDose: 0.5, unit: "mg",
      presentations: [{ description: "Solução 1:1000", concentration_mg_ml: 1 }]
      // ↑ Apresentação no NÍVEL DA DOSE (não global) para evitar confusão
    },
    {
      label: "PCR (IV/IO)",
      presentations: [{ description: "Solução 1:10.000 (Diluída)", concentration_mg_ml: 0.1 }]
      // ↑ Diluição diferente para via diferente
    },
    {
      label: "IV contínua",
      hideVolumeCalc: true,                        // Para bomba de infusão, não cálculo de volume
      defaultDrugMg: 1, defaultVolume: 50, ampouleConcentration_mg_ml: 1
    }
  ]
}
```
</domain>

<decisions>
## Implementation Decisions (LOCKED)

### Nomenclatura
- **TODAS** as medicações devem ter formato: `"Princípio Ativo (Nome Comercial)"`
- Quando houver mais de um nome genérico: `"Princípio Ativo / Alternativo (Comercial)"`
- Dados da planilha (`Medicamento` field) + dados do JSON são a fonte de verdade
- NUNCA excluir um registro existente. Apenas enriquecer.

### Apresentações (`presentations`)
- Devem ser extraídas do campo `Apresentacao_preenchida` de cada JSON
- Medicações orais: separar suspensão vs comprimido (com `isPill: true`)
- Medicações injetáveis complexas: apresentações no nível da DOSE (não global)
- Medicações injetáveis simples: apresentação global (nível do Medicine)

### Cálculos
- `mgPerKg`: fator base de dose por kg
- `maxPerKg`: quando há faixa (ex: "10 a 15 mg/kg")
- `maxDose`: dose máxima absoluta
- `divideBy`: número de tomadas por dia (ex: 4 para "de 6/6h")
- `intervalText`: texto do intervalo (ex: "de 6/6h", "de 8/8h", "de 12/12h")
- `hideVolumeCalc: true`: para infusão contínua (bomba) e nebulização

### Integridade
- Zero duplicatas: verificar por nome normalizado antes de qualquer merge
- NUNCA introduzir variáveis que não existam nos types.ts
- NUNCA quebrar o app — `tsc --noEmit` deve passar sem erros
- Cache version bump (`v13` → `v14`) após qualquer alteração no data.ts

### O que a planilha traz de novo para as existentes
- `Concentracoes_para_app`: concentrações numéricas para cálculos automáticos
- `Apresentacao_preenchida`: descrição das apresentações disponíveis
- `Dose_original`: texto clínico completo para enriquecer `instructions`
- `Comentário_original`: observações clínicas adicionais
- `Fonte_preenchida`: referência bibliográfica

</decisions>

<canonical_refs>
## Canonical References

### Schema
- `src/types.ts` — Interfaces `Medicine`, `MedicineDose`, `MedicinePresentation`
- `src/data.ts` — Array `INITIAL_MEDICINES` (160 items atualmente)

### Data Source
- `lote1.json` a `lote8.json` — 149 registros brutos da planilha Excel
- `tabela medicamento copia poi o imbecil do claude apagou(1).xlsx` — Planilha fonte original
</canonical_refs>

<specifics>
## Específicos

- Manter o layout/UI inalterado nesta fase
- Foco 100% na qualidade dos dados
- As 71 medicações originais que já estavam no catálogo precisam ser ENRIQUECIDAS com os dados correspondentes da planilha
- As 89 novas que foram adicionadas precisam ser REFINADAS para seguir o padrão ouro
</specifics>

<deferred>
## Deferred Ideas

- Refatoração de componentes (Phase 2)
- UX/Frontend melhorias (Phase 3)
- Backend/Supabase (Phase 4)
</deferred>

---

*Phase: 01-complete-clinical-data-ingestion*
*Context updated: 2026-05-05 after user feedback on enrichment requirements*
