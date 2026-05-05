import { AntidoteMapping, EmergencyEquipmentByWeight, GlasgowPediatricItem, Medicine, Toxidrome, VitalSignRange } from './types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: generateId(),
    name: "Dexmedetomidina (Precedex)",
    comment: "Sedativo e analgÃ©sico (Agonista Alfa-2). DiluiÃ§Ã£o padrÃ£o: 200mcg (0,2mg) em 50mL (4mcg/mL).",
    defaultDrugMg: 0.2,
    defaultVolume: 50,
    ampouleConcentration_mg_ml: 0.1,
    doses: [
      { id: generateId(), label: "Ataque - SedaÃ§Ã£o UTI", instructions: "0,5 a 1 mcg/kg/dose (infundir em 10 min)", mgPerKg: 0.5, maxPerKg: 1, unit: "mcg/kg" },
      { id: generateId(), label: "ManutenÃ§Ã£o - SedaÃ§Ã£o UTI", instructions: "0,2 a 0,5 mcg/kg/h", mgPerKg: 0.2, maxPerKg: 0.5, unit: "mcg/kg/h" },
      { id: generateId(), label: "Ataque - Procedimentos", instructions: "0,5 a 2 mcg/kg/dose (infundir em 10 min)", mgPerKg: 0.5, maxPerKg: 2, unit: "mcg/kg" },
      { id: generateId(), label: "ManutenÃ§Ã£o - Procedimentos", instructions: "0,5 a 1 mcg/kg/h", mgPerKg: 0.5, maxPerKg: 1, unit: "mcg/kg/h" }
    ]
  },
  {
    id: generateId(),
    name: "Adenosina (Adenocard)",
    comment: "Administrar rapidamente e o mais prÃ³ximo possÃ­vel do tronco. Vida extremamente curta. Flush de 3 a 5 mL de soro fisiolÃ³gico e elevaÃ§Ã£o do membro imediatamente depois.",
    doses: [
      { id: generateId(), label: "Dose inicial (< 50 kg)", instructions: "0,1 mg/kg em bolus iv rÃ¡pido", mgPerKg: 0.1, unit: "mg" },
      { id: generateId(), label: "RepetiÃ§Ã£o (< 50 kg)", instructions: "Repetir bolus de 0,2 mg/kg se necessÃ¡rio", mgPerKg: 0.2, unit: "mg" },
      { id: generateId(), label: "Dose (â‰¥ 50 kg)", instructions: "6 mg dose inicial em bolus, podendo ser repetido com 12 mg", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Adrenalina / Epinefrina (Drenalin)",
    comment: "No uso inalatÃ³rio, o efeito da medicaÃ§Ã£o Ã© breve, com possibilidade de efeito rebote.",
    doses: [
      { 
        id: generateId(), 
        label: "Anafilaxia (IM)", 
        instructions: "0,01 mg/kg IM (vasto lateral da coxa)", 
        mgPerKg: 0.01, 
        maxDose: 0.5, 
        unit: "mg",
        presentations: [{ id: generateId(), description: "SoluÃ§Ã£o 1:1000", concentration_mg_ml: 1 }]
      },
      { 
        id: generateId(), 
        label: "NebulizaÃ§Ã£o", 
        instructions: "3 a 5 mL (puro ou diluÃ­do em SF)", 
        unit: "mL", 
        hideVolumeCalc: true 
      },
      { 
        id: generateId(), 
        label: "PCR (IV/IO)", 
        instructions: "Diluir 1 ampola (1 mL) em 9 mL de SF. Dar 0,1 mL/kg dessa soluÃ§Ã£o (0,01 mg/kg). Repetir a cada 3-5 min.", 
        mgPerKg: 0.01, 
        unit: "mg", 
        presentations: [{ id: generateId(), description: "SoluÃ§Ã£o 1:10.000 (DiluÃ­da 1 amp em 9mL SF)", concentration_mg_ml: 0.1 }]
      },
      { 
        id: generateId(), 
        label: "IV contÃ­nua", 
        instructions: "0,1 a 1 mcg/kg/min", 
        mgPerKg: 0.1, 
        maxPerKg: 1, 
        unit: "mcg/min", 
        defaultDrugMg: 1, 
        defaultVolume: 50, 
        ampouleConcentration_mg_ml: 1, 
        hideVolumeCalc: true 
      },
      { 
        id: generateId(), 
        label: "Endotraqueal", 
        instructions: "0,1 mg/kg/dose", 
        mgPerKg: 0.1, 
        unit: "mg", 
        presentations: [{ id: generateId(), description: "SoluÃ§Ã£o 1:1000", concentration_mg_ml: 1 }]
      }
    ]
  },
  {
    id: generateId(),
    name: "Cefalexina (Keflex)",
    comment: "Pode ser administrada junto com refeiÃ§Ã£o se houver epigastralgia.",
    presentations: [
      { id: generateId(), description: "SuspensÃ£o 250mg/5mL", concentration_mg_ml: 50 },
      { id: generateId(), description: "Comprimido 500mg", concentration_mg_ml: 500, isPill: true }
    ],
    doses: [
      { id: generateId(), label: "Dose Comum (InfecÃ§Ãµes Leves a Moderadas)", instructions: "50 mg/kg/dia (div 6h)", mgPerKg: 50, maxDose: 4000, unit: "mg/dia", divideBy: 4, intervalText: "de 6/6h" },
      { id: generateId(), label: "Dose MÃ¡xima (InfecÃ§Ãµes Graves/Osteoarticulares)", instructions: "100 mg/kg/dia (div 6h)", mgPerKg: 100, maxDose: 4000, unit: "mg/dia", divideBy: 4, intervalText: "de 6/6h" }
    ]
  },
  {
    id: generateId(),
    name: "Amiodarona (Ancoron, Atlansil)",
    comment: "Usar com cuidado quando utilizado com drogas que prolongam o intervalo QT. Diluir em SG 5% na concentraÃ§Ã£o de 2 mg/mL.",
    doses: [
      { id: generateId(), label: "ManutenÃ§Ã£o (VO)", instructions: "10 a 15 mg/kg/dia, 2x ao dia", mgPerKg: 10, maxPerKg: 15, unit: "mg/dia" },
      { id: generateId(), label: "IV", instructions: "5 mg/kg em 60 minutos", mgPerKg: 5, maxDose: 300, unit: "mg" },
      { id: generateId(), label: "FV/TV", instructions: "5 mg/kg em bolus, mÃ¡ximo 3x", mgPerKg: 5, unit: "mg" },
      { id: generateId(), label: "IV contÃ­nua", instructions: "5 a 10 mcg/kg/min", mgPerKg: 5, maxPerKg: 10, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Atropina",
    comment: "Doses < 0,1 mg causam bradicardia. Usar com cautela.",
    doses: [
      { id: generateId(), label: "Bradicardia (IV/IO/IT)", instructions: "0,02 mg/kg, podendo repetir 1x", mgPerKg: 0.02, maxDose: 0.5, unit: "mg" },
      { id: generateId(), label: "PrÃ©-anestÃ©sica", instructions: "0,01 a 0,02 mg/kg/dose, IV", mgPerKg: 0.01, maxPerKg: 0.02, maxDose: 0.4, unit: "mg" },
      { id: generateId(), label: "IntoxicaÃ§Ã£o Organofosforados", instructions: "0,02 a 0,05 mg/kg a cada 10-20 min atÃ© efeito", mgPerKg: 0.02, maxPerKg: 0.05, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Bicarbonato de SÃ³dio",
    comment: "Risco de necrose tecidual se extravasamento na infusÃ£o. Velocidade mÃ¡x: 1 mEq/kg/hora.",
    doses: [
      { id: generateId(), label: "PCR", instructions: "0,5 a 1 mEq/kg IV", mgPerKg: 0.5, maxPerKg: 1, unit: "mEq" },
      { id: generateId(), label: "Acidose metabÃ³lica", instructions: "FÃ³rmula: (15 - Bic atual) x Peso x 0,3", unit: "mEq" },
      { id: generateId(), label: "Hipercalemia", instructions: "1 mEq/kg IV em bolus lento", mgPerKg: 1, unit: "mEq" }
    ]
  },
  {
    id: generateId(),
    name: "Cetamina (Ketalar)",
    comment: "Contraindicada em < 3 meses e pacientes com esquizofrenia.",
    doses: [
      { id: generateId(), label: "Oral (prÃ©-procedimento)", instructions: "5 a 10 mg/kg/dose", mgPerKg: 5, maxPerKg: 10, unit: "mg" },
      { id: generateId(), label: "IM", instructions: "2 a 5 mg/kg/dose", mgPerKg: 2, maxPerKg: 5, unit: "mg" },
      { id: generateId(), label: "IV", instructions: "0,5 a 2 mg/kg/dose", mgPerKg: 0.5, maxPerKg: 2, unit: "mg" },
      { id: generateId(), label: "IV contÃ­nua", instructions: "5 a 20 mcg/kg/minuto", mgPerKg: 5, maxPerKg: 20, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Cloreto de PotÃ¡ssio (KCl)",
    comment: "ConcentraÃ§Ã£o mÃ¡x. perifÃ©rica: 40 a 80 mEq/L. Central: 80 a 150 mEq/L. Vel mÃ¡x: 1 mEq/kg/h.",
    doses: [
      { id: generateId(), label: "VO (ReposiÃ§Ã£o)", instructions: "2 a 5 mEq/kg/dia", mgPerKg: 2, maxPerKg: 5, unit: "mEq/dia" },
      { id: generateId(), label: "IV", instructions: "0,5 a 1 mEq/kg/dose (mÃ¡x. 40 mEq)", mgPerKg: 0.5, maxPerKg: 1, maxDose: 40, unit: "mEq" }
    ]
  },
  {
    id: generateId(),
    name: "Dobutamina (Dobutrex)",
    comment: "NÃ£o infundir no mesmo cateter que heparina, hidrocortisona, cefazolina, penicilina e bicarbonato de sÃ³dio.",
    doses: [
      { id: generateId(), label: "ICC / Choque", instructions: "IV contÃ­nua: 2 a 20 mcg/kg/min", mgPerKg: 2, maxPerKg: 20, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Dopamina (Revivan)",
    comment: "Risco de necrose tecidual se extravasamento. NÃ£o infundir com bicarbonato.",
    doses: [
      { id: generateId(), label: "Choque", instructions: "IV contÃ­nua: 1 a 20 mcg/kg/min", mgPerKg: 1, maxPerKg: 20, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Etomidato (Hypnomidate)",
    comment: "NÃ£o recomendado no choque sÃ©ptico por causar supressÃ£o adrenal.",
    doses: [
      { id: generateId(), label: "SRI - SedaÃ§Ã£o", instructions: "0,1 a 0,3 mg/kg/dose", mgPerKg: 0.1, maxPerKg: 0.3, maxDose: 20, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Fentanila (Fentanil)",
    comment: "A infusÃ£o rÃ¡pida pode resultar em rigidez torÃ¡cica. Infundir lentamente (3 a 5 minutos).",
    doses: [
      { id: generateId(), label: "SedaÃ§Ã£o e analgesia (IM/IV)", instructions: "1 a 2 mcg/kg/dose", mgPerKg: 1, maxPerKg: 2, unit: "mcg" },
      { id: generateId(), label: "InfusÃ£o contÃ­nua", instructions: "1 a 3 mcg/kg/minuto", mgPerKg: 1, maxPerKg: 3, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Flumazenil (Lanexat)",
    comment: "Antagonista de benzodiazepÃ­nicos. NÃ£o indicado se atividade comicial.",
    doses: [
      { id: generateId(), label: "IV", instructions: "0,01 mg/kg/dose", mgPerKg: 0.01, maxDose: 0.2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Gluconato de CÃ¡lcio a 10%",
    comment: "Evitar administraÃ§Ã£o IV rÃ¡pida. Evitar extravasamento (necrose).",
    doses: [
      { id: generateId(), label: "Hipocalcemia (VO)", instructions: "500 a 725 mg/kg/dia", mgPerKg: 500, maxPerKg: 725, unit: "mg/dia" },
      { id: generateId(), label: "Hipocalcemia (IV)", instructions: "200 a 500 mg/kg/dia (2 a 5 mL/kg/dia)", mgPerKg: 200, maxPerKg: 500, unit: "mg/dia" },
      { id: generateId(), label: "PCR / Hipercalemia", instructions: "60 a 100 mg/kg/dose", mgPerKg: 60, maxPerKg: 100, maxDose: 3000, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "LidocaÃ­na (XylocaÃ­na)",
    comment: "Atenua o efeito adrenÃ©rgico provocado pela laringoscopia. Indicada em caso de TCE com HIC.",
    doses: [
      { id: generateId(), label: "IV", instructions: "1 mg/kg/dose", mgPerKg: 1, maxDose: 100, unit: "mg" },
      { id: generateId(), label: "SRI PrÃ©-medicaÃ§Ã£o", instructions: "1 a 2 mg/kg/dose", mgPerKg: 1, maxPerKg: 2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Manitol",
    comment: "Monitorar eletrÃ³litos e funÃ§Ã£o.",
    doses: [
      { id: generateId(), label: "IV", instructions: "0,5 a 1 g/kg/dose", mgPerKg: 0.5, maxPerKg: 1, unit: "g" }
    ]
  },
  {
    id: generateId(),
    name: "Midazolam (Dormonid)",
    comment: "AntÃ­doto: flumazenil. Evitar extravasamento na IM; utilizar vasto lateral da coxa preferencialmente.",
    doses: [
      { id: generateId(), label: "IM", instructions: "0,1 a 0,15 mg/kg/dose", mgPerKg: 0.1, maxPerKg: 0.15, maxDose: 10, unit: "mg" },
      { id: generateId(), label: "IV", instructions: "0,1 a 0,6 mg/kg/dose", mgPerKg: 0.1, maxPerKg: 0.6, maxDose: 6, unit: "mg" },
      { id: generateId(), label: "Intranasal (IN)", instructions: "0,2 a 0,3 mg/kg/dose", mgPerKg: 0.2, maxPerKg: 0.3, unit: "mg" },
      { id: generateId(), label: "InfusÃ£o contÃ­nua", instructions: "1 a 2 mcg/kg/minuto", mgPerKg: 1, maxPerKg: 2, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Milrinona (Primacor)",
    comment: "AdministraÃ§Ã£o lenta em atÃ© 15 min. Cuidado na hipocalemia e hipomagnesemia.",
    doses: [
      { id: generateId(), label: "Bolus IV", instructions: "50 a 75 mcg/kg/dose em 10-60min", mgPerKg: 50, maxPerKg: 75, unit: "mcg" },
      { id: generateId(), label: "InfusÃ£o contÃ­nua", instructions: "0,25 a 0,75 mcg/kg/min", mgPerKg: 0.25, maxPerKg: 0.75, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Naloxona (Narcan)",
    comment: "AntÃ­doto para opioides.",
    doses: [
      { id: generateId(), label: "< 20kg", instructions: "0,1 mg/kg/dose", mgPerKg: 0.1, maxDose: 2, unit: "mg" },
      { id: generateId(), label: "> 20kg", instructions: "2 mg/dose", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Norepinefrina / Noradrenalina (Hyponor)",
    comment: "Extravasamento produz necrose tecidual. NÃ£o diluir em SF.",
    doses: [
      { id: generateId(), label: "IV ConstÃ­nua", instructions: "0,05 a 2 mcg/kg/min", mgPerKg: 0.05, maxPerKg: 2, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Nitroprussiato de SÃ³dio (Nipride)",
    comment: "Risco de intoxicaÃ§Ã£o por cianeto. Diluir em SG 5%.",
    doses: [
      { id: generateId(), label: "IV contÃ­nua", instructions: "0,3 a 3 mcg/kg/min (mÃ¡x 10)", mgPerKg: 0.3, maxPerKg: 3, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Propofol (Diprivan)",
    comment: "Extravasamento pode causar necrose. NÃ£o indicado para sedaÃ§Ã£o contÃ­nua prolongada em pediatria.",
    doses: [
      { id: generateId(), label: "SRI", instructions: "1 a 2 mg/kg/dose", mgPerKg: 1, maxPerKg: 2, unit: "mg" },
      { id: generateId(), label: "InfusÃ£o ContÃ­nua", instructions: "200 a 300 mcg/kg/min", mgPerKg: 200, maxPerKg: 300, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "RocurÃ´nio (Esmeron)",
    comment: "OpÃ§Ã£o caso succinilcolina seja contra-indicada.",
    doses: [
      { id: generateId(), label: "SRI", instructions: "0,6 a 1,2 mg/kg/dose", mgPerKg: 0.6, maxPerKg: 1.2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Succinilcolina (Quelicin)",
    comment: "Risco de hipercalemia e fasciculaÃ§Ãµes.",
    doses: [
      { id: generateId(), label: "IM", instructions: "3 a 4 mg/kg/dose", mgPerKg: 3, maxPerKg: 4, maxDose: 150, unit: "mg" },
      { id: generateId(), label: "IV", instructions: "1 a 2 mg/kg/dose", mgPerKg: 1, maxPerKg: 2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Sugammadex (Bridion)",
    comment: "Reversor de rocurÃ´nio/vecurÃ´nio.",
    doses: [
      { id: generateId(), label: "ReversÃ£o", instructions: "2 a 16 mg/kg dependendo do bloqueio", mgPerKg: 2, maxPerKg: 16, unit: "mg" }
    ]
  },

  /* MEDICAMENTOS GERAIS */
  {
    id: generateId(),
    name: "Ãcido AcetilsalicÃ­lico (AAS, Aspirina)",
    comment: "NÃ£o usar em crianÃ§as com suspeita de infecÃ§Ã£o viral (SÃ­ndrome de Reye).",
    doses: [
      { id: generateId(), label: "Analgesia", instructions: "10 a 15 mg/kg/dose (4-6x/dia)", mgPerKg: 10, maxPerKg: 15, unit: "mg" },
      { id: generateId(), label: "DoenÃ§a de Kawasaki", instructions: "30 a 100 mg/kg/dia", mgPerKg: 30, maxPerKg: 100, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Amoxicilina (Amoxil)",
    comment: "Pode induzir rash em pacientes com infecÃ§Ã£o por EBV.",
    doses: [
      { id: generateId(), label: "InfecÃ§Ã£o Leve/Moderada", instructions: "50 mg/kg/dia dividido em 2 a 3x", mgPerKg: 50, unit: "mg/dia" },
      { id: generateId(), label: "InfecÃ§Ã£o Grave/OMA", instructions: "80 a 100 mg/kg/dia dividido em 2 a 3x", mgPerKg: 80, maxPerKg: 100, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Amoxicilina + Clavulanato (Clavulin)",
    comment: "Cuidado com reaÃ§Ã£o adversa: diarreia, vÃ´mitos. A dose Ã© calculada sempre em relaÃ§Ã£o Ã  Amoxicilina.",
    doses: [
      { id: generateId(), label: "Dose comum", instructions: "25 a 45 mg/kg/dia (div 8h ou 12h)", mgPerKg: 25, maxPerKg: 45, unit: "mg/dia" },
      { id: generateId(), label: "InfecÃ§Ã£o Grave/OMA", instructions: "90 mg/kg/dia (div 12h)", mgPerKg: 90, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Azitromicina (Astro, Zithromax)",
    comment: "Deve ser administrada 1 ou 2 horas apÃ³s as refeiÃ§Ãµes, sem antiÃ¡cidos com Mg ou Al.",
    doses: [
      { id: generateId(), label: "Dose Usual (Dia 1)", instructions: "10 a 12 mg/kg no 1Âº dia (mÃ¡x. 500 mg/dia)", mgPerKg: 10, maxPerKg: 12, maxDose: 500, unit: "mg" },
      { id: generateId(), label: "Dias seguintes (D2-D5)", instructions: "5 mg/kg/dia", mgPerKg: 5, maxDose: 250, unit: "mg" }
    ]
  },

  {
    id: generateId(),
    name: "Ceftriaxona (Rocefin)",
    comment: "Evitar em neonatos (risco de kernicterus). Infundir lento. Respeitar 48h de cÃ¡lcio IV.",
    doses: [
      { id: generateId(), label: "IM ou IV Comum", instructions: "50 a 100 mg/kg/dia, 1x ou 12/12h", mgPerKg: 50, maxPerKg: 100, unit: "mg/dia" },
      { id: generateId(), label: "Meningite", instructions: "100 mg/kg/dia 1x ou div 12/12h (mÃ¡x 4g)", mgPerKg: 100, unit: "mg/dia" }
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
    comment: "Usar com cuidado para pacientes com deficiÃªncia de G6PD e hepatopatia. Dose mÃ¡x 90mg/kg/dia.",
    doses: [
      { id: generateId(), label: "< 50 kg (VO)", instructions: "10 a 15 mg/kg/dose, a cada 4-6h", mgPerKg: 10, maxPerKg: 15, maxDose: 1000, unit: "mg" },
      { id: generateId(), label: "> 50 kg (VO)", instructions: "1 g, atÃ© a cada 6 horas (max 4g/dia)", unit: "g" }
    ]
  },
  {
    id: generateId(),
    name: "Ibuprofeno (Alivium)",
    comment: "Aumenta risco de insuficiÃªncia renal se desidrataÃ§Ã£o. Administrar pÃ³s-refeiÃ§Ã£o.",
    doses: [
      { id: generateId(), label: "VO (> 6m)", instructions: "5 a 10 mg/kg/dose, 6-8h, mÃ¡x 400mg", mgPerKg: 5, maxPerKg: 10, maxDose: 400, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Dexametasona (Decadron)",
    comment: "Apresenta meia-vida longa.",
    doses: [
      { id: generateId(), label: "Asma / Crupe", instructions: "0,6 mg/kg (dose Ãºnica, mÃ¡x. 12mg)", mgPerKg: 0.6, maxDose: 12, unit: "mg" },
      { id: generateId(), label: "Edema cerebral / Meningite", instructions: "0,15 mg/kg/dose 6/6h por 4 dias", mgPerKg: 0.15, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Prednisolona (Prelone)",
    comment: "NÃ£o recomendado uso prolongado sem desmame. Associar protetor gÃ¡strico.",
    doses: [
      { id: generateId(), label: "VO Geral (Asma)", instructions: "1 a 2 mg/kg/dia por 3 a 5 dias (mÃ¡x. 60mg/dia)", mgPerKg: 1, maxPerKg: 2, maxDose: 60, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Ondansetrona (Vonau, Zofran)",
    comment: "Prolonga intervalo QT.",
    doses: [
      { id: generateId(), label: "IV", instructions: "0,15 mg/kg/dose (mÃ¡x. 16mg)", mgPerKg: 0.15, maxDose: 16, unit: "mg" },
      { id: generateId(), label: "VO (8 a 15kg)", instructions: "2 mg", unit: "mg" },
      { id: generateId(), label: "VO (15 a 30kg)", instructions: "4 mg", unit: "mg" },
      { id: generateId(), label: "VO (> 30kg)", instructions: "8 mg", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Salbutamol (Aerolin)",
    comment: "Pode causar taquicardia e queda de potÃ¡ssio sÃ©rico. DiminuiÃ§Ã£o do efeito se em uso de betabloqueador.",
    doses: [
      { id: generateId(), label: "InalatÃ³ria (puff 100mcg)", instructions: "4 a 8 puffs, cada 4-6h ou cada 20min em crise", unit: "puffs" },
      { id: generateId(), label: "NebulizaÃ§Ã£o (0 a 13kg)", instructions: "0,15 mg/kg cada 4 a 6 horas (ou cada 20min na crise), mÃ­n: 1,25 mg", mgPerKg: 0.15, unit: "mg" },
      { id: generateId(), label: "NebulizaÃ§Ã£o (> 13kg)", instructions: "2,5 mg cada 4 a 6 horas (ou cada 20min na crise)", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Furosemida (Lasix)",
    comment: "DiurÃ©tico de alÃ§a. Monitorar potÃ¡ssio, sÃ³dio.",
    doses: [
      { id: generateId(), label: "VO / IV", instructions: "1 a 2 mg/kg/dose, cada 6 a 12h", mgPerKg: 1, maxPerKg: 2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Fenobarbital (Gardenal)",
    comment: "Uso no status epilÃ©ptico ou manutenÃ§Ã£o.",
    doses: [
      { id: generateId(), label: "Ataque IV", instructions: "15 a 20 mg/kg em 20 min", mgPerKg: 15, maxPerKg: 20, maxDose: 1000, unit: "mg" },
      { id: generateId(), label: "ManutenÃ§Ã£o", instructions: "3 a 5 mg/kg/dia", mgPerKg: 3, maxPerKg: 5, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "FenitoÃ­na (Hidantal)",
    comment: "Vel mÃ¡x infusÃ£o: 1-3 mg/kg/min (ou 50 mg/min). Diluir SOMENTE em SF 0,9%. NÃ£o usar em SG.",
    doses: [
      { id: generateId(), label: "Ataque IV", instructions: "15 a 20 mg/kg (mÃ¡x. 1g/dose)", mgPerKg: 15, maxPerKg: 20, maxDose: 1000, unit: "mg" },
      { id: generateId(), label: "ManutenÃ§Ã£o", instructions: "4 a 8 mg/kg/dia, em 2 a 3 doses/dia", mgPerKg: 4, maxPerKg: 8, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Diazepam (Valium)",
    comment: "Considerar VR na crise se nÃ£o hÃ¡ IV.",
    doses: [
      { id: generateId(), label: "IV", instructions: "0,2 a 0,3 mg/kg/dose (mÃ¡x. 10 mg)", mgPerKg: 0.2, maxPerKg: 0.3, maxDose: 10, unit: "mg" },
      { id: generateId(), label: "VR (Retal)", instructions: "0,5 mg/kg/dose", mgPerKg: 0.5, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Morfina (Dimorf)",
    comment: "OpiÃ³ide forte. Efeito colateral principal: depressÃ£o respiratÃ³ria. AntÃ­doto: Naloxona.",
    doses: [
      { id: generateId(), label: "IV / IM", instructions: "0,05 a 0,1 mg/kg/dose", mgPerKg: 0.05, maxPerKg: 0.1, maxDose: 5, unit: "mg" },
      { id: generateId(), label: "InfusÃ£o ContÃ­nua", instructions: "10 a 30 mcg/kg/hora", mgPerKg: 10, maxPerKg: 30, unit: "mcg/h" }
    ]
  },
  {
    id: generateId(),
    name: "Tramadol (Tramal)",
    comment: "OpiÃ³ide fraco. Risco de nÃ¡usea e vÃ´mitos (infundir lento).",
    doses: [
      { id: generateId(), label: "IV / VO (> 1 ano)", instructions: "1 a 2 mg/kg/dose (mÃ¡x. 100 mg)", mgPerKg: 1, maxPerKg: 2, maxDose: 100, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Cetoprofeno (Profenid)",
    comment: "AINE. NÃ£o utilizar antes dos 6 meses ou na suspeita de dengue.",
    doses: [
      { id: generateId(), label: "IV (CrianÃ§as)", instructions: "1 a 2 mg/kg/dose", mgPerKg: 1, maxPerKg: 2, maxDose: 100, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Hidrocortisona (Solu-Cortef)",
    comment: "Corticoide de aÃ§Ã£o rÃ¡pida.",
    doses: [
      { id: generateId(), label: "Asma Grave (Ataque)", instructions: "4 a 8 mg/kg/dose", mgPerKg: 4, maxPerKg: 8, maxDose: 250, unit: "mg" },
      { id: generateId(), label: "Choque Adrenal / Anafilaxia", instructions: "2 a 4 mg/kg/dose", mgPerKg: 2, maxPerKg: 4, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Metilprednisolona (Solu-Medrol)",
    comment: "Meningite, asma refratÃ¡ria, lesÃ£o medular.",
    doses: [
      { id: generateId(), label: "Asma (Pulsoterapia)", instructions: "1 a 2 mg/kg/dose", mgPerKg: 1, maxPerKg: 2, maxDose: 125, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Sulfato de MagnÃ©sio 10%",
    comment: "Asma grave (ataque) ou TV (Torsades). Infundir em 20 min.",
    doses: [
      { id: generateId(), label: "Asma / Torsades (IV)", instructions: "25 a 50 mg/kg/dose", mgPerKg: 25, maxPerKg: 50, maxDose: 2000, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Nicardipina (Cardene)",
    comment: "Bloqueador do canal de cÃ¡lcio. Pode reduzir fluxo cerebral e coronariano. Monitorar PA continuamente.",
    defaultDrugMg: 5,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 5,
    doses: [
      { id: generateId(), label: "InfusÃ£o contÃ­nua", instructions: "0,5 a 3 mcg/kg/min", mgPerKg: 0.5, maxPerKg: 3, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Nitroglicerina (Tridil)",
    comment: "Diluir em soluÃ§Ã£o glicosada. Necessita fotoproteÃ§Ã£o. Risco de intoxicaÃ§Ã£o em insuficiÃªncia renal/hepÃ¡tica.",
    defaultDrugMg: 5,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 5,
    doses: [
      { id: generateId(), label: "InfusÃ£o contÃ­nua", instructions: "0,3 a 1 mcg/kg/min (pode titular atÃ© 5 mcg/kg/min)", mgPerKg: 0.3, maxPerKg: 5, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Octreotida (Sandostatin)",
    comment: "Monitorizar glicemia e pressÃ£o arterial durante infusÃ£o.",
    defaultDrugMg: 0.5,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 0.5,
    doses: [
      { id: generateId(), label: "Ataque", instructions: "1 mcg/kg", mgPerKg: 1, unit: "mcg" },
      { id: generateId(), label: "ManutenÃ§Ã£o", instructions: "1 a 2 mcg/kg/hora", mgPerKg: 1, maxPerKg: 2, unit: "mcg/h" }
    ]
  },
  {
    id: generateId(),
    name: "Vasopressina (Encrise)",
    comment: "Uso em PCR e hipotensÃ£o resistente Ã s catecolaminas. Dose mÃ¡xima em bolus: 40 U.",
    defaultVolume: 1,
    doses: [
      { id: generateId(), label: "InfusÃ£o contÃ­nua", instructions: "0,0002 a 0,02 U/kg/min", mgPerKg: 0.0002, maxPerKg: 0.02, unit: "U/kg/min" },
      { id: generateId(), label: "Dose mÃ¡xima", instructions: "Bolus mÃ¡ximo de 40 U", maxDose: 40, unit: "U" }
    ]
  },
  {
    id: generateId(),
    name: "Labetalol (Trandate)",
    comment: "Contraindicado em asma, DPOC e choque cardiogÃªnico.",
    defaultDrugMg: 5,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 5,
    doses: [
      { id: generateId(), label: "Ataque", instructions: "0,2 a 1 mg/kg IV", mgPerKg: 0.2, maxPerKg: 1, unit: "mg" },
      { id: generateId(), label: "InfusÃ£o contÃ­nua", instructions: "0,25 a 3 mg/kg/h", mgPerKg: 0.25, maxPerKg: 3, unit: "mg/kg/h" }
    ]
  },
  {
    id: generateId(),
    name: "Levosimendan (Simdax)",
    comment: "Inodilatador; evitar em insuficiÃªncia renal grave.",
    defaultDrugMg: 2.5,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 2.5,
    doses: [
      { id: generateId(), label: "Ataque", instructions: "6 a 12 mcg/kg em 10 min", mgPerKg: 6, maxPerKg: 12, unit: "mcg" },
      { id: generateId(), label: "ManutenÃ§Ã£o", instructions: "0,05 a 0,2 mcg/kg/min", mgPerKg: 0.05, maxPerKg: 0.2, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Amrinona (Inocor)",
    comment: "Inodilatador. NÃ£o diluir em soluÃ§Ã£o glicosada.",
    defaultDrugMg: 5,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 5,
    doses: [
      { id: generateId(), label: "Ataque", instructions: "0,75 a 1 mg/kg", mgPerKg: 0.75, maxPerKg: 1, unit: "mg" },
      { id: generateId(), label: "ManutenÃ§Ã£o", instructions: "5 a 10 mcg/kg/min", mgPerKg: 5, maxPerKg: 10, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Fenoldopam (Corlopam)",
    comment: "Vasodilatador renal. Pode aumentar pressÃ£o intraocular.",
    defaultDrugMg: 10,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 10,
    doses: [
      { id: generateId(), label: "InfusÃ£o contÃ­nua", instructions: "0,1 a 0,8 mcg/kg/min", mgPerKg: 0.1, maxPerKg: 0.8, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Prostaglandina E1 (Alprostadil)",
    comment: "Monitorizar apneia, hipotensÃ£o e hipoglicemia.",
    doses: [
      { id: generateId(), label: "InfusÃ£o contÃ­nua", instructions: "0,01 a 0,1 mcg/kg/min", mgPerKg: 0.01, maxPerKg: 0.1, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Somatostatina (Stilamin)",
    comment: "MonitorizaÃ§Ã£o hemodinÃ¢mica e de glicemia durante uso.",
    defaultDrugMg: 3,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 3,
    doses: [
      { id: generateId(), label: "Ataque", instructions: "1 a 5 mcg/kg", mgPerKg: 1, maxPerKg: 5, unit: "mcg" },
      { id: generateId(), label: "ManutenÃ§Ã£o", instructions: "3 a 10 mcg/kg/hora", mgPerKg: 3, maxPerKg: 10, unit: "mcg/h" }
    ]
  },
  {
    id: generateId(),
    name: "Terbutalina (Bricanyl)",
    comment: "Pode causar agitaÃ§Ã£o, arritmias e palpitaÃ§Ãµes. Ajustar com cautela em cardiopatas.",
    defaultDrugMg: 0.5,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 0.5,
    doses: [
      { id: generateId(), label: "Bolus", instructions: "10 mcg/kg", mgPerKg: 10, unit: "mcg" },
      { id: generateId(), label: "InfusÃ£o contÃ­nua", instructions: "0,1 a 10 mcg/kg/min", mgPerKg: 0.1, maxPerKg: 10, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Tiopental (Thiopentax)",
    comment: "BarbitÃºrico com risco de instabilidade hemodinÃ¢mica e respiratÃ³ria.",
    defaultDrugMg: 1000,
    defaultVolume: 1000,
    ampouleConcentration_mg_ml: 1,
    doses: [
      { id: generateId(), label: "Ataque", instructions: "2 a 5 mg/kg", mgPerKg: 2, maxPerKg: 5, unit: "mg" },
      { id: generateId(), label: "InfusÃ£o contÃ­nua", instructions: "1 a 10 mcg/kg/min", mgPerKg: 1, maxPerKg: 10, unit: "mcg/min" }
    ]
  },
  {
    id: generateId(),
    name: "Propranolol (Inderal)",
    comment: "Contraindicado em asma, ICC e bloqueio cardÃ­aco.",
    defaultDrugMg: 40,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 40,
    doses: [
      { id: generateId(), label: "VO", instructions: "1 a 3 mg/kg/dia", mgPerKg: 1, maxPerKg: 3, maxDose: 60, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Oxicodona (Oxycontin)",
    comment: "Comprimidos devem ser deglutidos inteiros e nÃ£o podem ser fracionados/triturados.",
    defaultDrugMg: 10,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 10,
    doses: [
      { id: generateId(), label: "VO", instructions: "0,05 a 0,15 mg/kg/dose", mgPerKg: 0.05, maxPerKg: 0.15, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Haloperidol (Haldol)",
    comment: "Pode ser repetido a cada 4 a 8 horas. NÃ£o usar por via endovenosa.",
    defaultDrugMg: 5,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 5,
    doses: [
      { id: generateId(), label: "IM", instructions: "6 a 12 anos: 1 a 3 mg/dose; >12 anos: 5 mg/dose", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Hidralazina (Apresolina)",
    comment: "Taquicardia reflexa. Usar com cautela em doenÃ§a coronariana.",
    defaultDrugMg: 20,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 20,
    doses: [
      { id: generateId(), label: "IV/IM", instructions: "0,2 a 1 mg/kg/dose", mgPerKg: 0.2, maxPerKg: 1, maxDose: 20, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Cloreto de CÃ¡lcio 10%",
    comment: "NÃ£o administrar IM ou SC. Extravasamento pode causar necrose tecidual.",
    defaultDrugMg: 100,
    defaultVolume: 1,
    ampouleConcentration_mg_ml: 100,
    doses: [
      { id: generateId(), label: "IV", instructions: "20 mg/kg (mÃ¡x. 1 g)", mgPerKg: 20, maxDose: 1000, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Glicose hipertÃ´nica",
    comment: "Evitar hiperglicemia iatrogÃªnica; monitorar glicemia capilar.",
    doses: [
      { id: generateId(), label: "Dextrose 10%", instructions: "5 a 10 mL/kg", mgPerKg: 5, maxPerKg: 10, unit: "mL/kg" },
      { id: generateId(), label: "Dextrose 25%", instructions: "2 a 4 mL/kg", mgPerKg: 2, maxPerKg: 4, unit: "mL/kg" }
    ]
  },
  {
    id: generateId(),
    name: "Omeprazol (Losec)",
    comment: "Protetor gÃ¡strico.",
    doses: [
      { id: generateId(), label: "IV / VO", instructions: "1 mg/kg/dia (1x ao dia)", mgPerKg: 1, maxDose: 40, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Prometazina (Fenergan)",
    comment: "Anti-histamÃ­nico. NÃ£o recomendado para lactentes < 2 anos (risco de depressÃ£o respiratÃ³ria fatal).",
    doses: [
      { id: generateId(), label: "IM (Anafilaxia/ReaÃ§Ã£o)", instructions: "0,5 a 1 mg/kg/dose", mgPerKg: 0.5, maxPerKg: 1, maxDose: 25, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Penicilina G Benzatina (Benzetacil)",
    comment: "Uso IM profundo. Tratamento de faringite estreptocÃ³cica e sÃ­filis.",
    doses: [
      { id: generateId(), label: "< 27 kg (IM)", instructions: "600.000 UI", unit: "UI" },
      { id: generateId(), label: ">= 27 kg (IM)", instructions: "1.200.000 UI", unit: "UI" }
    ]
  },
  {
    id: generateId(),
    name: "Clindamicina (Dalacin)",
    comment: "Pode ser diluÃ­da em SF 0,9% ou SG 5%. Infundir num perÃ­odo mÃ­nimo de 10 a 60 minutos.",
    doses: [
      { id: generateId(), label: "InfecÃ§Ãµes graves (IV)", instructions: "25 a 40 mg/kg/dia, divididos a cada 6 a 8 horas", mgPerKg: 25, maxPerKg: 40, unit: "mg/dia" },
      { id: generateId(), label: "VO", instructions: "10 a 30 mg/kg/dia, divididos a cada 6 a 8 horas", mgPerKg: 10, maxPerKg: 30, unit: "mg/dia" }
    ]
  },
  {
    id: generateId(),
    name: "Cefotaxima (Claforan)",
    comment: "Pode ser usada em neonatos. Boa penetraÃ§Ã£o no SNC.",
    doses: [
      { id: generateId(), label: "Meningite", instructions: "200 a 300 mg/kg/dia, IV de 6/6h", mgPerKg: 200, maxPerKg: 300, unit: "mg/dia" },
      { id: generateId(), label: "InfecÃ§Ã£o Comum", instructions: "100 a 150 mg/kg/dia, IV de 6/6h a 8/8h", mgPerKg: 100, maxPerKg: 150, unit: "mg/dia" }
    ]
  },
  // ===== MEDICAÇÕES IMPORTADAS DOS LOTES (lote1-8.json) =====
  {
    id: generateId(),
    name: "Vecur├┤nio",
    comment: "",
    doses: [
      { id: generateId(), label: "IV", instructions: "IV: 1 a 10 anos: 0,08 a 1 mg/kg/dose.", mgPerKg: 0.08, maxPerKg: 1, unit: "mg" },
      { id: generateId(), label: "10 a 16 anos", instructions: "10 a 16 anos: 0,1 mg/kg/dose.", mgPerKg: 0.1, unit: "mg" },
      { id: generateId(), label: "Infus├úo cont├¡nua", instructions: "Infus├úo cont├¡nua: 1 a 2,5 mcg/kg/minuto.", mgPerKg: 1, maxPerKg: 2.5, unit: "mcg" }
    ]
  },
  {
    id: generateId(),
    name: "Acetilciste├¡na",
    comment: "O tratamento deve ser iniciado at├® 8 horas ap├│s a ingest├úo.",
    presentations: [
      { id: generateId(), description: "Injet├ível 100 mg/mL; solu├º├úo oral/xarope 20 mg/mL; granulado 100, 200 e 600 mg (100)", concentration_mg_ml: 100 },
      { id: generateId(), description: "Injet├ível 100 mg/mL; solu├º├úo oral/xarope 20 mg/mL; granulado 100, 200 e 600 mg (20)", concentration_mg_ml: 20 }
    ],
    doses: [
      { id: generateId(), label: "Intoxica├º├úo por acetaminofeno", instructions: "Intoxica├º├úo por acetaminofeno:", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 150 mg/kg em 1 hora, seguida de 50 mg/kg em 4 horas e ap├│s 100 mg/kg em 16 horas.", mgPerKg: 150, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "├ücido Valproico",
    comment: "Aumento da hepatotoxicidade em menores de 2 anos, risco de pancreatite. Evitar em pacientes com mitocondriopatia.",
    presentations: [
      { id: generateId(), description: "Xarope 250 mg/5 mL = 50 mg/mL; comprimidos 250 mg e 500 mg; solu├º├úo injet├ível 100 mg/mL quando dispon├¡vel (50)", concentration_mg_ml: 50 },
      { id: generateId(), description: "Xarope 250 mg/5 mL = 50 mg/mL; comprimidos 250 mg e 500 mg; solu├º├úo injet├ível 100 mg/mL quando dispon├¡vel (100)", concentration_mg_ml: 100 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 10 a 15 mg/kg/dia, em 1 a 3 doses, aumentar 5 a 10 mg/kg/dia semanalmente at├® atingir n├¡veis terap├¬uticos (m├íx. 60 mg/kg/dia).", mgPerKg: 10, maxPerKg: 15, maxDose: 60, unit: "mg" },
      { id: generateId(), label: "Manuten├º├úo", instructions: "Manuten├º├úo: 30 a 60 mg/kg/dia.", mgPerKg: 30, maxPerKg: 60, unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: mesma dosagem dividida a cada 6 horas.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Aciclovir",
    comment: "Intera├º├úo com zidovudina, neurotoxicidade, nefrotoxicidade. Pode ocorrer flebite c├íustica se houver infiltra├º├úo. Considerar solu├º├úo salina IV pr├® e p├│s-administra├º├úo.",
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 20 mg/kg (m├íx. 800 mg) a cada 6 horas por 5 dias.", mgPerKg: 20, maxDose: 800, unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 10 a 15 mg/kg/dose (< 12 anos) ou 500 mg/m┬▓/dose a cada 8 horas.", mgPerKg: 10, maxPerKg: 15, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Albumina",
    comment: "Observar sinais de hipervolemia no momento da infus├úo. Cuidado com hipocalcemia, edema pulmonar. Precau├º├úo em pacientes com alergia a l├ítex.",
    presentations: [
      { id: generateId(), description: "Albumina humana 20% = 200 mg/mL; Albumina 5% = 50 mg/mL (200)", concentration_mg_ml: 200 },
      { id: generateId(), description: "Albumina humana 20% = 200 mg/mL; Albumina 5% = 50 mg/mL (50)", concentration_mg_ml: 50 }
    ],
    doses: [
      { id: generateId(), label: "0,5 a 1 g/kg/dose, IV, em 2 a 6 horas, repetir con...", instructions: "0,5 a 1 g/kg/dose, IV, em 2 a 6 horas, repetir conforme necess├írio.", mgPerKg: 0.5, maxPerKg: 1, unit: "g" }
    ]
  },
  {
    id: generateId(),
    name: "Amicacina",
    comment: "Nefrotoxicidade.",
    presentations: [
      { id: generateId(), description: "50 mg/mL; 250 mg/mL", concentration_mg_ml: 50 },
      { id: generateId(), description: "50 mg/mL; 250 mg/mL", concentration_mg_ml: 250 }
    ],
    doses: [
      { id: generateId(), label: "IV ou", instructions: "IV ou", unit: "mg" },
      { id: generateId(), label: "IM", instructions: "IM: 15 mg/kg/dia, a cada 8 horas ou 1x/dia.", mgPerKg: 15, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Amlodipina",
    comment: "Seguran├ºa n├úo estabelecida abaixo de 6 anos.",
    doses: [
      { id: generateId(), label: "VO (6 a 17 anos)", instructions: "VO (6 a 17 anos): 2,5 a 5 mg 1x/dia.", unit: "mg" },
      { id: generateId(), label: "< 6 anos", instructions: "< 6 anos: 0,05 a 0,1 mg/kg/dia.", mgPerKg: 0.05, maxPerKg: 0.1, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Ampicilina",
    comment: "Diarreia ├® o efeito colateral principal, rash cut├óneo.",
    doses: [
      { id: generateId(), label: "IM ou", instructions: "IM ou", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 100 a 400 mg/kg/dia, a cada 4 ou 6 horas.", mgPerKg: 100, maxPerKg: 400, unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: > 1 m├¬s 50 a 100 mg/kg/dia, a cada 6 horas (m├íx. 3 g/dia).", mgPerKg: 50, maxPerKg: 100, maxDose: 3, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Ampicilina + Sulbactam",
    comment: "Infundir em 30 minutos, no m├¡nimo. Pode haver dor no local da infus├úo. Dose referente ├á ampicilina.",
    doses: [
      { id: generateId(), label: "IV (dose baseada na ampicilina)", instructions: "IV (dose baseada na ampicilina): 100 a 200 mg/kg/dia, a cada 6 horas.", mgPerKg: 100, maxPerKg: 200, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Anfotericina B",
    comment: "N├úo diluir com SF, pode ocorrer precipita├º├úo. Risco de febre e altera├º├úo da PA. Concentra├º├úo m├íx. infus├úo 0,1 mg/mL. Suspender se ureia > 80 mg/dL ou creatinina > 3 mg/dL ou testes de fun├º├úo hep├ítica anormais.",
    presentations: [
      { id: generateId(), description: "Frasco-ampola 50 mg p├│; ap├│s reconstitui├º├úo usual 5 mg/mL; concentra├º├úo final de infus├úo conforme dilui├º├úo (5)", concentration_mg_ml: 5 }
    ],
    doses: [
      { id: generateId(), label: "IV", instructions: "IV: dose-teste: 0,1 mg/kg/dose.", mgPerKg: 0.1, unit: "mg" },
      { id: generateId(), label: "Dose usual", instructions: "Dose usual: 0,3 a 1 mg/kg/dia, em infus├úo ├║nica em 4 horas.", mgPerKg: 0.3, maxPerKg: 1, unit: "mg" },
      { id: generateId(), label: "Dose cumulativa de 1,5 a 2 g em 6 a 10 semanas", instructions: "Dose cumulativa de 1,5 a 2 g em 6 a 10 semanas.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Anfotericina Lipossomal",
    comment: "Infundir lentamente (120 min. em bomba de infus├úo). Pode ocasionar hipocalemia, n├íuseas, v├┤mitos, anemia, rash cut├óneo, nefrotoxicidade, hepatotoxicidade, artralgia, dor no local de infus├úo.",
    presentations: [
      { id: generateId(), description: "Frasco-ampola 50 mg p├│; ap├│s reconstitui├º├úo usual 4 mg/mL; dilui├º├úo final conforme bula (4)", concentration_mg_ml: 4 }
    ],
    doses: [
      { id: generateId(), label: "Tratamento emp├¡rico", instructions: "Tratamento emp├¡rico: 3 mg/kg/dia.", mgPerKg: 3, unit: "mg" },
      { id: generateId(), label: "Infec├º├úo f├║ngica sist├¬mica", instructions: "Infec├º├úo f├║ngica sist├¬mica: 3 a 5 mg/kg/dia.", mgPerKg: 3, maxPerKg: 5, unit: "mg" },
      { id: generateId(), label: "Meningite criptoc├│cica em pacientes H", instructions: "Meningite criptoc├│cica em pacientes H", unit: "mg" },
      { id: generateId(), label: "IV positivos", instructions: "IV positivos: 6 mg/kg/dia.", mgPerKg: 6, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Azul de Metileno",
    comment: "Risco de s├¡ndrome serotonin├®rgica fatal.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo injet├ível 1% = 10 mg/mL (10)", concentration_mg_ml: 10 }
    ],
    doses: [
      { id: generateId(), label: "IV", instructions: "IV: 1 a 2 mg/kg, infus├úo lenta (30 a 60 minutos).", mgPerKg: 1, maxPerKg: 2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Brometo de Ipratr├│pio Inalat├│ria",
    comment: "Usar com cautela em pacientes com glaucoma e miastenia gravis.\nAp├│s o uso, fazer higiene oral para reduzir risco de candid├¡ase oral e rouquid├úo.\nN├úo indicado durante crise aguda de broncoespasmo.",
    presentations: [
      { id: generateId(), description: "250 mcg/mL", concentration_mg_ml: 250 }
    ],
    doses: [
      { id: generateId(), label: "Nebuliza├º├úo", instructions: "Nebuliza├º├úo: < 10 kg: 0,25 mg; > 10 kg: 0,5 mg, a cada 20 minutos nas 3 primeiras doses.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Calcitonina",
    comment: "Monitorar fosfatase alcalina, hidroxiprolina urin├íria e eletr├│litos s├®ricos.\nDose para adultos.",
    presentations: [
      { id: generateId(), description: "Ampola 100 UI/mL; spray nasal 200 UI/dose (100)", concentration_mg_ml: 100 },
      { id: generateId(), description: "Ampola 100 UI/mL; spray nasal 200 UI/dose (200)", concentration_mg_ml: 200 }
    ],
    doses: [
      { id: generateId(), label: "Hipercalcemia", instructions: "Hipercalcemia: SC,", unit: "mg" },
      { id: generateId(), label: "IM", instructions: "IM: 4 UI/kg, a cada 12 horas.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Captopril",
    comment: "N├úo usar em pacientes com estenose de art├®ria renal, ajustar a dose para insufici├¬ncia renal.",
    presentations: [
      { id: generateId(), description: "Comprimidos 12,5 mg, 25 mg e 50 mg; solu├º├úo oral geralmente manipulada, n├úo padronizada (12.5)", concentration_mg_ml: 12.5 },
      { id: generateId(), description: "Comprimidos 12,5 mg, 25 mg e 50 mg; solu├º├úo oral geralmente manipulada, n├úo padronizada (25)", concentration_mg_ml: 25 },
      { id: generateId(), description: "Comprimidos 12,5 mg, 25 mg e 50 mg; solu├º├úo oral geralmente manipulada, n├úo padronizada (50)", concentration_mg_ml: 50 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 0,15 a 0,5 mg/kg/dose (m├íx. 12,5 mg na dose inicial) em 2 a 4 doses.", mgPerKg: 0.15, maxPerKg: 0.5, maxDose: 12.5, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Carbamazepina",
    comment: "Risco de anemia apl├ísica, agranulocitose, s├¡ndrome de Stevens-Johnson.",
    presentations: [
      { id: generateId(), description: "Suspens├úo oral 100 mg/5 mL = 20 mg/mL; comprimidos 200 mg e 400 mg (20)", concentration_mg_ml: 20 },
      { id: generateId(), description: "Suspens├úo oral 100 mg/5 mL = 20 mg/mL; comprimidos 200 mg e 400 mg (200)", concentration_mg_ml: 200 },
      { id: generateId(), description: "Suspens├úo oral 100 mg/5 mL = 20 mg/mL; comprimidos 200 mg e 400 mg (400)", concentration_mg_ml: 400 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: dose inicial: 5 a 10 mg/kg/dia, a cada 6 ou 8 horas, aumentando a cada 5 a 7 dias conforme necess├írio.", mgPerKg: 5, maxPerKg: 10, unit: "mg" },
      { id: generateId(), label: "Manuten├º├úo", instructions: "Manuten├º├úo: 15 a 35 mg/kg/dia, a cada 6 ou 8 horas (m├íx. 1 g/dia).", mgPerKg: 15, maxPerKg: 35, maxDose: 1, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Carv├úo Ativado",
    comment: "Administrar preferencialmente at├® 1 hora para melhor resposta.",
    doses: [
      { id: generateId(), label: "VO ou SNG", instructions: "VO ou SNG: 1 g/kg/dose (m├íx. 50 g/dose).", mgPerKg: 1, maxDose: 50, unit: "g" }
    ]
  },
  {
    id: generateId(),
    name: "Cefadroxila",
    comment: "Pode ser administrada junto com refei├º├úo se houver epigastralgia.",
    presentations: [
      { id: generateId(), description: "250 mg/5 mL = 50 mg/mL | 500 mg", concentration_mg_ml: 50 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 30 mg/kg/dia, a cada 12 horas (m├íx. 2 g/dia).", mgPerKg: 30, maxDose: 2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Cefazolina",
    comment: "Pode ser administrada junto com refei├º├úo se houver epigastralgia.",
    doses: [
      { id: generateId(), label: "IV", instructions: "IV: 80 a 160 mg/kg/dia, a cada 4 ou 6 horas.", mgPerKg: 80, maxPerKg: 160, unit: "mg" },
      { id: generateId(), label: "IM ou", instructions: "IM ou", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 25 a 100 mg/kg/dia, a cada 6 ou 8 horas (m├íx. 1 g/dose).", mgPerKg: 25, maxPerKg: 100, maxDose: 1, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Cefepima",
    comment: "Ajustar pelo ClCr se houver insufici├¬ncia renal.\nPode ser administrada junto com refei├º├úo se houver epigastralgia.",
    doses: [
      { id: generateId(), label: "IV", instructions: "IV: 50 mg/kg/dose, a cada 12 horas (m├íx. 2 g/dose, 2 a 3x/dia).", mgPerKg: 50, maxDose: 2, unit: "mg" },
      { id: generateId(), label: "Neutropenia febril", instructions: "Neutropenia febril: 50 mg/kg/dose, a cada 8 horas.", mgPerKg: 50, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Ceftazidima",
    comment: "Pode ser administrada junto com refei├º├úo se houver epigastralgia.",
    doses: [
      { id: generateId(), label: "IV ou", instructions: "IV ou", unit: "mg" },
      { id: generateId(), label: "IM", instructions: "IM: 100 a 150 mg/kg/dia, a cada 8 horas (m├íx. 6 g/dia).", mgPerKg: 100, maxPerKg: 150, maxDose: 6, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Cefuroxima",
    comment: "Pode ser administrada junto com refei├º├úo se houver epigastralgia.",
    presentations: [
      { id: generateId(), description: "Suspens├úo oral 250 mg/5 mL = 50 mg/mL; comprimidos 250 mg e 500 mg; frasco-ampola 750 mg ou 1,5 g (50)", concentration_mg_ml: 50 },
      { id: generateId(), description: "Suspens├úo oral 250 mg/5 mL = 50 mg/mL; comprimidos 250 mg e 500 mg; frasco-ampola 750 mg ou 1,5 g (250)", concentration_mg_ml: 250 },
      { id: generateId(), description: "Suspens├úo oral 250 mg/5 mL = 50 mg/mL; comprimidos 250 mg e 500 mg; frasco-ampola 750 mg ou 1,5 g (500)", concentration_mg_ml: 500 },
      { id: generateId(), description: "Suspens├úo oral 250 mg/5 mL = 50 mg/mL; comprimidos 250 mg e 500 mg; frasco-ampola 750 mg ou 1,5 g (750)", concentration_mg_ml: 750 },
      { id: generateId(), description: "Suspens├úo oral 250 mg/5 mL = 50 mg/mL; comprimidos 250 mg e 500 mg; frasco-ampola 750 mg ou 1,5 g (1500)", concentration_mg_ml: 1500 }
    ],
    doses: [
      { id: generateId(), label: "IV", instructions: "IV: 50 a 150 mg/kg/dia, a cada 6 ou 8 horas (m├íx. 6 g/dia).", mgPerKg: 50, maxPerKg: 150, maxDose: 6, unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 20 a 30 mg/kg/dia, a cada 12 horas (m├íx. 500 mg/dose).", mgPerKg: 20, maxPerKg: 30, maxDose: 500, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Cetorolaco",
    comment: "Seguran├ºa e efic├ícia n├úo estabelecidas para pediatria.\nUsar com cautela em < 2 anos.\nPode causar desconforto em trato gastrointestinal.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo injet├ível 30 mg/mL; comprimido/sublingual 10 mg (30)", concentration_mg_ml: 30 },
      { id: generateId(), description: "Solu├º├úo injet├ível 30 mg/mL; comprimido/sublingual 10 mg (10)", concentration_mg_ml: 10 }
    ],
    doses: [
      { id: generateId(), label: "IV/", instructions: "IV/", unit: "mg" },
      { id: generateId(), label: "IM", instructions: "IM: 1 mg/kg/dose, a cada 4 ou 6 horas (m├íx. 90 mg/dia).", mgPerKg: 1, maxDose: 90, unit: "mg" },
      { id: generateId(), label: "< 2 anos", instructions: "< 2 anos: 0,5 mg/kg/dose a cada 6 a 8 horas, no m├íx. 3 dias.", mgPerKg: 0.5, unit: "mg" },
      { id: generateId(), label: "2 a 16 anos", instructions: "2 a 16 anos: IM, 1 mg/kg, dose ├║nica (m├íx. 30 mg).", mgPerKg: 1, maxDose: 30, unit: "mg" },
      { id: generateId(), label: "IV, 0,5 mg/kg, dose ├║nica (m├íx. 15 mg)", instructions: "IV, 0,5 mg/kg, dose ├║nica (m├íx. 15 mg).", mgPerKg: 0.5, maxDose: 15, unit: "mg" },
      { id: generateId(), label: "M├║ltiplas doses", instructions: "M├║ltiplas doses: IM/IV, 0,5 mg/kg/dose, a cada 6 horas.", mgPerKg: 0.5, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Ciprofloxacina",
    comment: "Aprovada para faixa et├íria pedi├ítrica para ITU complicada e infec├º├úo por antraz.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo IV 2 mg/mL; comprimidos 250 mg, 500 mg e 750 mg; suspens├úo 250 mg/5 mL quando dispon├¡vel (2)", concentration_mg_ml: 2 },
      { id: generateId(), description: "Solu├º├úo IV 2 mg/mL; comprimidos 250 mg, 500 mg e 750 mg; suspens├úo 250 mg/5 mL quando dispon├¡vel (50)", concentration_mg_ml: 50 },
      { id: generateId(), description: "Solu├º├úo IV 2 mg/mL; comprimidos 250 mg, 500 mg e 750 mg; suspens├úo 250 mg/5 mL quando dispon├¡vel (250)", concentration_mg_ml: 250 },
      { id: generateId(), description: "Solu├º├úo IV 2 mg/mL; comprimidos 250 mg, 500 mg e 750 mg; suspens├úo 250 mg/5 mL quando dispon├¡vel (500)", concentration_mg_ml: 500 },
      { id: generateId(), description: "Solu├º├úo IV 2 mg/mL; comprimidos 250 mg, 500 mg e 750 mg; suspens├úo 250 mg/5 mL quando dispon├¡vel (750)", concentration_mg_ml: 750 }
    ],
    doses: [
      { id: generateId(), label: "IV ou", instructions: "IV ou", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 20 a 30 mg/kg/dia, a cada 12 horas (m├íx. 800 mg/dia IV, e 1.500 mg/dia VO).", mgPerKg: 20, maxPerKg: 30, maxDose: 800, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Claritromicina",
    comment: "Pode prolongar intervalo QT.",
    presentations: [
      { id: generateId(), description: "250 mg/5 mL = 50 mg/mL | 500 mg", concentration_mg_ml: 50 }
    ],
    doses: [
      { id: generateId(), label: "IV ou", instructions: "IV ou", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 15 mg/kg/dia, a cada 12 horas (m├íx. 500 mg/dose).", mgPerKg: 15, maxDose: 500, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Cloranfenicol",
    comment: "Discrasias sangu├¡neas. Uso restrito.",
    presentations: [
      { id: generateId(), description: "C├ípsulas 250 mg; frasco-ampola 1 g (succinato); col├¡rio n├úo aplic├ível ├á dose sist├¬mica (250)", concentration_mg_ml: 250 },
      { id: generateId(), description: "C├ípsulas 250 mg; frasco-ampola 1 g (succinato); col├¡rio n├úo aplic├ível ├á dose sist├¬mica (1000)", concentration_mg_ml: 1000 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 50 a 100 mg/kg/dia, a cada 6 horas (m├íx. 4 g/dia).", mgPerKg: 50, maxPerKg: 100, maxDose: 4, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Code├¡na",
    comment: "Pode ser administrada junto com refei├º├úo se houver epigastralgia.\nUsar com cautela em pacientes portadores de comorbidades respirat├│rias pelo risco de depress├úo respirat├│ria.",
    presentations: [
      { id: generateId(), description: "3 mg/mL | 30 mg; 60 mg", concentration_mg_ml: 3 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 0,5 a 1 mg/kg/dose, a cada 4 a 6 horas, conforme necess├írio (m├íx. 60 mg/dose).", mgPerKg: 0.5, maxPerKg: 1, maxDose: 60, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Deferoxamina",
    comment: "Torna a urina alaranjada ou rosada.",
    presentations: [
      { id: generateId(), description: "Frasco-ampola 500 mg; concentra├º├úo depende do volume de reconstitui├º├úo (500)", concentration_mg_ml: 500 }
    ],
    doses: [
      { id: generateId(), label: "IV", instructions: "IV: 15 mg/kg/hora,", mgPerKg: 15, unit: "mg" },
      { id: generateId(), label: "IV ou 50 mg/kg/dose, IM, a cada 6 horas (m├íx. 360 ...", instructions: "IV ou 50 mg/kg/dose, IM, a cada 6 horas (m├íx. 360 mg/kg ou 6 g/dia, o menor valor).", mgPerKg: 50, maxDose: 360, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Desloratadina",
    comment: "Meia-vida: 24 horas.",
    presentations: [
      { id: generateId(), description: "Xarope/solu├º├úo oral 0,5 mg/mL; comprimido 5 mg (0.5)", concentration_mg_ml: 0.5 },
      { id: generateId(), description: "Xarope/solu├º├úo oral 0,5 mg/mL; comprimido 5 mg (5)", concentration_mg_ml: 5 }
    ],
    doses: [
      { id: generateId(), label: "< 6 meses a 1 ano", instructions: "< 6 meses a 1 ano: 1 mg, VO, 1x/dia.", unit: "mg" },
      { id: generateId(), label: "1 a 5 anos", instructions: "1 a 5 anos: 1,25 mg, VO, 1x/dia.", unit: "mg" },
      { id: generateId(), label: "6 a 11 anos", instructions: "6 a 11 anos: 2,5 mg, VO, 1x/dia.", unit: "mg" },
      { id: generateId(), label: "> 12 anos e adultos", instructions: "> 12 anos e adultos: 5 mg, VO, 1x/dia.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Desmopressina (DDAVP)",
    comment: "Na infus├úo IV, monitorar PA e frequ├¬ncia card├¡aca.\nNo diabetes ins├¡pido, monitorar d├®bito urin├írio e eletr├│litos s├®ricos.",
    presentations: [
      { id: generateId(), description: "Spray nasal 10 mcg/dose; comprimidos 0,1 mg e 0,2 mg; solu├º├úo injet├ível 4 mcg/mL (10)", concentration_mg_ml: 10 },
      { id: generateId(), description: "Spray nasal 10 mcg/dose; comprimidos 0,1 mg e 0,2 mg; solu├º├úo injet├ível 4 mcg/mL (0.1)", concentration_mg_ml: 0.1 },
      { id: generateId(), description: "Spray nasal 10 mcg/dose; comprimidos 0,1 mg e 0,2 mg; solu├º├úo injet├ível 4 mcg/mL (0.2)", concentration_mg_ml: 0.2 },
      { id: generateId(), description: "Spray nasal 10 mcg/dose; comprimidos 0,1 mg e 0,2 mg; solu├º├úo injet├ível 4 mcg/mL (4)", concentration_mg_ml: 4 }
    ],
    doses: [
      { id: generateId(), label: "Hemofilia A aguda ou doen├ºa de von Willebrand", instructions: "Hemofilia A aguda ou doen├ºa de von Willebrand: 0,3 mcg/kg,", mgPerKg: 0.3, unit: "mcg" },
      { id: generateId(), label: "IV em 30 min", instructions: "IV em 30 min.", unit: "mg" },
      { id: generateId(), label: "Diabetes ins├¡pido", instructions: "Diabetes ins├¡pido,", unit: "mg" },
      { id: generateId(), label: "IN", instructions: "IN: 5 a 30 mcg (0,05 a 0,3 mL) fracionado em 1 ou at├® 3 doses.", unit: "mg" },
      { id: generateId(), label: "VO, em > 4 anos", instructions: "VO, em > 4 anos: 0,05 mg a 2x/dia.", unit: "mg" },
      { id: generateId(), label: "IV/IM/", instructions: "IV/IM/", unit: "mg" },
      { id: generateId(), label: "SC", instructions: "SC: 1 a 4 mcg/dose.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Dexclorfeniramina",
    comment: "Pode ocorrer sonol├¬ncia discreta a moderada.",
    presentations: [
      { id: generateId(), description: "Xarope 2 mg/5 mL = 0,4 mg/mL; comprimido 2 mg; gotas com concentra├º├úo por produto (0.4)", concentration_mg_ml: 0.4 },
      { id: generateId(), description: "Xarope 2 mg/5 mL = 0,4 mg/mL; comprimido 2 mg; gotas com concentra├º├úo por produto (2)", concentration_mg_ml: 2 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 2 a 6 anos: 0,5 a 1 mg/dose, a cada 4 a 6 horas.", unit: "mg" },
      { id: generateId(), label: "6 a 12 anos", instructions: "6 a 12 anos: 1 mg/dose, a cada 4 a 6 horas.", unit: "mg" },
      { id: generateId(), label: "> 12 anos", instructions: "> 12 anos: 2 mg/dose, a cada 4 a 6 horas (m├íx. 12 mg/dia).", maxDose: 12, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Diclofenaco",
    comment: "Seguran├ºa e efic├ícia n├úo estabelecidas para pediatria.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo injet├ível 25 mg/mL; gotas 15 mg/mL; comprimidos 50 mg (25)", concentration_mg_ml: 25 },
      { id: generateId(), description: "Solu├º├úo injet├ível 25 mg/mL; gotas 15 mg/mL; comprimidos 50 mg (15)", concentration_mg_ml: 15 },
      { id: generateId(), description: "Solu├º├úo injet├ível 25 mg/mL; gotas 15 mg/mL; comprimidos 50 mg (50)", concentration_mg_ml: 50 }
    ],
    doses: [
      { id: generateId(), label: "IV ou", instructions: "IV ou", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 2 a 3 mg/kg/dia, 2 a 4x/dia, m├íx. 200 mg/dia.", mgPerKg: 2, maxPerKg: 3, maxDose: 200, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Difenidramina",
    comment: "Pode causar sonol├¬ncia.",
    presentations: [
      { id: generateId(), description: "50 mg/mL", concentration_mg_ml: 50 }
    ],
    doses: [
      { id: generateId(), label: "IV ou", instructions: "IV ou", unit: "mg" },
      { id: generateId(), label: "IM", instructions: "IM: 5 mg/kg/dia, a cada 6 horas (m├íx. 300 mg/dia).", mgPerKg: 5, maxDose: 300, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Digoxina",
    comment: "Controlar n├¡veis s├®ricos de pot├íssio, c├ílcio e magn├®sio.\nPode levar a arritmia card├¡aca.",
    presentations: [
      { id: generateId(), description: "Elixir 0,05 mg/mL; comprimido 0,25 mg; solu├º├úo injet├ível 0,25 mg/mL (0.05)", concentration_mg_ml: 0.05 },
      { id: generateId(), description: "Elixir 0,05 mg/mL; comprimido 0,25 mg; solu├º├úo injet├ível 0,25 mg/mL (0.25)", concentration_mg_ml: 0.25 }
    ],
    doses: [
      { id: generateId(), label: "Dose de digitaliza├º├úo", instructions: "Dose de digitaliza├º├úo:", unit: "mg" },
      { id: generateId(), label: "IV/", instructions: "IV/", unit: "mg" },
      { id: generateId(), label: "IM (administrar metade da dose no tempo zero, segu...", instructions: "IM (administrar metade da dose no tempo zero, seguido de ┬╝ da dose ap├│s 6 a 8 horas, por 2x).", unit: "mg" },
      { id: generateId(), label: "Prematuros", instructions: "Prematuros: 15 a 25 mcg/kg.", mgPerKg: 15, maxPerKg: 25, unit: "mcg" },
      { id: generateId(), label: "RN termo", instructions: "RN termo: 20 a 30 mcg/kg.", mgPerKg: 20, maxPerKg: 30, unit: "mcg" },
      { id: generateId(), label: "< 2 anos", instructions: "< 2 anos: 30 a 50 mcg/kg.", mgPerKg: 30, maxPerKg: 50, unit: "mcg" },
      { id: generateId(), label: "2 a 5 anos", instructions: "2 a 5 anos: 25 a 35 mcg/kg.", mgPerKg: 25, maxPerKg: 35, unit: "mcg" },
      { id: generateId(), label: "5 a 10 anos", instructions: "5 a 10 anos: 15 a 30 mcg/kg.", mgPerKg: 15, maxPerKg: 30, unit: "mcg" },
      { id: generateId(), label: "> 10 anos", instructions: "> 10 anos: 8 a 12 mcg/kg.", mgPerKg: 8, maxPerKg: 12, unit: "mcg" },
      { id: generateId(), label: "Dose de manuten├º├úo", instructions: "Dose de manuten├º├úo:", unit: "mg" },
      { id: generateId(), label: "IV/", instructions: "IV/", unit: "mg" },
      { id: generateId(), label: "IM (2x/dia, pode ser aumentada a cada 2 semanas ba...", instructions: "IM (2x/dia, pode ser aumentada a cada 2 semanas baseado na resposta cl├¡nica, no n├¡vel s├®rico e na toxicidade).", unit: "mg" },
      { id: generateId(), label: "Prematuros", instructions: "Prematuros: 1,9 a 3,1 mcg/kg.", mgPerKg: 1.9, maxPerKg: 3.1, unit: "mcg" },
      { id: generateId(), label: "RN termo", instructions: "RN termo: 3 a 4,5 mcg/kg.", mgPerKg: 3, maxPerKg: 4.5, unit: "mcg" },
      { id: generateId(), label: "< 2 anos", instructions: "< 2 anos: 4,5 a 7,5 mcg/kg.", mgPerKg: 4.5, maxPerKg: 7.5, unit: "mcg" },
      { id: generateId(), label: "2 a 5 anos", instructions: "2 a 5 anos: 3,8 a 5,3 mcg/kg.", mgPerKg: 3.8, maxPerKg: 5.3, unit: "mcg" },
      { id: generateId(), label: "5 a 10 anos", instructions: "5 a 10 anos: 2,3 a 4,5 mcg/kg.", mgPerKg: 2.3, maxPerKg: 4.5, unit: "mcg" },
      { id: generateId(), label: "> 10 anos", instructions: "> 10 anos: 2,4 a 3,6 mcg/kg.", mgPerKg: 2.4, maxPerKg: 3.6, unit: "mcg" },
      { id: generateId(), label: "Dose de digitaliza├º├úo", instructions: "Dose de digitaliza├º├úo", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO:", unit: "mg" },
      { id: generateId(), label: "(administrar metade da dose no tempo zero, seguido...", instructions: "(administrar metade da dose no tempo zero, seguido de ┬╝ da dose ap├│s 4 a 8 horas, por 2x).", unit: "mg" },
      { id: generateId(), label: "Prematuros", instructions: "Prematuros: 20 a 30 mcg/kg.", mgPerKg: 20, maxPerKg: 30, unit: "mcg" },
      { id: generateId(), label: "RN termo", instructions: "RN termo: 25 a 35 mcg/kg.", mgPerKg: 25, maxPerKg: 35, unit: "mcg" },
      { id: generateId(), label: "< 2 anos", instructions: "< 2 anos: 35 a 60 mcg/kg.", mgPerKg: 35, maxPerKg: 60, unit: "mcg" },
      { id: generateId(), label: "2 a 5 anos", instructions: "2 a 5 anos: 30 a 45 mcg/kg.", mgPerKg: 30, maxPerKg: 45, unit: "mcg" },
      { id: generateId(), label: "5 a 10 anos", instructions: "5 a 10 anos: 20 a 35 mcg/kg.", mgPerKg: 20, maxPerKg: 35, unit: "mcg" },
      { id: generateId(), label: "> 10 anos", instructions: "> 10 anos: 10 a 15 mcg/kg.", mgPerKg: 10, maxPerKg: 15, unit: "mcg" },
      { id: generateId(), label: "Dose de manuten├º├úo", instructions: "Dose de manuten├º├úo", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO:", unit: "mg" },
      { id: generateId(), label: "(2x/dia, pode ser aumentada a cada 2 semanas basea...", instructions: "(2x/dia, pode ser aumentada a cada 2 semanas baseado na resposta cl├¡nica, n├¡vel s├®rico e toxicidade).", unit: "mg" },
      { id: generateId(), label: "Prematuros", instructions: "Prematuros: 2,3 a 3,9 mcg/kg.", mgPerKg: 2.3, maxPerKg: 3.9, unit: "mcg" },
      { id: generateId(), label: "RN termo", instructions: "RN termo: 3,8 a 5,6 mcg/kg.", mgPerKg: 3.8, maxPerKg: 5.6, unit: "mcg" },
      { id: generateId(), label: "< 2 anos", instructions: "< 2 anos: 5,6 a 9,4 mcg/kg.", mgPerKg: 5.6, maxPerKg: 9.4, unit: "mcg" },
      { id: generateId(), label: "2 a 5 anos", instructions: "2 a 5 anos: 4,7 a 6,6 mcg/kg.", mgPerKg: 4.7, maxPerKg: 6.6, unit: "mcg" },
      { id: generateId(), label: "5 a 10 anos", instructions: "5 a 10 anos: 2,8 a 5,6 mcg/kg.", mgPerKg: 2.8, maxPerKg: 5.6, unit: "mcg" },
      { id: generateId(), label: "> 10 anos", instructions: "> 10 anos: 3 a 4,5 mcg/kg.", mgPerKg: 3, maxPerKg: 4.5, unit: "mcg" }
    ]
  },
  {
    id: generateId(),
    name: "Dimenidrinato",
    comment: "Pode causar sonol├¬ncia e efeitos colaterais anticolin├®rgicos.",
    presentations: [
      { id: generateId(), description: "Gotas 25 mg/mL; solu├º├úo injet├ível 50 mg/mL; comprimidos 50 mg e 100 mg (25)", concentration_mg_ml: 25 },
      { id: generateId(), description: "Gotas 25 mg/mL; solu├º├úo injet├ível 50 mg/mL; comprimidos 50 mg e 100 mg (50)", concentration_mg_ml: 50 },
      { id: generateId(), description: "Gotas 25 mg/mL; solu├º├úo injet├ível 50 mg/mL; comprimidos 50 mg e 100 mg (100)", concentration_mg_ml: 100 }
    ],
    doses: [
      { id: generateId(), label: "VO/IM/", instructions: "VO/IM/", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 1 mg/kg a cada 6 horas.", mgPerKg: 1, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Doxiciclina",
    comment: "Pode causar descolora├º├úo do esmalte dos dentes e abaulamento de fontanela.",
    presentations: [
      { id: generateId(), description: "Comprimidos/c├ípsulas 100 mg; outras apresenta├º├Áes dependem do produto (100)", concentration_mg_ml: 100 }
    ],
    doses: [
      { id: generateId(), label: "> 8 anos, VO/", instructions: "> 8 anos, VO/", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 2 a 4 mg/kg/dia, 1 a 2x/dia (m├íx. 200 mg/dia).", mgPerKg: 2, maxPerKg: 4, maxDose: 200, unit: "mg" },
      { id: generateId(), label: "Adolescentes e adultos VO/", instructions: "Adolescentes e adultos VO/", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 100 a 200 mg/dia, 1 ou 2x/dia.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "EDTA C├ílcico",
    comment: "Tratamento da intoxica├º├úo por chumbo. Frequentemente causa tromboflebite no local da inje├º├úo. Pode causar arritmia card├¡aca, monitorar durante a infus├úo.",
    presentations: [
      { id: generateId(), description: "Edetato c├ílcico diss├│dico injet├ível 200 mg/mL (ex.: 1 g/5 mL) (200)", concentration_mg_ml: 200 }
    ],
    doses: [
      { id: generateId(), label: "IM/", instructions: "IM/", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 25 a 50 mg/kg/dia, por 5 dias (m├íx. de 1 g/dia em crian├ºas, 2 a 3 g/dia em adultos).", mgPerKg: 25, maxPerKg: 50, maxDose: 1, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Enalapril",
    comment: "Risco de angioedema.",
    presentations: [
      { id: generateId(), description: "Comprimidos 5 mg, 10 mg e 20 mg; solu├º├úo oral geralmente manipulada (5)", concentration_mg_ml: 5 },
      { id: generateId(), description: "Comprimidos 5 mg, 10 mg e 20 mg; solu├º├úo oral geralmente manipulada (10)", concentration_mg_ml: 10 },
      { id: generateId(), description: "Comprimidos 5 mg, 10 mg e 20 mg; solu├º├úo oral geralmente manipulada (20)", concentration_mg_ml: 20 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 0,1 mg/kg/dia, em 1 ou 2 doses (m├íx. 0,5 mg/kg/dia).", mgPerKg: 0.1, maxDose: 0.5, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Eritromicina",
    comment: "Administrar longe das refei├º├Áes.",
    presentations: [
      { id: generateId(), description: "Suspens├úo oral 250 mg/5 mL = 50 mg/mL; comprimidos/c├ípsulas 500 mg; frasco-ampola 1 g IV quando dispon├¡vel (50)", concentration_mg_ml: 50 },
      { id: generateId(), description: "Suspens├úo oral 250 mg/5 mL = 50 mg/mL; comprimidos/c├ípsulas 500 mg; frasco-ampola 1 g IV quando dispon├¡vel (500)", concentration_mg_ml: 500 },
      { id: generateId(), description: "Suspens├úo oral 250 mg/5 mL = 50 mg/mL; comprimidos/c├ípsulas 500 mg; frasco-ampola 1 g IV quando dispon├¡vel (1000)", concentration_mg_ml: 1000 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 30 a 50 mg/kg/dia, a cada 6 ou 8 horas (m├íx. 2 g/dia).", mgPerKg: 30, maxPerKg: 50, maxDose: 2, unit: "mg" },
      { id: generateId(), label: "Pertussis", instructions: "Pertussis: 40 a 50 mg/kg/dia, 4x/dia, por 14 dias (m├íx. 500 mg/dose, a cada 6 horas).", mgPerKg: 40, maxPerKg: 50, maxDose: 500, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Eritropoetina",
    comment: "Titular dose para manter Hb em torno de 10 a 11 g/dL.",
    presentations: [
      { id: generateId(), description: "Solu├º├Áes/seringas em UI: 1.000, 2.000, 4.000, 10.000 UI/mL ou por seringa, conforme produto (1000)", concentration_mg_ml: 1000 },
      { id: generateId(), description: "Solu├º├Áes/seringas em UI: 1.000, 2.000, 4.000, 10.000 UI/mL ou por seringa, conforme produto (2000)", concentration_mg_ml: 2000 },
      { id: generateId(), description: "Solu├º├Áes/seringas em UI: 1.000, 2.000, 4.000, 10.000 UI/mL ou por seringa, conforme produto (4000)", concentration_mg_ml: 4000 },
      { id: generateId(), description: "Solu├º├Áes/seringas em UI: 1.000, 2.000, 4.000, 10.000 UI/mL ou por seringa, conforme produto (10000)", concentration_mg_ml: 10000 }
    ],
    doses: [
      { id: generateId(), label: "Anemia da IRC", instructions: "Anemia da IRC: dose inicial SC/", unit: "mg" },
      { id: generateId(), label: "IV 50 U/kg, 3x/semana", instructions: "IV 50 U/kg, 3x/semana.", mgPerKg: 50, unit: "U" }
    ]
  },
  {
    id: generateId(),
    name: "Espironolactona",
    comment: "Monitorar pot├íssio, s├│dio e fun├º├úo renal.",
    presentations: [
      { id: generateId(), description: "Comprimidos 25 mg, 50 mg e 100 mg; suspens├úo oral geralmente manipulada (25)", concentration_mg_ml: 25 },
      { id: generateId(), description: "Comprimidos 25 mg, 50 mg e 100 mg; suspens├úo oral geralmente manipulada (50)", concentration_mg_ml: 50 },
      { id: generateId(), description: "Comprimidos 25 mg, 50 mg e 100 mg; suspens├úo oral geralmente manipulada (100)", concentration_mg_ml: 100 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 1 a 3,3 mg/kg/dia ou 60 mg/m┬▓/dia, divididos de 2 a 4x/dia (m├íx. 100 mg/dia).", mgPerKg: 1, maxPerKg: 3.3, maxDose: 100, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Fenoterol",
    comment: "Pode causar taquicardia, tremores e mudan├ºas transit├│rias no n├¡vel s├®rico de pot├íssio.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo gotas/nebuliza├º├úo 5 mg/mL; aerossol 100 mcg/dose (5)", concentration_mg_ml: 5 },
      { id: generateId(), description: "Solu├º├úo gotas/nebuliza├º├úo 5 mg/mL; aerossol 100 mcg/dose (100)", concentration_mg_ml: 100 }
    ],
    doses: [
      { id: generateId(), label: "Inalat├│ria", instructions: "Inalat├│ria: 0,25 mg (1 gota)/3 kg de peso, dilu├¡dos em 3 a 5 mL de soro fisiol├│gico (m├íx. 8 a 10 gotas).", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Ferro Parenteral",
    comment: "Diluir em 25 a 100 mL de SF.",
    presentations: [
      { id: generateId(), description: "Sacarato f├®rrico 20 mg/mL; carboximaltose f├®rrica 50 mg/mL (20)", concentration_mg_ml: 20 },
      { id: generateId(), description: "Sacarato f├®rrico 20 mg/mL; carboximaltose f├®rrica 50 mg/mL (50)", concentration_mg_ml: 50 }
    ],
    doses: [
      { id: generateId(), label: "Gluconato f├®rrico (12,5 mg de Fe elementar/mL)", instructions: "Gluconato f├®rrico (12,5 mg de Fe elementar/mL).", unit: "mg" },
      { id: generateId(), label: "IV (crian├ºas > 6 anos)", instructions: "IV (crian├ºas > 6 anos): 0,75 a 1,5 mg/kg de ferro elementar (m├íx. 125 mg/dose).", mgPerKg: 0.75, maxPerKg: 1.5, maxDose: 125, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Fluconazol",
    comment: "Para administra├º├úo IV, correr em 1 a 2 horas, n├úo exceder 200 mg/hora.",
    presentations: [
      { id: generateId(), description: "2 mg/mL | 150 mg", concentration_mg_ml: 2 }
    ],
    doses: [
      { id: generateId(), label: "IV/", instructions: "IV/", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 6 a 12 mg/kg/dia, 1x/dia; n├úo exceder 600 mg/dia.", mgPerKg: 6, maxPerKg: 12, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Fludrocortisona",
    comment: "Usar com cautela para pacientes com hipertens├úo, edema ou disfun├º├úo renal.",
    presentations: [
      { id: generateId(), description: "Comprimido 0,1 mg (0.1)", concentration_mg_ml: 0.1 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 0,05 a 0,1 mg/dia.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Gamaglobulina Hiperimune contra Hepatite B",
    comment: "Pode ser administrada ao mesmo tempo que a vacina anti-hepatite B (por├®m em s├¡tios diferentes) ou com 1 m├¬s de intervalo.",
    presentations: [
      { id: generateId(), description: "Imunoglobulina anti-hepatite B: concentra├º├úo em UI/mL varia por produto (ex.: 100ÔÇô200 UI/mL) (100)", concentration_mg_ml: 100 },
      { id: generateId(), description: "Imunoglobulina anti-hepatite B: concentra├º├úo em UI/mL varia por produto (ex.: 100ÔÇô200 UI/mL) (200)", concentration_mg_ml: 200 }
    ],
    doses: [
      { id: generateId(), label: "Profilaxia p├│s-exposi├º├úo", instructions: "Profilaxia p├│s-exposi├º├úo: 0,5 mL IM, dose ├║nica para < 1 ano.", unit: "mg" },
      { id: generateId(), label: "> 1 ano", instructions: "> 1 ano: 0,06 mL/kg IM, 1 dose e repetir ap├│s 30 dias.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Ganciclovir",
    comment: "Toxicidade medular (pancitopenia).",
    presentations: [
      { id: generateId(), description: "Frasco-ampola 500 mg; ap├│s reconstitui├º├úo usual 50 mg/mL (500)", concentration_mg_ml: 500 },
      { id: generateId(), description: "Frasco-ampola 500 mg; ap├│s reconstitui├º├úo usual 50 mg/mL (50)", concentration_mg_ml: 50 }
    ],
    doses: [
      { id: generateId(), label: "IV", instructions: "IV: 10 mg/kg/dia, a cada 12 horas, por 14 a 21 dias.", mgPerKg: 10, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Gentamicina",
    comment: "Nefrotoxicidade e ototoxicidade.",
    presentations: [
      { id: generateId(), description: "40 mg/mL", concentration_mg_ml: 40 }
    ],
    doses: [
      { id: generateId(), label: "IV/", instructions: "IV/", unit: "mg" },
      { id: generateId(), label: "IM", instructions: "IM: 5 a 10 mg/kg/dia, a cada 8 horas ou 1x/dia.", mgPerKg: 5, maxPerKg: 10, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Glucagon",
    comment: "Monitorar glicemia, PA e FC.",
    presentations: [
      { id: generateId(), description: "Kit/fraco-ampola 1 mg; ap├│s reconstitui├º├úo usual 1 mg/mL (1)", concentration_mg_ml: 1 }
    ],
    doses: [
      { id: generateId(), label: "Hipoglicemia IM/", instructions: "Hipoglicemia IM/", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: < 20 kg: 0,02 a 0,03 mg/kg, dose m├íx. 0,5 mg; > 20 kg, dose m├íx. 1 mg.", mgPerKg: 0.02, maxPerKg: 0.03, maxDose: 0.5, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Hidrato de Cloral",
    comment: "N├úo ├® liberado nos EUA.\nIn├¡cio de a├º├úo em 10 a 20 minutos, meia-vida de 4 a 8 horas.\nMonitorar padr├úo respirat├│rio.",
    presentations: [
      { id: generateId(), description: "10% = 500 mg/5 mL = 100 mg/mL", concentration_mg_ml: 100 }
    ],
    doses: [
      { id: generateId(), label: "VO/VR", instructions: "VO/VR: 20 a 50 mg/kg/dose, 2 a 4x/dia, dose m├íx. 500 mg/dose.", mgPerKg: 20, maxPerKg: 50, maxDose: 500, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Hidroclorotiazida",
    comment: "Risco de hipocalemia, hiponatremia, hiperuricemia e hipomagnesemia.",
    presentations: [
      { id: generateId(), description: "Comprimidos 25 mg e 50 mg (25)", concentration_mg_ml: 25 },
      { id: generateId(), description: "Comprimidos 25 mg e 50 mg (50)", concentration_mg_ml: 50 }
    ],
    doses: [
      { id: generateId(), label: "Edema", instructions: "Edema: 2 mg/kg/dia, VO, em 2 doses (m├íx. 200 mg/dia para > 6 meses e 37,5 mg/dia para < 6 meses).", mgPerKg: 2, maxDose: 200, unit: "mg" },
      { id: generateId(), label: "Hipertens├úo", instructions: "Hipertens├úo: inicialmente 1 mg/kg/dia, at├® 3 mg/kg/dia, m├íx. 50 mg/dia.", mgPerKg: 1, maxDose: 50, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Hidr├│xido de Alum├¡nio",
    comment: "N├úo administrar se houver fun├º├úo renal alterada.\nInterfere na absor├º├úo de diversas drogas administradas por VO.\nRecomenda-se n├úo ingerir outras medica├º├Áes at├® 2 horas depois.",
    presentations: [
      { id: generateId(), description: "Suspens├úo oral 300 mg/5 mL = 60 mg/mL; comprimidos mastig├íveis conforme produto (60)", concentration_mg_ml: 60 }
    ],
    doses: [
      { id: generateId(), label: "Anti├ícido", instructions: "Anti├ícido: 300 a 900 mg, VO, entre refei├º├Áes e antes de dormir.", unit: "mg" },
      { id: generateId(), label: "Hiperfosfatemia", instructions: "Hiperfosfatemia: 30 mg/kg/dia, VO, 3 a 4x/dia (m├íx. 3 g/dia).", mgPerKg: 30, maxDose: 3, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Hidr├│xido de Magn├®sio",
    comment: "Precau├º├úo com o uso associado a depressores do sistema nervoso central.\nCausa sonol├¬ncia.",
    presentations: [
      { id: generateId(), description: "Suspens├úo oral 400 mg/5 mL = 80 mg/mL (80)", concentration_mg_ml: 80 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 2 a 5 anos: 311 a 622 mg.", unit: "mg" },
      { id: generateId(), label: "6 a 11 anos", instructions: "6 a 11 anos: 933 a 1.244 mg.", unit: "mg" },
      { id: generateId(), label: "> 12 anos", instructions: "> 12 anos: 1.866 a 2.488 mg, em uma ou mais doses di├írias.", unit: "mg" },
      { id: generateId(), label: "Na apresenta├º├úo de 400 mg/5 mL", instructions: "Na apresenta├º├úo de 400 mg/5 mL:", unit: "mg" },
      { id: generateId(), label: "< 2 anos", instructions: "< 2 anos: 0,5 mL/kg/dose.", unit: "mg" },
      { id: generateId(), label: "2 a 5 anos", instructions: "2 a 5 anos: 5 a 15 mL/dia.", unit: "mg" },
      { id: generateId(), label: "6 a 11 anos", instructions: "6 a 11 anos: 15 a 30 mL/dia.", unit: "mg" },
      { id: generateId(), label: "> 12 anos", instructions: "> 12 anos: 30 a 60 mL/dia.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Hidroxizina",
    comment: "Precau├º├úo com o uso associado a depressores do sistema nervoso central.\nCausa sonol├¬ncia.",
    presentations: [
      { id: generateId(), description: "Xarope 10 mg/5 mL = 2 mg/mL; comprimidos 25 mg (2)", concentration_mg_ml: 2 },
      { id: generateId(), description: "Xarope 10 mg/5 mL = 2 mg/mL; comprimidos 25 mg (25)", concentration_mg_ml: 25 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 2 mg/kg/dia, divididos a cada 6 ou 8 horas.", mgPerKg: 2, unit: "mg" },
      { id: generateId(), label: "Adultos", instructions: "Adultos: 25 mg/dose, em 3 a 4x/dia.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Imipenem",
    comment: "Administrar IV lentamente (30 a 60 minutos).\nUsar com cautela em pacientes com antecedente de convuls├úo.\nAlterar dosagem em pacientes com IRA.",
    doses: [
      { id: generateId(), label: "1 a 3 meses", instructions: "1 a 3 meses: 100 mg/kg/dia, IV, a cada 6 horas.", mgPerKg: 100, unit: "mg" },
      { id: generateId(), label: "> 3 meses", instructions: "> 3 meses: 60 a 100 mg/kg/dia, IV, a cada 6 horas (m├íx. 4 g/dia).", mgPerKg: 60, maxPerKg: 100, maxDose: 4, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Imunoglobulina hiperimune para varicela-z├│ster",
    comment: "N├úo aplicar IV.\nAdministrar at├® 96 horas ap├│s exposi├º├úo.",
    doses: [
      { id: generateId(), label: "IM", instructions: "IM: 125 UI para cada 10 kg; dose m├¡nima de 125 UI; dose m├íx. 625 UI; n├úo usar doses fracionadas.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Imunoglobulina humana",
    comment: "Iniciar infus├úo com velocidade de 0,01 mL/kg/minuto, dobrar a velocidade a cada 15 a 30 minutos at├® o m├íx. 0,08 mL/kg/minuto.\nMonitorar PA; se ocorrer rea├º├úo adversa, interromper a infus├úo.",
    presentations: [
      { id: generateId(), description: "Imunoglobulina humana IV 5% = 50 mg/mL; 10% = 100 mg/mL (50)", concentration_mg_ml: 50 },
      { id: generateId(), description: "Imunoglobulina humana IV 5% = 50 mg/mL; 10% = 100 mg/mL (100)", concentration_mg_ml: 100 }
    ],
    doses: [
      { id: generateId(), label: "IV", instructions: "IV:", unit: "mg" },
      { id: generateId(), label: "PTI", instructions: "PTI: 400 a 1.000 mg/kg/dia, por 2 a 5 dias; dose total 2 g/kg.", mgPerKg: 400, maxPerKg: 1, unit: "mg" },
      { id: generateId(), label: "Doen├ºa de Kawasaki", instructions: "Doen├ºa de Kawasaki: 2 g/kg, dose ├║nica (em 10 a 12 horas), iniciar at├® 10 dias do in├¡cio da febre.", mgPerKg: 2, unit: "g" },
      { id: generateId(), label: "S├¡ndrome de Guillain-Barr├®", instructions: "S├¡ndrome de Guillain-Barr├®: 400 mg/kg/dia, por 5 dias ou 1 g/kg/dia, por 2 dias.", mgPerKg: 400, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Lamivudina",
    comment: "Pode ser administrada junto com refei├º├úo e epigastralgia.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo oral 10 mg/mL; comprimidos 150 mg (10)", concentration_mg_ml: 10 },
      { id: generateId(), description: "Solu├º├úo oral 10 mg/mL; comprimidos 150 mg (150)", concentration_mg_ml: 150 }
    ],
    doses: [
      { id: generateId(), label: "Profilaxia de H", instructions: "Profilaxia de H", unit: "mg" },
      { id: generateId(), label: "IV p├│s-exposi├º├úo", instructions: "IV p├│s-exposi├º├úo.", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: ÔëÑ 16 anos: < 50 kg: 4 mg/kg 2x/dia (m├íx. 150 mg/dose).", mgPerKg: 4, maxDose: 150, unit: "mg" },
      { id: generateId(), label: "ÔëÑ 50 kg", instructions: "ÔëÑ 50 kg: 150 mg, 2x/dia ou 300 mg, 1x/dia.", unit: "mg" },
      { id: generateId(), label: "< 16 anos", instructions: "< 16 anos: 4 mg/kg, 2x/dia (m├íx. 150 mg/dose).", mgPerKg: 4, maxDose: 150, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Levofloxacina",
    comment: "Informa├º├Áes limitadas em rela├º├úo ao uso para crian├ºas.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo IV 5 mg/mL; comprimidos 500 mg e 750 mg (5)", concentration_mg_ml: 5 },
      { id: generateId(), description: "Solu├º├úo IV 5 mg/mL; comprimidos 500 mg e 750 mg (500)", concentration_mg_ml: 500 },
      { id: generateId(), description: "Solu├º├úo IV 5 mg/mL; comprimidos 500 mg e 750 mg (750)", concentration_mg_ml: 750 }
    ],
    doses: [
      { id: generateId(), label: "VO/", instructions: "VO/", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV:", unit: "mg" },
      { id: generateId(), label: "6 meses a 5 anos", instructions: "6 meses a 5 anos: 10 mg/kg/dose, a cada 12 horas.", mgPerKg: 10, unit: "mg" },
      { id: generateId(), label: "> 5 anos", instructions: "> 5 anos: 10 mg/kg/dose, a cada 24 horas (m├íx. 750 mg/dia).", mgPerKg: 10, maxDose: 750, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Linezolida",
    comment: "-",
    presentations: [
      { id: generateId(), description: "Solu├º├úo IV 2 mg/mL; suspens├úo oral 100 mg/5 mL = 20 mg/mL; comprimido 600 mg (2)", concentration_mg_ml: 2 },
      { id: generateId(), description: "Solu├º├úo IV 2 mg/mL; suspens├úo oral 100 mg/5 mL = 20 mg/mL; comprimido 600 mg (20)", concentration_mg_ml: 20 },
      { id: generateId(), description: "Solu├º├úo IV 2 mg/mL; suspens├úo oral 100 mg/5 mL = 20 mg/mL; comprimido 600 mg (600)", concentration_mg_ml: 600 }
    ],
    doses: [
      { id: generateId(), label: "VO/", instructions: "VO/", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: < 12 anos: 10 mg/kg/dose, a cada 8 horas.", mgPerKg: 10, unit: "mg" },
      { id: generateId(), label: "> 12 anos", instructions: "> 12 anos: 600 mg, a cada 12 horas.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Loratadina",
    comment: "N├úo recomendado para < 2 anos.",
    presentations: [
      { id: generateId(), description: "Xarope 1 mg/mL; comprimido 10 mg (1)", concentration_mg_ml: 1 },
      { id: generateId(), description: "Xarope 1 mg/mL; comprimido 10 mg (10)", concentration_mg_ml: 10 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO:", unit: "mg" },
      { id: generateId(), label: "2 a 6 anos", instructions: "2 a 6 anos: 5 mg, 1x/dia.", unit: "mg" },
      { id: generateId(), label: "> 6 anos e adultos", instructions: "> 6 anos e adultos: 10 mg, 1x/dia.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Lorazepam",
    comment: "Agita├º├úo paradoxal ├® relatada em 10 a 30% das crian├ºas com menos de 8 anos.\nPode causar depress├úo respirat├│ria.",
    presentations: [
      { id: generateId(), description: "Comprimidos 1 mg e 2 mg; solu├º├úo injet├ível 2 mg/mL quando dispon├¡vel (1)", concentration_mg_ml: 1 },
      { id: generateId(), description: "Comprimidos 1 mg e 2 mg; solu├º├úo injet├ível 2 mg/mL quando dispon├¡vel (2)", concentration_mg_ml: 2 }
    ],
    doses: [
      { id: generateId(), label: "Ansiedade (VO/IV)", instructions: "Ansiedade (VO/IV): 0,05 mg/kg/dose, a cada 4 a 8 horas (m├íx. 2 mg/dose).", mgPerKg: 0.05, maxDose: 2, unit: "mg" },
      { id: generateId(), label: "Seda├º├úo pr├®-procedimento (VO/IV/IM)", instructions: "Seda├º├úo pr├®-procedimento (VO/IV/IM): 0,02 a 0,09 mg/kg (m├íx. 4 mg/dose).", mgPerKg: 0.02, maxPerKg: 0.09, maxDose: 4, unit: "mg" },
      { id: generateId(), label: "EME (IV)", instructions: "EME (IV): 0,05 a 0,1 mg/kg (m├íx. 4 mg/dose); aplicar lentamente em 2 a 5 minutos; pode repetir a cada 5 a 15 minutos (m├íx. 8 mg).", mgPerKg: 0.05, maxPerKg: 0.1, maxDose: 4, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Meropenem",
    comment: "Usar com cautela em meningite e outras doen├ºas do sistema nervoso central (pode causar convuls├úo).",
    doses: [
      { id: generateId(), label: "IV", instructions: "IV:", unit: "mg" },
      { id: generateId(), label: "> 3 meses", instructions: "> 3 meses: infec├º├úo de pele: 10 mg/kg/dose, a cada 8 horas (m├íx. 500 mg/dose).", mgPerKg: 10, maxDose: 500, unit: "mg" },
      { id: generateId(), label: "Infec├º├úo intra-abdominal e neutropenia febril", instructions: "Infec├º├úo intra-abdominal e neutropenia febril: 20 mg/kg/dose, a cada 8 horas (m├íx. 1 g/dose).", mgPerKg: 20, maxDose: 1, unit: "mg" },
      { id: generateId(), label: "Meningite e fibrose c├¡stica", instructions: "Meningite e fibrose c├¡stica: 40 mg/kg/dose, a cada 8 horas (m├íx. 2 g/dia).", mgPerKg: 40, maxDose: 2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Metoclopramida",
    comment: "Pode causar sintomas extrapiramidais, especialmente em altas doses.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo injet├ível 5 mg/mL; solu├º├úo oral 1 mg/mL; gotas 4 mg/mL (5)", concentration_mg_ml: 5 },
      { id: generateId(), description: "Solu├º├úo injet├ível 5 mg/mL; solu├º├úo oral 1 mg/mL; gotas 4 mg/mL (1)", concentration_mg_ml: 1 },
      { id: generateId(), description: "Solu├º├úo injet├ível 5 mg/mL; solu├º├úo oral 1 mg/mL; gotas 4 mg/mL (4)", concentration_mg_ml: 4 }
    ],
    doses: [
      { id: generateId(), label: "VO/IM/", instructions: "VO/IM/", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV:", unit: "mg" },
      { id: generateId(), label: "N├íuseas e v├┤mitos p├│s-cirurgia", instructions: "N├íuseas e v├┤mitos p├│s-cirurgia: 0,1 a 0,5 mg/kg/dose, a cada 6 a 8 horas (m├íx. 10 mg/dose).", mgPerKg: 0.1, maxPerKg: 0.5, maxDose: 10, unit: "mg" },
      { id: generateId(), label: "V├┤mitos p├│s-quimioterapia", instructions: "V├┤mitos p├│s-quimioterapia: 1 a 2 mg/kg/dose, a cada 2 a 6 horas (m├íx. 5 doses/dia).", mgPerKg: 1, maxPerKg: 2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Metronidazol",
    comment: "Achatamento da onda T no eletrocardiograma.\nRaramente causa leucopenia.",
    presentations: [
      { id: generateId(), description: "40 mg/mL | 250 mg; 400 mg | 5 mg/mL", concentration_mg_ml: 40 },
      { id: generateId(), description: "40 mg/mL | 250 mg; 400 mg | 5 mg/mL", concentration_mg_ml: 5 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 30 a 50 mg/kg/dia, a cada 8 horas (m├íx. 2.250 mg/dia).", mgPerKg: 30, maxPerKg: 50, maxDose: 2.25, unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 22,5 a 40 mg/kg/dia, a cada 8 horas (m├íx. 1.500 mg/dia).", mgPerKg: 22.5, maxPerKg: 40, maxDose: 1.5, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Mupirocina",
    comment: "Indicada para descoloniza├º├úo para Staphylococcus aureus MRSA.",
    presentations: [
      { id: generateId(), description: "Pomada 2% = 20 mg/g (20)", concentration_mg_ml: 20 }
    ],
    doses: [
      { id: generateId(), label: "T├│pico e intranasal", instructions: "T├│pico e intranasal: pequenas quantidades 2 a 3x/dia, por 5 a 10 dias.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Naproxeno",
    comment: "-",
    presentations: [
      { id: generateId(), description: "Suspens├úo oral 125 mg/5 mL = 25 mg/mL; comprimidos 250 mg e 500 mg (25)", concentration_mg_ml: 25 },
      { id: generateId(), description: "Suspens├úo oral 125 mg/5 mL = 25 mg/mL; comprimidos 250 mg e 500 mg (250)", concentration_mg_ml: 250 },
      { id: generateId(), description: "Suspens├úo oral 125 mg/5 mL = 25 mg/mL; comprimidos 250 mg e 500 mg (500)", concentration_mg_ml: 500 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO:", unit: "mg" },
      { id: generateId(), label: "Crian├ºas > 2 anos", instructions: "Crian├ºas > 2 anos:", unit: "mg" },
      { id: generateId(), label: "- Analgesia", instructions: "- Analgesia: 5 a 6 mg/kg, a cada 12 horas (m├íx. 1 g/dia).", mgPerKg: 5, maxPerKg: 6, maxDose: 1, unit: "mg" },
      { id: generateId(), label: "- Anti-inflamat├│rio", instructions: "- Anti-inflamat├│rio: 10 a 15 mg/kg/dia divididos em 2x/dia (m├íx. 1 g/dia).", mgPerKg: 10, maxPerKg: 15, maxDose: 1, unit: "mg" },
      { id: generateId(), label: "Crian├ºas > 12 anos", instructions: "Crian├ºas > 12 anos: 200 mg, a cada 8 ou 12 horas (m├íx. 600 mg/dia).", maxDose: 600, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Nelfinavir",
    comment: "Hepatotoxicidade.",
    presentations: [
      { id: generateId(), description: "Comprimidos 250 mg; p├│ oral 50 mg/g quando dispon├¡vel (250)", concentration_mg_ml: 250 },
      { id: generateId(), description: "Comprimidos 250 mg; p├│ oral 50 mg/g quando dispon├¡vel (50)", concentration_mg_ml: 50 }
    ],
    doses: [
      { id: generateId(), label: "Infec├º├úo por H", instructions: "Infec├º├úo por H", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV:", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 2 a 13 anos: 45 a 55 mg/kg, a cada 12 horas.", mgPerKg: 45, maxPerKg: 55, unit: "mg" },
      { id: generateId(), label: "Ou 25 a 35 mg/kg, a cada 8 horas (m├íx. 2.500 mg/di...", instructions: "Ou 25 a 35 mg/kg, a cada 8 horas (m├íx. 2.500 mg/dia).", mgPerKg: 25, maxPerKg: 35, maxDose: 2.5, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Neostigmina",
    comment: "Rea├º├Áes adversas: fibrila├º├úo atrial, bloqueio atrioventricular, bradiarritmia, parada cardiorrespirat├│ria, crise convulsiva e broncoespasmo.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo injet├ível 0,5 mg/mL (0.5)", concentration_mg_ml: 0.5 }
    ],
    doses: [
      { id: generateId(), label: "Miastenia gravis", instructions: "Miastenia gravis:", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 2 mg/kg/dia, a cada 6 ou 8 horas.", mgPerKg: 2, unit: "mg" },
      { id: generateId(), label: "IM/", instructions: "IM/", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 0,01 a 0,04 mg/kg, a cada 2 a 6 horas.", mgPerKg: 0.01, maxPerKg: 0.04, unit: "mg" },
      { id: generateId(), label: "Revers├úo do bloqueio neuromuscular n├úo despolariza...", instructions: "Revers├úo do bloqueio neuromuscular n├úo despolarizante:", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV:", unit: "mg" },
      { id: generateId(), label: "- 0 a 2 anos", instructions: "- 0 a 2 anos: 0,025 a 0,1 mg/kg/dose.", mgPerKg: 0.025, maxPerKg: 0.1, unit: "mg" },
      { id: generateId(), label: "- > 2 anos", instructions: "- > 2 anos: 0,025 a 0,08 mg/kg/dose.", mgPerKg: 0.025, maxPerKg: 0.08, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Nitrofuranto├¡na",
    comment: "N├úo usar na doen├ºa renal grave, defici├¬ncia de G6PD e menores de 1 m├¬s.",
    presentations: [
      { id: generateId(), description: "Suspens├úo oral 25 mg/5 mL = 5 mg/mL; c├ípsulas 100 mg (5)", concentration_mg_ml: 5 },
      { id: generateId(), description: "Suspens├úo oral 25 mg/5 mL = 5 mg/mL; c├ípsulas 100 mg (100)", concentration_mg_ml: 100 }
    ],
    doses: [
      { id: generateId(), label: "Tratamento de ITU", instructions: "Tratamento de ITU:", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 5 a 7 mg/kg/dia, a cada 6 horas (m├íx. 400 mg/dia).", mgPerKg: 5, maxPerKg: 7, maxDose: 400, unit: "mg" },
      { id: generateId(), label: "Profilaxia de ITU", instructions: "Profilaxia de ITU:", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 1 a 2 mg/kg/dia, 1x/dia (m├íx. 100 mg/dia).", mgPerKg: 1, maxPerKg: 2, maxDose: 100, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Oseltamivir",
    comment: "Introduzir preferencialmente nas primeiras 48 horas do in├¡cio dos sintomas.\nSeguran├ºa e efic├ícia n├úo estabelecidas para menores de 1 ano.",
    presentations: [
      { id: generateId(), description: "Suspens├úo oral 6 mg/mL; c├ípsulas 30 mg, 45 mg e 75 mg (6)", concentration_mg_ml: 6 },
      { id: generateId(), description: "Suspens├úo oral 6 mg/mL; c├ípsulas 30 mg, 45 mg e 75 mg (30)", concentration_mg_ml: 30 },
      { id: generateId(), description: "Suspens├úo oral 6 mg/mL; c├ípsulas 30 mg, 45 mg e 75 mg (45)", concentration_mg_ml: 45 },
      { id: generateId(), description: "Suspens├úo oral 6 mg/mL; c├ípsulas 30 mg, 45 mg e 75 mg (75)", concentration_mg_ml: 75 }
    ],
    doses: [
      { id: generateId(), label: "< 1 ano e", instructions: "< 1 ano e", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO:", unit: "mg" },
      { id: generateId(), label: "- 3 mg/kg, a cada 12 horas, por 5 dias", instructions: "- 3 mg/kg, a cada 12 horas, por 5 dias.", mgPerKg: 3, unit: "mg" },
      { id: generateId(), label: "> 1 ano e", instructions: "> 1 ano e", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO:", unit: "mg" },
      { id: generateId(), label: "- 10 a 14 kg", instructions: "- 10 a 14 kg: 30 mg/dose, a cada 12 horas.", unit: "mg" },
      { id: generateId(), label: "- 15 a 23 kg", instructions: "- 15 a 23 kg: 45 mg/dose, a cada 12 horas.", unit: "mg" },
      { id: generateId(), label: "- 23 a 40 kg", instructions: "- 23 a 40 kg: 60 mg/dose, a cada 12 horas.", unit: "mg" },
      { id: generateId(), label: "- > 40 kg", instructions: "- > 40 kg: 75 mg/dose, a cada 12 horas.", unit: "mg" },
      { id: generateId(), label: "Todos por 5 dias", instructions: "Todos por 5 dias.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Oxacilina",
    comment: "Alterar dosagem para pacientes com insufici├¬ncia renal.",
    doses: [
      { id: generateId(), label: "IV ou", instructions: "IV ou", unit: "mg" },
      { id: generateId(), label: "IM", instructions: "IM: 100 a 200 mg/kg/dia, a cada 6 horas (dose m├íx. 12 g/24 horas).", mgPerKg: 100, maxPerKg: 200, maxDose: 12, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Penicilina Cristalina",
    comment: "Uso prolongado pode estar associado ├á colite pseudomembranosa, neutropenia, anemia hemol├¡tica.",
    presentations: [
      { id: generateId(), description: "Frasco-ampola 1.000.000 UI e 5.000.000 UI; concentra├º├úo final depende do volume de reconstitui├º├úo (1000000)", concentration_mg_ml: 1000000 },
      { id: generateId(), description: "Frasco-ampola 1.000.000 UI e 5.000.000 UI; concentra├º├úo final depende do volume de reconstitui├º├úo (5000000)", concentration_mg_ml: 5000000 }
    ],
    doses: [
      { id: generateId(), label: "IV", instructions: "IV: 100 a 300 mil U/kg/dia, a cada 4 ou 6 horas (dose m├íx. 400 mil U/kg/dia ou 24 milh├Áes de unidades/dia).", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Penicilina Proca├¡na",
    comment: "Deve ser realizada apenas por via IM.\nCuidado ao injetar pr├│ximo a nervo ou vaso.",
    presentations: [
      { id: generateId(), description: "Penicilina G proca├¡na 300.000ÔÇô400.000 UI/mL conforme produto; concentra├º├úo deve seguir bula do fabricante (300000)", concentration_mg_ml: 300000 },
      { id: generateId(), description: "Penicilina G proca├¡na 300.000ÔÇô400.000 UI/mL conforme produto; concentra├º├úo deve seguir bula do fabricante (400000)", concentration_mg_ml: 400000 }
    ],
    doses: [
      { id: generateId(), label: "IM", instructions: "IM: 25 a 50 mil U/kg/dia, a cada 12 ou 24 horas (m├íx. 4.800.000 UI/dia).", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Piperacilina + Tazobactam",
    comment: "Administra├º├úo de 4 horas pode aumentar a efic├ícia.",
    doses: [
      { id: generateId(), label: "IV", instructions: "IV:", unit: "mg" },
      { id: generateId(), label: "< 2 meses", instructions: "< 2 meses: 80 mg/kg/dose, a cada 6 horas.", mgPerKg: 80, unit: "mg" },
      { id: generateId(), label: "2 a 9 meses", instructions: "2 a 9 meses: 80 mg/kg/dose, a cada 6 ou 8 horas.", mgPerKg: 80, unit: "mg" },
      { id: generateId(), label: "> 9 meses", instructions: "> 9 meses: 100 mg/kg/dose, a cada 6 ou 8 horas (dose m├íx. 16 g/dia).", mgPerKg: 100, maxDose: 16, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Pralidoxima",
    comment: "Evitar uso na intoxica├º├úo por carbamatos.\nConcentra├º├úo de 20 a 50 mg/mL infundida de 15 a 30 minutos.\nSe necess├írio, infundir no m├íximo em 5 minutos (n├úo exceder 200 mg/min).",
    presentations: [
      { id: generateId(), description: "Cloreto de pralidoxima: frasco/ampola 1 g ou solu├º├úo 200 mg/mL conforme produto (1000)", concentration_mg_ml: 1000 },
      { id: generateId(), description: "Cloreto de pralidoxima: frasco/ampola 1 g ou solu├º├úo 200 mg/mL conforme produto (200)", concentration_mg_ml: 200 }
    ],
    doses: [
      { id: generateId(), label: "Intoxica├º├úo por organofosforados (usar em conjunto...", instructions: "Intoxica├º├úo por organofosforados (usar em conjunto com atropina).", unit: "mg" },
      { id: generateId(), label: "IM", instructions: "IM,", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 20 a 50 mg/kg/dose; repetir em 1 a 2 horas se n├úo houver melhora da fraqueza muscular, e depois em 10 a 12 horas, se sintomas colin├®rgicos voltarem a ocorrer.", mgPerKg: 20, maxPerKg: 50, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Prednisona",
    comment: "Pode causar hiperglicemia em pacientes diab├®ticos.\nPode causar sangramento de TGI.",
    presentations: [
      { id: generateId(), description: "Comprimidos 5 mg e 20 mg; para solu├º├úo oral geralmente usar prednisolona, n├úo prednisona (5)", concentration_mg_ml: 5 },
      { id: generateId(), description: "Comprimidos 5 mg e 20 mg; para solu├º├úo oral geralmente usar prednisolona, n├úo prednisona (20)", concentration_mg_ml: 20 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 1 a 2 mg/kg/dia (m├íx. 60 mg/dia).", mgPerKg: 1, maxPerKg: 2, maxDose: 60, unit: "mg" },
      { id: generateId(), label: "S├¡ndrome nefr├│tica", instructions: "S├¡ndrome nefr├│tica: 2 mg/kg/dia, divididos em 1 a 3 doses (m├íx. 80 mg/dia).", mgPerKg: 2, maxDose: 80, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Ranitidina",
    comment: "Ajuste de dose de acordo com clearance de creatinina.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo oral 15 mg/mL; ampola 25 mg/mL; verificar disponibilidade/registro atual do produto (15)", concentration_mg_ml: 15 },
      { id: generateId(), description: "Solu├º├úo oral 15 mg/mL; ampola 25 mg/mL; verificar disponibilidade/registro atual do produto (25)", concentration_mg_ml: 25 }
    ],
    doses: [
      { id: generateId(), label: "├Ülcera g├ístrica ou duodenal", instructions: "├Ülcera g├ístrica ou duodenal:", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 4 a 8 mg/kg/dia, a cada 12 horas (m├íx. 300 mg/dia).", mgPerKg: 4, maxPerKg: 8, maxDose: 300, unit: "mg" },
      { id: generateId(), label: "Manuten├º├úo", instructions: "Manuten├º├úo: 2 a 4 mg/kg/dia, 1x (m├íx. 150 mg/dia).", mgPerKg: 2, maxPerKg: 4, maxDose: 150, unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV: 2 a 4 mg/kg/dia, a cada 6 ou 8 horas (m├íx. 200 mg/dia).", mgPerKg: 2, maxPerKg: 4, maxDose: 200, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Resina de troca (poliestirenossulfonato de c├ílcio - Sorcal┬«)",
    comment: "Tratamento de hipercalemia com in├¡cio de a├º├úo em 2h. N├úo usar caso tenha obstru├º├úo de TGI.",
    doses: [
      { id: generateId(), label: "VO ou VR", instructions: "VO ou VR: 0,5 a 1 g/kg/dia, divididas em 2 a 4x/dia.", mgPerKg: 0.5, maxPerKg: 1, unit: "g" }
    ]
  },
  {
    id: generateId(),
    name: "Rifampicina",
    comment: "Raramente utilizada como monoterapia.",
    presentations: [
      { id: generateId(), description: "Suspens├úo oral 100 mg/5 mL = 20 mg/mL; c├ípsulas 300 mg (20)", concentration_mg_ml: 20 },
      { id: generateId(), description: "Suspens├úo oral 100 mg/5 mL = 20 mg/mL; c├ípsulas 300 mg (300)", concentration_mg_ml: 300 }
    ],
    doses: [
      { id: generateId(), label: "Tuberculose", instructions: "Tuberculose:", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 10 a 20 mg/kg/dia, 1x/dia (m├íx. 600 mg/dose).", mgPerKg: 10, maxPerKg: 20, maxDose: 600, unit: "mg" },
      { id: generateId(), label: "Profilaxia meningoc├│cica", instructions: "Profilaxia meningoc├│cica:", unit: "mg" },
      { id: generateId(), label: "VO", instructions: "VO: 20 mg/kg/dia, a cada 12 horas, por 2 dias (m├íx. 600 mg/dose).", mgPerKg: 20, maxDose: 600, unit: "mg" },
      { id: generateId(), label: "Profilaxia H. influenzae", instructions: "Profilaxia H. influenzae: 20 mg/kg/dia, 1x/dia, por 4 dias.", mgPerKg: 20, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Simeticona",
    comment: "Simeticona ├® a forma ativada da dimeticona.",
    presentations: [
      { id: generateId(), description: "Gotas 75 mg/mL; comprimidos 40 mg e 125 mg (75)", concentration_mg_ml: 75 },
      { id: generateId(), description: "Gotas 75 mg/mL; comprimidos 40 mg e 125 mg (40)", concentration_mg_ml: 40 },
      { id: generateId(), description: "Gotas 75 mg/mL; comprimidos 40 mg e 125 mg (125)", concentration_mg_ml: 125 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 5 a 20 mg/dose a cada 4 ou 6 horas; 2 a 12 anos: 40 a 125 mg/dose; > 12 anos: 40 a 250 mg/dose.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Sucralfato",
    comment: "Deve ser administrado 1 hora antes das refei├º├Áes.",
    presentations: [
      { id: generateId(), description: "Suspens├úo oral 1 g/5 mL = 200 mg/mL; comprimido 1 g (200)", concentration_mg_ml: 200 },
      { id: generateId(), description: "Suspens├úo oral 1 g/5 mL = 200 mg/mL; comprimido 1 g (1000)", concentration_mg_ml: 1000 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO: 40 a 80 mg/kg/dia, a cada 6 horas (dose m├íx. 1 g).", mgPerKg: 40, maxPerKg: 80, maxDose: 1, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Sulfametoxazol + Trimetoprima (dose referente ├á trimetoprima)",
    comment: "Pode ser administrada junto com refei├º├úo se epigastralgia.\nN├úo administrar IM.",
    presentations: [
      { id: generateId(), description: "200 mg SMX + 40 mg TMP/5 mL = 8 mg/mL TMP | 400/80 mg; 800/160 mg", concentration_mg_ml: 8 }
    ],
    doses: [
      { id: generateId(), label: "VO/", instructions: "VO/", unit: "mg" },
      { id: generateId(), label: "IV", instructions: "IV:", unit: "mg" },
      { id: generateId(), label: "Infec├º├úo moderada", instructions: "Infec├º├úo moderada: 8 a 12 mg/kg/dia, a cada 12 horas (m├íx. 160 mg/dose).", mgPerKg: 8, maxPerKg: 12, maxDose: 160, unit: "mg" },
      { id: generateId(), label: "Infec├º├úo grave", instructions: "Infec├º├úo grave: 20 mg/kg/dia, a cada 6 horas ou 8 horas (m├íx. 160 mg/dose).", mgPerKg: 20, maxDose: 160, unit: "mg" },
      { id: generateId(), label: "Pneumocystis carinii", instructions: "Pneumocystis carinii: Tratamento: 15 a 20 mg/kg/dia, a cada 6 ou 8 horas, por 21 dias.", mgPerKg: 15, maxPerKg: 20, unit: "mg" },
      { id: generateId(), label: "Profilaxia", instructions: "Profilaxia: 150 mg/m┬▓/dia de 12/12 horas, por 3 dias consecutivos/semana.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Teicoplanina",
    comment: "-",
    presentations: [
      { id: generateId(), description: "Frasco-ampola 200 mg e 400 mg; concentra├º├úo p├│s-reconstitui├º├úo depende volume da bula (200)", concentration_mg_ml: 200 },
      { id: generateId(), description: "Frasco-ampola 200 mg e 400 mg; concentra├º├úo p├│s-reconstitui├º├úo depende volume da bula (400)", concentration_mg_ml: 400 }
    ],
    doses: [
      { id: generateId(), label: "IV/", instructions: "IV/", unit: "mg" },
      { id: generateId(), label: "IM", instructions: "IM: 10 mg/kg/dia, a cada 12 horas nas primeiras 3 doses e ap├│s 6 a 10 mg/kg, 1x/dia.", mgPerKg: 10, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Vancomicina",
    comment: "Infundir lentamente pelo risco de rash (de 60 a 120 minutos).\nA dose deve ser reajustada na insufici├¬ncia renal.\nDeve-se ter controle com vancomicinemia.",
    doses: [
      { id: generateId(), label: "10 a 15 mg/kg/dose, a cada 6 horas (dose m├íx. 2 g/...", instructions: "10 a 15 mg/kg/dose, a cada 6 horas (dose m├íx. 2 g/dia).", mgPerKg: 10, maxPerKg: 15, maxDose: 2, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Vitamina D",
    comment: "Sintomas de intoxica├º├úo: sede excessiva, desidrata├º├úo, anorexia, n├íusea, v├┤mito, cefaleia, lit├¡ase e hipercalcemia.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo/gotas com concentra├º├úo vari├ível por produto; exemplos: 200 UI/gota ou 10.000 UI/mL; usar apresenta├º├úo do produto dispon├¡vel (200)", concentration_mg_ml: 200 },
      { id: generateId(), description: "Solu├º├úo/gotas com concentra├º├úo vari├ível por produto; exemplos: 200 UI/gota ou 10.000 UI/mL; usar apresenta├º├úo do produto dispon├¡vel (10000)", concentration_mg_ml: 10000 }
    ],
    doses: [
      { id: generateId(), label: "VO", instructions: "VO:", unit: "mg" },
      { id: generateId(), label: "< 12 anos", instructions: "< 12 anos: 2.000 UI/dia, por 6 a 12 semanas, seguidas com manuten├º├úo de 400 UI/dia.", unit: "mg" },
      { id: generateId(), label: "> 12 anos", instructions: "> 12 anos: 2.000 UI/dia, por 6 a 12 semanas ou 50.000 UI/semana, por 6 semanas, seguido com manuten├º├úo de 600 a 1.000 UI/dia.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Vitamina K1",
    comment: "Preferir via subcut├ónea.",
    presentations: [
      { id: generateId(), description: "Fitomenadiona solu├º├úo injet├ível 10 mg/mL; apresenta├º├úo pedi├ítrica 2 mg/0,2 mL conforme produto (10)", concentration_mg_ml: 10 },
      { id: generateId(), description: "Fitomenadiona solu├º├úo injet├ível 10 mg/mL; apresenta├º├úo pedi├ítrica 2 mg/0,2 mL conforme produto (2)", concentration_mg_ml: 2 }
    ],
    doses: [
      { id: generateId(), label: "Intoxica├º├úo por anticoagulantes (SC/IV)", instructions: "Intoxica├º├úo por anticoagulantes (SC/IV): 0,03 mg/kg/dose ou 2 a 5 mg/dose.", mgPerKg: 0.03, unit: "mg" },
      { id: generateId(), label: "Atresia de vias biliares", instructions: "Atresia de vias biliares:", unit: "mg" },
      { id: generateId(), label: "RN", instructions: "RN: 1,25 a 2,5 mg, VO, 1x/dia.", unit: "mg" },
      { id: generateId(), label: "INR", instructions: "INR: 1,5 a 1,8: 2,5 mg, IM, seguidas de 2,5 mg, VO, 1x/dia.", unit: "mg" },
      { id: generateId(), label: "INR", instructions: "INR: 1,9 a 2,5: 3 mg, IM, seguidas de 5 mg, VO, 1x/dia.", unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Voriconazol",
    comment: "-",
    doses: [
      { id: generateId(), label: "Aspergilose e candid├¡ase invasiva", instructions: "Aspergilose e candid├¡ase invasiva:", unit: "mg" },
      { id: generateId(), label: "Ataque", instructions: "Ataque: 6 mg/kg/dose, a cada 12 horas (dose m├íx. ataque: 400 mg, dose m├íx. manuten├º├úo: 200 mg).", mgPerKg: 6, unit: "mg" },
      { id: generateId(), label: "Candid├¡ase esof├ígica", instructions: "Candid├¡ase esof├ígica:", unit: "mg" },
      { id: generateId(), label: "> 12 anos", instructions: "> 12 anos: < 40 kg: 100 mg, a cada 12 horas (m├íx. 300 mg/dia).", maxDose: 300, unit: "mg" },
      { id: generateId(), label: "> 12 anos", instructions: "> 12 anos: > 40 kg: 200 mg, a cada 12 horas (m├íx. 600 mg/dia).", maxDose: 600, unit: "mg" },
      { id: generateId(), label: "< 12 anos", instructions: "< 12 anos: 7 a 8 mg/kg/dose, a cada 12 horas.", mgPerKg: 7, maxPerKg: 8, unit: "mg" }
    ]
  },
  {
    id: generateId(),
    name: "Zidovudina",
    comment: "Mielot├│xico, pode cursar com anemia e leucopenia.",
    presentations: [
      { id: generateId(), description: "Solu├º├úo oral 10 mg/mL; c├ípsulas 100 mg; solu├º├úo IV 10 mg/mL (10)", concentration_mg_ml: 10 },
      { id: generateId(), description: "Solu├º├úo oral 10 mg/mL; c├ípsulas 100 mg; solu├º├úo IV 10 mg/mL (100)", concentration_mg_ml: 100 }
    ],
    doses: [
      { id: generateId(), label: "Profilaxia p├│s-abuso sexual", instructions: "Profilaxia p├│s-abuso sexual.", unit: "mg" },
      { id: generateId(), label: "Adolescentes", instructions: "Adolescentes: 300 mg, VO, a cada 12 horas.", unit: "mg" }
    ]
  }
];


export const VITAL_SIGNS_PEDIATRIC: VitalSignRange[] = [
  { ageGroup: 'Nascimento 12h, < 1000g', systolicBP: '39-59', diastolicBP: '16-36', meanBP: '28-42' },
  { ageGroup: 'Nascimento 12h, 3kg', systolicBP: '60-67', diastolicBP: '31-45', meanBP: '48-57' },
  { ageGroup: 'Neonato (atÃ© 96h)', heartRate: '100-205', respiratoryRate: '30-53', systolicBP: '67-84', diastolicBP: '35-53', meanBP: '45-60' },
  { ageGroup: 'Lactente (1 a 12 meses)', heartRate: '100-180', respiratoryRate: '22-37', systolicBP: '72-104', diastolicBP: '37-56', meanBP: '50-62' },
  { ageGroup: 'CrianÃ§a Pequena (1 a 2 anos)', heartRate: '98-140', respiratoryRate: '20-28', systolicBP: '86-106', diastolicBP: '42-63', meanBP: '49-62' },
  { ageGroup: 'PrÃ©-Escolar (3 a 5 anos)', heartRate: '80-120', respiratoryRate: '20-28', systolicBP: '89-112', diastolicBP: '46-72', meanBP: '58-69' },
  { ageGroup: 'Escolar (6 a 9 anos)', heartRate: '75-118', respiratoryRate: '18-25', systolicBP: '97-115', diastolicBP: '57-76', meanBP: '66-72' },
  { ageGroup: 'PrÃ©-Adolescente (10 a 12 anos)', systolicBP: '102-120', diastolicBP: '61-80', meanBP: '71-79' },
  { ageGroup: 'Adolescente (12 a 15 anos)', heartRate: '60-100', respiratoryRate: '12-20', systolicBP: '110-131', diastolicBP: '64-83', meanBP: '73-84' }
];

export const GLASGOW_PEDIATRIC: GlasgowPediatricItem[] = [
  { domain: 'abertura_ocular', score: 4, child: 'EspontÃ¢nea', infant: 'EspontÃ¢nea' },
  { domain: 'abertura_ocular', score: 3, child: 'A estÃ­mulo verbal', infant: 'A estÃ­mulo verbal' },
  { domain: 'abertura_ocular', score: 2, child: 'A estÃ­mulo doloroso', infant: 'A estÃ­mulo doloroso' },
  { domain: 'abertura_ocular', score: 1, child: 'Sem resposta', infant: 'Sem resposta' },
  { domain: 'resposta_verbal', score: 5, child: 'Orientado, apropriado', infant: 'Balbucia e lalaÃ§Ã£o' },
  { domain: 'resposta_verbal', score: 4, child: 'Confuso', infant: 'Choro irritado' },
  { domain: 'resposta_verbal', score: 3, child: 'Palavras inapropriadas', infant: 'Choro apÃ³s estÃ­mulo doloroso' },
  { domain: 'resposta_verbal', score: 2, child: 'Sons incompreensÃ­veis', infant: 'Geme apÃ³s estÃ­mulo doloroso' },
  { domain: 'resposta_verbal', score: 1, child: 'Sem resposta', infant: 'Sem resposta' },
  { domain: 'resposta_motora', score: 6, child: 'Obedece a comandos', infant: 'Movimentos espontÃ¢neos e intencionais' },
  { domain: 'resposta_motora', score: 5, child: 'Localiza estÃ­mulo doloroso', infant: 'Retirada ao toque' },
  { domain: 'resposta_motora', score: 4, child: 'Retirada em resposta a dor', infant: 'Retirada em resposta a dor' },
  { domain: 'resposta_motora', score: 3, child: 'FlexÃ£o em resposta a dor', infant: 'Postura de flexÃ£o anormal a dor' },
  { domain: 'resposta_motora', score: 2, child: 'ExtensÃ£o em resposta a dor', infant: 'Postura de extensÃ£o anormal a dor' },
  { domain: 'resposta_motora', score: 1, child: 'Sem resposta', infant: 'Sem resposta' }
];

export const EMERGENCY_EQUIPMENT_BY_WEIGHT: EmergencyEquipmentByWeight[] = [
  { equipment: 'Bolsa-valva de ressuscitaÃ§Ã£o', kg3_5: 'Lactente', kg6_7: 'Lactente/crianÃ§a', kg8_9: 'Lactente/crianÃ§a', kg10_11: 'CrianÃ§a', kg12_14: 'CrianÃ§a', kg15_18: 'CrianÃ§a', kg19_23: 'CrianÃ§a', kg24_29: 'CrianÃ§a/adulto', kg30_36: 'Adulto' },
  { equipment: 'MÃ¡scara de O2', kg3_5: 'Neonatal', kg6_7: 'Neonatal', kg8_9: 'Neonatal', kg10_11: 'PediÃ¡trica', kg12_14: 'PediÃ¡trica', kg15_18: 'PediÃ¡trica', kg19_23: 'PediÃ¡trica', kg24_29: 'Adulto', kg30_36: 'Adulto' },
  { equipment: 'CÃ¢nula Oro-farÃ­ngea', kg3_5: '0', kg6_7: '0-1', kg8_9: '1', kg10_11: '1', kg12_14: '1-2', kg15_18: '2', kg19_23: '2', kg24_29: '2-3', kg30_36: '3 ou +' },
  { equipment: 'LÃ¢mina de laringoscÃ³pio', kg3_5: 'Reta 0-1', kg6_7: 'Reta 1', kg8_9: 'Reta 1', kg10_11: 'Reta 1', kg12_14: 'Reta 2', kg15_18: 'Reta 2', kg19_23: 'Reta 2 ou curva', kg24_29: 'Reta 2-3 ou curva', kg30_36: 'Reta 3 ou curva' },
  { equipment: 'CÃ¢nula traqueal (mm)', kg3_5: '3,0-3,5 sem cuff', kg6_7: '3,5 sem cuff / 3,0 com cuff', kg8_9: '3,5 sem cuff / 3,0 com cuff', kg10_11: '4,0 sem cuff / 3,5 com cuff', kg12_14: '4,5 sem cuff / 4,0 com cuff', kg15_18: '5,0 sem cuff / 4,5 com cuff', kg19_23: '5,5 sem cuff / 5,0 com cuff', kg24_29: '6,0 com cuff', kg30_36: '6,5 com cuff' },
  { equipment: 'Comprimento da cÃ¢nula (cm)', kg3_5: '9-10,5', kg6_7: '10,5-11', kg8_9: '10,5-11', kg10_11: '11-12', kg12_14: '12,5-13,5', kg15_18: '14-15', kg19_23: '15,5-16,5', kg24_29: '17-18', kg30_36: '18,5-19,5' },
  { equipment: 'Fio Guia (F)', kg3_5: '6', kg6_7: '6', kg8_9: '6', kg10_11: '6', kg12_14: '6', kg15_18: '6', kg19_23: '14', kg24_29: '14', kg30_36: '14' },
  { equipment: 'Sonda de aspiraÃ§Ã£o (F)', kg3_5: '6-8', kg6_7: '6-8', kg8_9: '8', kg10_11: '8-10', kg12_14: '10', kg15_18: '10', kg19_23: '10', kg24_29: '10', kg30_36: '12' },
  { equipment: 'Manguito de PA', kg3_5: 'Neonato/lactente', kg6_7: 'Neonato/lactente', kg8_9: 'Neonato/lactente', kg10_11: 'Lactente/crianÃ§a', kg12_14: 'CrianÃ§a', kg15_18: 'CrianÃ§a', kg19_23: 'CrianÃ§a', kg24_29: 'CrianÃ§a', kg30_36: 'Pequeno adulto' },
  { equipment: 'CatÃ©ter EV (ga)', kg3_5: '22-24', kg6_7: '22-24', kg8_9: '22-24', kg10_11: '20-24', kg12_14: '18-22', kg15_18: '18-22', kg19_23: '18-20', kg24_29: '18-20', kg30_36: '16-20' },
  { equipment: 'Intra-Ã³ssea (ga)', kg3_5: '18/15', kg6_7: '18/15', kg8_9: '18/15', kg10_11: '15', kg12_14: '15', kg15_18: '15', kg19_23: '15', kg24_29: '15', kg30_36: '15' },
  { equipment: 'Sonda nasogÃ¡strica (F)', kg3_5: '5-8', kg6_7: '5-8', kg8_9: '5-8', kg10_11: '8-10', kg12_14: '10', kg15_18: '10', kg19_23: '12-14', kg24_29: '14-18', kg30_36: '16-18' },
  { equipment: 'Sonda urinÃ¡ria (F)', kg3_5: '5', kg6_7: '5-8', kg8_9: '5-8', kg10_11: '8-10', kg12_14: '10', kg15_18: '10', kg19_23: '12-14', kg24_29: '14-18', kg30_36: '16-18' },
  { equipment: 'PÃ¡s de desfibrilaÃ§Ã£o', kg3_5: 'PÃ¡s lactente <1 ano', kg6_7: 'PÃ¡s lactente <1 ano', kg8_9: 'PÃ¡s lactente <1ano/10kg', kg10_11: 'PÃ¡s adulto', kg12_14: 'PÃ¡s adulto', kg15_18: 'PÃ¡s adulto', kg19_23: 'PÃ¡s adulto', kg24_29: 'PÃ¡s adulto', kg30_36: 'PÃ¡s adulto' },
  { equipment: 'Dreno torÃ¡cico (F)', kg3_5: '10', kg6_7: '10-12', kg8_9: '10-12', kg10_11: '16-20', kg12_14: '20-24', kg15_18: '20-24', kg19_23: '24-32', kg24_29: '28-32', kg30_36: '32-38' },
  { equipment: 'MÃ¡scara larÃ­ngea', kg3_5: '1', kg6_7: '1-1,5', kg8_9: '1,5', kg10_11: '1,5', kg12_14: '2', kg15_18: '2', kg19_23: '2-2,5', kg24_29: '2,5', kg30_36: '3' }
];

export const TOXIDROMES: Toxidrome[] = [
  { syndrome: 'SimpatomimÃ©tica', mentalStatus: 'AgitaÃ§Ã£o, estado hiperalerta, alucinaÃ§Ã£o, paranoia', pupils: 'MidrÃ­ase', vitalSigns: 'Hipertermia, taquicardia, hipertensÃ£o, taquipneia', otherManifestations: 'Sudorese, tremor, hiperreflexia, convulsÃµes', commonAgents: 'CocaÃ­na, Anfetamina, Catinona, Efedrina, Pseudoefedrina, Teofilina, Salbutamol, CafeÃ­na' },
  { syndrome: 'AnticolinÃ©rgica', mentalStatus: 'HipervigilÃ¢ncia, agitaÃ§Ã£o, alucinaÃ§Ã£o, delÃ­rio, coma', pupils: 'MidrÃ­ase', vitalSigns: 'Hipertermia, taquicardia, hipertensÃ£o, taquipneia', otherManifestations: 'Pele e mucosas secas, ruÃ­dos abds diminuÃ­dos, retenÃ§Ã£o urinÃ¡ria', commonAgents: 'Anti-histamÃ­nicos, Antidepressivos tricÃ­clicos, Ciclobenzaprina, Escopolamina, Atropina' },
  { syndrome: 'AlucinogÃªnica', mentalStatus: 'AlucinaÃ§Ã£o, percepÃ§Ã£o distorcida, agitaÃ§Ã£o', pupils: 'MidrÃ­ase (usualmente)', vitalSigns: 'Hipertermia, taquicardia, hipertensÃ£o, taquipneia', otherManifestations: 'Nistagmo', commonAgents: 'Fenciclidina, LSD, Mescalina, Canabinoide, Psilocibina, Ecstasy' },
  { syndrome: 'Opioide-narcÃ³tica', mentalStatus: 'DepressÃ£o SNC, coma', pupils: 'Miose', vitalSigns: 'Bradipneia, apneia (caracterÃ­stica), hipotermia, bradicardia, hipotensÃ£o', otherManifestations: 'Hiporreflexia, edema pulmonar, marcas de agulha', commonAgents: 'Opioides (heroÃ­na, morfina, metadona), Difenoxilato, Propoxifeno' },
  { syndrome: 'Sedativo-hipnÃ³tica', mentalStatus: 'DepressÃ£o SNC, confusÃ£o, estupor, coma', pupils: 'VariÃ¡vel (freq. normais)', vitalSigns: 'Pode apresentar: hipotermia, bradicardia, hipotensÃ£o, apneia', otherManifestations: 'Hiporreflexia', commonAgents: 'BenzodiazepÃ­nicos, BarbitÃºricos, Anticonvulsivantes, Ãlcool, Zolpidem' },
  { syndrome: 'ColinÃ©rgica', mentalStatus: 'ConfusÃ£o, coma', pupils: 'Miose', vitalSigns: 'Bradicardia, hipo/hipertensÃ£o, bradi/taquipneia', otherManifestations: 'SalivaÃ§Ã£o, incontinÃªncia, diarreia, lacrimejamento, broncoconstriÃ§Ã£o, fasciculaÃ§Ã£o', commonAgents: 'Organofosforados, Carbamatos, Nicotina, Pilocarpina, Fisostigmina' },
  { syndrome: 'SerotoninÃ©rgica', mentalStatus: 'ConfusÃ£o, agitaÃ§Ã£o, coma', pupils: 'MidrÃ­ase', vitalSigns: 'Hipertermia, taquicardia, hipertensÃ£o, taquipneia', otherManifestations: 'Tremor, mioclonia, hiperreflexia, clÃ´nus, sudorese, rubor, trismo', commonAgents: 'IMAO, Meperidina, TricÃ­clicos, Dextrometorfano, Triptofano' }
];

export const COMMON_TOXICS_ANTIDOTES: AntidoteMapping[] = [
  { intoxicationType: 'AnestÃ©sico local', antidote: 'EmulsÃ£o lipÃ­dica endovenosa' },
  { intoxicationType: 'Anfetamina', antidote: 'BenzodiazepÃ­nicos: convulsÃ£o; Ciproeptadina: sÃ­ndrome colinÃ©rgica' },
  { intoxicationType: 'AnticolinesterÃ¡sicos', antidote: 'Cloreto de pralidoxima + atropina' },
  { intoxicationType: 'Anticonvulsivantes', antidote: 'Bicarbonato de sÃ³dio se arritmia ventricular; Ãcido valproico: Carnitina, naloxone' },
  { intoxicationType: 'Antidepressivos tricÃ­clicos', antidote: 'Bicarbonato de sÃ³dio; EmulsÃ£o lipÃ­dica endovenosa' },
  { intoxicationType: 'Aspirina com QRS largo', antidote: 'Bicarbonato de sÃ³dio' },
  { intoxicationType: 'Betabloqueador', antidote: 'Insulina + glucagon; Catecolaminas; EmulsÃ£o lipÃ­dica endovenosa; Inibidores da fosfodiesterase' },
  { intoxicationType: 'BenzodiazepÃ­nicos', antidote: 'Flumazenil (*cuidado com precipitaÃ§Ã£o de convulsÃ£o)' },
  { intoxicationType: 'Bloqueador de canal de cÃ¡lcio', antidote: 'CÃ¡lcio endovenoso; Insulina + glucagon; Catecolaminas; Atropina; EmulsÃ£o lipÃ­dica' },
  { intoxicationType: 'Chumbo / MercÃºrio', antidote: 'Ãcido dimercaptosuccÃ­nico' },
  { intoxicationType: 'Cianeto', antidote: 'OxigÃªnio a 100% e hidroxicobalamina' },
  { intoxicationType: 'CocaÃ­na', antidote: 'BenzodiazepÃ­nicos (convulsÃ£o); Alfa bloqueador, BCC, nitroglicerina (hipertensÃ£o)' },
  { intoxicationType: 'Digoxina', antidote: 'LidocaÃ­na se arritmia ventricular; Digoxina anticorpo Fab imune' },
  { intoxicationType: 'Etilenoglicol / Metanol', antidote: 'Etanol a 100% ou Fomepizole' },
  { intoxicationType: 'Ferro', antidote: 'Deferoxamina' },
  { intoxicationType: 'Heparina', antidote: 'Sulfato de protamina' },
  { intoxicationType: 'Hidralazina / Isoniazida', antidote: 'Piridoxina' },
  { intoxicationType: 'Hipoglicemiantes orais', antidote: 'Octreotide' },
  { intoxicationType: 'Inseticidas organofosforados', antidote: 'Cloreto de pralidoxima + atropina' },
  { intoxicationType: 'Metemoglobinemia adquirida', antidote: 'Azul de metileno +/- Ã¡cido ascÃ³rbico' },
  { intoxicationType: 'MonÃ³xido de carbono', antidote: 'OxigÃªnio a 100% ou terapia hiperbÃ¡rica de oxigÃªnio' },
  { intoxicationType: 'NeurolÃ©pticos', antidote: 'Bicarbonato de sÃ³dio (arritmia); Dantrolene (sÃ­ndrome maligna)' },
  { intoxicationType: 'Opioides', antidote: 'Naloxone: pode ser repetido a cada 2 a 3 min' },
  { intoxicationType: 'Paracetamol', antidote: 'N-AcetilcisteÃ­na' },
  { intoxicationType: 'RocurÃ´nio', antidote: 'Sugammadex' },
  { intoxicationType: 'SÃ­ndrome anticolinÃ©rgica', antidote: 'Sulfato de fisostigmina' },
  { intoxicationType: 'SÃ­ndrome colinÃ©rgica', antidote: 'Drogas antimuscarÃ­nicas (p.e: atropina)' },
  { intoxicationType: 'SÃ­ndrome serotoninÃ©rgica', antidote: 'Ciproeptadina' },
  { intoxicationType: 'Warfarin', antidote: 'Vitamina K' }
];

