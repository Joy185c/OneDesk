import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await resetPassword(email);
      setIsSubmitting(false);

      if (res.success) {
        setIsSuccess(true);
        setCooldown(60);
      } else {
        setErrorMessage(res.error || 'Failed to dispatch password recovery email.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Unexpected recovery error.');
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your verified account email to receive recovery instructions."
      badge="Account Recovery"
    >
      {isSuccess ? (
        <div style={{
          textAlign: 'center',
          padding: '16px 0'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <CheckCircle2 size={28} />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
            Recovery Email Dispatched
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 20px 0' }}>
            We have sent a secure password reset link to <strong style={{ color: '#ffffff' }}>{email}</strong>. Please check your inbox and spam folder.
          </p>

          {cooldown > 0 ? (
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>
              Resend available in {cooldown}s
            </p>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                background: 'none',
                border: 'none',
                color: '#a78bfa',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '16px',
                textDecoration: 'underline'
              }}
            >
              Didn&apos;t receive it? Send again
            </button>
          )}

          <div>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#cbd5e1',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {errorMessage && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              lineHeight: 1.4
            }}>
              {errorMessage}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Account Email Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#1e293b',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0 12px'
            }}>
              <Mail size={16} color="#64748b" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '11px 10px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--brand-gradient, linear-gradient(135deg, #123D32 0%, #176B50 55%, #58A681 100%))',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(23, 107, 80, 0.35)',
              marginTop: '4px'
            }}
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <span>Send Password Reset Link</span>}
          </button>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#94a3b8',
                fontSize: '0.82rem',
                textDecoration: 'none'
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to sign in</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
