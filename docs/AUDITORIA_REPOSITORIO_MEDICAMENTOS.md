# Auditoria do repositório Medicamentos

Data: 2026-05-04

## Estado do remoto

- Repositório: `carlosrenatoy/medicamentos`.
- Branch principal: `main`.
- PR 1 aberta: ajuste de conteúdo/drogas a partir de anexos.
- PR 2 aberta: arquitetura de prescrição determinística sem IA.
- PR 2 está divergente da `main` e precisa ser atualizada antes do merge.

## O que existe na main

- App React/Vite funcional.
- Busca de medicamentos.
- Campo de peso.
- Cálculo simples por peso.
- Tela de detalhe do medicamento.
- Calculadora de infusão/BIC.
- Painel administrativo local.
- Base em `src/data.ts`.

## Problema estrutural atual

A `main` ainda usa o modelo antigo:

```ts
MedicineDose {
  mgPerKg
  maxPerKg
  maxDose
  unit
}
```

Esse modelo é perigoso porque `mgPerKg` está sendo usado para unidades diferentes, como mcg/kg/min, mcg/kg/h, mEq/kg e g/kg.

## O que a PR 2 adiciona

- Modelo estruturado de prescrição pediátrica.
- Motor determinístico de infusão contínua.
- Regras de diluição padrão.
- Registro de fontes confiáveis.
- Componente de fontes.
- Auditoria de prontidão para bloquear prescrição sem fonte/validação.
- Gerador inicial para medicações não contínuas.
- ASC estimada somente por peso.

## Decisão definitiva sobre estatura

Estatura não deve aparecer no app.

Motivo:

- O app é para médicos de pronto-socorro pediátrico.
- No pronto-socorro não se deve depender de medir estatura.
- O fluxo precisa ser rápido e baseado em peso.

Quando houver necessidade de superfície corpórea, usar apenas ASC estimada por peso, marcada como estimativa.

Fórmula implementada:

```txt
ASC estimada = (4 x peso + 7) / (peso + 90)
```

## O que ainda não está funcionando adequadamente

1. Busca no celular: o teclado atrapalha a visualização dos resultados.
2. `StandardDilutionWarning` existe, mas ainda não está ligado à tela principal.
3. `SourceLinks` existe, mas ainda não está ligado a cada medicação/dose.
4. Periférico/central ainda não aparece para o médico.
5. Previsão de 24h ainda precisa ser claramente tratada só como consumo quando há diluição padrão.
6. Medicações sem infusão contínua ainda não têm prescrição completa em tela.
7. A base ainda está em texto livre e não está validada medicamento por medicamento.
8. PR 1 e PR 2 precisam ser conciliadas.

## Acesso às medicações

As medicações estão acessíveis em `src/data.ts`, mas ainda não estão no modelo novo.

É possível auditar cada medicação, mas não é seguro considerar a base validada porque faltam:

- fonte por dose;
- fonte por preparo;
- apresentação estruturada;
- diluente estruturado;
- via e modo de administração estruturados;
- acesso periférico/central estruturado;
- status de validação.

## Achados importantes

- Dexmedetomidina já tem diluição padrão no objeto principal, mas a tela precisa travar o preparo.
- Adrenalina tem múltiplos cenários e precisa ser dividida por indicação, via e preparo.
- Noradrenalina tem regra de diluente em texto livre, precisa virar campo estruturado.
- KCl tem concentração periférica/central em texto livre, precisa virar regra estruturada.
- Hidrocortisona deve priorizar dose por peso/faixas no pronto-socorro; se houver ASC, usar apenas estimativa por peso.

## Próximos passos

1. Atualizar PR 2 com a `main`.
2. Corrigir UX mobile da busca.
3. Integrar aviso de diluição padrão na calculadora.
4. Integrar fontes na tela de medicamento.
5. Mostrar acesso periférico/central.
6. Criar adaptador do modelo antigo para o novo.
7. Migrar primeiro drogas de alto risco.
8. Bloquear prescrição automática para itens não validados.
