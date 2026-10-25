import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  Search, 
  Folder, 
  AlertCircle 
} from 'lucide-react';
import { TaskItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface AssignedCommentItem {
  id: string;
  taskTitle: string;
  taskId: string;
  spaceName: string;
  assigner: string;
  assignerAvatar: string;
  content: string;
  dueDate: string;
  priority: 'Urgent' | 'High' | 'Normal' | 'Low';
  isResolved: boolean;
}

interface AssignedCommentsViewProps {
  tasks: TaskItem[];
  onOpenTask: (task: TaskItem) => void;
}

const INITIAL_ASSIGNED_COMMENTS: AssignedCommentItem[] = [
  {
    id: 'ac-1',
    taskTitle: 'Enterprise License Agreement',
    taskId: '1',
    spaceName: 'Sales CRM',
    assigner: 'Sarah Miller',
    assignerAvatar: 'SM',
    content: 'Review and confirm custom pricing discount matrix with team before Friday board review.',
    dueDate: 'Tomorrow',
    priority: 'Urgent',
    isResolved: false
  },
  {
    id: 'ac-2',
    taskTitle: 'Landing Page Hero 3.0',
    taskId: '4',
    spaceName: 'Product & Design',
    assigner: 'Alex Chen',
    assignerAvatar: 'AC',
    content: 'Finalize ClickUp 3.0 SVG navigation icons and responsiveness for ultra-wide displays.',
    dueDate: 'In 2 days',
    priority: 'High',
    isResolved: false
  },
  {
    id: 'ac-3',
    taskTitle: 'Supabase Real-Time Sync & WebSocket',
    taskId: '3',
    spaceName: 'Engineering',
    assigner: 'DevOps Lead',
    assignerAvatar: 'DL',
    content: 'Verify Row Level Security policies on the PostgreSQL tasks and audit_logs tables.',
    dueDate: 'Oct 28',
    priority: 'Normal',
    isResolved: false
  },
  {
    id: 'ac-4',
    taskTitle: 'Customer Feedback Review & NPS Survey',
    taskId: '2',
    spaceName: 'Customer Success',
    assigner: 'Priya Patel',
    assignerAvatar: 'PP',
    content: 'Export Q3 NPS response breakdown and share highlights in #General channel.',
    dueDate: 'Completed Oct 22',
    priority: 'Low',
    isResolved: true
  }
];

export const AssignedCommentsView: React.FC<AssignedCommentsViewProps> = ({ tasks, onOpenTask }) => {
  const { user } = useAuth();
  const storageKey = `clickup_assigned_comments_${user?.id || 'guest'}`;

  const [comments, setComments] = useState<AssignedCommentItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: AssignedCommentItem[] = JSON.parse(saved);
        return parsed.filter(c => !c.assigner.includes('Sarah Miller'));
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(comments));
    } catch {}
  }, [comments, storageKey]);
  const [filter, setFilter] = useState<'unresolved' | 'resolved'>('unresolved');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComments = comments.filter(c => {
    if (filter === 'unresolved' && c.isResolved) return false;
    if (filter === 'resolved' && !c.isResolved) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.content.toLowerCase().includes(q) ||
      c.taskTitle.toLowerCase().includes(q) ||
      c.assigner.toLowerCase().includes(q)
    );
  });

  const toggleResolve = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, isResolved: !c.isResolved } : c));
  };

  const handleOpenTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId) || tasks[0];
    if (task) onOpenTask(task);
  };

  const unresolvedCount = comments.filter(c => !c.isResolved).length;
  const resolvedCount = comments.filter(c => c.isResolved).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return { bg: '#fee2e2', text: '#dc2626' };
      case 'High': return { bg: '#ffedd5', text: '#ea580c' };
      case 'Normal': return { bg: '#e0f2fe', text: '#0284c7' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
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
            <UserCheck size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Assigned Comments
              </h1>
              {unresolvedCount > 0 && (
                <span style={{
                  backgroundColor: '#ea580c',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '100px'
                }}>
                  {unresolvedCount} to resolve
                </span>
              )}
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Action items and assigned comments across all tasks assigned to {user?.name || 'you'}.
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
            placeholder="Search action items..."
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
          onClick={() => setFilter('unresolved')}
          style={{
            padding: '12px 0',
            border: 'none',
            borderBottom: filter === 'unresolved' ? '2px solid #7c3aed' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: filter === 'unresolved' ? '#7c3aed' : '#64748b',
            fontWeight: filter === 'unresolved' ? 700 : 500,
            fontSize: '0.84rem',
            cursor: 'pointer'
          }}
        >
          Unresolved ({unresolvedCount})
        </button>
        <button
          onClick={() => setFilter('resolved')}
          style={{
            padding: '12px 0',
            border: 'none',
            borderBottom: filter === 'resolved' ? '2px solid #7c3aed' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: filter === 'resolved' ? '#7c3aed' : '#64748b',
            fontWeight: filter === 'resolved' ? 700 : 500,
            fontSize: '0.84rem',
            cursor: 'pointer'
          }}
        >
          Resolved ({resolvedCount})
        </button>
      </div>

      {/* Items Stream */}
      <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '1000px' }}>
        {filteredComments.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px dashed #cbd5e1'
          }}>
            <CheckCircle2 size={36} color="#22c55e" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
              No {filter} assigned comments!
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Great job! All team action items assigned to you have been resolved.
            </p>
          </div>
        ) : (
          filteredComments.map(item => {
            const priColor = getPriorityColor(item.priority);
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: item.isResolved ? '1px solid #e2e8f0' : '1px solid #cbd5e1',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Resolve Checkbox */}
                <div 
                  onClick={() => toggleResolve(item.id)}
                  style={{
                    cursor: 'pointer',
                    color: item.isResolved ? '#22c55e' : '#94a3b8',
                    marginTop: '2px',
                    transition: 'color 0.15s'
                  }}
                  title={item.isResolved ? "Mark as unresolved" : "Mark as resolved"}
                >
                  {item.isResolved ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>

                {/* Content Area */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Folder size={12} color="#7c3aed" />
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.spaceName} &gt;</span>
                      <span 
                        onClick={() => handleOpenTask(item.taskId)}
                        style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {item.taskTitle}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        backgroundColor: priColor.bg,
                        color: priColor.text,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {item.priority}
                      </span>

                      <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {item.dueDate}
                      </span>
                    </div>
                  </div>

                  <p style={{
                    margin: '0 0 10px 0',
                    fontSize: '0.86rem',
                    color: item.isResolved ? '#94a3b8' : '#1e293b',
                    textDecoration: item.isResolved ? 'line-through' : 'none',
                    lineHeight: 1.5
                  }}>
                    {item.content}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#1e293b',
                        color: '#ffffff',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {item.assignerAvatar}
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Assigned by <strong style={{ color: '#1e293b' }}>{item.assigner}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenTask(item.taskId)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>Open Task</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
