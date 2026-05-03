---
description: Migra uma feature de localStorage para Supabase (dual-write → switch read → drop localStorage)
argument-hint: <nome-feature>
---

Migre a feature `$ARGUMENTS` de `localStorage` para Supabase em três sub-passos. **Ordem canônica das features:** `patients` → `leitos`+`map_config` → `handoff_events`. Não pular ordem.

## Sub-passo 1 — Camada de repositório

Crie `src/data/$ARGUMENTS-repo.js` com JSDoc tipos. Exponha:

- `list(filter?)` — retorna array
- `get(id)` — retorna objeto ou null
- `upsert(obj)` — insere ou atualiza
- `remove(id)` — exclui

Substitua todas as chamadas diretas a `localStorage.getItem('buxo_$ARGUMENTS_*')` em `js/final-app.js` e `js/mapa-retaguarda-app.js` para usar o repo.

## Sub-passo 2 — Dual-write

O repo escreve em **Supabase + localStorage** simultaneamente. Lê de **localStorage** ainda. Se Supabase falhar, registra warning em `audit_log` mas não bloqueia o usuário.

Crie `src/admin/sync-status.html` mostrando o delta entre os dois (contador, lista de IDs divergentes).

Adicione spec em `specs/` referenciando este migrate-feature.

## Sub-passo 3 — Switch read + drop localStorage

**APENAS após 7 dias com paridade verificada via `sync-status.html`.** Repo passa a ler do Supabase; localStorage vira write-through cache opcional para offline.

Em PR final, remova o branch localStorage do repo.

## Antes de começar

1. Verifique se existe migração SQL para a feature em `supabase/migrations/`. Se não, crie `supabase/migrations/000N_$ARGUMENTS.sql` com tabela + RLS + audit trigger.
2. Verifique se existe spec em `specs/`. Se não, rode `/spec migrar-$ARGUMENTS-supabase`.
3. Lembre-se: **PHI nunca em `console.log`**. Veja `CLAUDE.md` → Guardrails LGPD.
