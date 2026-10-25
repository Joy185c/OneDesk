import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ListTodo, 
  Kanban, 
  MessageSquare, 
  FileText, 
  Plus, 
  Clock, 
  Flag, 
  Bot,
  Zap,
  Calendar as CalendarIcon,
  LayoutGrid,
  BarChart3,
  Search,
  Play,
  Pause,
  RotateCcw,
  Send,
  User,
  ShieldCheck,
  Check,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  onOpenWaitlist: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export type HeroFeatureTab = 
  | 'overview' 
  | 'agents' 
  | 'projects' 
  | 'brain' 
  | 'time' 
  | 'chat' 
  | 'calendar' 
  | 'docs' 
  | 'whiteboards' 
  | 'sprints' 
  | 'automations' 
  | 'dashboards';

export const Hero: React.FC<HeroProps> = ({ onOpenWaitlist, onOpenAuth }) => {
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState<HeroFeatureTab>('overview');

  // Time Tracker State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1482); // 24m 42s

  // Brain AI Search State
  const [brainQuery, setBrainQuery] = useState('Where is the Q3 sprint retrospective and Figma tokens?');
  const [brainSearching, setBrainSearching] = useState(false);
  const [brainResponse, setBrainResponse] = useState<string | null>(
    'Found 3 connected sources: The Q3 retrospective doc is linked in Sprint 24 backlog, and design tokens were synchronized 2 hours ago by Ivan Villa in #eng-design.'
  );

  // Chat message state
  const [chatMessages, setChatMessages] = useState([
    { id: '1', author: 'Alex Rivera', text: 'Hey team, can we review the mobile token specs before pushing to staging?', time: '10:42 AM' },
    { id: '2', author: 'Ivan Villa', text: 'Yes, just converted the Figma typography layer into Tailwind tokens.', time: '10:44 AM' }
  ]);
  const [newChatText, setNewChatText] = useState('');

  // Agent task state
  const [agents, setAgents] = useState([
    { id: 'a1', name: 'PR Triage Agent', status: 'Running', action: 'Scanning 14 open GitHub pull requests & linking to Jira IDs', progress: 85 },
    { id: 'a2', name: 'Release Notes Agent', status: 'Completed', action: 'Generated ClickUp 4.0 changelog from merged branch commits', progress: 100 },
    { id: 'a3', name: 'Sprint Velocity Agent', status: 'Active', action: 'Recalculating burndown & auto-assigning blocked tickets', progress: 62 }
  ]);

  // Projects task state
  const [tasks, setTasks] = useState([
    { id: 't1', key: 'CLK-10', title: 'Launch Mobile App in Core', status: 'IN PROGRESS', priority: 'Urgent', assignee: 'Alex Rivera', due: 'Today' },
    { id: 't2', key: 'CLK-14', title: 'Figma token synchronization pipeline', status: 'IN PROGRESS', priority: 'High', assignee: 'Ivan Villa', due: 'May 18' },
    { id: 't3', key: 'CLK-08', title: 'Executive dashboard velocity metrics', status: 'TODO', priority: 'Normal', assignee: 'Sarah Chen', due: 'May 24' },
    { id: 't4', key: 'CLK-04', title: 'ClickUp AI document summary & action item extraction', status: 'COMPLETE', priority: 'High', assignee: 'Brendan Wolfe', due: 'Completed' }
  ]);

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onOpenAuth('signup');
  };

  const handleBrainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brainQuery.trim()) return;
    setBrainSearching(true);
    setBrainResponse(null);
    setTimeout(() => {
      setBrainSearching(false);
      setBrainResponse(`Synthesized across 47 tasks & docs: "${brainQuery}" relates to the Mobile Roadmap v4. Assigned to Alex Rivera with status IN PROGRESS.`);
    }, 800);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    setChatMessages([...chatMessages, {
      id: String(Date.now()),
      author: 'You',
      text: newChatText.trim(),
      time: 'Just now'
    }]);
    setNewChatText('');
  };

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section style={{
      position: 'relative',
      paddingTop: '48px',
      paddingBottom: '90px',
      background: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(123, 104, 238, 0.22), transparent 75%), linear-gradient(180deg, #fbfaff 0%, #ffffff 100%)',
      overflow: 'hidden'
    }}>
      {/* Background ambient decorative glow */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '950px',
        height: '420px',
        background: 'linear-gradient(135deg, rgba(123, 104, 238, 0.16), rgba(255, 114, 229, 0.16))',
        filter: 'blur(120px)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Animated Pill Announcement */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button 
            onClick={() => setActiveTab('brain')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 20px',
              borderRadius: '100px',
              background: '#ffffff',
              border: '1.5px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #7b68ee, #ff72e5, #00c0f3)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 6px 20px rgba(123, 104, 238, 0.15)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#1a1b2d',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(123, 104, 238, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(123, 104, 238, 0.15)';
            }}
          >
            <span style={{
              background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 100%)',
              color: '#ffffff',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '100px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Sparkles size={11} />
              Brain²
            </span>
            <span style={{ color: '#475569', fontWeight: 600 }}>The Best AI is</span>
            <span style={{
              background: 'linear-gradient(90deg, #7b68ee, #ff72e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800
            }}>
              ClickUp Brain²
            </span>
            <ArrowRight size={14} color="#7b68ee" />
          </button>
        </div>

        {/* Hero Title & Subtitle */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 36px' }}>
          <h1 style={{
            fontSize: 'clamp(2.6rem, 5.8vw, 4.6rem)',
            fontWeight: 900,
            lineHeight: 1.08,
            color: '#161824',
            marginBottom: '20px',
            letterSpacing: '-0.04em'
          }}>
            One Workspace built to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 70%, #00c0f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              think and work
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
            color: '#475569',
            lineHeight: 1.5,
            maxWidth: '720px',
            margin: '0 auto',
            fontWeight: 500
          }}>
            ClickUp connects your work, knowledge, and conversations to AI that can find answers, take action, and build alongside you.
          </p>
        </div>

        {/* Hero Email Input CTA Form */}
        <div style={{ maxWidth: '540px', margin: '0 auto 20px' }}>
          <form 
            onSubmit={handleStartSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '6px 6px 6px 18px',
              boxShadow: '0 12px 36px rgba(23, 24, 40, 0.12), 0 0 0 1px rgba(123, 104, 238, 0.2)',
              gap: '8px'
            }}
          >
            <input 
              type="email" 
              placeholder="Enter your work email..." 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                color: '#1a1b2d',
                fontFamily: 'inherit',
                backgroundColor: 'transparent'
              }}
            />
            <button 
              type="submit" 
              style={{
                padding: '12px 26px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.98rem',
                boxShadow: '0 4px 14px rgba(123, 104, 238, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>Get started. It's FREE</span>
              <ArrowRight size={16} />
            </button>
          </form>
          <div style={{
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#64748b',
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <span>✨ Free forever</span>
            <span>•</span>
            <span>No credit card required</span>
            <span>•</span>
            <Link to="/workspace" style={{ color: '#7b68ee', fontWeight: 700, textDecoration: 'underline' }}>
              Instant Demo Mode
            </Link>
          </div>
        </div>

        {/* ======================================================== */}
        {/* THE 12 FEATURE PILLS (MATCHING OFFICIAL CLICKUP.COM)     */}
        {/* ======================================================== */}
        <div style={{
          marginTop: '42px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {[
              { id: 'overview', label: 'ClickUp 4.0', badge: 'New', color: '#7b68ee' },
              { id: 'agents', label: 'AI Agents', badge: 'New', color: '#ff72e5' },
              { id: 'projects', label: 'Projects', color: '#00b884' },
              { id: 'brain', label: 'Brain MAX (AI)', color: '#7b68ee' },
              { id: 'time', label: 'Time Tracking', color: '#f89d13' },
              { id: 'chat', label: 'Chat', color: '#00c0f3' },
              { id: 'calendar', label: 'Calendar', color: '#e11d48' },
              { id: 'docs', label: 'Docs', color: '#00b884' },
              { id: 'whiteboards', label: 'Whiteboards', color: '#ff72e5' },
              { id: 'sprints', label: 'Sprints', color: '#8b5cf6' },
              { id: 'automations', label: 'Automations', color: '#f97316' },
              { id: 'dashboards', label: 'Dashboards', color: '#0ea5e9' }
            ].map(pill => {
              const isSelected = activeTab === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setActiveTab(pill.id as HeroFeatureTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '100px',
                    fontSize: '0.86rem',
                    fontWeight: isSelected ? 800 : 600,
                    backgroundColor: isSelected ? '#161824' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    border: isSelected ? '1px solid #161824' : '1px solid #e2e8f0',
                    boxShadow: isSelected ? '0 8px 20px rgba(22, 24, 36, 0.2)' : '0 2px 6px rgba(0,0,0,0.03)',
                    transition: 'all 0.16s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: pill.color
                  }} />
                  <span>{pill.label}</span>
                  {pill.badge && (
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? '#7b68ee' : '#fee2e2',
                      color: isSelected ? '#ffffff' : '#dc2626'
                    }}>
                      {pill.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE HERO APPLICATION PREVIEW CONTAINER           */}
        {/* ======================================================== */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px -15px rgba(23, 24, 40, 0.15)',
          overflow: 'hidden',
          maxWidth: '1160px',
          margin: '0 auto'
        }}>
          {/* Mock Browser Header Bar */}
          <div style={{
            height: '48px',
            backgroundColor: '#161824',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            borderBottom: '1px solid #282c3f'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <div style={{ height: '14px', width: '1px', backgroundColor: '#33384e', margin: '0 6px' }} />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                ClickUp 4.0 Core Workspace • <span style={{ color: '#ffffff' }}>Active: {activeTab.toUpperCase()}</span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link 
                to="/workspace"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#7b68ee',
                  backgroundColor: 'rgba(123, 104, 238, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}
              >
                <span>Launch Full App</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* DYNAMIC SCREEN CONTENT BASED ON SELECTED HERO TAB */}
          <div style={{ minHeight: '440px', backgroundColor: '#f8fafc', padding: '24px' }}>
            
            {/* 1. OVERVIEW: CLICKUP 4.0 */}
            {activeTab === 'overview' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      ClickUp 4.0: Software, AI, and humans converge
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                      Single cockpit synchronizing 42 active engineering issues, 14 docs, and autonomous agents.
                    </p>
                  </div>
                  <span className="badge-pill badge-purple">Multiplayer Sync: Live</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7b68ee', fontWeight: 700, fontSize: '0.85rem' }}>
                      <Bot size={18} />
                      <span>AUTONOMOUS AGENTS</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '8px 0' }}>3 Running</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Triage agent closed 6 PR issues in last 30m</div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00b884', fontWeight: 700, fontSize: '0.85rem' }}>
                      <TrendingUp size={18} />
                      <span>SPRINT VELOCITY</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a', margin: '8px 0' }}>+34% Speed</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Cycle time reduced from 3.2d to 1.8 days</div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff72e5', fontWeight: 700, fontSize: '0.85rem' }}>
                      <Sparkles size={18} />
                      <span>BRAIN² SYNTHESIS</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '8px 0' }}>100% Context</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Connected to Figma, GitHub, Jira & Google Drive</div>
                  </div>
                </div>

                {/* Quick Task list preview */}
                <div style={{ marginTop: '20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b', marginBottom: '10px' }}>Active Sprint Tasks</div>
                  {tasks.slice(0, 3).map(t => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7b68ee' }}>{t.key}</span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>{t.title}</span>
                      </div>
                      <span className="status-badge" style={{ fontSize: '0.72rem' }}>{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. AGENTS: AI AGENTS */}
            {activeTab === 'agents' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      Super AI Agents: Working alongside your team
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                      Autonomous bots that resolve tickets, write release notes, and monitor regressions 24/7.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setAgents([...agents, {
                        id: 'a_' + Date.now(),
                        name: 'Security Audit Agent',
                        status: 'Running',
                        action: 'Checking SOC2 compliance dependencies in package.json',
                        progress: 40
                      }]);
                    }}
                    className="btn-primary" 
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  >
                    <Plus size={14} /> Deploy New Agent
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {agents.map(ag => (
                    <div key={ag.id} style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(123, 104, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={18} color="#7b68ee" />
                          </div>
                          <div>
                            <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.94rem' }}>{ag.name}</span>
                            <span style={{ marginLeft: '10px', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: ag.status === 'Completed' ? '#dcfce7' : '#e0e7ff', color: ag.status === 'Completed' ? '#166534' : '#4338ca' }}>
                              {ag.status}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>{ag.progress}%</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#475569' }}>{ag.action}</div>
                      {/* Progress bar */}
                      <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ width: `${ag.progress}%`, height: '100%', backgroundColor: ag.status === 'Completed' ? '#16a34a' : '#7b68ee', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. PROJECTS: KANBAN & LIST */}
            {activeTab === 'projects' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      Interactive Projects & Agile Boards
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                      Drag, modify, and manage tasks across workflows.
                    </p>
                  </div>
                  <Link to="/workspace" className="btn-primary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                    <Plus size={14} /> Add Task
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {['TODO', 'IN PROGRESS', 'COMPLETE'].map(col => (
                    <div key={col} style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{col}</span>
                        <span>{tasks.filter(t => t.status === col).length}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {tasks.filter(t => t.status === col).map(task => (
                          <div key={task.id} style={{
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            padding: '12px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7b68ee' }}>{task.key}</div>
                            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b', margin: '4px 0' }}>{task.title}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.74rem', color: '#64748b' }}>
                              <span>👤 {task.assignee}</span>
                              <span style={{ fontWeight: 700, color: task.priority === 'Urgent' ? '#dc2626' : '#f59e0b' }}>{task.priority}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. BRAIN: UNIVERSAL AI CONTEXT */}
            {activeTab === 'brain' && (
              <div>
                <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 20px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7b68ee', fontWeight: 800, fontSize: '0.84rem', marginBottom: '6px' }}>
                    <Sparkles size={16} /> ClickUp Brain MAX
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                    The only AI that actually knows all your company's work
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    Ask anything across your entire workspace, connected docs, tasks, and integrations.
                  </p>
                </div>

                <form onSubmit={handleBrainSearch} style={{ maxWidth: '680px', margin: '0 auto 16px', display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <input 
                      type="text" 
                      value={brainQuery}
                      onChange={(e) => setBrainQuery(e.target.value)}
                      placeholder="Ask ClickUp Brain anything about your project..."
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '10px',
                        border: '1.5px solid #7b68ee',
                        outline: 'none',
                        fontSize: '0.9rem',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ padding: '0 20px' }}>
                    <span>{brainSearching ? 'Thinking...' : 'Synthesize'}</span>
                  </button>
                </form>

                {brainResponse && (
                  <div style={{
                    maxWidth: '680px',
                    margin: '0 auto',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e0e7ff',
                    padding: '18px 22px',
                    boxShadow: '0 8px 20px rgba(123, 104, 238, 0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7b68ee', fontWeight: 800, fontSize: '0.82rem', marginBottom: '8px' }}>
                      <Sparkles size={14} /> Brain² AI Synthesis Response:
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                      {brainResponse}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 5. TIME TRACKING */}
            {activeTab === 'time' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      Native Time Tracking & Billable Timesheets
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                      Track time spent on tasks, manage billable rates, and view employee capacity.
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>ACTIVE TIME TRACKER</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>
                      #CLK-10 • Launch Mobile App in Core
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '2.2rem', fontWeight: 900, color: timerRunning ? '#16a34a' : '#1e293b' }}>
                      {formatTime(timerSeconds)}
                    </div>

                    <button 
                      onClick={() => setTimerRunning(!timerRunning)}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: timerRunning ? '#fee2e2' : '#dcfce7',
                        color: timerRunning ? '#dc2626' : '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      {timerRunning ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <button 
                      onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}
                      style={{ color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>LOGGED THIS WEEK</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>36h 15m</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>BILLABLE RATIO</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>92.4%</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>TIME ESTIMATE REMAINING</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7b68ee', marginTop: '4px' }}>4h 30m</div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. CHAT: REAL-TIME THREADS */}
            {activeTab === 'chat' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      Contextual Chat: Conversations right where work happens
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                      Eliminate tool switching between Slack and task management.
                    </p>
                  </div>
                  <span className="badge-pill badge-purple">#core-design-sprint</span>
                </div>

                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  height: '240px',
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  {chatMessages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem', color: '#4338ca' }}>
                        {msg.author[0]}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#1e293b' }}>{msg.author}</span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{msg.time}</span>
                        </div>
                        <div style={{ fontSize: '0.86rem', color: '#475569', marginTop: '2px' }}>{msg.text}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={newChatText}
                    onChange={(e) => setNewChatText(e.target.value)}
                    placeholder="Type a message or use @ to mention teammates..."
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      fontSize: '0.88rem'
                    }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0 18px' }}>
                    <Send size={15} />
                  </button>
                </form>
              </div>
            )}

            {/* 7. CALENDAR: SCHEDULING */}
            {activeTab === 'calendar' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      Visual Calendar & Timeline Scheduling
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                      Sync milestones, meetings, and sprint deliverables in one calendar.
                    </p>
                  </div>
                  <span className="badge-pill badge-green">May 2026</span>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
                    <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', minHeight: '180px' }}>
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} style={{ border: '1px solid #f1f5f9', borderRadius: '8px', padding: '6px', fontSize: '0.75rem', backgroundColor: i === 4 ? '#e0e7ff' : '#f8fafc' }}>
                        <span style={{ fontWeight: 700, color: '#64748b' }}>{i + 15}</span>
                        {i === 1 && (
                          <div style={{ backgroundColor: '#ff72e5', color: '#fff', padding: '2px 4px', borderRadius: '4px', fontSize: '0.65rem', marginTop: '4px', fontWeight: 700 }}>
                            Figma Sync
                          </div>
                        )}
                        {i === 4 && (
                          <div style={{ backgroundColor: '#7b68ee', color: '#fff', padding: '2px 4px', borderRadius: '4px', fontSize: '0.65rem', marginTop: '4px', fontWeight: 700 }}>
                            Sprint 24 Deploy
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 8. DOCS: CONNECTED DOCS */}
            {activeTab === 'docs' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      Connected Docs & Wikis
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                      Collaborate in real-time and convert any bullet point directly into a tracked task.
                    </p>
                  </div>
                  <Link to="/workspace" className="btn-primary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                    Open Docs Editor
                  </Link>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>
                    📄 ClickUp 4.0 Architecture & Super Agents SOP
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.7 }}>
                    <p><strong>1. Universal Context Convergence:</strong> Every doc connects bi-directionally to task backlogs, conversation threads, and AI models.</p>
                    <p style={{ marginTop: '8px' }}><strong>2. 1-Click Task Creation:</strong> Highlight any text to generate a subtask or assign a teammate instantly.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 9. WHITEBOARDS */}
            {activeTab === 'whiteboards' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      Whiteboards & Canvas: Ideate to Execution
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                      Draw flowcharts, brainstorm with sticky notes, and convert shapes into backlog items.
                    </p>
                  </div>
                  <span className="badge-pill badge-pink">Infinite Canvas</span>
                </div>

                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1',
                  height: '240px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '24px'
                }}>
                  <div style={{ width: '130px', height: '110px', backgroundColor: '#fef08a', padding: '12px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', transform: 'rotate(-2deg)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#854d0e' }}>Brainstorming</div>
                    <div style={{ fontSize: '0.74rem', color: '#713f12', marginTop: '4px' }}>AI-driven task decomposition</div>
                  </div>

                  <ArrowRight size={24} color="#94a3b8" />

                  <div style={{ width: '130px', height: '110px', backgroundColor: '#bae6fd', padding: '12px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', transform: 'rotate(2deg)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#075985' }}>Figma Wireframe</div>
                    <div style={{ fontSize: '0.74rem', color: '#0369a1', marginTop: '4px' }}>Component auto-token generator</div>
                  </div>

                  <ArrowRight size={24} color="#94a3b8" />

                  <div style={{ width: '130px', height: '110px', backgroundColor: '#bbf7d0', padding: '12px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#166534' }}>Shipped Task</div>
                    <div style={{ fontSize: '0.74rem', color: '#14532d', marginTop: '4px' }}>CLK-10 Launched in Core</div>
                  </div>
                </div>
              </div>
            )}

            {/* 10. SPRINTS */}
            {activeTab === 'sprints' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      Sprint Points & Agile Management
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                      Burndown reports, sprint estimations, and automated rollups.
                    </p>
                  </div>
                  <span className="badge-pill badge-purple">Sprint 24: Active</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>COMPLETED POINTS</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16a34a', marginTop: '4px' }}>88 pts</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>of 96 planned points</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>SPRINT PROGRESS</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#7b68ee', marginTop: '4px' }}>91.6%</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>3 days remaining</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>SCOPE CREEP</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0ea5e9', marginTop: '4px' }}>0.0%</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Locked scope preserved</div>
                  </div>
                </div>
              </div>
            )}

            {/* 11. AUTOMATIONS */}
            {activeTab === 'automations' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      No-Code Automations Engine
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                      Over 100+ automated recipes to put your busywork on autopilot.
                    </p>
                  </div>
                  <span className="badge-pill badge-pink">10,000 runs/mo</span>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.92rem', color: '#1e293b' }}>
                    <span style={{ fontWeight: 800, color: '#7b68ee' }}>WHEN:</span>
                    <span style={{ padding: '4px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontWeight: 600 }}>Status changes to COMPLETE</span>
                    <ArrowRight size={18} color="#94a3b8" />
                    <span style={{ fontWeight: 800, color: '#00b884' }}>THEN:</span>
                    <span style={{ padding: '4px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontWeight: 600 }}>Assign QA Lead & Post update to Slack #releases</span>
                  </div>
                </div>
              </div>
            )}

            {/* 12. DASHBOARDS */}
            {activeTab === 'dashboards' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      Executive Cockpit & Mission Control
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                      Live graphs, burnup velocity, and cross-team capacity rollups.
                    </p>
                  </div>
                  <span className="badge-pill badge-green">Realtime Metrics</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>ON-TIME DELIVERY</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16a34a', marginTop: '4px' }}>98.4%</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>RESOURCE CAPACITY</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#7b68ee', marginTop: '4px' }}>82%</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>BLOCKED TASKS</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0ea5e9', marginTop: '4px' }}>0 Tasks</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};
