import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex h-full items-center justify-center p-6">
          <div className="max-w-md rounded-lg border border-red-900/50 bg-red-950/30 p-5 text-sm">
            <p className="mb-2 font-semibold text-red-300">Something went wrong.</p>
            <p className="mb-3 text-red-200/80">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => location.reload()}
              className="rounded border border-red-700 bg-red-900/40 px-3 py-1 text-red-200 hover:bg-red-900/60"
            >
              Reload
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
