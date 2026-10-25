import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(123, 104, 238, 0.4)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 10px 0' }}>
            ClickUp 3.0 Encountered an Issue
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94a3b8', maxWidth: '440px', lineHeight: 1.5, margin: '0 0 24px 0' }}>
            We've caught this error automatically. Click below to refresh your workspace with clean state.
          </p>

          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/workspace';
            }}
            style={{
              padding: '12px 28px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.94rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(123, 104, 238, 0.4)'
            }}
          >
            Reload Workspace
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
