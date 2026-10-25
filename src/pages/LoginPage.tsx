import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const destination = (location.state as any)?.from?.pathname || '/workspace';

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      setIsSubmitting(false);

      if (res.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        navigate(destination, { replace: true });
      } else {
        setErrorMessage(res.error || 'Failed to sign in. Please verify your email and password.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'An unexpected error occurred during login.');
    }
  };

  return (
    <AuthLayout
      title="Welcome back to OneDesk"
      subtitle="Sign in with your verified Supabase account to access your workspace."
      badge="Supabase Auth"
    >
      {/* Error alert */}
      {errorMessage && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '0.82rem',
          marginBottom: '18px',
          lineHeight: 1.4
        }}>
          {errorMessage}
        </div>
      )}

      {/* Email + Password Form */}
      <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
            Work Email
          </label>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '11px 12px 11px 38px',
                backgroundColor: '#0d131f',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>
              Password
            </label>
            <Link
              to="/forgot-password"
              style={{
                fontSize: '0.78rem',
                color: '#a78bfa',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Forgot password?
            </Link>
          </div>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '11px 40px 11px 38px',
                backgroundColor: '#0d131f',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 0
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ accentColor: '#7c3aed', cursor: 'pointer' }}
          />
          <label htmlFor="remember" style={{ fontSize: '0.8rem', color: '#94a3b8', cursor: 'pointer' }}>
            Keep me signed in
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
            color: '#ffffff',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
            marginTop: '8px',
            transition: 'transform 0.15s'
          }}
          onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In to OneDesk</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.84rem', color: '#94a3b8' }}>
        Don&apos;t have an account?{' '}
        <Link to="/signup" style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none' }}>
          Create free account
        </Link>
      </div>
    </AuthLayout>
  );
};
