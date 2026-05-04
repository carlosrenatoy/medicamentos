import { AlertTriangle, Lock } from 'lucide-react';
import { getDilutionMode } from '../standardDilutionRules';

interface StandardDilutionWarningProps {
  defaultDrugMg?: number;
  defaultVolumeMl?: number;
  ampouleConcentrationMgMl?: number;
}

const fmt = (value: number, decimals = 2) =>
  value.toFixed(decimals).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');

export function StandardDilutionWarning({
  defaultDrugMg,
  defaultVolumeMl,
  ampouleConcentrationMgMl,
}: StandardDilutionWarningProps) {
  const rule = getDilutionMode({
    defaultDrugMg,
    defaultVolumeMl,
    ampouleConcentrationMgMl,
  });

  if (!rule.hasStandardDilution) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="mb-1 flex items-center gap-2 font-black uppercase tracking-widest">
          <AlertTriangle className="h-4 w-4" /> {rule.warningTitle}
        </div>
        <p className="font-bold leading-relaxed">{rule.warningText}</p>
      </div>
    );
  }

  const concentrationMcgMl = ((defaultDrugMg ?? 0) * 1000) / (defaultVolumeMl ?? 1);

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
      <div className="mb-2 flex items-center gap-2 font-black uppercase tracking-widest">
        <Lock className="h-4 w-4" /> {rule.warningTitle}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-white/80 p-3">
          <div className="text-xs font-bold text-emerald-700">Droga no preparo</div>
          <div className="text-lg font-black">{fmt((defaultDrugMg ?? 0) * 1000, 0)} mcg</div>
        </div>
        <div className="rounded-xl bg-white/80 p-3">
          <div className="text-xs font-bold text-emerald-700">Volume final</div>
          <div className="text-lg font-black">{fmt(defaultVolumeMl ?? 0, 0)} mL</div>
        </div>
        <div className="rounded-xl bg-white/80 p-3">
          <div className="text-xs font-bold text-emerald-700">Concentração</div>
          <div className="text-lg font-black">{fmt(concentrationMcgMl, 2)} mcg/mL</div>
        </div>
      </div>
      <p className="mt-3 font-bold leading-relaxed">{rule.warningText}</p>
    </div>
  );
}
