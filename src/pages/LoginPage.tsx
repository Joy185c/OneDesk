import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons';
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
      subtitle="Sign in to access your projects, tasks, and team channels."
      badge="Secure Login"
    >
      {/* OAuth Social Buttons First */}
      <div style={{ marginBottom: '20px' }}>
        <SocialAuthButtons onError={(err) => setErrorMessage(err)} />
      </div>

      {/* Or Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '20px 0',
        color: 'var(--text-muted, #71877B)',
        fontSize: '0.78rem',
        fontWeight: 600,
        textTransform: 'uppercase'
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-default, #DCE7DE)' }} />
        <span>or sign in with email</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-default, #DCE7DE)' }} />
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '11px 14px',
          borderRadius: '10px',
          fontSize: '0.84rem',
          fontWeight: 600,
          marginBottom: '18px',
          lineHeight: 1.4
        }}>
          {errorMessage}
        </div>
      )}

      {/* Email + Password Form */}
      <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #182A22)', marginBottom: '6px' }}>
            Work Email
          </label>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Mail size={16} color="var(--text-muted, #71877B)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
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
                backgroundColor: 'var(--bg-canvas, #F0F4F0)',
                border: '1.5px solid var(--border-default, #DCE7DE)',
                borderRadius: '10px',
                color: 'var(--text-primary, #182A22)',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s, box-shadow 0.15s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--brand-primary, #176B50)';
                e.target.style.boxShadow = '0 0 0 3px rgba(23, 107, 80, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-default, #DCE7DE)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #182A22)' }}>
              Password
            </label>
            <Link
              to="/forgot-password"
              style={{
                fontSize: '0.78rem',
                color: 'var(--brand-primary, #176B50)',
                textDecoration: 'none',
                fontWeight: 700
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
            <Lock size={16} color="var(--text-muted, #71877B)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
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
                backgroundColor: 'var(--bg-canvas, #F0F4F0)',
                border: '1.5px solid var(--border-default, #DCE7DE)',
                borderRadius: '10px',
                color: 'var(--text-primary, #182A22)',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s, box-shadow 0.15s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--brand-primary, #176B50)';
                e.target.style.boxShadow = '0 0 0 3px rgba(23, 107, 80, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-default, #DCE7DE)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted, #71877B)',
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
            style={{ accentColor: 'var(--brand-primary, #176B50)', cursor: 'pointer' }}
          />
          <label htmlFor="remember" style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #52695B)', cursor: 'pointer', fontWeight: 500 }}>
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
            background: 'linear-gradient(135deg, #176B50 0%, #11533E 100%)',
            color: '#ffffff',
            fontSize: '0.94rem',
            fontWeight: 800,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 6px 20px rgba(23, 107, 80, 0.3)',
            marginTop: '6px',
            transition: 'transform 0.15s, box-shadow 0.15s'
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
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.86rem', color: 'var(--text-secondary, #52695B)' }}>
        Don&apos;t have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--brand-primary, #176B50)', fontWeight: 800, textDecoration: 'none' }}>
          Create free account
        </Link>
      </div>
    </AuthLayout>
  );
};
