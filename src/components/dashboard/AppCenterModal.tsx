import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Check,
  ExternalLink,
  Sparkles,
  SlidersHorizontal,
  Plus,
  Settings,
  CheckCircle2,
  Calendar,
  Layers,
  MessageSquare,
  FileText,
  Video,
  Database,
  Code2,
  GitBranch,
  FolderGit2,
  Share2
} from 'lucide-react';

export interface AppIntegration {
  id: string;
  name: string;
  category: string;
  description: string;
  iconBg: string;
  iconColor: string;
  initials: string;
  connected: boolean;
  featured?: boolean;
  pillBadge?: string;
}

const DEFAULT_INTEGRATIONS: AppIntegration[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'Calendars',
    description: 'Sync your tasks with Google Calendar in real-time. Schedule time blocks and avoid double bookings.',
    iconBg: '#4285f4',
    iconColor: '#ffffff',
    initials: 'GC',
    connected: false,
    featured: true,
    pillBadge: 'Meet Scheduler Active'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'Cloud Storage',
    description: 'Browse, attach, and create Google Docs, Sheets, and Slides directly within your ClickUp tasks.',
    iconBg: '#34a853',
    iconColor: '#ffffff',
    initials: 'GD',
    connected: false,
    featured: true
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Create tasks directly from Slack messages, receive notifications, and unfurl ClickUp task links.',
    iconBg: '#4a154b',
    iconColor: '#ffffff',
    initials: 'SL',
    connected: false,
    featured: true
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Development',
    description: 'Link pull requests, branch commits, and issue tracking directly with your ClickUp sprint backlog.',
    iconBg: '#24292e',
    iconColor: '#ffffff',
    initials: 'GH',
    connected: false,
    featured: true
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'Design',
    description: 'Embed live interactive Figma files and prototypes directly into tasks and whiteboard canvases.',
    iconBg: '#f24e1e',
    iconColor: '#ffffff',
    initials: 'FG',
    connected: false,
    featured: true
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'Communication',
    description: 'Start and schedule instant Zoom meetings right from tasks and channel chat threads.',
    iconBg: '#2d8cff',
    iconColor: '#ffffff',
    initials: 'ZM',
    connected: false
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    category: 'CRM & Sales',
    description: 'Sync deals, contacts, and companies between HubSpot and ClickUp custom CRM pipelines.',
    iconBg: '#ff7a59',
    iconColor: '#ffffff',
    initials: 'HS',
    connected: false
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'Cloud Storage',
    description: 'Attach files from Dropbox directly to tasks and share cloud files without leaving ClickUp.',
    iconBg: '#0061ff',
    iconColor: '#ffffff',
    initials: 'DB',
    connected: false
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Cloud Storage',
    description: 'Import databases and synchronize knowledge base documents with ClickUp Docs & Wikis.',
    iconBg: '#000000',
    iconColor: '#ffffff',
    initials: 'NO',
    connected: false
  },
  {
    id: 'jira',
    name: 'Jira Software',
    category: 'Development',
    description: 'Two-way synchronization for Jira issues, epics, sprint burndowns, and engineering workflows.',
    iconBg: '#0052cc',
    iconColor: '#ffffff',
    initials: 'JR',
    connected: false
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    category: 'Communication',
    description: 'Share task previews, set up notification webhooks, and collaborate inside MS Teams channels.',
    iconBg: '#6264a7',
    iconColor: '#ffffff',
    initials: 'MS',
    connected: false
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'CRM & Sales',
    description: 'Track customer lifetime values, subscription statuses, and invoice payment updates in tasks.',
    iconBg: '#635bff',
    iconColor: '#ffffff',
    initials: 'ST',
    connected: false
  }
];

