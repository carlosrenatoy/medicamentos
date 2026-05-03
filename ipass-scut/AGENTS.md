# AGENTS.md

Este projeto usa as mesmas convenções para qualquer agente de IA (Claude Code, Cursor, Aider, Codex, etc.).

**Leia primeiro:** [`CLAUDE.md`](./CLAUDE.md) — stack, guardrails LGPD, don't-touch list, convenções.

**Antes de marcar tarefa como concluída, rode:**

```bash
npm run typecheck && npm run lint && npm run e2e
```

**Princípio inegociável:** GitHub é a fonte da verdade. Toda mudança passa por PR; nunca aplique migrations Supabase ou faça deploy manualmente contra produção.
