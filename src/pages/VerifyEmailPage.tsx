import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, CheckCircle2, Loader2, ExternalLink, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();

  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isGmail = email.toLowerCase().endsWith('@gmail.com') || email.toLowerCase().endsWith('@googlemail.com');
  const isOutlook = email.toLowerCase().endsWith('@outlook.com') || email.toLowerCase().endsWith('@hotmail.com');
  const webmailUrl = isGmail 
    ? 'https://mail.google.com' 
    : isOutlook 
    ? 'https://outlook.live.com' 
    : `mailto:${email}`;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle optional 6-digit code or numeric token verification
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!code.trim() || code.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifying(true);

    try {
      const res = await verifyOtp(email, code.trim());
      setIsVerifying(false);

      if (res.success) {
        setSuccessMessage('Email verified successfully! Entering your workspace...');
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          navigate('/workspace', { replace: true });
        }, 1200);
      } else {
        setErrorMessage(res.error || 'Invalid or expired code. Please click the confirmation link in your email instead.');
      }
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMessage(err?.message || 'Verification error.');
    }
  };

  // Resend Supabase signup confirmation email
  const handleResend = async () => {
    if (resendCooldown > 0 || !email.trim()) return;
    setIsResending(true);
    setErrorMessage(null);

    try {
      if (supabase) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email.trim().toLowerCase(),
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        setIsResending(false);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setResendCooldown(60);
          setSuccessMessage('A fresh confirmation email has been dispatched to your inbox.');
        }
      } else {
        setIsResending(false);
        setErrorMessage('Authentication client is unavailable.');
      }
    } catch (err: any) {
      setIsResending(false);
      setErrorMessage(err?.message || 'Failed to resend confirmation email.');
    }
  };

  // Check if session was confirmed after clicking link in another tab
  const handleCheckSession = async () => {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      navigate('/workspace', { replace: true });
    } else {
      navigate('/login');
    }
  };

  return (
    <AuthLayout
      title="Check your Email"
      subtitle="We have sent a verification link to confirm your OneDesk account."
      badge="Confirmation Sent"
    >
      {/* Visual Envelope */}
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-selected, #e8f5ee)',
          border: '1.5px solid var(--border-default, #bbf7d0)',
          color: 'var(--brand-primary, #176B50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(23, 107, 80, 0.12)'
        }}>
          <Mail size={32} />
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary, #52695B)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
          A confirmation email was dispatched to:
        </p>
        <div style={{
          display: 'inline-block',
          backgroundColor: 'var(--bg-selected, #e8f5ee)',
          border: '1.5px solid #86efac',
          padding: '6px 18px',
          borderRadius: '100px',
          color: 'var(--brand-primary, #176B50)',
          fontWeight: 800,
          fontSize: '0.94rem',
          letterSpacing: '0.2px',
          marginBottom: '16px'
        }}>
          {email || 'your email address'}
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary, #52695B)', margin: 0, lineHeight: 1.5 }}>
          Open your email inbox and click <strong style={{ color: 'var(--brand-primary, #176B50)', fontWeight: 800 }}>&quot;Confirm your mail&quot;</strong> to activate your OneDesk account.
        </p>
      </div>

      {/* Direct Webmail Shortcut Button */}
      <div style={{ marginBottom: '14px' }}>
        <a
          href={webmailUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #176B50 0%, #11533E 100%)',
            color: '#ffffff',
            fontSize: '0.94rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            textDecoration: 'none',
            boxShadow: '0 6px 20px rgba(23, 107, 80, 0.28)',
            boxSizing: 'border-box',
            transition: 'transform 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span>{isGmail ? 'Open Gmail Inbox' : isOutlook ? 'Open Outlook Inbox' : 'Open Email Inbox'}</span>
          <ExternalLink size={16} />
        </a>
      </div>

      {/* I have confirmed link button */}
      <div style={{ marginBottom: '16px' }}>
        <button
          type="button"
          onClick={handleCheckSession}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-canvas, #F0F4F0)',
            border: '1.5px solid var(--border-default, #DCE7DE)',
            color: 'var(--text-primary, #182A22)',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--brand-primary, #176B50)';
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary, #F0F4F0)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-default, #DCE7DE)';
            e.currentTarget.style.backgroundColor = 'var(--bg-canvas, #F0F4F0)';
          }}
        >
          <CheckCircle2 size={16} color="var(--brand-primary, #176B50)" />
          <span>I have confirmed my email → Sign in</span>
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '0.84rem',
          fontWeight: 600,
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '0.84rem',
          fontWeight: 600,
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {errorMessage}
        </div>
      )}

      {/* Resend Cooldown Section */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        {resendCooldown > 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #71877B)', margin: 0, fontWeight: 500 }}>
            Resend confirmation link available in {resendCooldown}s
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResending}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand-primary, #176B50)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'underline'
            }}
          >
            {isResending ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Resending...</span>
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                <span>Didn&apos;t receive it? Resend confirmation email</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Optional 6-Digit Code Fallback (Collapsible) */}
      <div style={{
        borderTop: '1px solid var(--border-default, #DCE7DE)',
        paddingTop: '14px',
        marginTop: '8px'
      }}>
        <button
          type="button"
          onClick={() => setShowCodeInput(!showCodeInput)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary, #52695B)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            width: '100%',
            marginBottom: showCodeInput ? '14px' : '0'
          }}
        >
          <span>Received a 6-digit confirmation code instead?</span>
          {showCodeInput ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showCodeInput && (
          <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="e.g. 849201"
              maxLength={6}
              style={{
                width: '100%',
                padding: '10px',
                textAlign: 'center',
                letterSpacing: '6px',
                fontSize: '1.2rem',
                fontWeight: 800,
                backgroundColor: 'var(--bg-canvas, #F0F4F0)',
                border: '1.5px solid var(--border-default, #DCE7DE)',
                borderRadius: '8px',
                color: 'var(--text-primary, #182A22)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={isVerifying}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: 'var(--brand-primary, #176B50)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: isVerifying ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              {isVerifying ? <Loader2 size={14} className="animate-spin" /> : <span>Verify Code</span>}
            </button>
          </form>
        )}
      </div>

      {/* Back to sign in */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Link
          to="/login"
          style={{
            fontSize: '0.84rem',
            color: 'var(--brand-primary, #176B50)',
            textDecoration: 'none',
            fontWeight: 700
          }}
        >
          ← Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
