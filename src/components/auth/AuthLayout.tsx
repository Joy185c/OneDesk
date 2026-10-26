import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, badge }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-canvas, #F0F4F0)',
      backgroundImage: theme === 'dark' 
        ? 'radial-gradient(ellipse at 50% 15%, rgba(23, 107, 80, 0.25) 0%, var(--bg-canvas, #091B17) 75%)'
        : 'radial-gradient(ellipse at 50% 15%, rgba(23, 107, 80, 0.12) 0%, var(--bg-canvas, #F0F4F0) 75%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: 'var(--text-primary, #182A22)',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: 'var(--bg-surface, #ffffff)',
        borderRadius: '24px',
        border: '1px solid var(--border-default, #DCE7DE)',
        boxShadow: theme === 'dark'
          ? '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(23, 107, 80, 0.15)'
          : '0 20px 60px -10px rgba(18, 61, 50, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)',
        padding: '36px 32px',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        {/* Top Right Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-surface-secondary, #F0F4F0)',
            border: '1px solid var(--border-default, #DCE7DE)',
            color: 'var(--brand-primary, #176B50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Glow accent line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #176B50, #55D6A0, transparent)'
        }} />

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #176B50 0%, #11533E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(23, 107, 80, 0.3)'
            }}>
              <ShieldCheck size={22} color="#ffffff" />
            </div>
            <span style={{
              fontSize: '1.45rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary, #182A22)'
            }}>
              OneDesk
            </span>
          </Link>

          {badge && (
            <div style={{ marginTop: '12px' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--brand-primary, #176B50)',
                backgroundColor: 'var(--bg-selected, #e8f5ee)',
                border: '1px solid var(--border-default, #cbe5d4)',
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
            fontSize: '1.42rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary, #182A22)'
          }}>
            {title}
          </h1>
          <p style={{
            margin: 0,
            fontSize: '0.86rem',
            color: 'var(--text-secondary, #52695B)',
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
          borderTop: '1px solid var(--border-default, #DCE7DE)',
          textAlign: 'center',
          fontSize: '0.74rem',
          color: 'var(--text-muted, #71877B)'
        }}>
          Protected by Supabase GoTrue Auth & SSL Encryption • 100% Free Plan Certified
        </div>
      </div>
    </div>
  );
};
