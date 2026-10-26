import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Layers,
  Terminal,
  Clock,
  Workflow
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SuperAgentsSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const superpowers = [
    {
      id: 'knows',
      title: 'It knows your work before you ask',
      badge: 'Context Graph',
      tagline: 'Deep semantic indexing of every project, pull request, wiki, and discussion.',
      bullets: [
        'Connects GitHub commits, Slack channels, and Google Docs instantly',
        'Answers complex enterprise questions with verifiable citation links',
        'Detects duplicate work and overlapping initiatives across teams'
      ],
      terminalSnippet: `> clickup-brain query "Why was the v4 token release delayed?"
[Brain² Analysis] 
Analyzing 18 Jira issues, 4 Figma branches, and #core-eng discussions...
Result: Delayed 2 days due to iPad Pro responsive breakpoint regression. 
Resolved by Ivan Villa in PR #841.`
    },
    {
      id: 'builds',
      title: 'It builds what used to be impossible',
      badge: 'Autonomous Execution',
      tagline: 'Turn 1-line feature requests into full PRDs, sprint tickets, and test plans.',
      bullets: [
        'Auto-decomposes complex architectures into estimated user stories',
        'Drafts production-ready acceptance criteria and test coverage checklist',
        'Syncs design tokens from Figma directly to development tasks'
      ],
      terminalSnippet: `> clickup-agent generate-prd "Mobile Biometric Auth"
[Super Agent] Generated 6 epics, 18 sprint subtasks, and 4 QA scenarios.
Status: Created in Sprint 24 backlog (CLK-32 to CLK-50).`
    },
    {
      id: 'overview',
      title: 'Executive overview in real-time',
      badge: 'Live Intelligence',
      tagline: 'Instant rollups of org velocity, blocked dependencies, and headcount needs.',
      bullets: [
        'No more manual weekly status slide decks or retrospective reporting',
        'AI synthesized health metrics across engineering, design, and product',
        'Predicts project delivery slippage 2 weeks before it happens'
      ],
      terminalSnippet: `> clickup-brain executive-summary --org "Mobile & Platform"
[Org Health] 94% on track. 
Sprint Velocity: +34% vs Q1 benchmark.
Risk Flag: 2 high-priority dependencies waiting on security review.`
    },
    {
      id: 'continuous',
      title: 'It keeps working when you stop',
      badge: '24/7 Operations',
      tagline: 'Autonomous AI Agents that triage inbound tickets, monitor builds, and update docs.',
      bullets: [
        'Triages customer bug reports and links them to engineering backlogs',
        'Auto-generates clean release notes from git commits upon merging',
        'Sends morning briefing emails with prioritized daily action items'
      ],
      terminalSnippet: `> clickup-agent daemon --status
[Daemon Active] Monitoring 14 GitHub repos and 3 customer feedback boards.
Last Action (12m ago): Triage Agent verified bug #892 and assigned to Alex Rivera.`
    }
  ];

  const current = superpowers[activeTab];

  return (
    <section style={{
      padding: '110px 0',
      backgroundColor: '#fbfbff',
      borderTop: '1px solid #eaebf2',
      borderBottom: '1px solid #eaebf2'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 60px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e7ff',
            padding: '6px 16px',
            borderRadius: '100px',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(123, 104, 238, 0.08)'
          }}>
            <Bot size={16} color="#7b68ee" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#7b68ee' }}>
              CLICKUP SUPER AGENTS
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            color: '#1a1b2d',
            marginBottom: '18px'
          }}>
            A new era of humans, with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Super Agents
            </span>
          </h2>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: '#555b70',
            lineHeight: 1.6
          }}>
            Not just another chatbot sidebar. ClickUp Brain² and Super Agents live directly inside your workflow to take action and deliver finished work.
          </p>
        </div>

        {/* 4 Feature Switcher Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
          marginBottom: '40px'
        }}>
          {superpowers.map((sp, idx) => {
            const isSelected = activeTab === idx;
            return (
              <button
                key={sp.id}
                onClick={() => setActiveTab(idx)}
                style={{
                  padding: '18px 20px',
                  borderRadius: '14px',
                  backgroundColor: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                  border: isSelected ? '2px solid #7b68ee' : '1px solid #e2e8f0',
                  boxShadow: isSelected ? '0 10px 25px rgba(123, 104, 238, 0.12)' : 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: isSelected ? '#7b68ee' : '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '6px'
                }}>
                  {sp.badge}
                </div>
                <div style={{
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  color: isSelected ? '#1a1b2d' : '#475569',
                  lineHeight: 1.3
                }}>
                  {sp.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Super Agent Showcase Stage */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 50px rgba(23, 24, 40, 0.08)',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '40px',
          alignItems: 'center'
        }} className="super-agent-grid">
          <style>{`
            @media (max-width: 900px) {
              .super-agent-grid { grid-template-columns: 1fr !important; padding: 24px !important; }
            }
          `}</style>

          {/* Left: Explanation & Bullets */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(123, 104, 238, 0.1)',
              color: '#7b68ee',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 800,
              marginBottom: '14px'
            }}>
              <Zap size={14} />
              <span>SUPERPOWER #{activeTab + 1}</span>
            </div>

            <h3 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 900,
              color: '#1a1b2d',
              marginBottom: '14px',
              lineHeight: 1.2
            }}>
              {current.title}
            </h3>

            <p style={{ fontSize: '1rem', color: '#555b70', marginBottom: '24px', lineHeight: 1.6 }}>
              {current.tagline}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {current.bullets.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <CheckCircle2 size={13} color="#16a34a" />
                  </div>
                  <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 600 }}>
                    {b}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to={isAuthenticated ? "/workspace" : "/signup"}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.92rem' }}
            >
              <span>{isAuthenticated ? 'Explore Super Agents in App' : 'Get Started with Super Agents'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Interactive Terminal Simulator */}
          <div style={{
            backgroundColor: '#121420',
            borderRadius: '16px',
            border: '1px solid #282c3f',
            overflow: 'hidden',
            boxShadow: '0 15px 35px rgba(0,0,0,0.25)'
          }}>
            {/* Terminal bar */}
            <div style={{
              height: '36px',
              backgroundColor: '#1c1f30',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 14px',
              borderBottom: '1px solid #282c3f'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                clickup-brain-agent-v4
              </span>
              <Terminal size={14} color="#94a3b8" />
            </div>

            {/* Terminal code snippet */}
            <div style={{
              padding: '20px',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: '0.84rem',
              color: '#e2e8f0',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap'
            }}>
              {current.terminalSnippet}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
