// @ts-nocheck — vanilla JS legado (event.target sem casts).
// Será migrado por módulos a partir da Fase 6, quando entrarem os repos Supabase com tipagem.
// ===================================
// MAPA DA RETAGUARDA - Interactive Bed Map
// Reads from localStorage 'buxo_patients_final'
// ===================================

class MapaRetaguarda {
    constructor() {
        // ---- Data sources (same localStorage as main app) ----
        this.patients = this.load('buxo_patients_final') || [];
        this.leitosExtras = this.load('buxo_leitos_extras') || [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.currentView = 'mapa'; // 'mapa' | 'lista'
        this.currentId = null;
        this.saveTimeout = null;
        this.assigningBed = null; // bed label when assigning

        // ---- Fixed slots definition ----
        this.slots = this.buildSlots();

        this.init();
    }

    // ===================================
    // SLOTS DEFINITION
    // ===================================
    buildSlots() {
        const fixed = [
            // Consultórios
            { id: 'Con1', label: 'Con1', area: 'Consultórios', bedValue: 'Con1' },
            { id: 'Con2', label: 'Con2', area: 'Consultórios', bedValue: 'Con2' },
            { id: 'Con3', label: 'Con3', area: 'Consultórios', bedValue: 'Con3' },
            { id: 'Con4', label: 'Con4', area: 'Consultórios', bedValue: 'Con4' },
            { id: 'Medic', label: 'Medic', area: 'Consultórios', bedValue: 'Medic' },
            // Leitos
            { id: 'Leito 1', label: 'Leito 1', area: 'Leitos', bedValue: 'Leito 1' },
            { id: 'Leito 2', label: 'Leito 2', area: 'Leitos', bedValue: 'Leito 2' },
            { id: 'Leito 3', label: 'Leito 3', area: 'Leitos', bedValue: 'Leito 3' },
            { id: 'Leito 4', label: 'Leito 4', area: 'Leitos', bedValue: 'Leito 4' },
            { id: 'Leito 5', label: 'Leito 5', area: 'Leitos', bedValue: 'Leito 5' },
            { id: 'Leito 6', label: 'Leito 6', area: 'Leitos', bedValue: 'Leito 6' },
            { id: 'Leito 7', label: 'Leito 7', area: 'Leitos', bedValue: 'Leito 7' },
            { id: 'Leito 8', label: 'Leito 8', area: 'Leitos', bedValue: 'Leito 8' },
            { id: 'Leito 9', label: 'Leito 9', area: 'Leitos', bedValue: 'Leito 9' },
            { id: 'Leito 10', label: 'Leito 10', area: 'Leitos', bedValue: 'Leito 10' },
            { id: 'Leito 11', label: 'Leito 11', area: 'Leitos', bedValue: 'Leito 11' },
            { id: 'Leito 12', label: 'Leito 12', area: 'Leitos', bedValue: 'Leito 12' },
            { id: 'Leito 13', label: 'Leito 13', area: 'Leitos', bedValue: 'Leito 13' },
            { id: 'Leito 14', label: 'Leito 14', area: 'Leitos', bedValue: 'Leito 14' },
            { id: 'Leito 15', label: 'Leito 15', area: 'Leitos', bedValue: 'Leito 15' },
            // Isolamento
            { id: 'Iso 16', label: 'Iso 16', area: 'Isolamento', bedValue: 'Iso 16' },
            { id: 'Iso 17', label: 'Iso 17', area: 'Isolamento', bedValue: 'Iso 17' },
            // Áreas
            {
                id: 'Estabilização',
                label: 'Estabilização',
                area: 'Áreas',
                bedValue: 'Estabilização',
            },
            { id: 'Emergência', label: 'Emergência', area: 'Áreas', bedValue: 'Emergência' },
            { id: 'Procedimento', label: 'Procedimento', area: 'Áreas', bedValue: 'Procedimento' },
        ];
        return fixed;
    }

    getAllSlots() {
        const extras = this.leitosExtras.map((e, i) => ({
            id: e.id || `extra_${i}`,
            label: `Extra ${18 + i}`,
            area: 'Extras',
            bedValue: `Extra ${18 + i}`,
            isExtra: true,
            extraIndex: i,
        }));
        return [...this.slots, ...extras];
    }

    // ===================================
    // DATA
    // ===================================
    load(key) {
        try {
            const d = JSON.parse(localStorage.getItem(key));
            return Array.isArray(d) ? d : null;
        } catch (e) {
            return null;
        }
    }

    save() {
        localStorage.setItem('buxo_patients_final', JSON.stringify(this.patients));
        const st = document.getElementById('mrSaveStatus');
        if (st) {
            st.textContent = '✓ Salvo';
            st.style.color = '#22c55e';
        }
    }

    triggerAutoSave() {
        const st = document.getElementById('mrSaveStatus');
        if (st) {
            st.textContent = '💾 Salvando...';
            st.style.color = '#f59e0b';
        }
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => this.save(), 600);
    }

    refreshPatients() {
        this.patients = this.load('buxo_patients_final') || [];
    }

    // ===================================
    // INIT
    // ===================================
    init() {
        this.render();
        this.setupEvents();
    }

