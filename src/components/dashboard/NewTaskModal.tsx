import React, { useState, useEffect } from 'react';
import { X, Plus, Flag, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { TaskItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { memberService, WorkspaceMember } from '../../services/memberService';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: TaskItem) => void;
  defaultStatus?: 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE';
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  defaultStatus = 'TODO'
}) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE'>(defaultStatus);
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Normal' | 'Low'>('Normal');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [dueDate, setDueDate] = useState('May 28, 2026');
  const [timeEstimate, setTimeEstimate] = useState('3d');
  const [tag, setTag] = useState('Feature');

  useEffect(() => {
    if (isOpen) {
      const allMembers = memberService.getWorkspaceMembers();
      setMembers(allMembers);
      // Default to logged-in user or first member
      const current = allMembers.find(m => m.email === user?.email || m.name === user?.name) || allMembers[0];
      if (current) {
        setSelectedMemberId(current.id);
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenMember = members.find(m => m.id === selectedMemberId) || {
      name: user?.name || 'You',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: user?.role || 'Lead'
    };

    const newTask: TaskItem = {
      id: 't_' + Date.now(),
      key: `CLK-${Math.floor(Math.random() * 80) + 30}`,
      title: title.trim(),
      status,
      priority,
      assignee: {
        name: chosenMember.name,
        avatar: chosenMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        role: chosenMember.role || 'Member'
      },
      dueDate,
      timeEstimate,
      tags: [tag],
      commentsCount: 0
    };

    onAddTask(newTask);
    setTitle('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 17, 26, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1100,
      animation: 'fadeIn 0.15s ease'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        maxWidth: '540px',
        width: '100%',
        padding: '28px 26px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#111827', fontWeight: 800, margin: 0 }}>
              Create & Assign New Task
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Assign task to team members and track status pipeline
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            <X size={16} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Task Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              Task Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Implement user dashboard analytics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Assignee Selection (Requirement 2) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              Assign Task To (Team Member) *
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 10px',
              backgroundColor: '#f8fafc'
            }}>
              <User size={16} color="#7c3aed" style={{ marginRight: '8px' }} />
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer'
                }}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role}) — {m.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Status */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Status Pipeline *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  fontWeight: 600
                }}
              >
                <option value="TODO">⚪ TO DO</option>
                <option value="IN PROGRESS">🔵 IN PROGRESS</option>
                <option value="REVIEW">🟠 REVIEW</option>
                <option value="COMPLETE">🟢 COMPLETE</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="Urgent">Urgent 🚩</option>
                <option value="High">High ⚠️</option>
                <option value="Normal">Normal 🔹</option>
                <option value="Low">Low ▫️</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Due Date
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Estimate
              </label>
              <input
                type="text"
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              Tag
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. Feature, Design, Frontend"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} />
              <span>Create & Assign Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
