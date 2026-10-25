import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, badge }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(124, 58, 237, 0.18) 0%, rgba(9, 13, 22, 1) 70%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#ffffff',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: '#111726',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(124, 58, 237, 0.12)',
        padding: '36px 32px',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        {/* Glow accent line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #7c3aed, #ec4899, transparent)'
        }} />

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)'
            }}>
              <ShieldCheck size={22} color="#ffffff" />
            </div>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              OneDesk
            </span>
          </Link>

          {badge && (
            <div style={{ marginTop: '14px' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#a78bfa',
                backgroundColor: 'rgba(124, 58, 237, 0.15)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                padding: '3px 10px',
                borderRadius: '100px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                {badge}
              </span>
            </div>
          )}

          <h1 style={{
            margin: '14px 0 6px 0',
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#ffffff'
          }}>
            {title}
          </h1>
          <p style={{
            margin: 0,
            fontSize: '0.86rem',
            color: '#94a3b8',
            lineHeight: 1.5
          }}>
            {subtitle}
          </p>
        </div>

        {/* Form Body */}
        {children}

        {/* Footer info */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          textAlign: 'center',
          fontSize: '0.74rem',
          color: '#64748b'
        }}>
          Protected by Supabase GoTrue Auth & SSL Encryption • 100% Free Plan Certified
        </div>
      </div>
    </div>
  );
};
