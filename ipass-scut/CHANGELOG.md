# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

## [Não publicado]

### Adicionado

- Harness agêntico: `CLAUDE.md`, `AGENTS.md`, `.claude/commands/`, `mcp.json`, `specs/`, `docs/adr/`
- Templates GitHub: `CODEOWNERS`, PR template, ISSUE templates, `dependabot.yml`
- Toolchain: `package.json`, `vite.config.js`, `tsconfig.json`, `.prettierrc`, `eslint.config.js`, `.env.example`

### Segurança

- Identificadas duas exposições críticas a corrigir antes de produção:
  - Chave Gemini em `localStorage.buxo_gemini_key` (cliente) → mover para Edge Function (Fase 5)
  - PHI em `localStorage.buxo_patients_*` → migrar para Supabase com RLS (Fase 6)

## [0.1.0] — 2026-05-01

### Adicionado

- Estado inicial congelado do app pré-backend.
- Vanilla JS + `localStorage` + chamada Gemini direto do cliente.
- Views: Retaguarda (lista + mapa) e Porta.
- Documentos PRD: `buxo.pdf`, `Cópia de BUXO SCUT I-PASS.docx`.
- Deploy via Netlify drag-drop ou VPS Nginx (`setup_vps.sh`).
