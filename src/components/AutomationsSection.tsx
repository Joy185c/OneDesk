import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Check, 
  Settings2, 
  Users, 
  Tag, 
  Bell, 
  Play, 
  Sparkles,
  Layers
} from 'lucide-react';

export const AutomationsSection: React.FC = () => {
  const [trigger, setTrigger] = useState('Status changes to COMPLETE');
  const [action, setAction] = useState('Assign to QA Lead & post to Slack');
  const [isRunning, setIsRunning] = useState(false);
  const [runLog, setRunLog] = useState<string | null>(null);

  const handleTestRun = () => {
    setIsRunning(true);
    setRunLog('⚡ Trigger detected: Task #CLK-10 status changed to COMPLETE');
    setTimeout(() => {
      setRunLog('✅ Action executed: Assigned to Alex Rivera & Slack notification sent in 0.08s');
      setIsRunning(false);
    }, 900);
  };

  return (
    <section id="automations" style={{
      padding: '100px 0',
      backgroundColor: '#ffffff'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.25fr',
          gap: '60px',
          alignItems: 'center'
        }} className="automations-grid">
          <style>{`
            @media (max-width: 960px) {
              .automations-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
            }
          `}</style>

          {/* LEFT: Typography from Figma artboard */}
          <div>
            <div style={{ marginBottom: '14px' }}>
              <span className="badge-pill badge-purple" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                FEATURES
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: '#1a1b2d',
              lineHeight: 1.12,
              marginBottom: '20px',
              letterSpacing: '-0.03em'
            }}>
              Less busywork.<br />
              Happier teams.
            </h2>

            <p style={{
              fontSize: '1.12rem',
              color: '#555b70',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}>
              Keep work moving by automatically changing assignees and priorities or applying tags and templates to status changes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { title: '100+ Pre-built Automation Templates', desc: 'Auto-assign tasks, synchronize sprint dates, and trigger handoffs.' },
                { title: 'External App Webhooks & Integrations', desc: 'Trigger Slack notifications, GitHub pull requests, and Zendesk tickets.' },
                { title: 'ClickUp AI Workflow Generation', desc: 'Describe your routine in plain English and ClickUp AI constructs the logic.' }
              ].map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(123, 104, 238, 0.12)',
                    color: '#7b68ee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Check size={14} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#1e1f2b' }}>{feat.title}</h4>
                    <p style={{ fontSize: '0.86rem', color: '#6b7280', marginTop: '2px' }}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Interactive Automation Builder Playground */}
          <div style={{
            backgroundColor: '#161824',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 30px 70px -15px rgba(18, 20, 36, 0.35)',
            border: '1px solid #2a2e42',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #262a3d', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(123, 104, 238, 0.25)',
                  color: '#ff72e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Zap size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>Automation Recipe Builder</h4>
                  <p style={{ fontSize: '0.78rem', color: '#8891aa' }}>Active in #engineering-core space</p>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#00b88426', color: '#00b884', padding: '3px 8px', borderRadius: '100px', fontWeight: 700 }}>
                ACTIVE (ON)
              </span>
            </div>

            {/* IF TRIGGER BLOCK */}
            <div style={{
              backgroundColor: '#1f2233',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '16px',
              border: '1px solid #2e344e'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ff72e5', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                WHEN (TRIGGER)
              </div>
              <select 
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#292d42',
                  color: '#ffffff',
                  border: '1px solid #3c4363',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Status changes to COMPLETE">Status changes to COMPLETE</option>
                <option value="Task Priority set to Urgent">Task Priority set to Urgent 🚩</option>
                <option value="Due Date is approaching (24 hrs)">Due Date is approaching (24 hrs)</option>
                <option value="New GitHub PR merged">New GitHub PR merged</option>
              </select>
            </div>

            {/* CONNECTOR ARROW */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#292e44',
                color: '#7b68ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowRight size={16} style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>

            {/* THEN ACTION BLOCK */}
            <div style={{
              backgroundColor: '#1f2233',
              borderRadius: '14px',
              padding: '16px 20px',
              marginTop: '4px',
              marginBottom: '24px',
              border: '1px solid #2e344e'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00c0f3', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                THEN (ACTION)
              </div>
              <select 
                value={action}
                onChange={(e) => setAction(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#292d42',
                  color: '#ffffff',
                  border: '1px solid #3c4363',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Assign to QA Lead & post to Slack">Assign to QA Lead & post alert to #releases</option>
                <option value="Add tag 'Regression-Tested' & notify manager">Add tag 'Regression-Tested' & notify manager</option>
                <option value="Archive task & export timesheet">Archive task & export timesheet</option>
                <option value="Post AI summary to executive report">Post AI summary to executive report</option>
              </select>
            </div>

            {/* Interactive Test Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <button 
                onClick={handleTestRun}
                disabled={isRunning}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: isRunning ? '#3c4363' : '#7b68ee',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(123, 104, 238, 0.4)'
                }}
              >
                <Play size={14} />
                <span>{isRunning ? 'Executing Recipe...' : 'Test Run Recipe'}</span>
              </button>

              <span style={{ fontSize: '0.75rem', color: '#8891aa' }}>
                Saves ~4.2 hours/user/week
              </span>
            </div>

            {/* Run Log Output */}
            {runLog && (
              <div style={{
                marginTop: '16px',
                padding: '10px 14px',
                backgroundColor: '#11131c',
                borderRadius: '8px',
                border: '1px solid #24293d',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                color: '#a1e9a5',
                animation: 'fadeIn 0.2s ease'
              }}>
                {runLog}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
