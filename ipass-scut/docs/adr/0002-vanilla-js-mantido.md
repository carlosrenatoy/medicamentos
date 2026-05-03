# 0002 — Manter Vanilla JS; adicionar tipagem leve via tsconfig checkJs

- **Status:** accepted
- **Data:** 2026-05-01
- **Decisores:** @renatoepm70

## Contexto

`js/final-app.js` (1773 linhas) e `js/mapa-retaguarda-app.js` (~1000 linhas) implementam todo o app em classes JS vanilla. O dev entende o código. Reescrever em React/Vue é detour de 2-3 meses sem entregar valor clínico — o tempo é melhor gasto migrando para Supabase + RLS + Edge Function.

## Decisão

Manter vanilla JS como linguagem do app. Adicionar `tsconfig.json` com `allowJs: true, checkJs: true` para captura de erros via JSDoc, sem etapa de transpile. Adicionar Vite como dev server e bundler.

## Consequências

- **Positivas:**
  - Zero rewrite; risco de regressão clínica baixo
  - Dev mantém produtividade
  - Bundle pequeno (sem framework runtime); bom para conexão hospitalar pobre
  - Vite traz HMR sem mudar a linguagem
- **Negativas / trade-offs:**
  - Sem ergonomia de componentes; cada feature nova continua adicionando à classe `BuxoSystem`
  - JSDoc é menos expressivo que TypeScript real
  - Sem ecosystem de libs React (mas raras necessárias aqui)
- **Reversibilidade:** fácil. Se em N meses formos para framework, podemos migrar página por página (Astro islands, Lit, etc.).

## Alternativas consideradas

1. **React + Vite** — bom long-term, mas custo de rewrite imediato é alto.
2. **Lit (Web Components)** — meio-termo elegante, mas requer reescrever os renderers de card/mapa.
3. **htmx + server-rendered** — mudaria toda a topologia do app.

## Referências

- ADR `0001-supabase-vs-vps.md`
- `CLAUDE.md` → Stack
