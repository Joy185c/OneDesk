import React from 'react';
import { Settings, X } from 'lucide-react';

interface MoreFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApp: (appName: string) => void;
  onCustomizeNav?: () => void;
}

export const MoreFlyout: React.FC<MoreFlyoutProps> = ({ 
  isOpen, 
  onClose, 
  onSelectApp,
  onCustomizeNav 
}) => {
  if (!isOpen) return null;

  const modules = [
    {
      id: 'projects',
      name: 'Projects',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="9" rx="1.5" fill="#7c3aed" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" fill="#a855f7" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" fill="#6366f1" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" fill="#8b5cf6" />
        </svg>
      )
    },
    {
      id: 'spaces',
      name: 'Spaces',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill="url(#spacePlanetGrad)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.2" stroke="#a855f7" strokeWidth="1.8" transform="rotate(-28 12 12)" />
          {/* Sparkles */}
          <circle cx="19" cy="5.5" r="1.1" fill="#fbbf24" />
          <circle cx="5" cy="18" r="0.9" fill="#f472b6" />
          <defs>
            <linearGradient id="spacePlanetGrad" x1="8" y1="7" x2="16" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a855f7" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'chat',
      name: 'Chat',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path 
            d="M20 11.5C20 15.6 16.4 19 12 19C10.6 19 9.3 18.6 8.2 18L4 19.5L5.4 15.6C4.5 14.4 4 13 4 11.5C4 7.4 7.6 4 12 4C16.4 4 20 7.4 20 11.5Z" 
            stroke="#0d9488" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="#ccfbf1" 
          />
          <path d="M8.5 11.5H15.5M8.5 8.5H13" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'docs',
      name: 'Docs',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M6 2H14L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2Z" fill="#0284c7" />
          <path d="M14 2V8H20" fill="#bae6fd" />
          <line x1="8" y1="13" x2="16" y2="13" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="8" y1="17" x2="14" y2="17" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'forms',
      name: 'Forms',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="4.5" y="4" width="15" height="17" rx="3" fill="#6366f1" />
          <rect x="8" y="2" width="8" height="3.5" rx="1.5" fill="#c7d2fe" />
          <path d="M8.5 12.5L11 15L15.5 10" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'clips',
      name: 'Clips',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="13" height="12" rx="3" fill="#ef4444" />
          <path d="M16 10L21 6.5V17.5L16 14V10Z" fill="#f87171" />
          <circle cx="8" cy="12" r="2" fill="#ffffff" />
        </svg>
      )
    },
    {
      id: 'goals',
      name: 'Goals',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M6 4H18V10C18 13.3 15.3 16 12 16C8.7 16 6 13.3 6 10V4Z" fill="#d97706" />
          <path d="M12 16V20M8 20H16" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 6H3C3 8.5 4.5 9.5 6 10" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 6H21C21 8.5 19.5 9.5 18 10" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="8.5" r="2" fill="#fef3c7" />
        </svg>
      )
    },
    {
      id: 'sprints',
      name: 'Sprints',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
          <path d="M12 7V12L15 14" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill="#059669" />
        </svg>
      )
    },
    {
      id: 'agents',
      name: 'AI Agents',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="5" width="16" height="14" rx="4" fill="url(#agentBgGrad)" />
          <line x1="12" y1="2" x2="12" y2="5" stroke="#a855f7" strokeWidth="2" />
          <circle cx="9" cy="11" r="1.5" fill="#ffffff" />
          <circle cx="15" cy="11" r="1.5" fill="#ffffff" />
          <path d="M9 15H15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="agentBgGrad" x1="4" y1="5" x2="20" y2="19" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7c3aed" />
              <stop offset="1" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'automations',
      name: 'Automations',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#autoZapGrad)" />
          <defs>
            <linearGradient id="autoZapGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ec4899" />
              <stop offset="0.5" stopColor="#a855f7" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'analytics',
      name: 'Dashboards',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="12" width="5" height="9" rx="1.5" fill="#a855f7" />
          <rect x="10" y="5" width="5" height="16" rx="1.5" fill="#7c3aed" />
          <rect x="17" y="9" width="5" height="12" rx="1.5" fill="#3b82f6" />
        </svg>
      )
    },
    {
      id: 'whiteboard',
      name: 'Whiteboards',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="13" rx="3" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.8" />
          <path d="M7 10L10 13L16 8" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 20L16 20" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'scheduling',
      name: 'Scheduling',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="17" rx="3.5" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.8" />
          <path d="M8 2.5V5.5M16 2.5V5.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
          <path d="M3 9.5H21" stroke="#16a34a" strokeWidth="1.5" />
          <path d="M8 14L11 17L16 12" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'apps',
      name: 'Apps',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="7" height="7" rx="2" fill="#ef4444" />
          <rect x="13" y="4" width="7" height="7" rx="2" fill="#3b82f6" />
          <rect x="4" y="13" width="7" height="7" rx="2" fill="#10b981" />
          <rect x="13" y="13" width="7" height="7" rx="2" fill="#f59e0b" />
          <circle cx="7.5" cy="7.5" r="1.5" fill="#ffffff" />
          <circle cx="16.5" cy="7.5" r="1.5" fill="#ffffff" />
          <circle cx="7.5" cy="16.5" r="1.5" fill="#ffffff" />
          <circle cx="16.5" cy="16.5" r="1.5" fill="#ffffff" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Click outside backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1998,
          backgroundColor: 'transparent'
        }}
      />

      {/* Flyout Card matching Screenshot 2 precisely */}
      <div style={{
        position: 'fixed',
        left: '64px',
        top: '155px',
        width: '270px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.14), 0 2px 10px rgba(0, 0, 0, 0.05)',
        zIndex: 1999,
        padding: '16px 14px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: 'fadeIn 0.15s ease-out'
      }}>
        {/* 3-Column Module Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          rowGap: '12px'
        }}>
          {modules.map(mod => (
            <div
              key={mod.id}
              onClick={() => {
                onSelectApp(mod.id);
                onClose();
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 4px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                border: '1px solid #eef2f6',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '4px'
              }}>
                {mod.icon}
              </div>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                color: '#1e293b',
                textAlign: 'center'
              }}>
                {mod.name}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Button: Customize navigation */}
        <button
          onClick={() => {
            if (onCustomizeNav) onCustomizeNav();
            onClose();
          }}
          style={{
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '7px 12px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            marginTop: '4px',
            transition: 'background-color 0.15s'
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
        >
          <Settings size={14} color="#64748b" />
          <span>Customize navigation</span>
        </button>
      </div>
    </>
  );
};
