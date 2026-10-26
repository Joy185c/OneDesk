import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons';
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
      subtitle="Start managing projects, sprint goals, and team collaboration in minutes."
      badge="Free Workspace"
    >
      {/* OAuth Social Buttons First */}
      <div style={{ marginBottom: '18px' }}>
        <SocialAuthButtons onError={(err) => setErrorMessage(err)} />
      </div>

      {/* Or Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '18px 0',
        color: 'var(--text-muted, #71877B)',
        fontSize: '0.78rem',
        fontWeight: 600,
        textTransform: 'uppercase'
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-default, #DCE7DE)' }} />
        <span>or sign up with email</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-default, #DCE7DE)' }} />
      </div>

      {errorMessage && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '11px 14px',
          borderRadius: '10px',
          fontSize: '0.84rem',
          fontWeight: 600,
          marginBottom: '16px',
          lineHeight: 1.4
        }}>
          {errorMessage}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #182A22)', marginBottom: '6px' }}>
            Full Name
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <User size={16} color="var(--text-muted, #71877B)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
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
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #182A22)', marginBottom: '6px' }}>
            Work Email
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #182A22)', marginBottom: '6px' }}>
            Password
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Lock size={16} color="var(--text-muted, #71877B)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
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

          {/* Password Strength Indicator */}
          {password && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary, #52695B)' }}>Password Strength:</span>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: strengthColor }}>{strengthLabel}</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-default, #DCE7DE)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(strengthScore / 4) * 100}%`,
                  height: '100%',
                  backgroundColor: strengthColor,
                  transition: 'all 0.25s ease'
                }} />
              </div>

              {/* Requirement Checklist */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '6px', fontSize: '0.72rem' }}>
                <span style={{ color: hasMinLength ? '#16a34a' : 'var(--text-muted, #71877B)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <Check size={12} color={hasMinLength ? '#16a34a' : 'var(--text-muted, #71877B)'} /> 8+ characters
                </span>
                <span style={{ color: hasUppercase ? '#16a34a' : 'var(--text-muted, #71877B)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <Check size={12} color={hasUppercase ? '#16a34a' : 'var(--text-muted, #71877B)'} /> Uppercase letter
                </span>
                <span style={{ color: hasNumber ? '#16a34a' : 'var(--text-muted, #71877B)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <Check size={12} color={hasNumber ? '#16a34a' : 'var(--text-muted, #71877B)'} /> Number (0-9)
                </span>
                <span style={{ color: hasSpecial ? '#16a34a' : 'var(--text-muted, #71877B)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <Check size={12} color={hasSpecial ? '#16a34a' : 'var(--text-muted, #71877B)'} /> Special character
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #182A22)', marginBottom: '6px' }}>
            Confirm Password
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Lock size={16} color="var(--text-muted, #71877B)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            style={{ accentColor: 'var(--brand-primary, #176B50)', cursor: 'pointer', marginTop: '3px' }}
          />
          <label htmlFor="terms" style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #52695B)', lineHeight: 1.4, cursor: 'pointer', fontWeight: 500 }}>
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
      <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem', color: 'var(--text-secondary, #52695B)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--brand-primary, #176B50)', fontWeight: 800, textDecoration: 'none' }}>
          Sign in here
        </Link>
      </div>
    </AuthLayout>
  );
};
