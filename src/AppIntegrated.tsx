import { useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, Calculator, ExternalLink, Pill, Scale, Search, ShieldAlert, Stethoscope } from 'lucide-react';
import { INITIAL_MEDICINES } from './data';
import type { Medicine, MedicineDose } from './types';
import { auditLegacyMedicine } from './legacyMedicineAudit';
import { getDilutionMode, getForecastLabel, getPreparationVolumes } from './standardDilutionRules';
import { TRUSTED_SOURCES } from './trustedSources';

type CalculatorState = { medicine: Medicine; dose: MedicineDose };
type UnitMode = 'mcg_kg_min' | 'mcg_kg_h' | 'mg_kg_h';

const parseNumber = (value?: string | number, fallback = 0) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (!value) return fallback;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const fmt = (value: number, decimals = 2) => Number.isFinite(value)
  ? value.toFixed(decimals).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1')
  : '--';

const isInfusionDose = (dose: MedicineDose) => {
  const text = `${dose.label} ${dose.instructions} ${dose.unit ?? ''}`.toLowerCase();
  return text.includes('/min') || text.includes('/h') || text.includes('contínua') || text.includes('continua');
};

const inferUnitMode = (dose: MedicineDose): UnitMode => {
  const unit = (dose.unit ?? '').toLowerCase();
  if (unit.includes('mg') && unit.includes('h')) return 'mg_kg_h';
  if (unit.includes('mcg') && unit.includes('h')) return 'mcg_kg_h';
  return 'mcg_kg_min';
};

const calculateDose = (weight: string, dose: MedicineDose) => {
  const weightKg = parseNumber(weight);
  if (!weightKg || dose.mgPerKg === undefined) return null;
  const low = weightKg * dose.mgPerKg;
  const high = dose.maxPerKg !== undefined && dose.maxPerKg !== dose.mgPerKg ? weightKg * dose.maxPerKg : null;
  const cap = (value: number) => dose.maxDose ? Math.min(value, dose.maxDose) : value;
  return high !== null ? `${fmt(cap(low))} a ${fmt(cap(high))}` : fmt(cap(low));
};

