import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Check, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password Strength Calculations
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const strengthScore = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthColor = strengthScore <= 1 ? '#ef4444' : strengthScore <= 3 ? '#f59e0b' : '#10b981';
  const strengthLabel = strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Medium' : 'Strong';

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (!hasMinLength) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signup(name, email, password);
      setIsSubmitting(false);

      if (res.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        if (res.requiresVerification) {
          navigate(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        } else {
          navigate('/workspace');
        }
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Unexpected signup error.');
    }
  };

  return (
    <AuthLayout
      title="Create your OneDesk Account"
      subtitle="Start managing projects, tasks, and sprint goals in minutes."
      badge="Supabase Email Auth"
    >
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

      {/* Registration Form */}
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
            Full Name
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Joy Kumar"
              required
              autoComplete="name"
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
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
            Work Email
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
            Password
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              autoComplete="new-password"
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

          {/* Password Strength Indicator */}
          {password && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Password Strength:</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: strengthColor }}>{strengthLabel}</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(strengthScore / 4) * 100}%`,
                  height: '100%',
                  backgroundColor: strengthColor,
                  transition: 'all 0.25s ease'
                }} />
              </div>

              {/* Requirement Checklist */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '6px', fontSize: '0.7rem' }}>
                <span style={{ color: hasMinLength ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={11} color={hasMinLength ? '#10b981' : '#64748b'} /> 8+ characters
                </span>
                <span style={{ color: hasUppercase ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={11} color={hasUppercase ? '#10b981' : '#64748b'} /> Uppercase letter
                </span>
                <span style={{ color: hasNumber ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={11} color={hasNumber ? '#10b981' : '#64748b'} /> Number (0-9)
                </span>
                <span style={{ color: hasSpecial ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={11} color={hasSpecial ? '#10b981' : '#64748b'} /> Special character
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
            Confirm Password
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '2px' }}>
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{ accentColor: '#7c3aed', cursor: 'pointer', marginTop: '3px' }}
          />
          <label htmlFor="terms" style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4, cursor: 'pointer' }}>
            I agree to the OneDesk Terms of Service and Privacy Policy.
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
            marginTop: '6px',
            transition: 'transform 0.15s'
          }}
          onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Create Free Account</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.84rem', color: '#94a3b8' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none' }}>
          Sign in here
        </Link>
      </div>
    </AuthLayout>
  );
};
