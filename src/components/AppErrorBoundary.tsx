import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

type Props = { children: ReactNode };
type State = { hasError: boolean; message: string };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Erro inesperado.' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('PediDose blocked unsafe UI/calculation error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-slate-50 p-4 text-slate-900">
        <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-red-200 bg-white p-6 shadow-xl">
          <div className="mb-3 flex items-center gap-3 text-red-700">
            <AlertTriangle className="h-7 w-7" />
            <h1 className="text-2xl font-black">Cálculo bloqueado</h1>
          </div>
          <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-900">{this.state.message}</p>
          <button onClick={() => this.setState({ hasError: false, message: '' })} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white">
            Voltar para o app
          </button>
        </div>
      </div>
    );
  }
}
