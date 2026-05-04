# PediDose: prescrição pediátrica sem IA no núcleo

## Decisão arquitetural

O PediDose pode e deve iniciar sem IA.

Para dose, diluição, concentração e velocidade de infusão contínua, o núcleo deve ser determinístico. A mesma entrada precisa gerar sempre o mesmo resultado.

A IA pode entrar futuramente como camada auxiliar, mas não como motor da prescrição.

## O que a IA não deve fazer

- Escolher dose final sem base estruturada.
- Inventar diluente.
- Inferir concentração máxima sem fonte.
- Calcular velocidade diretamente por linguagem natural.
- Substituir validação médica/farmacêutica.

## O que a IA pode fazer depois

- Busca por sinônimos e nomes comerciais.
- Transformar bula ou protocolo em rascunho estruturado.
- Explicar para o médico como o cálculo foi feito.
- Apontar inconsistências entre campos já cadastrados.
- Ajudar na revisão administrativa da base.

## Fluxo seguro de prescrição

1. Médico informa peso.
2. Médico seleciona medicamento.
3. Médico seleciona indicação.
4. Médico seleciona dose dentro da faixa cadastrada.
5. Médico seleciona acesso venoso: periférico ou central.
6. App escolhe apenas preparos compatíveis com acesso e diluente.
7. App calcula volume da medicação.
8. App calcula volume do diluente já descontando o volume da medicação.
9. App calcula concentração final.
10. App calcula velocidade em mL/h.
11. App exibe prescrição pronta e fontes.
12. Médico confirma e revisa.

## Dados obrigatórios para infusão contínua

Cada medicação de infusão contínua deve ter:

- Nome e aliases.
- Apresentação da ampola/fraco.
- Concentração da apresentação.
- Indicação.
- Dose mínima.
- Dose máxima.
- Unidade da dose.
- Dose inicial sugerida, se houver.
- Volume final padrão.
- Quantidade total de droga no preparo.
- Diluente permitido.
- Diluente preferido.
- Diluente proibido, quando aplicável.
- Acesso permitido: periférico, central ou ambos.
- Concentração máxima periférica, quando aplicável.
- Concentração máxima central, quando aplicável.
- Alertas de segurança.
- Monitorização.
- Fontes.
- Data de revisão.
- Responsável pela revisão.

## Fórmulas do motor determinístico

### Preparo

```txt
volume da medicação = quantidade total da droga no preparo / concentração da apresentação
volume do diluente = volume final - volume da medicação
concentração final = quantidade total da droga no preparo / volume final
```

### Infusão em mcg/kg/min

```txt
dose total em mcg/h = dose escolhida x peso x 60
velocidade em mL/h = dose total em mcg/h / concentração final em mcg/mL
```

### Infusão em mcg/kg/h

```txt
dose total em mcg/h = dose escolhida x peso
velocidade em mL/h = dose total em mcg/h / concentração final em mcg/mL
```

### Infusão em mg/kg/h

```txt
dose total em mg/h = dose escolhida x peso
velocidade em mL/h = dose total em mg/h / concentração final em mg/mL
```

## Exibição para médicos

Cada prescrição deve exibir:

```txt
Medicação
Peso usado
Dose escolhida
Apresentação utilizada
Volume da medicação
Volume do diluente
Diluente
Volume final
Concentração final
Velocidade em mL/h
Acesso recomendado/permitido
Alertas
Fontes
```

## Fontes confiáveis

Ordem de prioridade recomendada:

1. Protocolo institucional validado.
2. Farmácia clínica do serviço.
3. Bulário eletrônico da Anvisa.
4. Bula/label oficial do medicamento.
5. Referências pediátricas farmacêuticas, como BNF for Children, Lexicomp ou Micromedex.
6. Diretrizes de segurança como ASHP Standardize 4 Safety e ISMP.

## Próxima etapa de implementação

1. Migrar `Medicine` e `MedicineDose` para `StructuredMedicine`.
2. Adicionar componente visual `SourceLinks`.
3. Exibir fontes dentro do detalhe da medicação.
4. Trocar a calculadora de BIC para usar `calculateContinuousInfusion`.
5. Bloquear cálculo quando faltar apresentação, preparo, diluente ou unidade.
6. Criar testes com exemplos controlados.
7. Remover texto livre crítico do campo `comment` e transformar em campos estruturados.
