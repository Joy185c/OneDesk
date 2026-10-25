import React, { useState, useEffect } from 'react';
import { 
  Inbox as InboxIcon, 
  Activity, 
  Clock, 
  CheckCheck, 
  Settings, 
  Check, 
  SlidersHorizontal, 
  UserPlus, 
  Search, 
  Trash2, 
  ExternalLink, 
  Send, 
  Bell, 
  Filter,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { TaskItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface InboxNotification {
  id: string;
  sender: string;
  senderAvatar?: string;
  isAi?: boolean;
  action: string;
  taskTitle?: string;
  taskId?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  tab: 'primary' | 'other' | 'later' | 'cleared';
  replies?: Array<{ sender: string; text: string; time: string }>;
}

interface InboxViewProps {
  tasks: TaskItem[];
  onOpenTask: (task: TaskItem) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenInvite?: () => void;
}

const INITIAL_NOTIFICATIONS: InboxNotification[] = [
  {
    id: 'notif-1',
    sender: 'Alex Rivera',
    senderAvatar: 'AR',
    action: 'mentioned you in task',
    taskTitle: 'Enterprise License Agreement',
    taskId: '1',
    content: 'Please verify the payment terms and customer indemnity clause before the 2:00 PM stakeholder review.',
    timestamp: '10m ago',
    isRead: false,
    tab: 'primary',
    replies: []
  },
  {
    id: 'notif-2',
    sender: 'ClickUp Brain AI',
    isAi: true,
    action: 'generated weekly sprint insights for',
    taskTitle: 'Sales CRM Space',
    taskId: '2',
    content: 'Weekly velocity: 5 tasks completed this week, 2 awaiting client sign-off. High probability of hitting Q4 deal targets.',
    timestamp: '35m ago',
    isRead: false,
    tab: 'primary'
  },
  {
    id: 'notif-3',
    sender: 'Sarah Miller',
    senderAvatar: 'SM',
    action: 'assigned a high priority task to you:',
    taskTitle: 'Inbound Lead Qualification Workflow',
    taskId: '3',
    content: 'New enterprise lead from Acme Corp requesting automated webhook integration and pricing breakdown.',
    timestamp: '2h ago',
    isRead: true,
    tab: 'other'
  },
  {
    id: 'notif-4',
    sender: 'Supabase Realtime Sync',
    senderAvatar: 'DB',
    action: 'synchronized workspace schema',
    taskTitle: 'PostgreSQL Database',
    content: 'All 7 active tasks, workspace members, and sprint logs are synced with zero conflict.',
    timestamp: '5h ago',
    isRead: true,
    tab: 'later'
  },
  {
    id: 'notif-5',
    sender: 'Alex Chen',
    senderAvatar: 'AC',
    action: 'commented on',
    taskTitle: 'Landing Page Hero 3.0',
    taskId: '4',
    content: 'The new dark navigation rail and glowing home orb match the ClickUp 3.0 specs perfectly.',
    timestamp: 'Yesterday',
    isRead: true,
    tab: 'cleared'
  }
];

export const InboxView: React.FC<InboxViewProps> = ({ 
  tasks, 
  onOpenTask, 
  onNavigateToTab,
  onOpenInvite 
}) => {
  const { user } = useAuth();
  const currentUserName = user?.name || 'You';
  const storageKey = `clickup_inbox_notifs_${user?.id || 'guest'}`;

  const [activeTab, setActiveTab] = useState<'primary' | 'other' | 'later' | 'cleared'>('primary');
  const [notifications, setNotifications] = useState<InboxNotification[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: InboxNotification[] = JSON.parse(saved);
        return parsed.filter(n => !n.sender.includes('Sarah Miller'));
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    } catch {}
  }, [notifications, storageKey]);
  const [showNotificationList, setShowNotificationList] = useState<boolean>(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'mentions'>('all');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [settingsOpen, setSettingsOpen] = useState(false);

  const currentTabNotifications = notifications.filter(n => {
    if (n.tab !== activeTab) return false;
    if (filterType === 'unread') return !n.isRead;
    if (filterType === 'mentions') return n.action.includes('mentioned');
    return true;
  });

  const handleClearAll = () => {
    setNotifications(prev => prev.map(n => n.tab === activeTab ? { ...n, tab: 'cleared' } : n));
  };

  const handleRestore = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, tab: 'primary' } : n));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const handleSendReply = (id: string) => {
    const text = replyTextMap[id];
    if (!text || !text.trim()) return;

    setNotifications(prev => prev.map(n => {
      if (n.id !== id) return n;
      const existing = n.replies || [];
      return {
        ...n,
        isRead: true,
        replies: [...existing, { sender: `${currentUserName} (You)`, text: text.trim(), time: 'Just now' }]
      };
    }));

    setReplyTextMap(prev => ({ ...prev, [id]: '' }));
  };

  const handleOpenLinkedTask = (taskId?: string) => {
    if (!taskId) return;
    const task = tasks.find(t => t.id === taskId) || tasks[0];
    if (task) onOpenTask(task);
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* 1. Top Tabs Bar (Matching Screenshot 1:1) */}
      <div style={{
        height: '46px',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
        backgroundColor: '#ffffff'
      }}>
        {/* Left: Primary, Other, Later, Cleared Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', height: '100%' }}>
          {/* Primary Tab */}
          <div
            onClick={() => setActiveTab('primary')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '100%',
              cursor: 'pointer',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'primary' ? 700 : 500,
              color: activeTab === 'primary' ? '#0f172a' : '#64748b',
              borderBottom: activeTab === 'primary' ? '2px solid #0f172a' : '2px solid transparent',
              transition: 'all 0.15s ease',
              padding: '0 4px'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'primary' ? '#0f172a' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
            <span>Primary</span>
          </div>

          {/* Other Tab */}
          <div
            onClick={() => setActiveTab('other')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '100%',
              cursor: 'pointer',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'other' ? 700 : 500,
              color: activeTab === 'other' ? '#0f172a' : '#64748b',
              borderBottom: activeTab === 'other' ? '2px solid #0f172a' : '2px solid transparent',
              transition: 'all 0.15s ease',
              padding: '0 4px'
            }}
          >
            <Activity size={15} color={activeTab === 'other' ? '#0f172a' : '#64748b'} />
            <span>Other</span>
          </div>

          {/* Later Tab */}
          <div
            onClick={() => setActiveTab('later')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '100%',
              cursor: 'pointer',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'later' ? 700 : 500,
              color: activeTab === 'later' ? '#0f172a' : '#64748b',
              borderBottom: activeTab === 'later' ? '2px solid #0f172a' : '2px solid transparent',
              transition: 'all 0.15s ease',
              padding: '0 4px'
            }}
          >
            <Clock size={15} color={activeTab === 'later' ? '#0f172a' : '#64748b'} />
            <span>Later</span>
          </div>

          {/* Cleared Tab */}
          <div
            onClick={() => setActiveTab('cleared')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '100%',
              cursor: 'pointer',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'cleared' ? 700 : 500,
              color: activeTab === 'cleared' ? '#0f172a' : '#64748b',
              borderBottom: activeTab === 'cleared' ? '2px solid #0f172a' : '2px solid transparent',
              transition: 'all 0.15s ease',
              padding: '0 4px'
            }}
          >
            <CheckCheck size={16} color={activeTab === 'cleared' ? '#0f172a' : '#64748b'} />
            <span>Cleared</span>
          </div>
        </div>

        {/* Right: Settings gear & Clear all */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}
              title="Inbox Settings"
            >
              <Settings size={15} />
            </span>

            {settingsOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '140%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                width: '180px',
                zIndex: 200,
                fontSize: '0.78rem'
              }}>
                <div 
                  onClick={() => { setShowNotificationList(!showNotificationList); setSettingsOpen(false); }}
                  style={{ padding: '6px 8px', cursor: 'pointer', borderRadius: '4px', color: '#1e293b' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {showNotificationList ? 'Show Empty State' : 'Show Sample Notifications'}
                </div>
                <div 
                  onClick={() => { setFilterType('all'); setSettingsOpen(false); }}
                  style={{ padding: '6px 8px', cursor: 'pointer', borderRadius: '4px', color: '#1e293b' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Reset Filter
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleClearAll}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#475569'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <Check size={14} />
            <span>Clear all</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Toolbar: Filter Button */}
      <div style={{
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            {/* Filter 3-line icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="6" y1="12" x2="18" y2="12" />
              <line x1="9" y1="17" x2="15" y2="17" />
            </svg>
            <span>Filter</span>
            {filterType !== 'all' && (
              <span style={{ backgroundColor: '#7c3aed', color: '#fff', fontSize: '0.62rem', padding: '1px 5px', borderRadius: '4px' }}>
                {filterType}
              </span>
            )}
          </button>

          {/* Filter dropdown */}
          {filterMenuOpen && (
            <div style={{
              position: 'absolute',
              left: 0,
              top: '115%',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              width: '160px',
              zIndex: 200,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              {[
                { id: 'all', label: 'All Notifications' },
                { id: 'unread', label: 'Unread Only' },
                { id: 'mentions', label: 'Mentions Only' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilterType(f.id as any);
                    setFilterMenuOpen(false);
                    setShowNotificationList(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    border: 'none',
                    background: filterType === f.id ? '#f5f3ff' : 'none',
                    borderRadius: '4px',
                    fontSize: '0.76rem',
                    color: filterType === f.id ? '#7c3aed' : '#334155',
                    fontWeight: filterType === f.id ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{f.label}</span>
                  {filterType === f.id && <Check size={12} color="#7c3aed" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Small toggle on right to preview notifications or empty state */}
        <button
          onClick={() => setShowNotificationList(!showNotificationList)}
          style={{
            background: 'none',
            border: 'none',
            color: '#7c3aed',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {showNotificationList ? 'Show Empty State View' : `View Notifications (${notifications.filter(n => n.tab === activeTab).length})`}
        </button>
      </div>

      {/* 3. Main Stage Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        alignItems: showNotificationList ? 'stretch' : 'center',
        justifyContent: showNotificationList ? 'flex-start' : 'center',
        padding: showNotificationList ? '10px 24px' : '0 24px',
        paddingBottom: '40px'
      }}>
        {/* EXACT CLICKUP SCREENSHOT EMPTY STATE */}
        {!showNotificationList ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            marginTop: '-40px'
          }}>
            {/* Person Icon Circle with Plus Badge */}
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              backgroundColor: '#f5f3ff',
              border: '1px solid #ede9fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: '16px'
            }}>
              {/* Silhouette outline */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>

              {/* Plus Badge on top right */}
              <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 900,
                border: '2px solid #ffffff'
              }}>
                +
              </div>
            </div>

            {/* Heading matching screenshot */}
            <h2 style={{
              margin: '0 0 6px 0',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.01em'
            }}>
              Looking to collaborate?
            </h2>

            {/* Subtitle matching screenshot */}
            <p style={{
              margin: '0 0 22px 0',
              fontSize: '0.86rem',
              color: '#64748b'
            }}>
              Collaboration is one invite away.
            </p>

            {/* Action button matching screenshot */}
            <button
              onClick={() => {
                if (onOpenInvite) {
                  onOpenInvite();
                } else {
                  alert('Open Invite modal');
                }
              }}
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 24px',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0f172a'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1e293b'}
            >
              Invite people
            </button>
          </div>
        ) : (
          /* NOTIFICATIONS LIST (When toggle clicked) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '820px', width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                {currentTabNotifications.length} items in {activeTab.toUpperCase()}
              </span>
              <button
                onClick={() => setShowNotificationList(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.76rem', cursor: 'pointer' }}
              >
                Back to Empty State
              </button>
            </div>

            {currentTabNotifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.84rem' }}>
                No notifications in this tab.
              </div>
            ) : (
              currentTabNotifications.map(n => (
                <div
                  key={n.id}
                  style={{
                    backgroundColor: n.isRead ? '#ffffff' : '#f8fafc',
                    border: '1px solid',
                    borderColor: n.isRead ? '#eaebf0' : '#cbd5e1',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: n.isRead ? 'none' : '0 2px 5px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: n.isAi ? '#ff72e5' : '#7c3aed',
                        color: '#ffffff',
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {n.senderAvatar || 'AI'}
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                        {n.sender}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {n.action}
                      </span>
                      {n.taskTitle && (
                        <span 
                          onClick={() => handleOpenLinkedTask(n.taskId)}
                          style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {n.taskTitle}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{n.timestamp}</span>
                      <button
                        onClick={() => handleToggleRead(n.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: n.isRead ? '#94a3b8' : '#7c3aed', fontSize: '0.72rem', fontWeight: 600 }}
                      >
                        {n.isRead ? 'Mark unread' : 'Mark read'}
                      </button>
                      {activeTab === 'cleared' ? (
                        <button
                          onClick={() => handleRestore(n.id)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#059669', fontSize: '0.72rem', fontWeight: 600 }}
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, tab: 'cleared' } : x))}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
                          title="Clear"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.4', paddingLeft: '32px' }}>
                    {n.content}
                  </div>

                  {/* Replies thread */}
                  {n.replies && n.replies.length > 0 && (
                    <div style={{ marginLeft: '32px', backgroundColor: '#f1f5f9', borderRadius: '6px', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {n.replies.map((r, i) => (
                        <div key={i} style={{ fontSize: '0.76rem', color: '#1e293b' }}>
                          <strong>{r.sender}:</strong> {r.text} <span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>({r.time})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Composer */}
                  <div style={{ marginLeft: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Reply to this notification..."
                      value={replyTextMap[n.id] || ''}
                      onChange={e => setReplyTextMap({ ...replyTextMap, [n.id]: e.target.value })}
                      onKeyDown={e => { if (e.key === 'Enter') handleSendReply(n.id); }}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.78rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      onClick={() => handleSendReply(n.id)}
                      style={{
                        backgroundColor: '#7c3aed',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
