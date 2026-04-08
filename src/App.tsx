import { BrowserRouter } from 'react-router-dom';
import { ScholarlyUpgradeModal } from './components/global/ScholarlyUpgradeModal';
import { ToastProvider } from './components/ui/Toast';
import { OfflineBanner } from './components/global/OfflineBanner';
import { CommandPalette } from './components/global/CommandPalette';
import { ErrorBoundary } from './components/global/ErrorBoundary';
import { usePlatformSecurity } from './hooks/usePlatformSecurity';
import { AnimatedRoutes } from './components/routing/AnimatedRoutes';

/**
 * Root Application Container — ExamForge Academic Atelier.
 * Orchestrates high-level providers and the routing engine.
 */
export default function App() {
  // Platform Security Hook — debugger trap triggered per rule #15
  usePlatformSecurity();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <OfflineBanner />
          <ScholarlyUpgradeModal />
          <CommandPalette />
          <AnimatedRoutes />
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
