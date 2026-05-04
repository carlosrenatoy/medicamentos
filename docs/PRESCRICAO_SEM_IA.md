# PediDose: prescrição pediátrica sem IA no núcleo

## Decisão arquitetural

O PediDose pode e deve iniciar sem IA.

Para dose, diluição, concentração e velocidade de infusão contínua, o núcleo deve ser determinístico. A mesma entrada precisa gerar sempre o mesmo resultado.

A IA pode entrar futuramente como camada auxiliar, mas não como motor da prescrição.

## Decisão clínica de UX: peso primeiro

O fluxo principal do app deve ser por **peso em kg**.

Estatura/altura não deve aparecer no fluxo do pronto-socorro. O app é focado em médicos de emergência pediátrica; portanto, qualquer campo que atrase o uso, como estatura, deve ficar fora da interface principal.

Quando uma indicação exigir superfície corpórea, o PediDose deve usar apenas **ASC estimada por peso**, com aviso claro de que é estimativa. Sempre que existir opção validada por kg, a dose por peso deve ser preferida no fluxo de emergência.

A fórmula de Costeff permite estimar superfície corpórea a partir do peso, pela equação aproximada `ASC = (4 x peso + 7) / (peso + 90)`. Ela usa apenas peso, mas deve ser tratada como estimativa e não como substituto universal para contextos que exigem alta precisão.

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
2. Se o regime exigir superfície corpórea, o app estima ASC apenas pelo peso e exibe aviso de estimativa.
3. Médico seleciona medicamento.
4. Médico seleciona indicação.
5. Médico seleciona dose dentro da faixa cadastrada.
6. Médico seleciona acesso venoso: periférico ou central, quando relevante.
7. App escolhe apenas preparos compatíveis com acesso e diluente.
8. App calcula volume da medicação.
9. App calcula volume do diluente já descontando o volume da medicação.
10. App calcula concentração final.
11. App calcula velocidade em mL/h, quando for infusão contínua.
12. App exibe prescrição pronta e fontes.
13. Médico confirma e revisa.

## Dados obrigatórios para infusão contínua

Cada medicação de infusão contínua deve ter:

- Nome e aliases.
- Apresentação da ampola/fraco.
- Concentração da apresentação.
- Indicação.
- Dose mínima.
- Dose máxima.
- Unidade da dose.
- Base de dose: peso, ASC estimada por peso, dose fixa, faixa etária ou faixa de peso.
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

## Regras de diluição padrão

Medicações com diluição padrão não podem ser recalculadas a partir do consumo previsto de 24 horas.

Quando houver diluição padrão cadastrada:

- travar quantidade total da droga no preparo;
- travar volume final;
- travar concentração final;
- ajustar dose pela velocidade da bomba;
- mostrar previsão de 24 horas apenas como consumo estimado da solução;
- exibir aviso explícito: a previsão de 24 horas não deve ser usada para preparar a solução.

Exemplo de erro a evitar: dexmedetomidina/Precedex com preparo padrão deve manter o preparo padronizado; o app não deve sugerir qsp baseado no volume consumido em 24h.

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

### Superfície corpórea estimada apenas por peso

```txt
Costeff: ASC(m²) = (4 x peso(kg) + 7) / (peso(kg) + 90)
```

A fórmula por peso deve ser marcada no app como estimativa.

## Como prescrever medicações não contínuas

O app não deve apenas calcular a dose. Ele também deve gerar prescrição para:

- dose única;
- bolus;
- intermitente EV;
- VO;
- IM;
- IN;
- nebulização;
- infusão curta;
- infusão contínua.

Cada modo precisa ter campos próprios de apresentação, concentração, volume calculado, via, intervalo, tempo de administração, diluente/reconstituição quando aplicável e fonte.

## Exibição para médicos

Cada prescrição deve exibir:

```txt
Medicação
Peso usado
Se aplicável: ASC estimada por peso
Dose escolhida
Base da dose: kg, ASC estimada por peso, dose fixa, faixa de idade ou faixa de peso
Apresentação utilizada
Volume da medicação
Volume do diluente
Diluente
Volume final
Concentração final
Velocidade em mL/h, quando aplicável
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
7. Fonte específica da fórmula de ASC por peso, quando o assunto for cálculo de ASC estimada.

## Checklist do que ainda falta

### UX mobile

- Corrigir busca no celular para o resultado aparecer sem precisar esconder o teclado.
- Ao tocar em um medicamento, fechar teclado automaticamente.
- Manter lista de resultados visível em área rolável e adaptada ao teclado.

### Modelo de dados

- Substituir `mgPerKg` por campos neutros: `doseMin`, `doseMax`, `doseUnit`, `doseBasis`.
- Adicionar `doseBasis`: `weight`, `estimated_bsa_from_weight`, `fixed`, `age_band`, `weight_band`.
- Adicionar apresentações estruturadas.
- Adicionar preparos estruturados.
- Adicionar diluentes permitidos/proibidos.
- Adicionar via e modo de administração.
- Adicionar acesso periférico/central.
- Adicionar fontes por dose, preparo e alerta.

### Segurança farmacotécnica

- Revisar todas as drogas com diluição padrão.
- Diferenciar claramente preparo padrão de consumo estimado em 24h.
- Bloquear prescrição quando faltar apresentação, diluente, via ou fonte.
- Exibir acesso periférico/central e concentração máxima quando relevante.

### Prescrição

- Criar gerador para infusão contínua.
- Criar gerador para bolus/dose única.
- Criar gerador para medicações intermitentes.
- Criar gerador para medicações VO/IM/IN/nebulização.
- Mostrar dose calculada, volume calculado e forma de administração.

### Auditoria clínica

- Auditar droga por droga com fonte confiável.
- Marcar cada item como: validado, pendente de fonte, divergente ou apenas texto livre.
- Não liberar prescrição automática para itens pendentes.

## Próxima etapa de implementação

1. Integrar `StandardDilutionWarning` na calculadora atual.
2. Integrar `SourceLinks` no detalhe da medicação.
3. Migrar `Medicine` e `MedicineDose` para `StructuredMedicine`.
4. Trocar a calculadora de BIC para usar `calculateContinuousInfusion`.
5. Bloquear cálculo quando faltar apresentação, preparo, diluente, via, acesso ou unidade.
6. Criar testes com exemplos controlados.
7. Remover texto livre crítico do campo `comment` e transformar em campos estruturados.
