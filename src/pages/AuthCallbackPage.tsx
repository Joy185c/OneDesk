import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      if (!supabase) {
        if (isMounted) setErrorMessage('Supabase client is not available.');
        return;
      }

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const codeParam = urlParams.get('code');

        if (codeParam) {
          const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(codeParam);
          if (exchangeErr) {
            console.warn('[OneDesk Callback] exchangeCodeForSession error:', exchangeErr);
          } else if (data.session) {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.55 }
            });
            setTimeout(() => {
              navigate('/workspace', { replace: true });
            }, 600);
            return;
          }
        }

        // Exchange code/tokens for active session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[OneDesk Callback] Session exchange error:', error);
          if (isMounted) setErrorMessage(error.message);
          return;
        }

        if (session) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.55 }
          });
          setTimeout(() => {
            navigate('/workspace', { replace: true });
          }, 600);
        } else {
          // Listen for next auth state change in case callback is processing asynchronously
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (newSession && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
              subscription?.unsubscribe();
              navigate('/workspace', { replace: true });
            }
          });

          // Fallback timeout after 4 seconds
          setTimeout(() => {
            if (isMounted && !session) {
              navigate('/workspace', { replace: true });
            }
          }, 4000);
        }
      } catch (err: any) {
        console.error('[OneDesk Callback] Unexpected callback error:', err);
        if (isMounted) setErrorMessage(err?.message || 'Authentication callback failed.');
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.2) 0%, rgba(9, 13, 22, 1) 75%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#ffffff'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        backgroundColor: '#111726',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px 28px',
        textAlign: 'center',
        boxShadow: '0 25px 70px rgba(0,0,0,0.6)'
      }}>
        {errorMessage ? (
          <div>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}>
              <AlertCircle size={28} />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>
              Authentication Failed
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              {errorMessage}
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)'
            }}>
              <Loader2 size={26} color="#ffffff" className="animate-spin" />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>
              Authenticating with OneDesk
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: 0 }}>
              Verifying security tokens and synchronizing workspace permissions...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
