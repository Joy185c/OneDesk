import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, connectionError } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#090d16',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(124, 58, 237, 0.45)',
          marginBottom: '20px'
        }}>
          <Loader2 size={26} color="#ffffff" className="animate-spin" />
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
          OneDesk
        </div>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
          Verifying security session...
        </p>
      </div>
    );
  }

  // Strict Fail-Closed policy: If Supabase connection failed, show error screen rather than bypassing
  if (connectionError && !isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#090d16',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#ffffff'
      }}>
        <div style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: '#111726',
          borderRadius: '20px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '1.25rem'
          }}>
            ⚠️
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>
            Authentication Service Unavailable
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 20px 0' }}>
            {connectionError}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
