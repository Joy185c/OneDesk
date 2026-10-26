import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flag, 
  Clock, 
  Calendar, 
  User as UserIcon, 
  MessageSquare, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Send,
  Sparkles,
  Tag,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  History
} from 'lucide-react';
import { TaskItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { memberService, WorkspaceMember } from '../../services/memberService';
import { generateUUID } from '../../lib/uuid';

interface TaskDetailModalProps {
  task: TaskItem | null;
  onClose: () => void;
  onUpdateTask: (updated: TaskItem) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onUpdateTask,
  onDeleteTask
}) => {
  const { user } = useAuth();

  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [title, setTitle] = useState(task?.title || '');
  const [status, setStatus] = useState(task?.status || 'TODO');
  const [priority, setPriority] = useState(task?.priority || 'Normal');
  const [assigneeName, setAssigneeName] = useState(task?.assignee?.name || '');
  const [timeEstimate, setTimeEstimate] = useState(task?.timeEstimate || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [newComment, setNewComment] = useState('');
  const [activities, setActivities] = useState<Array<{ id: string; text: string; time: string }>>([
    { id: 'act-1', text: `Task created in Sprint Backlog`, time: 'Earlier' }
  ]);
  const [comments, setComments] = useState<Array<{ id: string; author: string; avatar: string; time: string; text: string }>>([
    {
      id: 'c1',
      author: 'Ivan Villa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      time: '2 hours ago',
      text: 'Verified design tokens and layout consistency on iPad Pro.'
    }
  ]);
  const [subtasks, setSubtasks] = useState<Array<{ id: string; title: string; done: boolean }>>([
    { id: 'st1', title: 'Review Figma wireframe components', done: true },
    { id: 'st2', title: 'Implement responsive breakpoints', done: false }
  ]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    const list = memberService.getWorkspaceMembers();
    setMembers(list);
  }, []);

  if (!task) return null;

  const handleStatusChange = (newStatus: 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE') => {
    setStatus(newStatus);
    const updated = {
      ...task,
      title,
      status: newStatus,
      priority,
      timeEstimate,
      dueDate,
      commentsCount: comments.length
    };
    onUpdateTask(updated);

    setActivities(prev => [
      { id: 'act-' + Date.now(), text: `Status updated to ${newStatus}`, time: 'Just now' },
      ...prev
    ]);
  };

  const handleAssigneeChange = (memberId: string) => {
    const selected = members.find(m => m.id === memberId);
    if (!selected) return;

    setAssigneeName(selected.name);
    const updated: TaskItem = {
      ...task,
      title,
      status,
      priority,
      timeEstimate,
      dueDate,
      assignee: {
        name: selected.name,
        avatar: selected.avatar,
        role: selected.role
      },
      commentsCount: comments.length
    };
    onUpdateTask(updated);

    setActivities(prev => [
      { id: 'act-' + Date.now(), text: `Re-assigned to ${selected.name} (${selected.role})`, time: 'Just now' },
      ...prev
    ]);
  };

  const handleSave = () => {
    onUpdateTask({
      ...task,
      title,
      status,
      priority,
      timeEstimate,
      dueDate,
      commentsCount: comments.length
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const added = {
      id: generateUUID(),
      author: user?.name || 'You',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      time: 'Just now',
      text: newComment.trim()
    };
    const updated = [...comments, added];
    setComments(updated);
    setNewComment('');
    onUpdateTask({ ...task, commentsCount: updated.length });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    const added = {
      id: generateUUID(),
      title: newSubtaskText.trim(),
      done: false
    };
    setSubtasks([...subtasks, added]);
    setNewSubtaskText('');
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(st => st.id === id ? { ...st, done: !st.done } : st));
  };

  const statusList: Array<{ id: 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE'; label: string; color: string; bg: string }> = [
    { id: 'TODO', label: 'TO DO', color: '#64748b', bg: '#f1f5f9' },
    { id: 'IN PROGRESS', label: 'IN PROGRESS', color: '#4f46e5', bg: '#e0e7ff' },
    { id: 'REVIEW', label: 'IN REVIEW', color: '#d97706', bg: '#fef3c7' },
    { id: 'COMPLETE', label: 'COMPLETE', color: '#16a34a', bg: '#dcfce7' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 17, 26, 0.6)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 1000,
      animation: 'fadeIn 0.15s ease'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '720px',
        height: '100%',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Drawer Navigation */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 800, color: '#7b68ee', fontSize: '0.9rem' }}>
              {task.key}
            </span>
            <span style={{ color: '#9ca3af' }}>in</span>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#374151' }}>
              Sales CRM Sprint Pipeline
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                if (window.confirm(`Delete task ${task.key}?`)) {
                  onDeleteTask(task.id);
                  onClose();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#dc2626',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                cursor: 'pointer',
                background: 'none',
                border: '1px solid #fecaca'
              }}
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>

            <button
              onClick={() => { handleSave(); onClose(); }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <X size={18} color="#4b5563" />
            </button>
          </div>
        </div>

        {/* Status Pipeline Tracking Bar (Requirement 2) */}
        <div style={{
          padding: '12px 24px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Status Pipeline Tracking
            </span>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: status === 'COMPLETE' ? '#dcfce7' : '#ede9fe',
              color: status === 'COMPLETE' ? '#16a34a' : '#7c3aed'
            }}>
              Current: {status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {statusList.map((st, idx) => {
              const isActive = status === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleStatusChange(st.id)}
                  style={{
                    padding: '8px 6px',
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: isActive ? st.color : '#e2e8f0',
                    backgroundColor: isActive ? st.bg : '#f8fafc',
                    color: isActive ? st.color : '#64748b',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isActive && <CheckCircle2 size={13} />}
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Body Scroll */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            placeholder="Task Title..."
            style={{
              width: '100%',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#111827',
              border: 'none',
              outline: 'none',
              marginBottom: '20px',
              boxSizing: 'border-box'
            }}
          />

          {/* Quick Property Grid with Interactive Assignee & Status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            rowGap: '14px',
            alignItems: 'center',
            fontSize: '0.88rem',
            backgroundColor: '#f8fafc',
            padding: '18px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}>
            {/* Assignee Selection (Requirement 2) */}
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <UserIcon size={14} color="#7c3aed" /> Assignee:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={task.assignee.avatar}
                alt=""
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #7c3aed' }}
              />
              <select
                value={members.find(m => m.name === assigneeName)?.id || ''}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  cursor: 'pointer'
                }}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <CheckSquare size={14} /> Status:
            </span>
            <div>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  backgroundColor: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <option value="TODO">TO DO</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="REVIEW">REVIEW</option>
                <option value="COMPLETE">COMPLETE</option>
              </select>
            </div>

            {/* Priority */}
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <Flag size={14} /> Priority:
            </span>
            <div>
              <select
                value={priority}
                onChange={(e) => {
                  const p = e.target.value as any;
                  setPriority(p);
                  onUpdateTask({ ...task, priority: p });
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  backgroundColor: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <option value="Urgent">Urgent 🚩</option>
                <option value="High">High ⚠️</option>
                <option value="Normal">Normal 🔹</option>
                <option value="Low">Low ▫️</option>
              </select>
            </div>

            {/* Due Date */}
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <Calendar size={14} /> Due Date:
            </span>
            <div>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onBlur={handleSave}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.84rem',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            {/* Estimate */}
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <Clock size={14} /> Estimate:
            </span>
            <div>
              <input
                type="text"
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                onBlur={handleSave}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.84rem',
                  width: '90px',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Subtasks ({subtasks.filter(s => s.done).length}/{subtasks.length})
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {subtasks.map(st => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtask(st.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={st.done}
                    onChange={() => toggleSubtask(st.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{
                    fontSize: '0.88rem',
                    color: st.done ? '#94a3b8' : '#1e293b',
                    textDecoration: st.done ? 'line-through' : 'none'
                  }}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Add a new subtask..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#7b68ee',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Add
              </button>
            </form>
          </div>

          {/* Activity / Status Tracking Log */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={16} color="#7c3aed" />
              <span>Status & Assignment Activity</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activities.map(act => (
                <div key={act.id} style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#7c3aed' }} />
                  <span style={{ fontWeight: 600, color: '#334155' }}>{act.text}</span>
                  <span style={{ color: '#94a3b8' }}>• {act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity / Comments Stream */}
          <div>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1e293b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} color="#7b68ee" />
              <span>Team Discussion</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {comments.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '10px' }}>
                  <img
                    src={c.avatar}
                    alt=""
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{
                    flex: 1,
                    backgroundColor: '#f8fafc',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.84rem', color: '#1e293b' }}>{c.author}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{c.time}</span>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.4, margin: 0 }}>
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Post comment input */}
            <form onSubmit={handleAddComment}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1.5px solid #cbd5e1',
                borderRadius: '10px',
                padding: '8px 12px',
                backgroundColor: '#ffffff'
              }}>
                <input
                  type="text"
                  placeholder="Write a comment or status update..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.88rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#7b68ee',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 700
                  }}
                >
                  <Send size={14} />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
