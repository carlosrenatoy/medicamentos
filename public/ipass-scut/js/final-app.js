// @ts-nocheck — vanilla JS legado (event.target sem casts).
// Será migrado por módulos a partir da Fase 6, quando entrarem os repos Supabase com tipagem.
// ===================================
// BUXO SCUT - COCKPIT SYSTEM
// ===================================

class BuxoSystem {
    // ===================================
    // UI RENDERING - LIST VIEW
    // ===================================

    constructor() {
        if (window.buxo) return; // Prevent multiple instances
        // One-time data replacement logic for current turn
        if (!localStorage.getItem('buxo_data_update_v13_final')) {
            localStorage.setItem('buxo_patients_final', JSON.stringify(this.getSamplePatients()));
            localStorage.setItem('buxo_data_update_v13_final', 'true');
            localStorage.setItem('buxo_initialized', 'true');
        }

        this.patients = this.loadData('buxo_patients_final') || [];
        this.portaPatients = this.loadData('buxo_patients_porta') || [];
        this.currentView = 'retaguarda';
        this.currentId = null;
        this.saveTimeout = null;
        this.currentFilter = 'total';
        this.searchTerm = '';

        // Esquema canônico de leitos, unificado com mapa-retaguarda-app.js.
        // O mapa interativo vive em mapa-retaguarda.html; aqui usamos só como fonte
        // do dropdown de leitos no formulário e na detecção de conflito.
        this.leitosFixos = [
            { id: 'Iso 17', x: 60, y: 53, label: 'Iso 17' },
            { id: 'Iso 16', x: 60, y: 59, label: 'Iso 16' },

            { id: 'Leito 1', x: 48, y: 66, label: 'Leito 1' },
            { id: 'Leito 2', x: 55, y: 66, label: 'Leito 2' },
            { id: 'Leito 3', x: 62, y: 66, label: 'Leito 3' },

            { id: 'Leito 4', x: 75, y: 66, label: 'Leito 4' },
            { id: 'Leito 5', x: 75, y: 72, label: 'Leito 5' },
            { id: 'Leito 6', x: 75, y: 77, label: 'Leito 6' },

            { id: 'Leito 9', x: 48, y: 77, label: 'Leito 9' },
            { id: 'Leito 8', x: 55, y: 77, label: 'Leito 8' },
            { id: 'Leito 7', x: 62, y: 77, label: 'Leito 7' },

            { id: 'Leito 10', x: 48, y: 85, label: 'Leito 10' },
            { id: 'Leito 11', x: 48, y: 90, label: 'Leito 11' },
            { id: 'Leito 12', x: 48, y: 95, label: 'Leito 12' },

            { id: 'Leito 15', x: 75, y: 83, label: 'Leito 15' },
            { id: 'Leito 14', x: 75, y: 89, label: 'Leito 14' },
            { id: 'Leito 13', x: 75, y: 95, label: 'Leito 13' },
        ];

        // Salas especiais (Áreas de clique - invisíveis ou semitransparentes)
        this.salasEspeciais = [
            { id: 'Estabilização', x: 15, y: 5, label: 'Estabilização', width: 25, height: 15 },
            { id: 'Emergência', x: 25, y: 58, label: 'Emergência', width: 18, height: 12 },
            { id: 'Procedimento', x: 25, y: 72, label: 'Procedimento', width: 18, height: 12 },
        ];

        // Consultórios da Porta (não aparecem no mapa da retaguarda, mas são leitos válidos)
        this.leitosPorta = [
            { id: 'Con1', label: 'Con1' },
            { id: 'Con2', label: 'Con2' },
            { id: 'Con3', label: 'Con3' },
            { id: 'Con4', label: 'Con4' },
            { id: 'Medic', label: 'Medic' },
        ];

        this.init();
    }

