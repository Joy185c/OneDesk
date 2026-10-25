import React, { useState } from 'react';
import {
  Folder,
  CheckCircle2,
  Search,
  Plus,
  Star,
  Share2,
  MoreHorizontal,
  ChevronDown,
  FileText,
  Bookmark,
  Clock,
  Layers,
  ArrowUpRight,
  ListFilter,
  Users,
  Sparkles,
  ExternalLink,
  Kanban,
  Calendar,
  BarChart3
} from 'lucide-react';
import { TaskItem } from '../../types';

export const SpacesOverviewView: React.FC<{
  tasks: TaskItem[];
  currentSpaceName?: string;
  onSelectViewTab?: (tab: 'overview' | 'board' | 'list' | 'docs') => void;
  onOpenNewTaskModal?: () => void;
}> = ({
  tasks,
  currentSpaceName = 'Sales CRM',
  onSelectViewTab,
  onOpenNewTaskModal
}) => {
  const [activeSpaceTab, setActiveSpaceTab] = useState<'overview' | 'list' | 'board' | 'calendar' | 'docs'>('overview');
  const [isStarred, setIsStarred] = useState(true);
  const [spacesSearch, setSpacesSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const spacesList = [
    { id: 's-1', name: 'Sales CRM', count: tasks.length || 4, color: '#7c3aed', active: true },
    { id: 's-2', name: 'Team Space', count: 12, color: '#0ea5e9' },
    { id: 's-3', name: 'Marketing & Growth', count: 8, color: '#10b981' }
  ];

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      {/* 1. Sub-Sidebar (Screenshot 2 1:1) */}
      <aside style={{
        width: '230px',
        backgroundColor: '#fafbfc',
        borderRight: '1px solid #eaebf0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 12px',
        flexShrink: 0
      }}>
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Layers size={14} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a' }}>Spaces</span>
            </div>

            <button
              onClick={() => showToast('Create new Space or Folder')}
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Plus size={12} />
              <span>Create</span>
            </button>
          </div>

          {/* Quick Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '6px 10px',
            marginBottom: '14px'
          }}>
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search spaces..."
              value={spacesSearch}
              onChange={e => setSpacesSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.8rem',
                width: '100%',
                color: '#1e293b'
              }}
            />
          </div>

          {/* All Tasks Link */}
          <div
            onClick={() => {
              if (onSelectViewTab) onSelectViewTab('list');
              showToast('Viewing All Tasks across workspace');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '12px'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={15} color="#64748b" />
              <span>All Tasks</span>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{tasks.length}</span>
          </div>

          {/* Space Accordion Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                Space
              </span>
              <ChevronDown size={13} color="#94a3b8" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {spacesList.map(s => (
                <div
                  key={s.id}
                  onClick={() => showToast(`Switched space to "${s.name}"`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: '8px',
                    backgroundColor: s.active ? '#f5f3ff' : 'transparent',
                    color: s.active ? '#7c3aed' : '#475569',
                    fontWeight: s.active ? 700 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => { if (!s.active) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={e => { if (!s.active) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: s.color }} />
                    <span>{s.name}</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{s.count}</span>
                </div>
              ))}

              <div
                onClick={() => showToast('New Space Creator modal loaded')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  color: '#64748b',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Plus size={13} />
                <span>New Space</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Helper */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '2px' }}>
            Multi-Space Pipeline
          </span>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>
            Spaces allow teams to separate CRM, Sprints, and Docs independently.
          </p>
        </div>
      </aside>

      {/* 2. Main Space Overview Area (Screenshot 2 1:1) */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflowY: 'auto' }}>
        {/* Top Space Bar with Star & Share */}
        <div style={{
          padding: '14px 28px 0 28px',
          borderBottom: '1px solid #eaebf0',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                backgroundColor: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 900
              }}>
                S
              </div>
              <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{currentSpaceName}</span>
                <ChevronDown size={16} color="#64748b" style={{ cursor: 'pointer' }} />
              </h1>

              <button
                onClick={() => {
                  setIsStarred(!isStarred);
                  showToast(isStarred ? 'Removed from favorites' : 'Added to favorites ⭐');
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: isStarred ? '#f59e0b' : '#cbd5e1' }}
              >
                <Star size={16} fill={isStarred ? '#f59e0b' : 'none'} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => showToast('Space shared with workspace team')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <Share2 size={13} />
                <span>Share</span>
              </button>

              <button
                onClick={() => showToast('Space settings and permissions')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* View Tabs: Overview, List, Board, Calendar, Docs, + View */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {[
              { id: 'overview', label: 'Overview', icon: <Layers size={14} /> },
              { id: 'list', label: 'List', icon: <CheckCircle2 size={14} /> },
              { id: 'board', label: 'Board', icon: <Kanban size={14} /> },
              { id: 'calendar', label: 'Calendar', icon: <Calendar size={14} /> },
              { id: 'docs', label: 'Docs', icon: <FileText size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveSpaceTab(tab.id as any);
                  if (tab.id !== 'overview' && onSelectViewTab) {
                    onSelectViewTab(tab.id as any);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 0',
                  border: 'none',
                  borderBottom: activeSpaceTab === tab.id ? '2px solid #7c3aed' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: activeSpaceTab === tab.id ? '#7c3aed' : '#64748b',
                  fontWeight: activeSpaceTab === tab.id ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}

            <button
              onClick={() => showToast('Added custom Gantt and Timeline views')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 0',
                border: 'none',
                background: 'none',
                color: '#94a3b8',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <Plus size={13} />
              <span>View</span>
            </button>
          </div>
        </div>

        {/* Space Overview Body (Screenshot 2 1:1) */}
        <div style={{ padding: '28px', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Space Gradient Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
            border: '1px solid #ddd6fe',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>💼</span>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                  {currentSpaceName}
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#5b21b6', maxWidth: '580px', lineHeight: 1.5 }}>
                End-to-end sales pipeline, lead nurturing, deal tracking, and enterprise account management synced across all workspace boards.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => onOpenNewTaskModal ? onOpenNewTaskModal() : showToast('New task opened')}
                style={{
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
                }}
              >
                <Plus size={15} />
                <span>New Task</span>
              </button>
            </div>
          </div>

          {/* Cards Grid: Recent, Docs, Bookmarks, Folders (Screenshot 2 1:1) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '18px'
          }}>
            {/* 1. Recent Card */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #eaebf0',
              borderRadius: '14px',
              padding: '18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#7c3aed" />
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>Recent Activity</h3>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Updated real-time</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tasks.slice(0, 4).map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      if (onSelectViewTab) onSelectViewTab('board');
                      showToast(`Viewing ${t.title}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={14} color="#7c3aed" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>{t.title}</span>
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      backgroundColor: t.status === 'COMPLETE' ? '#f0fdf4' : '#f5f3ff',
                      color: t.status === 'COMPLETE' ? '#16a34a' : '#7c3aed'
                    }}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Docs Card */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #eaebf0',
              borderRadius: '14px',
              padding: '18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="#0284c7" />
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>Pinned Docs & Wikis</h3>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>3 Docs</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { title: 'Sales Playbook 2026', desc: 'Standard operating procedures for outbound leads' },
                  { title: 'Discovery Call Script', desc: 'Qualification questions for enterprise prospects' },
                  { title: 'Client Handoff SOP', desc: 'Transition checklist from Sales to Customer Success' }
                ].map(d => (
                  <div
                    key={d.title}
                    onClick={() => {
                      if (onSelectViewTab) onSelectViewTab('docs');
                      showToast(`Opened "${d.title}"`);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', marginBottom: '2px' }}>
                      📄 {d.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {d.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Bookmarks Card */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #eaebf0',
              borderRadius: '14px',
              padding: '18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bookmark size={16} color="#f59e0b" />
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>Bookmarks</h3>
                </div>
                <button
                  onClick={() => showToast('Added bookmark')}
                  style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Q4 Revenue Forecasting Sheet', url: 'sheets.google.com/q4-forecast' },
                  { label: 'HubSpot Live Deals Pipeline', url: 'app.hubspot.com/sales-crm' },
                  { label: 'Figma Marketing Collateral', url: 'figma.com/file/crm-deck' }
                ].map(b => (
                  <div
                    key={b.label}
                    onClick={() => showToast(`Opening ${b.label}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ExternalLink size={13} color="#64748b" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>{b.label}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{b.url}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Folders Card */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #eaebf0',
              borderRadius: '14px',
              padding: '18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Folder size={16} color="#7c3aed" />
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>Folders & Lists</h3>
                </div>
                <button
                  onClick={() => showToast('Create new Folder in Space')}
                  style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Lead Intake & Qualification', tasksCount: 3, color: '#3b82f6' },
                  { name: 'Product Demos & Scoping', tasksCount: 2, color: '#ec4899' },
                  { name: 'Deal Closing & Contracts', tasksCount: 4, color: '#10b981' }
                ].map(f => (
                  <div
                    key={f.name}
                    onClick={() => {
                      if (onSelectViewTab) onSelectViewTab('board');
                      showToast(`Opened folder "${f.name}"`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Folder size={14} color={f.color} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{f.name}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{f.tasksCount} active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Live Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '8px',
          fontSize: '0.84rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          zIndex: 4400
        }}>
          <CheckCircle2 size={16} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
