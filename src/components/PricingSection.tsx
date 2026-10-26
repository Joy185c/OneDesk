import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { PRICING_PLANS } from '../data/clickupData';

interface PricingProps {
  onOpenWaitlist: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const PricingSection: React.FC<PricingProps> = ({ onOpenWaitlist, onOpenAuth }) => {
  const [isYearly, setIsYearly] = useState(true);
  const [showMatrix, setShowMatrix] = useState(false);

  const handlePlanClick = (planId: string) => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 }
    });
    if (planId === 'free') {
      onOpenAuth('signup');
    } else if (planId === 'enterprise') {
      onOpenWaitlist();
    } else {
      onOpenAuth('signup');
    }
  };

  return (
    <section id="pricing" style={{
      padding: '100px 0',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #eaebf2'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
          <span className="badge-pill badge-purple" style={{ marginBottom: '14px' }}>
            TRANSPARENT PRICING
          </span>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: '#1a1b2d',
            marginBottom: '16px',
            letterSpacing: '-0.03em'
          }}>
            One simple price for all your work.
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#5f6377' }}>
            Get started completely free forever. All core features unlocked with zero subscription requirements.
          </p>

          {/* Free Edition Launch Banner */}
          <div style={{
            margin: '20px auto 0',
            maxWidth: '620px',
            padding: '10px 18px',
            backgroundColor: '#ecfdf5',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#065f46',
            fontSize: '0.86rem',
            fontWeight: 600
          }}>
            <Sparkles size={16} color="#10b981" />
            <span><strong>OneDesk Free Edition:</strong> 100% Free for everyone. No credit card, payment, or upgrade gate.</span>
          </div>

          {/* Monthly / Yearly Toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#f3f4f8',
            padding: '6px',
            borderRadius: '100px',
            marginTop: '28px',
            border: '1px solid #e2e5ee'
          }}>
            <button
              onClick={() => setIsYearly(false)}
              style={{
                padding: '8px 20px',
                borderRadius: '100px',
                fontSize: '0.9rem',
                fontWeight: 600,
                backgroundColor: !isYearly ? '#ffffff' : 'transparent',
                color: !isYearly ? '#1e1f2b' : '#656b82',
                boxShadow: !isYearly ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer'
              }}
            >
              Monthly Billing
            </button>

            <button
              onClick={() => setIsYearly(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '100px',
                fontSize: '0.9rem',
                fontWeight: 600,
                backgroundColor: isYearly ? '#ffffff' : 'transparent',
                color: isYearly ? '#1e1f2b' : '#656b82',
                boxShadow: isYearly ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer'
              }}
            >
              <span>Yearly Billing</span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                backgroundColor: '#00b8841f',
                color: '#00b884',
                padding: '2px 8px',
                borderRadius: '100px'
              }}>
                SAVE 45%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          alignItems: 'stretch',
          marginBottom: '50px'
        }}>
          {PRICING_PLANS.map((plan) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                style={{
                  position: 'relative',
                  backgroundColor: plan.highlighted ? '#ffffff' : '#fcfcfe',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  border: plan.highlighted ? '2px solid #7b68ee' : '1px solid #e5e8f2',
                  boxShadow: plan.highlighted 
                    ? '0 20px 50px -10px rgba(123, 104, 238, 0.2), 0 0 0 1px #7b68ee' 
                    : '0 4px 12px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s'
                }}
              >
                {/* Highlighted Ribbon Badge */}
                {plan.highlighted && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 100%)',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '4px 14px',
                    borderRadius: '100px',
                    boxShadow: '0 4px 12px rgba(123, 104, 238, 0.35)'
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '1.4rem', color: '#1a1b2d', marginBottom: '8px' }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#686e82', minHeight: '40px', lineHeight: 1.4, marginBottom: '20px' }}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '2.6rem', fontWeight: 800, color: '#1a1b2d' }}>
                      ${price}
                    </span>
                    <span style={{ fontSize: '0.84rem', color: '#7a8097' }}>
                      {plan.id === 'free' ? 'forever' : '/user /month'}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanClick(plan.id)}
                    className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '0.92rem',
                      marginBottom: '28px'
                    }}
                  >
                    {plan.buttonText}
                  </button>

                  {/* Features List */}
                  <div style={{ borderTop: '1px solid #eaebf2', paddingTop: '20px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888ea6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                      Key Features:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem' }}>
                          <Check size={16} color={plan.highlighted ? '#7b68ee' : '#00b884'} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ color: '#333748' }}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: '#888ea6' }}>
                  {plan.id === 'free' ? 'No credit card required' : '14-day money back guarantee'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Security Banner */}
        <div style={{
          backgroundColor: '#f7f8fd',
          borderRadius: '16px',
          padding: '24px 32px',
          border: '1px solid #e1e4f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(123, 104, 238, 0.12)',
              color: '#7b68ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', color: '#1e1f2b' }}>Enterprise-Grade Security & Compliance</h4>
              <p style={{ fontSize: '0.86rem', color: '#686e82' }}>
                SOC 2 Type II, ISO 27001, HIPAA & GDPR compliant. Universal search, 99.99% SLA and dedicated support.
              </p>
            </div>
          </div>

          <button 
            onClick={onOpenWaitlist}
            className="btn-secondary"
            style={{ fontSize: '0.9rem', padding: '10px 20px' }}
          >
            Talk to Enterprise Team
          </button>
        </div>
      </div>
    </section>
  );
};
