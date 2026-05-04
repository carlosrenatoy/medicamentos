import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import AppIntegrated from './AppIntegrated.tsx';
import {AuditFloatingPanel} from './components/AuditFloatingPanel.tsx';
import {AppErrorBoundary} from './components/AppErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <AppIntegrated />
      <AuditFloatingPanel />
    </AppErrorBoundary>
  </StrictMode>,
);
