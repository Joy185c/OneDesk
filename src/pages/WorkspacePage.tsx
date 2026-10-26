import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WorkspaceApp } from '../components/dashboard/WorkspaceApp';
import { AuthModal } from '../components/AuthModal';
import { GoogleGLogo } from '../components/auth/GoogleOAuthModal';
import { ShieldCheck, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkspacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    isAuthenticated, 
    user, 
    loginWithGoogle, 
    confirmDirectMailAccess, 
    confirmEmailWithCode 
  } = useAuth();
  const navigate = useNavigate();

  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'signin' | 'signup' }>({
    open: false,
    mode: 'signup'
  });
  const [directAccessMessage, setDirectAccessMessage] = useState<string | null>(null);

  // Check URL for direct mail verification parameters (e.g. clicked directly from email)
  useEffect(() => {
    const verifyToken = searchParams.get('verify_token');
    const verifyEmail = searchParams.get('email');
    const verifyCode = searchParams.get('verify_code') || searchParams.get('code');

    const handleVerification = async () => {
      if (verifyToken) {
        const res = await confirmDirectMailAccess(verifyToken, verifyEmail || undefined);
        if (res.success) {
          setDirectAccessMessage('✓ Email successfully confirmed via direct mail link! Welcome to your workspace.');
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 }
          });
          // Clean URL params
          setSearchParams({});
        }
      } else if (verifyCode && verifyEmail) {
        const res = await confirmEmailWithCode(verifyEmail, verifyCode);
        if (res.success) {
          setDirectAccessMessage('✓ Email confirmed with verification code! Access granted.');
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 }
          });
          setSearchParams({});
        }
      }
    };
    handleVerification();
  }, [searchParams, confirmDirectMailAccess, confirmEmailWithCode, setSearchParams]);

  // If user is authenticated, render the workspace application
  if (isAuthenticated && user) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {directAccessMessage && (
          <div style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            backgroundColor: '#0f172a',
            color: '#10b981',
            padding: '10px 20px',
            borderRadius: '100px',
            fontSize: '0.86rem',
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            animation: 'fadeIn 0.3s ease'
          }}>
            <ShieldCheck size={16} />
            <span>{directAccessMessage}</span>
            <button
              onClick={() => setDirectAccessMessage(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                marginLeft: '8px',
                fontSize: '0.9rem'
              }}
            >
              ✕
            </button>
          </div>
        )}
        <WorkspaceApp onBackToLanding={() => navigate('/')} />
      </div>
    );
  }

  // If NOT authenticated, present a ClickUp 3.0 workspace authentication gate
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.18) 0%, rgba(9, 13, 22, 1) 75%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#ffffff'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#111726',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(124, 58, 237, 0.15)',
        padding: '40px 32px',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '25%',
          right: '25%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #176B50, #55D6A0, transparent)'
        }} />

        {/* Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'var(--brand-gradient, linear-gradient(135deg, #123D32 0%, #176B50 55%, #58A681 100%))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px',
          boxShadow: '0 8px 24px rgba(23, 107, 80, 0.4)'
        }}>
          <Lock size={26} color="#ffffff" />
        </div>

        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '8px', color: '#ffffff' }}>
          Workspace Authentication
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '24px' }}>
          Please verify your Gmail or sign in to access your ClickUp 3.0 workspace, tasks, and real-time collaboration.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Continue with Google */}
          <button
            onClick={() => loginWithGoogle()}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              color: '#3c4043',
              border: '1px solid #dadce0',
              fontSize: '0.94rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            }}
          >
            <GoogleGLogo size={19} />
            <span>Continue with Google</span>
            <span style={{
              fontSize: '0.68rem',
              backgroundColor: '#e8f0fe',
              color: '#1a73e8',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '100px',
              marginLeft: 'auto'
            }}>
              OAuth 2.0
            </span>
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '2px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              or with email
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
          </div>
          {/* Create Verified Account */}
          <button
            onClick={() => setAuthModal({ open: true, mode: 'signup' })}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)',
              transition: 'transform 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Mail size={16} />
            <span>Verify Gmail & Create Account</span>
            <ArrowRight size={16} />
          </button>

          {/* Log In */}
          <button
            onClick={() => setAuthModal({ open: true, mode: 'signin' })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#f1f5f9',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.92rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
          >
            Log In with Existing Account
          </button>

          {/* Instant 1-Click Demo */}
          <div style={{ margin: '8px 0 4px', position: 'relative' }}>
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', margin: '10px 0' }} />
            <span style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#111726',
              padding: '0 10px',
              fontSize: '0.74rem',
              color: '#64748b'
            }}>
              OR
            </span>
          </div>

        </div>

        <div style={{ marginTop: '24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Back to Homepage
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, open: false })}
      />
    </div>
  );
};
