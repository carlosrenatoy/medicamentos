<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PediDose

Aplicativo para consulta e cálculo determinístico de medicações pediátricas.

## Princípio de segurança

O núcleo de cálculo do PediDose não deve depender de IA.

Para prescrição pediátrica, o fluxo seguro é:

1. Base estruturada e revisada de medicamentos.
2. Dose, unidade, apresentação, diluente, concentração e via em campos separados.
3. Cálculo determinístico de volume da medicação, volume do diluente, concentração final e velocidade em mL/h.
4. Exibição de fontes confiáveis para o médico revisar a informação.
5. Auditoria e dupla checagem para medicações de alto risco.

A IA pode ser usada futuramente como assistente de busca, extração de rascunhos e explicação, mas não como motor de prescrição.

## Fontes clínicas

As fontes devem aparecer junto da medicação e/ou do preparo quando disponíveis. Exemplos de bases confiáveis para validação médica e farmacêutica:

- Protocolos institucionais validados.
- Farmácia clínica do serviço.
- Bulário eletrônico da Anvisa.
- DailyMed/FDA labels.
- BNF for Children/NICE.
- ASHP Standardize 4 Safety.
- ISMP Medication Safety.

Ver detalhes em `docs/PRESCRICAO_SEM_IA.md` e `src/trustedSources.ts`.

## Run Locally

Prerequisites: Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Scripts

- `npm run dev`: executa o app localmente.
- `npm run build`: gera build de produção.
- `npm run lint`: executa checagem TypeScript.
