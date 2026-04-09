import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Global Error Boundary — Academic Atelier Style.
 * Catches layout and rendering errors to prevent total app failure.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-surface-container border border-outline/10 shadow-huge">
            <div className="w-16 h-16 rounded-2xl bg-error-container flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-on-error-container text-[32px]">
                heart_broken
              </span>
            </div>
            <h1 className="font-display text-headline-md text-on-surface mb-2">
              An Intellectual Hiccup
            </h1>
            <p className="text-body-md text-on-surface-variant mb-8">
              The application encountered an unexpected state. This has been logged for our scholars to review.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => window.location.reload()} variant="primary" fullWidth>
                Refresh Page
              </Button>
              <Button onClick={this.handleReset} variant="ghost" fullWidth>
                Return to Dashboard
              </Button>
            </div>
            {import.meta.env.DEV && (
              <pre className="mt-8 p-4 bg-black/5 rounded-xl text-left text-xs text-error font-mono overflow-auto max-h-40">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
