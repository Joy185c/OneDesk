import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Zap, ArrowRight, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup, demoLogin } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });

    if (mode === 'signup') {
      signup(name || 'New Member', email, password);
    } else {
      login(email, password);
    }
    onClose();
  };

  const handleDemoAccess = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
    demoLogin();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 17, 26, 0.72)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000,
      animation: 'fadeIn 0.15s ease'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        maxWidth: '460px',
        width: '100%',
        padding: '36px 32px',
        position: 'relative',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
        border: '1px solid #e2e5f0'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#f1f2f6',
            color: '#656b82',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 4px 14px rgba(123, 104, 238, 0.35)'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 14L9 19L20 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.6rem', color: '#1a1b2d', marginBottom: '4px' }}>
            {mode === 'signup' ? 'Create ClickUp Account' : 'Welcome back to ClickUp'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
            {mode === 'signup' ? 'Enter your details to access your workspace.' : 'Sign in to access your projects and tasks.'}
          </p>
        </div>

        {/* 1-Click Instant Demo Login Button */}
        <button
          onClick={handleDemoAccess}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px',
            backgroundColor: '#f3f0ff',
            color: '#6b46c1',
            border: '1px solid #dcd1ff',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eae4fc'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f0ff'}
        >
          <Zap size={15} color="#7b68ee" />
          <span>⚡ One-Click Instant Demo Login</span>
        </button>

        {/* Tab Toggle */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: '#f3f4f8',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '18px'
        }}>
          <button
            onClick={() => setMode('signup')}
            style={{
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              backgroundColor: mode === 'signup' ? '#ffffff' : 'transparent',
              color: mode === 'signup' ? '#1e1f2b' : '#6b7280',
              boxShadow: mode === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode('signin')}
            style={{
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              backgroundColor: mode === 'signin' ? '#ffffff' : 'transparent',
              color: mode === 'signin' ? '#1e1f2b' : '#6b7280',
              boxShadow: mode === 'signin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Log In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Shuvo Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Work Email
            </label>
            <input
              type="email"
              required
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '0.92rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '0.92rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              marginTop: '6px',
              fontSize: '0.95rem'
            }}
          >
            <span>{mode === 'signup' ? 'Create Free Workspace & Enter' : 'Sign In to Workspace'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '16px' }}>
          Test Authentication mode enabled. Data persists locally in your browser.
        </div>
      </div>
    </div>
  );
};
