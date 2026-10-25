import React, { useState } from 'react';
import { 
  BarChart3, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Lock, 
  Users, 
  MoreHorizontal, 
  ChevronDown, 
  ArrowUpDown, 
  ExternalLink,
  Sparkles,
  PieChart,
  TrendingUp,
  Activity,
  CheckCircle2,
  Calendar,
  X,
  Trash2,
  Share2
} from 'lucide-react';
import { TaskItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface DashboardItem {
  id: string;
  name: string;
  isPrivate: boolean;
  isFavorite: boolean;
  location: string;
  dateViewed: string;
  dateUpdated: string;
  owner: {
    name: string;
    avatar: string;
    initials: string;
    color: string;
  };
  sharing: {
    avatar: string;
    initials: string;
    color: string;
  };
}

const getDefaultDashboards = (name: string, initials: string): DashboardItem[] => [
  {
    id: 'dash-main',
    name: 'Dashboard',
    isPrivate: true,
    isFavorite: false,
    location: '--',
    dateViewed: '1 hour ago',
    dateUpdated: '1 hour ago',
    owner: {
      name,
      avatar: '',
      initials,
      color: '#059669'
    },
    sharing: {
      avatar: '',
      initials,
      color: '#059669'
    }
  }
];

interface DashboardHubViewProps {
  tasks: TaskItem[];
  onOpenNewTaskModal?: () => void;
}

export const DashboardHubView: React.FC<DashboardHubViewProps> = ({ tasks }) => {
  const { user } = useAuth();
  const currentUserName = user?.name || 'You';
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME';

  const [dashboards, setDashboards] = useState<DashboardItem[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_dashboards_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return getDefaultDashboards(currentUserName, userInitials);
  });

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'my' | 'shared' | 'private'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDashboardId, setActiveDashboardId] = useState<string | null>(null);
  const [isNewDashboardModalOpen, setIsNewDashboardModalOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [newDashboardPrivate, setNewDashboardPrivate] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateDashboard = (templateName?: string) => {
    const title = templateName || newDashboardName.trim() || 'New Dashboard';
    const newDash: DashboardItem = {
      id: 'dash-' + Date.now(),
      name: title,
      isPrivate: newDashboardPrivate,
      isFavorite: false,
      location: 'Sales CRM',
      dateViewed: 'Just now',
      dateUpdated: 'Just now',
      owner: {
        name: currentUserName,
        avatar: '',
        initials: userInitials,
        color: '#059669'
      },
      sharing: {
        avatar: '',
        initials: userInitials,
        color: '#059669'
      }
    };

    const updated = [newDash, ...dashboards];
    setDashboards(updated);
    try {
      localStorage.setItem('clickup_dashboards_v1', JSON.stringify(updated));
    } catch (e) {}

    setIsNewDashboardModalOpen(false);
    setNewDashboardName('');
    setActiveDashboardId(newDash.id);
    showToast(`Dashboard "${newDash.name}" created!`);
  };

  const handleDeleteDashboard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (dashboards.length <= 1) {
      showToast('At least one workspace dashboard must be kept.');
      return;
    }
    const updated = dashboards.filter(d => d.id !== id);
    setDashboards(updated);
    try {
      localStorage.setItem('clickup_dashboards_v1', JSON.stringify(updated));
    } catch (e) {}
    if (activeDashboardId === id) setActiveDashboardId(null);
    showToast('Dashboard deleted');
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = dashboards.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d);
    setDashboards(updated);
    try {
      localStorage.setItem('clickup_dashboards_v1', JSON.stringify(updated));
    } catch (e) {}
    showToast('Dashboard starred in favorites');
  };

  // Filtered dashboards
  const filteredDashboards = dashboards.filter(d => {
    if (activeSubTab === 'my') return true;
    if (activeSubTab === 'private') return d.isPrivate;
    if (activeSubTab === 'shared') return !d.isPrivate;
    return true;
  }).filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Active dashboard view details
  const currentOpenDashboard = dashboards.find(d => d.id === activeDashboardId);

  // If viewing an active dashboard detail
  if (currentOpenDashboard) {
    const completedTasks = tasks.filter(t => t.status === 'COMPLETE').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN PROGRESS').length;
    const todoTasks = tasks.filter(t => t.status === 'TODO').length;
    const reviewTasks = tasks.filter(t => t.status === 'REVIEW').length;
    const completionRate = Math.round((completedTasks / (tasks.length || 1)) * 100);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', backgroundColor: '#fafbfc', overflow: 'hidden' }}>
        {/* Top Header */}
        <div style={{
          padding: '12px 24px',
          borderBottom: '1px solid #eaebf0',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setActiveDashboardId(null)}
              style={{
                background: 'none',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '5px 10px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              ← Dashboards Hub
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} color="#7c3aed" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {currentOpenDashboard.name}
              </h2>
              {currentOpenDashboard.isPrivate && <Lock size={13} color="#94a3b8" />}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => showToast('Dashboard layout refreshed with live workspace data')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              Refresh Data
            </button>
            <button
              onClick={() => showToast('Card added to dashboard')}
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              + Add Card
            </button>
          </div>
        </div>

        {/* Live Dashboard Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '24px' }}>
            {/* Metric 1 */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #eaebf0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Completion Rate</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#16a34a', marginTop: '6px' }}>{completionRate}%</div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '4px' }}>{completedTasks} of {tasks.length} tasks resolved</div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '100px', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{ width: `${completionRate}%`, height: '100%', backgroundColor: '#16a34a', borderRadius: '100px' }} />
              </div>
            </div>

            {/* Metric 2 */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #eaebf0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Sprint Velocity</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#7c3aed', marginTop: '6px' }}>34 pts</div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '4px' }}>+18% compared to last cycle</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#7c3aed', fontWeight: 700, marginTop: '10px' }}>
                <TrendingUp size={14} /> 1.8 days avg cycle time
              </div>
            </div>

            {/* Metric 3 */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #eaebf0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Active Assignees</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0ea5e9', marginTop: '6px' }}>4 Members</div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '4px' }}>{currentUserName}, Priya Gupta, Sarah Chang, Alex Rivera</div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                {[userInitials, 'PG', 'SC', 'AR'].map((init, i) => (
                  <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: ['#059669', '#10b981', '#8b5cf6', '#7c3aed'][i], color: '#fff', fontSize: '0.66rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {init}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
            {/* Task Status Breakdown */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #eaebf0', padding: '20px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '16px' }}>Tasks by Status</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'TODO', count: todoTasks, color: '#64748b' },
                  { label: 'IN PROGRESS', count: inProgressTasks, color: '#2563eb' },
                  { label: 'REVIEW', count: reviewTasks, color: '#eab308' },
                  { label: 'COMPLETE', count: completedTasks, color: '#16a34a' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{item.count} tasks</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Team Insights */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #eaebf0', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '14px' }}>
                <Sparkles size={16} color="#7c3aed" />
                <span>AI Team Center Insights</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                ClickUp Brain² analysis indicates team momentum is optimal. All 4 active CRM lead opportunities have owners assigned and next steps scheduled.
              </p>
              <div style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '10px 14px', fontSize: '0.78rem', color: '#6d28d9', fontWeight: 600 }}>
                💡 Recommendation: Complete "Acme Corp Enterprise Deal" review before Friday to maintain sprint target.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: DASHBOARDS HUB (Matches Screenshot 1 1:1)
  // --------------------------------------------------------------------------
  return (
    <div style={{
      display: 'flex',
      flex: 1,
      height: '100%',
      backgroundColor: '#ffffff',
      overflow: 'hidden'
    }}>
      {/* Toast alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '0.82rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          zIndex: 3000
        }}>
          <CheckCircle2 size={16} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sub-Sidebar matching Screenshot 1 */}
      <div style={{
        width: '210px',
        backgroundColor: '#fafbfc',
        borderRight: '1px solid #eaebf0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '14px 10px',
        flexShrink: 0
      }}>
        <div>
          {/* Header row: Dashboards + button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '0 6px' }}>
            <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>Dashboards</span>
            <button
              onClick={() => setIsNewDashboardModalOpen(true)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Navigation Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '22px' }}>
            <div
              onClick={() => setActiveSubTab('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: activeSubTab === 'all' ? '#ebeef2' : 'transparent',
                color: '#0f172a',
                fontWeight: activeSubTab === 'all' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <BarChart3 size={15} color="#64748b" />
              <span>All Dashboards</span>
            </div>

            <div
              onClick={() => setActiveSubTab('my')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: activeSubTab === 'my' ? '#ebeef2' : 'transparent',
                color: '#475569',
                fontWeight: activeSubTab === 'my' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 800 }}>
                  J
                </div>
                <span>My Dashboards</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>1</span>
            </div>

            <div
              onClick={() => setActiveSubTab('shared')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: activeSubTab === 'shared' ? '#ebeef2' : 'transparent',
                color: '#475569',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <Users size={15} color="#64748b" />
              <span>Shared with me</span>
            </div>

            <div
              onClick={() => setActiveSubTab('private')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: activeSubTab === 'private' ? '#ebeef2' : 'transparent',
                color: '#475569',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={15} color="#64748b" />
                <span>Private</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>1</span>
            </div>
          </div>

          {/* Favorites Section matching Screenshot 1 */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', padding: '0 8px', marginBottom: '8px' }}>
              Favorites
            </div>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px dashed #cbd5e1',
              padding: '16px 8px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.3 }}>
                Star a Dashboard to see it here
              </span>
            </div>
          </div>

          {/* Recents Section matching Screenshot 1 */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', padding: '0 8px', marginBottom: '8px' }}>
              Recents
            </div>
            <div
              onClick={() => setActiveDashboardId(dashboards[0]?.id || null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                color: '#334155',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <BarChart3 size={14} color="#7c3aed" />
              <span style={{ fontWeight: 600 }}>Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area matching Screenshot 1 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Bar: Title & New Dashboard Button */}
        <div style={{
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #eaebf0'
        }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            All Dashboards
          </h1>

          <button
            onClick={() => setIsNewDashboardModalOpen(true)}
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>New Dashboard</span>
            <ChevronDown size={14} />
          </button>
        </div>

        <div style={{ padding: '20px 28px' }}>
          {/* Templates Section matching Screenshot 1 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '12px' }}>
              Templates
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {/* Card 1: Simple Dashboard */}
              <div
                onClick={() => handleCreateDashboard('Simple Dashboard')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaebf0',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#eaebf0'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>Simple Dashboard</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Manage &amp; prioritize tasks</div>
                </div>
              </div>

              {/* Card 2: AI Team Center */}
              <div
                onClick={() => handleCreateDashboard('AI Team Center')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaebf0',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#eaebf0'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>AI Team Center</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>View team activity with AI</div>
                </div>
              </div>

              {/* Card 3: Project Management (Business) */}
              <div
                onClick={() => handleCreateDashboard('Project Management')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaebf0',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0284c7'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#eaebf0'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>Project Management</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Analyze project progress and metrics</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#334155', color: '#ffffff', padding: '3px 8px', borderRadius: '100px' }}>
                  Business
                </span>
              </div>
            </div>
          </div>

          {/* Table Toolbar matching Screenshot 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <button
              onClick={() => showToast('Dashboards sorted by name')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                background: 'none',
                fontSize: '0.8rem',
                color: '#64748b',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ArrowUpDown size={14} />
              <span>Sort</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '4px 10px',
              width: '200px'
            }}>
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.8rem', width: '100%' }}
              />
            </div>
          </div>

          {/* Dashboards Table matching Screenshot 1 */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eaebf0', color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>
                <th style={{ padding: '8px 12px' }}>Name</th>
                <th style={{ padding: '8px 12px' }}>Location</th>
                <th style={{ padding: '8px 12px' }}>Date viewed ↓</th>
                <th style={{ padding: '8px 12px' }}>Date updated</th>
                <th style={{ padding: '8px 12px' }}>Owner</th>
                <th style={{ padding: '8px 12px' }}>Sharing</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>⊕</th>
              </tr>
            </thead>
            <tbody>
              {filteredDashboards.map(dash => (
                <tr
                  key={dash.id}
                  onClick={() => setActiveDashboardId(dash.id)}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BarChart3 size={16} color="#7c3aed" />
                      <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0f172a' }}>
                        {dash.name}
                      </span>
                      {dash.isPrivate && <Lock size={12} color="#94a3b8" />}
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.78rem', color: '#94a3b8' }}>
                    {dash.location}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.78rem', color: '#64748b' }}>
                    {dash.dateViewed}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.78rem', color: '#64748b' }}>
                    {dash.dateUpdated}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: dash.owner.color,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.62rem'
                    }}>
                      {dash.owner.initials}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: dash.sharing.color,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.62rem'
                    }}>
                      {dash.sharing.initials}
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      onClick={e => handleDeleteDashboard(dash.id, e)}
                      title="Options"
                      style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Dashboard Modal */}
      {isNewDashboardModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4000
        }}>
          <div style={{
            width: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Create Dashboard</h3>
              <button onClick={() => setIsNewDashboardModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Dashboard Name
              </label>
              <input
                type="text"
                placeholder="e.g. Executive Sprint Dashboard"
                value={newDashboardName}
                onChange={e => setNewDashboardName(e.target.value)}
                autoFocus
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '0.84rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>Make Private</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Only you can access this dashboard</div>
              </div>
              <input
                type="checkbox"
                checked={newDashboardPrivate}
                onChange={e => setNewDashboardPrivate(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#7c3aed' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setIsNewDashboardModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateDashboard()}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Create Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
