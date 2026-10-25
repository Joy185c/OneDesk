import React from 'react';
import { 
  Star, 
  ShieldCheck, 
  Award, 
  Users, 
  CheckCircle2, 
  Lock, 
  Globe, 
  Zap,
  TrendingUp
} from 'lucide-react';

export const SocialProofSection: React.FC = () => {
  const logos = [
    { name: 'Spotify', icon: '🎧' },
    { name: 'Netflix', icon: '🍿' },
    { name: 'T-Mobile', icon: '📱' },
    { name: 'IBM', icon: '💻' },
    { name: 'Logitech', icon: '🖱️' },
    { name: 'Fortinet', icon: '🛡️' }
  ];

  const g2Badges = [
    { title: 'Leader 2026', org: 'G2 Grid', color: '#ff4d4f' },
    { title: '#1 Most Implemented', org: 'Enterprise PM', color: '#1890ff' },
    { title: 'Best Usability', org: 'All-in-One Apps', color: '#52c41a' },
    { title: 'Fastest ROI', org: 'Productivity Tech', color: '#faad14' }
  ];

  return (
    <section style={{
      padding: '90px 0',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #eaebf2'
    }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            marginBottom: '12px'
          }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
            ))}
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e293b', marginLeft: '6px' }}>
              4.7 / 5 across 25,000+ reviews
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontWeight: 900,
            color: '#1a1b2d',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '12px'
          }}>
            Loved by 5+ million teams, backed by 100+ awards
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
            The #1 most referenced productivity software on G2 and TrustRadius reports.
          </p>
        </div>

        {/* Client Logos Ribbon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '40px',
          padding: '24px 0',
          marginBottom: '50px',
          borderTop: '1px solid #f1f5f9',
          borderBottom: '1px solid #f1f5f9'
        }}>
          {logos.map((logo, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#475569',
              filter: 'grayscale(0.6)',
              opacity: 0.85
            }}>
              <span style={{ fontSize: '1.4rem' }}>{logo.icon}</span>
              <span>{logo.name}</span>
            </div>
          ))}
        </div>

        {/* G2 Awards Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '60px'
        }}>
          {g2Badges.map((badge, i) => (
            <div key={i} style={{
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
              }}>
                <Award size={20} color={badge.color} />
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{badge.title}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>{badge.org}</div>
            </div>
          ))}
        </div>

        {/* Enterprise-Grade Everything Band */}
        <div style={{
          backgroundColor: '#161824',
          borderRadius: '24px',
          padding: '40px',
          color: '#ffffff',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          alignItems: 'center'
        }} className="enterprise-band">
          <style>{`
            @media (max-width: 860px) {
              .enterprise-band { grid-template-columns: 1fr !important; padding: 24px !important; }
            }
          `}</style>

          <div>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#34d399',
              backgroundColor: 'rgba(52, 211, 153, 0.15)',
              padding: '4px 10px',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              ENTERPRISE SECURITY
            </span>
            <h3 style={{
              fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)',
              fontWeight: 900,
              color: '#ffffff',
              margin: '12px 0 14px',
              lineHeight: 1.2
            }}>
              Enterprise-grade everything
            </h3>
            <p style={{ fontSize: '0.96rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Built for organizations with strict compliance, continuous availability, and global identity management requirements.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <ShieldCheck size={20} color="#34d399" />
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff', marginTop: '8px' }}>SOC 2 Type II</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Certified security audit</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Lock size={20} color="#38bdf8" />
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff', marginTop: '8px' }}>HIPAA & GDPR</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Global privacy ready</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Globe size={20} color="#a78bfa" />
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff', marginTop: '8px' }}>99.99% SLA</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Guaranteed uptime</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Users size={20} color="#f472b6" />
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff', marginTop: '8px' }}>SAML & SCIM</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Okta & Azure AD sync</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
