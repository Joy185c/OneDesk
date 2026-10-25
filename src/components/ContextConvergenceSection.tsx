import React from 'react';
import { 
  CheckSquare, 
  FileText, 
  Bot, 
  MessageSquare, 
  ArrowRight, 
  Sparkles,
  Layers,
  Zap,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContextConvergenceSection: React.FC = () => {
  return (
    <section style={{
      padding: '100px 0',
      backgroundColor: '#0f111a',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow radial */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse at center, rgba(123, 104, 238, 0.18), transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px' }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#a78bfa',
            backgroundColor: 'rgba(123, 104, 238, 0.15)',
            padding: '6px 14px',
            borderRadius: '100px',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            THE CONVERGENCE REVOLUTION
          </span>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
            marginBottom: '20px',
            color: '#ffffff'
          }}>
            60% of work is lost in context —{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff72e5 0%, #7b68ee 50%, #00c0f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              and AI is lost without it
            </span>
          </h2>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: '#94a3b8',
            lineHeight: 1.6
          }}>
            When your tasks live in Asana, your docs in Notion, your conversations in Slack, and your code in GitHub — AI cannot help you. ClickUp converges everything into one unified brain.
          </p>
        </div>

        {/* The 4 Convergence Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '50px'
        }}>
          {/* 1. Projects */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '30px 24px',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.2s ease, border-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = '#00b884';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 184, 132, 0.15)',
              color: '#00b884',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <CheckSquare size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>Projects</h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Flexible sprint boards, Gantt timelines, and subtasks synchronized with real-time progress.
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.78rem', color: '#00b884', fontWeight: 700 }}>
              Replaces Asana & Jira
            </div>
          </div>

          {/* 2. Docs */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '30px 24px',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.2s ease, border-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = '#00c0f3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 192, 243, 0.15)',
              color: '#00c0f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <FileText size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>Docs</h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Multiplayer wikis, PRDs, and SOPs connected directly to active backlog tasks and deadlines.
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.78rem', color: '#00c0f3', fontWeight: 700 }}>
              Replaces Notion & Confluence
            </div>
          </div>

          {/* 3. Brain² AI */}
          <div style={{
            backgroundColor: 'rgba(123, 104, 238, 0.08)',
            borderRadius: '20px',
            border: '1px solid rgba(123, 104, 238, 0.35)',
            padding: '30px 24px',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(123, 104, 238, 0.25)',
              color: '#a78bfa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Bot size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
              Brain² AI
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              The central nervous system answering questions, creating tickets, and orchestrating work.
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.78rem', color: '#ff72e5', fontWeight: 800 }}>
              Universal Company Context
            </div>
          </div>

          {/* 4. Chat */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '30px 24px',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.2s ease, border-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = '#ff72e5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 114, 229, 0.15)',
              color: '#ff72e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <MessageSquare size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>Chat</h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Context-rich discussions right alongside tasks, eliminating lost threads and duplicate work.
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.78rem', color: '#ff72e5', fontWeight: 700 }}>
              Replaces Slack & Teams
            </div>
          </div>
        </div>

        {/* Central Convergence CTA Banner */}
        <div style={{
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>
              All apps, AI Agents, and humans converge in ClickUp
            </div>
            <div style={{ fontSize: '0.86rem', color: '#94a3b8', marginTop: '2px' }}>
              Experience the 10x speed difference of an all-in-one productivity platform.
            </div>
          </div>

          <Link
            to="/workspace"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem'
            }}
          >
            <span>Test the Convergence Workspace</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};
