# CLAUDE.md — SCUT/UERP I-PASS

App web de **passagem de plantão** para o pronto-socorro pediátrico do Instituto da Criança. Toda UI, mensagens e commits em **PT-BR**.

## Stack

- **Frontend:** Vanilla JS (classes, sem framework) + Vite (dev server + build) + tipagem leve via `tsconfig` com `allowJs/checkJs`. Nunca propor migração para React/Vue/Svelte.
- **Backend:** Supabase (Postgres + Auth + RLS + Edge Functions), região `sa-east-1` (São Paulo, residência LGPD).
- **Hospedagem frontend:** Netlify, conectado ao GitHub. Deploy automático em push para `main`.
- **CI/CD:** GitHub Actions (`ci.yml`, `supabase-deploy.yml`, `deploy-preview.yml`, `release.yml`).
- **Testes:** Playwright (smoke E2E do fluxo de plantão). Sem unit tests por enquanto.

## Princípio inegociável: GitHub é a fonte da verdade

Fluxo: `branch → commit → PR → CI verde → merge em main → deploy automático`. Não rodar `supabase db push`, `supabase functions deploy`, `netlify deploy --prod` ou drag-drop manualmente contra produção. Schema, Edge Functions e frontend são todos publicados pelos workflows.

## Guardrails LGPD (CRÍTICO — NUNCA viole)

1. **PHI nunca só em `localStorage` em produção.** Toda escrita de `patients`/`handoff_events` vai para Supabase; localStorage é só cache offline write-through.
2. **Chaves de API de terceiros nunca no cliente.** A chave Gemini vive em `Deno.env.get('GEMINI_API_KEY')` na Edge Function `ai-resumo`. O frontend chama `supabase.functions.invoke('ai-resumo', ...)`, nunca `fetch('https://generativelanguage.googleapis.com/...')`.
3. **Nunca logar PHI** (`name`, `rghc`, `diagnostico`, `alergia`, qualquer campo de `patients`). Vale para `console.log`, `console.error`, telemetria, mensagens de erro.
4. **Toda mutação em `patients` gera linha em `audit_log`** via trigger. Não desabilitar o trigger, nem por "só pra teste".
5. **Sample data realista** (`getSamplePatients` em `js/final-app.js`) **não vai para produção**. Em prod, semeia somente leitos vazios.

## Don't-touch list

- **`index.html`** é o entrypoint canônico (consolidado na Fase 3 a partir do antigo `index-final.html`). Não criar variantes paralelas (`index-novo.html`, `index-v2.html`). Já tivemos quatro variantes; chega. O mapa interativo vive em `mapa-retaguarda.html`, alcançado pelo link 🗺️ Mapa no header.
- **Chaves de localStorage durante migração** (`buxo_patients_final`, `buxo_patients_porta`, `buxo_map_config`, `buxo_leitos_extras`): preservar shape exato até a Fase 6 concluir o switch para Supabase. `mapa-retaguarda.html` e `index.html` compartilham essas chaves.
- **`planta_ps.png`** + posições do mapa (`buxo_map_config`): a tabela `map_config` armazena tudo em `payload jsonb` para preservar o shape do front sem migrar 30 colunas.
- **Leitos fixos** (array em `final-app.js`, perto do construtor): migrar para a tabela `leitos` no seed `0004_seed.sql`; não hardcodar em código novo.
- **`setup_vps.sh` e `GUIA_DEPLOY_VPS.md`:** preservar como caminho alternativo de hospedagem. Não deletar.

## Convenções

- **IDs Postgres:** `uuid` (`default gen_random_uuid()`), nunca inteiros como `1001` que existem no JS atual.
- **Datas:** ISO-8601 UTC no banco (`timestamptz`); formatação local só no render.
- **Chaves localStorage legadas:** prefixadas `buxo_`. Não criar novas chaves; usar Supabase.
- **Termos clínicos a preservar sem traduzir:** leito, plantão, retaguarda, porta, gravidade (`stable|alert|unstable`), RGHC, DIH, MUC, SCATS.
- **Roles de usuário:** `medico | coordenador | enfermagem`.
- **Multi-tenant:** todas as tabelas têm `hospital_id`. Single-tenant agora (Instituto da Criança), mas o schema já está pronto.

## Comandos

```bash
npm install              # instalar deps
npm run dev              # Vite dev server (HMR), localhost:5173
npm run typecheck        # tsc --noEmit (valida JSDoc)
npm run lint             # ESLint
npm run format           # Prettier
npm run build            # gera dist/ para Netlify
npm run preview          # serve dist/ local
npm run e2e              # Playwright smoke test
```

Nunca rodar contra produção da sua máquina:

- ❌ `supabase db push --db-url $PROD`
- ❌ `supabase functions deploy ai-resumo`
- ❌ `netlify deploy --prod`

Para mudar produção, abra um PR. Sempre.

## Estrutura

```
.claude/commands/        # slash commands (spec, adr, migrate-feature)
.github/                 # workflows, templates, CODEOWNERS
specs/                   # specs por feature (NNNN-slug.md)
docs/adr/                # ADRs (NNNN-slug.md)
src/                     # JS modular (data/, auth/, types/)
supabase/migrations/     # SQL versionado
supabase/functions/      # Edge Functions (Deno)
e2e/                     # Playwright specs
js/                      # legado (final-app.js, mapa-retaguarda-app.js)
css/                     # legado (final-view.css, mapa-retaguarda.css)
assets/                  # imagens, planta_ps.png
```

## Onde achar contexto histórico

- `buxo.pdf` (417 KB) — PRD original; usar como fonte para extrair specs incrementalmente em `specs/NNNN-*.md`.
- `Cópia de BUXO SCUT I-PASS.docx` — versão Word do PRD (não rastreável; preserve mas não confie como verdade).
- `CHANGELOG.md` — histórico de releases SemVer.
- `docs/adr/` — decisões arquiteturais (uma por arquivo).

## Em caso de dúvida

1. Se a mudança toca PHI → reler **Guardrails LGPD**.
2. Se a mudança parece urgente e tentadora de fazer "só nesta vez" sem PR → não faça. Abra o PR.
3. Se você não sabe se uma feature está na spec → `grep -r` em `specs/`. Se não está, escreva spec primeiro (`/spec <slug>`).
