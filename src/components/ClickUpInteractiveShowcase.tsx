import React, { useState } from 'react';
import { 
  Check, 
  Plus, 
  ArrowRight, 
  Search, 
  Star, 
  Flag, 
  Folder, 
  ChevronDown, 
  MoreHorizontal,
  Bot,
  Sparkles,
  MessageSquare,
  FileText,
  Clock,
  Calendar,
  Layers,
  PhoneCall,
  Video,
  Send,
  AtSign,
  Smile,
  Mic,
  SlidersHorizontal,
  Play,
  RotateCcw,
  CheckCircle2,
  Zap,
  Share2,
  BarChart2,
  Home,
  Settings,
  Grid,
  Maximize2,
  X,
  Loader2,
  MousePointer,
  Hand,
  Pen,
  Type,
  Image,
  GitFork,
  ChevronRight,
  Link2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export type ShowcaseFeature = 
  | 'projects' 
  | 'chat' 
  | 'brain' 
  | 'agents' 
  | 'sprints' 
  | 'time' 
  | 'calendar' 
  | 'docs' 
  | 'whiteboards' 
  | 'automations' 
  | 'dashboards' 
  | 'scheduling';

// ClickUp AI Petal Logo
const BrainPetalLogo: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4.2" fill="#ff72e5" />
    <circle cx="17" cy="12" r="4.2" fill="#00c0f3" />
    <circle cx="12" cy="17" r="4.2" fill="#7b68ee" />
    <circle cx="7" cy="12" r="4.2" fill="#f89d13" />
    <circle cx="12" cy="12" r="3.2" fill="#ffffff" />
  </svg>
);