    // ===================================
    // CONFLICT DETECTION
    // ===================================
    getConflicts() {
        const bedMap = {};
        this.patients.forEach((p) => {
            const bed = (p.leito || '').trim();
            if (!bed) return;
            if (!bedMap[bed]) bedMap[bed] = [];
            bedMap[bed].push(p);
        });
        const conflicts = {};
        Object.entries(bedMap).forEach(([bed, pts]) => {
            if (pts.length > 1) conflicts[bed] = pts;
        });
        return conflicts;
    }

    // ===================================
    // PATIENT HELPERS
    // ===================================
    getPatientForBed(bedValue) {
        return this.patients.find((p) => (p.leito || '').trim() === bedValue.trim());
    }

    getPatientsForBed(bedValue) {
        return this.patients.filter((p) => (p.leito || '').trim() === bedValue.trim());
    }

    getUnassigned() {
        const allBedValues = new Set(this.getAllSlots().map((s) => s.bedValue));
        return this.patients.filter((p) => {
            const bed = (p.leito || '').trim();
            if (!bed) return true;
            // Also count as unassigned if bed doesn't match any known slot
            return !allBedValues.has(bed);
        });
    }

    shortName(name) {
        if (!name) return '?';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0];
        return parts[0] + ' ' + parts[parts.length - 1].charAt(0) + '.';
    }

    gravityLabel(g) {
        return { stable: 'Estável', alert: 'Alerta', unstable: 'Instável' }[g] || g || '';
    }

    // ===================================
    // RENDER
    // ===================================
    render() {
        this.refreshPatients();
        this.leitosExtras = this.load('buxo_leitos_extras') || [];
        if (this.currentView === 'mapa') {
            this.renderMap();
        } else {
            this.renderLista();
        }
        this.renderDrawer();
        this.updateFilterCounts();
    }

    // ===================================
    // MAP VIEW RENDER
    // ===================================
    renderMap() {
        // Removed automatic refresh here to prevent overwriting local changes before save
        // Only refresh on 'storage' event or init.

        const container = document.getElementById('mrContent');
        if (!container) return;

        const allSlots = this.getAllSlots();

        // Build tile HTML for a slot
        const mkTile = (slot) => {
            if (!slot || !slot.bedValue) return '';
            const patients = this.getPatientsForBed(slot.bedValue);
            const patient = patients[0];
            const isConflict = patients.length > 1;
            const isVago = patients.length === 0;

            let statusClass = 'mr-tile-vago';
            if (!isVago) {
                const g = patient.gravity || 'stable';
                statusClass = `mr-tile-${g}`;
            }
            if (isConflict) statusClass += ' mr-tile-conflict';

            // Filter dimming
            let dimmed = false;
            if (this.currentFilter !== 'all') {
                if (this.currentFilter === 'vago' && !isVago) dimmed = true;
                if (this.currentFilter === 'estavel' && (isVago || patient.gravity !== 'stable'))
                    dimmed = true;
                if (this.currentFilter === 'alerta' && (isVago || patient.gravity !== 'alert'))
                    dimmed = true;
                if (this.currentFilter === 'instavel' && (isVago || patient.gravity !== 'unstable'))
                    dimmed = true;
                if (this.currentFilter === 'conflito' && !isConflict) dimmed = true;
                if (this.currentFilter === 'semleito') dimmed = true;
            }

            // Search dimming
            if (this.searchTerm && patient) {
                const nm = (patient.name || '').toLowerCase();
                const lt = (patient.leito || '').toLowerCase();
                if (!nm.includes(this.searchTerm) && !lt.includes(this.searchTerm)) dimmed = true;
            } else if (this.searchTerm && isVago) {
                if (!slot.bedValue.toLowerCase().includes(this.searchTerm)) dimmed = true;
            }

            // Badges
            let badges = '';
            if (patient) {
                const iso = patient.isolamento && patient.isolamento.length > 0;
                const pend = patient.pendencias && patient.pendencias.trim().length > 0;
                if (iso) badges += `<span class="mr-tile-badge mr-tile-badge-iso">🔒</span>`;
                if (pend) badges += `<span class="mr-tile-badge mr-tile-badge-pend">⚠</span>`;
            }

            const removeBtn = slot.isExtra
                ? `<button class="mr-tile-remove" onclick="event.stopPropagation(); mapa.removeExtra(${slot.extraIndex})" title="Remover">✕</button>`
                : '';
            const clickAction = isConflict
                ? `onclick="mapa.showConflict('${slot.bedValue}')"`
                : patient
                  ? `onclick="mapa.openCockpit(${patient.id})"`
                  : `onclick="mapa.createNewPatient('${slot.bedValue}')"`;

            return `<div class="mr-tile ${statusClass} ${dimmed ? 'dimmed' : ''}" ${clickAction} data-bed="${slot.bedValue}">
                ${removeBtn}
                <div class="mr-tile-label">${slot.label}</div>
                ${
                    patient
                        ? `
                    <div class="mr-tile-name">${this.shortName(patient.name)}</div>
                    <div class="mr-tile-meta">${patient.age || '?'}a${patient.atual ? ' • ' + patient.atual.substring(0, 25) : ''}</div>
                `
                        : `<div class="mr-tile-name" style="opacity:0.5;">Vago</div>`
                }
                ${badges ? `<div class="mr-tile-badges">${badges}</div>` : ''}
            </div>`;
        };

        // Helper to get a slot by bedValue
        const s = (bv) => allSlots.find((x) => x.bedValue === bv);
        const extras = allSlots.filter((x) => x.area === 'Extras');

        container.innerHTML = `
        <div class="mr-floor">
            <!-- === MAIN ROW: Left | Center | Right === -->
            
            <!-- LEFT COLUMN: Consultórios + Isolamento -->
            <div class="mr-zone mr-zone-left">
                <div class="mr-zone-title">🏢 Consultórios</div>
                <div class="mr-files-grid" style="margin-bottom:12px;">
                    ${mkTile(s('Con1'))}${mkTile(s('Con2'))}${mkTile(s('Con3'))}${mkTile(s('Con4'))}${mkTile(s('Medic'))}
                </div>
                
                <div class="mr-zone-title">🔒 Isolamento</div>
                <div class="mr-grid-2">
                    ${mkTile(s('Iso 17'))}${mkTile(s('Iso 16'))}
                </div>
            </div>

            <!-- CENTER COLUMN: Salão - Berços (3-col grid) -->
            <div class="mr-zone mr-zone-center">
                <div class="mr-zone-title">🛏️ Salão - Berços</div>
                <div class="mr-grid-3">
                    <!-- Top Row: 4, 5, 6 -->
                    ${mkTile(s('Leito 4'))}${mkTile(s('Leito 5'))}${mkTile(s('Leito 6'))}
                    <!-- Row 2: 3, empty, 7 -->
                    ${mkTile(s('Leito 3'))}<div></div>${mkTile(s('Leito 7'))}
                    <!-- Row 3: 2, empty, 8 -->
                    ${mkTile(s('Leito 2'))}<div></div>${mkTile(s('Leito 8'))}
                    <!-- Row 4: 1, empty, 9 -->
                    ${mkTile(s('Leito 1'))}<div></div>${mkTile(s('Leito 9'))}
                </div>
            </div>

            <!-- RIGHT COLUMN: Salão (3-col grid) -->
            <div class="mr-zone mr-zone-right">
                <div class="mr-zone-title">🛏️ Salão</div>
                <div class="mr-grid-3">
                    <!-- Top Row: 15, 14, 13 -->
                    ${mkTile(s('Leito 15'))}${mkTile(s('Leito 14'))}${mkTile(s('Leito 13'))}
                    <!-- Row 2: 10, empty, empty -->
                    ${mkTile(s('Leito 10'))}<div></div><div></div>
                    <!-- Row 3: empty, 11, 12 -->
                    <div></div>${mkTile(s('Leito 11'))}${mkTile(s('Leito 12'))}
                </div>
            </div>

            <!-- === BOTTOM ROW: Áreas === -->
            <div class="mr-zone" style="grid-column: 1 / -1;">
                <div class="mr-grid-3">
                    ${mkTile(s('Estabilização'))}${mkTile(s('Emergência'))}${mkTile(s('Procedimento'))}
                </div>
            </div>

            <!-- === BELOW BOTTOM: Extras === -->
            <div class="mr-zone" style="grid-column: 1 / -1; min-height:100px;">
                <div class="mr-extras-header">
                    <div class="mr-zone-title" style="margin:0;">➕ Extras</div>
                    <button class="mr-btn mr-btn-sm mr-btn-primary" onclick="mapa.addExtra()">+ Extra</button>
                </div>
                <div class="mr-files-grid">
                    ${extras.length > 0 ? extras.map(mkTile).join('') : '<div style="padding:12px; text-align:center; color: var(--mr-text-muted); font-size:0.75rem; grid-column:1/-1;">Nenhum extra. Clique "+ Extra"</div>'}
                </div>
            </div>
        </div>`;
    }

    // ===================================
    // LISTA VIEW RENDER
    // ===================================
    renderLista() {
        const container = document.getElementById('mrContent');
        if (!container) return;

        const conflicts = this.getConflicts();
        const allSlots = this.getAllSlots();
        const groups = ['Consultórios', 'Leitos', 'Isolamento', 'Áreas', 'Extras'];

        const mkTile = (slot) => {
            const patients = this.getPatientsForBed(slot.bedValue);
            const patient = patients[0];
            const isConflict = patients.length > 1;
            const isVago = patients.length === 0;
            let statusClass = 'mr-tile-vago';
            if (!isVago) statusClass = `mr-tile-${patient.gravity || 'stable'}`;
            if (isConflict) statusClass += ' mr-tile-conflict';

            let dimmed = false;
            if (this.currentFilter !== 'all') {
                if (this.currentFilter === 'vago' && !isVago) dimmed = true;
                if (this.currentFilter === 'estavel' && (isVago || patient.gravity !== 'stable'))
                    dimmed = true;
                if (this.currentFilter === 'alerta' && (isVago || patient.gravity !== 'alert'))
                    dimmed = true;
                if (this.currentFilter === 'instavel' && (isVago || patient.gravity !== 'unstable'))
                    dimmed = true;
                if (this.currentFilter === 'conflito' && !isConflict) dimmed = true;
                if (this.currentFilter === 'semleito') dimmed = true;
            }
            if (this.searchTerm && patient) {
                const nm = (patient.name || '').toLowerCase();
                if (
                    !nm.includes(this.searchTerm) &&
                    !slot.bedValue.toLowerCase().includes(this.searchTerm)
                )
                    dimmed = true;
            }

            const removeBtn = slot.isExtra
                ? `<button class="mr-tile-remove" onclick="event.stopPropagation(); mapa.removeExtra(${slot.extraIndex})" title="Remover">✕</button>`
                : '';
            const clickAction = isConflict
                ? `onclick="mapa.showConflict('${slot.bedValue}')"`
                : patient
                  ? `onclick="mapa.openCockpit(${patient.id})"`
                  : `onclick="mapa.createNewPatient('${slot.bedValue}')"`;

            return `<div class="mr-tile ${statusClass} ${dimmed ? 'dimmed' : ''}" ${clickAction}>
                ${removeBtn}
                <div class="mr-tile-label">${slot.label}</div>
                ${patient ? `<div class="mr-tile-name">${this.shortName(patient.name)}</div><div class="mr-tile-meta">${patient.age || '?'}a</div>` : `<div class="mr-tile-name" style="opacity:0.5;">Vago</div>`}
            </div>`;
        };

        let html = '<div class="mr-lista">';
        groups.forEach((group) => {
            let slots = allSlots.filter((s) => s.area === group);
            if (slots.length === 0 && group !== 'Extras') return;
            const occ = slots.filter((s) => this.getPatientForBed(s.bedValue)).length;
            html += `<div class="mr-lista-group">
                <div class="mr-lista-group-header">
                    <span>${group}</span>
                    <span class="mr-lista-group-count">${occ}/${slots.length}</span>
                </div>
                <div class="mr-lista-items">
                    ${slots.map(mkTile).join('')}
                    ${group === 'Extras' ? `<div class="mr-tile mr-tile-vago" style="border-style:dashed; display:flex; align-items:center; justify-content:center; opacity:0.6;" onclick="mapa.addExtra()"><div class="mr-tile-name">+ Extra</div></div>` : ''}
                </div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    // ===================================
    // DRAWER (Sem Leito)
    // ===================================
    renderDrawer() {
        const drawer = document.getElementById('mrDrawer');
        if (!drawer) return;
        const unassigned = this.getUnassigned();
        document.getElementById('mrDrawerCount').textContent = unassigned.length;

        const listEl = document.getElementById('mrDrawerList');
        if (unassigned.length === 0) {
            listEl.innerHTML =
                '<div style="padding:16px; text-align:center; color: var(--mr-text-muted); font-size:0.85rem;">Todos os pacientes têm leito atribuído ✓</div>';
            return;
        }

        listEl.innerHTML = unassigned
            .map(
                (p) => `
            <div class="mr-drawer-item" onclick="mapa.openCockpit(${p.id})">
                <div class="mr-drawer-item-dot ${p.gravity || 'stable'}"></div>
                <div>
                    <div class="mr-drawer-item-name">${this.shortName(p.name)}</div>
                    <div class="mr-drawer-item-meta">${p.age || '?'}a • ${p.atual ? p.atual.substring(0, 30) + '...' : 'Sem info'}</div>
                </div>
            </div>
        `
            )
            .join('');
    }

    // ===================================
    // FILTER COUNTS
    // ===================================
    updateFilterCounts() {
        const allSlots = this.getAllSlots();
        const conflicts = this.getConflicts();
        const total = allSlots.length;
        const vagos = allSlots.filter((s) => !this.getPatientForBed(s.bedValue)).length;
        const estaveis = this.patients.filter(
            (p) => p.gravity === 'stable' && (p.leito || '').trim()
        ).length;
        const alertas = this.patients.filter(
            (p) => p.gravity === 'alert' && (p.leito || '').trim()
        ).length;
        const instaveis = this.patients.filter(
            (p) => p.gravity === 'unstable' && (p.leito || '').trim()
        ).length;
        const semLeito = this.getUnassigned().length;
        const conflitos = Object.keys(conflicts).length;

        const set = (f, c) => {
            const el = document.querySelector(`[data-filter="${f}"] .chip-count`);
            if (el) el.textContent = c;
        };
        set('all', total);
        set('vago', vagos);
        set('estavel', estaveis);
        set('alerta', alertas);
        set('instavel', instaveis);
        set('semleito', semLeito);
        set('conflito', conflitos);
    }

    // ===================================
    // ASSIGN PATIENT TO BED
    // ===================================
    openAssign(bedValue) {
        this.assigningBed = bedValue;
        const unassigned = this.getUnassigned();

        const overlay = document.createElement('div');
        overlay.className = 'mr-assign-overlay';
        overlay.id = 'mrAssignOverlay';
        overlay.innerHTML = `
            < div class="mr-assign-modal" >
                <div class="mr-assign-header">
                    <div class="mr-assign-title">Atribuir paciente → ${bedValue}</div>
                    <button class="mr-assign-close" onclick="mapa.closeAssign()">✕</button>
                </div>
                <div class="mr-assign-search">
                    <input type="text" placeholder="Buscar paciente sem leito..." id="mrAssignSearch" oninput="mapa.filterAssign(this.value)">
                </div>
                <div class="mr-assign-list" id="mrAssignList">
                    ${
                        unassigned.length === 0
                            ? '<div style="padding:24px; text-align:center; color: var(--mr-text-muted);">Nenhum paciente sem leito</div>'
                            : unassigned
                                  .map(
                                      (p) => `
                            <div class="mr-assign-item" onclick="mapa.doAssign(${p.id}, '${bedValue}')" data-name="${(p.name || '').toLowerCase()}">
                                <div class="mr-drawer-item-dot ${p.gravity || 'stable'}"></div>
                                <div>
                                    <div class="mr-assign-item-name">${p.name || 'Sem nome'}</div>
                                    <div class="mr-assign-item-meta">${p.age || '?'}a • ${this.gravityLabel(p.gravity)}</div>
                                </div>
                            </div>
                        `
                                  )
                                  .join('')
                    }
                </div>
            </div >
            `;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeAssign();
        });
        document.body.appendChild(overlay);
        setTimeout(() => document.getElementById('mrAssignSearch')?.focus(), 100);
    }

    filterAssign(term) {
        term = term.toLowerCase().trim();
        document.querySelectorAll('#mrAssignList .mr-assign-item').forEach((el) => {
            const name = el.dataset.name || '';
            el.style.display = name.includes(term) ? '' : 'none';
        });
    }

    doAssign(patientId, bedValue) {
        // Check for existing patient in this bed
        const existing = this.getPatientForBed(bedValue);
        if (existing) {
            this.toast(
                `⚠️ Leito "${bedValue}" já está ocupado por ${this.shortName(existing.name)} !`,
                'error'
            );
            return;
        }

        const p = this.patients.find((x) => x.id === patientId);
        if (p) {
            p.leito = bedValue;
            this.triggerAutoSave();
            this.closeAssign();
            this.render();
            this.toast(`✓ ${this.shortName(p.name)} → ${bedValue} `, 'success');
        }
    }

    // ===================================
    // CREATE NEW PATIENT (Click on Empty Bed)
    // ===================================
    createNewPatient(bedValue) {
        // Double check if empty
        const existing = this.getPatientForBed(bedValue);
        if (existing) {
            this.toast(`O leito ${bedValue} já está ocupado!`, 'error');
            this.render();
            return;
        }

        const newId = Date.now();
        const newPatient = {
            id: newId,
            leito: bedValue,
            name: '',
            age: '',
            rghc: '',
            gravity: 'stable',
            systems: [],
            isolamento: [],
            isolamentoObs: '',
            previo: '',
            atual: '',
            hpma: '',
            labs: '',
            imagem: '',
            infeccioso: '',
            sv: '',
            scatsObs: '',
            dieta: '',
            prescricao: '',
            muc: '',
            recebeu: '',
            pendencias: '',
            statusDestino: '',
            especialidades: '',
            weight: '',
            dih: '',
        };

        this.patients.push(newPatient);
        this.triggerAutoSave();
        this.render(); // Re-render to show the new patient on the map
        this.openCockpit(newId); // Open editor immediately
    }

    closeAssign() {
        const el = document.getElementById('mrAssignOverlay');
        if (el) el.remove();
        this.assigningBed = null;
    }

    // ===================================
    // CONFLICT MODAL
    // ===================================
    showConflict(bedValue) {
        const patients = this.getPatientsForBed(bedValue);
        if (patients.length < 2) {
            this.openCockpit(patients[0]?.id);
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'mr-assign-overlay';
        overlay.id = 'mrConflictOverlay';
        overlay.innerHTML = `
            < div class="mr-assign-modal" >
                <div class="mr-assign-header" style="border-bottom-color: var(--mr-red);">
                    <div class="mr-assign-title" style="color: var(--mr-red);">⚠️ Conflito: ${bedValue} (${patients.length} pacientes)</div>
                    <button class="mr-assign-close" onclick="mapa.closeConflict()">✕</button>
                </div>
                <div class="mr-conflict-list">
                    ${patients
                        .map(
                            (p) => `
                        <div class="mr-conflict-item">
                            <div>
                                <div style="font-weight:700;">${p.name || 'Sem nome'}</div>
                                <div style="font-size:0.75rem; color: var(--mr-text-muted);">${p.age || '?'}a • ${this.gravityLabel(p.gravity)}</div>
                            </div>
                            <div style="display:flex; gap:6px;">
                                <button class="mr-btn mr-btn-sm" onclick="mapa.closeConflict(); mapa.openCockpit(${p.id})">Editar</button>
                                <button class="mr-btn mr-btn-sm" style="border-color: var(--mr-red); color: var(--mr-red);" onclick="mapa.unassignPatient(${p.id})">Remover Leito</button>
                            </div>
                        </div>
                    `
                        )
                        .join('')}
                </div>
            </div >
            `;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeConflict();
        });
        document.body.appendChild(overlay);
    }

    closeConflict() {
        const el = document.getElementById('mrConflictOverlay');
        if (el) el.remove();
    }

    unassignPatient(patientId) {
        const p = this.patients.find((x) => x.id === patientId);
        if (p) {
            p.leito = '';
            this.triggerAutoSave();
            this.closeConflict();
            this.render();
            this.toast(`Leito removido de ${this.shortName(p.name)} `, 'success');
        }
    }

    // ===================================
    // EXTRAS
    // ===================================
    addExtra() {
        const idx = this.leitosExtras.length;
        this.leitosExtras.push({ id: `extra_${Date.now()}`, label: `Extra ${18 + idx}` });
        localStorage.setItem('buxo_leitos_extras', JSON.stringify(this.leitosExtras));
        this.render();
        this.toast(`Extra ${18 + idx} adicionado`, 'success');
    }

    removeExtra(idx) {
        const extra = this.leitosExtras[idx];
        if (!extra) return;
        const bedValue = `Extra ${18 + idx}`;
        const patient = this.getPatientForBed(bedValue);

        if (patient) {
            if (
                !confirm(
                    `"${bedValue}" está ocupado por ${patient.name}. O leito do paciente será limpo.Continuar ? `
                )
            )
                return;
            patient.leito = '';
            this.triggerAutoSave();
        }

        this.leitosExtras.splice(idx, 1);
        // Re-label remaining extras and update patient beds
        this.leitosExtras.forEach((e, i) => {
            const oldLabel = e.label;
            const newLabel = `Extra ${18 + i}`;
            if (oldLabel !== newLabel) {
                // Update any patient that was in the old label
                this.patients.forEach((p) => {
                    if (p.leito === oldLabel) p.leito = newLabel;
                });
            }
            e.label = newLabel;
        });
        localStorage.setItem('buxo_leitos_extras', JSON.stringify(this.leitosExtras));
        this.triggerAutoSave();
        this.render();
    }

    // ===================================
    // COCKPIT (Patient Editor) - Reused from BuxoSystem
    // ===================================
    openCockpit(id) {
        const p = this.patients.find((x) => x.id === id);
        if (!p) return;
        this.currentId = id;

        const overlay = document.getElementById('mrCockpit');
        const header = document.getElementById('mrCockpitHeader');
        const body = document.getElementById('mrCockpitBody');

        // Header
        header.innerHTML = `
            <div>
                <div class="mr-ch-name">${p.name || 'Sem Nome'}</div>
                <div class="mr-ch-meta">
                    <span><strong>Idade:</strong> ${p.age || '-'}</span>
                    <span><strong>Leito:</strong> ${p.leito || 'Sem leito'}</span>
                    <span><strong>RGHC:</strong> ${p.rghc || '-'}</span>
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
                <span class="mr-ch-badge badge-${p.gravity || 'stable'}">${this.gravityLabel(p.gravity)}</span>
                <span id="mrSaveStatus" class="mr-save-status">✓ Salvo</span>
                <button class="mr-btn mr-btn-sm" onclick="mapa.closeCockpit()">✕ Fechar</button>
            </div>
        `;

        // Systems checkboxes
        const isSysVis = p.gravity === 'alert' || p.gravity === 'unstable';
        const sysChecks = `<div style="display:${isSysVis ? 'flex' : 'none'}; gap:8px; margin-top:4px;">
            <label class="mr-c-check"><input type="checkbox" data-system="resp" ${p.systems?.includes('resp') ? 'checked' : ''}> Resp</label>
            <label class="mr-c-check"><input type="checkbox" data-system="circ" ${p.systems?.includes('circ') ? 'checked' : ''}> Circ</label>
            <label class="mr-c-check"><input type="checkbox" data-system="neuro" ${p.systems?.includes('neuro') ? 'checked' : ''}> Neuro</label>
        </div>`;

        const isoChecks = ['contato', 'goticula', 'aerossol', 'reverso']
            .map(
                (t) =>
                    `<label class="mr-c-check"><input type="checkbox" data-isolation="${t}" ${p.isolamento?.includes(t) ? 'checked' : ''}> ${t.charAt(0).toUpperCase() + t.slice(1)}</label>`
            )
            .join('');

        body.innerHTML = `
            <!-- COL 1: Identification + History -->
            <div class="mr-c-col">
                <div class="mr-c-section">
                    <div class="mr-c-title">IDENTIFICAÇÃO</div>
                    <div style="margin-bottom:6px;"><div class="mr-c-label">Nome</div><input class="mr-c-input" value="${p.name || ''}" data-field="name"></div>
                    <div class="mr-c-row-3">
                        <div><div class="mr-c-label">Idade</div><input class="mr-c-input" value="${p.age || ''}" data-field="age"></div>
                        <div><div class="mr-c-label">RGHC</div><input class="mr-c-input" value="${p.rghc || ''}" data-field="rghc"></div>
                        <div><div class="mr-c-label">Leito</div><input class="mr-c-input" value="${p.leito || ''}" data-field="leito"></div>
                    </div>
                    <div class="mr-c-row" style="margin-top:6px;">
                        <div><div class="mr-c-label">Peso (kg)</div><input class="mr-c-input" type="number" step="0.1" value="${p.weight || ''}" data-field="weight"></div>
                        <div><div class="mr-c-label">DIH</div><input class="mr-c-input" value="${p.dih || ''}" data-field="dih"></div>
                    </div>
                </div>
                <div class="mr-c-section">
                    <div class="mr-c-title">GRAVIDADE</div>
                    <div class="mr-c-pill-group">
                        <div class="mr-c-pill ${p.gravity === 'stable' ? 'active' : ''}" data-g="stable" onclick="mapa.setGravity(${id},'stable')">Estável</div>
                        <div class="mr-c-pill ${p.gravity === 'alert' ? 'active' : ''}" data-g="alert" onclick="mapa.setGravity(${id},'alert')">Alerta</div>
                        <div class="mr-c-pill ${p.gravity === 'unstable' ? 'active' : ''}" data-g="unstable" onclick="mapa.setGravity(${id},'unstable')">Instável</div>
                    </div>
                    ${sysChecks}
                </div>
                <div class="mr-c-section mr-iso-section">
                    <div class="mr-c-title">🔒 ISOLAMENTO</div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">${isoChecks}</div>
                    <div style="margin-top:6px;"><input class="mr-c-input" value="${p.isolamentoObs || ''}" data-field="isolamentoObs" placeholder="Detalhes..." style="border-color:#fcd34d;"></div>
                </div>
                <div class="mr-c-section" style="flex:1;">
                    <div class="mr-c-title">PRÉVIO</div>
                    <textarea class="mr-c-textarea" data-field="previo">${p.previo || ''}</textarea>
                </div>
                <div class="mr-c-section" style="flex:1;">
                    <div class="mr-c-title">ATUAL / INTERCORRÊNCIAS</div>
                    <textarea class="mr-c-textarea" data-field="atual">${p.atual || ''}</textarea>
                </div>
            </div>

            <!-- COL 2: Clinical -->
            <div class="mr-c-col">
                <div class="mr-c-section" style="border-top:3px solid #3b82f6;">
                    <div class="mr-c-title">HPMA (EVOLUÇÃO)</div>
                    <textarea class="mr-c-textarea" data-field="hpma" style="min-height:80px;">${p.hpma || ''}</textarea>
                </div>
                <div class="mr-c-section" style="flex:1;">
                    <div class="mr-c-title">LABORATÓRIO</div>
                    <textarea class="mr-c-textarea" data-field="labs">${p.labs || ''}</textarea>
                </div>
                <div class="mr-c-section">
                    <div class="mr-c-row">
                        <div><div class="mr-c-title">IMAGEM</div><textarea class="mr-c-textarea" data-field="imagem">${p.imagem || ''}</textarea></div>
                        <div><div class="mr-c-title">INFECCIOSO</div><textarea class="mr-c-textarea" data-field="infeccioso">${p.infeccioso || ''}</textarea></div>
                    </div>
                </div>
                <div class="mr-c-section">
                    <div class="mr-c-title">SUPORTE & DISPOSITIVOS</div>
                    <div class="mr-c-row">
                        <div><div class="mr-c-label">Suporte Ventilatório</div><input class="mr-c-input" value="${p.sv || ''}" data-field="sv"></div>
                        <div><div class="mr-c-label">Acessos/Dispositivos</div><input class="mr-c-input" value="${p.scatsObs || ''}" data-field="scatsObs"></div>
                    </div>
                </div>
            </div>

            <!-- COL 3: Prescriptions + Actions -->
            <div class="mr-c-col">
                <div class="mr-c-section" style="flex:1;">
                    <div class="mr-c-title">PRESCRIÇÃO (ATUAL)</div>
                    <div style="margin-bottom:6px;"><div class="mr-c-label">Dieta</div><input class="mr-c-input" value="${p.dieta || ''}" data-field="dieta"></div>
                    <textarea class="mr-c-textarea" data-field="prescricao">${p.prescricao || ''}</textarea>
                </div>
                <div class="mr-c-section">
                    <div class="mr-c-title">MUC</div>
                    <textarea class="mr-c-textarea" data-field="muc">${p.muc || ''}</textarea>
                </div>
                <div class="mr-c-section">
                    <div class="mr-c-title">RECEBEU (JÁ REALIZADO)</div>
                    <textarea class="mr-c-textarea" data-field="recebeu">${p.recebeu || ''}</textarea>
                </div>
                <div class="mr-c-section" style="border:2px solid #f59e0b;">
                    <div class="mr-c-title" style="color:#b45309;">⚠️ PENDÊNCIAS</div>
                    <textarea class="mr-c-textarea" data-field="pendencias">${p.pendencias || ''}</textarea>
                </div>
                <div class="mr-c-section">
                    <div class="mr-c-title">DESTINO / STATUS</div>
                    <select class="mr-status-select" data-field="statusDestino">
                        <option value="">Em Acompanhamento</option>
                        <option value="alta" ${p.statusDestino === 'alta' ? 'selected' : ''}>✅ Alta</option>
                        <option value="aguarda" ${p.statusDestino === 'aguarda' ? 'selected' : ''}>⏳ Aguarda Vaga</option>
                        <option value="internacao" ${p.statusDestino === 'internacao' ? 'selected' : ''}>🏥 Vai Internar</option>
                        <option value="cedida" ${p.statusDestino === 'cedida' ? 'selected' : ''}>🤝 Vaga Cedida</option>
                    </select>
                </div>
                <div class="mr-c-section">
                    <div class="mr-c-title">ESPECIALIDADES</div>
                    <input class="mr-c-input" value="${p.especialidades || ''}" data-field="especialidades" placeholder="Ex: NEFRO, ONCO...">
                        <button class="mr-c-btn-danger" style="margin-top:8px;" onclick="mapa.deletePatient(${id})">Excluir Paciente</button>
                </div>
            </div>
        `;

        overlay.classList.add('active');
        this.attachCockpitInputs(id);
        // Auto-expand textareas
        setTimeout(
            () =>
                body.querySelectorAll('textarea').forEach((t) => {
                    t.style.height = 'auto';
                    t.style.height = t.scrollHeight + 2 + 'px';
                }),
            20
        );
    }

    attachCockpitInputs(id) {
        const body = document.getElementById('mrCockpitBody');

        body.querySelectorAll(
            'input:not([type="checkbox"]):not([type="radio"]), textarea, select'
        ).forEach((el) => {
            el.addEventListener('input', (e) => {
                const field = e.target.dataset.field;
                if (!field) return;
                const p = this.patients.find((x) => x.id === id);
                if (p) {
                    p[field] = e.target.value;
                    this.triggerAutoSave();
                    // Update header live
                    if (['name', 'age', 'leito', 'rghc'].includes(field))
                        this.updateCockpitHeader(id);
                }
                if (e.target.tagName === 'TEXTAREA') {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 2 + 'px';
                }
            });
        });

        body.querySelectorAll('input[data-system]').forEach((el) => {
            el.addEventListener('change', (e) => {
                const sys = e.target.dataset.system;
                const p = this.patients.find((x) => x.id === id);
                if (!p) return;
                if (!p.systems) p.systems = [];
                if (e.target.checked && !p.systems.includes(sys)) p.systems.push(sys);
                if (!e.target.checked) p.systems = p.systems.filter((s) => s !== sys);
                this.triggerAutoSave();
            });
        });

        body.querySelectorAll('input[data-isolation]').forEach((el) => {
            el.addEventListener('change', (e) => {
                const iso = e.target.dataset.isolation;
                const p = this.patients.find((x) => x.id === id);
                if (!p) return;
                if (!p.isolamento) p.isolamento = [];
                if (e.target.checked && !p.isolamento.includes(iso)) p.isolamento.push(iso);
                if (!e.target.checked) p.isolamento = p.isolamento.filter((i) => i !== iso);
                this.triggerAutoSave();
            });
        });
    }

    updateCockpitHeader(id) {
        const p = this.patients.find((x) => x.id === id);
        if (!p) return;
        const h = document.getElementById('mrCockpitHeader');
        if (!h) return;
        const nameEl = h.querySelector('.mr-ch-name');
        if (nameEl) nameEl.textContent = p.name || 'Sem Nome';
    }

    setGravity(id, gravity) {
        const p = this.patients.find((x) => x.id === id);
        if (!p) return;
        p.gravity = gravity;
        this.triggerAutoSave();
        this.openCockpit(id); // Re-render
    }

    closeCockpit() {
        document.getElementById('mrCockpit').classList.remove('active');
        this.currentId = null;
        this.render(); // Refresh map to show any changes
    }

    deletePatient(id) {
        if (confirm('Tem certeza que deseja excluir este paciente?')) {
            this.patients = this.patients.filter((p) => p.id !== id);
            this.save();
            this.closeCockpit();
        }
    }

    // Zoom/Pan removed — map auto-fits viewport

    // ===================================
    // EVENTS
    // ===================================
    setupEvents() {
        // Sync with other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'buxo_patients_final') {
                this.refreshPatients();
                this.render();
            }
        });

        // View toggle
        document.getElementById('mrBtnMapa')?.addEventListener('click', () => {
            this.currentView = 'mapa';
            document.getElementById('mrBtnMapa').classList.add('active');
            document.getElementById('mrBtnLista').classList.remove('active');
            this.render();
        });

        document.getElementById('mrBtnLista')?.addEventListener('click', () => {
            this.currentView = 'lista';
            document.getElementById('mrBtnLista').classList.add('active');
            document.getElementById('mrBtnMapa').classList.remove('active');
            this.render();
        });

        // Filters
        document.querySelectorAll('.mr-filter-chip').forEach((chip) => {
            chip.addEventListener('click', () => {
                const filter = chip.dataset.filter;
                this.currentFilter =
                    this.currentFilter === filter && filter !== 'all' ? 'all' : filter;
                document
                    .querySelectorAll('.mr-filter-chip')
                    .forEach((c) => c.classList.remove('active'));
                document
                    .querySelector(`.mr-filter-chip[data-filter="${this.currentFilter}"]`)
                    ?.classList.add('active');
                this.render();
            });
        });

        // Search
        document.getElementById('mrSearch')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase().trim();
            this.render();
        });

        // Drawer toggle
        document.getElementById('mrDrawerHandle')?.addEventListener('click', () => {
            document.getElementById('mrDrawer')?.classList.toggle('open');
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.getElementById('mrAssignOverlay')) this.closeAssign();
                else if (document.getElementById('mrConflictOverlay')) this.closeConflict();
                else if (document.getElementById('mrCockpit')?.classList.contains('active'))
                    this.closeCockpit();
            }
        });

        // Listen for storage changes from other tabs/pages
        window.addEventListener('storage', (e) => {
            if (e.key === 'buxo_patients_final') {
                this.refreshPatients();
                this.render();
                if (this.currentView === 'mapa') this.setupZoomPan();
            }
        });
    }

    // ===================================
    // TOAST NOTIFICATION
    // ===================================
    toast(msg, type = 'info') {
        let t = document.getElementById('mrToast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'mrToast';
            t.className = 'mr-toast';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.className = `mr-toast ${type}`;
        setTimeout(() => t.classList.add('show'), 10);
        setTimeout(() => t.classList.remove('show'), 2500);
    }
}

// ===================================
// INIT
// ===================================
let mapa;
document.addEventListener('DOMContentLoaded', () => {
    mapa = new MapaRetaguarda();
});
