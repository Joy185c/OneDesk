import React, { useState, useEffect } from 'react';
import { 
  Reply, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare, 
  User, 
  Search, 
  Folder 
} from 'lucide-react';
import { TaskItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ReplyThread {
  id: string;
  taskTitle: string;
  taskId: string;
  spaceName: string;
  messages: Array<{
    id: string;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
    isCurrentUser?: boolean;
  }>;
  isResolved: boolean;
}

interface RepliesViewProps {
  tasks: TaskItem[];
  onOpenTask: (task: TaskItem) => void;
}

const getInitialThreads = (currentUserName: string, userInitials: string): ReplyThread[] => [
  {
    id: 'th-1',
    taskTitle: 'Enterprise License Agreement',
    taskId: '1',
    spaceName: 'Sales CRM',
    isResolved: false,
    messages: [
      {
        id: 'm-1',
        author: 'Sarah Miller',
        avatar: 'SM',
        content: `Hi ${currentUserName.split(' ')[0]}, did the customer agree to the annual upfront payment schedule?`,
        timestamp: 'Today at 10:14 AM'
      },
      {
        id: 'm-2',
        author: `${currentUserName} (You)`,
        avatar: userInitials,
        content: 'Yes, they approved the 1-year contract with NET 30 invoicing terms.',
        timestamp: 'Today at 10:20 AM',
        isCurrentUser: true
      },
      {
        id: 'm-3',
        author: 'Sarah Miller',
        avatar: 'SM',
        content: 'Awesome! Can you generate and attach the signed Docusign PDF?',
        timestamp: 'Today at 10:28 AM'
      }
    ]
  },
  {
    id: 'th-2',
    taskTitle: 'Landing Page Hero 3.0',
    taskId: '4',
    spaceName: 'Product & Design',
    isResolved: false,
    messages: [
      {
        id: 'm-4',
        author: 'Alex Chen',
        avatar: 'AC',
        content: 'The new glowing orb and gradient styling look fantastic. Should we test with 50% contrast on mobile?',
        timestamp: 'Yesterday at 4:45 PM'
      },
      {
        id: 'm-5',
        author: `${currentUserName} (You)`,
        avatar: userInitials,
        content: 'Yes, I added responsive breakpoints for viewport width under 768px.',
        timestamp: 'Yesterday at 5:12 PM',
        isCurrentUser: true
      }
    ]
  },
  {
    id: 'th-3',
    taskTitle: 'Supabase Real-Time Sync & WebSocket',
    taskId: '3',
    spaceName: 'Engineering',
    isResolved: true,
    messages: [
      {
        id: 'm-6',
        author: 'DevOps Bot',
        avatar: 'DB',
        content: 'Database migration complete: `workspaces`, `tasks`, `comments` synced.',
        timestamp: 'Oct 23 at 2:00 PM'
      },
      {
        id: 'm-7',
        author: `${currentUserName} (You)`,
        avatar: userInitials,
        content: 'Verified realtime subscription channel is active with zero drops.',
        timestamp: 'Oct 23 at 2:15 PM',
        isCurrentUser: true
      }
    ]
  }
];

export const RepliesView: React.FC<RepliesViewProps> = ({ tasks, onOpenTask }) => {
  const { user } = useAuth();
  const isDemoUser = user?.id === 'u_joy_1';
  const currentUserName = user?.name || 'You';
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME';

  const [threads, setThreads] = useState<ReplyThread[]>(() => {
    try {
      const storageKey = isDemoUser ? 'clickup_replies_v1' : `clickup_replies_${user?.id || 'guest'}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
      return getInitialThreads(currentUserName, userInitials);
    } catch {}
    return getInitialThreads(currentUserName, userInitials);
  });

  useEffect(() => {
    try {
      const storageKey = isDemoUser ? 'clickup_replies_v1' : `clickup_replies_${user?.id || 'guest'}`;
      localStorage.setItem(storageKey, JSON.stringify(threads));
    } catch {}
  }, [threads, user?.id, isDemoUser]);
  const [activeFilter, setActiveFilter] = useState<'open' | 'resolved'>('open');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = threads.filter(th => {
    if (activeFilter === 'open' && th.isResolved) return false;
    if (activeFilter === 'resolved' && !th.isResolved) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      th.taskTitle.toLowerCase().includes(q) ||
      th.messages.some(m => m.content.toLowerCase().includes(q) || m.author.toLowerCase().includes(q))
    );
  });

  const handleSendReply = (threadId: string) => {
    const text = replyInputMap[threadId];
    if (!text || !text.trim()) return;

    setThreads(prev => prev.map(th => {
      if (th.id !== threadId) return th;
      return {
        ...th,
        messages: [
          ...th.messages,
          {
            id: `m-${Date.now()}`,
            author: `${currentUserName} (You)`,
            avatar: userInitials,
            content: text.trim(),
            timestamp: 'Just now',
            isCurrentUser: true
          }
        ]
      };
    }));

    setReplyInputMap(prev => ({ ...prev, [threadId]: '' }));
  };

  const toggleResolveThread = (threadId: string) => {
    setThreads(prev => prev.map(th => th.id === threadId ? { ...th, isResolved: !th.isResolved } : th));
  };

  const handleOpenTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId) || tasks[0];
    if (task) onOpenTask(task);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fafbfc', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        padding: '16px 28px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a'
          }}>
            <Reply size={20} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Replies & Mentions
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              All discussion threads and conversation replies involving {currentUserName}.
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '6px 12px',
          width: '240px'
        }}>
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search reply threads..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.8rem',
              color: '#1e293b',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        padding: '0 28px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <button
          onClick={() => setActiveFilter('open')}
          style={{
            padding: '12px 0',
            border: 'none',
            borderBottom: activeFilter === 'open' ? '2px solid #7c3aed' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeFilter === 'open' ? '#7c3aed' : '#64748b',
            fontWeight: activeFilter === 'open' ? 700 : 500,
            fontSize: '0.84rem',
            cursor: 'pointer'
          }}
        >
          Open Threads ({threads.filter(t => !t.isResolved).length})
        </button>
        <button
          onClick={() => setActiveFilter('resolved')}
          style={{
            padding: '12px 0',
            border: 'none',
            borderBottom: activeFilter === 'resolved' ? '2px solid #7c3aed' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeFilter === 'resolved' ? '#7c3aed' : '#64748b',
            fontWeight: activeFilter === 'resolved' ? 700 : 500,
            fontSize: '0.84rem',
            cursor: 'pointer'
          }}
        >
          Resolved ({threads.filter(t => t.isResolved).length})
        </button>
      </div>

      {/* Threads List */}
      <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '1000px' }}>
        {filteredThreads.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px dashed #cbd5e1'
          }}>
            <MessageSquare size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
              No {activeFilter} reply threads found
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              When colleagues mention or reply to your tasks, they will appear here.
            </p>
          </div>
        ) : (
          filteredThreads.map(th => (
            <div
              key={th.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                overflow: 'hidden'
              }}
            >
              {/* Thread Header */}
              <div style={{
                padding: '12px 18px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #eaebf0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Folder size={14} color="#7c3aed" />
                  <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>{th.spaceName} &gt;</span>
                  <span 
                    onClick={() => handleOpenTask(th.taskId)}
                    style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {th.taskTitle}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => toggleResolveThread(th.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: th.isResolved ? '#f1f5f9' : '#f5f3ff',
                      border: '1px solid ' + (th.isResolved ? '#e2e8f0' : '#ddd6fe'),
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: th.isResolved ? '#64748b' : '#7c3aed',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle2 size={13} />
                    <span>{th.isResolved ? 'Reopen Thread' : 'Resolve'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenTask(th.taskId)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    <ExternalLink size={12} />
                    <span>View Task</span>
                  </button>
                </div>
              </div>

              {/* Messages Flow */}
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {th.messages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: msg.isCurrentUser ? '#7c3aed' : '#1e293b',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {msg.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                          {msg.author}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {msg.timestamp}
                        </span>
                      </div>
                      <div style={{
                        backgroundColor: msg.isCurrentUser ? '#f5f3ff' : '#f8fafc',
                        border: msg.isCurrentUser ? '1px solid #ede9fe' : '1px solid #f1f5f9',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.84rem',
                        color: '#1e293b',
                        lineHeight: 1.5
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Reply Input Box */}
                {!th.isResolved && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <input
                      type="text"
                      placeholder={`Reply to ${th.taskTitle}...`}
                      value={replyInputMap[th.id] || ''}
                      onChange={e => setReplyInputMap({ ...replyInputMap, [th.id]: e.target.value })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSendReply(th.id);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '7px 12px',
                        fontSize: '0.82rem',
                        color: '#1e293b',
                        outline: 'none'
                      }}
                    />
                    <button
                      onClick={() => handleSendReply(th.id)}
                      style={{
                        backgroundColor: '#7c3aed',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '7px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Send</span>
                      <Send size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
