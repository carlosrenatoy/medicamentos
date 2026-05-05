import { useState, useMemo, useEffect } from 'react';
import { 
  Search, Scale, Info, ChevronRight, AlertTriangle, 
  Stethoscope, Calculator, ArrowLeft, Syringe, Pill, 
  History, Settings, Plus, Edit2, Trash2, Save, X, Database,
  Droplet, Activity, BookOpen, ShieldAlert, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  INITIAL_MEDICINES, generateId, 
  VITAL_SIGNS_PEDIATRIC, GLASGOW_PEDIATRIC, 
  EMERGENCY_EQUIPMENT_BY_WEIGHT, TOXIDROMES, COMMON_TOXICS_ANTIDOTES 
} from './data';
import { Medicine, MedicineDose } from './types';
import { TrustedSource, DrugPresentation, PreparationProfile } from './prescriptionTypes';
import { StandardDilutionWarning } from './components/StandardDilutionWarning';
import { SourceLinks } from './components/SourceLinks';
import { calculateContinuousInfusion } from './prescriptionEngine';

type ViewState = 'home' | 'search' | 'detail' | 'admin-list' | 'admin-edit' | 'calculator' | 'vitals' | 'glasgow' | 'equipment' | 'antidotes' | 'toxidromes';

// Custom hook to persist data to localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default function App() {
  const [medicines, setMedicines] = useLocalStorage<Medicine[]>('pedidose-medicines-v14', INITIAL_MEDICINES);
  const [viewState, setViewState] = useState<ViewState>('home');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [weight, setWeight] = useState<string>('');
  const [history, setHistory] = useLocalStorage<string[]>('pedidose-history', []);
  
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  
  const [initialBicParams, setInitialBicParams] = useState<{
    drugName?: string, 
    dose?: string, 
    unit?: 'mcg_kg_min'|'mg_kg_h'|'mcg_kg_h',
    defaultDrugMg?: string,
    defaultVolume?: string,
    initialAmpouleConcentration?: string
  } | null>(null);

  const filteredMedicines = useMemo(() => {
    if (!searchTerm) return medicines;
    const lower = searchTerm.toLowerCase();
    return medicines.filter(m => 
      m.name.toLowerCase().includes(lower) || 
      m.comment.toLowerCase().includes(lower)
    );
  }, [searchTerm, medicines]);

  const handleSelectMedicine = (med: Medicine) => {
    setSelectedMedicine(med);
    setViewState('detail');
    if (!history.includes(med.name)) {
      setHistory(prev => [med.name, ...prev].slice(0, 5));
    }
  };

  const calculateDose = (dose: MedicineDose) => {
    const w = parseFloat(weight);
    if (isNaN(w)) return null;

    if (dose.mgPerKg !== undefined && dose.maxPerKg !== undefined && dose.mgPerKg !== dose.maxPerKg) {
       let r1 = w * dose.mgPerKg;
       let r2 = w * dose.maxPerKg;
       if (dose.maxDose) {
           r1 = Math.min(r1, dose.maxDose);
           r2 = Math.min(r2, dose.maxDose);
       }
       const f1 = r1 % 1 === 0 ? r1.toString() : r1.toFixed(2).replace(/0$/, '').replace(/\.$/, '');
       const f2 = r2 % 1 === 0 ? r2.toString() : r2.toFixed(2).replace(/0$/, '').replace(/\.$/, '');
       return `${f1} a ${f2}`;
    } else if (dose.mgPerKg !== undefined) {
        let result = w * dose.mgPerKg;
        if (dose.maxDose && result > dose.maxDose) {
            result = dose.maxDose;
        }
        return result % 1 === 0 ? result.toString() : result.toFixed(2).replace(/0$/, '').replace(/\.$/, '');
    }

    return null;
  };

  const startAdminEdit = (med?: Medicine) => {
    if (med) {
      setEditingMedicine(JSON.parse(JSON.stringify(med)));
    } else {
      setEditingMedicine({
        id: generateId(),
        name: '',
        comment: '',
        doses: []
      });
    }
    setViewState('admin-edit');
  };

  const saveAdminEdit = () => {
    if (!editingMedicine) return;
    setMedicines(prev => {
      const exists = prev.find(p => p.id === editingMedicine.id);
      if (exists) {
        return prev.map(p => p.id === editingMedicine.id ? editingMedicine : p);
      }
      return [...prev, editingMedicine];
    });
    setViewState('admin-list');
  };

  const deleteMedicine = (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir?')) {
      setMedicines(prev => prev.filter(p => p.id !== id));
    }
  };

  const getCaloricWeight = (w: number) => {
    let kcal = 0;
    if (w <= 10) kcal = w * 100;
    else if (w <= 20) kcal = 1000 + (w - 10) * 50;
    else kcal = 1500 + (w - 20) * 20;
    return (kcal / 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => { setViewState('home'); setSelectedMedicine(null); setInitialBicParams(null); }}
          >
            <div className="p-2 bg-white/20 rounded-lg">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">PedGuide</h1>
              <p className="text-blue-100 text-xs font-medium uppercase tracking-widest">Protocolos de Pediatria</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setViewState(viewState.startsWith('admin') ? 'home' : 'admin-list');
                setSelectedMedicine(null);
              }}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 px-4 ${viewState.startsWith('admin') ? 'bg-white text-blue-600 font-bold' : 'hover:bg-white/10'}`}
              title="Gerenciar Medicamentos"
            >
              <Database className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">{viewState.startsWith('admin') ? 'Sair do Painel' : 'Painel Admin'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        
        {['search', 'detail', 'calculator'].includes(viewState) && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" id="patient-card">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peso do Paciente (Obrigatório)</span>
            </div>
            <div className="p-6">
              <div className="relative group">
                <input
                  id="weight-input"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ex: 12.5"
                  className="w-full text-3xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all group-hover:border-slate-300"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-blue-500">KG</span>
              </div>
              {weight && !isNaN(parseFloat(weight)) && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">Superfície Corpórea</div>
                    <div className="text-xl font-bold text-slate-800">
                      {parseFloat(weight) <= 30 
                        ? ((parseFloat(weight) * 4 + 9) / 100).toFixed(2) 
                        : ((parseFloat(weight) * 4 + 7) / (parseFloat(weight) + 90)).toFixed(2)} <span className="text-sm font-medium text-slate-500">m²</span>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                    <div className="text-[10px] font-black text-orange-600 uppercase tracking-wider mb-1">Peso Calórico</div>
                    <div className="text-xl font-bold text-slate-800">
                      {getCaloricWeight(parseFloat(weight))} <span className="text-sm font-medium text-slate-500">kg/cal</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {viewState === 'home' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Core Features */}
              <button 
                onClick={() => setViewState('search')}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left transition-all shadow-sm group hover:shadow-md hover:border-blue-300 flex flex-col gap-3"
              >
                <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Medicamentos</h3>
                  <p className="text-xs text-slate-500 mt-1">Busque dosagem, preparo e antimicrobianos</p>
                </div>
              </button>

              <a 
                href="/ipass-scut/index.html"
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left transition-all shadow-sm group hover:shadow-md hover:border-purple-300 flex flex-col gap-3"
              >
                <div className="bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Passagem de Plantão</h3>
                  <p className="text-xs text-slate-500 mt-1">I-PASS e SCUT</p>
                </div>
              </a>

              {/* Tools & Scales */}
              <button 
                onClick={() => setViewState('vitals')}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left transition-all shadow-sm group hover:shadow-md hover:border-emerald-300 flex flex-col gap-3"
              >
                <div className="bg-emerald-100 w-10 h-10 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Sinais Vitais</h3>
                  <p className="text-xs text-slate-500 mt-1">Valores de referência por idade</p>
                </div>
              </button>

              <button 
                onClick={() => setViewState('glasgow')}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left transition-all shadow-sm group hover:shadow-md hover:border-orange-300 flex flex-col gap-3"
              >
                <div className="bg-orange-100 w-10 h-10 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Escala de Glasgow</h3>
                  <p className="text-xs text-slate-500 mt-1">Avaliação neurológica pediátrica</p>
                </div>
              </button>

              <button 
                onClick={() => setViewState('equipment')}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left transition-all shadow-sm group hover:shadow-md hover:border-indigo-300 flex flex-col gap-3"
              >
                <div className="bg-indigo-100 w-10 h-10 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Equipamentos</h3>
                  <p className="text-xs text-slate-500 mt-1">Tubo, TOT, lâmina e cateteres</p>
                </div>
              </button>

              <button 
                onClick={() => setViewState('antidotes')}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left transition-all shadow-sm group hover:shadow-md hover:border-blue-300 flex flex-col gap-3"
              >
                <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Syringe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Antídotos</h3>
                  <p className="text-xs text-slate-500 mt-1">Lista de antídotos comuns</p>
                </div>
              </button>

              <button 
                onClick={() => setViewState('toxidromes')}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left transition-all shadow-sm group hover:shadow-md hover:border-rose-300 flex flex-col gap-3"
              >
                <div className="bg-rose-100 w-10 h-10 rounded-xl flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Toxíndromes</h3>
                  <p className="text-xs text-slate-500 mt-1">Guia de intoxicações rápidas</p>
                </div>
              </button>

              {/* Coming Soon */}
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 text-left flex flex-col gap-3 opacity-70">
                <div className="bg-slate-200 w-10 h-10 rounded-xl flex items-center justify-center text-slate-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-700 text-base">Protocolos</h3>
                  <p className="text-xs text-slate-500 mt-1">Asma, Cetoacidose, Status (Em breve)</p>
                </div>
              </div>

              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 text-left flex flex-col gap-3 opacity-70">
                <div className="bg-slate-200 w-10 h-10 rounded-xl flex items-center justify-center text-slate-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-700 text-base">Doenças</h3>
                  <p className="text-xs text-slate-500 mt-1">Guias rápidos de conduta (Em breve)</p>
                </div>
              </div>

              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 text-left flex flex-col gap-3 opacity-70">
                <div className="bg-slate-200 w-10 h-10 rounded-xl flex items-center justify-center text-slate-500">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-700 text-base">Procedimentos</h3>
                  <p className="text-xs text-slate-500 mt-1">Acesso, Drenagem, IOT (Em breve)</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {(viewState === 'search' || viewState === 'detail') && (
          <>
            <AnimatePresence mode="wait">
              {viewState === 'search' ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <section className="relative">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        id="med-search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar medicação ou princípio ativo..."
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
                        autoComplete="off"
                      />
                    </div>
                  </section>

                  {history.length > 0 && !searchTerm && (
                    <section>
                      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-3 flex items-center gap-2">
                        <History className="w-4 h-4" /> Buscas Recentes
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {history.map(h => {
                          const historicMed = medicines.find(m => m.name === h);
                          if (!historicMed) return null;
                          return (
                            <button
                              key={h}
                              onClick={() => handleSelectMedicine(historicMed)}
                              className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center gap-2 shadow-sm"
                            >
                              {h}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  <section className="space-y-3">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Medicamentos Disponíveis ({filteredMedicines.length})</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="medicines-grid">
                      {filteredMedicines.map((med) => (
                        <button
                          key={med.id}
                          onClick={() => handleSelectMedicine(med)}
                          className="flex items-center justify-between p-4 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-all group shadow-sm text-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Pill className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800">{med.name}</h3>
                              <p className="text-xs text-slate-500 line-clamp-1">{med.doses[0]?.instructions || "Ver doses cadastradas"}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>

                    {filteredMedicines.length === 0 && (
                      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Nenhum resultado</h3>
                        <p className="text-slate-500 text-sm mb-4">A busca não retornou nenhum medicamento.</p>
                      </div>
                    )}
                  </section>
                </motion.div>
              ) : selectedMedicine && (
                <motion.section
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <button 
                    onClick={() => { setViewState('search'); setSelectedMedicine(null); }}
                    className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Nova Busca
                  </button>

                  <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
                    <div className="bg-blue-600 p-8 text-white">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                          <Syringe className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black">{selectedMedicine.name}</h2>
                      </div>
                      <p className="text-blue-100 font-medium ml-1">
                        Cálculo de dosagem baseada no peso: <span className="font-bold">{weight || '--'} kg</span>
                      </p>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest px-2">
                          <Calculator className="w-4 h-4" /> Indicações e Doses
                        </h3>
                        <div className="grid gap-4">
                          {selectedMedicine.doses.map((dose) => {
                            const calculatedValue = calculateDose(dose);
                            const isInfusion = dose.unit?.toLowerCase().includes('min') || 
                                               dose.unit?.toLowerCase().includes('h') || 
                                               dose.instructions.toLowerCase().includes('contínua') || 
                                               dose.label.toLowerCase().includes('contínua');
                            return (
                              <div 
                                key={dose.id}
                                className={`p-5 rounded-2xl border transition-all flex flex-col ${calculatedValue ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-white shadow-sm'}`}
                              >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <span className="text-xs font-black text-blue-600 uppercase tracking-tighter block mb-1">{dose.label}</span>
                                    <p className="text-slate-800 font-medium leading-tight text-lg">{dose.instructions}</p>
                                    
                                    {(dose.mgPerKg !== undefined || dose.maxPerKg !== undefined) && (
                                      <div className="mt-2 text-xs text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded">
                                        Fórmula base: {dose.mgPerKg !== undefined ? String(dose.mgPerKg).replace('.', ',') : ''}
                                        {dose.maxPerKg !== undefined ? ` a ${String(dose.maxPerKg).replace('.', ',')}` : ''}
                                        {` ${dose.unit || 'unidade(s)'}`}
                                        {dose.maxDose ? ` (Máximo: ${dose.maxDose} ${dose.unit || ''})` : ''}
                                      </div>
                                    )}

                                    {(() => {
                                      const activePresentations = dose.presentations || selectedMedicine.presentations;
                                      if (activePresentations && activePresentations.length > 0 && calculatedValue && !dose.hideVolumeCalc && !isInfusion) {
                                        return (
                                          <div className="mt-4 border-t pt-3 border-slate-100">
                                            <div className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">Apresentações e Volume a Administrar:</div>
                                            <div className="flex flex-col gap-3">
                                              {activePresentations.map(pres => {
                                                // Handle range strings
                                                const parts = calculatedValue.toString().split('a').map(p => parseFloat(p.replace(',', '.').trim()));
                                                
                                                // Divide by interval if needed
                                                let v1 = parts[0] / pres.concentration_mg_ml;
                                                let v2 = parts.length > 1 ? parts[1] / pres.concentration_mg_ml : null;

                                                if (dose.divideBy) {
                                                    v1 = v1 / dose.divideBy;
                                                    if (v2) v2 = v2 / dose.divideBy;
                                                }

                                                const formatVol = (v: number) => v < 1 ? v.toFixed(2) : v.toFixed(1).replace(/\.0$/, '');
                                                const volStr = v2 ? `${formatVol(v1)} a ${formatVol(v2)}` : formatVol(v1);
                                                
                                                if (pres.isPill) {
                                                  return (
                                                    <div key={pres.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                                      <div className="font-bold text-sm text-slate-700 flex items-center gap-2"><Pill className="w-4 h-4 text-blue-500" /> {pres.description}</div>
                                                      <div className="text-sm font-medium text-slate-600 mt-2">
                                                        Diluir 1 comprimido ({pres.concentration_mg_ml}mg) em 10 mL de água filtrada ou SF.
                                                        <br/>
                                                        <span className="text-blue-700 font-bold">Dar {v2 ? `${formatVol((parts[0] / dose.divideBy!) / (pres.concentration_mg_ml / 10))} a ${formatVol((parts[1] / dose.divideBy!) / (pres.concentration_mg_ml / 10))}` : formatVol((parts[0] / dose.divideBy!) / (pres.concentration_mg_ml / 10))} mL</span> da mistura <span className="font-bold">{dose.intervalText || ''}</span>
                                                      </div>
                                                    </div>
                                                  );
                                                }

                                                return (
                                                  <div key={pres.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center">
                                                    <div className="font-bold text-sm text-slate-700 flex items-center gap-2"><Droplet className="w-4 h-4 text-blue-500" /> {pres.description}</div>
                                                    <div className="text-right">
                                                      <div className="text-lg font-black text-blue-600">
                                                        {volStr} mL
                                                      </div>
                                                      <div className="text-xs font-bold text-slate-500 uppercase">{dose.intervalText || 'Dose única'}</div>
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()}

                                    {isInfusion && (
                                      <div className="mt-4 border-t border-slate-100 pt-3">
                                        <button 
                                          onClick={() => {
                                            setInitialBicParams({
                                              drugName: selectedMedicine.name,
                                              dose: calculatedValue?.toString().split('a')[0].trim(),
                                              unit: dose.unit?.includes('min') ? 'mcg_kg_min' : (dose.unit?.includes('mg') ? 'mg_kg_h' : 'mcg_kg_h'),
                                              defaultDrugMg: dose.defaultDrugMg ? String(dose.defaultDrugMg) : undefined,
                                              defaultVolume: dose.defaultVolume ? String(dose.defaultVolume) : undefined,
                                              initialAmpouleConcentration: dose.ampouleConcentration_mg_ml !== undefined ? String(dose.ampouleConcentration_mg_ml) : (selectedMedicine.presentations?.[0]?.concentration_mg_ml !== undefined ? String(selectedMedicine.presentations[0].concentration_mg_ml) : undefined)
                                            });
                                            setViewState('calculator');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                          }}
                                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                                        >
                                          <Calculator className="w-5 h-5" /> Calcular em Bomba de Infusão
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {calculatedValue && weight && (
                                    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 min-w-[140px] text-center md:text-right shrink-0">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Dose Calculada (Total Dia)</span>
                                      <div className="text-2xl font-black text-slate-800 break-all">{calculatedValue}</div>
                                      <div className="text-xs font-bold text-slate-500">{dose.unit}</div>
                                    </div>
                                  )}
                                  {!calculatedValue && weight && (dose.mgPerKg !== undefined || dose.maxPerKg !== undefined) && (
                                    <div className="text-xs text-slate-400 italic">Preencha o peso corretamente.</div>
                                  )}
                                  {dose.mgPerKg === undefined && dose.maxPerKg === undefined && (
                                     <div className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-center">Consulta de<br />orientação</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Comments Section */}
                      {selectedMedicine.comment && (
                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg shrink-0">
                              <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-black text-orange-800 text-sm mb-2 uppercase tracking-wide">Observações Clínicas</h4>
                              <p className="text-orange-700 text-sm leading-relaxed font-medium">
                                {selectedMedicine.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <SourceLinks sources={Array.isArray((selectedMedicine as any).sources) ? (selectedMedicine as any).sources : []} />

                      <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center justify-center border border-slate-200">
                        <Info className="w-3 h-3" />
                        Responsabilidade exclusiva do médico prescritor.
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
            
            {/* Floating Action Hint */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4 pointer-events-none">
              {!weight && viewState === 'search' && (
                <div className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center justify-center gap-3 animate-bounce mx-auto w-max">
                  <Scale className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-bold">Informe o peso</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* CALCULATOR VIEW */}
        {viewState === 'calculator' && (
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Calculator className="text-blue-600" /> Calculadoras
              </h2>
            </div>
            
            <InfusionCalculator 
              weight={weight} 
              initialDrugName={initialBicParams?.drugName} 
              initialDose={initialBicParams?.dose} 
              initialUnit={initialBicParams?.unit} 
              defaultDrugMg={initialBicParams?.defaultDrugMg}
              defaultVolume={initialBicParams?.defaultVolume}
              initialAmpouleConcentration={initialBicParams?.initialAmpouleConcentration}
            />
          </motion.section>
        )}

        {/* ADMIN VIEW - LIST */}
        {viewState === 'admin-list' && (
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 text-blue-800 text-sm">
              <Info className="w-5 h-5 shrink-0 text-blue-600" />
              <p><strong>Modo de Edição Local.</strong> Suas alterações ficarão salvas apenas neste dispositivo/navegador. Ideal para personalizar seu próprio formulário de prescrições.</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Database className="text-blue-600" /> Acervo de Medicamentos
              </h2>
              <button 
                onClick={() => startAdminEdit()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center shadow-md"
              >
                <Plus className="w-5 h-5" /> Adicionar Novo
              </button>
            </div>
            
            <div className="relative group mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar para gerenciar..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            <div className="grid gap-3">
              {filteredMedicines.map(med => (
                <div key={med.id} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4 justify-between shadow-sm">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{med.name}</h3>
                    <p className="text-slate-500 text-sm">{med.doses.length} indicações mapeadas</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => startAdminEdit(med)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors border border-slate-200"
                    >
                      <Edit2 className="w-4 h-4" /> Editar
                    </button>
                    <button 
                      onClick={() => deleteMedicine(med.id)}
                      className="flex-none p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-100"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ADMIN VIEW - EDIT */}
        {viewState === 'admin-edit' && editingMedicine && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Settings className="text-slate-400" />
                {editingMedicine.name ? `Editar: ${editingMedicine.name}` : 'Novo Medicamento'}
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setViewState('admin-list')}
                  className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={saveAdminEdit}
                  className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" /> Salvar
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Informações Básicas</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Nome do Medicamento ou Princípio Ativo</label>
                    <input 
                      type="text" 
                      value={editingMedicine.name}
                      onChange={e => setEditingMedicine({...editingMedicine, name: e.target.value})}
                      placeholder="Ex: Adrenalina, Ampicilina..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Observações Clínicas (Contraindicações, alertas, vias)</label>
                    <textarea 
                      value={editingMedicine.comment}
                      onChange={e => setEditingMedicine({...editingMedicine, comment: e.target.value})}
                      placeholder="Ex: Risco de necrose tecidual. Interromper se reações adversas graves..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Doses */}
              <div>
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h3 className="text-lg font-bold text-slate-800">Cálculos e Indicações</h3>
                  <button 
                    onClick={() => {
                      setEditingMedicine({
                        ...editingMedicine,
                        doses: [...editingMedicine.doses, { id: generateId(), label: '', instructions: '', unit: 'mg' }]
                      });
                    }}
                    className="flex items-center gap-1 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Indicação
                  </button>
                </div>

                <div className="space-y-4">
                  {editingMedicine.doses.map((dose, index) => (
                    <div key={dose.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                      <button 
                        onClick={() => {
                          const newDoses = [...editingMedicine.doses];
                          newDoses.splice(index, 1);
                          setEditingMedicine({...editingMedicine, doses: newDoses});
                        }}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 p-1 bg-white rounded-md border border-slate-200 shadow-sm"
                        title="Remover indicação"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cenário Clínico / Uso</label>
                          <input 
                            value={dose.label}
                            onChange={e => {
                              const newDoses = [...editingMedicine.doses];
                              newDoses[index].label = e.target.value;
                              setEditingMedicine({...editingMedicine, doses: newDoses});
                            }}
                            placeholder="Ex: Dose de Ataque IV, Asma Leve, Profilaxia"
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500"
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Instruções Prescritivas para Consulta</label>
                          <input 
                            value={dose.instructions}
                            onChange={e => {
                              const newDoses = [...editingMedicine.doses];
                              newDoses[index].instructions = e.target.value;
                              setEditingMedicine({...editingMedicine, doses: newDoses});
                            }}
                            placeholder="Ex: 50 mg/kg em dose única ou a cada 12h"
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 font-medium text-slate-800"
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mín/Fixa p/ Kg (ex: 0.1)</label>
                            <input 
                              type="number"
                              step="any"
                              value={dose.mgPerKg === undefined ? '' : dose.mgPerKg}
                              onChange={e => {
                                const val = parseFloat(e.target.value);
                                const newDoses = [...editingMedicine.doses];
                                newDoses[index].mgPerKg = isNaN(val) ? undefined : val;
                                setEditingMedicine({...editingMedicine, doses: newDoses});
                              }}
                              placeholder="Fator fixo ou mín"
                              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Máx p/ Kg (Range)</label>
                            <input 
                              type="number"
                              step="any"
                              value={dose.maxPerKg === undefined ? '' : dose.maxPerKg}
                              onChange={e => {
                                const val = parseFloat(e.target.value);
                                const newDoses = [...editingMedicine.doses];
                                newDoses[index].maxPerKg = isNaN(val) ? undefined : val;
                                setEditingMedicine({...editingMedicine, doses: newDoses});
                              }}
                              placeholder="Campo opcional"
                              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Unid. (mg, mL)</label>
                          <input 
                            value={dose.unit || ''}
                            onChange={e => {
                              const newDoses = [...editingMedicine.doses];
                              newDoses[index].unit = e.target.value;
                              setEditingMedicine({...editingMedicine, doses: newDoses});
                            }}
                            placeholder="mg"
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Máximo Módulo (Teto)</label>
                          <input 
                            type="number"
                            step="any"
                            value={dose.maxDose || ''}
                            onChange={e => {
                              const val = parseFloat(e.target.value);
                              const newDoses = [...editingMedicine.doses];
                              newDoses[index].maxDose = isNaN(val) ? undefined : val;
                              setEditingMedicine({...editingMedicine, doses: newDoses});
                            }}
                            placeholder="Teto de dose"
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 font-mono"
                          />
                        </div>
                        
                      </div>
                    </div>
                  ))}
                  
                  {editingMedicine.doses.length === 0 && (
                    <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-500 bg-slate-50">
                      Nenhuma dose para cálculo automático cadastrada. Adicione uma indicação acima para que o app calcule quando o usuário informar o peso.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button 
                  onClick={saveAdminEdit}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
                >
                  <Save className="w-5 h-5" /> Salvar Medicamento
              </button>
            </div>
          </motion.section>
        )}

        {/* REFERENCE VIEW */}
        {['vitals', 'glasgow', 'equipment', 'antidotes', 'toxidromes'].includes(viewState) && (
          <ReferenceView activeTab={viewState as 'vitals' | 'glasgow' | 'equipment' | 'antidotes' | 'toxidromes'} setViewState={setViewState} />
        )}
      </main>
    </div>
  );
}

function InfusionCalculator({ 
  weight, 
  initialDrugName, 
  initialDose, 
  initialUnit,
  defaultDrugMg,
  defaultVolume,
  initialAmpouleConcentration
}: { 
  weight: string, 
  initialDrugName?: string, 
  initialDose?: string, 
  initialUnit?: 'mcg_kg_min' | 'mg_kg_h' | 'mcg_kg_h',
  defaultDrugMg?: string,
  defaultVolume?: string,
  initialAmpouleConcentration?: string
}) {
  const [doseUnit, setDoseUnit] = useState<'mcg_kg_min' | 'mg_kg_h' | 'mcg_kg_h'>(initialUnit || 'mcg_kg_min');
  const [dose, setDose] = useState<string>(initialDose || ''); 
  const [drugMg, setDrugMg] = useState<string>(defaultDrugMg || ''); 
  const [volume, setVolume] = useState<string>(defaultVolume || '50');
  const [ampConc, setAmpConc] = useState<string>(initialAmpouleConcentration || '');

  useEffect(() => {
    if (initialDose) setDose(initialDose);
    if (initialUnit) setDoseUnit(initialUnit);
    if (defaultDrugMg) setDrugMg(defaultDrugMg);
    if (defaultVolume) setVolume(defaultVolume);
    if (initialAmpouleConcentration) setAmpConc(initialAmpouleConcentration);

    if (weight && initialUnit === 'mcg_kg_min' && !drugMg && !defaultDrugMg) {
       // Auto-suggest dilution for mcg_kg_min (Rule of 0.3x) if no specific default
       setVolume('50');
       setDrugMg((parseFloat(weight) * 0.3).toFixed(1));
    }
  }, [initialDose, initialUnit, initialDrugName, weight, defaultDrugMg, defaultVolume, initialAmpouleConcentration]);

  // Calculates Flow Rate (mL/h) from Dose
  const getBicResult = () => {
    const w = parseFloat(weight);
    const d = parseFloat(dose);
    const m = parseFloat(drugMg);
    const v = parseFloat(volume);

    if (!w || !d || !m || !v) return null;

    try {
      const presentation: DrugPresentation = {
        id: 'temp', description: '',
        drugAmount: ampConc && !isNaN(parseFloat(ampConc)) ? parseFloat(ampConc) : 1,
        drugUnit: 'mg',
        volumeMl: 1,
        concentrationAmount: ampConc && !isNaN(parseFloat(ampConc)) ? parseFloat(ampConc) : 1,
        concentrationUnit: 'mg',
        concentrationVolumeMl: 1,
      };

      const preparation: PreparationProfile = {
        id: 'temp', name: '',
        drugAmount: m,
        drugUnit: 'mg',
        finalVolumeMl: v,
        allowedDiluents: [],
        preferredDiluent: 'unknown',
        accessAllowed: 'unknown'
      };

      let calcUnit: any = doseUnit === 'mcg_kg_min' ? 'mcg/kg/min' : 
                          (doseUnit === 'mcg_kg_h' ? 'mcg/kg/h' : 'mg/kg/h');

      const result = calculateContinuousInfusion({
        weightKg: w,
        dose: d,
        doseUnit: calcUnit,
        preparation,
        presentation
      });

      return result.rateMlHour.toFixed(2);
    } catch(e) {
      console.warn("Calculation engine error:", e);
      return null;
    }
  };

  const bicResult = getBicResult();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="space-y-6">
        {initialDrugName && (
           <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm font-bold border border-blue-200 flex items-center gap-2">
             <Syringe className="w-5 h-5 text-blue-600" />
             Cálculo da Bomba para: <span className="font-black ml-1">{initialDrugName}</span>
           </div>
        )}
        {initialDrugName && (
          <StandardDilutionWarning 
            defaultDrugMg={defaultDrugMg ? parseFloat(defaultDrugMg) : undefined}
            defaultVolumeMl={defaultVolume ? parseFloat(defaultVolume) : undefined}
            ampouleConcentrationMgMl={initialAmpouleConcentration ? parseFloat(initialAmpouleConcentration) : undefined}
          />
        )}
        {!weight && (
           <div className="p-3 bg-orange-50 text-orange-600 rounded-lg text-sm font-bold border border-orange-200 text-center">
              Preencha o PESO no topo da tela para calcular.
           </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Dose Alvo Desejada</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  step="any"
                  value={dose}
                  onChange={e => setDose(e.target.value)}
                  placeholder="Ex: 0.1"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 font-mono"
                />
                <select 
                  value={doseUnit}
                  onChange={e => setDoseUnit(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 text-sm font-bold text-slate-700"
                >
                  <option value="mcg_kg_min">mcg/kg/min</option>
                  <option value="mg_kg_h">mg/kg/h</option>
                  <option value="mcg_kg_h">mcg/kg/h</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Preparo da Solução</h4>
                {weight && doseUnit === 'mcg_kg_min' && (
                  <div className="flex gap-2">
                     <button 
                       onClick={() => {
                         setVolume('50');
                         setDrugMg((parseFloat(weight) * 0.3).toFixed(1));
                       }}
                       className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                       title="Concentração padrão para 1 mL/h = 0.1 mcg/kg/min"
                     >
                       Regra (0.3x)
                     </button>
                     <button 
                       onClick={() => {
                         setVolume('50');
                         setDrugMg((parseFloat(weight) * 3).toFixed(1));
                       }}
                       className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                       title="Concentração padrão para 1 mL/h = 1 mcg/kg/min"
                     >
                       Regra (3x)
                     </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Droga Total (mg)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        step="any"
                        value={drugMg}
                        onChange={e => setDrugMg(e.target.value)}
                        placeholder="Ex: 5"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1" title="Concentração da Ampola em mg/mL">Ampola (mg/mL)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        step="any"
                        value={ampConc}
                        onChange={e => setAmpConc(e.target.value)}
                        placeholder="Opcional"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Volume Final Desejado (mL)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="any"
                      value={volume}
                      onChange={e => setVolume(e.target.value)}
                      placeholder="Ex: 50"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">mL</span>
                  </div>
                </div>

                {/* Sugestão de Prescrição */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mt-4">
                   <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-1"><Pill className="w-3 h-3" /> Como Prescrever</h4>
                   <div className="text-sm font-mono text-slate-800 space-y-2">
                      {parseFloat(drugMg) && parseFloat(volume) ? (
                         parseFloat(ampConc) ? (
                           <>
                             <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-100">
                               <span>Soro (SF/SG)</span>
                               <span className="font-bold">{(parseFloat(volume) - (parseFloat(drugMg) / parseFloat(ampConc))).toFixed(1)} mL</span>
                             </div>
                             <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-100">
                               <span>{initialDrugName || 'Fármaco'} ({drugMg} mg)</span>
                               <span className="font-bold">{(parseFloat(drugMg) / parseFloat(ampConc)).toFixed(1)} mL</span>
                             </div>
                             <div className="pt-2 border-t border-blue-200 font-black text-right text-blue-900 mt-2">
                                Volume Total: {volume} mL
                             </div>
                             {defaultDrugMg && parseFloat(defaultDrugMg) === parseFloat(drugMg) && (
                               <div className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded inline-block mt-2">DILUIÇÃO PADRÃO</div>
                             )}
                           </>
                         ) : (
                           <>
                             <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-100">
                               <span>{initialDrugName || 'Fármaco'}</span>
                               <span className="font-bold">{drugMg} mg</span>
                             </div>
                             <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-100">
                               <span>Soro Fisiológico 0,9%</span>
                               <span className="font-bold">q.s.p {volume} mL</span>
                             </div>
                           </>
                         )
                      ) : (
                         <span className="text-slate-500 font-sans text-xs">Preencha os dados do preparo acima.</span>
                      )}
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 flex flex-col justify-center relative">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Velocidade na Bomba</h3>
            {bicResult ? (
              (() => {
                const vol24h = parseFloat(bicResult) * 24;
                const totalMg24h = vol24h * (parseFloat(drugMg) / parseFloat(volume));
                const totalFarmacoDisplay = totalMg24h < 1 
                  ? `${(totalMg24h * 1000).toFixed(1)} mcg` 
                  : `${totalMg24h.toFixed(1)} mg`;
                
                return (
                  <>
                    <div className="flex flex-col items-center mb-6">
                      <div className="text-5xl font-black text-blue-600 tracking-tighter mb-2">{bicResult}</div>
                      <div className="text-base font-bold text-slate-500 uppercase tracking-widest">mL / hora</div>
                    </div>
                    
                    <div className="mt-auto bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Scale className="w-3 h-3" /> Previsão para 24 horas
                      </h4>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                        <span className="text-xs font-bold text-slate-500">Volume (Soro + Droga)</span>
                        <span className="text-sm font-black text-slate-700">{vol24h.toFixed(1)} mL</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                        <span className="text-xs font-bold text-slate-500">Total de Fármaco</span>
                        <span className="text-sm font-black text-slate-700">{totalFarmacoDisplay}</span>
                      </div>
                      {parseFloat(ampConc) > 0 && (
                        <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-2 rounded-lg">
                          <span className="text-xs font-bold text-blue-700">Volume Total do Fármaco (24h)</span>
                          <span className="text-sm font-black text-blue-800">
                            {(totalMg24h / parseFloat(ampConc)).toFixed(2)} mL
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()
            ) : (
              <div className="text-slate-400 font-medium text-center h-full flex items-center justify-center">
                <div>
                   Preencha todos os campos (e o PESO) para calcular a bomba e a previsão de 24h.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReferenceView({ activeTab, setViewState }: { activeTab: 'vitals' | 'glasgow' | 'equipment' | 'antidotes' | 'toxidromes', setViewState: (state: any) => void }) {
  const titleMap = {
    'vitals': 'Sinais Vitais',
    'glasgow': 'Escala de Glasgow Pediátrica',
    'equipment': 'Equipamentos de Emergência',
    'antidotes': 'Antídotos Comuns',
    'toxidromes': 'Guia de Toxíndromes'
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col justify-between items-start gap-4">
        <button 
          onClick={() => setViewState('home')}
          className="text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Voltar
        </button>
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <BookOpen className="text-blue-600" /> {titleMap[activeTab]}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'vitals' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VITAL_SIGNS_PEDIATRIC.map((item, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-all text-sm">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 border-b border-slate-200 pb-2">{item.ageGroup}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">FC (bpm)</span>
                      <span className="font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{item.heartRate || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">FR (irpm)</span>
                      <span className="font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">{item.respiratoryRate || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">PA Sistólica</span>
                      <span className="font-bold text-slate-700">{item.systolicBP || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">PA Diastólica</span>
                      <span className="font-bold text-slate-700">{item.diastolicBP || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'glasgow' && (
            <div className="space-y-6">
              {['abertura_ocular', 'resposta_verbal', 'resposta_motora'].map(domain => (
                <div key={domain} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <h3 className="font-black text-slate-700 uppercase tracking-wider text-sm flex items-center gap-2">
                       {domain.replace('_', ' ')}
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {GLASGOW_PEDIATRIC.filter(g => g.domain === domain).map((item, i) => (
                      <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center shrink-0">
                            {item.score}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{item.child}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Criança (&gt; 2 anos)</div>
                          </div>
                        </div>
                        <div className="md:text-right border-l-2 md:border-l-0 pl-4 md:pl-0 border-slate-200 ml-5 md:ml-0">
                          <div className="font-medium text-slate-700">{item.infant}</div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lactente (&lt; 2 anos)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 text-blue-800 text-sm mb-6">
                <Info className="w-5 h-5 shrink-0 text-blue-600" />
                <p>Selecione a faixa de peso do paciente para visualizar os equipamentos recomendados.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'kg3_5', label: '3 a 5 kg' },
                  { key: 'kg6_7', label: '6 a 7 kg' },
                  { key: 'kg8_9', label: '8 a 9 kg' },
                  { key: 'kg10_11', label: '10 a 11 kg' },
                  { key: 'kg12_14', label: '12 a 14 kg' },
                  { key: 'kg15_18', label: '15 a 18 kg' },
                  { key: 'kg19_23', label: '19 a 23 kg' },
                  { key: 'kg24_29', label: '24 a 29 kg' },
                  { key: 'kg30_36', label: '30 a 36 kg' }
                ].map(weightGroup => (
                  <details key={weightGroup.key} className="bg-white border border-slate-200 rounded-2xl shadow-sm group">
                    <summary className="font-bold text-lg p-5 cursor-pointer list-none flex justify-between items-center hover:bg-slate-50 transition-colors rounded-2xl group-open:rounded-b-none group-open:bg-slate-50 group-open:border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <Scale className="w-5 h-5 text-indigo-500" />
                        <span className="text-slate-800">{weightGroup.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="p-5 space-y-3 bg-white rounded-b-2xl">
                      {EMERGENCY_EQUIPMENT_BY_WEIGHT.map((item, i) => {
                        const val = (item as any)[weightGroup.key];
                        if (!val || val === '-') return null;
                        return (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 last:pb-0">
                            <span className="text-slate-500 font-medium text-sm">{item.equipment}</span>
                            <span className="font-bold text-slate-800 text-sm text-right bg-slate-100 px-3 py-1 rounded-lg">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'antidotes' && (
            <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 text-blue-800 text-sm mb-6">
                  <Info className="w-5 h-5 shrink-0 text-blue-600" />
                  <p>Guia de referência rápida para antídotos em emergências toxicológicas.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {COMMON_TOXICS_ANTIDOTES.map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 shadow-sm hover:border-blue-200 transition-colors gap-3">
                      <span className="font-bold text-slate-800 text-sm">{item.intoxicationType}</span>
                      <span className="text-blue-700 font-black bg-blue-100 px-3 py-1.5 rounded-lg text-xs sm:text-right uppercase tracking-wider">{item.antidote}</span>
                    </div>
                  ))}
                </div>
            </div>
          )}

          {activeTab === 'toxidromes' && (
            <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 text-rose-800 text-sm mb-6">
                  <Info className="w-5 h-5 shrink-0 text-rose-600" />
                  <p>Principais síndromes tóxicas, suas manifestações clínicas e agentes causadores.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TOXIDROMES.map((tox, i) => (
                    <div key={i} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-black text-slate-800 uppercase tracking-wide mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                        {tox.syndrome}
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-start gap-2">
                          <strong className="text-slate-500 font-bold uppercase tracking-wider text-xs shrink-0">Status Mental</strong>
                          <span className="font-medium text-slate-800 text-right">{tox.mentalStatus}</span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <strong className="text-slate-500 font-bold uppercase tracking-wider text-xs shrink-0">Pupilas</strong>
                          <span className="font-medium text-slate-800 text-right">{tox.pupils}</span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <strong className="text-slate-500 font-bold uppercase tracking-wider text-xs shrink-0">Sinais Vitais</strong>
                          <span className="font-medium text-slate-800 text-right">{tox.vitalSigns}</span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <strong className="text-slate-500 font-bold uppercase tracking-wider text-xs shrink-0">Outros</strong>
                          <span className="font-medium text-slate-800 text-right">{tox.otherManifestations}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 bg-orange-50 -mx-5 -mb-5 p-5 rounded-b-2xl">
                          <p><strong className="text-orange-700 font-bold uppercase tracking-wider text-xs block mb-2">Agentes Comuns:</strong><span className="text-orange-900 font-medium">{tox.commonAgents}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
