# Checklist de auditoria dos medicamentos do PediDose

Este checklist deve ser usado antes de liberar qualquer medicamento para prescrição automática.

## Status possíveis

- `validated`: revisado e liberado.
- `needs_source`: falta fonte confiável.
- `needs_pharmacy_review`: precisa revisão farmacêutica.
- `conflicting_sources`: há divergência entre fontes.
- `draft_only`: apenas rascunho, não prescrever automaticamente.

## Checklist por medicamento

### Identificação

- Nome genérico.
- Nomes comerciais/aliases.
- Apresentações disponíveis.
- Concentração da apresentação.
- Unidade da apresentação.
- Fonte da apresentação.

### Regimes de dose

Para cada indicação:

- Indicação clínica.
- Via.
- Modo de administração.
- Base da dose: peso, ASC, fixa, faixa etária ou faixa de peso.
- Dose mínima.
- Dose máxima.
- Unidade correta.
- Dose máxima absoluta, quando houver.
- Intervalo.
- Tempo de administração.
- Fonte da dose.
- Status de validação.

### Superfície corpórea

- Evitar tornar altura obrigatória no fluxo principal.
- Usar peso como padrão do pronto-socorro.
- Usar ASC apenas se a indicação/protocolo exigir.
- Se usar ASC por peso + altura, marcar como medida/calculada.
- Se usar ASC apenas por peso, marcar como estimativa.
- Não esconder do médico que a ASC por peso é estimada.

### Preparo e diluição

- Reconstituição, se houver.
- Diluente permitido.
- Diluente preferido.
- Diluente proibido.
- Volume final.
- Quantidade total de droga no preparo.
- Concentração final.
- Se a diluição é padrão fixa.
- Se a previsão de 24h é apenas consumo estimado.
- Fonte do preparo/diluição.

### Acesso venoso

- Periférico permitido?
- Central permitido?
- Central preferencial?
- Central obrigatório?
- Concentração máxima periférica.
- Concentração máxima central.
- Risco de extravasamento.
- Conduta em extravasamento, se existir em protocolo.
- Fonte da regra de acesso.

### Segurança

- Medicamento de alto risco?
- Exige dupla checagem?
- Exige bomba de infusão?
- Monitorização obrigatória.
- Incompatibilidades relevantes.
- Fotoproteção.
- Estabilidade.
- Alertas críticos.

### Fontes

Prioridade:

1. Protocolo institucional validado.
2. Farmácia clínica.
3. Anvisa/bula brasileira.
4. DailyMed/FDA label.
5. Referência pediátrica farmacêutica.
6. ASHP/ISMP para segurança e padronização.
7. Fonte específica de fórmula, quando for cálculo.

## Regra de bloqueio

O app não deve gerar prescrição automática se faltar qualquer um destes itens:

- fonte da dose;
- apresentação/concentração;
- unidade de dose;
- via;
- modo de administração;
- diluente/preparo quando aplicável;
- acesso periférico/central quando aplicável;
- status de validação.

## UX mobile

- A busca deve mostrar resultados mesmo com teclado aberto.
- Ao tocar no resultado, fechar teclado automaticamente.
- Não exigir rolagem invisível atrás do teclado.
- Resultado principal deve ficar acima da dobra visível.

## Grupos prioritários para auditoria

1. Vasoativos: adrenalina, noradrenalina, dopamina, dobutamina, vasopressina, milrinona.
2. Sedação/analgesia: dexmedetomidina, fentanil, midazolam, cetamina, propofol.
3. Eletrólitos/soluções: KCl, bicarbonato, cálcio, magnésio, salina hipertônica.
4. Anticonvulsivantes/anestésicos: fenitoína, fenobarbital, tiopental.
5. Corticoides e emergência adrenal: hidrocortisona, dexametasona, metilprednisolona.
6. Antibióticos EV frequentes.
7. Medicações VO comuns com apresentação em gotas/suspensão.
