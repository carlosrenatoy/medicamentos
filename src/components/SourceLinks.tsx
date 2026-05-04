import type { TrustedSource } from '../prescriptionTypes';

interface SourceLinksProps {
  sources: TrustedSource[];
  title?: string;
}

export function SourceLinks({ sources, title = 'Fontes para conferência médica' }: SourceLinksProps) {
  if (!sources.length) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Fonte pendente:</strong> esta medicação ainda precisa de referência estruturada revisada.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">{title}</h3>
      <div className="space-y-2">
        {sources.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <div className="text-sm font-bold text-slate-800">{source.title}</div>
            <div className="text-xs font-medium text-slate-500">{source.organization}</div>
            {source.note && <div className="mt-1 text-xs leading-relaxed text-slate-600">{source.note}</div>}
          </a>
        ))}
      </div>
    </section>
  );
}
