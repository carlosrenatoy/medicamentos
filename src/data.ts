import { AntidoteMapping, EmergencyEquipmentByWeight, GlasgowPediatricItem, Medicine, Toxidrome, VitalSignRange } from './types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: generateId(),
    name: "Dexmedetomidina (Precedex)",
    comment: "Sedativo e analgésico (Agonista Alfa-2). Diluição padrão: 200mcg (0,2mg) em 50mL (4mcg/mL).",
    defaultDrugMg: 0.2,
    defaultVolume: 50,
    ampouleConcentration_mg_ml: 0.1,
    doses: [
      { id: generateId(), label: "Ataque - Sedação UTI", instructions: "0,5 a 1 mcg/kg/dose (infundir em 10 min)", mgPerKg: 0.5, maxPerKg: 1, unit: "mcg/kg" },
      { id: generateId(), label: "Manutenção - Sedação UTI", instructions: "0,2 a 0,5 mcg/kg/h", mgPerKg: 0.2, maxPerKg: 0.5, unit: "mcg/kg/h" },
      { id: generateId(), label: "Ataque - Procedimentos", instructions: "0,5 a 2 mcg/kg/dose (infundir em 10 min)", mgPerKg: 0.5, maxPerKg: 2, unit: "mcg/kg" },
      { id: generateId(), label: "Manutenção - Procedimentos", instructions: "0,5 a 1 mcg/kg/h", mgPerKg: 0.5, maxPerKg: 1, unit: "mcg/kg/h" }
    ]
  },
  {
    id: generateId(),
    name: "Adenosina (Adenocard)",
    comment: "Administrar rapidamente e o mais próximo possível do tronco. Vida extremamente curta. Flush de 3 a 5 mL de soro fisiológico e elevação do membro imediatamente depois.",
    doses: [
      { id: generateId(), label: "Dose inicial (< 50 kg)", instructions: "0,1 mg/kg em bolus iv rápido", mgPerKg: 0.1, unit: "mg" },
      { id: generateId(), label: "Repetição (< 50 kg)", instructions: "Repetir bolus de 0,2 mg/kg se necessário", mgPerKg: 0.2, unit: "mg" },
      { id: generateId(), label: "Dose (≥ 50 kg)", instructions: "6 mg dose inicial em bolus, podendo ser repetido com 12 mg", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Adrenalina / Epinefrina (Drenalin)",
    comment: "No uso inalatório, o efeito da medicação é breve, com possibilidade de efeito rebote.",
    doses: [
      { id: generateId(), label: "Anafilaxia (IM)", instructions: "0,01 mg/kg IM (0,1 mL/kg de solução 1:1000), vasto lateral da coxa", mgPerKg: 0.01, maxDose: 0.5, unit: "mg" },
      { id: generateId(), label: "Nebulização", instructions: "3 a 5 mL (puro ou diluído em SF)", unit: "mL" },
      { id: generateId(), label: "PCR", instructions: "0,01 mg/kg IV (0,1 mL/kg/dose da solução 1:10.000)", mgPerKg: 0.01, unit: "mg" },
      { id: generateId(), label: "IV contínua", instructions: "0,1 a 1 mcg/kg/min", mgPerKg: 0.1, maxPerKg: 1, unit: "mcg/min" },
      { id: generateId(), label: "Endotraqueal", instructions: "0,1 mg/kg/dose (0,1 mL/kg/dose da solução 1:1000)", mgPerKg: 0.1, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Amiodarona (Ancoron, Atlansil)",
    comment: "Usar com cuidado quando utilizado com drogas que prolongam o intervalo QT. Diluir em SG 5% na concentração de 2 mg/mL.",
    doses: [
      { id: generateId(), label: "Manutenção (VO)", instructions: "10 a 15 mg/kg/dia, 2x ao dia", mgPerKg: 10, maxPerKg: 15, unit: "mg/dia" },
      { id: generateId(), label: "IV", instructions: "5 mg/kg em 60 minutos", mgPerKg: 5, maxDose: 300, unit: "mg" },
      { id: generateId(), label: "FV/TV", instructions: "5 mg/kg em bolus, máximo 3x", mgPerKg: 5, unit: "mg" },
      { id: generateId(), label: "IV contínua", instructions: "5 a 10 mcg/kg/min", mgPerKg: 5, maxPerKg: 10, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Atropina",
    comment: "Doses < 0,1 mg causam bradicardia. Usar com cautela.",
    doses: [
      { id: generateId(), label: "Bradicardia (IV/IO/IT)", instructions: "0,02 mg/kg, podendo repetir 1x", mgPerKg: 0.02, maxDose: 0.5, unit: "mg" },
      { id: generateId(), label: "Pré-anestésica", instructions: "0,01 a 0,02 mg/kg/dose, IV", mgPerKg: 0.01, maxPerKg: 0.02, maxDose: 0.4, unit: "mg" },
      { id: generateId(), label: "Intoxicação Organofosforados", instructions: "0,02 a 0,05 mg/kg a cada 10-20 min até efeito", mgPerKg: 0.02, maxPerKg: 0.05, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Bicarbonato de Sódio",
    comment: "Risco de necrose tecidual se extravasamento na infusão. Velocidade máx: 1 mEq/kg/hora.",
    doses: [
      { id: generateId(), label: "PCR", instructions: "0,5 a 1 mEq/kg IV", mgPerKg: 0.5, maxPerKg: 1, unit: "mEq" },
      { id: generateId(), label: "Acidose metabólica", instructions: "Fórmula: (15 - Bic atual) x Peso x 0,3", unit: "mEq" },
      { id: generateId(), label: "Hipercalemia", instructions: "1 mEq/kg IV em bolus lento", mgPerKg: 1, unit: "mEq" }
    ]
  },
  {
    id: generateId(),
    name: "Cetamina (Ketalar)",
    comment: "Contraindicada em < 3 meses e pacientes com esquizofrenia.",
    doses: [
      { id: generateId(), label: "Oral (pré-procedimento)", instructions: "5 a 10 mg/kg/dose", mgPerKg: 5, maxPerKg: 10, unit: "mg" },
      { id: generateId(), label: "IM", instructions: "2 a 5 mg/kg/dose", mgPerKg: 2, maxPerKg: 5, unit: "mg" },
      { id: generateId(), label: "IV", instructions: "0,5 a 2 mg/kg/dose", mgPerKg: 0.5, maxPerKg: 2, unit: "mg" },
      { id: generateId(), label: "IV contínua", instructions: "5 a 20 mcg/kg/minuto", mgPerKg: 5, maxPerKg: 20, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Cloreto de Potássio (KCl)",
    comment: "Concentração máx. periférica: 40 a 80 mEq/L. Central: 80 a 150 mEq/L. Vel máx: 1 mEq/kg/h.",
    doses: [
      { id: generateId(), label: "VO (Reposição)", instructions: "2 a 5 mEq/kg/dia", mgPerKg: 2, maxPerKg: 5, unit: "mEq/dia" },
      { id: generateId(), label: "IV", instructions: "0,5 a 1 mEq/kg/dose (máx. 40 mEq)", mgPerKg: 0.5, maxPerKg: 1, maxDose: 40, unit: "mEq" }
    ]
  },
  {
    id: generateId(),
    name: "Dobutamina (Dobutrex)",
    comment: "Não infundir no mesmo cateter que heparina, hidrocortisona, cefazolina, penicilina e bicarbonato de sódio.",
    doses: [
      { id: generateId(), label: "ICC / Choque", instructions: "IV contínua: 2 a 20 mcg/kg/min", mgPerKg: 2, maxPerKg: 20, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Dopamina (Revivan)",
    comment: "Risco de necrose tecidual se extravasamento. Não infundir com bicarbonato.",
    doses: [
      { id: generateId(), label: "Choque", instructions: "IV contínua: 1 a 20 mcg/kg/min", mgPerKg: 1, maxPerKg: 20, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Etomidato (Hypnomidate)",
    comment: "Não recomendado no choque séptico por causar supressão adrenal.",
    doses: [
      { id: generateId(), label: "SRI - Sedação", instructions: "0,1 a 0,3 mg/kg/dose", mgPerKg: 0.1, maxPerKg: 0.3, maxDose: 20, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Fentanila (Fentanil)",
    comment: "A infusão rápida pode resultar em rigidez torácica. Infundir lentamente (3 a 5 minutos).",
    doses: [
      { id: generateId(), label: "Sedação e analgesia (IM/IV)", instructions: "1 a 2 mcg/kg/dose", mgPerKg: 1, maxPerKg: 2, unit: "mcg" },
      { id: generateId(), label: "Infusão contínua", instructions: "1 a 3 mcg/kg/minuto", mgPerKg: 1, maxPerKg: 3, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Flumazenil (Lanexat)",
    comment: "Antagonista de benzodiazepínicos. Não indicado se atividade comicial.",
    doses: [
      { id: generateId(), label: "IV", instructions: "0,01 mg/kg/dose", mgPerKg: 0.01, maxDose: 0.2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Gluconato de Cálcio a 10%",
    comment: "Evitar administração IV rápida. Evitar extravasamento (necrose).",
    doses: [
      { id: generateId(), label: "Hipocalcemia (VO)", instructions: "500 a 725 mg/kg/dia", mgPerKg: 500, maxPerKg: 725, unit: "mg/dia" },
      { id: generateId(), label: "Hipocalcemia (IV)", instructions: "200 a 500 mg/kg/dia (2 a 5 mL/kg/dia)", mgPerKg: 200, maxPerKg: 500, unit: "mg/dia" },
      { id: generateId(), label: "PCR / Hipercalemia", instructions: "60 a 100 mg/kg/dose", mgPerKg: 60, maxPerKg: 100, maxDose: 3000, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Lidocaína (Xylocaína)",
    comment: "Atenua o efeito adrenérgico provocado pela laringoscopia. Indicada em caso de TCE com HIC.",
    doses: [
      { id: generateId(), label: "IV", instructions: "1 mg/kg/dose", mgPerKg: 1, maxDose: 100, unit: "mg" },
      { id: generateId(), label: "SRI Pré-medicação", instructions: "1 a 2 mg/kg/dose", mgPerKg: 1, maxPerKg: 2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Manitol",
    comment: "Monitorar eletrólitos e função.",
    doses: [
      { id: generateId(), label: "IV", instructions: "0,5 a 1 g/kg/dose", mgPerKg: 0.5, maxPerKg: 1, unit: "g" }
    ]
  },
  {
    id: generateId(),
    name: "Midazolam (Dormonid)",
    comment: "Antídoto: flumazenil. Evitar extravasamento na IM; utilizar vasto lateral da coxa preferencialmente.",
    doses: [
      { id: generateId(), label: "IM", instructions: "0,1 a 0,15 mg/kg/dose", mgPerKg: 0.1, maxPerKg: 0.15, maxDose: 10, unit: "mg" },
      { id: generateId(), label: "IV", instructions: "0,1 a 0,6 mg/kg/dose", mgPerKg: 0.1, maxPerKg: 0.6, maxDose: 6, unit: "mg" },
      { id: generateId(), label: "Intranasal (IN)", instructions: "0,2 a 0,3 mg/kg/dose", mgPerKg: 0.2, maxPerKg: 0.3, unit: "mg" },
      { id: generateId(), label: "Infusão contínua", instructions: "1 a 2 mcg/kg/minuto", mgPerKg: 1, maxPerKg: 2, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Milrinona (Primacor)",
    comment: "Administração lenta em até 15 min. Cuidado na hipocalemia e hipomagnesemia.",
    doses: [
      { id: generateId(), label: "Bolus IV", instructions: "50 a 75 mcg/kg/dose em 10-60min", mgPerKg: 50, maxPerKg: 75, unit: "mcg" },
      { id: generateId(), label: "Infusão contínua", instructions: "0,25 a 0,75 mcg/kg/min", mgPerKg: 0.25, maxPerKg: 0.75, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Naloxona (Narcan)",
    comment: "Antídoto para opioides.",
    doses: [
      { id: generateId(), label: "< 20kg", instructions: "0,1 mg/kg/dose", mgPerKg: 0.1, maxDose: 2, unit: "mg" },
      { id: generateId(), label: "> 20kg", instructions: "2 mg/dose", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Norepinefrina / Noradrenalina (Hyponor)",
    comment: "Extravasamento produz necrose tecidual. Não diluir em SF.",
    doses: [
      { id: generateId(), label: "IV Constínua", instructions: "0,05 a 2 mcg/kg/min", mgPerKg: 0.05, maxPerKg: 2, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Nitroprussiato de Sódio (Nipride)",
    comment: "Risco de intoxicação por cianeto. Diluir em SG 5%.",
    doses: [
      { id: generateId(), label: "IV contínua", instructions: "0,3 a 3 mcg/kg/min (máx 10)", mgPerKg: 0.3, maxPerKg: 3, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Propofol (Diprivan)",
    comment: "Extravasamento pode causar necrose. Não indicado para sedação contínua prolongada em pediatria.",
    doses: [
      { id: generateId(), label: "SRI", instructions: "1 a 2 mg/kg/dose", mgPerKg: 1, maxPerKg: 2, unit: "mg" },
      { id: generateId(), label: "Infusão Contínua", instructions: "200 a 300 mcg/kg/min", mgPerKg: 200, maxPerKg: 300, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Rocurônio (Esmeron)",
    comment: "Opção caso succinilcolina seja contra-indicada.",
    doses: [
      { id: generateId(), label: "SRI", instructions: "0,6 a 1,2 mg/kg/dose", mgPerKg: 0.6, maxPerKg: 1.2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Succinilcolina (Quelicin)",
    comment: "Risco de hipercalemia e fasciculações.",
    doses: [
      { id: generateId(), label: "IM", instructions: "3 a 4 mg/kg/dose", mgPerKg: 3, maxPerKg: 4, maxDose: 150, unit: "mg" },
      { id: generateId(), label: "IV", instructions: "1 a 2 mg/kg/dose", mgPerKg: 1, maxPerKg: 2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Sugammadex (Bridion)",
    comment: "Reversor de rocurônio/vecurônio.",
    doses: [
      { id: generateId(), label: "Reversão", instructions: "2 a 16 mg/kg dependendo do bloqueio", mgPerKg: 2, maxPerKg: 16, unit: "mg" }
    ]
  },

  /* MEDICAMENTOS GERAIS */
  {
    id: generateId(),
    name: "Ácido Acetilsalicílico (AAS, Aspirina)",
    comment: "Não usar em crianças com suspeita de infecção viral (Síndrome de Reye).",
    doses: [
      { id: generateId(), label: "Analgesia", instructions: "10 a 15 mg/kg/dose (4-6x/dia)", mgPerKg: 10, maxPerKg: 15, unit: "mg" },
      { id: generateId(), label: "Doença de Kawasaki", instructions: "30 a 100 mg/kg/dia", mgPerKg: 30, maxPerKg: 100, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Amoxicilina (Amoxil)",
    comment: "Pode induzir rash em pacientes com infecção por EBV.",
    doses: [
      { id: generateId(), label: "Infecção Leve/Moderada", instructions: "50 mg/kg/dia dividido em 2 a 3x", mgPerKg: 50, unit: "mg/dia" },
      { id: generateId(), label: "Infecção Grave/OMA", instructions: "80 a 100 mg/kg/dia dividido em 2 a 3x", mgPerKg: 80, maxPerKg: 100, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Amoxicilina + Clavulanato (Clavulin)",
    comment: "Cuidado com reação adversa: diarreia, vômitos. A dose é calculada sempre em relação à Amoxicilina.",
    doses: [
      { id: generateId(), label: "Dose comum", instructions: "25 a 45 mg/kg/dia (div 8h ou 12h)", mgPerKg: 25, maxPerKg: 45, unit: "mg/dia" },
      { id: generateId(), label: "Infecção Grave/OMA", instructions: "90 mg/kg/dia (div 12h)", mgPerKg: 90, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Azitromicina (Astro, Zithromax)",
    comment: "Deve ser administrada 1 ou 2 horas após as refeições, sem antiácidos com Mg ou Al.",
    doses: [
      { id: generateId(), label: "Dose Usual (Dia 1)", instructions: "10 a 12 mg/kg no 1º dia (máx. 500 mg/dia)", mgPerKg: 10, maxPerKg: 12, maxDose: 500, unit: "mg" },
      { id: generateId(), label: "Dias seguintes (D2-D5)", instructions: "5 mg/kg/dia", mgPerKg: 5, maxDose: 250, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Cefalexina (Keflex)",
    comment: "Pode ser administrada junto com refeição se houver epigastralgia.",
    doses: [
      { id: generateId(), label: "VO", instructions: "50 a 100 mg/kg/dia, a cada 6 horas (máx 4g/dia)", mgPerKg: 50, maxPerKg: 100, maxDose: 4000, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Ceftriaxona (Rocefin)",
    comment: "Evitar em neonatos (risco de kernicterus). Infundir lento. Respeitar 48h de cálcio IV.",
    doses: [
      { id: generateId(), label: "IM ou IV Comum", instructions: "50 a 100 mg/kg/dia, 1x ou 12/12h", mgPerKg: 50, maxPerKg: 100, unit: "mg/dia" },
      { id: generateId(), label: "Meningite", instructions: "100 mg/kg/dia 1x ou div 12/12h (máx 4g)", mgPerKg: 100, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Dipirona (Novalgina, Lisador)",
    comment: "Evitar para < 3 meses e < 5 kg.",
    doses: [
      { id: generateId(), label: "VO/IV (Dor/Febre)", instructions: "10 a 25 mg/kg/dose, a cada 6 horas", mgPerKg: 10, maxPerKg: 25, maxDose: 1000, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Paracetamol (Tylenol)",
    comment: "Usar com cuidado para pacientes com deficiência de G6PD e hepatopatia. Dose máx 90mg/kg/dia.",
    doses: [
      { id: generateId(), label: "< 50 kg (VO)", instructions: "10 a 15 mg/kg/dose, a cada 4-6h", mgPerKg: 10, maxPerKg: 15, maxDose: 1000, unit: "mg" },
      { id: generateId(), label: "> 50 kg (VO)", instructions: "1 g, até a cada 6 horas (max 4g/dia)", unit: "g" }
    ]
  },
  {
    id: generateId(),
    name: "Ibuprofeno (Alivium)",
    comment: "Aumenta risco de insuficiência renal se desidratação. Administrar pós-refeição.",
    doses: [
      { id: generateId(), label: "VO (> 6m)", instructions: "5 a 10 mg/kg/dose, 6-8h, máx 400mg", mgPerKg: 5, maxPerKg: 10, maxDose: 400, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Dexametasona (Decadron)",
    comment: "Apresenta meia-vida longa.",
    doses: [
      { id: generateId(), label: "Asma / Crupe", instructions: "0,6 mg/kg (dose única, máx. 12mg)", mgPerKg: 0.6, maxDose: 12, unit: "mg" },
      { id: generateId(), label: "Edema cerebral / Meningite", instructions: "0,15 mg/kg/dose 6/6h por 4 dias", mgPerKg: 0.15, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Prednisolona (Prelone)",
    comment: "Não recomendado uso prolongado sem desmame. Associar protetor gástrico.",
    doses: [
      { id: generateId(), label: "VO Geral (Asma)", instructions: "1 a 2 mg/kg/dia por 3 a 5 dias (máx. 60mg/dia)", mgPerKg: 1, maxPerKg: 2, maxDose: 60, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Ondansetrona (Vonau, Zofran)",
    comment: "Prolonga intervalo QT.",
    doses: [
      { id: generateId(), label: "IV", instructions: "0,15 mg/kg/dose (máx. 16mg)", mgPerKg: 0.15, maxDose: 16, unit: "mg" },
      { id: generateId(), label: "VO (8 a 15kg)", instructions: "2 mg", unit: "mg" },
      { id: generateId(), label: "VO (15 a 30kg)", instructions: "4 mg", unit: "mg" },
      { id: generateId(), label: "VO (> 30kg)", instructions: "8 mg", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Salbutamol (Aerolin)",
    comment: "Pode causar taquicardia e queda de potássio sérico. Diminuição do efeito se em uso de betabloqueador.",
    doses: [
      { id: generateId(), label: "Inalatória (puff 100mcg)", instructions: "4 a 8 puffs, cada 4-6h ou cada 20min em crise", unit: "puffs" },
      { id: generateId(), label: "Nebulização (0 a 13kg)", instructions: "0,15 mg/kg cada 4 a 6 horas (ou cada 20min na crise), mín: 1,25 mg", mgPerKg: 0.15, unit: "mg" },
      { id: generateId(), label: "Nebulização (> 13kg)", instructions: "2,5 mg cada 4 a 6 horas (ou cada 20min na crise)", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Furosemida (Lasix)",
    comment: "Diurético de alça. Monitorar potássio, sódio.",
    doses: [
      { id: generateId(), label: "VO / IV", instructions: "1 a 2 mg/kg/dose, cada 6 a 12h", mgPerKg: 1, maxPerKg: 2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Fenobarbital (Gardenal)",
    comment: "Uso no status epiléptico ou manutenção.",
    doses: [
      { id: generateId(), label: "Ataque IV", instructions: "15 a 20 mg/kg em 20 min", mgPerKg: 15, maxPerKg: 20, maxDose: 1000, unit: "mg" },
      { id: generateId(), label: "Manutenção", instructions: "3 a 5 mg/kg/dia", mgPerKg: 3, maxPerKg: 5, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Fenitoína (Hidantal)",
    comment: "Vel máx infusão: 1-3 mg/kg/min (ou 50 mg/min). Diluir SOMENTE em SF 0,9%. Não usar em SG.",
    doses: [
      { id: generateId(), label: "Ataque IV", instructions: "15 a 20 mg/kg (máx. 1g/dose)", mgPerKg: 15, maxPerKg: 20, maxDose: 1000, unit: "mg" },
      { id: generateId(), label: "Manutenção", instructions: "4 a 8 mg/kg/dia, em 2 a 3 doses/dia", mgPerKg: 4, maxPerKg: 8, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Diazepam (Valium)",
    comment: "Considerar VR na crise se não há IV.",
    doses: [
      { id: generateId(), label: "IV", instructions: "0,2 a 0,3 mg/kg/dose (máx. 10 mg)", mgPerKg: 0.2, maxPerKg: 0.3, maxDose: 10, unit: "mg" },
      { id: generateId(), label: "VR (Retal)", instructions: "0,5 mg/kg/dose", mgPerKg: 0.5, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Morfina (Dimorf)",
    comment: "Opióide forte. Efeito colateral principal: depressão respiratória. Antídoto: Naloxona.",
    doses: [
      { id: generateId(), label: "IV / IM", instructions: "0,05 a 0,1 mg/kg/dose", mgPerKg: 0.05, maxPerKg: 0.1, maxDose: 5, unit: "mg" },
      { id: generateId(), label: "Infusão Contínua", instructions: "10 a 30 mcg/kg/hora", mgPerKg: 10, maxPerKg: 30, unit: "mcg/h" }
    ]
  },
  {
    id: generateId(),
    name: "Tramadol (Tramal)",
    comment: "Opióide fraco. Risco de náusea e vômitos (infundir lento).",
    doses: [
      { id: generateId(), label: "IV / VO (> 1 ano)", instructions: "1 a 2 mg/kg/dose (máx. 100 mg)", mgPerKg: 1, maxPerKg: 2, maxDose: 100, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Cetoprofeno (Profenid)",
    comment: "AINE. Não utilizar antes dos 6 meses ou na suspeita de dengue.",
    doses: [
      { id: generateId(), label: "IV (Crianças)", instructions: "1 a 2 mg/kg/dose", mgPerKg: 1, maxPerKg: 2, maxDose: 100, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Hidrocortisona (Solu-Cortef)",
    comment: "Corticoide de ação rápida.",
    doses: [
      { id: generateId(), label: "Asma Grave (Ataque)", instructions: "4 a 8 mg/kg/dose", mgPerKg: 4, maxPerKg: 8, maxDose: 250, unit: "mg" },
      { id: generateId(), label: "Choque Adrenal / Anafilaxia", instructions: "2 a 4 mg/kg/dose", mgPerKg: 2, maxPerKg: 4, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Metilprednisolona (Solu-Medrol)",
    comment: "Meningite, asma refratária, lesão medular.",
    doses: [
      { id: generateId(), label: "Asma (Pulsoterapia)", instructions: "1 a 2 mg/kg/dose", mgPerKg: 1, maxPerKg: 2, maxDose: 125, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Sulfato de Magnésio 10%",
    comment: "Asma grave (ataque) ou TV (Torsades). Infundir em 20 min.",
    doses: [
      { id: generateId(), label: "Asma / Torsades (IV)", instructions: "25 a 50 mg/kg/dose", mgPerKg: 25, maxPerKg: 50, maxDose: 2000, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Omeprazol (Losec)",
    comment: "Protetor gástrico.",
    doses: [
      { id: generateId(), label: "IV / VO", instructions: "1 mg/kg/dia (1x ao dia)", mgPerKg: 1, maxDose: 40, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Prometazina (Fenergan)",
    comment: "Anti-histamínico. Não recomendado para lactentes < 2 anos (risco de depressão respiratória fatal).",
    doses: [
      { id: generateId(), label: "IM (Anafilaxia/Reação)", instructions: "0,5 a 1 mg/kg/dose", mgPerKg: 0.5, maxPerKg: 1, maxDose: 25, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Penicilina G Benzatina (Benzetacil)",
    comment: "Uso IM profundo. Tratamento de faringite estreptocócica e sífilis.",
    doses: [
      { id: generateId(), label: "< 27 kg (IM)", instructions: "600.000 UI", unit: "UI" },
      { id: generateId(), label: ">= 27 kg (IM)", instructions: "1.200.000 UI", unit: "UI" }
    ]
  },
  {
    id: generateId(),
    name: "Clindamicina (Dalacin)",
    comment: "Pode ser diluída em SF 0,9% ou SG 5%. Infundir num período mínimo de 10 a 60 minutos.",
    doses: [
      { id: generateId(), label: "Infecções graves (IV)", instructions: "25 a 40 mg/kg/dia, divididos a cada 6 a 8 horas", mgPerKg: 25, maxPerKg: 40, unit: "mg/dia" },
      { id: generateId(), label: "VO", instructions: "10 a 30 mg/kg/dia, divididos a cada 6 a 8 horas", mgPerKg: 10, maxPerKg: 30, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Cefotaxima (Claforan)",
    comment: "Pode ser usada em neonatos. Boa penetração no SNC.",
    doses: [
      { id: generateId(), label: "Meningite", instructions: "200 a 300 mg/kg/dia, IV de 6/6h", mgPerKg: 200, maxPerKg: 300, unit: "mg/dia" },
      { id: generateId(), label: "Infecção Comum", instructions: "100 a 150 mg/kg/dia, IV de 6/6h a 8/8h", mgPerKg: 100, maxPerKg: 150, unit: "mg/dia" }
    ]
  }
];

export const VITAL_SIGNS_PEDIATRIC = [
  { ageGroup: 'Neonato', heartRate: '100-205', respiratoryRate: '30-53' },
  { ageGroup: 'Lactente', heartRate: '100-180', respiratoryRate: '22-37' },
  { ageGroup: 'Criança pequena', heartRate: '98-140', respiratoryRate: '20-28' },
  { ageGroup: 'Pré-escolar', heartRate: '80-120', respiratoryRate: '18-25' },
  { ageGroup: 'Escolar', heartRate: '75-118', respiratoryRate: '18-25' },
  { ageGroup: 'Adolescente', heartRate: '60-100', respiratoryRate: '12-20' },
  { ageGroup: 'Nascimento 12h, <1000g', systolicBP: '39-59', diastolicBP: '16-36', meanBP: '28-42' },
  { ageGroup: 'Nascimento 12h, 3kg', systolicBP: '60-67', diastolicBP: '31-45', meanBP: '48-57' },
  { ageGroup: 'Neonato 96h', systolicBP: '67-84', diastolicBP: '35-53', meanBP: '45-60' },
  { ageGroup: 'Lactente 1 a 12 meses', systolicBP: '72-104', diastolicBP: '37-56', meanBP: '50-62' }
];

export const GLASGOW_PEDIATRIC = [
  { domain: 'abertura_ocular', score: 4, child: 'Espontânea', infant: 'Espontânea' },
  { domain: 'abertura_ocular', score: 3, child: 'À estímulo verbal', infant: 'À estímulo verbal' },
  { domain: 'abertura_ocular', score: 2, child: 'À estímulo doloroso', infant: 'À estímulo doloroso' },
  { domain: 'abertura_ocular', score: 1, child: 'Sem resposta', infant: 'Sem resposta' },
  { domain: 'resposta_verbal', score: 5, child: 'Orientado, apropriado', infant: 'Balbucia e vocaliza' },
  { domain: 'resposta_verbal', score: 4, child: 'Confuso', infant: 'Choro irritado' },
  { domain: 'resposta_verbal', score: 3, child: 'Palavras inapropriadas', infant: 'Choro ao estímulo doloroso' },
  { domain: 'resposta_verbal', score: 2, child: 'Sons incompreensíveis', infant: 'Geme ao estímulo doloroso' },
  { domain: 'resposta_verbal', score: 1, child: 'Sem resposta', infant: 'Sem resposta' },
  { domain: 'resposta_motora', score: 6, child: 'Obedece comandos', infant: 'Movimenta-se espontaneamente' },
  { domain: 'resposta_motora', score: 5, child: 'Localiza a dor', infant: 'Retira ao toque' },
  { domain: 'resposta_motora', score: 4, child: 'Fuga à dor', infant: 'Retira à dor' },
  { domain: 'resposta_motora', score: 3, child: 'Flexão anormal (decorticação)', infant: 'Flexão anormal (decorticação)' },
  { domain: 'resposta_motora', score: 2, child: 'Extensão anormal (descerebração)', infant: 'Extensão anormal (descerebração)' },
  { domain: 'resposta_motora', score: 1, child: 'Sem resposta', infant: 'Sem resposta' }
];

export const EMERGENCY_EQUIPMENT_BY_WEIGHT = [
  { equipment: 'Bolsa-válvula de ressuscitação', neonate: 'Lactente', infant: 'Lactente/criança', childSmall: 'Criança', childMedium: 'Criança', childLarge: 'Criança/adulto', adult: 'Adulto' },
  { equipment: 'Máscara de O2', neonate: 'Neonatal', infant: 'Neonatal', childSmall: 'Pediátrica', childMedium: 'Pediátrica', childLarge: 'Adulto', adult: 'Adulto' },
  { equipment: 'Lâmina de laringoscópio', neonate: 'Reta 0-1', infant: 'Reta 1', childSmall: 'Reta 1-2', childMedium: 'Reta 2', childLarge: 'Reta 2-3 ou curva', adult: 'Reta 3 ou curva' },
  { equipment: 'Cânula traqueal (mm)', neonate: '2,5-3,0 sem cuff', infant: '3,5 sem cuff', childSmall: '4,0-4,5 sem cuff', childMedium: '5,0-5,5 sem cuff', childLarge: '6,0 com cuff', adult: '6,5 com cuff' },
  { equipment: 'Máscara laríngea', neonate: '1', infant: '1-1,5', childSmall: '1,5-2', childMedium: '2-2,5', childLarge: '2,5', adult: '3' }
];

export const TOXIDROMES = [
  { syndrome: 'Simpatomimética', mentalStatus: 'Agitação, hiperalerta, alucinação', pupils: 'Midríase', vitalSigns: 'Hipertermia, taquicardia, hipertensão', otherManifestations: 'Sudorese, tremor, convulsões', commonAgents: 'Cocaína, anfetamina, cafeína, teofilina' },
  { syndrome: 'Anticolinérgica', mentalStatus: 'Hipervigilância, agitação, delírio', pupils: 'Midríase', vitalSigns: 'Hipertermia, taquicardia', otherManifestations: 'Pele seca, mucosas secas, retenção urinária', commonAgents: 'Anti-histamínicos, tricíclicos, atropina' },
  { syndrome: 'Opioide-narcótica', mentalStatus: 'Depressão SNC, coma', pupils: 'Miose', vitalSigns: 'Bradipneia, hipotensão, bradicardia', otherManifestations: 'Hiporreflexia, edema pulmonar', commonAgents: 'Morfina, metadona, codeína' }
];

export const COMMON_TOXICS_ANTIDOTES = [
  { intoxicationType: 'Anestésico local', antidote: 'Emulsão lipídica endovenosa' },
  { intoxicationType: 'Benzodiazepínicos', antidote: 'Flumazenil (cuidado em precipitação de convulsão)' },
  { intoxicationType: 'Bloqueador de canal de cálcio', antidote: 'Cálcio endovenoso, insulina + glicose, catecolaminas' },
  { intoxicationType: 'Opioides', antidote: 'Naloxona (repetir a cada 2-3 min conforme resposta)' },
  { intoxicationType: 'Organofosforados', antidote: 'Atropina + pralidoxima' },
  { intoxicationType: 'Metemoglobinemia', antidote: 'Azul de metileno + ácido ascórbico' }
];
