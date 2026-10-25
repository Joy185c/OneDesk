import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState('11-50 people');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
    setSubmitted(true);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 17, 26, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        padding: '36px 32px',
        position: 'relative',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
        border: '1px solid #e2e5f0'
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
            backgroundColor: '#f1f2f6',
            color: '#656b82',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {!submitted ? (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0, 184, 132, 0.12)', color: '#00996d', padding: '4px 12px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '16px' }}>
              <Sparkles size={14} />
              <span>CLICKUP 3.0 EARLY ACCESS</span>
            </div>

            <h3 style={{ fontSize: '1.8rem', color: '#1a1b2d', marginBottom: '10px' }}>
              Join the 3.0 Waitlist
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#5f6377', lineHeight: 1.5, marginBottom: '24px' }}>
              Get early access to sub-second navigation, universal search, and our new contextual workspace canvas.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#2d3142', marginBottom: '6px' }}>
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#2d3142', marginBottom: '6px' }}>
                  Team Size
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.92rem',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="1-10 people">1 - 10 people</option>
                  <option value="11-50 people">11 - 50 people</option>
                  <option value="51-200 people">51 - 200 people</option>
                  <option value="200+ people">200+ people (Enterprise)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-emerald"
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  marginTop: '8px'
                }}
              >
                <span>Reserve My Priority Spot</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#888ea6' }}>
                Join 180,000+ engineers, designers, and managers waiting for rollout.
              </div>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 184, 132, 0.15)',
              color: '#00b884',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.6rem', color: '#1a1b2d', marginBottom: '10px' }}>
              You are on the list! 🎉
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#555b70', lineHeight: 1.5, marginBottom: '24px' }}>
              We have reserved your spot for <strong>{email}</strong>. We'll send your priority activation link to your inbox.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  onClose();
                  navigate('/workspace');
                }}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.94rem',
                  fontWeight: 800
                }}
              >
                <span>Launch Interactive Workspace Now</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  color: '#64748b',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Back to Website
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