function MiniInfusionCalculator({ state, weight, onBack }: { state: CalculatorState; weight: string; onBack: () => void }) {
  const { medicine, dose } = state;
  const [targetDose, setTargetDose] = useState(String(dose.mgPerKg ?? '').replace('.', ','));
  const [unitMode, setUnitMode] = useState<UnitMode>(inferUnitMode(dose));
  const defaultDrugMg = dose.defaultDrugMg ?? medicine.defaultDrugMg;
  const defaultVolume = dose.defaultVolume ?? medicine.defaultVolume;
  const defaultConcentration = dose.ampouleConcentration_mg_ml ?? medicine.ampouleConcentration_mg_ml;
  const rule = getDilutionMode({ defaultDrugMg, defaultVolumeMl: defaultVolume, ampouleConcentrationMgMl: defaultConcentration });

  const [drugMg, setDrugMg] = useState(defaultDrugMg ? String(defaultDrugMg).replace('.', ',') : '');
  const [volumeMl, setVolumeMl] = useState(defaultVolume ? String(defaultVolume).replace('.', ',') : '');
  const [ampoule, setAmpoule] = useState(defaultConcentration ? String(defaultConcentration).replace('.', ',') : '');
  const locked = rule.lockPreparationFields;

  const result = useMemo(() => {
    const w = parseNumber(weight);
    const doseValue = parseNumber(targetDose);
    const totalDrugMg = parseNumber(drugMg);
    const finalVolumeMl = parseNumber(volumeMl);
    const ampouleMgMl = parseNumber(ampoule);
    if (!w || !doseValue || !totalDrugMg || !finalVolumeMl || !ampouleMgMl) return null;
    const prep = getPreparationVolumes({ totalDrugMg, finalVolumeMl, ampouleConcentrationMgMl: ampouleMgMl });
    let doseMcgHour = 0;
    if (unitMode === 'mcg_kg_min') doseMcgHour = doseValue * w * 60;
    if (unitMode === 'mcg_kg_h') doseMcgHour = doseValue * w;
    if (unitMode === 'mg_kg_h') doseMcgHour = doseValue * w * 1000;
    const rateMlHour = doseMcgHour / prep.finalConcentrationMcgMl;
    return { ...prep, rateMlHour, solution24h: rateMlHour * 24, drug24hMcg: rateMlHour * 24 * prep.finalConcentrationMcgMl };
  }, [weight, targetDose, drugMg, volumeMl, ampoule, unitMode]);

  return <section className="space-y-4">
    <button onClick={onBack} className="flex items-center gap-2 font-black text-blue-700"><ArrowLeft className="h-4 w-4" /> Voltar</button>
    <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="text-xs font-black uppercase tracking-widest text-blue-600">Calculadora BIC segura</div>
      <h2 className="text-2xl font-black">{medicine.name}</h2>
      <p className="text-sm font-bold text-slate-500">{dose.label}</p>
      <div className={`mt-4 rounded-2xl border p-4 text-sm font-bold ${rule.hasStandardDilution ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-amber-200 bg-amber-50 text-amber-950'}`}>
        <div className="mb-1 font-black uppercase tracking-widest">{rule.warningTitle}</div>
        {rule.warningText}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <input value={targetDose} onChange={(e) => setTargetDose(e.target.value)} className="rounded-xl border p-3 font-black" placeholder="Dose alvo" />
        <select value={unitMode} onChange={(e) => setUnitMode(e.target.value as UnitMode)} className="rounded-xl border p-3 font-black"><option value="mcg_kg_min">mcg/kg/min</option><option value="mcg_kg_h">mcg/kg/h</option><option value="mg_kg_h">mg/kg/h</option></select>
        <input disabled={locked} value={drugMg} onChange={(e) => setDrugMg(e.target.value)} className="rounded-xl border bg-slate-50 p-3 font-black disabled:text-slate-500" placeholder="Droga total mg" />
        <input disabled={locked} value={volumeMl} onChange={(e) => setVolumeMl(e.target.value)} className="rounded-xl border bg-slate-50 p-3 font-black disabled:text-slate-500" placeholder="Volume final mL" />
        <input disabled={locked} value={ampoule} onChange={(e) => setAmpoule(e.target.value)} className="rounded-xl border bg-slate-50 p-3 font-black disabled:text-slate-500 md:col-span-2" placeholder="Ampola mg/mL" />
      </div>
    </div>
    <div className="rounded-3xl border bg-white p-6 text-center shadow-sm"><div className="text-xs font-black uppercase tracking-widest text-slate-500">Velocidade</div><div className="text-5xl font-black text-blue-600">{result ? fmt(result.rateMlHour) : '--'}</div><div className="font-black text-slate-500">mL/h</div></div>
    {result && <div className="grid grid-cols-1 gap-3 md:grid-cols-2"><div className="rounded-2xl border bg-white p-4 text-sm font-bold"><div>Medicação: {fmt(result.medicationVolumeMl)} mL</div><div>Diluente: {fmt(result.diluentVolumeMl)} mL</div><div>Concentração: {fmt(result.finalConcentrationMcgMl)} mcg/mL</div><div>Acesso: precisa validação estruturada.</div></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-950"><div className="font-black uppercase tracking-widest">{getForecastLabel(rule.hasStandardDilution)}</div><div>Solução 24h: {fmt(result.solution24h, 1)} mL</div><div>Fármaco 24h: {fmt(result.drug24hMcg, 1)} mcg</div>{rule.hasStandardDilution && <div>Não usar para alterar preparo.</div>}</div></div>}
  </section>;
}

export default function AppIntegrated() {
  const [weight, setWeight] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Medicine | null>(null);
  const [calculator, setCalculator] = useState<CalculatorState | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => INITIAL_MEDICINES.filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.comment.toLowerCase().includes(search.toLowerCase())), [search]);
  const audit = selected ? auditLegacyMedicine(selected) : [];
  const blockers = audit.filter((item) => item.severity === 'blocker');
  const warnings = audit.filter((item) => item.severity === 'warning');

  if (calculator) return <div className="min-h-screen bg-slate-50 p-4"><MiniInfusionCalculator state={calculator} weight={weight} onBack={() => setCalculator(null)} /></div>;

  return <div className="min-h-screen bg-slate-50 pb-16 text-slate-900"><header className="sticky top-0 z-50 bg-blue-600 p-4 text-white shadow"><div className="mx-auto flex max-w-4xl items-center justify-between"><button onClick={() => { setSelected(null); setCalculator(null); }} className="flex items-center gap-3 text-left"><div className="rounded-xl bg-white/20 p-2"><Stethoscope /></div><div><h1 className="text-xl font-black">PediDose</h1><p className="text-[10px] font-bold uppercase tracking-widest text-blue-100">PS pediátrico · peso primeiro · sem estatura</p></div></button></div></header><main className="mx-auto max-w-4xl space-y-5 p-4"><section id="patient-card" className="rounded-2xl border bg-white p-4 shadow-sm"><label className="space-y-2"><span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500"><Scale className="h-4 w-4" /> Peso</span><input inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Ex: 12,5" className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-3xl font-black outline-none focus:border-blue-500" /></label></section>{selected ? <section className="space-y-4"><button onClick={() => setSelected(null)} className="flex items-center gap-2 font-black text-blue-700"><ArrowLeft className="h-4 w-4" /> Nova busca</button><div className="overflow-hidden rounded-3xl border bg-white shadow-sm"><div className="bg-blue-600 p-6 text-white"><h2 className="text-3xl font-black">{selected.name}</h2><p className="text-sm font-bold text-blue-100">Peso: {weight || '--'} kg. Sem campo de estatura.</p></div><div className="space-y-4 p-5">{(blockers.length || warnings.length) ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950"><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest"><ShieldAlert className="h-4 w-4" /> Auditoria</div>{blockers.slice(0, 3).map((b, i) => <div key={`b${i}`} className="text-sm font-bold">Bloqueio: {b.doseLabel ? `${b.doseLabel}: ` : ''}{b.message}</div>)}{warnings.slice(0, 3).map((w, i) => <div key={`w${i}`} className="text-sm font-bold">Alerta: {w.message}</div>)}</div> : null}{selected.doses.map((dose) => { const calculated = calculateDose(weight, dose); const infusion = isInfusionDose(dose); return <div key={dose.id} className="rounded-2xl border bg-slate-50 p-4"><div className="text-xs font-black uppercase tracking-widest text-blue-600">{dose.label}</div><div className="mt-1 text-lg font-bold">{dose.instructions}</div>{calculated && <div className="mt-3 inline-block rounded-xl border bg-white px-4 py-2 text-xl font-black text-blue-700">{calculated} {dose.unit}</div>}{infusion ? <button onClick={() => setCalculator({ medicine: selected, dose })} className="mt-3 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white"><Calculator className="h-4 w-4" /> Calcular BIC</button> : <div className="mt-3 rounded-xl border bg-white p-3 text-sm font-bold text-slate-600">Prescrição completa bloqueada até fonte, apresentação, via e preparo estruturados.</div>}</div>; })}{selected.comment && <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm font-bold text-orange-800"><AlertTriangle className="mb-1 inline h-4 w-4" /> {selected.comment}</div>}</div></div><div className="rounded-2xl border bg-white p-4 shadow-sm"><div className="mb-2 text-xs font-black uppercase tracking-widest text-slate-500">Fontes gerais</div>{TRUSTED_SOURCES.slice(0, 4).map((s) => <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="mb-2 flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm font-bold"><span>{s.organization}: {s.title}</span><ExternalLink className="h-4 w-4" /></a>)}<p className="text-xs font-bold text-amber-700">Cada dose ainda precisa de fonte própria para validação.</p></div></section> : <section className="space-y-4"><div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input id="med-search" ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar fármaco..." className="w-full rounded-2xl border bg-white py-4 pl-12 pr-4 text-lg font-bold shadow-sm outline-none focus:border-blue-500" /></div><div id="medicines-grid" className="grid grid-cols-1 gap-3 md:grid-cols-2">{filtered.map((medicine) => <button key={medicine.id} onClick={() => { searchRef.current?.blur(); setSelected(medicine); }} className="flex items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm active:scale-[0.99]"><div className="rounded-full bg-blue-100 p-3 text-blue-600"><Pill /></div><div><h3 className="font-black">{medicine.name}</h3><p className="line-clamp-1 text-sm font-bold text-slate-500">{medicine.doses[0]?.instructions || 'Ver doses'}</p></div></button>)}</div></section>}</main></div>;
}
