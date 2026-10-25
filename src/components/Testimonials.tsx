import React, { useState } from 'react';
import { ChevronDown, Star, Quote } from 'lucide-react';
import { TESTIMONIALS, FAQS } from '../data/clickupData';

export const Testimonials: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section style={{
      padding: '100px 0',
      backgroundColor: '#ffffff'
    }}>
      <div className="container">
        {/* Testimonials Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px' }}>
          <span className="badge-pill badge-green" style={{ marginBottom: '14px' }}>
            REAL CUSTOMER IMPACT
          </span>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: '#1a1b2d',
            marginBottom: '16px',
            letterSpacing: '-0.03em'
          }}>
            Loved by 2,000,000+ teams.
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#5f6377' }}>
            From high-growth startups to Fortune 500 enterprises, teams move faster with ClickUp.
          </p>
        </div>

        {/* Testimonials 3-Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '90px'
        }}>
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              style={{
                backgroundColor: '#f8f9fd',
                borderRadius: '20px',
                padding: '32px 28px',
                border: '1px solid #e5e8f4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
              }}
            >
              <div>
                {/* Metric callout */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}>
                    {t.metric}
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#686e82' }}>
                    {t.metricLabel}
                  </div>
                </div>

                <p style={{ fontSize: '0.96rem', color: '#333748', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>
                  "{t.quote}"
                </p>
              </div>

              {/* Author footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #eaebf2', paddingTop: '16px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#7b68ee18',
                  color: '#7b68ee',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {t.logo}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e1f2b' }}>{t.author}</div>
                  <div style={{ fontSize: '0.78rem', color: '#7a8097' }}>{t.role} • {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '2rem', color: '#1a1b2d', marginBottom: '10px' }}>
              Frequently Asked Questions
            </h3>
            <p style={{ color: '#686e82' }}>
              Everything you need to know about ClickUp 3.0, plans, and migrations.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #e5e8f2',
                    boxShadow: isOpen ? '0 4px 16px rgba(0,0,0,0.04)' : 'none',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: isOpen ? '#7b68ee' : '#1e1f2b',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                        color: isOpen ? '#7b68ee' : '#888ea6',
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 24px 20px',
                      fontSize: '0.94rem',
                      color: '#555b70',
                      lineHeight: 1.6
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
