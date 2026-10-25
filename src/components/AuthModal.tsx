import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  ShieldCheck, 
  Lock, 
  User as UserIcon, 
  RefreshCw, 
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthModal, GoogleGLogo } from './auth/GoogleOAuthModal';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [step, setStep] = useState<'form' | 'confirm_code'>('form');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Verification fields
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [lastDispatchedCode, setLastDispatchedCode] = useState<string | null>(null);
  const [lastDirectLink, setLastDirectLink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { 
    login, 
    signup, 
    loginWithGoogle,
    validateEmail, 
    sendVerificationEmail, 
    confirmEmailWithCode, 
    confirmDirectMailAccess 
  } = useAuth();
  
  const navigate = useNavigate();

  // Reset or initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStep('form');
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialMode]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Real-time email validation
  const emailValidity = email.trim() ? validateEmail(email) : null;

  // Submit Handler for Step 1
  const handleInitiateAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please provide an email address.');
      return;
    }

    const val = validateEmail(email);
    if (!val.isValid) {
      setErrorMessage(val.message);
      return;
    }

    if (mode === 'signup') {
      // Step 1 for signup: dispatch Gmail confirmation code
      setIsSendingCode(true);
      try {
        const res = await sendVerificationEmail(email, name, password);
        setIsSendingCode(false);
        if (res.success && res.code) {
          setLastDispatchedCode(res.code);
          setLastDirectLink(res.directLink || null);
          setStep('confirm_code');
          setResendCooldown(60);
          setCodeDigits(['', '', '', '', '', '']);
          // Focus first digit box on step switch
          setTimeout(() => {
            digitInputRefs.current[0]?.focus();
          }, 150);
        } else {
          setErrorMessage(res.error || 'Failed to dispatch verification email.');
        }
      } catch (err: any) {
        setIsSendingCode(false);
        setErrorMessage(err?.message || 'Failed to dispatch verification email.');
      }
    } else {
      // Direct Login for existing/registered users
      const res = await login(email, password);
      if (res.success) {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
        onClose();
        navigate('/workspace');
      } else {
        setErrorMessage(res.error || 'Login failed. Please verify credentials.');
      }
    }
  };

  // Submit Handler for Step 2: Code Confirmation
  const handleConfirmCode = async (e?: React.FormEvent, directCode?: string) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const fullCode = directCode || codeDigits.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the confirmation code.');
      return;
    }

    setIsVerifyingCode(true);
    try {
      const res = await confirmEmailWithCode(email, fullCode);
      setIsVerifyingCode(false);

      if (res.success) {
        setSuccessMessage('Email verified successfully! Creating workspace account...');
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#7c3aed', '#ec4899', '#10b981', '#3b82f6', '#f59e0b']
        });
        setTimeout(() => {
          onClose();
          navigate('/workspace');
        }, 800);
      } else {
        setErrorMessage(res.error || 'Invalid verification code.');
      }
    } catch (err: any) {
      setIsVerifyingCode(false);
      setErrorMessage(err?.message || 'Verification error.');
    }
  };

  // Direct Mail Access Link Simulation Handler
  const handleDirectMailAccess = async () => {
    setErrorMessage(null);
    if (!lastDirectLink && !lastDispatchedCode) return;

    // Use direct mail access token
    const tokenMatch = lastDirectLink?.match(/verify_token=([^&]+)/);
    const token = tokenMatch ? tokenMatch[1] : '';

    setIsVerifyingCode(true);
    try {
      const res = await confirmDirectMailAccess(token, email);
      setIsVerifyingCode(false);

      if (res.success) {
        setSuccessMessage('Direct email verification verified! Entering workspace...');
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
        setTimeout(() => {
          onClose();
          navigate('/workspace');
        }, 700);
      } else {
        setErrorMessage(res.error || 'Failed to authenticate via direct email link.');
      }
    } catch (err: any) {
      setIsVerifyingCode(false);
      setErrorMessage(err?.message || 'Verification failed.');
    }
  };

  // Auto-fill code from preview
  const handleAutoFillCode = () => {
    if (!lastDispatchedCode || lastDispatchedCode.length !== 6) return;
    const digits = lastDispatchedCode.split('');
    setCodeDigits(digits);
    handleConfirmCode(undefined, lastDispatchedCode);
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage(null);
    setIsSendingCode(true);
    try {
      const res = await sendVerificationEmail(email, name, password);
      setIsSendingCode(false);
      if (res.success && res.code) {
        setLastDispatchedCode(res.code);
        setLastDirectLink(res.directLink || null);
        setResendCooldown(60);
        setSuccessMessage('A fresh 6-digit confirmation code was sent!');
        setTimeout(() => setSuccessMessage(null), 3500);
      } else {
        setErrorMessage(res.error || 'Failed to resend code.');
      }
    } catch (err: any) {
      setIsSendingCode(false);
      setErrorMessage(err?.message || 'Failed to resend code.');
    }
  };

  // Handle individual digit input typing
  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, ''); // digits only

    // Support paste of entire 6-digit code
    if (clean.length > 1) {
      const pasted = clean.slice(0, 6).split('');
      const newDigits = [...codeDigits];
      pasted.forEach((ch, idx) => {
        if (index + idx < 6) newDigits[index + idx] = ch;
      });
      setCodeDigits(newDigits);
      const nextIndex = Math.min(index + clean.length, 5);
      digitInputRefs.current[nextIndex]?.focus();
      if (newDigits.every(d => d !== '')) {
        handleConfirmCode(undefined, newDigits.join(''));
      }
      return;
    }

    const newDigits = [...codeDigits];
    newDigits[index] = clean;
    setCodeDigits(newDigits);

    // Auto-advance to next box
    if (clean && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    if (clean && index === 5 && newDigits.every(d => d !== '')) {
      handleConfirmCode(undefined, newDigits.join(''));
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 17, 26, 0.76)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        padding: '36px 32px',
        position: 'relative',
        boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.35)',
        border: '1px solid #e2e8f0'
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
            backgroundColor: '#f1f5f9',
            border: 'none',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e2e8f0'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
        >
          <X size={16} />
        </button>

        {/* ============================================================ */}
        {/* STAGE 1: CREDENTIALS & GMAIL VALIDATION FORM                 */}
        {/* ============================================================ */}
        {step === 'form' && (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: '0 6px 18px rgba(124, 58, 237, 0.35)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 14L9 19L20 6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                {mode === 'signup' ? 'Create ClickUp Account' : 'Welcome back to ClickUp'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                {mode === 'signup' 
                  ? 'Verify your Gmail to ensure security and direct inbox access.' 
                  : 'Sign in to access your projects, docs, and team chats.'}
              </p>
            </div>

            {/* Continue with Google (Real Supabase OAuth 2.0) */}
            <button
              type="button"
              onClick={async () => {
                const res = await loginWithGoogle();
                if (!res.success && res.error) {
                  setErrorMessage(res.error);
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '11px 16px',
                backgroundColor: '#ffffff',
                color: '#3c4043',
                border: '1px solid #dadce0',
                borderRadius: '12px',
                fontSize: '0.94rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '16px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#c2c6cc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#dadce0';
              }}
            >
              <GoogleGLogo size={20} />
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '2px 0 16px'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                or with email confirmation
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            </div>

            {/* Mode Selector Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: '#f1f5f9',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '18px'
            }}>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(null); }}
                style={{
                  padding: '9px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  backgroundColor: mode === 'signup' ? '#ffffff' : 'transparent',
                  color: mode === 'signup' ? '#0f172a' : '#64748b',
                  boxShadow: mode === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer'
                }}
              >
                Sign Up (Verify Gmail)
              </button>
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMessage(null); }}
                style={{
                  padding: '9px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  backgroundColor: mode === 'signin' ? '#ffffff' : 'transparent',
                  color: mode === 'signin' ? '#0f172a' : '#64748b',
                  boxShadow: mode === 'signin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer'
                }}
              >
                Log In
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                color: '#b91c1c',
                fontSize: '0.84rem',
                marginBottom: '14px'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleInitiateAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mode === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shuvo Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 36px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.92rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                      onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                    />
                  </div>
                </div>
              )}

              {/* Email Address with Live Gmail/Email Validity Indicator */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Gmail / Work Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 36px',
                      borderRadius: '10px',
                      border: `1px solid ${
                        !email.trim() ? '#cbd5e1' : emailValidity?.isValid ? '#10b981' : '#f87171'
                      }`,
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: emailValidity?.isValid ? '#f0fdf4' : '#ffffff'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = emailValidity?.isValid ? '#10b981' : '#7c3aed'}
                    onBlur={e => e.currentTarget.style.borderColor = !email.trim() ? '#cbd5e1' : emailValidity?.isValid ? '#10b981' : '#f87171'}
                  />
                  {emailValidity?.isValid && (
                    <CheckCircle2 size={16} color="#10b981" style={{ position: 'absolute', right: '12px', top: '13px' }} />
                  )}
                </div>

                {/* Real-time Validity Indicator Badge */}
                {email.trim() && (
                  <div style={{
                    marginTop: '6px',
                    fontSize: '0.76rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: emailValidity?.isValid ? '#15803d' : '#dc2626',
                    fontWeight: 500
                  }}>
                    {emailValidity?.isValid ? (
                      <>
                        <ShieldCheck size={14} color="#16a34a" />
                        <span>
                          {emailValidity.isGmail 
                            ? '✓ Valid Google Gmail detected (Direct inbox confirmation supported)'
                            : `✓ Valid email domain (@${emailValidity.domain}) verified`}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} color="#dc2626" />
                        <span>{emailValidity?.message || 'Invalid email format'}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 36px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                    onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSendingCode}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  marginTop: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isSendingCode ? 0.7 : 1,
                  cursor: isSendingCode ? 'not-allowed' : 'pointer',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
                }}
              >
                {isSendingCode ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Dispatching Verification Email...</span>
                  </>
                ) : mode === 'signup' ? (
                  <>
                    <span>Verify Gmail & Continue</span>
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', fontSize: '0.76rem', color: '#94a3b8', marginTop: '16px' }}>
              Direct email validity check active. Confirmed Gmail accounts receive verified workspace access.
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/* STAGE 2: GMAIL CONFIRMATION & 6-DIGIT CODE VERIFICATION     */}
        {/* ============================================================ */}
        {step === 'confirm_code' && (
          <div>
            {/* Back button */}
            <button
              onClick={() => { setStep('form'); setErrorMessage(null); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                border: 'none',
                background: 'none',
                color: '#64748b',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '14px',
                padding: '4px 0'
              }}
            >
              <ChevronLeft size={16} />
              <span>Back to email input</span>
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                border: '2px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: '#2563eb'
              }}>
                <Mail size={26} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                Verify Your Email
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.45 }}>
                We sent a 6-digit verification code to: <br />
                <strong style={{ color: '#0f172a', fontSize: '0.92rem' }}>{email}</strong>
              </p>
            </div>

            {/* SIMULATED INCOMING GMAIL NOTIFICATION BANNER */}
            {lastDispatchedCode && (
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '12px 14px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      backgroundColor: '#ea4335',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      letterSpacing: '0.5px'
                    }}>
                      GMAIL PREVIEW
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                      New email from ClickUp Security
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Just now</span>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#334155', marginBottom: '10px' }}>
                  Your confirmation code is: <span style={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    color: '#7c3aed',
                    backgroundColor: '#ede9fe',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    letterSpacing: '2px'
                  }}>{lastDispatchedCode}</span>
                </div>

                {/* Direct Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleAutoFillCode}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Auto-fill Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectMailAccess}
                    style={{
                      flex: 1.3,
                      padding: '7px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <ExternalLink size={12} />
                    <span>Direct Mail Access 🚀</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                color: '#b91c1c',
                fontSize: '0.84rem',
                marginBottom: '14px'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                color: '#16a34a',
                fontSize: '0.84rem',
                marginBottom: '14px'
              }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* 6-DIGIT CODE INPUT BOXES */}
            <form onSubmit={e => handleConfirmCode(e)}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '8px',
                marginBottom: '20px'
              }}>
                {codeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { digitInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={idx === 0 ? 6 : 1}
                    value={digit}
                    onChange={e => handleDigitChange(idx, e.target.value)}
                    onKeyDown={e => handleDigitKeyDown(idx, e)}
                    style={{
                      width: '48px',
                      height: '56px',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      textAlign: 'center',
                      borderRadius: '12px',
                      border: `2px solid ${digit ? '#7c3aed' : '#cbd5e1'}`,
                      backgroundColor: digit ? '#faf5ff' : '#ffffff',
                      outline: 'none',
                      color: '#0f172a',
                      transition: 'all 0.15s'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                    onBlur={e => e.currentTarget.style.borderColor = digit ? '#7c3aed' : '#cbd5e1'}
                  />
                ))}
              </div>

              {/* Confirm Code & Access Workspace Button */}
              <button
                type="submit"
                disabled={isVerifyingCode || codeDigits.join('').length !== 6}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '12px',
                  backgroundColor: codeDigits.join('').length === 6 ? '#7c3aed' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  cursor: codeDigits.join('').length === 6 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: codeDigits.join('').length === 6 ? '0 4px 14px rgba(124, 58, 237, 0.35)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                {isVerifyingCode ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Verifying Code & Activating Account...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Confirm Code & Enter Workspace</span>
                  </>
                )}
              </button>
            </form>

            {/* Resend and Open Gmail options */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '18px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.82rem'
            }}>
              <div>
                {resendCooldown > 0 ? (
                  <span style={{ color: '#94a3b8' }}>
                    Resend code in <strong>{resendCooldown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#7c3aed',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                <span>Open Gmail</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
