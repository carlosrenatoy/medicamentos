import { useMemo, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { INITIAL_MEDICINES } from '../data';
import { summarizeLegacyMedicineAudit } from '../legacyAuditSummary';

export function AuditFloatingPanel() {
  const [open, setOpen] = useState(false);
  const summary = useMemo(() => summarizeLegacyMedicineAudit(INITIAL_MEDICINES), []);
  const critical = summary.criticalMedicines.slice(0, 6);

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-[80] mx-auto max-w-4xl rounded-2xl border border-amber-200 bg-white shadow-2xl md:left-auto md:right-6 md:w-[420px]">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 rounded-2xl bg-amber-50 p-4 text-left text-amber-950">
        <ShieldAlert className="h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-black uppercase tracking-widest">Auditoria da base</div>
          <div className="truncate text-sm font-bold">{summary.blockerCount} bloqueios · {summary.warningCount} alertas</div>
        </div>
        <div className="text-xs font-black uppercase">{open ? 'fechar' : 'abrir'}</div>
      </button>
      {open && (
        <div className="max-h-[45vh] overflow-y-auto p-4">
          <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-900">
            Prescrição automática completa permanece bloqueada enquanto houver itens sem fonte, via, apresentação, preparo e acesso estruturados.
          </p>
          <div className="space-y-2">
            {critical.map((item) => (
              <div key={item.medicineName} className="rounded-xl bg-slate-50 p-3">
                <div className="text-sm font-black text-slate-900">{item.medicineName}</div>
                <div className="text-xs font-bold text-slate-600">{item.priority} · {item.blockerCount} bloqueios · {item.warningCount} alertas</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
