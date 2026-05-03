---
description: Cria um Architecture Decision Record em docs/adr/NNNN-<slug>.md
argument-hint: <slug>
---

Crie um arquivo `docs/adr/NNNN-<slug>.md` onde:

1. `NNNN` = próximo número incremental de 4 dígitos baseado nos arquivos em `docs/adr/`.
2. `<slug>` = `$ARGUMENTS` em kebab-case PT-BR.

**Template do ADR (siga exatamente):**

```markdown
# NNNN — Título da decisão

- **Status:** proposed
- **Data:** YYYY-MM-DD
- **Decisores:** @renatoepm70

## Contexto

(Por que esta decisão precisa ser tomada agora? Qual o problema/restrição?)

## Decisão

(O que foi decidido, em uma frase clara.)

## Consequências

- **Positivas:** ...
- **Negativas / trade-offs:** ...
- **Reversibilidade:** (fácil / difícil / irreversível)

## Alternativas consideradas

1. ...
2. ...

## Referências

- Spec relacionada: `specs/NNNN-*.md`
- Discussão: PR #NN
```

Após criar, pergunte ao usuário pelo título e pelo contexto inicial. Idioma PT-BR.