    init() {
        this.renderList();
        this.setupEvents();

        // Setup Overlay if not exists
        if (!document.getElementById('cockpitOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'cockpitOverlay';
            overlay.className = 'cockpit-overlay';
            overlay.innerHTML = `
                <div class="cockpit-header">
                    <div class="ch-info" id="chHeaderInfo"></div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span id="saveStatus" style="font-size: 0.75rem; color: #16a34a;">✓ Salvo</span>
                        <button class="btn-new" id="btnNewPatientCockpit" onclick="buxo.createNewPatient()">+ Novo</button>
                        <button class="btn-config" onclick="buxo.openConfig()" title="Configurações IA">⚙️</button>
                        <button class="btn-close" id="btnCloseCockpit">✕</button>
                    </div>
                </div>
                <div class="cockpit-body" id="cockpitBody"></div>
            `;
            document.body.appendChild(overlay);
            document
                .getElementById('btnCloseCockpit')
                .addEventListener('click', () => this.closeCockpit());
        }
    }

    loadData(key) {
        try {
            let stored = JSON.parse(localStorage.getItem(key));
            if (!stored || !Array.isArray(stored)) {
                // Initialize with sample data if it's the main list
                if (key === 'buxo_patients_final') {
                    stored = this.getSamplePatients();
                    localStorage.setItem('buxo_patients_final', JSON.stringify(stored));
                } else {
                    stored = [];
                    localStorage.setItem(key, JSON.stringify(stored));
                }
            } else if (stored.length === 0 && key === 'buxo_patients_final' && !localStorage.getItem('buxo_initialized')) {
                // Se estiver vazio e nunca inicializou, carrega os exemplos (anti-bug do LocalStorage limpo acidentalmente)
                stored = this.getSamplePatients();
                localStorage.setItem('buxo_patients_final', JSON.stringify(stored));
                localStorage.setItem('buxo_initialized', 'true');
            }
            return stored;
        } catch (e) {
            console.error('Error loading data', e);
            return [];
        }
    }

    getSamplePatients() {
        return [
            {
                id: 1,
                name: 'Kaua Levi Dias da Conceição',
                leito: 'Leito 1',
                age: '2 anos',
                rghc: '92234530B',
                dih: '30/03',
                weight: '8,1 kg',
                alergia: 'Não informada',
                gravity: 'alert',
                systems: ['resp', 'circ'],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'Fibrose cística genética F508del homozigoto; Cardiomiopatia dilatada (FE 16%) em seguimento com TX cardíaco; ICS por Candida tropicalis.',
                atual: 'Exacerbação de FC. Descompensação cardíaca. TVP 19/04.',
                hpma: 'Abril/26: descompensação de FC, iniciado VNI + ATB + Milrinone. Evoluiu com novo ep de desconforto em 17/04. TVP em 19/04 (iniciado enoxa). Alta para Ped4 em 22/04, mas retornou ao SCUT em 25/04 por desconforto respiratório importante. 02/05: Distensão abdominal importante.',
                labs: '03/05: Hb 8,1 Ht 26 Plaq 300k. 30/04: Hb 7,9 Ht 24,1 Leuco 8,240 PCR 0,1 U 36 Creat 0,19 Na 133 K 4,0.',
                imagem: 'ECOTT 30/04 FE 15%; AE dilatação moderada; VE dilatação importante FE 13,5%. Insuficiência mitral importante. US CERVICAL (22/04): Ausência de trombos.',
                infeccioso: 'HMCc/p PN (21/04). Ponta CVC candida tropicalis (17/04).',
                prescricao: 'Dieta hidrolisada 150 mL 3/3h; Precedex 1,5 mcg/kg/h; Enoxa 10mg EV 12/12h; Captopril 8mg 8/8h; Carvedilol 0,9 mg/kg/d; Furosemida 8mg 12/12h; Espironolactona 6mg 12/12h; AAS 40 mg 1x dia.',
                muc: 'Dornase alfa 2,5 mg; Seretide; Enzimas pancreáticas; ADEK.',
                dieta: 'Dieta hidrolisada 150 mL de 3/3h sem pausa noturna (sem enzimas)',
                pendencias: 'Peso diário + BH; Fisioterapia; Checar P22; Discutir tempo de anticoagulação; Ligar ramal 5041 (AG vaga UTI InCor).',
                recebeu: 'Ceftazidima, linezolida e amicacina (até 20/04); Milrinone (até 21/04); Micafungina (até 30/04).',
                statusDestino: 'aguarda',
                aguardaTipo: 'uti',
                destinoDetalhes: 'AG vaga UTI InCor (solicitada 27/04). Ligar ramal 5041 diariamente.',
                especialidades: 'CARDIO, PNEUMO',
                sv: 'BiPAP 12 + 6 sem O2',
                scatsObs: 'PIC MID 17/04',
            },
            {
                id: 2,
                name: 'Arthur Novaes Brito',
                leito: 'Leito 2',
                age: '17a',
                rghc: '6157126G',
                dih: '02/05',
                weight: '43,4 kg',
                alergia: 'Nega',
                gravity: 'alert',
                systems: ['resp'],
                nightEvolution: false,
                sharedDiagnosis: false,
                previo: 'Fibrose Cística (F508del), Trikafta, Íleo meconial, Hepatopatia da FC, TDAH, O2 domiciliar.',
                atual: 'Exacerbação FC, Varicela, PAC?',
                hpma: '28/04: lesões difusas + esforço respiratório com necessidade de O2. 30/04: febre. 02/05: Procura ao SCUT. 03/05: desconforto importante, realizado ciclo salbutamol/ipratrópio.',
                labs: 'Hb 15,8 / Ht 44,6% / Leuco 3310 (8% bastões) / Plaq 101000 / PCR 29.',
                imagem: 'Rx de torax: consolidação em lobo inferior esquerdo.',
                infeccioso: 'Ag HMC; Culturas secreção traqueal prévia: MSSA intermitente.',
                prescricao: 'Ceftazidima 2g 8/8; Amicacina 1g 1x; Oxacilina 3g 6/6; Aciclovir 450mg 8/8; Salbutamol 600mcg 3/3h.',
                muc: 'Trikafta, Azitromicina, Dornase, Creon, Pulmozyme.',
                dieta: 'Livre para idade',
                pendencias: 'Fisioterapia; AG HMC 02/05; Avaliar manutenção de salbutamol; RPPI; VNI.',
                recebeu: 'Ciclo salbutamol (600mcg) + ipratrópio (40gts) em 03/05.',
                statusDestino: '',
                especialidades: 'PNEUMO',
                sv: 'Cateter nasal 1l/min',
                scatsObs: 'AVP',
            },
            {
                id: 3,
                name: 'AGATHA HENRIQUE PEDRASSINI',
                leito: 'Leito 3',
                age: '11 meses',
                rghc: '92474654E',
                dih: '01/05',
                weight: '6,5 kg',
                alergia: 'Nega',
                gravity: 'alert',
                systems: ['resp'],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'RNPT 25+1 semanas, EBP, 588g, DBP.',
                atual: 'Crise de sibilância D7.',
                hpma: '27/05 tosse/coriza. 01/05 retornou ao SCUT taquipneica/dessaturando. Acoplada ao CNAF. 02/05 piora (set 70% FIO2). 03/05 mantido CNAF.',
                labs: '02/05: PCR 23,1 / Hb 13,9 / HT 41,8% / LT 15.110.',
                imagem: 'Rx tórax 01/05: cissurites bilateralmente, atelectasia importante retrocardíaca.',
                infeccioso: 'Flucorv 01/05 Ag; HMC 02/05 PN.',
                prescricao: 'FLT 120 ml 3/3h SNG; Salbutamol 400mcg 2/2h; Prednisolona 2mg/kg (D5); Oseltamivir 3,5mg/kg 12/12h.',
                muc: 'Adtil, sulfato ferroso e fosfato tricalcio.',
                dieta: 'FLT 120 ml 3/3h SNG',
                pendencias: 'Ag Flucorv; Checar HMC; Desmame CNAF conforme tolerância; Suspender corticoide em D7.',
                recebeu: 'Ciclo salbutamol + ipratrópio na admissão.',
                statusDestino: '',
                especialidades: 'PNEUMO',
                sv: 'CNAF 14L FIO2 50%',
                scatsObs: 'SNG',
            },
            {
                id: 4,
                name: 'Bernardo Siqueira Rodina',
                leito: 'Leito 4',
                age: '7 meses',
                rghc: '55673702G',
                dih: '02/05',
                weight: '6,7 kg',
                alergia: 'Nega',
                gravity: 'alert',
                systems: ['circ'],
                nightEvolution: false,
                sharedDiagnosis: false,
                previo: 'PO correção de DSAVT + CIA planejada 2-3 mm (23/03/26).',
                atual: 'ITU.',
                hpma: '28/04 febre (39°C) + diminuição diurese. 02/05 prostração, recusa alimentar. Incor aberto protocolo sepse. 03/05 piora do estado geral, prescrita nova expansão.',
                labs: '03/05 gasov: pH 7,43 pCO2 33 HCO3 21 Lactato 22 PCR 407 Creat 0,22.',
                imagem: 'RX abdome 03/05: pouco ar em ampola retal. POCUS 03/05: sinais de euvolemia/hipovolemia.',
                infeccioso: 'HMC Incor (02/05) Ag; URC Incor (02/05) Ag.',
                prescricao: 'Ceftriaxona 100mg/kg/dia 12/12h EV; MUC.',
                muc: 'Captopril, Furosemida, Espironolactona.',
                dieta: 'Geral para a idade',
                pendencias: 'Retornar furosemida 8mg VO conforme melhora da desidratação.',
                recebeu: 'SF 0.9% 10mL/kg 2x; Ceftriaxona 100mg/kg ataque.',
                statusDestino: '',
                especialidades: 'CARDIO',
                sv: 'AA',
                scatsObs: 'AVP MSD',
            },
            {
                id: 5,
                name: 'GABRIELLY APARECIDA QUEIROZ',
                leito: 'Extra 18',
                age: '17 anos',
                rghc: '6197399F',
                dih: '01/05',
                weight: '35 kg',
                alergia: 'Nega',
                gravity: 'stable',
                systems: [],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'Mucopolissacaridose tipo IIIA, Adenoma de hipófise.',
                atual: 'Crise convulsiva, Saída acidental da gastrostomia.',
                hpma: '30/04 sacou GTT em crise distônica. 01/05 Escapes convulsivos (6x). Repassado GTT. 02/05 Avaliada pela neuro.',
                labs: '02/05: CPK 42. 01/05 gasometria: pH 7,29; pCO2 57; HCO3 27,4. UR1: 1000 leuco.',
                imagem: 'Não informada',
                infeccioso: 'HMC 01/05 PN; URC 01/05 PN.',
                prescricao: 'Dieta polimérica 300 ml 4/4h; Oxacarbamazepina 200mg 12/12h; Clonidina 50mcg 1x ACM.',
                muc: 'Carbamazepina, Clonidina, Gabapentina, Hidrocortisona, THC, CBD, tramadol.',
                dieta: 'Polimérica 300 ml 4/4h com pausa noturna',
                pendencias: 'Ag urocultura; Otimizar oxacarbamazepina; Iniciar PEG 14g 1x ao dia.',
                recebeu: 'Midazolam 7mg IM; Fenitoína 700mg; Difenidramina EV.',
                statusDestino: '',
                especialidades: 'CIRURGIA, NEURO',
                sv: 'AA',
                scatsObs: 'AVP MSD / GTT',
            },
            {
                id: 6,
                name: 'Letícia Rodrigues Brito',
                leito: 'Leito 6',
                age: '12a',
                rghc: '60060974B',
                dih: '01/05',
                weight: '42 kg',
                alergia: 'Nega',
                gravity: 'stable',
                systems: [],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'LLA.',
                atual: 'Neutropenia febril.',
                hpma: '26/04 Última QT. 01/05 Pico febril 39,1ºC. 02/05 choque anafilático após plaquetas. 03/05 Novo CH, associado teicoplanina.',
                labs: '03/05 Hb 8,9 / HT 26,4% / LT 870 (SEG 370) / Plaq 63.000 / PCR 27,9.',
                imagem: 'Rx tórax (01/05): sem alterações.',
                infeccioso: '01/05 HMCc/p PN; 02/05 HMCc/p AG; URC NEGATIVA.',
                prescricao: 'Cefepime 2g 8/8h; Oseltamivir 75mg 12/12h; Teicoplanina (associado 03/05).',
                muc: 'Bactrim (Sulfa 400mg) 2a, 4a, 6a.',
                dieta: 'DGI',
                pendencias: 'Ag culturas; Associado teicoplanina; Coletar FLUCORV ou P22 em 04/05 cedo.',
                recebeu: 'Adrenalina IM; Bolsa plaquetas (02/05); CH 7,2 ml/kg (03/05).',
                statusDestino: '',
                especialidades: 'ONCO',
                sv: 'AA',
                scatsObs: 'PICC em MSD',
            },
            {
                id: 7,
                name: 'Bianca Silva Brito',
                leito: 'Leito 7',
                age: '15a',
                rghc: '92844192E',
                dih: '30/04',
                weight: '58 kg',
                alergia: 'Nega',
                gravity: 'stable',
                systems: [],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'Hígida.',
                atual: 'Linfoma de Hodgkin; Síndrome gripal.',
                hpma: 'há 2 meses linfonodomegalia + febre. 30/04 procurou SCUT vindo da Bahia. Internada para investigação. 02/05 Estável, afebril.',
                labs: '03/05: Hb 14,3 | Ht 43,5 | Leuco 11,33 | PCR 27,7 (30/04).',
                imagem: 'TC torax, abd e pelve realizada (aguarda laudo). USS (ext): linfonodos hipoecogênicos.',
                infeccioso: 'Ag Flucorv.',
                prescricao: 'Ceftriaxona 50 mg/kg/dia; Oseltamivir 75 mg 12/12h; Albendazol 400 mg.',
                muc: 'Nega.',
                dieta: 'Geral para imunossuprimido',
                pendencias: 'Ag Flucorv; TC laudo; Jejum para Bx excisional em 04/05.',
                recebeu: 'Ivermectina.',
                statusDestino: 'aguarda',
                aguardaTipo: 'transferencia',
                destinoDetalhes: 'Solicitada vaga no ITACI (01/05). Possível alta após Bx.',
                especialidades: 'ONCO',
                sv: 'AA',
                scatsObs: 'AVP',
            },
            {
                id: 8,
                name: 'WALLYSON SOUSA COSTA',
                leito: 'Leito 8',
                age: '17 anos',
                rghc: '6171310D',
                dih: '01/05',
                weight: '53,9 kg',
                alergia: 'Nega',
                gravity: 'stable',
                systems: [],
                nightEvolution: false,
                sharedDiagnosis: false,
                previo: 'Depressão; Síndrome Nefrótica Cortico Resistente; Dermatite Atópica; Baixa Estatura.',
                atual: 'Tentativa de autoextermínio.',
                hpma: '25/04 uso de 15 comp de escitalopram. 01/05 internado pelo risco psiquiátrico. 02/05 aguarda internação em IPQ.',
                labs: 'Ag exames.',
                imagem: 'Não informada',
                infeccioso: 'Não informado',
                prescricao: 'Escitalopram 15mg 1x/dia.',
                muc: 'MMF, Tacrolimo, Enalapril, Prednisona, Escitalopram, Somatropina.',
                dieta: 'Geral',
                pendencias: 'PQ avaliou, aguarda vaga de internação em IPQ.',
                recebeu: 'Transporte para avaliação IPQ.',
                statusDestino: 'aguarda',
                aguardaTipo: 'transferencia',
                destinoDetalhes: 'Aguarda vaga em IPQ. Tel Psiquiatria: 11 99292-3267.',
                especialidades: 'NEFRO, PSIQUIATRIA',
                sv: 'AA',
                scatsObs: '-',
            },
            {
                id: 9,
                name: 'Pedro Reis Moreira',
                leito: 'Leito 9',
                age: '2a 6m',
                rghc: '44164234E',
                dih: '01/05',
                weight: '11 kg',
                alergia: 'Ibuprofeno e descongestionante nasal',
                gravity: 'stable',
                systems: ['circ'],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'Hemangioendotelioma kaposiforme em escápula direita.',
                atual: 'Febre no imunossuprimido; Síndrome gripal.',
                hpma: '01/05: Confusão mental, piora do estado geral, febre alta. Dextro 54. 02/05: hipoglicemia corrigida com dieta.',
                labs: 'Hb 10,3 | PCR 110,2 | Na 131 | K 3,7 | Cr 0,27. U1: Glicose 2+ / Corpos cetônicos 3+.',
                imagem: 'Rx tórax (01/05): infiltrado perihilar a D. POCUS (01/05): 1 consolidação subpleural em LSD.',
                infeccioso: 'HMC (01/05) PN; PVR (01/05) Ag; URC (01/05) Ag.',
                prescricao: 'Cefepime 50mg/kg/d; Oseltamivir 30mg 12/12h; Simeticona; PEG.',
                muc: 'Sirolimo 1 mg 12/12h; Bactrim (2a, 4a, 6a).',
                dieta: 'DGI',
                pendencias: 'Aguarda URC, PVR e HMC; Transicionar ATB para VO segunda?',
                recebeu: 'Expansão SF 10 mL/kg; Glicose 25% 2 mL/kg (3x).',
                statusDestino: '',
                especialidades: 'HEMATE',
                sv: 'AA',
                scatsObs: 'AVP',
            },
            {
                id: 10,
                name: 'Maria Esther Pereira Nobre',
                leito: 'Leito 10',
                age: '3a',
                rghc: '92735598B',
                dih: '02/05',
                weight: '14,6 kg',
                alergia: 'Nega',
                gravity: 'stable',
                systems: [],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'Sarcoma hepático metastático pulmonar. Hepatectomia parcial em Jan/26.',
                atual: 'Neutropenia febril; Síndrome gripal imunossuprimido.',
                hpma: '30/04 neutropenia grave. 02/05 pico febril (37,7ºC). Admitida com 250 leuco. 03/05 Sem queixas ou febre.',
                labs: '03/05: Hb 8,4 | LT 1310 (SEG 160) | Plaq 81.000 | PCR 65,8.',
                imagem: 'Rx tórax (02/05): infiltrado bilateral. POCUS: consolidações subpleurais bilaterais.',
                infeccioso: 'HMC pareada (02/05) Ag; URC (02/05) Negativa; Flucorv (02/05) AG.',
                prescricao: 'Cefepime 750 mg EV 8/8h; Oseltamivir 30 mg 12/12h.',
                muc: 'Nega.',
                dieta: 'DGI',
                pendencias: 'Aguardo HMC e Flucorv; Exames 04/05; Consulta INRAD 08h (pedir ambulância).',
                recebeu: 'Cefepime + Oseltamivir na admissão.',
                statusDestino: '',
                especialidades: 'ONCO',
                sv: 'AA',
                scatsObs: 'PICC MSD',
            },
            {
                id: 11,
                name: 'Lucas Hendges de Alcantara',
                leito: 'Leito 11',
                age: '13a',
                rghc: '6156711G',
                dih: '02/05',
                weight: '48 Kg',
                alergia: 'Nega',
                gravity: 'stable',
                systems: [],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'Sd nefrotica corticodependente.',
                atual: 'Sd nefrotica descompensada.',
                hpma: '25/04 inchaço periorbitário/MMII/abdome. 02/05 internado para albumina. 03/05 Após albumina e Furosemida, diurese abundante.',
                labs: 'Alb 2,0 | Creat 0,36 | prot totais 3,7. Cr basal: 0,49.',
                imagem: 'POCUS (02/05): líquido livre moderado; Derrame pleural lamelar D e 2cm E.',
                infeccioso: 'Não informado',
                prescricao: 'Restrição de sódio; Albumina humana 20% 40g; Furosemida 20mg; Prednisona 60mg.',
                muc: 'MMF 750 mg 12/12h; Hipromelose; Vit D3; Carbonato de cálcio.',
                dieta: 'Com restrição de sódio',
                pendencias: 'PA 6/6h; BH rigoroso; Albumina EV hoje 20g + furosemida 1mg/kg.',
                recebeu: 'Albumina 40g + Furosemida 15mg em 03/05.',
                statusDestino: '',
                especialidades: 'NEFRO',
                sv: 'AA',
                scatsObs: '-',
            },
            {
                id: 12,
                name: 'LORRAYNE VITORIA DOS SANTOS',
                leito: 'Leito 12',
                age: '2a 3m',
                rghc: '6196556G',
                dih: '03/05',
                weight: '12 kg',
                alergia: 'Nega',
                gravity: 'stable',
                systems: ['circ'],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'Hemangio Epitelioma kaposiforme em MIE; Kasabach Merritt-resolvida.',
                atual: 'Celulite em MIE? Exacerbação de doença?',
                hpma: '01/05: tosse seca e coriza. 02/05: início de edema em MIE + febre 39ºC. 03/05: admitida, iniciado cef 100 mg/Kg + vancomicina.',
                labs: 'Hb 12 | Plaq 212k | Leuco 23480 (S73%) | PCR 253,8. Cr 0,34.',
                imagem: 'RX tórax 03/05 normal. USG MIE 03/05: Ausência de sinais de trombose.',
                infeccioso: '03/05: HMC AG; FLUCORV AG.',
                prescricao: 'Vancomicina 40mg/kg/dia; Ceftriaxona 50mg/kg/dia.',
                muc: 'Sirolimus (0,5mg) 1/2 comp 12/12h.',
                dieta: 'Geral',
                pendencias: 'AG dímero-D e coagulograma; Incluir pred? (hemato); Hb amanhã.',
                recebeu: 'Ceftriaxona 100mg/kg na porta.',
                statusDestino: '',
                especialidades: 'HEMA, PLASTICA',
                sv: 'AA',
                scatsObs: 'AVP em MSE',
            },
            {
                id: 13,
                name: 'Kadmiel Kaepa Wakami Kilhub',
                leito: 'Leito 13',
                age: '8 meses',
                rghc: 'Não informado',
                dih: '03/05',
                weight: '9,6 kg',
                alergia: 'Nega',
                gravity: 'stable',
                systems: ['resp'],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'Anemia Falciforme; Risco social; BVA prévio.',
                atual: 'Infecção de vias aéreas superiores + Hemólise + febre.',
                hpma: '03/05: pais trazem por sintomas respiratórios. Na entrada visto dessaturação e irritabilidade. Admitido para ATB EV.',
                labs: '03/05: PCR 18.5 | BT 1.59 | Hb 8.1 | Leuco 23,1k (66% N).',
                imagem: 'Rx tórax: Dentro dos limites da normalidade.',
                infeccioso: 'Aguarda Flur-cov.',
                prescricao: 'Cef 100 mg/kg/dia; Oselta 30 mg 12/12; Salbutamol 4/4h; Pred 1 mg/Kg.',
                muc: 'Adtil.',
                dieta: 'Geral para a idade',
                pendencias: 'Convocar hematologia; Labs amanhã.',
                recebeu: 'Dipirona, ciclo beta-2 e ipratrópio, corticoide 2mg/kg.',
                statusDestino: '',
                especialidades: 'HEMA',
                sv: 'Ar ambiente',
                scatsObs: 'AVP',
            }
        ];
    }

    saveData() {
        try {
            localStorage.setItem('buxo_patients_final', JSON.stringify(this.patients));
            localStorage.setItem('buxo_patients_porta', JSON.stringify(this.portaPatients));
        } catch (e) {
            console.warn('Falha ao salvar pacientes em localStorage', e);
            const status = document.getElementById('saveStatus');
            if (status) {
                status.textContent = '⚠️ Falha ao salvar';
                status.style.color = '#b91c1c';
            }
            return;
        }

        const status = document.getElementById('saveStatus');
        if (status) {
            status.textContent = '✓ Salvo';
            status.style.color = '#16a34a';
            setTimeout(() => {
                status.textContent = '💾 Autosalve Ativo';
                status.style.color = '#94a3b8';
            }, 2000);
        }

        // Only update UI elements that changed, and do it here (after debounce)
        this.updateStatsUI();
        if (this.currentId) {
            this.updateHeader(this.currentId);
        }
    }

    triggerAutoSave(patientId) {
        // Find which list has this patient
        // Since IDs are timestamps, collision is unlikely but let's be safe by using currentView
        // Actually, triggerAutoSave might be called from cockpit which is mostly retaguarda?
        // But for Porta we need it too.

        const status = document.getElementById('saveStatus');
        if (status) {
            status.textContent = '💾 Salvando...';
            status.style.color = '#f59e0b';
        }

        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            // Just save current view data
            this.saveData();
        }, 800);
    }

    renderList() {
        if (this.currentView === 'porta') {
            this.renderPortaList();
        } else {
            this.renderRetaguardaList();
        }
    }

    renderRetaguardaList() {
        const grid = document.getElementById('patientGrid');
        if (!grid) return;
        grid.style.display = '';

        if (this.patients.length === 0) {
            grid.innerHTML = `<div style="padding: 40px; text-align: center; grid-column: 1/-1; color: #94a3b8;">Nenhum paciente. Clique em "Novo Paciente".</div>`;
            return;
        }

        grid.className = 'patient-grid-container'; // Changed class for CSS Grid

        // SEARCH FILTER
        let filtered = this.patients;
        if (this.searchTerm && this.searchTerm.length > 0) {
            filtered = filtered.filter((p) => {
                const name = (p.name || '').toLowerCase();
                const leito = (p.leito || '').toLowerCase();
                const rghc = (p.rghc || '').toLowerCase();
                return (
                    name.includes(this.searchTerm) ||
                    leito.includes(this.searchTerm) ||
                    rghc.includes(this.searchTerm)
                );
            });
        }

        // STATUS FILTERING
        if (this.currentFilter === 'unstable')
            filtered = filtered.filter((p) => p.gravity === 'unstable');
        else if (this.currentFilter === 'alert')
            filtered = filtered.filter((p) => p.gravity === 'alert');
        else if (this.currentFilter === 'alta')
            filtered = filtered.filter((p) => p.statusDestino === 'alta');
        else if (this.currentFilter === 'internar')
            filtered = filtered.filter((p) => p.statusDestino === 'internacao');
        // 'total' shows all

        // SORTING: Unstable > Alert > Stable
        // SORTING: Unstable > Alert > Stable | 'Vai Internar' por último
        const getScore = (p) => {
            let score = 0;

            // Base Score by Gravity (Highest logic precedence for non-internacao)
            if (p.gravity === 'unstable') score = 100;
            else if (p.gravity === 'alert') score = 50;
            else if (p.gravity === 'stable') score = 10;
            else score = 0;

            // Special Rule: 'Vai Internar' always last
            if (p.statusDestino === 'internacao') {
                score -= 1000;
            }

            return score;
        };

        const sortedPatients = [...filtered].sort((a, b) => getScore(b) - getScore(a));

        grid.innerHTML = sortedPatients
            .map((p) => {
                // GRAVITY + SYSTEMS UNIFIED BADGE
                // GRAVITY + SYSTEMS UNIFIED BADGE
                const gLabel = this.getGravityLabel(p.gravity);
                const sysList =
                    p.gravity !== 'stable' && p.systems
                        ? p.systems.map((s) => s.toUpperCase()).join(', ')
                        : '';
                const gFullText = sysList ? `${gLabel} • ${sysList}` : gLabel;
                const gClass =
                    p.gravity === 'unstable'
                        ? 'badge-unstable'
                        : p.gravity === 'alert'
                          ? 'badge-alert'
                          : 'badge-stable';

                const gravityBadge = `<div class="status-dest ${gClass}" style="width:100%; display:block; text-align:center; margin-bottom:4px;">${gFullText}</div>`;

                // Destino Logic - Mostrar status no card
                // STATUS + DETAILS UNIFIED BADGE
                let destHTML = '';
                let sClass = '';
                let sLabel = '';
                let sDetails = '';

                if (p.statusDestino === 'alta') {
                    sClass = 'status-alta';
                    sLabel = '✅ ALTA';
                } else if (p.statusDestino === 'aguarda') {
                    sClass = 'status-aguarda';
                    sLabel = '⏳ AGUARDA VAGA';
                    // Add Type to Label
                    const tipoMap = {
                        transf: 'TRANSFERÊNCIA',
                        internacao: 'INTERNAÇÃO',
                        uti: 'UTI',
                    };
                    if (p.aguardaTipo && tipoMap[p.aguardaTipo])
                        sLabel += ` • ${tipoMap[p.aguardaTipo]}`;
                    sDetails = p.destinoDetalhes;
                } else if (p.statusDestino === 'internacao') {
                    sClass = 'status-internacao';
                    sLabel = '🏥 VAI INTERNAR';
                    sDetails = p.destinoDetalhes;
                } else if (p.statusDestino === 'cedida') {
                    sClass = 'status-cedida';
                    sLabel = '🤝 VAGA CEDIDA';
                    sDetails = p.destinoDetalhes;
                }

                if (sClass) {
                    destHTML = `
                <div class="status-dest ${sClass}" style="width:100%; display:block;">
                    <div style="font-weight:800; font-size:0.8rem;">${sLabel}</div>
                    ${sDetails ? `<div style="font-weight:400; font-size:0.75rem; margin-top:2px; padding-top:2px; border-top:1px solid rgba(0,0,0,0.1);">${sDetails}</div>` : ''}
                </div>`;
                }

                // Night Evolution Button
                const nightEvoClass = p.nightEvolution ? 'night-evo-yes' : 'night-evo-no';
                const nightEvoText = p.nightEvolution ? 'SIM' : 'NÃO';
                const nightEvoIcon = p.nightEvolution ? '🌙' : '☀️';

                // Alergia badge Logic
                // If hasAllergy is explicitly set, use it. usage: p.hasAllergy === true
                // If undefined, fallback to check if string is not empty (compatibility)
                const hasAllergy =
                    p.hasAllergy !== undefined
                        ? p.hasAllergy
                        : p.alergia &&
                          p.alergia.trim().length > 0 &&
                          p.alergia.toUpperCase() !== 'NKDA';

                const alergiaHTML =
                    hasAllergy && p.alergia && p.alergia.trim()
                        ? `<span class="alergia-badge">⚠️ ALERGIA: ${p.alergia}</span>`
                        : '';

                // Isolamento Logic for Card
                const isoArray = Array.isArray(p.isolamento) ? p.isolamento : [];
                const isoTypes = isoArray.map((i) => i.toUpperCase()).join(', ');
                const isoObs = p.isolamentoObs || '';
                const showIso = isoTypes.length > 0 || isoObs.length > 0;

                const isolamentoHTML = showIso
                    ? `<div class="iso-badge" style="margin-top:2px; font-size:0.7rem; color:#92400e; background:#fef3c7; border:1px solid #fcd34d; padding:2px 4px; border-radius:4px; font-weight:700; word-break:break-word;">
                     ${isoTypes ? `🔒 ${isoTypes}` : ''}
                     ${isoObs ? (isoTypes ? `<div style="font-weight:400; font-size:0.65rem; border-top:1px solid rgba(0,0,0,0.1); margin-top:2px;">${isoObs}</div>` : `🔒 ${isoObs}`) : ''}
                   </div>`
                    : '';

                return `
            <div class="patient-card" data-gravity="${p.gravity || 'stable'}" onclick="buxo.openCockpit(${p.id})">
                <!-- 1. STRIP -->
                <div class="pc-strip"></div>
                
                <!-- 2. IDENT - Nome primeiro, Leito por último -->
                <div class="pc-col-identity">
                    <div class="pc-name">${p.name || 'Sem Nome'}</div>
                    <div class="pc-meta">${p.age || ''} anos • DIH: ${p.dih || '-'}</div>
                    <div class="pc-leito-val">LEITO ${p.leito || '?'}</div>
                    ${alergiaHTML}
                    ${isolamentoHTML}
                </div>

                <!-- 3. CLINICAL -->
                <div class="pc-col">
                    <div>
                        <div class="info-lbl">PRÉVIO</div>
                        <div class="info-val">${p.previo || '-'}</div>
                    </div>
                    <div style="margin-top:4px;">
                        <div class="info-lbl">ATUAL / INTERCORRÊNCIAS</div>
                        <div class="info-val" style="font-weight:600;">${p.atual || '-'}</div>
                    </div>
                </div>

                <!-- 4. CONDUCT -->
                <div class="pc-col">
                    <div>
                        <div class="info-lbl">MEDICAÇÕES</div>
                        <div class="info-val" style="color:#0369a1;">${p.prescricao || '-'}</div>
                    </div>
                    <div style="margin-top:4px;">
                         <div class="info-lbl">PENDÊNCIAS</div>
                         <div class="info-val" style="color:#b45309; font-weight:600;">${p.pendencias || '-'}</div>
                    </div>
                </div>

                <!-- 5. STATUS -->
                <div class="pc-col-status" style="display:flex; flex-direction:column; gap:4px;">
                    <!-- Unified Badges -->
                    ${gravityBadge}
                    ${destHTML}
                    
                    <!-- NIGHT EVOLUTION BUTTON -->
                    <div class="night-evo-btn ${nightEvoClass}" onclick="event.stopPropagation(); buxo.toggleBoolean(${p.id}, 'nightEvolution')">
                        <span class="night-evo-icon">${nightEvoIcon}</span>
                        <span class="night-evo-label">Ev. Noturna</span>
                        <span class="night-evo-status">${nightEvoText}</span>
                    </div>

                    <!-- DOC ACTIONS (CONDITIONAL) -->
                    ${
                        p.statusDestino === 'alta'
                            ? `
                    <div style="margin-top:auto;">
                        <button class="btn-doc-action ${p.resumoAlta ? 'done' : ''}" 
                                onclick="event.stopPropagation(); buxo.openAltaPopup(${p.id})"
                                title="Gerar Resumo de Alta">
                            ${p.resumoAlta ? '✅ Alta' : '📄 Alta'}
                        </button>
                    </div>`
                            : ''
                    }

                    ${
                        p.statusDestino === 'cedida'
                            ? `
                    <div style="margin-top:auto;">
                        <button class="btn-doc-action ${p.adendoTransferencia ? 'done' : ''}" 
                                onclick="event.stopPropagation(); buxo.openTransferenciaPopup(${p.id})"
                                title="Gerar Adendo de Transferência">
                            ${p.adendoTransferencia ? '✅ Transf' : '🔄 Transf'}
                        </button>
                    </div>`
                            : ''
                    }
                </div>
            </div>
            `;
            })
            .join('');

        this.updateStatsUI();
    }

    renderPortaList() {
        const grid = document.getElementById('patientGrid');
        if (!grid) return;

        // Use portaPatients
        const list = this.portaPatients;

        if (list.length === 0) {
            grid.innerHTML = `<div style="padding: 40px; text-align: center; grid-column: 1/-1; color: #94a3b8;">Nenhum paciente na Porta. Clique em "Novo Paciente".</div>`;
            return;
        }

        grid.className = 'porta-grid-container';

        // Sort by ID (newest first)
        const sortedPatients = [...list].sort((a, b) => b.id - a.id);

        grid.innerHTML = sortedPatients
            .map((p) => {
                // Checklist Logic
                const cl = p.portaChecklist || {};
                const mkCheck = (key, label) => `
                <label class="porta-check">
                    <input type="checkbox" ${cl[key] ? 'checked' : ''} onchange="buxo.togglePortaCheck(${p.id}, '${key}')">
                    ${label}
                </label>
             `;

                return `
             <div class="porta-card">
                <!-- COL 1: ID E CLINICA (EDITAVEL) -->
                <div class="porta-col-info">
                    <div class="porta-text-group">
                        <div class="porta-label">ID:</div>
                        <textarea class="porta-textarea-small porta-auto-expand" oninput="buxo.autoExpand(this); buxo.updatePortaField(${p.id}, 'portaId', this.value)">${p.portaId || ''}</textarea>
                    </div>
                    <div class="porta-text-group">
                        <div class="porta-label">AP:</div>
                        <textarea class="porta-textarea-small porta-auto-expand" oninput="buxo.autoExpand(this); buxo.updatePortaField(${p.id}, 'previo', this.value)">${p.previo || ''}</textarea>
                    </div>
                    <div class="porta-text-group">
                        <div class="porta-label">QP:</div>
                        <textarea class="porta-textarea-small porta-auto-expand" oninput="buxo.autoExpand(this); buxo.updatePortaField(${p.id}, 'atual', this.value)">${p.atual || ''}</textarea>
                    </div>
                </div>

                <!-- COL 2: ATENDIDO POR -->
                <div class="porta-col-atendido">
                    <div class="porta-label">Atendido por:</div>
                    <textarea class="porta-textarea porta-auto-expand" oninput="buxo.autoExpand(this); buxo.updatePortaAtendido(${p.id}, this.value)">${p.portaAtendidoPor || ''}</textarea>
                </div>

                <!-- COL 3: CHECKLIST -->
                <div class="porta-col-checks">
                    ${mkCheck('aih', 'AIH')}
                    ${mkCheck('adenda', 'Adenda de internação')}
                    ${mkCheck('muc', 'Checar MUC família')}
                    ${mkCheck('prescricao', 'Prescrição')}
                    ${mkCheck('covid', 'Covid-19 / PVR')}
                    ${mkCheck('buxo', 'Buxo reta')}
                    ${mkCheck('passar', 'Passar caso reta')}
                </div>
                    <div class="porta-actions">
                        <button class="btn-internar-porta" onclick="buxo.internarPaciente(${p.id})" title="Vai Internar">🏥 Internar</button>
                        <button class="btn-delete-porta" onclick="buxo.deletePortaPatient(${p.id})" title="Excluir">🗑️</button>
                    </div>
             </div>
             `;
            })
            .join('');

        this.updateStatsUI();

        // Re-expand all textareas after render
        setTimeout(() => {
            document.querySelectorAll('.porta-auto-expand').forEach((el) => {
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
            });
        }, 10);
    }

    // Porta Helpers
    // Porta Helpers
    togglePortaCheck(id, key) {
        const p = this.portaPatients.find((x) => x.id === id);
        if (p) {
            if (!p.portaChecklist) p.portaChecklist = {};
            p.portaChecklist[key] = !p.portaChecklist[key];
            this.triggerAutoSave(id);
        }
    }

    updatePortaAtendido(id, val) {
        const p = this.portaPatients.find((x) => x.id === id);
        if (p) {
            p.portaAtendidoPor = val;
            this.triggerAutoSave(id);
        }
    }

    updatePortaField(id, field, val) {
        const p = this.portaPatients.find((x) => x.id === id);
        if (p) {
            p[field] = val;
            this.triggerAutoSave(id);
        }
    }

    deletePortaPatient(id) {
        if (!id) return;
        this.showConfirm('Tem certeza que deseja excluir este paciente da porta?', () => {
            try {
                this.portaPatients = this.portaPatients.filter((p) => p.id != id);
                this.saveData();
                this.renderPortaList();
            } catch (e) {
                console.error("Erro ao excluir da porta:", e);
                this.showAlert("Erro ao excluir paciente.");
            }
        });
    }

    internarPaciente(id) {
        // Blur active input to ensure latest data is saved
        if (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT')) {
            document.activeElement.blur();
        }

        const index = this.portaPatients.findIndex((p) => p.id === id);
        if (index === -1) return;

        const p = this.portaPatients.splice(index, 1)[0];

        // Ensure name is set (use portaId if name is empty)
        if (!p.name || p.name.trim() === '') {
            p.name = p.portaId || 'Paciente da Porta';
        }

        // Set status and clean up porta fields if needed
        p.statusDestino = 'internacao';
        p.leito = p.leito || ''; // Allow user to choose later

        this.patients.unshift(p);
        this.saveData();

        // Switch to retaguarda view
        this.currentView = 'retaguarda';
        const btnRet = document.getElementById('btnViewRetaguarda');
        const btnPorta = document.getElementById('btnViewPorta');
        if (btnRet && btnPorta) {
            btnRet.click(); // Trigger the click event to handle styles and rendering
        } else {
            this.renderList();
        }

        // Open cockpit for the new patient
        setTimeout(() => this.openCockpit(p.id), 200);
    }

    autoExpand(el) {
        if (!el || !el.scrollHeight) return;
        
        // Save current scroll within the container if it's the cockpit
        const container = el.closest('.cockpit-body') || el.closest('.cockpit-overlay') || window;
        const currentScrollPos = container === window ? window.scrollY : container.scrollTop;
        
        el.style.height = 'auto';
        el.style.height = (el.scrollHeight + 2) + 'px';
        
        // Restore scroll position
        if (container === window) {
            if (window.scrollY !== currentScrollPos) window.scrollTo(0, currentScrollPos);
        } else {
            container.scrollTop = currentScrollPos;
        }
    }

    // ===================================
    // POPUPS ALTA E TRANSFERÊNCIA (RETAGUARDA)
    // ===================================

    cleanupPopups() {
        const popups = document.querySelectorAll('.doc-popup-overlay');
        popups.forEach((p) => p.remove());
    }

    openAltaPopup(patientId) {
        this.cleanupPopups();

        const p = this.patients.find((x) => x.id === patientId);
        if (!p) return;

        const popupHTML = `
            <div class="doc-popup-overlay" id="docPopupOverlay">
                <div class="doc-popup">
                    <div class="doc-popup-header">
                        <h3>📄 Resumo de Alta (IA)</h3>
                        <button class="doc-popup-close" onclick="buxo.closeDocPopup()">✕</button>
                    </div>
                    <div class="doc-popup-body">
                        <div class="doc-popup-patient">
                            <strong>Paciente:</strong> ${p.name || 'Sem Nome'} (${p.age || '?'}a) - Leito ${p.leito || '?'}
                        </div>
                        <div class="doc-popup-field">
                            <label>Informações adicionais (não presentes no IPASS):</label>
                            <textarea id="popupInfoAdicional" class="doc-popup-textarea">${p.altaInfoAdicional || ''}</textarea>
                        </div>
                        <div class="doc-popup-field">
                            <label>Plano terapêutico pós-alta:</label>
                            <textarea id="popupPlano" class="doc-popup-textarea">${p.altaPlano || ''}</textarea>
                        </div>
                        
                        <!-- Prompt Editor -->
                        <details style="margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px;">
                            <summary style="cursor:pointer; color:#475569; font-weight:600; font-size:0.9rem;">📝 Editar Prompt (Avançado)</summary>
                            <p style="font-size:0.8rem; color:#64748b; margin:4px 0;">Edite o comando que será enviado para a IA. Clique em "Atualizar" para resetar com os dados acima.</p>
                            <textarea id="popupPrompt" class="doc-popup-textarea" style="min-height:200px; font-family:monospace; font-size:0.8rem; margin-bottom:10px;"></textarea>
                            <button class="doc-popup-btn-cancel" style="padding:4px 8px; font-size:0.8rem;" onclick="buxo.updateAltaPrompt(${patientId})">🔄 Atualizar Prompt com Dados Atuais</button>
                        </details>

                        <button class="doc-popup-btn-generate" onclick="buxo.generateAltaDocument(${patientId})">
                            🤖 Gerar Resumo
                        </button>
                        <div class="doc-popup-field">
                            <label>Resultado IA:</label>
                            <textarea id="popupResultado" class="doc-popup-textarea doc-popup-result">${p.resumoAlta || ''}</textarea>
                        </div>
                    </div>
                    <div class="doc-popup-footer">
                        <button class="doc-popup-btn-cancel" onclick="buxo.closeDocPopup()">Cancelar</button>
                        <button class="doc-popup-btn-save" onclick="buxo.saveDocPopup(${patientId}, 'alta')">Salvar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', popupHTML);
        // Initialize prompt
        setTimeout(() => this.updateAltaPrompt(patientId), 100);
    }

    openTransferenciaPopup(patientId) {
        this.cleanupPopups();

        const p = this.patients.find((x) => x.id === patientId);
        if (!p) return;

        const popupHTML = `
            <div class="doc-popup-overlay" id="docPopupOverlay">
                <div class="doc-popup">
                    <div class="doc-popup-header">
                        <h3>🔄 Adendo de Transferência (IA)</h3>
                        <button class="doc-popup-close" onclick="buxo.closeDocPopup()">✕</button>
                    </div>
                    <div class="doc-popup-body">
                        <div class="doc-popup-patient">
                            <strong>Paciente:</strong> ${p.name || 'Sem Nome'} (${p.age || '?'}a) - Leito ${p.leito || '?'}
                        </div>
                        <div class="doc-popup-field">
                            <label>Informações adicionais (não presentes no IPASS):</label>
                            <textarea id="popupInfoAdicional" class="doc-popup-textarea">${p.transfInfoAdicional || ''}</textarea>
                        </div>
                        <div class="doc-popup-field">
                            <label>Justificativa de transferência:</label>
                            <textarea id="popupJustificativa" class="doc-popup-textarea">${p.transfJustificativa || ''}</textarea>
                        </div>
                        
                        <!-- Prompt Editor -->
                        <details style="margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px;">
                            <summary style="cursor:pointer; color:#475569; font-weight:600; font-size:0.9rem;">📝 Editar Prompt (Avançado)</summary>
                            <p style="font-size:0.8rem; color:#64748b; margin:4px 0;">Edite o comando que será enviado para a IA. Clique em "Atualizar" para resetar com os dados acima.</p>
                            <textarea id="popupPrompt" class="doc-popup-textarea" style="min-height:200px; font-family:monospace; font-size:0.8rem; margin-bottom:10px;"></textarea>
                            <button class="doc-popup-btn-cancel" style="padding:4px 8px; font-size:0.8rem;" onclick="buxo.updateTransferenciaPrompt(${patientId})">🔄 Atualizar Prompt com Dados Atuais</button>
                        </details>

                        <button class="doc-popup-btn-generate" onclick="buxo.generateTransferenciaDocument(${patientId})">
                            🤖 Gerar Adendo
                        </button>
                        <div class="doc-popup-field">
                            <label>Adendo de Transferência:</label>
                            <textarea id="popupResultado" class="doc-popup-textarea doc-popup-result">${p.adendoTransferencia || ''}</textarea>
                        </div>
                    </div>
                    <div class="doc-popup-footer">
                        <button class="doc-popup-btn-cancel" onclick="buxo.closeDocPopup()">Cancelar</button>
                        <button class="doc-popup-btn-save" onclick="buxo.saveDocPopup(${patientId}, 'transferencia')">Salvar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', popupHTML);
        // Initialize prompt
        setTimeout(() => this.updateTransferenciaPrompt(patientId), 100);
    }

    closeDocPopup() {
        this.cleanupPopups();
    }

    saveDocPopup(patientId, type) {
        const p = this.patients.find((x) => x.id === patientId);
        if (!p) return;

        const resultado = document.getElementById('popupResultado')?.value || '';

        if (type === 'alta') {
            p.altaInfoAdicional = document.getElementById('popupInfoAdicional')?.value || '';
            p.altaPlano = document.getElementById('popupPlano')?.value || '';
            p.resumoAlta = resultado;
        } else {
            p.transfInfoAdicional = document.getElementById('popupInfoAdicional')?.value || '';
            p.transfJustificativa = document.getElementById('popupJustificativa')?.value || '';
            p.adendoTransferencia = resultado;
        }

        this.saveData();
        this.closeDocPopup();
    }

    // ===================================
    // GEMINI INTEGRATION
    // ===================================

    openConfig() {
        this.cleanupPopups();

        const currentKey = localStorage.getItem('buxo_gemini_key') || '';
        const modal = `
            <div class="doc-popup-overlay" id="configOverlay">
                <div class="doc-popup" style="max-height: 300px;">
                    <div class="doc-popup-header" style="background: linear-gradient(135deg, #475569, #1e293b);">
                        <h3>⚙️ Configuração IA (Gemini)</h3>
                        <button class="doc-popup-close" onclick="document.getElementById('configOverlay').remove()">✕</button>
                    </div>
                    <div class="doc-popup-body">
                        <label style="font-weight:600; font-size: 0.9rem;">Google Gemini API Key:</label>
                        <input type="password" id="inputGeminiKey" 
                               value="${currentKey}" 
                               placeholder="Cole sua chave API aqui (começa com AIza...)"
                               style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #cbd5e1; border-radius: 6px;">
                        <p style="font-size: 0.8rem; color: #64748b; margin-top: 8px;">
                            Sua chave fica salva apenas no seu navegador.
                        </p>
                    </div>
                    <div class="doc-popup-footer">
                        <button class="doc-popup-btn-save" onclick="buxo.saveConfig()">Salvar Configuração</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    saveConfig() {
        const key = document.getElementById('inputGeminiKey').value.trim();
        if (key) {
            localStorage.setItem('buxo_gemini_key', key);
            this.showAlert('API Key salva com sucesso!');
            document.getElementById('configOverlay').remove();
        } else {
            this.showAlert('Por favor, insira uma chave válida.');
        }
    }

    async callGemini(prompt, buttonId) {
        const apiKey = localStorage.getItem('buxo_gemini_key');
        if (!apiKey) {
            this.showAlert('API Key não configurada! Clique na engrenagem ⚙️ para configurar.');
            return null;
        }

        const btn = document.getElementById(buttonId || 'btn-generate-doc'); // fallback
        const originalText = btn ? btn.innerText : 'Gerar';
        if (btn) {
            btn.disabled = true;
            btn.innerText = '🤖 Gerando...';
        }

        const modelsToTry = [
            'gemini-3-flash-preview',
            'gemini-2.0-flash-exp',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
        ];
        let lastError = null;

        for (const model of modelsToTry) {
            try {
                // console.log(`Trying model: ${model}`); // Debug
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                        }),
                    }
                );

                const data = await response.json();

                if (data.error) {
                    // If model not found or other 404/400 error, try next
                    console.warn(`Model ${model} failed:`, data.error);
                    lastError = data.error.message;
                    continue;
                }

                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    // Success!
                    if (btn) {
                        btn.disabled = false;
                        btn.innerText = originalText;
                    }
                    return text;
                }
            } catch (e) {
                console.error(`Error with ${model}:`, e);
                lastError = e.message;
            }
        }

        // If all failed
        this.showAlert(`Erro na IA: Nenhum modelo disponível funcionou. Último erro: ${lastError}`);
        if (btn) {
            btn.disabled = false;
            btn.innerText = originalText;
        }
        return null;
    }

    // HELPERS FOR PROMPT GENERATION
    getAltaPrompt(p, infoAdicional, plano) {
        return `
Você é um médico pediatra experiente, especializado em elaboração de resumos de alta hospitalar pediátrica do Pronto Socorro (SCUT) completo e detalhado conforme as recomendações da Joint Commission. Com todos os tratamentes prescricao e exames realizados com todos os resultados.
Resuma de forma clara e objetiva
Sua única função é gerar um texto para alta que possa ser copiado e colado para que tanto médicos quanto pacientes entendam de forma clara. Escreva como o melhor médico do brasil escreveria. Ou seja tem que ser claro com termos médicos mas que as familias compreendam e com base nas informaç~es fornecidas sem mudar o contexto
- Para resumo de alta: exclusivamente com os seguintes quatro subtítulos, sempre nesta ordem, sem alterar, adicionar ou remover nenhum campo ou subtítulos. Inicie cada campo em nova linha, com o subtítulos destacado:

## **Outros diagnósticos/Problemas**

## **Sumário Clínico**

## **Plano terapêutico após a alta**

## **Exames**

# REGRAS OBRIGATÓRIAS:

NUNCA escreva informações fora dos subtítulos ou campos acima.

Se não houver informação relevante para algum campo, escreva “Sem alterações” ou “Não se aplica”.

Use somente os dados enviados do paciente. E escreva de forma clara e de fácil compreenção.

Caso alguma recomendação da Joint Commission não tenha campo próprio, encaixe no campo mais adequado, mas nunca crie título extra.

Inicie cada campo em nova linha, com o subtítulos destacado.

DADOS DO PACIENTE:
Nome: ${p.name || ''}, Idade: ${p.age || ''} anos
Comorbidades/Prévio: ${p.previo || 'Nenhum'}
Quadro Atual: ${p.atual || 'Não informado'}
Evolução/HPMA: ${p.hpma || 'Não informado'}
Exames (Labs/Imagem/Infeccioso): ${p.labs || '-'} / ${p.imagem || '-'} / ${p.infeccioso || '-'}
Antibióticos/Recebeu: ${p.recebeu || '-'}
Prescrição/MUC: ${p.prescricao || '-'} / ${p.muc || '-'}
Pendências: ${p.pendencias || '-'}
Plano Terapêutico/Info Adicional: ${plano} -- ${infoAdicional}
        `.trim();
    }

    getTransferenciaPrompt(p, infoAdicional, justificativa) {
        return `
Você é um médico pediatra experiente, especializado em elaboração de adendo de transferência pediátrica do Pronto Socorro (SCUT) completo e detalhado conforme as recomendações da Joint Commission. Com todos os tratamentes prescricao e exames realizados com todos os resultados.
Resuma de forma clara e objetiva
Sua única função é gerar um texto para resumo de transferência que possa ser copioado e colado para que tanto médicos quanto pacientes entendam de forma clara. Escreva como o melhor médico do brasil escreveria. Ou seje tem que ser claro com termos médicos mas que as familias compreendam e com base nas informaç~es fornecidas sem mudar o contexto

-- Para resumo/adendo de transferência: exclusivamente com os seguintes cinco subtítulos, sempre nesta ordem, sem alterar, adicionar ou remover nenhum campo ou título. Inicie cada campo em nova linha, com o subtítulos destacado:

## **Resumo Clínico**

## **Em seguimento com os seguintes DIAGNÓSTICOS/PROBLEMAS**

## **Justificativa para transferência**
Obs. na justificativa pode colocar o motivo pelo qual o paciente ainda precisa ficar internado

## **Conteúdo do diálogo com familiar sobre a tranferÊncia de unidade de internação**

## **Pendências**

# REGRAS OBRIGATÓRIAS:

NUNCA escreva informações fora dos subtítulos ou campos acima.

Use somente os dados enviados do paciente. E escreva de forma clara e de fácil compreenção.

Caso alguma recomendação da Joint Commission não tenha campo próprio, encaixe no campo mais adequado, mas nunca crie título extra.

Inicie cada campo em nova linha, com o subtítulos destacado.

DADOS DO PACIENTE:
Nome: ${p.name || ''}, Idade: ${p.age || ''} anos
Comorbidades/Prévio: ${p.previo || 'Nenhum'}
Quadro Atual: ${p.atual || 'Não informado'}
Evolução/HPMA: ${p.hpma || 'Não informado'}
Suporte: ${p.sv || '-'} / ${p.scatsObs || '-'}
Prescrição/MUC: ${p.prescricao || '-'} / ${p.muc || '-'}
Exames/Labs: ${p.labs || '-'}
Pendências: ${p.pendencias || '-'}
Justificativa/Info Adicional: ${justificativa} -- ${infoAdicional}
        `.trim();
    }

    updateAltaPrompt(patientId) {
        const p = this.patients.find((x) => x.id === patientId);
        if (!p) return;
        const infoAdicional = document.getElementById('popupInfoAdicional')?.value || '';
        const plano = document.getElementById('popupPlano')?.value || '';

        const prompt = this.getAltaPrompt(p, infoAdicional, plano);
        if (document.getElementById('popupPrompt')) {
            document.getElementById('popupPrompt').value = prompt;
        }
    }

    updateTransferenciaPrompt(patientId) {
        const p = this.patients.find((x) => x.id === patientId);
        if (!p) return;
        const infoAdicional = document.getElementById('popupInfoAdicional')?.value || '';
        const justificativa = document.getElementById('popupJustificativa')?.value || '';

        const prompt = this.getTransferenciaPrompt(p, infoAdicional, justificativa);
        if (document.getElementById('popupPrompt')) {
            document.getElementById('popupPrompt').value = prompt;
        }
    }

    async generateAltaDocument(patientId) {
        const p = this.patients.find((x) => x.id === patientId);
        if (!p) return;

        // Try to get from prompt textarea first
        let prompt = document.getElementById('popupPrompt')?.value;

        // If validation fails or empty, regenerate (though popup usually initializes it)
        if (!prompt || prompt.trim() === '') {
            const infoAdicional = document.getElementById('popupInfoAdicional')?.value || '';
            const plano = document.getElementById('popupPlano')?.value || '';
            prompt = this.getAltaPrompt(p, infoAdicional, plano);
        }

        const btn = document.querySelector('.doc-popup-btn-generate');
        if (btn) btn.id = 'genBtnAlta';

        const text = await this.callGemini(prompt, 'genBtnAlta');
        if (text) {
            document.getElementById('popupResultado').value = text;
        }
    }

    async generateTransferenciaDocument(patientId) {
        const p = this.patients.find((x) => x.id === patientId);
        if (!p) return;

        // Try to get from prompt textarea first
        let prompt = document.getElementById('popupPrompt')?.value;

        if (!prompt || prompt.trim() === '') {
            const infoAdicional = document.getElementById('popupInfoAdicional')?.value || '';
            const justificativa = document.getElementById('popupJustificativa')?.value || '';
            prompt = this.getTransferenciaPrompt(p, infoAdicional, justificativa);
        }

        const btn = document.querySelector('.doc-popup-btn-generate');
        if (btn) btn.id = 'genBtnTransf';

        const text = await this.callGemini(prompt, 'genBtnTransf');
        if (text) {
            document.getElementById('popupResultado').value = text;
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderList();
    }

    updateStats() {
        // Just triggers re-render of list which handles UI updates
        this.renderList();
    }

    updateStatsUI() {
        const container = document.querySelector('.stats-bar');
        if (!container) return;

        // Use correct list based on current view
        const list = this.currentView === 'porta' ? this.portaPatients : this.patients;
        const total = list.length;

        // In Porta view, show only total
        if (this.currentView === 'porta') {
            container.innerHTML = `<div class="stat-item active">Total: <strong>${total}</strong></div>`;
            return;
        }

        // Retaguarda: show all stats
        const unstable = list.filter((p) => p.gravity === 'unstable').length;
        const alert = list.filter((p) => p.gravity === 'alert').length;
        const alta = list.filter((p) => p.statusDestino === 'alta').length;
        const internar = list.filter((p) => p.statusDestino === 'internacao').length;

        const mkStat = (id, label, count, colorClass) => `
            <div class="stat-item ${this.currentFilter === id ? 'active' : ''} ${colorClass || ''}" 
                 onclick="buxo.setFilter('${id}')">
                 ${label}: <strong>${count}</strong>
            </div>
        `;

        container.innerHTML = `
            ${mkStat('total', 'Total', total)}
            ${mkStat('unstable', 'Instável', unstable, 'risk-high')}
            ${mkStat('alert', 'Alerta', alert, 'risk-med')}
            ${mkStat('alta', 'Alta', alta, 'status-good')}
            ${mkStat('internar', 'Vai Internar', internar, 'status-wait')}
        `;
    }

    // (ToggleBoolean remains same)

    toggleBoolean(id, field) {
        const p = this.patients.find((x) => x.id === id);
        if (p) {
            p[field] = !p[field];
            this.triggerAutoSave(id);
            this.renderList(); // Re-render to update UI immediately
        }
    }

    getStatusLabel(s) {
        const map = { alta: '✅ Alta', aguarda: '⏳ Aguarda Vaga', cedida: '🤝 Vaga Cedida' };
        return map[s] || s;
    }

    // ===================================
    // THE COCKPIT (100vh FIXED VIEW)
    // ===================================

    calculateCaloricWeight(val) {
        const P = parseFloat(val);
        if (isNaN(P)) return 'N/A';

        let result = 0;
        if (P <= 10) {
            result = P;
        } else if (P <= 20) {
            result = 10 + 0.5 * (P - 10);
        } else {
            result = 15 + 0.2 * (P - 20);
        }
        return result.toFixed(1).replace('.', ',') + ' kg';
    }

    openCockpit(id, force = false) {
        const p = this.patients.find((x) => x.id === id);
        if (!p) return;

        const overlay = document.getElementById('cockpitOverlay');
        const isActive = overlay.classList.contains('active');

        // Prevent re-rendering and focus loss if already open for this patient
        if (isActive && this.currentId === id && !force) {
            this.updateHeader(id);
            return;
        }

        this.currentId = id;

        const header = document.getElementById('chHeaderInfo');
        const body = document.getElementById('cockpitBody');

        this.updateHeader(id); // Use helper to render header

        // Render Systems checkboxes state
        const isSystemsVisible = p.gravity === 'alert' || p.gravity === 'unstable';
        const systemsCheckboxes = `
            <div class="systems-check" style="display: ${isSystemsVisible ? 'flex' : 'none'}; gap: 10px; margin-top: 5px;">
                <label class="compact-check"><input type="checkbox" data-system="resp" ${p.systems && p.systems.includes('resp') ? 'checked' : ''}> Resp</label>
                <label class="compact-check"><input type="checkbox" data-system="circ" ${p.systems && p.systems.includes('circ') ? 'checked' : ''}> Circ</label>
                <label class="compact-check"><input type="checkbox" data-system="neuro" ${p.systems && p.systems.includes('neuro') ? 'checked' : ''}> Neuro</label>
            </div>
        `;

        // THE 3-COLUMN LAYOUT (FIXED HEIGHT)
        body.innerHTML = `
            <!-- COL 1 -->
            <div class="cockpit-col">
                <div class="c-section">
                    <div class="c-title">IDENTIFICAÇÃO</div>
                    <div class="form-group-row">
                        <div class="input-wrapper">
                            <label class="compact-label">Nome Completo</label>
                            <input class="c-input" value="${p.name || ''}" data-field="name" id="inputName_${id}">
                        </div>
                    </div>
                    <div class="form-group-row three-col">
                         <div class="input-wrapper">
                            <label class="compact-label">Idade</label>
                            <input class="c-input" value="${p.age || ''}" data-field="age" id="inputAge_${id}">
                        </div>
                        <div class="input-wrapper">
                            <label class="compact-label">RGHC</label>
                            <input class="c-input" value="${p.rghc || ''}" data-field="rghc" id="inputRghc_${id}">
                        </div>
                         <div class="input-wrapper">
                            <label class="compact-label">Leito</label>
                            ${this.buildLeitoSelectHtml(id, p.leito)}
                            <div class="leito-conflict-warning" id="leitoConflict_${id}" style="display:none; font-size:0.7rem; color:#b91c1c; margin-top:2px;"></div>
                        </div>
                    </div>
                     <div class="form-group-row two-col mt-xs">
                        <div class="input-wrapper">
                            <label class="compact-label">Peso (kg)</label>
                            <input class="c-input" type="number" step="0.1" value="${p.weight || ''}" data-field="weight" id="inputWeight_${id}">
                        </div>
                         <div class="input-wrapper">
                            <label class="compact-label">Peso Calórico (PC)</label>
                            <div class="c-input calc-display" id="displayCaloric_${id}">
                                ${this.calculateCaloricWeight(p.weight)}
                            </div>
                        </div>
                    </div>
                    <div class="input-wrapper mt-xs">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <label class="compact-label" style="margin:0;">Alergias?</label>
                            <div style="display:flex; gap:10px;">
                                <label class="compact-check"><input type="radio" name="hasAllergy_${id}" value="yes" ${p.hasAllergy === true ? 'checked' : ''}> Sim</label>
                                <label class="compact-check"><input type="radio" name="hasAllergy_${id}" value="no" ${p.hasAllergy !== true ? 'checked' : ''}> Não</label>
                            </div>
                        </div>
                        <div id="wrapperAlergia_${id}" style="display: ${p.hasAllergy === true ? 'block' : 'none'};">
                            <input class="c-input" value="${p.alergia || ''}" data-field="alergia" placeholder="Qual alergia?" style="border-color: #fca5a5; color: #b91c1c;">
                        </div>
                    </div>
                    
                    <!-- ISOLAMENTO -->
                    <div class="isolation-section mt-sm" style="background: #fef3c7; padding: 8px; border-radius: 4px; border: 1px solid #f59e0b;">
                        <div class="c-title" style="color: #92400e; margin-bottom: 4px;">🔒 ISOLAMENTO</div>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <label class="compact-check">
                                <input type="checkbox" data-isolation="contato" ${Array.isArray(p.isolamento) && p.isolamento.includes('contato') ? 'checked' : ''}> Contato
                            </label>
                            <label class="compact-check">
                                <input type="checkbox" data-isolation="goticula" ${Array.isArray(p.isolamento) && p.isolamento.includes('goticula') ? 'checked' : ''}> Gotícula
                            </label>
                            <label class="compact-check">
                                <input type="checkbox" data-isolation="aerossol" ${Array.isArray(p.isolamento) && p.isolamento.includes('aerossol') ? 'checked' : ''}> Aerossol
                            </label>
                            <label class="compact-check">
                                <input type="checkbox" data-isolation="reverso" ${Array.isArray(p.isolamento) && p.isolamento.includes('reverso') ? 'checked' : ''}> Reverso
                            </label>
                        </div>
                        <div style="margin-top: 6px;">
                             <input class="c-input" value="${p.isolamentoObs || ''}" data-field="isolamentoObs" placeholder="Detalhes do isolamento..." style="background: rgba(255,255,255,0.7); border-color: #fcd34d; font-size:0.8rem;">
                        </div>
                    </div>
                    
                    <!-- DIAG COMPARTILHADO -->
                    <div style="margin-top: 8px;">
                        <label class="compact-check">
                            <input type="checkbox" data-field="sharedDiagnosis" ${p.sharedDiagnosis ? 'checked' : ''}> 👪 Diag. Compartilhado?
                        </label>
                    </div>
                    
                    <!-- GRAVITY SECTION -->
                    <div class="gravity-section mt-sm" style="background: #f8fafc; padding: 6px; border-radius: 4px; border: 1px solid #e2e8f0;">
                        <div class="status-pill-group">
                             <div class="status-pill ${p.gravity === 'stable' ? 'active' : ''}" onclick="buxo.updateStatus(${id}, 'gravity', 'stable')">Estável</div>
                             <div class="status-pill ${p.gravity === 'alert' ? 'active risk' : ''}" onclick="buxo.updateStatus(${id}, 'gravity', 'alert')">Alerta</div>
                             <div class="status-pill ${p.gravity === 'unstable' ? 'active risk' : ''}" onclick="buxo.updateStatus(${id}, 'gravity', 'unstable')">Instável</div>
                        </div>
                        ${systemsCheckboxes}
                    </div>
                </div>

                <div class="c-section flex-grow">
                    <div class="c-title">PRÉVIO</div>
                    <textarea class="c-textarea auto-expand" data-field="previo">${p.previo || ''}</textarea>
                </div>

                <div class="c-section flex-grow">
                    <div class="c-title">ATUAL</div>
                    <textarea class="c-textarea auto-expand" data-field="atual">${p.atual || ''}</textarea>
                </div>
            </div>

            <!-- COL 2 -->
            <div class="cockpit-col">
                <div class="c-section" style="border-top: 4px solid var(--primary-blue);">
                    <div class="c-title">HPMA (EVOLUÇÃO)</div>
                    <textarea class="c-textarea auto-expand" data-field="hpma" style="font-size: 0.95rem;">${p.hpma || ''}</textarea>
                </div>

                <div class="c-section flex-grow">
                    <div class="c-title">LABORATÓRIO</div>
                    <textarea class="c-textarea auto-expand" data-field="labs">${p.labs || ''}</textarea>
                </div>

                 <div class="c-section flex-grow">
                     <div class="row-2 h-100">
                        <div class="flex-col h-100">
                             <div class="c-title">IMAGEM</div>
                             <textarea class="c-textarea auto-expand" data-field="imagem">${p.imagem || ''}</textarea>
                        </div>
                        <div class="flex-col h-100">
                             <div class="c-title">INFECCIOSO</div>
                             <textarea class="c-textarea auto-expand" data-field="infeccioso">${p.infeccioso || ''}</textarea>
                        </div>
                    </div>
                </div>
                
                 <div class="c-section">
                    <div class="c-title">SUPORTE & DISPOSITIVOS</div>
                    <div class="row-2">
                        <div class="input-wrapper">
                             <label class="compact-label">Tipo de Suporte Ventilatório</label>
                             <input class="c-input" value="${p.sv || ''}" data-field="sv" placeholder="Ex: CNA, VNI...">
                        </div>
                         <div class="input-wrapper">
                             <label class="compact-label">Tipo Acesso e Dispositivos</label>
                             <input class="c-input" value="${p.scatsObs || ''}" data-field="scatsObs" placeholder="Ex: PICC, SNG...">
                        </div>
                    </div>
                 </div>
            </div>

            <!-- COL 3 -->
            <div class="cockpit-col">
                <div class="c-section flex-grow">
                    <div class="c-title">PRESCRIÇÃO (ATUAL)</div>
                     <div class="input-wrapper mb-xs">
                        <label class="compact-label">Dieta</label>
                        <input class="c-input" value="${p.dieta || ''}" data-field="dieta">
                    </div>
                    <textarea class="c-textarea auto-expand" data-field="prescricao">${p.prescricao || ''}</textarea>
                </div>

                <div class="c-section flex-grow">
                    <div class="c-title">Medicações de Uso Contínuo</div>
                    <textarea class="c-textarea auto-expand" data-field="muc">${p.muc || ''}</textarea>
                </div>

                <div class="c-section">
                    <div class="c-title">RECEBEU (JÁ REALIZADO)</div>
                    <textarea class="c-textarea auto-expand" data-field="recebeu">${p.recebeu || ''}</textarea>
                </div>

                <div class="c-section" style="border: 2px solid var(--warning-amber);">
                    <div class="c-title" style="color: #b45309;">⚠️ PENDÊNCIAS</div>
                    <textarea class="c-textarea auto-expand" data-field="pendencias">${p.pendencias || ''}</textarea>
                </div>

                <!-- DESTINATION / STATUS SECTION -->
                <div class="c-section">
                    <div class="c-title">DESTINO / STATUS</div>
                    <div class="input-wrapper">
                        <select class="c-input" data-field="statusDestino" id="statusDestino_${id}">
                            <option value="">Em Acompanhamento</option>
                            <option value="alta" ${p.statusDestino === 'alta' ? 'selected' : ''}>✅ Alta</option>
                            <option value="aguarda" ${p.statusDestino === 'aguarda' ? 'selected' : ''}>⏳ Aguarda Vaga</option>
                            <option value="internacao" ${p.statusDestino === 'internacao' ? 'selected' : ''}>🏥 Vai Internar</option>
                            <option value="cedida" ${p.statusDestino === 'cedida' ? 'selected' : ''}>🤝 Vaga Cedida</option>
                        </select>
                    </div>

                    <!-- Aguarda Vaga Fields (Radios + Text) -->
                    <div id="wrapperAguarda_${id}" style="display: ${p.statusDestino === 'aguarda' ? 'block' : 'none'}; margin-top: 8px; background: #f0f9ff; padding: 6px; border-radius: 4px;">
                        <div style="display: flex; gap: 8px; margin-bottom: 4px;">
                            <label class="compact-check"><input type="radio" name="aguardaTipo_${id}" value="transf" ${p.aguardaTipo === 'transf' ? 'checked' : ''}> Transf.</label>
                            <label class="compact-check"><input type="radio" name="aguardaTipo_${id}" value="internacao" ${p.aguardaTipo === 'internacao' ? 'checked' : ''}> Intern.</label>
                            <label class="compact-check"><input type="radio" name="aguardaTipo_${id}" value="uti" ${p.aguardaTipo === 'uti' ? 'checked' : ''}> UTI</label>
                        </div>
                        <textarea class="c-textarea auto-expand" data-field="destinoDetalhes" placeholder="Detalhes da vaga..." style="min-height: 40px;">${p.destinoDetalhes || ''}</textarea>
                    </div>

                    <!-- Vai Internar Fields (Text Only) -->
                     <div id="wrapperInternacao_${id}" style="display: ${p.statusDestino === 'internacao' ? 'block' : 'none'}; margin-top: 8px; background: #fff7ed; padding: 6px; border-radius: 4px;">
                         <textarea class="c-textarea auto-expand" data-field="destinoDetalhes" placeholder="Detalhes da internação..." style="min-height: 40px;">${p.destinoDetalhes || ''}</textarea>
                    </div>

                    <!-- Cedida Fields -->
                    <div id="wrapperCedida_${id}" style="display: ${p.statusDestino === 'cedida' ? 'block' : 'none'}; margin-top: 8px; background: #fdf2f8; padding: 6px; border-radius: 4px;">
                         <textarea class="c-textarea auto-expand" data-field="destinoDetalhes" placeholder="Para onde/quem foi cedida?" style="min-height: 40px;">${p.destinoDetalhes || ''}</textarea>
                    </div>
                </div>

                <div class="c-section">
                    <div class="c-title">ESPECIALIDADES</div>
                    <input class="c-input" value="${p.especialidades || ''}" data-field="especialidades" placeholder="Ex: NEFRO, ONCO...">
                    <button class="btn btn-danger mt-sm" style="width:100%; font-size:0.75rem; padding: 10px; border-radius: 6px;" onclick="buxo.deletePatient(${id})">⚠️ Excluir Paciente Permanentemente</button>
                </div>
            </div>
        `;

        // Activate Overlay
        overlay.classList.add('active');
        this.attachInputs(id);
        this.refreshLeitoConflict(id);

        // Initial Auto-Expand
        setTimeout(() => this.resizeAllTextareas(), 10);
    }

    // NEW: Separated Header Update
    updateHeader(id) {
        const p = this.patients.find((x) => x.id === id);
        if (!p) return;

        const header = document.getElementById('chHeaderInfo');
        const pc = this.calculateCaloricWeight(p.weight);

        header.innerHTML = `
            <div class="ch-name">${p.name || 'Sem Nome'}</div>
            <div class="ch-meta">
                <span><strong>Idade:</strong> ${p.age || '-'}</span>
                <span><strong>RGHC:</strong> ${p.rghc || '-'}</span>
                <span><strong>Peso:</strong> ${p.weight || '-'}kg</span>
                <span class="highlight-pc" id="headerPC_${id}">PC: ${pc}</span>
            </div>
            <span class="ch-badge badge-${p.gravity}">${this.getGravityLabel(p.gravity)}</span>
        `;
    }

    closeCockpit() {
        document.getElementById('cockpitOverlay').classList.remove('active');
        this.currentId = null;
    }

    attachInputs(id) {
        const body = document.getElementById('cockpitBody');

        // Auto-expand independent listener (per character)
        body.querySelectorAll('textarea').forEach((el) => {
            el.addEventListener('input', (e) => {
                this.autoExpand(e.target);
            });
        });

        // Text/Input/Select listeners
        body.querySelectorAll(
            'input:not([type="checkbox"]):not([type="radio"]), textarea, select'
        ).forEach((el) => {
            el.addEventListener('input', (e) => {
                const field = e.target.dataset.field;
                const val = e.target.value;
                this.updatePatientData(id, field, val);
            });

            // Fallback para select e outros casos que dependem de 'change'
            if (el.tagName === 'SELECT') {
                el.addEventListener('change', (e) => {
                    const field = e.target.dataset.field;
                    const val = e.target.value;
                    
                    if (field === 'leito') {
                        this.refreshLeitoConflict(id);
                    }
                    
                    if (field === 'statusDestino') {
                        const wrapAguarda = document.getElementById(`wrapperAguarda_${id}`);
                        const wrapInternacao = document.getElementById(`wrapperInternacao_${id}`);
                        const wrapCedida = document.getElementById(`wrapperCedida_${id}`);

                        if (wrapAguarda)
                            wrapAguarda.style.display = val === 'aguarda' ? 'block' : 'none';
                        if (wrapInternacao)
                            wrapInternacao.style.display = val === 'internacao' ? 'block' : 'none';
                        if (wrapCedida) wrapCedida.style.display = val === 'cedida' ? 'block' : 'none';

                        if (val === 'alta') {
                            this.openAltaPopup(id);
                        } else if (val === 'cedida') {
                            this.openTransferenciaPopup(id);
                        }
                        this.renderList();
                    }
                });
            }
        });

        // Alergia Toggle Listener
        body.querySelectorAll(`input[name="hasAllergy_${id}"]`).forEach((el) => {
            el.addEventListener('change', (e) => {
                const isYes = e.target.value === 'yes';
                this.updatePatientData(id, 'hasAllergy', isYes);

                const wrap = document.getElementById(`wrapperAlergia_${id}`);
                if (wrap) {
                    wrap.style.display = isYes ? 'block' : 'none';
                    if (isYes) {
                        // Focus input
                        const input = wrap.querySelector('input');
                        if (input) input.focus();
                    }
                }
                this.renderList();
            });
        });

        // Radio Listeners (Aguarda Type)
        body.querySelectorAll(`input[name="aguardaTipo_${id}"]`).forEach((el) => {
            el.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.updatePatientData(id, 'aguardaTipo', e.target.value);
                }
            });
        });

        // Checkboxes listeners (General & System)
        body.querySelectorAll('input[type="checkbox"]').forEach((el) => {
            el.addEventListener('change', (e) => {
                const field = e.target.dataset.field;
                const system = e.target.dataset.system; // For systems

                const checked = e.target.checked;
                const p = this.patients.find((x) => x.id === id);
                if (p) {
                    if (field) {
                        // Regular booleans (nightEvolution, sharedDiagnosis)
                        p[field] = checked;
                    } else if (system) {
                        // Systems logic
                        if (!p.systems) p.systems = [];
                        if (checked && !p.systems.includes(system)) p.systems.push(system);
                        if (!checked) p.systems = p.systems.filter((s) => s !== system);
                    }
                    this.triggerAutoSave(id);
                    this.renderList();
                }
            });
        });

        // Isolation checkboxes listener
        body.querySelectorAll('input[data-isolation]').forEach((el) => {
            el.addEventListener('change', (e) => {
                const isolation = e.target.dataset.isolation;
                const checked = e.target.checked;
                const p = this.patients.find((x) => x.id === id);
                if (p) {
                    if (!Array.isArray(p.isolamento)) p.isolamento = [];
                    if (checked && !p.isolamento.includes(isolation)) {
                        p.isolamento.push(isolation);
                    }
                    if (!checked) {
                        p.isolamento = p.isolamento.filter((i) => i !== isolation);
                    }
                    this.triggerAutoSave(id);
                    this.renderList();
                }
            });
        });
    }


    resizeAllTextareas() {
        const body = document.getElementById('cockpitBody');
        body.querySelectorAll('textarea').forEach((el) => {
            this.autoExpand(el);
        });
    }

    updatePatientData(id, field, val) {
        const p = this.patients.find((x) => x.id === id);
        if (p) {
            p[field] = val;
            
            // Only update non-layout shifting things immediately
            if (field === 'weight') {
                const pcString = this.calculateCaloricWeight(val);
                const disp = document.getElementById(`displayCaloric_${id}`);
                if (disp) disp.textContent = pcString;
            }

            this.triggerAutoSave(id);
        }
    }

    updateStatus(id, field, value) {
        const p = this.patients.find((x) => x.id === id);
        if (p) {
            p[field] = value;

            // Logic for Systems visibility
            if (field === 'gravity') {
                // Refresh cockpit to show/hide systems
            }

            this.triggerAutoSave(id);
            this.renderList();
            this.openCockpit(id, true); // Force re-render as status changed
        }
    }

    deletePatient(id) {
        if (!id) return;
        this.showConfirm('Tem certeza que deseja excluir permanentemente este paciente?', () => {
            try {
                this.patients = this.patients.filter((p) => p.id != id);
                this.saveData();
                this.renderList();
                this.closeCockpit();
            } catch (e) {
                console.error("Erro ao excluir paciente:", e);
                this.showAlert("Erro ao excluir paciente.");
            }
        });
    }

    // ===================================
    // UTILS
    // ===================================

    showConfirm(message, callback) {
        // Create an overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0'; overlay.style.left = '0';
        overlay.style.width = '100vw'; overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '999999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';

        const box = document.createElement('div');
        box.style.background = '#fff';
        box.style.padding = '24px';
        box.style.borderRadius = '8px';
        box.style.maxWidth = '400px';
        box.style.textAlign = 'center';
        box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';

        const msg = document.createElement('p');
        msg.textContent = message;
        msg.style.marginBottom = '20px';
        msg.style.fontSize = '16px';
        
        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.gap = '12px';
        btnRow.style.justifyContent = 'center';

        const btnCancel = document.createElement('button');
        btnCancel.textContent = 'Cancelar';
        btnCancel.className = 'btn btn-secondary';
        btnCancel.onclick = () => document.body.removeChild(overlay);

        const btnOk = document.createElement('button');
        btnOk.textContent = 'Confirmar';
        btnOk.className = 'btn btn-danger';
        btnOk.onclick = () => {
            document.body.removeChild(overlay);
            callback();
        };

        btnRow.appendChild(btnCancel);
        btnRow.appendChild(btnOk);
        box.appendChild(msg);
        box.appendChild(btnRow);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    showAlert(message) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0'; overlay.style.left = '0';
        overlay.style.width = '100vw'; overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '999999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';

        const box = document.createElement('div');
        box.style.background = '#fff';
        box.style.padding = '24px';
        box.style.borderRadius = '8px';
        box.style.maxWidth = '400px';
        box.style.textAlign = 'center';
        box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';

        const msg = document.createElement('p');
        msg.textContent = message;
        msg.style.marginBottom = '20px';
        msg.style.fontSize = '16px';
        
        const btnOk = document.createElement('button');
        btnOk.textContent = 'OK';
        btnOk.className = 'btn btn-primary';
        btnOk.onclick = () => {
            document.body.removeChild(overlay);
        };

        box.appendChild(msg);
        box.appendChild(btnOk);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    createNewPatient() {
        const newP = {
            id: Date.now(),
            name: this.currentView === 'porta' ? '' : 'Novo Paciente',
            // ... fields ...
            rghc: '',
            age: '',
            dih: '',
            weight: '',
            status: 'active',
            gravity: 'stable',
            previo: '',
            atual: '',
            hpma: '',
            labs: '',
            imagem: '',
            infeccioso: '',
            prescricao: '',
            muc: '',
            pendencias: '',
            alergia: '',
            recebeu: '',
            precaucao: '',
            sv: '',
            scatsObs: '',
            systems: [],
        };

        if (this.currentView === 'porta') {
            // Porta Logic
            // Empty fields for inline editing
            newP.name = '';
            newP.portaAtendidoPor = '';
            newP.portaChecklist = {};
            this.portaPatients.unshift(newP);
            this.saveData();
            this.renderPortaList();
            // No cockpit for Porta
        } else {
            // Retaguarda Logic
            this.patients.unshift(newP);
            this.saveData();
            this.openCockpit(newP.id);
        }
    }

    // Removed duplicate updateStats

    setupEvents() {
        const btnNew = document.getElementById('btnNewPatient');
        if (btnNew) {
            btnNew.addEventListener('click', () => this.createNewPatient());
        }

        const btnExport = document.getElementById('btnExport');
        if (btnExport)
            btnExport.addEventListener('click', () => this.showAlert('Função de exportar em breve.'));

        // View Toggles
        const btnRet = document.getElementById('btnViewRetaguarda');
        const btnPorta = document.getElementById('btnViewPorta');

        if (btnRet && btnPorta) {
            btnRet.addEventListener('click', () => {
                this.currentView = 'retaguarda';
                btnRet.classList.add('active');
                btnRet.style.background = 'white';
                btnRet.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';

                btnPorta.classList.remove('active');
                btnPorta.style.background = 'transparent';
                btnPorta.style.boxShadow = 'none';

                this.renderList();
            });

            btnPorta.addEventListener('click', () => {
                this.currentView = 'porta';
                btnPorta.classList.add('active');
                btnPorta.style.background = 'white';
                btnPorta.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';

                btnRet.classList.remove('active');
                btnRet.style.background = 'transparent';
                btnRet.style.boxShadow = 'none';

                this.renderList();
            });
        }

        // O mapa interativo agora vive em mapa-retaguarda.html (link no header).
        // Aqui não há mais sub-toggle Lista/Mapa nem botão de leito extra.

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase().trim();
                this.renderList();
            });
        }

        // Keyboard Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeCockpit();
        });
    }

    getGravityLabel(g) {
        const map = { stable: 'Estável', alert: 'Alerta', unstable: 'Instável' };
        return map[g] || g;
    }

    /**
     * Retorna todos os leitos canônicos agrupados por área para popular o <select>.
     * Inclui leitos extras criados pelo usuário.
     * @returns {Array<{group:string, options:Array<{value:string,label:string}>}>}
     */
    getAllLeitoOptions() {
        const groups = [
            {
                group: 'Leitos',
                options: this.leitosFixos
                    .filter((l) => l.label.startsWith('Leito '))
                    .sort(
                        (a, b) =>
                            parseInt(a.label.replace('Leito ', '')) -
                            parseInt(b.label.replace('Leito ', ''))
                    )
                    .map((l) => ({ value: l.label, label: l.label })),
            },
            {
                group: 'Isolamento',
                options: this.leitosFixos
                    .filter((l) => l.label.startsWith('Iso '))
                    .map((l) => ({ value: l.label, label: l.label })),
            },
            {
                group: 'Áreas',
                options: this.salasEspeciais.map((s) => ({ value: s.label, label: s.label })),
            },
            {
                group: 'Consultórios (Porta)',
                options: this.leitosPorta.map((c) => ({ value: c.label, label: c.label })),
            },
        ];
        // Leitos extras (criados no mapa-retaguarda.html) também entram no dropdown.
        const extras = this.loadData('buxo_leitos_extras') || [];
        if (extras.length > 0) {
            groups.push({
                group: 'Extras',
                options: extras.map((e) => ({ value: e.label, label: e.label })),
            });
        }
        return groups;
    }

    /**
     * Monta o HTML do <select> de leito para o cockpit do paciente `id`,
     * com valor atual `current` pré-selecionado.
     * @param {number} id
     * @param {string} current
     * @returns {string}
     */
    buildLeitoSelectHtml(id, current) {
        const groups = this.getAllLeitoOptions();
        const allValues = new Set(groups.flatMap((g) => g.options.map((o) => o.value)));
        const currentVal = (current || '').trim();
        // Se valor atual não existe no schema canônico, exibe opção "legacy" para não perder dado
        const legacyOption =
            currentVal && !allValues.has(currentVal)
                ? `<option value="${currentVal}" selected>${currentVal} (não-canônico)</option>`
                : '';
        const opts = groups
            .map((g) => {
                const inner = g.options
                    .map(
                        (o) =>
                            `<option value="${o.value}" ${o.value === currentVal ? 'selected' : ''}>${o.label}</option>`
                    )
                    .join('');
                return `<optgroup label="${g.group}">${inner}</optgroup>`;
            })
            .join('');
        return `<select class="c-input" data-field="leito" data-leito-select="${id}">
            <option value="" ${!currentVal ? 'selected' : ''}>— sem leito —</option>
            ${legacyOption}
            ${opts}
        </select>`;
    }

    /**
     * Atualiza o aviso "Leito X já tem paciente Y" abaixo do select.
     * Não bloqueia: alguns cenários clínicos (compartilhamento, transição) justificam dois pacientes no mesmo leito.
     * @param {number} id
     */
    refreshLeitoConflict(id) {
        const warn = document.getElementById(`leitoConflict_${id}`);
        if (!warn) return;
        const p = this.patients.find((x) => x.id === id);
        if (!p || !p.leito) {
            warn.style.display = 'none';
            warn.textContent = '';
            return;
        }
        const others = this.patients.filter(
            (x) =>
                x.id !== id &&
                (x.leito || '').trim() === p.leito.trim() &&
                x.statusDestino !== 'alta'
        );
        if (others.length === 0) {
            warn.style.display = 'none';
            warn.textContent = '';
            return;
        }
        const names = others.map((o) => o.name || 'sem nome').join(', ');
        warn.style.display = 'block';
        warn.textContent = `⚠️ ${p.leito} já em uso por: ${names}`;
    }
}

// Init
window.buxo = new BuxoSystem();
