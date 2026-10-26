import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ResetPasswordPage: React.FC = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await updatePassword(password);
      setIsSubmitting(false);

      if (res.success) {
        setIsSuccess(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage(res.error || 'Failed to update password. Recovery session may have expired.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Unexpected reset error.');
    }
  };

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Enter and confirm your new secure OneDesk password."
      badge="Password Reset"
    >
      {isSuccess ? (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
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
            Password Updated!
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary, #52695B)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            Your account password has been successfully reset. Redirecting you to sign in...
          </p>
          <Link
            to="/login"
            style={{
              color: 'var(--brand-primary, #176B50)',
              fontSize: '0.86rem',
              fontWeight: 700,
              textDecoration: 'underline'
            }}
          >
            Click here if not redirected automatically
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              New Password
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Lock size={16} color="var(--text-muted, #71877B)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 38px',
                  backgroundColor: 'var(--bg-canvas, #F0F4F0)',
                  border: '1.5px solid var(--border-default, #DCE7DE)',
                  borderRadius: '10px',
                  color: 'var(--text-primary, #182A22)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
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
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #182A22)', marginBottom: '6px' }}>
              Confirm New Password
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Lock size={16} color="var(--text-muted, #71877B)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 38px',
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
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>Save New Password</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};
