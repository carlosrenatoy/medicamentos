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
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span id="saveStatus" style="font-size: 0.75rem; color: var(--success-green);">✓ Salvo</span>
                        <button class="btn-new" id="btnNewPatient" onclick="buxo.openNewPatientModal()">+ Novo Paciente</button>
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
            const stored = JSON.parse(localStorage.getItem(key));
            if (stored && Array.isArray(stored)) {
                return stored;
            }
            // Sample data only for retaguarda if empty
            if (key === 'buxo_patients_final') return this.getSamplePatients();
            return [];
        } catch (e) {
            console.error('Error loading data', e);
            return [];
        }
    }

    getSamplePatients() {
        return [
            {
                id: 1001,
                name: 'João Pedro Silva',
                leito: 'Leito 7',
                age: '8',
                rghc: '12345678',
                dih: '05/02',
                weight: '25',
                alergia: 'Penicilina',
                gravity: 'unstable',
                systems: ['resp', 'circ'],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'Asma moderada, rinite alérgica. Uso de Budesonida 200mcg 12/12h',
                atual: 'Bronquiolite viral aguda com desconforto respiratório moderado. Saturando 92% em ar ambiente. Taquipneia (FR 45). Tiragem subcostal.',
                hpma: 'Iniciou quadro há 3 dias com coriza e tosse seca. Evoluiu com piora progressiva do desconforto respiratório. Mãe refere que não está aceitando bem a dieta. Sem febre.',
                labs: 'Hb 12.5 | Ht 38 | Leuco 8.500 (S65 L30) | Plaq 245.000 | PCR 15 | VHS 25',
                imagem: 'Rx tórax: hiperinsuflação pulmonar bilateral, sem consolidações',
                infeccioso: 'VSR positivo. Precaução de contato',
                prescricao:
                    'CNA 2L/min, SF 0.9% 100ml EV 8/8h, Salbutamol 2.5mg NBZ 4/4h, Prednisolona 1mg/kg/dia VO',
                muc: 'Budesonida 200mcg 12/12h (suspenso durante internação)',
                dieta: 'Dieta branda para idade, fracionada',
                pendencias:
                    'Reavaliação respiratória às 18h. Se manutenção de desconforto, escalonar para CNAF',
                recebeu: 'Nebulização com Salbutamol às 14h - melhora parcial',
                statusDestino: '',
                especialidades: 'PNEUMO',
                sv: 'CNA 2L/min',
                scatsObs: 'Jelco 24G em MSE',
            },
            {
                id: 1002,
                name: 'Maria Clara Santos',
                leito: 'Iso 16',
                age: '4',
                rghc: '87654321',
                dih: '03/02',
                weight: '16',
                alergia: 'Dipirona',
                gravity: 'alert',
                systems: ['neuro'],
                nightEvolution: false,
                sharedDiagnosis: false,
                previo: 'Hígida. DNPM adequado.',
                atual: 'Meningite bacteriana em tratamento. D5 de Ceftriaxona. Afebril há 48h. Fontanela normotensa.',
                hpma: 'Admitida com febre alta (39.5°C), vômitos e rigidez de nuca. LCR com pleocitose (1200 cel, 85% PMN), proteinorraquia e hipoglicorraquia.',
                labs: 'Hb 11.2 | Leuco 15.800 (S78 L18) | PCR 85 (era 220 na admissão) | LCR controle amanhã',
                imagem: 'TC crânio admissão: sem alterações',
                infeccioso: 'Cultura LCR: Streptococcus pneumoniae sensível a Ceftriaxona',
                prescricao:
                    'Ceftriaxona 100mg/kg/dia EV 12/12h (D5/10), Dexametasona 0.15mg/kg 6/6h EV (D5/4)',
                muc: 'Nenhum',
                dieta: 'Dieta livre para idade',
                pendencias: 'LCR controle amanhã (D6). Solicitar avaliação FONO para alta.',
                recebeu: 'Ceftriaxona + Dexametasona no horário',
                statusDestino: '',
                especialidades: 'INFECTO, NEURO',
                sv: 'Ar ambiente',
                scatsObs: 'PICC em MSE desde D2',
            },
            {
                id: 1003,
                name: 'Lucas Oliveira Rodrigues',
                leito: 'Leito 12',
                age: '2',
                rghc: '45678912',
                dih: '06/02',
                weight: '12',
                alergia: 'NKDA',
                gravity: 'stable',
                systems: [],
                nightEvolution: true,
                sharedDiagnosis: true,
                previo: 'Prematuro 34 sem, displasia broncopulmonar leve. Ex-uso de O2 domiciliar (suspenso há 6m).',
                atual: 'GECA em melhora. Tolerando dieta VO. Evacuações diminuindo em frequência. Afebril.',
                hpma: 'Diarreia aquosa há 5 dias (8-10 episódios/dia), associada a vômitos e recusa alimentar. Internado para hidratação EV.',
                labs: 'Na 138 | K 3.8 | Cr 0.3 | U 25 | Glicemia 85',
                imagem: 'Não realizou',
                infeccioso: 'Rotavírus positivo nas fezes',
                prescricao: 'SF 0.9% com SG5% - 80ml/h, Ondansetrona SN',
                muc: 'Nenhum',
                dieta: 'Dieta leve, sem lactose por 2 semanas',
                pendencias: 'Se manter boa aceitação VO até manhã, programar alta com orientações',
                recebeu: 'Hidratação EV conforme prescrito',
                statusDestino: 'alta',
                especialidades: '',
                sv: 'Ar ambiente',
                scatsObs: 'Jelco 22G em MSD',
            },
            {
                id: 1004,
                name: 'Ana Beatriz Ferreira',
                leito: 'Leito 5',
                age: '6',
                rghc: '78912345',
                dih: '04/02',
                weight: '20',
                alergia: 'AAS',
                gravity: 'alert',
                systems: ['resp'],
                nightEvolution: false,
                sharedDiagnosis: false,
                previo: 'Cardiopatia congênita - CIV operada há 2 anos. Seguimento CARDIO ICr.',
                atual: 'Pneumonia comunitária em D3 de ATB. Mantém esforço leve, saturando 94% em AA. Febre baixa ontem.',
                hpma: 'Quadro de tosse produtiva e febre há 5 dias. Rx com consolidação em base D. Iniciado Ampicilina EV.',
                labs: 'Hb 11.8 | Leuco 18.200 (S72 L22) | PCR 68 | Hemocultura em andamento',
                imagem: 'Rx tórax D1: consolidação em lobo inferior D. Controle em D5.',
                infeccioso: 'Aguardando resultado de hemocultura',
                prescricao: 'Ampicilina 200mg/kg/dia EV 6/6h (D3/7-10)',
                muc: 'AAS 100mg/dia (suspenso)',
                dieta: 'Dieta para idade',
                pendencias: 'Rx tórax controle em D5. Avaliar escalonamento se não melhorar febre.',
                recebeu: 'Ampicilina nos horários + antitérmico SN',
                statusDestino: 'aguarda',
                aguardaTipo: 'internacao',
                destinoDetalhes: 'Solicitada vaga em enfermaria CARDIO para seguimento conjunto',
                especialidades: 'CARDIO, PNEUMO',
                sv: 'Ar ambiente',
                scatsObs: 'Jelco 24G em MSD',
            },
        ];
    }

    saveData() {
        // Always save both lists to prevent data loss
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

        this.renderList(); // Refresh list

        const status = document.getElementById('saveStatus');
        if (status) {
            status.textContent = '✓ Salvo';
            status.style.color = 'var(--success-green)';
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
                const isoTypes = (p.isolamento || []).map((i) => i.toUpperCase()).join(', ');
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
                <button class="btn-delete-porta" onclick="buxo.deletePortaPatient(${p.id})">🗑️</button>
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
        if (confirm('Excluir paciente da porta?')) {
            this.portaPatients = this.portaPatients.filter((p) => p.id !== id);
            this.saveData();
        }
    }

    autoExpand(el) {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }

    // ===================================
    // POPUPS ALTA E TRANSFERÊNCIA (RETAGUARDA)
    // ===================================

    openAltaPopup(patientId) {
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
        const overlay = document.getElementById('docPopupOverlay');
        if (overlay) overlay.remove();
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
            alert('API Key salva com sucesso!');
            document.getElementById('configOverlay').remove();
        } else {
            alert('Por favor, insira uma chave válida.');
        }
    }

    async callGemini(prompt, buttonId) {
        const apiKey = localStorage.getItem('buxo_gemini_key');
        if (!apiKey) {
            alert('API Key não configurada! Clique na engrenagem ⚙️ para configurar.');
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
        alert(`Erro na IA: Nenhum modelo disponível funcionou. Último erro: ${lastError}`);
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

    openCockpit(id) {
        const p = this.patients.find((x) => x.id === id);
        if (!p) return;
        this.currentId = id;

        const overlay = document.getElementById('cockpitOverlay');
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
                                <input type="checkbox" data-isolation="contato" ${p.isolamento && p.isolamento.includes('contato') ? 'checked' : ''}> Contato
                            </label>
                            <label class="compact-check">
                                <input type="checkbox" data-isolation="goticula" ${p.isolamento && p.isolamento.includes('goticula') ? 'checked' : ''}> Gotícula
                            </label>
                            <label class="compact-check">
                                <input type="checkbox" data-isolation="aerossol" ${p.isolamento && p.isolamento.includes('aerossol') ? 'checked' : ''}> Aerossol
                            </label>
                            <label class="compact-check">
                                <input type="checkbox" data-isolation="reverso" ${p.isolamento && p.isolamento.includes('reverso') ? 'checked' : ''}> Reverso
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
                    <button class="btn btn-danger mt-sm" style="width:100%; font-size:0.7rem; opacity:0.5; padding: 4px;" onclick="buxo.deletePatient(${id})">Excluir Paciente</button>
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

        // Text/Input/Select listeners
        body.querySelectorAll(
            'input:not([type="checkbox"]):not([type="radio"]), textarea, select'
        ).forEach((el) => {
            // Para <select>, ouvir 'change' em vez de 'input' garante captura em todos os browsers
            const evt = el.tagName === 'SELECT' ? 'change' : 'input';
            el.addEventListener(evt, (e) => {
                const field = e.target.dataset.field;
                const val = e.target.value;
                this.updatePatientData(id, field, val);

                // Live Header Updates
                if (['name', 'age', 'rghc', 'weight'].includes(field)) {
                    this.updateHeader(id);
                }

                // Leito changed → refresh conflict warning
                if (field === 'leito') {
                    this.refreshLeitoConflict(id);
                }

                // Handle Status Logic Visibility
                if (field === 'statusDestino') {
                    const wrapAguarda = document.getElementById(`wrapperAguarda_${id}`);
                    const wrapInternacao = document.getElementById(`wrapperInternacao_${id}`);
                    const wrapCedida = document.getElementById(`wrapperCedida_${id}`);

                    if (wrapAguarda)
                        wrapAguarda.style.display = val === 'aguarda' ? 'block' : 'none';
                    if (wrapInternacao)
                        wrapInternacao.style.display = val === 'internacao' ? 'block' : 'none';
                    if (wrapCedida) wrapCedida.style.display = val === 'cedida' ? 'block' : 'none';

                    // Trigger Popups based on Selection
                    if (val === 'alta') {
                        this.openAltaPopup(id);
                    } else if (val === 'cedida') {
                        this.openTransferenciaPopup(id);
                    }

                    this.renderList();
                }

                if (field === 'weight') {
                    const pcString = this.calculateCaloricWeight(val);
                    const disp = document.getElementById(`displayCaloric_${id}`);
                    if (disp) disp.textContent = pcString;
                }

                // Auto Expand
                if (e.target.tagName === 'TEXTAREA') {
                    this.autoExpand(e.target);
                }
            });
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
                    if (!p.isolamento) p.isolamento = [];
                    if (checked && !p.isolamento.includes(isolation)) {
                        p.isolamento.push(isolation);
                    }
                    if (!checked) {
                        p.isolamento = p.isolamento.filter((i) => i !== isolation);
                    }
                    this.triggerAutoSave(id);
                }
            });
        });
    }

    autoExpand(field) {
        field.style.height = 'auto'; // Reset to calculate scrollHeight
        field.style.height = field.scrollHeight + 2 + 'px'; // Set new height
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
            this.openCockpit(id); // Re-render to update UI state
        }
    }

    deletePatient(id) {
        if (confirm('Tem certeza que deseja excluir este paciente?')) {
            this.patients = this.patients.filter((p) => p.id !== id);
            this.saveData();
            this.closeCockpit();
        }
    }

    // ===================================
    // UTILS
    // ===================================

    createNewPatient() {
        const newP = {
            id: Date.now(),
            name: this.currentView === 'port' ? '' : 'Novo Paciente',
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

            // Inject Config Button if not exists
            if (!document.getElementById('btnConfig')) {
                const btnConfig = document.createElement('button');
                btnConfig.id = 'btnConfig';
                btnConfig.innerHTML = '⚙️';
                btnConfig.title = 'Configurações IA';
                btnConfig.style.cssText =
                    'width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; margin-left: 8px;';
                btnConfig.onclick = () => this.openConfig();

                // Insert after btnNew
                if (btnNew.parentNode) {
                    btnNew.parentNode.insertBefore(btnConfig, btnNew.nextSibling);
                }
            }
        }

        const btnExport = document.getElementById('btnExport');
        if (btnExport)
            btnExport.addEventListener('click', () => alert('Função de exportar em breve.'));

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