export const AppCenterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [apps, setApps] = useState<AppIntegration[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_connected_apps_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_INTEGRATIONS;
  });

  const [activeTab, setActiveTab] = useState<'all' | 'disconnected' | 'connected'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('clickup_connected_apps_v1', JSON.stringify(apps));
    } catch {}
  }, [apps]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleConnect = (appId: string) => {
    const target = apps.find(a => a.id === appId);
    if (!target) return;
    if (appId === 'google-calendar') {
      showToast('Google Meet scheduler is active in Planner! Two-way sync requires custom Google Cloud credentials.');
      return;
    }
    showToast(`${target.name} integration directory listing. Direct OAuth sync requires enterprise API keys.`);
  };

  const connectedCount = apps.filter(a => a.connected).length;

  const categories = [
    'All',
    'Featured',
    'Analytics & Reporting',
    'Calendars',
    'Cloud Storage',
    'Communication',
    'CRM & Sales',
    'Design',
    'Development',
    'MCP & AI Tools',
    'ClickApps'
  ];

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'connected' && !app.connected) return false;
    if (activeTab === 'disconnected' && app.connected) return false;

    if (activeCategory === 'Featured' && !app.featured) return false;
    if (activeCategory !== 'All' && activeCategory !== 'Featured' && app.category !== activeCategory) return false;

    return true;
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3900
    }}>
      <div style={{
        width: '920px',
        maxHeight: '88vh',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Screenshot 8 1:1 Top Header */}
        <div style={{
          padding: '20px 24px 16px 24px',
          borderBottom: '1px solid #eaebf0',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Layers size={18} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  App Center
                </h2>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b' }}>
                  Connect your favorite tools, automate workflows, and empower ClickUp Brain
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Search bar & Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              flex: 1
            }}>
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search apps and integrations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.84rem',
                  color: '#1e293b',
                  width: '100%'
                }}
              />
            </div>

            {/* Top Tabs: All Apps, Disconnected, Connected (1) */}
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                style={{
                  border: 'none',
                  background: activeTab === 'all' ? '#ffffff' : 'transparent',
                  color: activeTab === 'all' ? '#0f172a' : '#64748b',
                  fontWeight: activeTab === 'all' ? 700 : 500,
                  fontSize: '0.8rem',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                All Apps ({apps.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('disconnected')}
                style={{
                  border: 'none',
                  background: activeTab === 'disconnected' ? '#ffffff' : 'transparent',
                  color: activeTab === 'disconnected' ? '#0f172a' : '#64748b',
                  fontWeight: activeTab === 'disconnected' ? 700 : 500,
                  fontSize: '0.8rem',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'disconnected' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                Disconnected
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('connected')}
                style={{
                  border: 'none',
                  background: activeTab === 'connected' ? '#ffffff' : 'transparent',
                  color: activeTab === 'connected' ? '#0f172a' : '#64748b',
                  fontWeight: activeTab === 'connected' ? 700 : 500,
                  fontSize: '0.8rem',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'connected' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                Connected ({connectedCount})
              </button>
            </div>
          </div>

          {/* Screenshot 8 Chips Row: Brain² 45, Super Agents 45, Automations 6, Search 14, Commands 21 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { label: 'Brain²', count: '45', color: '#ec4899' },
              { label: 'Super Agents', count: '45', color: '#7c3aed' },
              { label: 'Automations', count: '6', color: '#10b981' },
              { label: 'Search', count: '14', color: '#0ea5e9' },
              { label: 'Commands', count: '21', color: '#f59e0b' }
            ].map(chip => {
              const isSelected = selectedPill === chip.label;
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setSelectedPill(isSelected ? null : chip.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: isSelected ? chip.color : '#e2e8f0',
                    backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                    color: isSelected ? chip.color : '#475569',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Sparkles size={12} color={chip.color} />
                  <span>{chip.label}</span>
                  <span style={{
                    fontSize: '0.68rem',
                    backgroundColor: '#f1f5f9',
                    padding: '1px 5px',
                    borderRadius: '8px',
                    color: '#64748b'
                  }}>
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Body Layout: Left Categories + Main App Cards Grid */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Categories Sidebar */}
          <aside style={{
            width: '200px',
            backgroundColor: '#fafbfc',
            borderRight: '1px solid #eaebf0',
            padding: '14px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            overflowY: 'auto',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', padding: '4px 8px', marginBottom: '4px' }}>
              Categories
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeCategory === cat ? '#f1f5f9' : 'transparent',
                  color: activeCategory === cat ? '#0f172a' : '#475569',
                  fontWeight: activeCategory === cat ? 700 : 500,
                  fontSize: '0.8rem',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <span>{cat}</span>
                {cat === 'All' && <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{apps.length}</span>}
              </button>
            ))}
          </aside>

          {/* Main Apps Grid */}
          <main style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#fcfcfd' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#334155' }}>
                {activeCategory} Integrations ({filteredApps.length})
              </span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                All integrations include two-way sync
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '14px',
              paddingBottom: '20px'
            }}>
              {filteredApps.map(app => (
                <div
                  key={app.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                  }}
                >
                  <div>
                    {/* Header: App icon + title + category */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: app.iconBg,
                          color: app.iconColor,
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}>
                          {app.initials}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                            {app.name}
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {app.category}
                          </span>
                        </div>
                      </div>

                      {app.connected && (
                        <span style={{
                          backgroundColor: '#f0fdf4',
                          color: '#16a34a',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <Check size={11} strokeWidth={3} />
                          Connected
                        </span>
                      )}
                    </div>

                    <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', lineHeight: 1.45 }}>
                      {app.description}
                    </p>
                  </div>

                  {/* Footer button */}
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {app.featured ? '⭐ Featured tool' : 'ClickUp Verified'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleConnect(app.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: app.connected ? '1px solid #cbd5e1' : 'none',
                        backgroundColor: app.connected ? '#ffffff' : '#0f172a',
                        color: app.connected ? '#334155' : '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: app.connected ? 'none' : '0 2px 6px rgba(15, 23, 42, 0.15)'
                      }}
                    >
                      {app.connected ? (
                        <>
                          <Settings size={12} />
                          <span>Manage</span>
                        </>
                      ) : (
                        <>
                          <Plus size={13} />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

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
            zIndex: 4200
          }}>
            <CheckCircle2 size={16} color="#22c55e" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
