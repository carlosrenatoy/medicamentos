import { useState, useMemo, useEffect } from 'react';
import { 
  Search, Scale, Info, ChevronRight, AlertTriangle, 
  Stethoscope, Calculator, ArrowLeft, Syringe, Pill, 
  History, Settings, Plus, Edit2, Trash2, Save, X, Database,
  Droplet, Activity, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  INITIAL_MEDICINES, generateId, 
  VITAL_SIGNS_PEDIATRIC, GLASGOW_PEDIATRIC, 
  EMERGENCY_EQUIPMENT_BY_WEIGHT, TOXIDROMES, COMMON_TOXICS_ANTIDOTES 
} from './data';
import { Medicine, MedicineDose } from './types';

type ViewState = 'search' | 'detail' | 'admin-list' | 'admin-edit' | 'calculator' | 'reference';

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
  const [medicines, setMedicines] = useLocalStorage<Medicine[]>('pedidose-medicines-v7', INITIAL_MEDICINES);
  const [viewState, setViewState] = useState<ViewState>('search');
  
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
      setEditingMedicine(JSON.parse(JSON.stringify(med))); // deep copy
    } else {
      setEditingMedicine({ id: generateId(), name: '', comment: '', doses: [] });
    }
    setViewState('admin-edit');
  };

  const saveAdminEdit = () => {
    if (!editingMedicine || !editingMedicine.name.trim()) {
      alert("O nome do medicamento é obrigatório.");
      return;
    }
    
    setMedicines(prev => {
      const exists = prev.find(m => m.id === editingMedicine.id);
      if (exists) {
        return prev.map(m => m.id === editingMedicine.id ? editingMedicine : m);
      } else {
        return [...prev, editingMedicine].sort((a, b) => a.name.localeCompare(b.name));
      }
    });
    setViewState('admin-list');
  };

  const deleteMedicine = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este medicamento?")) {
      setMedicines(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => { setViewState('search'); setSelectedMedicine(null); }}
          >
            <div className="p-2 bg-white/20 rounded-lg">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">PediDose</h1>
              <p className="text-blue-100 text-xs font-medium uppercase tracking-widest">Protocolos de Pediatria</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a 
              href="/ipass-scut/index.html"
              className="p-2 rounded-full transition-colors flex items-center gap-2 px-4 hover:bg-white/10"
              title="Acessar o IPASS SCUT"
            >
              <Activity className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">IPASS/SCUT</span>
            </a>
            <button 
              onClick={() => {
                setInitialBicParams(null);
                setViewState(viewState === 'calculator' ? 'search' : 'calculator');
                setSelectedMedicine(null);
              }}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 px-4 ${viewState === 'calculator' ? 'bg-white text-blue-600 font-bold' : 'hover:bg-white/10'}`}
              title="Calculadoras de Infusão"
            >
              <Calculator className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">{viewState === 'calculator' ? 'Sair' : 'Fórmulas BIC'}</span>
            </button>
            <button 
              onClick={() => {
                setViewState(viewState === 'reference' ? 'search' : 'reference');
                setSelectedMedicine(null);
              }}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 px-4 ${viewState === 'reference' ? 'bg-white text-blue-600 font-bold' : 'hover:bg-white/10'}`}
              title="Guias e Tabelas Clínicas"
            >
              <BookOpen className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">{viewState === 'reference' ? 'Sair' : 'Guias Clínicos'}</span>
            </button>
            <button 
              onClick={() => {
                setViewState(viewState.startsWith('admin') ? 'search' : 'admin-list');
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
        
        {/* PUBLIC VIEW: Search & Detail */}
        {(viewState === 'search' || viewState === 'detail') && (
          <>
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" id="patient-card">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peso do Paciente</span>
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
              </div>
            </section>

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

                  {/* History / Quick Access */}
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
                      <p className="text-blue-100 font-medium ml-1">Cálculo de dosagem baseada no peso ({weight || '--'} kg)</p>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                      {/* Dosages Grid */}
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest px-2">
                          <Calculator className="w-4 h-4" /> Indicações e Doses
                        </h3>
                        {selectedMedicine.doses.length === 0 && (
                          <div className="p-4 bg-slate-100 rounded-xl text-center text-slate-500 text-sm">
                            Nenhuma dose calculada cadastrada neste medicamento.
                          </div>
                        )}
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
                                className={`p-5 rounded-2xl border transition-all ${calculatedValue ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-white shadow-sm'}`}
                              >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <span className="text-xs font-black text-blue-600 uppercase tracking-tighter block mb-1">{dose.label}</span>
                                    <p className="text-slate-800 font-medium leading-tight text-lg">{dose.instructions}</p>
                                    
                                    {/* Exibição adicional da fórmula cadastrada */}
                                    {(dose.mgPerKg !== undefined || dose.maxPerKg !== undefined) && (
                                      <div className="mt-2 text-xs text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded">
                                        Fórmula base: {dose.mgPerKg !== undefined ? String(dose.mgPerKg).replace('.', ',') : ''}
                                        {dose.maxPerKg !== undefined ? ` a ${String(dose.maxPerKg).replace('.', ',')}` : ''}
                                        {` ${dose.unit || 'unidade(s)'}`}
                                        {dose.maxDose ? ` (Máximo: ${dose.maxDose} ${dose.unit || ''})` : ''}
                                      </div>
                                    )}

                                    {isInfusion && (
                                      <button 
                                        onClick={() => {
                                          let parsedUnit = 'mcg_kg_min';
                                          const lowerUnit = dose.unit?.toLowerCase() || '';
                                          if (lowerUnit.includes('mg') && lowerUnit.includes('h')) parsedUnit = 'mg_kg_h';
                                          else if (lowerUnit.includes('mcg') && lowerUnit.includes('h')) parsedUnit = 'mcg_kg_h';
                                          
                                          setInitialBicParams({
                                            drugName: selectedMedicine.name,
                                            dose: dose.mgPerKg !== undefined ? String(dose.mgPerKg) : '',
                                            unit: parsedUnit as any,
                                            defaultDrugMg: dose.defaultDrugMg !== undefined ? String(dose.defaultDrugMg) : (selectedMedicine.defaultDrugMg !== undefined ? String(selectedMedicine.defaultDrugMg) : undefined),
                                            defaultVolume: dose.defaultVolume !== undefined ? String(dose.defaultVolume) : (selectedMedicine.defaultVolume !== undefined ? String(selectedMedicine.defaultVolume) : undefined),
                                            initialAmpouleConcentration: dose.ampouleConcentration_mg_ml !== undefined ? String(dose.ampouleConcentration_mg_ml) : (selectedMedicine.ampouleConcentration_mg_ml !== undefined ? String(selectedMedicine.ampouleConcentration_mg_ml) : undefined)
                                          });
                                          setViewState('calculator');
                                        }}
                                        className="mt-3 flex items-center gap-2 text-xs font-bold text-blue-700 bg-white hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors w-max border border-blue-200 shadow-sm"
                                      >
                                        <Activity className="w-4 h-4" /> Calcular em Bomba de Infusão
                                      </button>
                                    )}
                                  </div>

                                  {calculatedValue && weight && (
                                    <div className="bg-white border-2 border-blue-500 rounded-xl px-6 py-3 text-center shadow-md min-w-[140px]">
                                      <span className="block text-[10px] font-black text-blue-500 uppercase">Dose Calculada</span>
                                      <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-3xl font-black text-slate-900 tracking-tighter">{calculatedValue}</span>
                                        <span className="text-sm font-bold text-slate-500 ml-1">{dose.unit}</span>
                                      </div>
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
        {viewState === 'reference' && (
          <ReferenceView />
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
  const [calcType, setCalcType] = useState<'bic' | 'holliday'>('bic');
  const [doseUnit, setDoseUnit] = useState<'mcg_kg_min' | 'mg_kg_h' | 'mcg_kg_h'>(initialUnit || 'mcg_kg_min');
  const [dose, setDose] = useState<string>(initialDose || ''); 
  const [drugMg, setDrugMg] = useState<string>(defaultDrugMg || ''); 
  const [volume, setVolume] = useState<string>(defaultVolume || '50');
  const [ampConc, setAmpConc] = useState<string>(initialAmpouleConcentration || '');

  useEffect(() => {
    if (initialDose) setDose(initialDose);
    if (initialUnit) setDoseUnit(initialUnit);
    if (initialDrugName) setCalcType('bic');
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

    // Concentration in mcg / mL
    const totalMcg = m * 1000;
    const concMcgPerMl = totalMcg / v;

    let totalDoseMcgPerHour = 0;

    if (doseUnit === 'mcg_kg_min') {
      totalDoseMcgPerHour = d * w * 60;
    } else if (doseUnit === 'mcg_kg_h') {
      totalDoseMcgPerHour = d * w;
    } else if (doseUnit === 'mg_kg_h') {
      totalDoseMcgPerHour = d * w * 1000;
    }

    const flowRateMlPerHour = totalDoseMcgPerHour / concMcgPerMl;
    return flowRateMlPerHour.toFixed(2);
  };

  const getHolliday = () => {
    const w = parseFloat(weight);
    if (!w) return null;
    let vol24h = 0;
    if (w <= 10) {
      vol24h = w * 100;
    } else if (w <= 20) {
      vol24h = 1000 + (w - 10) * 50;
    } else {
      vol24h = 1500 + (w - 20) * 20;
    }
    const mlPerHour = vol24h / 24;
    return { vol24h, mlPerHour: mlPerHour.toFixed(1) };
  };

  const bicResult = getBicResult();
  const hollidayResult = getHolliday();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        <button 
          onClick={() => setCalcType('bic')}
          className={`flex-1 min-w-[150px] py-2 px-4 rounded-lg text-sm font-bold transition-all shadow-sm ${calcType === 'bic' ? 'bg-white text-blue-600 border border-slate-200' : 'text-slate-500 hover:bg-slate-200'}`}
        >
          <Activity className="w-4 h-4 inline-block mr-2" />
          Infusão Contínua (Drogas)
        </button>
        <button 
           onClick={() => setCalcType('holliday')}
          className={`flex-1 min-w-[150px] py-2 px-4 rounded-lg text-sm font-bold transition-all shadow-sm ${calcType === 'holliday' ? 'bg-white text-blue-600 border border-slate-200' : 'text-slate-500 hover:bg-slate-200'}`}
        >
           <Droplet className="w-4 h-4 inline-block mr-2" />
          Hidratação (Holliday)
        </button>
      </div>

      {calcType === 'bic' && (
        <div className="space-y-6">
          {initialDrugName && (
             <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm font-bold border border-blue-200 flex items-center gap-2">
               <Syringe className="w-5 h-5 text-blue-600" />
               Cálculo da Bomba para: <span className="font-black ml-1">{initialDrugName}</span>
             </div>
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
      )}

      {calcType === 'holliday' && (
        <div className="space-y-6">
          {!weight && (
             <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-200 text-center">
                Você precisa preencher o PESO no topo da tela para calcular!
             </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
               <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2">Volume Total (24h)</h3>
               <div className="text-4xl font-black text-blue-800 tracking-tighter">
                  {hollidayResult ? hollidayResult.vol24h : '---'} <span className="text-xl">mL</span>
               </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
               <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2">Velocidade de Manutenção</h3>
               <div className="text-4xl font-black text-emerald-800 tracking-tighter">
                  {hollidayResult ? Math.round(Number(hollidayResult.mlPerHour)) : '---'} <span className="text-xl">mL/h</span>
               </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600">
             <h4 className="font-bold mb-2">Regra de Holliday-Segar:</h4>
             <ul className="list-disc pl-5 space-y-1">
                <li>0 a 10 kg: 100 mL/kg</li>
                <li>10 a 20 kg: 1000 mL + 50 mL/kg (para cada kg acima de 10)</li>
                <li>Acima de 20 kg: 1500 mL + 20 mL/kg (para cada kg acima de 20)</li>
             </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function ReferenceView() {
  const [activeTab, setActiveTab] = useState<'vitals' | 'glasgow' | 'equipment' | 'antidotes'>('vitals');

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <BookOpen className="text-blue-600" /> Guias Clínicos Pediátricos
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
        <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {[
            { id: 'vitals', label: 'Sinais Vitais' },
            { id: 'glasgow', label: 'Glasgow' },
            { id: 'equipment', label: 'Equipamentos' },
            { id: 'antidotes', label: 'Antídotos' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg text-sm font-bold transition-all shadow-sm ${activeTab === tab.id ? 'bg-white text-blue-600 border border-slate-200' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'vitals' && (
            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 font-bold text-slate-600">Faixa Etária</th>
                  <th className="p-3 font-bold text-slate-600">FC (bpm)</th>
                  <th className="p-3 font-bold text-slate-600">FR (irpm)</th>
                  <th className="p-3 font-bold text-slate-600">PAS (mmHg)</th>
                  <th className="p-3 font-bold text-slate-600">PAD (mmHg)</th>
                  <th className="p-3 font-bold text-slate-600">PAM (mmHg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {VITAL_SIGNS_PEDIATRIC.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800">{item.ageGroup}</td>
                    <td className="p-3">{item.heartRate || '-'}</td>
                    <td className="p-3">{item.respiratoryRate || '-'}</td>
                    <td className="p-3">{item.systolicBP || '-'}</td>
                    <td className="p-3">{item.diastolicBP || '-'}</td>
                    <td className="p-3">{item.meanBP || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'glasgow' && (
            <table className="w-full text-left text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 font-bold text-slate-600">Domínio</th>
                  <th className="p-3 font-bold text-slate-600">Pontos</th>
                  <th className="p-3 font-bold text-slate-600">Criança (&gt; 2 anos)</th>
                  <th className="p-3 font-bold text-slate-600">Lactente (&lt; 2 anos)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {GLASGOW_PEDIATRIC.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-500 uppercase text-xs">{item.domain.replace('_', ' ')}</td>
                    <td className="p-3 font-black text-blue-600">{item.score}</td>
                    <td className="p-3 font-medium text-slate-700">{item.child}</td>
                    <td className="p-3 text-slate-700">{item.infant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'equipment' && (
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left text-sm border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-600 sticky left-0 bg-slate-50 border-r border-slate-200 z-10 shadow-[1px_0_0_0_#e2e8f0]">Equipamento</th>
                    <th className="p-3 font-bold text-slate-600">3-5 kg</th>
                    <th className="p-3 font-bold text-slate-600">6-7 kg</th>
                    <th className="p-3 font-bold text-slate-600">8-9 kg</th>
                    <th className="p-3 font-bold text-slate-600">10-11 kg</th>
                    <th className="p-3 font-bold text-slate-600">12-14 kg</th>
                    <th className="p-3 font-bold text-slate-600">15-18 kg</th>
                    <th className="p-3 font-bold text-slate-600">19-23 kg</th>
                    <th className="p-3 font-bold text-slate-600">24-29 kg</th>
                    <th className="p-3 font-bold text-slate-600">30-36 kg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {EMERGENCY_EQUIPMENT_BY_WEIGHT.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 group">
                      <td className="p-3 font-bold text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-200 z-10 transition-colors shadow-[1px_0_0_0_#e2e8f0]">{item.equipment}</td>
                      <td className="p-3 text-xs text-slate-600">{item.kg3_5 || '-'}</td>
                      <td className="p-3 text-xs text-slate-600">{item.kg6_7 || '-'}</td>
                      <td className="p-3 text-xs text-slate-600">{item.kg8_9 || '-'}</td>
                      <td className="p-3 text-xs text-slate-600">{item.kg10_11 || '-'}</td>
                      <td className="p-3 text-xs text-slate-600">{item.kg12_14 || '-'}</td>
                      <td className="p-3 text-xs text-slate-600">{item.kg15_18 || '-'}</td>
                      <td className="p-3 text-xs text-slate-600">{item.kg19_23 || '-'}</td>
                      <td className="p-3 text-xs text-slate-600">{item.kg24_29 || '-'}</td>
                      <td className="p-3 text-xs text-slate-600">{item.kg30_36 || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'antidotes' && (
            <div className="space-y-8 min-w-[300px]">
              <div>
                <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2"><Syringe className="w-5 h-5 text-blue-500"/> Antídotos Comuns</h3>
                <table className="w-full text-left text-sm border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 font-bold text-slate-600">Agente Tóxico</th>
                      <th className="p-3 font-bold text-slate-600">Antídoto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {COMMON_TOXICS_ANTIDOTES.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800">{item.intoxicationType}</td>
                        <td className="p-3 text-blue-700 font-bold bg-blue-50/30">{item.antidote}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500"/> Toxidromes</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {TOXIDROMES.map((tox, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-black text-slate-800 uppercase tracking-wide mb-3 border-b border-slate-100 pb-2 flex items-center gap-2">
                        {tox.syndrome}
                      </h4>
                      <div className="space-y-2 text-xs">
                        <p><strong className="text-slate-500 font-bold uppercase tracking-wider">Status Mental:</strong><br/> <span className="font-medium text-slate-700">{tox.mentalStatus}</span></p>
                        <p><strong className="text-slate-500 font-bold uppercase tracking-wider">Pupilas:</strong><br/> <span className="font-medium text-slate-700">{tox.pupils}</span></p>
                        <p><strong className="text-slate-500 font-bold uppercase tracking-wider">Sinais Vitais:</strong><br/> <span className="font-medium text-slate-700">{tox.vitalSigns}</span></p>
                        <p><strong className="text-slate-500 font-bold uppercase tracking-wider">Outros:</strong><br/> <span className="font-medium text-slate-700">{tox.otherManifestations}</span></p>
                        <div className="mt-3 pt-3 border-t border-slate-100 bg-orange-50 -mx-4 -mb-4 p-4 rounded-b-xl">
                          <p><strong className="text-orange-700 font-bold uppercase tracking-wider block mb-1">Agentes Comuns:</strong><span className="text-orange-900 font-medium">{tox.commonAgents}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
