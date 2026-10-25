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

export const RepliesView: React.FC<RepliesViewProps> = ({ tasks, onOpenTask }) => {
  const { user } = useAuth();
  const currentUserName = user?.name || 'You';
  const userInitials = (() => {
    if (!user?.name || !user.name.trim()) return 'ME';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return user.name.trim().slice(0, 2).toUpperCase();
  })();

  const storageKey = `clickup_replies_${user?.id || 'guest'}`;

  const [threads, setThreads] = useState<ReplyThread[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: ReplyThread[] = JSON.parse(saved);
        // Purge any stale legacy threads with hardcoded demo data
        const clean = parsed.filter(t => 
          !t.messages.some(m => m.author.includes('Sarah Miller') || m.content.includes('annual upfront payment schedule'))
        );
        return clean;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(threads));
    } catch {}
  }, [threads, storageKey]);

  const [activeFilter, setActiveFilter] = useState<'open' | 'resolved'>('open');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicMessage, setNewTopicMessage] = useState('');

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

  const handleCreateNewDiscussion = () => {
    if (!newTopicTitle.trim() || !newTopicMessage.trim()) return;
    const newThread: ReplyThread = {
      id: `th-${Date.now()}`,
      taskTitle: newTopicTitle.trim(),
      taskId: tasks[0]?.id || '1',
      spaceName: 'General Discussion',
      isResolved: false,
      messages: [
        {
          id: `m-${Date.now()}`,
          author: `${currentUserName} (You)`,
          avatar: userInitials,
          content: newTopicMessage.trim(),
          timestamp: 'Just now',
          isCurrentUser: true
        }
      ]
    };
    setThreads(prev => [newThread, ...prev]);
    setNewTopicTitle('');
    setNewTopicMessage('');
    setIsNewDiscussionOpen(false);
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
              {threads.length > 0
                ? `${threads.length} active discussion thread${threads.length > 1 ? 's' : ''} for ${currentUserName}.`
                : `No active discussion threads for ${currentUserName}.`}
            </p>
          </div>
        </div>

        {/* Action and Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '6px 12px',
            width: '220px'
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
          <button
            onClick={() => setIsNewDiscussionOpen(true)}
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
            <span>+ New Thread</span>
          </button>
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
            padding: '65px 24px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#f5f3ff',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <MessageSquare size={24} />
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              You're all caught up!
            </h3>
            <p style={{ margin: '0 auto 20px', fontSize: '0.86rem', color: '#64748b', maxWidth: '380px', lineHeight: 1.5 }}>
              When teammates mention you in comments or reply to your tasks, those discussion threads will appear right here.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => setIsNewDiscussionOpen(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>+ Start Discussion</span>
              </button>
              {tasks.length > 0 && (
                <button
                  onClick={() => onOpenTask(tasks[0])}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View Tasks
                </button>
              )}
            </div>
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
      {/* New Discussion Modal */}
      {isNewDiscussionOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#f5f3ff',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MessageSquare size={16} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Start New Discussion
                </h3>
              </div>
              <button
                onClick={() => setIsNewDiscussionOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Topic / Task Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Growth Strategy, Project Onboarding"
                  value={newTopicTitle}
                  onChange={e => setNewTopicTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Your Initial Message / Question
                </label>
                <textarea
                  placeholder="Type your message or mention a teammate..."
                  rows={4}
                  value={newTopicMessage}
                  onChange={e => setNewTopicMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    color: '#0f172a',
                    fontFamily: 'inherit',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={() => setIsNewDiscussionOpen(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewDiscussion}
                  disabled={!newTopicTitle.trim() || !newTopicMessage.trim()}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: (!newTopicTitle.trim() || !newTopicMessage.trim()) ? '#c4b5fd' : '#7c3aed',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: (!newTopicTitle.trim() || !newTopicMessage.trim()) ? 'not-allowed' : 'pointer'
                  }}
                >
                  Create Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
