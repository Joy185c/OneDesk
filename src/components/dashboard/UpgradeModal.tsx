import React, { useState } from 'react';
import { 
  X, 
  Rocket, 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  CheckCircle2,
  Crown,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PRODUCT_FLAGS } from '../../config/productFlags';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  onPlanUpgraded: (newPlan: string) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  currentPlan = 'Free', 
  onPlanUpgraded 
}) => {
  const { user } = useAuth();
  const workspaceName = user?.workspaceName || (user?.name ? `${user.name}'s Workspace` : 'My Workspace');
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<string>('Business');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Free Edition Mode (Phase 0: Scope Freeze)
  if (!PRODUCT_FLAGS.subscriptionsEnabled) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={16} />
          </button>

          <div style={{
            padding: '36px 30px',
            background: 'radial-gradient(ellipse at top, #faf5ff 0%, #ffffff 80%)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
            }}>
              <Sparkles size={28} />
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '100px',
              marginBottom: '12px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <CheckCircle2 size={14} />
              <span>Free Community Edition — All Features Unlocked</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>
              OneDesk is 100% Free
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              In this production release, every user and team gets access to all supported features with no credit card, checkout, or subscription required.
            </p>

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '14px',
              padding: '16px 20px',
              textAlign: 'left',
              marginBottom: '24px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {[
                'Unlimited Tasks, Kanban & List Views',
                'Real-Time Channel Chat & Direct Messages',
                'Collaborative Docs & Whiteboards',
                'Calendar & Google Meet Scheduler',
                'Billable Timesheets & Hours Tracking',
                'Public Intake Forms & Responses',
                'Strategic Goals (OKRs) & Real Dashboard Analytics',
                'Bring-Your-Own-Key (BYOK) AI Intelligence'
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#334155' }}>
                  <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #ff72e5 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.35)'
              }}
            >
              Continue with Free Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleUpgrade = (planName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      onPlanUpgraded(planName);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  const plans = [
    {
      name: 'Unlimited',
      badge: 'Best for small teams',
      price: billingCycle === 'yearly' ? '$7' : '$10',
      period: 'per member / month',
      features: [
        'Unlimited Storage & Attachments',
        'Unlimited Integrations (GitHub, Slack)',
        'Unlimited Dashboards & Charts',
        'Guests with permissions',
        'Column calculations & custom fields'
      ],
      color: '#3b82f6',
      buttonBg: '#0f172a'
    },
    {
      name: 'Business',
      badge: 'Most Popular 🔥',
      price: billingCycle === 'yearly' ? '$12' : '$19',
      period: 'per member / month',
      features: [
        'Everything in Unlimited, plus:',
        'Google Single Sign-On (SSO)',
        'Unlimited Brain AI™ Automations',
        'Timesheets & Billable Tracking',
        'Advanced Whiteboard Canvases',
        'Workload Management & Sprints'
      ],
      popular: true,
      color: '#7c3aed',
      buttonBg: 'linear-gradient(135deg, #7c3aed 0%, #ff72e5 100%)'
    },
    {
      name: 'Enterprise',
      badge: 'For large organizations',
      price: 'Custom',
      period: 'tailored pricing',
      features: [
        'Everything in Business, plus:',
        'White Labeling & Custom Branding',
        'Enterprise API & Unlimited Rate limits',
        'HIPAA & SOC 2 Type II compliance',
        'Dedicated Customer Success Manager',
        'Custom Permissions & Role provisioning'
      ],
      color: '#059669',
      buttonBg: '#0f172a'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        maxWidth: '920px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
            zIndex: 10
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{
          textAlign: 'center',
          padding: '36px 30px 20px 30px',
          background: 'radial-gradient(ellipse at top, #faf5ff 0%, #ffffff 80%)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ede9fe',
            color: '#7c3aed',
            fontSize: '0.78rem',
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: '100px',
            marginBottom: '12px'
          }}>
            <Rocket size={14} />
            <span>Upgrade {workspaceName}</span>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Unleash the full power of ClickUp 3.0
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
            Get unlimited Brain AI, custom dashboards, infinite timesheets, and enterprise-grade automation.
          </p>

          {/* Billing Cycle Toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                border: 'none',
                backgroundColor: billingCycle === 'yearly' ? '#ffffff' : 'transparent',
                color: billingCycle === 'yearly' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.82rem',
                padding: '6px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: billingCycle === 'yearly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Yearly</span>
              <span style={{ backgroundColor: '#22c55e', color: '#fff', fontSize: '0.66rem', fontWeight: 800, padding: '1px 6px', borderRadius: '100px' }}>
                Save 30%
              </span>
            </button>

            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                border: 'none',
                backgroundColor: billingCycle === 'monthly' ? '#ffffff' : 'transparent',
                color: billingCycle === 'monthly' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.82rem',
                padding: '6px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: billingCycle === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          padding: '20px 30px 36px 30px'
        }}>
          {plans.map(p => (
            <div
              key={p.name}
              style={{
                border: p.popular ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                backgroundColor: p.popular ? '#faf5ff' : '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: p.popular ? '0 12px 30px rgba(124, 58, 237, 0.15)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {p.name}
                  </h3>
                  {p.popular && (
                    <Crown size={18} color="#7c3aed" />
                  )}
                </div>

                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: p.color, textTransform: 'uppercase', marginBottom: '14px' }}>
                  {p.badge}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
                    {p.price}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    {p.period}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '16px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {p.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: '#334155' }}>
                      <Check size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button
                  onClick={() => handleUpgrade(p.name)}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    background: p.buttonBg,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: p.popular ? '0 4px 14px rgba(124, 58, 237, 0.35)' : 'none'
                  }}
                >
                  {isProcessing ? 'Activating Plan...' : `Upgrade to ${p.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
