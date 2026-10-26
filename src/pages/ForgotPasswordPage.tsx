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
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-selected, #e8f5ee)',
            color: 'var(--brand-primary, #176B50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '1.5px solid #bbf7d0'
          }}>
            <CheckCircle2 size={30} />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary, #182A22)' }}>
            Recovery Email Dispatched
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary, #52695B)', lineHeight: 1.5, margin: '0 0 20px 0' }}>
            We sent a secure password reset link to <strong style={{ color: 'var(--brand-primary, #176B50)' }}>{email}</strong>. Please check your inbox and spam folder.
          </p>

          {cooldown > 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #71877B)', marginBottom: '16px' }}>
              Resend available in {cooldown}s
            </p>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand-primary, #176B50)',
                fontSize: '0.86rem',
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
                color: 'var(--brand-primary, #176B50)',
                fontSize: '0.86rem',
                fontWeight: 700,
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
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '11px 14px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 600,
              lineHeight: 1.4
            }}>
              {errorMessage}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #182A22)', marginBottom: '6px' }}>
              Account Email Address
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Mail size={16} color="var(--text-muted, #71877B)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 38px',
                  backgroundColor: 'var(--bg-canvas, #F0F4F0)',
                  border: '1.5px solid var(--border-default, #DCE7DE)',
                  borderRadius: '10px',
                  color: 'var(--text-primary, #182A22)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
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
              marginTop: '4px'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Sending Instructions...</span>
              </>
            ) : (
              <span>Send Recovery Email</span>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--brand-primary, #176B50)',
                fontSize: '0.84rem',
                fontWeight: 700,
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
