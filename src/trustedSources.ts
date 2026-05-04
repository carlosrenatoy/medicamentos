import type { TrustedSource } from './prescriptionTypes';

export const TRUSTED_SOURCES: TrustedSource[] = [
  {
    id: 'institutional-protocol',
    title: 'Protocolo institucional validado',
    organization: 'Serviço local / Farmácia clínica',
    url: 'about:blank',
    sourceType: 'institutional_protocol',
    note: 'Prioridade máxima quando houver protocolo local revisado por pediatria, farmácia clínica e enfermagem.',
  },
  {
    id: 'anvisa-bulario',
    title: 'Bulário eletrônico',
    organization: 'Anvisa',
    url: 'https://consultas.anvisa.gov.br/#/bulario/',
    sourceType: 'drug_label',
    note: 'Fonte oficial brasileira para bulas e apresentações disponíveis no Brasil.',
  },
  {
    id: 'dailymed',
    title: 'DailyMed drug labels',
    organization: 'U.S. National Library of Medicine',
    url: 'https://dailymed.nlm.nih.gov/dailymed/',
    sourceType: 'drug_label',
    note: 'Fonte pública de rótulos e informações de medicamentos aprovados nos EUA.',
  },
  {
    id: 'ashp-standardize-4-safety',
    title: 'Standardize 4 Safety pediatric continuous infusion standards',
    organization: 'ASHP',
    url: 'https://www.ashp.org/pharmacy-practice/standardize-4-safety-initiative',
    sourceType: 'safety_guideline',
    note: 'Referência para padronização de concentrações e segurança em infusões pediátricas.',
  },
  {
    id: 'ismp-smart-pumps',
    title: 'Guidelines for optimizing safe implementation and use of smart infusion pumps',
    organization: 'ISMP',
    url: 'https://www.ismp.org/guidelines/safe-implementation-and-use-smart-pumps',
    sourceType: 'safety_guideline',
    note: 'Referência de segurança para bombas inteligentes, biblioteca de drogas e dupla checagem.',
  },
  {
    id: 'bnfc',
    title: 'BNF for Children',
    organization: 'NICE / BMJ Group / Pharmaceutical Press / RCPCH',
    url: 'https://bnfc.nice.org.uk/',
    sourceType: 'pharmacy_reference',
    note: 'Referência pediátrica para doses e medicamentos. Pode exigir acesso conforme região/assinatura.',
  },
  {
    id: 'lexicomp-pediatric',
    title: 'Pediatric & Neonatal Lexi-Drugs',
    organization: 'Wolters Kluwer Lexicomp',
    url: 'https://www.wolterskluwer.com/en/solutions/lexicomp',
    sourceType: 'pharmacy_reference',
    note: 'Referência farmacêutica pediátrica/neonatal. Geralmente exige assinatura institucional.',
  },
  {
    id: 'micromedex',
    title: 'Micromedex',
    organization: 'Merative',
    url: 'https://www.merative.com/clinical-decision-support/micromedex',
    sourceType: 'pharmacy_reference',
    note: 'Referência farmacêutica e de compatibilidade. Geralmente exige assinatura institucional.',
  },
];

export const DILUENT_LABELS: Record<string, string> = {
  SF0_9: 'soro fisiológico 0,9%',
  SG5: 'soro glicosado 5%',
  SG10: 'soro glicosado 10%',
  AD: 'água destilada',
  RL: 'Ringer lactato',
  none: 'sem diluição',
  institutional_protocol: 'diluente conforme protocolo institucional',
};
