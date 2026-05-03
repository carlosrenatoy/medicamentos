---
description: Cria uma nova spec em specs/NNNN-<slug>.md a partir do template
argument-hint: <slug>
---

Crie um arquivo `specs/NNNN-<slug>.md` onde:

1. `NNNN` é o próximo número incremental de 4 dígitos baseado nos arquivos existentes em `specs/` (use Glob `specs/*.md` para descobrir o maior número e some 1).
2. `<slug>` é o argumento passado pelo usuário (`$ARGUMENTS`), em kebab-case PT-BR (ex.: `alta-hospitalar`, `prescricao-eletronica`).
3. O conteúdo é o template de `specs/_template.md` com as seções vazias preparadas para preenchimento.
4. Após criar, abra o arquivo e pergunte ao usuário pela descrição inicial do `## Problema` para preencher.

**Antes de criar:** verifique se já não existe spec com slug similar via Grep — se existir, sugira atualizar a existente em vez de criar nova.

**Lembre-se:**

- Idioma PT-BR estrito.
- Critérios de aceitação em formato `Dado / Quando / Então`.
- Sempre referenciar páginas do `buxo.pdf` na seção `## Referências` quando aplicável.
