# 0003 — Cleanup de iterações legadas (HTML/JS/CSS)

- **Status:** accepted (executado em 2026-05-03)
- **Data:** 2026-05-01
- **Decisores:** @carlosrenatoy

## Contexto

O repositório acumulou variantes paralelas de iteração: 4 entrypoints HTML (`index.html`, `index-buxo.html`, `index-inline.html`, `index-final.html`), 7 arquivos JS (`app.js`, `buxo-app.js`, `inline-edit-app.js`, `dashboard-app.js`, `app-v10-safe.js`, além dos canônicos `final-app.js` e `mapa-retaguarda-app.js`), e 13 CSS (`layout-v4.css` a `layout-v10-safe.css`, `dashboard-view.css`, `inline-edit.css` etc.). Apenas `index-final.html` + `final-app.js` + `final-view.css` + `mapa-retaguarda.{html,js,css}` são usados em produção. Os demais são iterações abandonadas que confundem agentes de IA, ferramentas de busca e o próprio dev.

## Decisão (executada)

Em commit dedicado da Fase 3:

- **Consolidado** `index-final.html` → `index.html` (sobrescrevendo a versão Feb 19 simplificada). O novo `index.html` mantém branding SCUT/UERP I-PASS, toggle Retaguarda/Porta, `saveIndicator`, e troca o sub-toggle Lista/Mapa interno por um link `<a href="mapa-retaguarda.html">`. O mapa interativo passa a viver só em `mapa-retaguarda.html`.
- **Deletados (HTML):** `index-buxo.html`, `index-inline.html`, `index-final.html`
- **Deletados (JS):** `js/app.js`, `js/buxo-app.js`, `js/inline-edit-app.js`, `js/dashboard-app.js`, `js/app-v10-safe.js`
- **Deletados (CSS):** `css/layout-v4.css`, `css/layout-list-v5.css`, `css/layout-premium-v6.css`, `css/layout-v7-final.css`, `css/layout-v8-clean.css`, `css/layout-v9-refactor.css`, `css/layout-v10-safe.css`, `css/dashboard-view.css`, `css/inline-edit.css`
- **Deletados (artifacts):** `dist/`, `dist.zip` e `criar_pacote_deploy.bat` (substituído por `npm run build`)
- **Mantidos:** `js/final-app.js`, `js/mapa-retaguarda-app.js`, `css/final-view.css`, `css/styles.css`, `css/buxo-styles.css`, `css/mapa-retaguarda.css` (auditoria de overlap entre os 3 primeiros fica para depois — não bloqueia migração ao Supabase)
- **Código morto removido de `js/final-app.js`:** `renderMapView`, `renderMapItems`, `createBedCardHtml`, `setupDragAndDrop`, `toggleMapEditing`, `cancelMapEditing`, `saveMapConfig`, `addLeitoExtra`, `removeLeitoExtra`, e o estado `subView`/`mapConfig`/`isEditingMap`/`leitosExtras` (≈ 230 linhas). As arrays `leitosFixos`, `salasEspeciais`, `leitosPorta` ficam como fonte do dropdown de leitos.
- **Bugs corrigidos em `js/mapa-retaguarda-app.js`:** seletores CSS quebrados com espaços (`[data - filter]`, `.mr - filter - chip`, `mr - toast`), HTML do cockpit quebrado (`< div >`, `< !--COL X-- >`), labels de extras com espaço sobrando (`Extra 18 ` vs `Extra 18`).

## Consequências

- **Positivas:**
  - 6 HTML → 2; 7 JS → 2; 13 CSS → 3 ou menos
  - Agentes de IA não confundem mais qual arquivo é canônico
  - Build do Vite mais rápido
  - Onboarding de novo dev (ou nova conversa Claude) muito mais simples
- **Negativas / trade-offs:**
  - Histórico das iterações fica só no `git log` (mas tudo bem — é git, é o lugar certo)
  - Se algum estilo foi acidentalmente importado de um v6 e esquecemos, vai aparecer regressão visual no smoke test E2E
- **Reversibilidade:** trivial via `git revert`.

## Alternativas consideradas

1. **Mover para pasta `legacy/`** — mantém poluição visual, agentes ainda leem, e ninguém olha no `legacy/` mesmo. Pior dos dois mundos.
2. **Deixar como está** — o motivo desta decisão.

## Referências

- Spec stack: ADR `0002-vanilla-js-mantido.md`
- `CLAUDE.md` → Don't-touch list (`index-final.html`)
