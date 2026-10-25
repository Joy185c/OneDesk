import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import { COMPETITOR_COMPARISONS } from '../data/clickupData';

interface CompareProps {
  onOpenWaitlist: () => void;
}

export const CompareSection: React.FC<CompareProps> = ({ onOpenWaitlist }) => {
  return (
    <section id="compare" style={{
      padding: '100px 0',
      backgroundColor: '#fbfbfd',
      borderTop: '1px solid #eaebf2'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span className="badge-pill badge-purple" style={{ marginBottom: '14px' }}>
            WHY TEAMS SWITCH
          </span>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: '#1a1b2d',
            marginBottom: '16px',
            letterSpacing: '-0.03em'
          }}>
            ClickUp vs. The Rest.
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#5f6377' }}>
            Why pay for Asana + Jira + Notion + Slack when ClickUp brings your entire workspace together for a fraction of the cost?
          </p>
        </div>

        {/* Comparison Table */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 20px 50px -10px rgba(22, 24, 45, 0.08)',
          border: '1px solid #e2e5ef',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eef0f6' }}>
                <th style={{ padding: '20px 24px', fontSize: '0.95rem', color: '#686e82', width: '38%' }}>Features & Capabilities</th>
                <th style={{ padding: '20px 24px', fontSize: '1.1rem', fontWeight: 800, color: '#7b68ee', backgroundColor: '#f9f8ff', textAlign: 'center', width: '22%' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span>ClickUp</span>
                    <span style={{ fontSize: '0.68rem', backgroundColor: '#7b68ee', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>3.0</span>
                  </div>
                </th>
                <th style={{ padding: '20px 20px', fontSize: '0.92rem', fontWeight: 700, color: '#686e82', textAlign: 'center', width: '13%' }}>Monday.com</th>
                <th style={{ padding: '20px 20px', fontSize: '0.92rem', fontWeight: 700, color: '#686e82', textAlign: 'center', width: '13%' }}>Asana</th>
                <th style={{ padding: '20px 20px', fontSize: '0.92rem', fontWeight: 700, color: '#686e82', textAlign: 'center', width: '14%' }}>Jira</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITOR_COMPARISONS.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f3f8' }}>
                  <td style={{ padding: '18px 24px', fontSize: '0.92rem', fontWeight: 600, color: '#1e1f2b' }}>
                    {row.feature}
                  </td>
                  
                  {/* ClickUp Column */}
                  <td style={{ padding: '18px 24px', textAlign: 'center', backgroundColor: '#f9f8ff' }}>
                    {typeof row.clickup === 'boolean' ? (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#7b68ee',
                        color: '#ffffff'
                      }}>
                        <Check size={16} />
                      </div>
                    ) : (
                      <span style={{ fontWeight: 700, color: '#7b68ee' }}>{row.clickup}</span>
                    )}
                  </td>

                  {/* Monday */}
                  <td style={{ padding: '18px 20px', textAlign: 'center', color: '#6b7280', fontSize: '0.88rem' }}>
                    {typeof row.monday === 'boolean' ? (
                      row.monday ? <Check size={18} color="#00b884" /> : <X size={18} color="#9ca3af" />
                    ) : (
                      <span>{row.monday}</span>
                    )}
                  </td>

                  {/* Asana */}
                  <td style={{ padding: '18px 20px', textAlign: 'center', color: '#6b7280', fontSize: '0.88rem' }}>
                    {typeof row.asana === 'boolean' ? (
                      row.asana ? <Check size={18} color="#00b884" /> : <X size={18} color="#9ca3af" />
                    ) : (
                      <span>{row.asana}</span>
                    )}
                  </td>

                  {/* Jira */}
                  <td style={{ padding: '18px 20px', textAlign: 'center', color: '#6b7280', fontSize: '0.88rem' }}>
                    {typeof row.jira === 'boolean' ? (
                      row.jira ? <Check size={18} color="#00b884" /> : <X size={18} color="#9ca3af" />
                    ) : (
                      <span>{row.jira}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 1-Click Migration Banner */}
        <div style={{
          marginTop: '36px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #eaebf2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <span style={{ fontSize: '0.94rem', color: '#333748', fontWeight: 600 }}>
            Switching from another tool? Use our 1-click automatic importer.
          </span>
          <button 
            onClick={onOpenWaitlist}
            className="btn-ghost"
            style={{ color: '#7b68ee', fontWeight: 700 }}
          >
            <span>See Migration Guides</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
