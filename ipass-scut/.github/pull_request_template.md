## O que muda

<!-- 1-3 frases explicando o que e por quê. Foque no "por quê". -->

## Spec / ADR

- [ ] Spec referenciada: `specs/NNNN-*.md`
- [ ] ADR criado (se decisão arquitetural): `docs/adr/NNNN-*.md`

## Checklist obrigatório

- [ ] `npm run typecheck` passa local
- [ ] `npm run lint` passa local
- [ ] `npm run e2e` passa local (ou justificativa abaixo)
- [ ] `CHANGELOG.md` atualizado (em "Não publicado")

## Checklist LGPD (obrigatório se tocar `patients`, `handoff_events`, `audit_log` ou Edge Functions)

- [ ] Nenhum `console.log` ou erro propaga PHI (`name`, `rghc`, `diagnostico`, `alergia`, etc.)
- [ ] Nenhuma chave de API de terceiros vai para o cliente
- [ ] PHI escreve em Supabase com RLS, não só em `localStorage`
- [ ] Toda mutação em `patients` cobre o trigger de `audit_log`

## Screenshots / vídeo (se UI)

<!-- arrasta aqui antes/depois -->

## Risco e plano de rollback

<!-- "git revert + merge" basta? Migration nova? Edge Function?
     Se migration: a coluna nova é nullable? RLS continua válida em downgrade? -->
