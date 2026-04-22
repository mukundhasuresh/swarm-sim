"use client"

import { Component, ReactNode } from 'react';
import LoadingOrb from './LoadingOrb';
import { useToast } from './ToastProvider';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Tab Error Boundary caught an error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-full text-white/50 p-8">
          <LoadingOrb size="lg" />
          <h3 className="text-2xl font-bold mt-8 mb-2">Something went wrong</h3>
          <p className="text-center max-w-md">This tab encountered an error. Try refreshing or switching tabs.</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-6 bg-[#00f5d4] text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

