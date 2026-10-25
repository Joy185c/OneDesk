import React from 'react';
import { Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenWaitlist: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenWaitlist, onOpenAuth }) => {
  return (
    <footer style={{ backgroundColor: '#f9f9fb', borderTop: '1px solid #eaebf2' }}>
      {/* Pre-Footer Hero CTA Card */}
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #181a27 0%, #291e3e 100%)',
          borderRadius: '28px',
          padding: '60px 40px',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 30px 70px -15px rgba(22, 24, 45, 0.25)'
        }}>
          {/* Ambient light glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(123, 104, 238, 0.35) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '20px'
            }}>
              <Sparkles size={14} color="#ff72e5" />
              <span>SUPERCHARGE YOUR PRODUCTIVITY</span>
            </span>

            <h2 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#ffffff',
              marginBottom: '18px',
              letterSpacing: '-0.03em'
            }}>
              One app to replace them all.
            </h2>

            <p style={{ fontSize: '1.15rem', color: '#c4c8db', lineHeight: 1.5, marginBottom: '36px' }}>
              Join 2,000,000+ teams who save 1 day every week with ClickUp 3.0.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <button
                onClick={() => onOpenAuth('signup')}
                className="btn-primary"
                style={{
                  fontSize: '1.05rem',
                  padding: '14px 34px',
                  borderRadius: '12px'
                }}
              >
                Get Started Free
              </button>

              <button
                onClick={onOpenWaitlist}
                className="btn-emerald"
                style={{
                  fontSize: '1.05rem',
                  padding: '14px 34px',
                  borderRadius: '12px'
                }}
              >
                Join 3.0 Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Strip (from Figma screenshot) */}
      <div style={{
        borderTop: '1px solid #e7e9f2',
        borderBottom: '1px solid #e7e9f2',
        backgroundColor: '#f1f3f9',
        padding: '18px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '36px',
          fontSize: '0.88rem',
          fontWeight: 700,
          color: '#2d3142'
        }}>
          <span>One app to replace them all</span>
          <span style={{ color: '#c2c6d6' }}>|</span>
          <span>24/7 support</span>
          <span style={{ color: '#c2c6d6' }}>|</span>
          <span>Weekly updates</span>
          <span style={{ color: '#c2c6d6' }}>|</span>
          <span>Secure and compliant</span>
          <span style={{ color: '#c2c6d6' }}>|</span>
          <span>99.9% uptime</span>
        </div>
      </div>

      {/* Main Multi-Column Links (from Figma artboard) */}
      <div className="container" style={{ paddingTop: '64px', paddingBottom: '48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '40px',
          marginBottom: '54px'
        }}>
          {/* Column 1: ClickUp */}
          <div>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1a1b2d', marginBottom: '18px' }}>
              ClickUp
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#5f6477' }}>
              <a href="#">Download</a>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Customers</a>
              <a href="#">Community</a>
              <a href="#">Affiliate & Referrals</a>
              <a href="#">Reviews</a>
              <a href="#">Press</a>
            </div>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1a1b2d', marginBottom: '18px' }}>
              Resources
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#5f6477' }}>
              <a href="#">Help Docs</a>
              <a href="#">On-Demand Demo</a>
              <a href="#">ClickUp University</a>
              <a href="#">Webinars</a>
              <a href="#">Events</a>
              <a href="#">Templates</a>
              <a href="#">Import</a>
              <a href="#">API & Developers</a>
            </div>
          </div>

          {/* Column 3: Features */}
          <div>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1a1b2d', marginBottom: '18px' }}>
              Features
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#5f6477' }}>
              <a href="#features">Gantt Chart</a>
              <a href="#features">Dashboards</a>
              <a href="#features">Native Time Tracking</a>
              <a href="#features">Mind Maps</a>
              <a href="#automations">Automations</a>
              <a href="#features">Email in ClickUp</a>
              <a href="#features">Whiteboards</a>
            </div>
          </div>

          {/* Column 4: Compare */}
          <div>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1a1b2d', marginBottom: '18px' }}>
              Compare
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#5f6477' }}>
              <a href="#compare">vs Monday.com</a>
              <a href="#compare">vs Asana</a>
              <a href="#compare">vs Jira</a>
              <a href="#compare">vs Trello</a>
              <a href="#compare">vs Airtable</a>
              <a href="#compare">vs Wrike</a>
              <a href="#compare">vs Notion</a>
            </div>
          </div>

          {/* Column 5: Learn */}
          <div>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1a1b2d', marginBottom: '18px' }}>
              Learn
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#5f6477' }}>
              <a href="#">Blog</a>
              <a href="#">Software Team Hub</a>
              <a href="#">Agency Hub</a>
              <a href="#">Remote Work Guide</a>
              <a href="#">Project Management</a>
            </div>
          </div>

          {/* Column 6: Connect / Social */}
          <div>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1a1b2d', marginBottom: '18px' }}>
              Connect
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              {/* LinkedIn */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#1b1d28',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              {/* Facebook */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#1b1d28',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#1b1d28',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* Twitter / X */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#1b1d28',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#7a8097', lineHeight: 1.5 }}>
              Security & Privacy Certified<br />
              ISO/IEC 27001 • SOC 2 Type II
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright Row */}
        <div style={{
          borderTop: '1px solid #eaebf2',
          paddingTop: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.82rem',
          color: '#848a9e'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 14L9 19L20 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>© 2026 ClickUp. All rights reserved. Community UI Edition.</span>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#">Security</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Status: All Systems Operational 🟢</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
