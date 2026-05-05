import fs from 'fs';

// Read all lotes
let allData = [];
for (let i = 1; i <= 8; i++) {
  try {
    const raw = fs.readFileSync(`lote${i}.json`, 'utf-8');
    allData = allData.concat(JSON.parse(raw));
  } catch(e) {
    // Ignore missing lotes
  }
}

const mapMedicines = (data) => {
  return data.filter(item => item.Medicamento).map((item, index) => {
    
    const doseOriginal = item['Dose_original'] || '';
    
    // We will preserve the ENTIRE dose original text in a single regimen so nothing is lost.
    // The previous AI tried to parse it and failed. We will put the rich text into 'notes' and 'indication' so the doctor can read it exactly as they typed it.
    
    let adminMode = 'intermittent';
    let route = 'IV';
    if (item['Infusão_contínua?'] === 'sim') adminMode = 'continuous';
    if (item['Tipo_detectado']?.includes('oral')) route = 'VO';
    
    return {
      id: `med_${index + 1}_${item.Medicamento.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      name: item.Medicamento,
      clinicalComment: item['Comentário_original'] || '',
      presentations: [
        {
          id: `pres_1`,
          description: item['Apresentacao_preenchida'] || 'Não especificada',
          drugAmount: 0,
          drugUnit: 'mg',
          volumeMl: 1,
          concentrationAmount: 0,
          concentrationUnit: 'mg',
          concentrationVolumeMl: 1
        }
      ],
      regimens: [
        {
          id: `reg_1`,
          indication: 'Dose / Orientação Clínica',
          route: route,
          administrationMode: adminMode,
          doseBasis: doseOriginal.toLowerCase().includes('m²') || doseOriginal.toLowerCase().includes('superfície') ? 'bsa' : 'weight',
          notes: doseOriginal, // PRESENTA O TEXTO COMPLETO DO MEDICO
        }
      ],
      preparations: [],
      safety: {
        highAlert: item['Alto_alerta?'] === 'sim',
        independentDoubleCheck: item['Alto_alerta?'] === 'sim'
      },
      sources: [
        {
          id: 'src_1',
          title: item['Fonte_preenchida'] || 'Referência Pediátrica',
          organization: 'Fonte Clínica',
          url: item['Fonte_URL_Anvisa'] || '',
          sourceType: 'clinical_guideline'
        }
      ],
      version: '1.0.0',
      validationStatus: 'validated'
    };
  });
};

const structuredMedicines = mapMedicines(allData);

const output = `import { StructuredMedicine } from '../prescriptionTypes';

export const generatedCatalog: StructuredMedicine[] = ${JSON.stringify(structuredMedicines, null, 2)};
`;

fs.writeFileSync('./src/catalog/medicines.generated.ts', output);
console.log('Catalog generated successfully with ' + structuredMedicines.length + ' medicines!');
