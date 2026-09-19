import React from 'react';
import { AlertTriangle, RotateCcw, Trash2, ChevronDown } from 'lucide-react';
import { clearAppStorage } from '../utils/storage';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Short label shown in the fallback UI, e.g. "Live Console". */
  label?: string;
  /**
   * Change this value (e.g. the active view id) to automatically clear the
   * boundary and re-attempt rendering the children.
   */
  resetKey?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

/**
 * Catches render/lifecycle errors so a single broken view can never blank out
 * the entire dashboard. Previously one throwing component (or bad persisted
 * state) unmounted the whole React tree, leaving an empty page.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Keep the console noise useful for debugging without killing the app.
    console.error('[MineControl OS] Component crashed:', error, errorInfo?.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null, showDetails: false });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  private handleResetData = () => {
    clearAppStorage();
    this.setState({ hasError: false, error: null, showDetails: false });
    try {
      window.location.reload();
    } catch {
      /* ignore */
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const scope = this.props.label ? `${this.props.label} module` : 'MineControl OS';

    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-lg bg-[#0e1627] border border-rose-500/40 rounded-xl p-6 space-y-4 font-mono shadow-2xl shadow-rose-950/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/15 border border-rose-500/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Recovered from a crash in {scope}</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                The rest of the dashboard is still running — retry or reset local data below.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-[11px] text-rose-300 break-words">
            {this.state.error?.message || 'Unknown render error'}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={this.handleRetry}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Render</span>
            </button>
            <button
              onClick={this.handleResetData}
              className="px-3.5 py-2 bg-[#1a2436] hover:bg-[#233047] border border-[#2b3d5c] text-slate-200 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Saved Data &amp; Reload</span>
            </button>
            <button
              onClick={() => this.setState({ showDetails: !this.state.showDetails })}
              className="px-2.5 py-2 text-slate-400 hover:text-slate-200 text-xs flex items-center space-x-1 transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${this.state.showDetails ? 'rotate-180' : ''}`} />
              <span>Details</span>
            </button>
          </div>

          {this.state.showDetails && this.state.error?.stack && (
            <pre className="max-h-48 overflow-auto p-3 rounded-lg bg-[#080d18] border border-[#1b2b45] text-[10px] leading-relaxed text-slate-400 whitespace-pre-wrap">
              {this.state.error.stack}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
