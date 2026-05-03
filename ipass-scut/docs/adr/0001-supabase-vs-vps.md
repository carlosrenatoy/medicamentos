# 0001 — Backend: Supabase (sa-east-1) em vez de VPS auto-hospedado

- **Status:** accepted
- **Data:** 2026-05-01
- **Decisores:** @renatoepm70

## Contexto

O app está hoje 100% no cliente com `localStorage`, o que é incompatível com LGPD para dados clínicos pediátricos. Precisamos de banco real, autenticação, e proxy seguro para a API Gemini (chave nunca pode chegar ao navegador). Solo dev clínico não tem capacidade operacional para ser SRE noturno de um Postgres self-hosted.

## Decisão

Adotar **Supabase** como backend principal, na região `sa-east-1` (São Paulo):

- Postgres gerenciado com backups automáticos
- Auth (email+senha) embutido
- Row Level Security para isolamento por `hospital_id`
- Edge Functions (Deno) para esconder a chave Gemini server-side
- MCP autenticado já disponível na máquina do dev

## Consequências

- **Positivas:**
  - RLS substitui ~200 linhas de código de autorização que teriam que ser escritas e testadas
  - Residência de dados em São Paulo atende exigência LGPD
  - Backups, TLS e patching ficam com o provedor
  - Tier gratuito atende perfil de uso (5–30 usuários simultâneos)
- **Negativas / trade-offs:**
  - Lock-in moderado (mas Postgres + JWT são padrões portáveis)
  - Limites de tier free (500 MB DB, 2 GB transferência) podem virar Pro (US$25/mês) com crescimento
  - Edge Functions são Deno, não Node — curva pequena
- **Reversibilidade:** moderada. Schema é Postgres puro; migrar para outro Postgres é pg_dump/pg_restore. Auth e RLS exigiriam reescrita.

## Alternativas consideradas

1. **Fastify + Prisma + Postgres no VPS Ubuntu existente** — descartado: solo dev assumiria auth, backups, TLS, patching, on-call. Risco operacional alto para sistema clínico.
2. **Firebase** — descartado: data residency em BR é menos clara; PHI em Firestore tem precedentes problemáticos com LGPD; NoSQL piora migração futura.
3. **Pocketbase auto-hospedado** — descartado: imaturo para PHI, comunidade pequena, escalabilidade incerta.

## Referências

- Spec `specs/0001-passagem-de-plantao.md`, `specs/0002-mapa-retaguarda.md`
- LGPD Lei 13.709/2018; CFM Resolução 2.314/2022