export const ClickUpInteractiveShowcase: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<ShowcaseFeature>('time');
  const [activatedFeatures, setActivatedFeatures] = useState<Record<string, boolean>>({
    projects: true,
    chat: true,
    brain: true,
    agents: true,
    sprints: true,
    time: true
  });

  const featureList: Array<{ id: ShowcaseFeature; label: string }> = [
    { id: 'projects', label: 'Projects' },
    { id: 'chat', label: 'Chat' },
    { id: 'brain', label: 'Brain MAX' },
    { id: 'agents', label: 'AI Agents' },
    { id: 'sprints', label: 'Sprints' },
    { id: 'time', label: 'Time Tracking' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'docs', label: 'Docs' },
    { id: 'whiteboards', label: 'Whiteboards' },
    { id: 'automations', label: 'Automations' },
    { id: 'dashboards', label: 'Dashboards' },
    { id: 'scheduling', label: 'Scheduling' }
  ];

  const handleSelect = (id: ShowcaseFeature) => {
    setSelectedFeature(id);
    setActivatedFeatures(prev => ({ ...prev, [id]: true }));
  };

  const handleActivateNext = () => {
    const currentIndex = featureList.findIndex(f => f.id === selectedFeature);
    const nextIndex = (currentIndex + 1) % featureList.length;
    handleSelect(featureList[nextIndex].id);
  };

  return (
    <section style={{
      padding: '80px 0 60px',
      backgroundColor: '#fbfbfd',
      borderBottom: '1px solid #eaebf2'
    }}>
      <div className="container" style={{ maxWidth: '1280px' }}>
        
        {/* MAIN SPLIT STAGE: Left Navigation List & Right App Mockup */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '40px',
          alignItems: 'start'
        }} className="showcase-split">
          <style>{`
            @media (max-width: 1024px) {
              .showcase-split { grid-template-columns: 1fr !important; gap: 24px !important; }
            }
          `}</style>

          {/* ======================================================== */}
          {/* LEFT COLUMN: THE 12 FEATURE TOGGLE LIST                  */}
          {/* ======================================================== */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            paddingTop: '20px'
          }}>
            {featureList.map(item => {
              const isSelected = selectedFeature === item.id;
              const isActivated = activatedFeatures[item.id] || isSelected;

              return (
                <div
                  key={item.id}
                  id={`showcase-feature-${item.id}`}
                  data-testid={`showcase-feature-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'transform 0.12s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  {isActivated ? (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#0084ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={12} color="#ffffff" strokeWidth={3} />
                    </div>
                  ) : (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '1.5px solid #94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Plus size={12} color="#94a3b8" strokeWidth={2.5} />
                    </div>
                  )}

                  <span style={{
                    fontSize: '1rem',
                    fontWeight: isActivated ? 800 : 600,
                    color: isActivated ? '#0084ff' : '#475569',
                    letterSpacing: '-0.01em'
                  }}>
                    {item.label}
                  </span>
                </div>
              );
            })}

            {/* ACTIVATE PILL BUTTON */}
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={handleActivateNext}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#161824',
                  color: '#ffffff',
                  padding: '9px 20px',
                  borderRadius: '100px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(22, 24, 36, 0.25)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>Activate</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: REALISTIC PIXEL-PERFECT CLICKUP WINDOW     */}
          {/* ======================================================== */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
            overflow: 'hidden',
            minHeight: '520px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Top Workspace Bar inside Window */}
            <div style={{
              height: '52px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 18px'
            }}>
              {/* Workspace Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <span style={{ color: '#f59e0b', fontSize: '1.1rem' }}>💥</span>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e293b' }}>
                  {selectedFeature === 'projects' && 'Mango Tech'}
                  {selectedFeature === 'chat' && 'Mango Inc.'}
                  {selectedFeature === 'brain' && 'Mango Technologies'}
                  {selectedFeature === 'agents' && 'Mango Inc.'}
                  {selectedFeature === 'sprints' && 'Mango Inc.'}
                  {!['projects', 'chat', 'brain', 'agents', 'sprints'].includes(selectedFeature) && 'Mango Tech'}
                </span>
                <ChevronDown size={14} color="#64748b" />
              </div>

              {/* Universal Search Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '6px 14px',
                width: '320px',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#94a3b8' }}>
                  <Search size={14} />
                  <span>Search ⌘K</span>
                </div>
                <BrainPetalLogo size={16} />
              </div>

              {/* Avatar on Right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=faces"
                  alt=""
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Window Body: Left Icon Rail + Content Stage */}
            <div style={{ display: 'flex', flex: 1 }}>
              
              {/* Vertical Dark Icon Rail */}
              <div style={{
                width: '46px',
                backgroundColor: '#0c0e17',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 0',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
                  {/* Top icon */}
                  {selectedFeature === 'automations' ? (
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 14px rgba(168, 85, 247, 0.75)'
                    }}>
                      <Bot size={16} color="#ffffff" />
                    </div>
                  ) : (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#1a1d2d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                      cursor: 'pointer'
                    }}>
                      <Home size={16} />
                    </div>
                  )}

                  {/* 2nd Icon: Document */}
                  {selectedFeature === 'docs' ? (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#0084ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 14px rgba(0, 132, 255, 0.85)'
                    }}>
                      <FileText size={15} color="#ffffff" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div style={{ color: '#64748b', cursor: 'pointer' }}>
                      <FileText size={16} />
                    </div>
                  )}

                  {/* 3rd Icon: Gear / Settings */}
                  <div style={{ color: '#64748b', cursor: 'pointer' }}>
                    <Settings size={16} />
                  </div>

                  {/* 4th Icon: Feature specific icon */}
                  {selectedFeature === 'calendar' && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 14px rgba(220, 38, 38, 0.8)',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      color: '#ffffff'
                    }}>
                      31
                    </div>
                  )}

                  {selectedFeature === 'whiteboards' && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 14px rgba(245, 158, 11, 0.85)'
                    }}>
                      <Sparkles size={15} color="#ffffff" strokeWidth={2.5} />
                    </div>
                  )}

                  {selectedFeature === 'dashboards' && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#a855f7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 14px rgba(168, 85, 247, 0.85)'
                    }}>
                      <BarChart2 size={15} color="#ffffff" strokeWidth={2.5} />
                    </div>
                  )}

                  {selectedFeature === 'scheduling' && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#9333ea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 14px rgba(147, 51, 234, 0.85)'
                    }}>
                      <Calendar size={15} color="#ffffff" strokeWidth={2.5} />
                    </div>
                  )}

                  {selectedFeature === 'time' && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 14px rgba(249, 115, 22, 0.85)'
                    }}>
                      <Clock size={15} color="#ffffff" strokeWidth={2.5} />
                    </div>
                  )}
                </div>

                {/* Bottom 9-dot grid icon */}
                <div style={{ color: '#64748b', cursor: 'pointer' }}>
                  <Grid size={16} />
                </div>
              </div>

              {/* Dynamic Content Pane */}
              <div style={{ flex: 1, backgroundColor: '#ffffff', overflowY: 'auto' }}>
                
                {/* ======================================================== */}
                {/* 1. SCREENSHOT 1: PROJECTS (LIST VIEW WITH BRAIN POPUP)    */}
                {/* ======================================================== */}
                {selectedFeature === 'projects' && (
                  <div style={{ padding: '20px 24px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>✎</span>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>Engineering</span>
                      <ChevronDown size={14} color="#64748b" />
                      <Star size={14} color="#94a3b8" />
                    </div>

                    {/* View Tabs Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '10px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.86rem', fontWeight: 700 }}>
                        <span style={{ color: '#7b68ee', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '2px solid #7b68ee', paddingBottom: '8px' }}>
                          <span style={{ fontSize: '0.8rem' }}>☰</span> List
                        </span>
                        <span style={{ color: '#64748b', cursor: 'pointer' }}>Board</span>
                        <span style={{ color: '#64748b', cursor: 'pointer' }}>Gantt</span>
                        <span style={{ color: '#94a3b8', cursor: 'pointer' }}>+ View</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button style={{
                          backgroundColor: '#7b68ee',
                          color: '#ffffff',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span>+ Task</span>
                          <ChevronDown size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Table Columns */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 100px 100px 100px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#94a3b8',
                      padding: '4px 8px',
                      borderBottom: '1px solid #f1f5f9'
                    }}>
                      <span>Name</span>
                      <span>Priority</span>
                      <span>Assignee</span>
                      <span>Labels</span>
                    </div>

                    {/* Group: IN PROGRESS */}
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>▼</span>
                        <span style={{
                          backgroundColor: '#0084ff',
                          color: '#ffffff',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          IN PROGRESS 4
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {/* Task 1 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 100px 100px', padding: '9px 8px', fontSize: '0.86rem', alignItems: 'center', borderBottom: '1px solid #f8fafc' }}>
                          <span style={{ color: '#1e293b', fontWeight: 600 }}>Migrate DB to Postgres 16</span>
                          <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>⚑ High</span>
                          <span><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=faces" style={{ width: '22px', height: '22px', borderRadius: '50%' }} alt="" /></span>
                          <span><span style={{ backgroundColor: '#fce7f3', color: '#db2777', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>Data</span></span>
                        </div>

                        {/* Task 2 (HIGHLIGHTED WITH PINK GLOW & BRAIN TOOLTIP) */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 100px 100px 100px',
                          padding: '10px 8px',
                          fontSize: '0.86rem',
                          alignItems: 'center',
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          position: 'relative',
                          boxShadow: '0 0 16px rgba(244, 114, 182, 0.45)',
                          border: '1px solid rgba(244, 114, 182, 0.4)'
                        }}>
                          <span style={{ color: '#1e293b', fontWeight: 700 }}>Fix flaky E2E tests</span>
                          <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>⚑ High</span>
                          <span><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=faces" style={{ width: '22px', height: '22px', borderRadius: '50%' }} alt="" /></span>
                          <span><span style={{ backgroundColor: '#ede9fe', color: '#7c3aed', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>Infra</span></span>

                          {/* FLOATING BRAIN POPUP PILL */}
                          <div style={{
                            position: 'absolute',
                            left: '32%',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: '#ffffff',
                            borderRadius: '100px',
                            padding: '6px 14px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            zIndex: 10
                          }}>
                            <BrainPetalLogo size={18} />
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0f172a' }}>Brain</div>
                              <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>Moving to In Review...</div>
                            </div>
                          </div>
                        </div>

                        {/* Task 3 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 100px 100px', padding: '9px 8px', fontSize: '0.86rem', alignItems: 'center', borderBottom: '1px solid #f8fafc' }}>
                          <span style={{ color: '#1e293b', fontWeight: 600 }}>Optimize image pipeline</span>
                          <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>⚑ High</span>
                          <span><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=faces" style={{ width: '22px', height: '22px', borderRadius: '50%' }} alt="" /></span>
                          <span><span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>Frontend</span></span>
                        </div>

                        {/* Task 4 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 100px 100px', padding: '9px 8px', fontSize: '0.86rem', alignItems: 'center' }}>
                          <span style={{ color: '#1e293b', fontWeight: 600 }}>Add rate limiting to API</span>
                          <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>⚑ High</span>
                          <span><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=faces" style={{ width: '22px', height: '22px', borderRadius: '50%' }} alt="" /></span>
                          <span><span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>Backend</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 2. SCREENSHOT 2: CHAT (PRODUCT CHANNEL & TASK EMBED)     */}
                {/* ======================================================== */}
                {selectedFeature === 'chat' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', height: '100%', minHeight: '460px' }}>
                    {/* Chat channels list pane */}
                    <div style={{ borderRight: '1px solid #f1f5f9', padding: '14px', backgroundColor: '#fcfcfd' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#1e293b' }}>Chats</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>✎</span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', fontSize: '0.74rem', marginBottom: '12px' }}>
                        <span style={{ backgroundColor: '#e2e8f0', color: '#1e293b', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>Unreads</span>
                        <span style={{ color: '#64748b', padding: '2px 8px' }}>DMs</span>
                        <span style={{ color: '#64748b', padding: '2px 8px' }}>Channels</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>Zeb Evans</span>
                            <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '1px 5px', borderRadius: '100px' }}>2</span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>Can you share the latest desi...</div>
                        </div>

                        <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#ede9fe' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#7c3aed' }}># Product</span>
                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>5m ago</span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>Hi team! I have a quick question...</div>
                        </div>

                        <div style={{ padding: '8px', borderRadius: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#475569' }}>Joey Cox</span>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>📞 Missed a SyncUp</div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages Pane */}
                    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        {/* Channel title */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '14px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}># Product</span>
                          <div style={{ display: 'flex', gap: '10px', color: '#64748b' }}>
                            <PhoneCall size={15} />
                            <Video size={15} />
                            <BrainPetalLogo size={15} />
                          </div>
                        </div>

                        {/* Message 1 */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop" style={{ width: '28px', height: '28px', borderRadius: '50%' }} alt="" />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>Zeb E.</span>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>3:56 pm</span>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                              <span style={{ color: '#0084ff', fontWeight: 700 }}>@Ivan</span> We're going to need an Agents button to show agents in the channel. I don't think top right makes sense - looks like global AI.
                            </div>
                          </div>
                        </div>

                        {/* Message 2 with AI task card creation */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop" style={{ width: '28px', height: '28px', borderRadius: '50%' }} alt="" />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>Fan L.</span>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>10:38 am</span>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '2px' }}>
                              Hey Ivan, created a task with ClickUp AI:
                            </div>

                            {/* Embedded Task Card */}
                            <div style={{
                              marginTop: '8px',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              padding: '10px 14px',
                              maxWidth: '380px'
                            }}>
                              <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#1e293b' }}>Redesign Mic icon</div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.74rem' }}>
                                <span style={{ color: '#64748b' }}>Status:</span>
                                <span style={{ backgroundColor: '#059669', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>PRODUCT SCOPE</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Chat input */}
                      <div style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '16px'
                      }}>
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Write to Chat Product...</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                          <AtSign size={14} />
                          <Mic size={14} />
                          <Send size={14} color="#7b68ee" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 3. SCREENSHOT 3: BRAIN MAX (VACATION SYNTHESIS & DOCS)   */}
                {/* ======================================================== */}
                {selectedFeature === 'brain' && (
                  <div style={{ padding: '30px 40px', maxWidth: '720px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', fontWeight: 600, fontSize: '1rem', color: '#1e293b', marginBottom: '24px' }}>
                      What happened last week while I was away on vacation?
                    </div>

                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '24px' }}>
                      <BrainPetalLogo size={24} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginBottom: '8px' }}>
                          Here's what I found:
                        </div>
                        <ul style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.7, paddingLeft: '16px' }}>
                          <li>Akram drove a lot of design improvements for 4.0 Launch.</li>
                          <li>Aleksei and Igor made notable improvements to AI product areas.</li>
                          <li>Jack closed out 13 issues that were found during user testing. Here are 4 tasks that need your attention:</li>
                        </ul>

                        {/* 4 synthesized tasks */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', padding: '6px 10px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                            <span style={{ fontWeight: 700, color: '#1e293b' }}>✔ Redesign Agents Button Placement</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#059669', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>PRODUCT SCOPE</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', padding: '6px 10px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                            <span style={{ fontWeight: 700, color: '#1e293b' }}>✔ UI Refinements – Global Sidebar</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#dc2626', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>ON HOLD</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', padding: '6px 10px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                            <span style={{ fontWeight: 700, color: '#1e293b' }}>✔ Broken Links on Landing Page</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#7c3aed', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>AWAITING CLIENT</span>
                          </div>
                        </div>

                        {/* Next prompt */}
                        <div style={{ marginTop: '20px', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                          Create a doc with all the relevant context of those 4 tasks.
                        </div>

                        <div style={{ marginTop: '10px', fontSize: '0.84rem', color: '#475569' }}>
                          Sure, here's a document with a detailed overview. Generated <span style={{ fontWeight: 800, color: '#7b68ee' }}>OOO report.doc</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 4. SCREENSHOT 4: AI AGENTS (WITH AR RAINBOW VISOR MASKS) */}
                {/* ======================================================== */}
                {selectedFeature === 'agents' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', height: '100%', minHeight: '460px' }}>
                    {/* Left Agent Profile */}
                    <div style={{ padding: '24px', borderRight: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                        {/* Stylized Avatar with Rainbow Visor Glasses */}
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '16px',
                          backgroundColor: '#fed7aa',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#fdba74', position: 'relative' }}>
                            {/* Rainbow visor glasses */}
                            <div style={{
                              position: 'absolute',
                              top: '12px',
                              left: '-4px',
                              right: '-4px',
                              height: '14px',
                              borderRadius: '100px',
                              background: 'linear-gradient(90deg, #ff007a, #9d00ff, #00f0ff, #ffb800)',
                              boxShadow: '0 0 8px rgba(0,240,255,0.8)'
                            }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>Project Manager</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                            Orchestrates process and alignment across functions so engineers can focus on delivering high-quality work.
                          </div>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Play size={11} fill="#1e293b" /> Test agent
                            </button>
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>•••</span>
                          </div>
                        </div>
                      </div>

                      {/* Instructions snippet */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Instructions & Role
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                          You are responsible for streamlining workflows, aligning timelines, and keeping the team unblocked and coordinated.
                        </p>
                      </div>
                    </div>

                    {/* Right Agent Grid */}
                    <div style={{ padding: '20px', backgroundColor: '#fcfcfd' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px', display: 'flex', gap: '12px' }}>
                        <span style={{ color: '#7b68ee', borderBottom: '2px solid #7b68ee', paddingBottom: '4px' }}>All</span>
                        <span style={{ color: '#64748b' }}>Created by me</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {/* Card 1 */}
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#bae6fd', margin: '0 auto 8px', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '16px', left: '4px', right: '4px', height: '10px', borderRadius: '6px', background: 'linear-gradient(90deg, #ec4899, #3b82f6)' }} />
                          </div>
                          <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>Recruiting Manager</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Posts jobs & vets CVs</div>
                        </div>

                        {/* Card 2 */}
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fed7aa', margin: '0 auto 8px', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '16px', left: '4px', right: '4px', height: '10px', borderRadius: '6px', background: 'linear-gradient(90deg, #f97316, #a855f7)' }} />
                          </div>
                          <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>Content Creator</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Storyteller across media</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 5. SCREENSHOT 5: SPRINTS (SPRINT 52 AGILE KANBAN BOARD)  */}
                {/* ======================================================== */}
                {selectedFeature === 'sprints' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', height: '100%', minHeight: '460px' }}>
                    {/* Left Spaces tree */}
                    <div style={{ borderRight: '1px solid #f1f5f9', padding: '14px', backgroundColor: '#fcfcfd', fontSize: '0.78rem' }}>
                      <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Spaces</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#64748b' }}>
                        <div>📁 Marketing</div>
                        <div style={{ color: '#7b68ee', fontWeight: 800 }}>📁 Product</div>
                        <div style={{ paddingLeft: '14px', color: '#0084ff', fontWeight: 700 }}>🟢 Sprint 52 (7/18)</div>
                        <div style={{ paddingLeft: '14px' }}>○ Sprint 51</div>
                        <div style={{ paddingLeft: '14px' }}>○ Sprint 50</div>
                      </div>
                    </div>

                    {/* Sprints Board */}
                    <div style={{ padding: '18px' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '14px' }}>
                        Sprint 52 (7/18 - 7/24)
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 40px 1.2fr 1.2fr', gap: '12px' }}>
                        {/* OPEN 5 */}
                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>OPEN 5</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, border: '1px solid #e2e8f0' }}>
                              Design home page layout
                              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>📅 Jul 20</div>
                            </div>
                            <div style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, border: '1px solid #e2e8f0' }}>
                              Create user profile UI
                              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>📅 Jul 20</div>
                            </div>
                          </div>
                        </div>

                        {/* IN PROGRESS 2 (VERTICAL TAB) */}
                        <div style={{ backgroundColor: '#0084ff', color: '#fff', borderRadius: '6px', writingMode: 'vertical-rl', transform: 'rotate(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                          IN PROGRESS 2
                        </div>

                        {/* TESTING 3 */}
                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#6366f1', marginBottom: '8px' }}>TESTING 3</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, border: '1px solid #e2e8f0' }}>
                              Refine dashboard widgets
                              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>📅 Jul 19</div>
                            </div>
                            <div style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, border: '1px solid #e2e8f0' }}>
                              Mockup mobile views
                              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>📅 Jul 20</div>
                            </div>
                          </div>
                        </div>

                        {/* DESIGN REVIEW */}
                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#ec4899', marginBottom: '8px' }}>DESIGN REVIEW</div>
                          <div style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, border: '1px solid #e2e8f0' }}>
                            Develop modal components
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>📅 Jun 28</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 6. SCREENSHOT 6: TIME TRACKING (TIMESHEETS & TRACK TIME) */}
                {/* ======================================================== */}
                {selectedFeature === 'time' && (
                  <div style={{ position: 'relative', height: '100%', minHeight: '480px', overflow: 'hidden' }}>
                    {/* Background Timesheet Table */}
                    <div style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', marginBottom: '12px' }}>
                        Timetracking
                      </div>

                      {/* Subtabs */}
                      <div style={{ display: 'flex', gap: '20px', fontSize: '0.84rem', fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
                        <span style={{ color: '#0084ff', borderBottom: '2px solid #0084ff', paddingBottom: '8px' }}>My timesheets</span>
                        <span style={{ color: '#64748b', cursor: 'pointer' }}>All timesheets</span>
                        <span style={{ color: '#64748b', cursor: 'pointer' }}>Approvals</span>
                      </div>

                      {/* Timesheet Days Header */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 75px)', gap: '14px', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <div>
                          <div>Tue, Jun 13</div>
                          <div style={{ fontSize: '0.86rem', color: '#1e293b', fontWeight: 800 }}>7h 14m</div>
                          <div style={{ width: '100%', height: '2px', backgroundColor: '#0084ff', marginTop: '2px' }} />
                        </div>
                        <div>
                          <div>Wed, Jun 14</div>
                          <div style={{ fontSize: '0.86rem', color: '#1e293b', fontWeight: 800 }}>6h 33m</div>
                          <div style={{ width: '100%', height: '2px', backgroundColor: '#0084ff', marginTop: '2px' }} />
                        </div>
                        <div>
                          <div>Thu, Jun 15</div>
                          <div style={{ fontSize: '0.86rem', color: '#1e293b', fontWeight: 800 }}>6h 37m</div>
                          <div style={{ width: '100%', height: '3px', backgroundColor: '#0f172a', marginTop: '2px' }} />
                        </div>
                        <div>
                          <div>Fri, Jun 16</div>
                          <div style={{ fontSize: '0.86rem', color: '#94a3b8' }}>0h</div>
                        </div>
                        <div>
                          <div>Sat, Jun 17</div>
                          <div style={{ fontSize: '0.86rem', color: '#94a3b8' }}>0h</div>
                        </div>
                      </div>

                      {/* Time grid table rows */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', fontSize: '0.8rem', color: '#475569' }}>
                        {[
                          ['2h 14m', '—', '45m', '—'],
                          ['2h 00m', '3h 00m', '2h', '—'],
                          ['—', '1h 00m', '—', '—'],
                          ['1h 00m', '—', '30m', '—'],
                          ['1h 00m', '—', '1h 18m', '—'],
                          ['—', '33m', '—', '—'],
                          ['—', '—', '1h 00m', '—'],
                          ['—', '1h 00m', '—', '—']
                        ].map((row, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 75px)', gap: '14px', padding: '6px 0', borderBottom: '1px solid #f8fafc' }}>
                            <span style={{ fontWeight: row[0] !== '—' ? 700 : 400, color: row[0] !== '—' ? '#1e293b' : '#cbd5e1' }}>{row[0]}</span>
                            <span style={{ fontWeight: row[1] !== '—' ? 700 : 400, color: row[1] !== '—' ? '#1e293b' : '#cbd5e1' }}>{row[1]}</span>
                            <span style={{ fontWeight: row[2] !== '—' ? 700 : 400, color: row[2] !== '—' ? '#1e293b' : '#cbd5e1' }}>{row[2]}</span>
                            <span style={{ fontWeight: row[3] !== '—' ? 700 : 400, color: row[3] !== '—' ? '#1e293b' : '#cbd5e1' }}>{row[3]}</span>
                            <span style={{ color: '#cbd5e1' }}>—</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FOREGROUND FLOATING "TRACK TIME" PANEL MATCHING SCREENSHOT */}
                    <div style={{
                      position: 'absolute',
                      right: '18px',
                      top: '12px',
                      width: '390px',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 15px 45px rgba(15, 23, 42, 0.16)',
                      padding: '16px',
                      zIndex: 20
                    }}>
                      {/* Panel Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>
                          <Clock size={16} color="#475569" />
                          <span>Track Time</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                          <span style={{ color: '#0f172a', fontWeight: 800 }}>6h 37m</span> / 8h
                        </div>
                      </div>

                      {/* Progress Bar (6h 37m / 8h = ~82%) */}
                      <div style={{ width: '100%', height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
                        <div style={{ width: '82%', height: '100%', backgroundColor: '#0084ff', borderRadius: '3px' }} />
                      </div>

                      {/* New Time Entry Card */}
                      <div style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        marginBottom: '14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
                            <Clock size={13} />
                            <span>New time entry</span>
                          </div>
                          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=30&h=30&fit=crop" style={{ width: '18px', height: '18px', borderRadius: '50%' }} alt="" />
                        </div>

                        {/* Input with glowing purple border and play button */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1.5px solid #a855f7',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          boxShadow: '0 0 10px rgba(168, 85, 247, 0.25)',
                          marginBottom: '10px'
                        }}>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                            Add time (ex: 3h 20m) or start a timer
                          </span>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#7c3aed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}>
                            <Play size={12} fill="#ffffff" color="#ffffff" style={{ marginLeft: '1px' }} />
                          </div>
                        </div>

                        {/* Dropdown Options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.76rem', color: '#64748b' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 0' }}>
                            <span>○ Select task</span>
                            <ChevronDown size={12} />
                          </div>
                          <div style={{ padding: '3px 0' }}>
                            🕒 Mon, Jun 15 &nbsp; 9:40 am – 11:40 am
                          </div>
                          <div style={{ padding: '3px 0' }}>
                            ≡ Notes
                          </div>
                          <div style={{ padding: '3px 0' }}>
                            🏷 Add tags
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#64748b' }}>
                            <input type="checkbox" style={{ accentColor: '#7c3aed' }} />
                            <span>Billable</span>
                          </label>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.74rem', color: '#64748b', cursor: 'pointer' }}>Cancel</span>
                            <button style={{ backgroundColor: '#7c3aed', color: '#fff', fontSize: '0.74rem', fontWeight: 700, padding: '4px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                              Save
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Today Logged Entries */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                          <span>Today, Jun 15</span>
                          <span>6h 37m</span>
                        </div>

                        {/* Entry 1 */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc', fontSize: '0.78rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#1e293b' }}>
                              <Clock size={13} color="#0084ff" />
                              <span>AI Marketing</span>
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8', paddingLeft: '19px' }}>9:00 am – 9:45 am</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16a34a', backgroundColor: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>💲 0h 45m</span>
                            <Play size={12} color="#64748b" style={{ cursor: 'pointer' }} />
                          </div>
                        </div>

                        {/* Entry 2 */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.78rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#1e293b' }}>
                              <Clock size={13} color="#0084ff" />
                              <span>Write report</span>
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8', paddingLeft: '19px' }}>9:48 am – 11:48 am</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', paddingLeft: '19px', marginTop: '1px' }}>Added details and next steps</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16a34a', backgroundColor: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>💲 2h 00m</span>
                            <Play size={12} color="#64748b" style={{ cursor: 'pointer' }} />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 7. SCREENSHOT 1: CALENDAR (SEP 2025 & EVENT POPUP)       */}
                {/* ======================================================== */}
                {selectedFeature === 'calendar' && (
                  <div style={{ position: 'relative', height: '100%', minHeight: '520px', padding: '16px 20px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem', fontWeight: 800 }}>
                          <span style={{ cursor: 'pointer', padding: '2px 4px' }}>&lt;</span>
                          <span style={{ cursor: 'pointer', padding: '2px 4px' }}>&gt;</span>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>Sep 2025</span>
                      </div>
                    </div>

                    {/* Calendar Grid Container */}
                    <div style={{ position: 'relative', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                      {/* Day Header Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(6, 1fr)', backgroundColor: '#fafafb', borderBottom: '1px solid #e2e8f0', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textAlign: 'center', padding: '8px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>+</span>
                          <span>PST</span>
                        </div>
                        <div>Mon 12</div>
                        <div>Tue 13</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          Wed <span style={{ backgroundColor: '#dc2626', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800 }}>14</span>
                        </div>
                        <div>Thu 15</div>
                        <div>Fri 16</div>
                        <div>Sat 17</div>
                      </div>

                      {/* All day row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', borderBottom: '1px solid #e2e8f0', padding: '4px 8px', fontSize: '0.72rem', color: '#94a3b8', backgroundColor: '#ffffff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>⇅</span> All day
                        </div>
                        <div />
                      </div>

                      {/* Red Time Marker Line (9:47 AM across calendar) */}
                      <div style={{ position: 'absolute', top: '122px', left: 0, right: 0, height: '1.5px', backgroundColor: '#dc2626', zIndex: 12, pointerEvents: 'none' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '-10px', backgroundColor: '#dc2626', color: '#fff', fontSize: '0.66rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>
                          9:47
                        </span>
                        {/* Red Dot on Wednesday at the line */}
                        <div style={{
                          position: 'absolute',
                          left: '42.5%',
                          top: '-4px',
                          width: '9px',
                          height: '9px',
                          borderRadius: '50%',
                          backgroundColor: '#dc2626',
                          border: '2px solid #ffffff'
                        }} />
                      </div>

                      {/* Calendar Body Slots */}
                      <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(6, 1fr)', fontSize: '0.74rem', minHeight: '400px' }}>
                        {/* Time labels column */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px 10px', borderRight: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '0.72rem' }}>
                          <span>8 am</span>
                          <span style={{ opacity: 0 }}>9:47</span>
                          <span>9 am</span>
                          <span>10 am</span>
                          <span>11 am</span>
                          <span>12 pm</span>
                          <span>1 pm</span>
                          <span>2 pm</span>
                          <span>3 pm</span>
                        </div>

                        {/* Mon 12 */}
                        <div style={{ borderRight: '1px solid #f1f5f9', padding: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ backgroundColor: '#ccfbf1', color: '#0f766e', borderLeft: '3px solid #14b8a6', padding: '6px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            🎧 Designing
                            <div style={{ fontSize: '0.64rem', fontWeight: 500, color: '#115e59' }}>9 - 11am</div>
                          </div>
                          <div style={{ backgroundColor: '#fef9c3', color: '#a16207', borderLeft: '3px solid #eab308', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Lunch
                          </div>
                          <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Design Weekly Kickoff
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>12 - 1pm</div>
                          </div>
                          <div style={{ border: '1px solid #e0f2fe', backgroundColor: '#f0f9ff', color: '#0284c7', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Product Roulette
                          </div>
                          <div style={{ background: 'repeating-linear-gradient(45deg, #f0f9ff, #f0f9ff 8px, #e0f2fe 8px, #e0f2fe 16px)', padding: '8px', borderRadius: '4px', color: '#0369a1', fontWeight: 700 }}>
                            Brainstorm Ideas
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>2 - 4pm</div>
                          </div>
                        </div>

                        {/* Tue 13 */}
                        <div style={{ borderRight: '1px solid #f1f5f9', padding: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ border: '1.5px dashed #c084fc', backgroundColor: '#faf5ff', color: '#7e22ce', padding: '6px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            ⚡ Wireframe onboarding
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>10 - 11am</div>
                          </div>
                          <div style={{ backgroundColor: '#f0f9ff', color: '#0284c7', border: '1px solid #e0f2fe', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Product Roulette
                          </div>
                          <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Brainstorm product ide...
                          </div>
                          <div style={{ backgroundColor: '#fef9c3', color: '#a16207', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Lunch
                          </div>
                          <div style={{ backgroundColor: '#fce7f3', color: '#be185d', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            4.0 Review
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>1 - 2pm</div>
                          </div>
                          <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 6px', borderRadius: '4px' }}>
                            Project...
                          </div>
                          <div style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '6px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            🎧 Content...
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>2 - 4pm</div>
                          </div>
                        </div>

                        {/* Wed 14 */}
                        <div style={{ borderRight: '1px solid #f1f5f9', padding: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ border: '1px solid #3b82f6', backgroundColor: '#ffffff', color: '#1d4ed8', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            1:1 Maria
                          </div>
                          <div style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            🎧 Check Inbox
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>8:30 - 9:30am</div>
                          </div>
                          <div style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '8px', borderRadius: '6px', fontWeight: 800, boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
                            Design Sprint Feedback
                            <div style={{ fontSize: '0.66rem', fontWeight: 600, opacity: 0.9 }}>9:30am - 10:30am</div>
                          </div>
                          <div style={{ border: '1.5px dashed #c084fc', backgroundColor: '#faf5ff', color: '#7e22ce', padding: '4px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                            ...nboardi...
                          </div>
                        </div>

                        {/* Thu 15 */}
                        <div style={{ borderRight: '1px solid #f1f5f9', padding: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '6px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            🎧 Focus
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>8 - 9am</div>
                          </div>
                          <div style={{ border: '1px solid #3b82f6', backgroundColor: '#ffffff', color: '#1d4ed8', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Design System Jam
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>10 - 11am</div>
                          </div>
                          <div style={{ border: '1px solid #3b82f6', backgroundColor: '#ffffff', color: '#1d4ed8', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Ayda &lt;&gt; Zach Weekly
                          </div>
                        </div>

                        {/* Fri 16 */}
                        <div style={{ borderRight: '1px solid #f1f5f9', padding: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '8px', borderRadius: '4px', fontWeight: 700 }}>
                            ✈ Out of Office
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>8am - 1pm</div>
                          </div>
                          <div style={{ border: '1px solid #3b82f6', backgroundColor: '#ffffff', color: '#1d4ed8', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Zeb / Ricardo
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>9 - 10am</div>
                          </div>
                          <div style={{ border: '1.5px solid #f59e0b', backgroundColor: '#ffffff', color: '#b45309', padding: '4px 8px', borderRadius: '4px', fontWeight: 800 }}>
                            Quick Lunch
                          </div>
                          <div style={{ backgroundColor: '#ffedd5', color: '#c2410c', padding: '6px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            EDP Squad
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>1 - 2pm</div>
                          </div>
                          <div style={{ backgroundColor: '#fae8ff', color: '#a21caf', padding: '6px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            Product &amp; Design Staff
                            <div style={{ fontSize: '0.64rem', fontWeight: 500 }}>2 - 3pm</div>
                          </div>
                        </div>

                        {/* Sat 17 */}
                        <div style={{ padding: '6px' }} />
                      </div>
                    </div>

                    {/* FLOATING CALENDAR EVENT MODAL OVER WEDNESDAY MATCHING SCREENSHOT 1 */}
                    <div style={{
                      position: 'absolute',
                      left: '45%',
                      top: '52%',
                      transform: 'translate(-30%, -40%)',
                      width: '340px',
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 20px 45px rgba(15, 23, 42, 0.18)',
                      padding: '16px',
                      zIndex: 30
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: '#64748b', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.9rem' }}>📅</span>
                          <span style={{ fontWeight: 700 }}>Event</span>
                        </div>
                        <span style={{ cursor: 'pointer', color: '#94a3b8' }}>✕</span>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a' }}>
                        Design Sprint Feedback
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>14 Sep, 2025</span>
                        <span>9:30 am → 10:30 am</span>
                      </div>

                      {/* Join Meeting button with logos */}
                      <div style={{ marginTop: '12px' }}>
                        <button style={{
                          width: '100%',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          padding: '7px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem' }}>📹</span>
                            <span style={{ fontSize: '0.85rem' }}>💬</span>
                            <span style={{ fontSize: '0.85rem' }}>👥</span>
                            <span>Join Meeting</span>
                          </div>
                          <ChevronDown size={14} color="#64748b" />
                        </button>
                      </div>

                      {/* Attendees & AI Notetaker row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', fontSize: '0.78rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=30&h=30&fit=crop" style={{ width: '22px', height: '22px', borderRadius: '50%' }} alt="" />
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop" style={{ width: '22px', height: '22px', borderRadius: '50%' }} alt="" />
                          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=30&h=30&fit=crop" style={{ width: '22px', height: '22px', borderRadius: '50%' }} alt="" />
                          <span style={{ fontWeight: 800, fontSize: '0.72rem', backgroundColor: '#f1f5f9', padding: '2px 5px', borderRadius: '100px' }}>+3</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600 }}>AI Notetaker</span>
                          <div style={{ width: '32px', height: '18px', backgroundColor: '#7c3aed', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                            <div style={{ width: '14px', height: '14px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                          </div>
                        </div>
                      </div>

                      {/* Tasks & Docs linking section */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '12px', fontSize: '0.74rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Link2 size={12} />
                          <span>Add ClickUp <span style={{ textDecoration: 'underline', color: '#1e293b', fontWeight: 600 }}>tasks</span> and <span style={{ textDecoration: 'underline', color: '#1e293b', fontWeight: 600 }}>docs</span></span>
                        </div>
                        <div style={{ color: '#7c3aed', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>◎</span> App Mentions design
                        </div>
                        <div style={{ color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📄</span> Mango Technologies Product Design
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 8. SCREENSHOT 2: DOCS (ONBOARDING WIKI & AI GENERATING)  */}
                {/* ======================================================== */}
                {selectedFeature === 'docs' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr', height: '100%', minHeight: '520px' }}>
                    {/* Inner Pages Tree Sidebar */}
                    <div style={{ borderRight: '1px solid #f1f5f9', padding: '16px', backgroundColor: '#fcfcfd', fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '10px' }}>
                        Pages
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ backgroundColor: '#f1f5f9', padding: '6px 10px', borderRadius: '6px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📄 Onboarding wiki
                        </div>
                        <div style={{ padding: '6px 10px', color: '#475569' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📁 Core Values</div>
                          <div style={{ paddingLeft: '14px', marginTop: '5px', color: '#64748b', fontSize: '0.74rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div>⑂ Who we are</div>
                            <div>📄 Company Pillars</div>
                          </div>
                        </div>
                        <div style={{ padding: '6px 10px', color: '#64748b' }}>⭐ Benefits</div>
                        <div style={{ padding: '6px 10px', color: '#64748b' }}>💰 Payroll</div>
                        <div style={{ padding: '6px 10px', color: '#64748b' }}>🏢 Office Locations</div>
                        <div style={{ padding: '6px 10px', color: '#0084ff', fontWeight: 700, cursor: 'pointer' }}>+ Add page</div>
                      </div>
                    </div>

                    {/* Document Body */}
                    <div style={{ padding: '26px 36px', overflowY: 'auto' }}>
                      {/* Breadcrumbs */}
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#ef4444' }}>🔴</span> / 📁 / <span style={{ color: '#0084ff' }}>📄</span>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>Crew Central</span>
                        <span>⭐</span>
                      </div>

                      {/* Doc Title */}
                      <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                        Onboarding wiki
                      </h1>

                      {/* Author & contributors */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#64748b', marginBottom: '26px' }}>
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=30&h=30&fit=crop" style={{ width: '20px', height: '20px', borderRadius: '50%' }} alt="" />
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>Fan Lin</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop" style={{ width: '18px', height: '18px', borderRadius: '50%', marginRight: '-4px' }} alt="" />
                          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=24&h=24&fit=crop" style={{ width: '18px', height: '18px', borderRadius: '50%' }} alt="" />
                        </div>
                        <span>Contributors</span>
                        <span>•</span>
                        <span>Last updated at 11:47 am</span>
                      </div>

                      {/* Content Grid (Two columns with collaborative cursors) */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '28px', fontSize: '0.88rem' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>Welcome</span>
                            {/* Blue collaborator cursor tag */}
                            <span style={{ backgroundColor: '#0084ff', color: '#fff', fontSize: '0.64rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', position: 'relative', top: '-6px' }}>
                              Alexandra C.
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#334155' }}>
                            <div>✉️ Letter from the CEO</div>
                            <div>💬 Company Story</div>
                            <div>💜 Values and Principles</div>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                            Tools and systems
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#334155' }}>
                            <div>👥 Communication</div>
                            <div>📁 Project Management</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>🎨 Design/Engineering</span>
                              {/* Purple collaborator cursor tag */}
                              <span style={{ backgroundColor: '#7c3aed', color: '#fff', fontSize: '0.64rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', position: 'relative', top: '-6px' }}>
                                Samuel H.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resources Embedded Doc Card */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '12px' }}>
                          Resources
                        </div>
                        
                        <div style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          backgroundColor: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          maxWidth: '460px',
                          marginBottom: '16px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>Design Principles</div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>📄 Doc in <span style={{ textDecoration: 'underline' }}>Design Team</span></div>
                          </div>
                          <div style={{ width: '80px', height: '36px', backgroundColor: '#e2e8f0', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                        </div>

                        {/* AI Generating Bar with spinner */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          background: 'linear-gradient(90deg, #fdf4ff 0%, #ede9fe 100%)',
                          border: '1px solid #e9d5ff',
                          maxWidth: '460px'
                        }}>
                          <BrainPetalLogo size={18} />
                          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#7c3aed' }}>Generating...</span>
                          <span style={{ marginLeft: 'auto', display: 'inline-block', animation: 'spin 1.5s linear infinite' }}>
                            <Loader2 size={16} color="#a855f7" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 9. SCREENSHOT 3: WHITEBOARDS (PRIORITY MAPPING CANVAS)   */}
                {/* ======================================================== */}
                {selectedFeature === 'whiteboards' && (
                  <div style={{ position: 'relative', height: '100%', minHeight: '520px', backgroundColor: '#fcfcfd', overflow: 'hidden' }}>
                    {/* Top Canvas Bar */}
                    <div style={{ padding: '10px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>
                        <span style={{ color: '#f59e0b' }}>📁</span>
                        <span>Priority Mapping</span>
                        <Star size={14} color="#94a3b8" />
                        <ChevronDown size={14} color="#64748b" />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=30&h=30&fit=crop" style={{ width: '22px', height: '22px', borderRadius: '50%', marginRight: '-4px' }} alt="" />
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop" style={{ width: '22px', height: '22px', borderRadius: '50%' }} alt="" />
                        </div>
                        <button style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 10px', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Share2 size={12} /> Share
                        </button>
                        <span style={{ color: '#64748b', cursor: 'pointer' }}>•••</span>
                        <MessageSquare size={14} color="#64748b" />
                        <Maximize2 size={14} color="#64748b" />
                        <X size={14} color="#64748b" />
                      </div>
                    </div>

                    {/* Canvas Stage with 2x2 Quadrants */}
                    <div style={{ position: 'relative', height: '440px', backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '18px 18px', padding: '20px' }}>
                      {/* Center Cross Axes */}
                      <div style={{ position: 'absolute', left: '50%', top: '20px', bottom: '20px', width: '2px', backgroundColor: '#1e293b' }} />
                      <div style={{ position: 'absolute', top: '50%', left: '20px', right: '20px', height: '2px', backgroundColor: '#1e293b' }} />

                      {/* Quadrant Handwritten-style Labels */}
                      <div style={{ position: 'absolute', top: '6px', left: '46%', fontWeight: 800, fontSize: '0.92rem', color: '#1e293b', fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>High impact</div>
                      <div style={{ position: 'absolute', top: '46%', left: '26px', fontWeight: 800, fontSize: '0.92rem', color: '#1e293b', fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>Low Effort</div>
                      <div style={{ position: 'absolute', top: '46%', right: '26px', fontWeight: 800, fontSize: '0.92rem', color: '#1e293b', fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>High Effort</div>

                      {/* Top-Left Quadrant: Embedded Task Card */}
                      <div style={{
                        position: 'absolute',
                        left: '60px',
                        top: '40px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        width: '230px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                      }}>
                        <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>Redesign Agents Button Placement</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} color="#10b981" /> Task in AI Squad
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '10px', fontSize: '0.72rem', color: '#64748b' }}>
                          <span>Status:</span>
                          <span style={{ backgroundColor: '#059669', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.64rem', textAlign: 'center' }}>PRODUCT SCOPE</span>
                          <span>Assignee:</span>
                          <span><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop" style={{ width: '16px', height: '16px', borderRadius: '50%' }} alt="" /></span>
                          <span>Due date:</span>
                          <span style={{ color: '#0f172a', fontWeight: 600 }}>📅 Sep 5</span>
                          <span>Priority:</span>
                          <span style={{ color: '#f59e0b', fontWeight: 700 }}>⚑ High</span>
                        </div>
                      </div>

                      {/* Top-Right Quadrant: Blue Sticky Note & Google Doc Link */}
                      <div style={{
                        position: 'absolute',
                        left: '54%',
                        top: '40px',
                        backgroundColor: '#bae6fd',
                        width: '100px',
                        height: '85px',
                        padding: '10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#0369a1',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                        fontFamily: 'Comic Sans MS, cursive, sans-serif'
                      }}>
                        Allow users to pin to top and bottom
                      </div>

                      {/* Google Doc Link Card */}
                      <div style={{
                        position: 'absolute',
                        right: '70px',
                        top: '45px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        width: '180px',
                        color: '#ffffff',
                        boxShadow: '0 4px 12px rgba(59,130,246,0.25)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800 }}>Review – Moonshot Goals</span>
                          <Link2 size={12} />
                        </div>
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', padding: '6px', color: '#334155', fontSize: '0.66rem' }}>
                          📄 Google Docs • Edited 3 min ago
                        </div>
                      </div>

                      {/* Bottom-Left Quadrant: Pink and Purple Sticky Notes */}
                      <div style={{
                        position: 'absolute',
                        left: '60px',
                        bottom: '70px',
                        backgroundColor: '#fbcfe8',
                        width: '100px',
                        height: '85px',
                        padding: '10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#9d174d',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                        fontFamily: 'Comic Sans MS, cursive, sans-serif'
                      }}>
                        Users could not find out how to move sections
                      </div>

                      <div style={{
                        position: 'absolute',
                        left: '40%',
                        bottom: '90px',
                        backgroundColor: '#e9d5ff',
                        width: '100px',
                        height: '80px',
                        padding: '10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#6b21a8',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                        fontFamily: 'Comic Sans MS, cursive, sans-serif'
                      }}>
                        Improve starter template load time
                      </div>

                      {/* Bottom-Right Quadrant: Image Generation In Progress Card */}
                      <div style={{
                        position: 'absolute',
                        right: '70px',
                        bottom: '80px',
                        padding: '16px 24px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f0fdf4 100%)',
                        border: '1.5px solid #f0abfc',
                        textAlign: 'center',
                        boxShadow: '0 8px 24px rgba(240,171,252,0.3)'
                      }}>
                        <BrainPetalLogo size={20} />
                        <div style={{ fontSize: '0.76rem', color: '#7c3aed', fontWeight: 800, marginTop: '6px' }}>
                          Image generation in progress
                        </div>
                      </div>

                      {/* Floating Bottom Canvas Toolbar matching screenshot 3 */}
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '6px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        zIndex: 20
                      }}>
                        <span style={{ cursor: 'pointer', color: '#1e293b' }}><MousePointer size={15} /></span>
                        <span style={{ cursor: 'pointer', color: '#64748b' }}><Hand size={15} /></span>
                        <span style={{ padding: '2px 8px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          📄 doc
                        </span>
                        <span style={{ cursor: 'pointer', color: '#64748b' }}><Pen size={15} /></span>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#818cf8', cursor: 'pointer' }} />
                        <span style={{ cursor: 'pointer', color: '#64748b' }}>↗</span>
                        <div style={{ width: '18px', height: '18px', backgroundColor: '#fde047', borderRadius: '3px', cursor: 'pointer' }} />
                        <span style={{ fontWeight: 900, fontSize: '0.86rem', cursor: 'pointer', color: '#1e293b' }}>T</span>
                        <span style={{ cursor: 'pointer', color: '#64748b' }}>📁</span>
                        <span style={{ cursor: 'pointer', color: '#64748b' }}>🖼</span>
                        <span style={{ cursor: 'pointer', color: '#64748b' }}>🔀</span>
                        <span style={{ cursor: 'pointer', color: '#64748b' }}>↺</span>
                        <span style={{ cursor: 'pointer', color: '#64748b' }}>↻</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 10. SCREENSHOT 4: AUTOMATIONS (FLOWCHART TRIGGER/ACTION) */}
                {/* ======================================================== */}
                {selectedFeature === 'automations' && (
                  <div style={{ padding: '28px 36px', height: '100%', minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
                    <div>
                      {/* Automation title */}
                      <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#0f172a' }}>Status Automation</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                          Located in: <span style={{ color: '#ef4444', fontWeight: 800 }}>🔴 Product Design</span>
                        </div>
                      </div>

                      {/* Automation Workflow Cards Flow */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        {/* Left Trigger Card */}
                        <div style={{ width: '290px', backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                              <BrainPetalLogo size={16} />
                              <span>Trigger</span>
                            </div>
                            <span style={{ fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Tasks and subtasks</span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 600 }}>Status changes</span>
                              <ChevronDown size={14} color="#64748b" />
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>From</div>
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: '#0084ff', fontWeight: 700 }}>◉ In Progress</span>
                              <ChevronDown size={14} color="#64748b" />
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>To</div>
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: '#16a34a', fontWeight: 700 }}>✔ Needs Review</span>
                              <ChevronDown size={14} color="#64748b" />
                            </div>
                          </div>

                          {/* Plus button centered below Trigger card */}
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px' }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem', cursor: 'pointer' }}>
                              +
                            </div>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 800 }}>
                          →
                        </div>

                        {/* Right Action Cards Stack */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ width: '300px', backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.86rem', color: '#0f172a', marginBottom: '10px' }}>
                              <BrainPetalLogo size={16} />
                              <span>Action</span>
                            </div>
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span>@ Change assignees</span>
                              <ChevronDown size={14} color="#64748b" />
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>To</div>
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>👥 Watchers, Task creator, 2 CFs</span>
                              <ChevronDown size={14} color="#64748b" />
                            </div>
                          </div>

                          <div style={{ width: '300px', backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.86rem', color: '#7c3aed' }}>
                                <BrainPetalLogo size={16} />
                                <span>Launch AI Agent</span>
                              </div>
                              <ChevronDown size={14} color="#64748b" />
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                              <span>💬</span>
                              <div>
                                <span style={{ fontWeight: 700 }}>Instructions</span>
                                <div>Tell your Agent what to do. Explain how it should use selected Tools, and when and how it should reply.</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Automation Summary Sentence */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '18px' }}>
                      <div style={{ fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.6 }}>
                        When <span style={{ backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>Status changes</span> from <span style={{ color: '#0084ff', fontWeight: 800 }}>◉ In Progress</span> to <span style={{ color: '#16a34a', fontWeight: 800 }}>✔ Needs Review</span> then <span style={{ backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>Change Assignee</span> to <span style={{ color: '#0f172a', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop" style={{ width: '16px', height: '16px', borderRadius: '50%' }} alt="" /> Akram Khalid</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                        This automation will help us assign tasks that are ready for QA to Akram who is the lead QA specialist
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 11. SCREENSHOT 5: DASHBOARDS (BUG REPORTS & AI SUMMARY)  */}
                {/* ======================================================== */}
                {selectedFeature === 'dashboards' && (
                  <div style={{ padding: '24px 30px', height: '100%', minHeight: '520px', backgroundColor: '#ffffff' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '1rem', color: '#7c3aed' }}>📊</span>
                      <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>Bug Reports</span>
                      <Star size={14} color="#94a3b8" />
                    </div>

                    {/* Dashboard 2-column Stage */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
                      {/* Left: Bar Chart & Status Donut */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* Number of bugs resolved card */}
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '18px' }}>
                            Number of bugs resolved
                          </div>

                          {/* Bar Chart with Y-axis guide lines */}
                          <div style={{ position: 'relative', height: '150px' }}>
                            {/* Y axis guide lines */}
                            <div style={{ position: 'absolute', left: '24px', right: 0, top: 0, bottom: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                              {[50, 40, 30, 20, 10, 0].map(val => (
                                <div key={val} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                  <span style={{ fontSize: '0.62rem', color: '#94a3b8', width: '20px' }}>{val}</span>
                                  <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }} />
                                </div>
                              ))}
                            </div>

                            {/* 7 Vertical Bars */}
                            <div style={{ position: 'absolute', left: '40px', right: '10px', bottom: '24px', top: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 8px' }}>
                              {[
                                { day: 'Oct 1', h: '66%', color: '#ec4899' },
                                { day: 'Oct 2', h: '84%', color: '#3b82f6' },
                                { day: 'Oct 3', h: '56%', color: '#f97316' },
                                { day: 'Oct 4', h: '44%', color: '#a8a29e' },
                                { day: 'Oct 5', h: '56%', color: '#8b5cf6' },
                                { day: 'Oct 6', h: '56%', color: '#14b8a6' },
                                { day: 'Oct 7', h: '56%', color: '#6366f1' }
                              ].map(bar => (
                                <div key={bar.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                  <div style={{ width: '22px', height: bar.h, backgroundColor: bar.color, borderRadius: '4px 4px 0 0' }} />
                                  <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>{bar.day}</span>
                                </div>
                              ))}
                            </div>

                            {/* Day label below */}
                            <div style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.64rem', color: '#94a3b8', fontWeight: 700 }}>
                              Day
                            </div>
                          </div>
                        </div>

                        {/* Bugs by status Donut card */}
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>Bugs by status</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'conic-gradient(#10b981 0% 50%, #34d399 50% 88%, #cbd5e1 88% 100%)' }} />
                            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Not started 12%</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: AI Summary Card matching screenshot 5 */}
                      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', overflowY: 'auto', maxHeight: '440px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.94rem', color: '#7c3aed', marginBottom: '14px' }}>
                          <BrainPetalLogo size={17} />
                          <span>AI Summary</span>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.65 }}>
                          <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Overall Status (This Week):</div>
                          <div>• 🐛 Total Open Bugs: 142 (⬆️ +12 vs. last week)</div>
                          <div>• 🔴 Critical Bugs: 18 (⬆️ +5; most in Payment and Mobile Checkout flows)</div>
                          <div>• ✅ Resolved Bugs: 96 (⬆️ +22; resolution rate improved 18% week-over-week)</div>

                          <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '14px', marginBottom: '6px' }}>Key Trends:</div>
                          <div>1. Mobile App Instability – 40% of new reports are iOS-specific, largely tied to app crashes on iOS 18.1 beta.</div>
                          <div>2. Payments Reliability – Spike in checkout failures after new subscription logic was rolled out; critical priority for Engineering.</div>
                          <div>3. Regression Issues – 12 reopened bugs tied to older code resurfacing (most from Notification and Search modules).</div>

                          <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '14px', marginBottom: '8px' }}>Top Open Issues</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.76rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>✔ Redesign Agents Button Placement</span>
                              <span style={{ backgroundColor: '#059669', color: '#fff', fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px' }}>PRODUCT SCOPE</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>✔ UI Refinements – Global Sidebar</span>
                              <span style={{ backgroundColor: '#dc2626', color: '#fff', fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px' }}>ON HOLD</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>🪲 Broken Links on Landing Page</span>
                              <span style={{ backgroundColor: '#7c3aed', color: '#fff', fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px' }}>AWAITING CLIENT</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>[CLK-24] Merger of Deals</span>
                              <span style={{ backgroundColor: '#06b6d4', color: '#fff', fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px' }}>WAITING</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 12. SCREENSHOT 12: SCHEDULING (DESIGN SQUAD SCHEDULE)    */}
                {/* ======================================================== */}
                {selectedFeature === 'scheduling' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', height: '100%', minHeight: '520px', backgroundColor: '#ffffff' }}>
                    {/* Left Panel: Mini Calendar & Projects Tree */}
                    <div style={{ borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
                      {/* View Title */}
                      <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #f8fafc' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                          Design Squad Schedule
                        </div>
                      </div>

                      {/* Mini Calendar Box */}
                      <div style={{ padding: '12px 18px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>December 2025</span>
                          <div style={{ display: 'flex', gap: '6px', fontSize: '0.74rem', color: '#64748b' }}>
                            <span style={{ cursor: 'pointer' }}>&lt;</span>
                            <span style={{ cursor: 'pointer' }}>&gt;</span>
                          </div>
                        </div>

                        {/* Day names */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.64rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                        </div>

                        {/* Calendar Day Numbers Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.68rem', gap: '2px', color: '#475569', fontWeight: 600 }}>
                          <span style={{ color: '#cbd5e1' }}>29</span>
                          <span style={{ color: '#cbd5e1' }}>30</span>
                          <span style={{ color: '#cbd5e1' }}>31</span>
                          <span style={{ backgroundColor: '#ef4444', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>1</span>
                          <span>2</span><span>3</span><span>4</span>

                          <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>

                          <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>

                          <span>19</span><span>20</span><span>21</span><span>22</span>
                          <span style={{ backgroundColor: '#fef08a', color: '#854d0e', borderRadius: '50%', width: '18px', height: '18px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>23</span>
                          <span style={{ backgroundColor: '#fef08a', color: '#854d0e', borderRadius: '50%', width: '18px', height: '18px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>24</span>
                          <span>25</span>

                          <span>26</span><span>27</span><span>28</span><span>29</span>
                          <span style={{ backgroundColor: '#fef08a', color: '#854d0e', borderRadius: '50%', width: '18px', height: '18px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>30</span>
                          <span style={{ backgroundColor: '#fef08a', color: '#854d0e', borderRadius: '50%', width: '18px', height: '18px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                          <span style={{ color: '#cbd5e1' }}>2</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#64748b', marginTop: '10px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                          <span>Non working days 4</span>
                        </div>
                      </div>

                      {/* Projects Hierarchy Tree */}
                      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase' }}>
                          Projects
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.8rem', color: '#0f172a' }}>
                          <span>▼</span>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid #64748b' }} />
                          <span>Research</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingLeft: '16px', marginTop: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#334155', fontWeight: 600 }}>
                            <Clock size={12} color="#0084ff" />
                            <span>Target Audience Analysis</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#334155', fontWeight: 600 }}>
                            <Clock size={12} color="#0084ff" />
                            <span>Campaign Objectives</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#334155', fontWeight: 600 }}>
                            <span style={{ color: '#a855f7', fontSize: '0.74rem' }}>◎</span>
                            <span>Ad Placement Strategy</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#334155', fontWeight: 600 }}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f97316' }} />
                            <span>Analytics and Tracking</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Workload Heatmap & Timeline Gantt Grid */}
                    <div style={{ position: 'relative', overflowX: 'auto', display: 'flex', flexDirection: 'column' }}>
                      {/* Timeline Month & Day Header */}
                      <div style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#fafafb' }}>
                        {/* Month labels */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', padding: '4px 10px', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ gridColumn: 'span 3' }}>November</span>
                          <span style={{ gridColumn: 'span 10', paddingLeft: '6px' }}>December</span>
                        </div>

                        {/* Day numbers */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textAlign: 'center', padding: '4px 10px', alignItems: 'center' }}>
                          <span>28</span><span>29</span><span>30</span>
                          <span style={{ display: 'flex', justifyContent: 'center' }}>
                            <span style={{ backgroundColor: '#ef4444', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800 }}>1</span>
                          </span>
                          <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                        </div>
                      </div>

                      {/* Long Vertical Red Day-1 Line */}
                      <div style={{
                        position: 'absolute',
                        left: 'calc(3 / 13 * 100% + 22px)',
                        top: '52px',
                        bottom: 0,
                        width: '1.5px',
                        backgroundColor: '#ef4444',
                        zIndex: 10,
                        pointerEvents: 'none'
                      }} />

                      {/* Workload Heatmap Area */}
                      <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                        {/* Block 1 (Dec 1-4 Overcapacity Block) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {/* 115% Alert Banner */}
                          <div style={{ backgroundColor: '#ef4444', color: '#ffffff', borderRadius: '4px', padding: '5px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 800 }}>
                            <span>115%</span>
                            <span>54h /40h</span>
                          </div>

                          {/* Capacity indicators pills */}
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {['+1h', '+1h', '+1h', '+4h', '+4h'].map((pill, idx) => (
                              <span key={idx} style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px' }}>
                                {pill}
                              </span>
                            ))}
                          </div>

                          {/* Workload heatmap bar */}
                          <div style={{ backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '4px', padding: '5px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', fontWeight: 800 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>🏆</span>
                              <span>Workload heatmap</span>
                            </div>
                            <span>24h</span>
                          </div>

                          {/* Green segment bar */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                              <div key={i} style={{ height: '8px', backgroundColor: '#10b981', borderRadius: '3px' }} />
                            ))}
                          </div>

                          {/* Task Cards row */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', color: '#0369a1', borderRadius: '4px', padding: '4px 8px', fontSize: '0.68rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>🪲</span>
                              <span>Broken side... 24h</span>
                            </div>
                            <div style={{ backgroundColor: '#ede9fe', border: '1px solid #ddd6fe', color: '#6d28d9', borderRadius: '4px', padding: '4px 8px', fontSize: '0.68rem', fontWeight: 700 }}>
                              Design... 16h
                            </div>
                          </div>

                          {/* Secondary capacity pills */}
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {['+1h', '+1h', '+1h'].map((pill, idx) => (
                              <span key={idx} style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px' }}>
                                {pill}
                              </span>
                            ))}
                          </div>

                          {/* Forms 3.0 peach card */}
                          <div style={{ backgroundColor: '#ffedd5', border: '1px solid #fed7aa', color: '#c2410c', borderRadius: '4px', padding: '4px 8px', fontSize: '0.68rem', fontWeight: 700, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid #c2410c' }} />
                            <span>Forms 3.0 &nbsp; 3h</span>
                          </div>
                        </div>

                        {/* Block 2 (Dec 5-10 Full Capacity Block) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {/* 100% Green Banner */}
                          <div style={{ backgroundColor: '#10b981', color: '#ffffff', borderRadius: '4px', padding: '5px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 800 }}>
                            <span>100%</span>
                            <span>70h</span>
                          </div>

                          {/* Green segment bar */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} style={{ height: '8px', backgroundColor: '#10b981', borderRadius: '3px' }} />
                            ))}
                          </div>

                          {/* Cover Image task card */}
                          <div style={{ backgroundColor: '#ccfbf1', border: '1px solid #99f6e4', color: '#0f766e', borderRadius: '6px', padding: '6px 10px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>📞</span>
                              <span>📄</span>
                              <span>Cover image</span>
                            </div>
                            <span>40h</span>
                          </div>

                          {/* Green segment bar */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} style={{ height: '8px', backgroundColor: '#10b981', borderRadius: '3px' }} />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Gantt Timeline Bars (Aligned with Projects) */}
                      <div style={{ padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, backgroundColor: '#ffffff' }}>
                        {/* Task 1 Gantt Bar: Target Audience Analysis */}
                        <div style={{ position: 'relative', height: '26px' }}>
                          <div style={{
                            position: 'absolute',
                            left: 'calc(3 / 13 * 100% + 22px)',
                            width: '42%',
                            backgroundColor: '#f5d0fe',
                            border: '1px solid #e879f9',
                            borderRadius: '6px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '0 8px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#86198f',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                          }}>
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=24&h=24&fit=crop" style={{ width: '16px', height: '16px', borderRadius: '50%' }} alt="" />
                            <span>Target Audience Analysis</span>
                          </div>
                        </div>

                        {/* Task 2 Gantt Bar: Campaign Objectives */}
                        <div style={{ position: 'relative', height: '26px' }}>
                          <div style={{
                            position: 'absolute',
                            left: 'calc(4 / 13 * 100% + 22px)',
                            width: '42%',
                            backgroundColor: '#dbeafe',
                            border: '1px solid #93c5fd',
                            borderRadius: '6px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '0 8px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#1e40af',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                          }}>
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop" style={{ width: '16px', height: '16px', borderRadius: '50%' }} alt="" />
                            <span>Campaign Objectives</span>
                          </div>
                        </div>

                        {/* Task 3 Gantt Bar: Ad Placement Strategy */}
                        <div style={{ position: 'relative', height: '26px' }}>
                          <div style={{
                            position: 'absolute',
                            left: 'calc(6 / 13 * 100% + 22px)',
                            width: '32%',
                            backgroundColor: '#bfdbfe',
                            border: '1px solid #60a5fa',
                            borderRadius: '6px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '0 8px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#1d4ed8',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                          }}>
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=24&h=24&fit=crop" style={{ width: '16px', height: '16px', borderRadius: '50%' }} alt="" />
                            <span>Ad Placement Strategy</span>
                          </div>
                        </div>

                        {/* Task 4 Gantt Bar: Analytics and Tracking */}
                        <div style={{ position: 'relative', height: '26px' }}>
                          <div style={{
                            position: 'absolute',
                            left: 'calc(9 / 13 * 100% + 22px)',
                            width: '18%',
                            backgroundColor: '#fed7aa',
                            border: '1px solid #fb923c',
                            borderRadius: '6px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '0 8px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#9a3412',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                          }}>
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=24&h=24&fit=crop" style={{ width: '16px', height: '16px', borderRadius: '50%' }} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* BOTTOM BRAND LOGO BAR: TRUSTED BY THE BEST               */}
        {/* ======================================================== */}
        <div style={{
          marginTop: '60px',
          paddingTop: '32px',
          borderTop: '1px solid #eaebf2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '30px'
        }}>
          <span style={{
            fontSize: '0.76rem',
            fontWeight: 800,
            color: '#94a3b8',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}>
            TRUSTED BY THE BEST
          </span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '36px',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#334155',
            opacity: 0.8
          }}>
            <span>Kraft Heinz</span>
            <span>Deloitte.</span>
            <span>Pfizer</span>
            <span>Adobe</span>
            <span>amazon</span>
            <span>NVIDIA</span>
            <span>wayfair</span>
            <span>verizon</span>
            <span>Spotify</span>
            <span>Stanford</span>
          </div>
        </div>

      </div>
    </section>
  );
};
