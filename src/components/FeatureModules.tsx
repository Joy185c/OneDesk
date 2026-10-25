import React, { useState } from 'react';
import { 
  CheckSquare, 
  FileText, 
  LayoutGrid, 
  LayoutDashboard, 
  Bot, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

export const FeatureModules: React.FC = () => {
  const [activeModule, setActiveModule] = useState(0);

  const modules = [
    {
      id: 'tasks',
      icon: CheckSquare,
      title: 'Tasks & Sprints',
      color: '#7b68ee',
      tagline: 'Plan, track, and manage any project with tailored views.',
      description: 'Organize anything with customizable subtasks, checklists, recurring reminders, dependencies, and agile sprint points.',
      bullets: [
        '35+ customizable views: List, Board, Gantt, Calendar, Workload',
        'Multi-assignee tasks & sprint points tracking',
        'Custom status workflows for any methodology'
      ],
      previewContent: {
        badge: 'Sprint 24 • Engineering & Design',
        metrics: [
          { label: 'Completed', value: '42 tasks' },
          { label: 'Velocity', value: '88 pts' },
          { label: 'On Track', value: '96%' }
        ]
      }
    },
    {
      id: 'docs',
      icon: FileText,
      title: 'Connected Docs',
      color: '#00b884',
      tagline: 'Create beautiful docs and wikis connected directly to workflows.',
      description: 'Collaborate live with your team using real-time co-authoring, embedded widgets, nested pages, and 1-click task conversion.',
      bullets: [
        'Real-time multi-cursor collaboration & comments',
        'Turn any sentence into a tracked task with one click',
        'Custom doc templates for PRDs, SOPs, and meeting notes'
      ],
      previewContent: {
        badge: 'PRD: ClickUp 3.0 Mobile Overhaul',
        metrics: [
          { label: 'Contributors', value: '14 active' },
          { label: 'Linked Tasks', value: '28 issues' },
          { label: 'Version', value: 'v3.2 Final' }
        ]
      }
    },
    {
      id: 'whiteboards',
      icon: LayoutGrid,
      title: 'Whiteboards & Canvas',
      color: '#ff72e5',
      tagline: 'Bring ideas to life and turn sketches into actionable tasks.',
      description: 'The only whiteboard that bridges the gap between ideation and execution. Draw flowcharts, wireframes, and link shapes directly to backlog items.',
      bullets: [
        'Infinite canvas with freehand pen, sticky notes, & mind maps',
        'Convert any brainstorm element directly into a ClickUp task',
        'Embed live Figma files, GitHub issues, and Google Sheets'
      ],
      previewContent: {
        badge: 'Quarterly Architecture Whiteboard',
        metrics: [
          { label: 'Sticky Notes', value: '64 ideas' },
          { label: 'Action Items', value: '18 created' },
          { label: 'Live Users', value: '6 sketching' }
        ]
      }
    },
    {
      id: 'dashboards',
      icon: LayoutDashboard,
      title: 'Executive Dashboards',
      color: '#00c0f3',
      tagline: 'High-level insights into team velocity, capacity, and budgets.',
      description: 'Build mission-control centers with customizable charts, burndown trackers, time-tracking widgets, and portfolio rollups.',
      bullets: [
        '50+ customizable widgets: Bar, Line, Pie, Calculation cards',
        'Sprint burnup/burndown & cumulative flow diagrams',
        'Timesheets, billable rates, and client invoices'
      ],
      previewContent: {
        badge: 'Q2 All-Hands Operations Cockpit',
        metrics: [
          { label: 'Org Velocity', value: '+34%' },
          { label: 'Time Saved', value: '1,240 hrs' },
          { label: 'Budgets', value: 'Within 2%' }
        ]
      }
    },
    {
      id: 'ai',
      icon: Bot,
      title: 'ClickUp AI Copilot',
      color: '#f89d13',
      tagline: 'The only AI assistant tailored to your specific role and workspace.',
      description: 'Harness role-specific AI prompts to draft project briefs, summarize 50-comment threads, create subtasks automatically, and translate docs instantly.',
      bullets: [
        'Summarize comment threads and task histories in seconds',
        'Automatically generate subtasks from complex project descriptions',
        'Role-tailored prompts for Product Managers, Marketers, & Engineers'
      ],
      previewContent: {
        badge: 'ClickUp AI • Thread Summarizer',
        metrics: [
          { label: 'Summary Time', value: '1.2s' },
          { label: 'Action Items', value: '5 detected' },
          { label: 'Accuracy', value: '99.4%' }
        ]
      }
    }
  ];

  const current = modules[activeModule];

  return (
    <section id="features" style={{
      padding: '100px 0',
      backgroundColor: '#fbfbfd',
      borderBottom: '1px solid #eaebf2'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span className="badge-pill badge-purple" style={{ marginBottom: '14px' }}>
            ALL-IN-ONE PRODUCTIVITY
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontWeight: 800,
            color: '#1a1b2d',
            marginBottom: '16px',
            letterSpacing: '-0.03em'
          }}>
            Every tool you need. Perfectly connected.
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#5f6377' }}>
            No more jumping between 5 different browser tabs. ClickUp consolidates your entire team's stack into one unified workspace.
          </p>
        </div>

        {/* Module Switcher Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '40px'
        }}>
          {modules.map((m, idx) => {
            const Icon = m.icon;
            const isActive = activeModule === idx;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#1e1f2b' : '#61677d',
                  border: isActive ? `2px solid ${m.color}` : '2px solid transparent',
                  boxShadow: isActive ? '0 6px 18px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.18s'
                }}
              >
                <Icon size={18} color={isActive ? m.color : '#8a8fa3'} />
                <span>{m.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Module Showcase Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '44px',
          border: '1px solid #e5e8f2',
          boxShadow: '0 20px 50px -10px rgba(22, 24, 45, 0.08)',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '50px',
          alignItems: 'center'
        }} className="module-card">
          <style>{`
            @media (max-width: 900px) {
              .module-card { grid-template-columns: 1fr !important; padding: 28px !important; gap: 30px !important; }
            }
          `}</style>

          {/* Details */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: `${current.color}15`,
              color: current.color,
              fontWeight: 700,
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              <current.icon size={16} />
              <span>{current.title}</span>
            </div>

            <h3 style={{ fontSize: '1.8rem', color: '#1a1b2d', marginBottom: '14px', lineHeight: 1.2 }}>
              {current.tagline}
            </h3>

            <p style={{ fontSize: '1.02rem', color: '#555b70', lineHeight: 1.6, marginBottom: '24px' }}>
              {current.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {current.bullets.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: `${current.color}20`,
                    color: current.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Sparkles size={12} />
                  </div>
                  <span style={{ fontSize: '0.92rem', color: '#333748', fontWeight: 500 }}>{b}</span>
                </div>
              ))}
            </div>

            <a href="#pricing" className="btn-primary" style={{ padding: '12px 24px' }}>
              <span>Explore {current.title}</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Visual Showcase Box */}
          <div style={{
            backgroundColor: '#1b1d29',
            borderRadius: '18px',
            padding: '28px',
            color: '#ffffff',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
            border: '1px solid #2e3347'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              borderBottom: '1px solid #292d3f',
              paddingBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: current.color }} />
                <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>{current.previewContent.badge}</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#8891aa' }}>ClickUp 3.0 Live Engine</span>
            </div>

            {/* Interactive Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '24px'
            }}>
              {current.previewContent.metrics.map((m, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#24283b',
                  borderRadius: '10px',
                  padding: '14px 12px',
                  textAlign: 'center',
                  border: '1px solid #323852'
                }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: current.color }}>{m.value}</div>
                  <div style={{ fontSize: '0.74rem', color: '#9da4bc', marginTop: '4px' }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Simulated Live Action Feed */}
            <div style={{
              backgroundColor: '#161824',
              borderRadius: '10px',
              padding: '14px',
              fontSize: '0.8rem',
              color: '#d1d5db',
              lineHeight: 1.5,
              border: '1px solid #24293d'
            }}>
              <div style={{ color: '#8b92a9', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '4px' }}>Live Activity</div>
              ⚡ Synced real-time changes across 8 active devices in 12ms. All team permissions and encryption verified.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
