import React, { useState } from 'react';
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
  Tag
} from 'lucide-react';
import { TaskItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

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
  if (!task) return null;

  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [timeEstimate, setTimeEstimate] = useState(task.timeEstimate);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [newComment, setNewComment] = useState('');
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
      id: String(Date.now()),
      author: user?.name || 'Alex Rivera',
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
      id: 'st_' + Date.now(),
      title: newSubtaskText.trim(),
      done: false
    };
    setSubtasks([...subtasks, added]);
    setNewSubtaskText('');
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(st => st.id === id ? { ...st, done: !st.done } : st));
  };

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
        maxWidth: '680px',
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
            <span style={{ fontWeight: 800, color: '#7b68ee', fontSize: '0.86rem' }}>
              {task.key}
            </span>
            <span style={{ color: '#9ca3af' }}>in</span>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#374151' }}>
              Core Roadmap / Sprints
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
                cursor: 'pointer'
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
                cursor: 'pointer'
              }}
            >
              <X size={18} color="#4b5563" />
            </button>
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
            style={{
              width: '100%',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#111827',
              border: 'none',
              outline: 'none',
              marginBottom: '20px',
              fontFamily: 'var(--font-display)'
            }}
          />

          {/* Quick Property Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            rowGap: '12px',
            fontSize: '0.88rem',
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckSquare size={14} /> Status:
            </span>
            <div>
              <select
                value={status}
                onChange={(e) => {
                  const s = e.target.value as any;
                  setStatus(s);
                  onUpdateTask({ ...task, status: s });
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <option value="TODO">TODO</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="REVIEW">REVIEW</option>
                <option value="COMPLETE">COMPLETE</option>
              </select>
            </div>

            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: 600,
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

            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> Due Date:
            </span>
            <div>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onBlur={handleSave}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem'
                }}
              />
            </div>

            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} /> Estimate:
            </span>
            <div>
              <input
                type="text"
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                onBlur={handleSave}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  width: '90px'
                }}
              />
            </div>

            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserIcon size={14} /> Assignee:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={task.assignee.avatar}
                alt=""
                style={{ width: '22px', height: '22px', borderRadius: '50%' }}
              />
              <span style={{ fontWeight: 600, color: '#1e293b' }}>{task.assignee.name}</span>
            </div>
          </div>

          {/* Subtasks Section */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1e293b' }}>
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
                  border: '1px solid #cbd5e1',
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
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
            </form>
          </div>

          {/* Activity / Comments Stream */}
          <div>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1e293b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} color="#7b68ee" />
              <span>Activity & Discussion</span>
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
                    <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.4 }}>
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
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '8px 12px',
                backgroundColor: '#ffffff'
              }}>
                <input
                  type="text"
                  placeholder="Write a comment or update (cmd + enter)..."
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
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <Send size={13} />
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
