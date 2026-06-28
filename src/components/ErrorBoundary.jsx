import { Component } from "react";

/**
 * Top-level error boundary. A crash in any section below must never
 * blank the whole page — this catches it and shows a scoped fallback
 * instead, per the defensive-frontend checklist this project follows.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In a real deploy, send this to your error-tracking service here.
    // eslint-disable-next-line no-console
    console.error("Uncaught render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-coffee-950 px-6 text-center">
          <p className="font-display text-2xl text-cream-100">
            Something went off the brew.
          </p>
          <p className="max-w-sm text-sm text-cream-300">
            This section couldn't load. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-gold-500 px-6 py-2 text-sm font-semibold text-coffee-950"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
