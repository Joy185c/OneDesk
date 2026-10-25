import React, { useState } from 'react';
import { 
  Plus, 
  Flag, 
  MessageSquare, 
  ArrowRight, 
  Check, 
  Filter, 
  Search, 
  User, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';
import { TaskItem } from '../../types';

interface KanbanBoardProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onOpenNewTaskModal: (status: 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE') => void;
  onQuickMoveTask: (taskId: string, newStatus: 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE') => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onSelectTask,
  onOpenNewTaskModal,
  onQuickMoveTask
}) => {
  const [selectedAssignee, setSelectedAssignee] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const columns: Array<{ id: 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE'; label: string; color: string; dot: string; bg: string }> = [
    { id: 'TODO', label: 'TO DO', color: '#64748b', dot: '#94a3b8', bg: '#f8fafc' },
    { id: 'IN PROGRESS', label: 'IN PROGRESS', color: '#4f46e5', dot: '#6366f1', bg: '#f5f3ff' },
    { id: 'REVIEW', label: 'IN REVIEW', color: '#d97706', dot: '#f59e0b', bg: '#fffbeb' },
    { id: 'COMPLETE', label: 'COMPLETE', color: '#16a34a', dot: '#22c55e', bg: '#f0fdf4' }
  ];

  // Distinct assignees
  const allAssignees = Array.from(new Set(tasks.map(t => t.assignee.name)));

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    const matchesAssignee = selectedAssignee === 'ALL' || task.assignee.name === selectedAssignee;
    const matchesSearch = !searchQuery.trim() || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAssignee && matchesSearch;
  });

  // Tracking metrics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETE').length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const nextStatusMap: Record<string, 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE'> = {
    'TODO': 'IN PROGRESS',
    'IN PROGRESS': 'REVIEW',
    'REVIEW': 'COMPLETE',
    'COMPLETE': 'TODO'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* 1. Status Tracking Pipeline & Assignment Filters Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Metrics summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Sprint Status Pipeline
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {completedCount} / {totalCount} Completed
                </span>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: progressPercent >= 75 ? '#16a34a' : '#7c3aed',
                  backgroundColor: progressPercent >= 75 ? '#dcfce7' : '#faf5ff',
                  padding: '1px 8px',
                  borderRadius: '100px'
                }}>
                  {progressPercent}% Done
                </span>
              </div>
            </div>

            {/* Quick status breakdown pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {columns.map(col => {
                const count = tasks.filter(t => t.status === col.id).length;
                return (
                  <div
                    key={col.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 9px',
                      borderRadius: '8px',
                      backgroundColor: col.bg,
                      border: '1px solid #e2e8f0',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: col.color
                    }}
                  >
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: col.dot }} />
                    <span>{col.label}: <strong>{count}</strong></span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters: Assignee + Search + Add Task */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 10px'
            }}>
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Filter tasks..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'none',
                  outline: 'none',
                  fontSize: '0.82rem',
                  width: '130px'
                }}
              />
            </div>

            {/* Assignee Filter (Requirement 2) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 10px'
            }}>
              <User size={14} color="#7c3aed" />
              <select
                value={selectedAssignee}
                onChange={e => setSelectedAssignee(e.target.value)}
                style={{
                  border: 'none',
                  background: 'none',
                  outline: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All Assignees</option>
                {allAssignees.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => onOpenNewTaskModal('TODO')}
              className="btn-primary"
              style={{
                padding: '7px 14px',
                fontSize: '0.82rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={14} />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#e2e8f0',
          borderRadius: '100px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: progressPercent === 100 ? '#16a34a' : '#7c3aed',
            transition: 'width 0.3s ease',
            borderRadius: '100px'
          }} />
        </div>
      </div>

      {/* 2. Kanban Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '18px',
        alignItems: 'start'
      }}>
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '520px'
              }}
            >
              {/* Column Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                paddingBottom: '8px',
                borderBottom: '2px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: col.dot }} />
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1e293b' }}>
                    {col.label}
                  </span>
                  <span style={{
                    fontSize: '0.74rem',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    fontWeight: 700,
                    padding: '1px 8px',
                    borderRadius: '100px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => onOpenNewTaskModal(col.id)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Add task to this column"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Task Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '14px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                    }}
                    onClick={() => onSelectTask(task)}
                  >
                    {/* Task Key & Priority */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#7b68ee' }}>
                        {task.key}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: task.priority === 'Urgent' ? '#dc2626' : task.priority === 'High' ? '#ea580c' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: task.priority === 'Urgent' ? '#fee2e2' : '#f1f5f9',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        <Flag size={11} />
                        {task.priority}
                      </span>
                    </div>

                    {/* Title */}
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1e293b', marginBottom: '12px', lineHeight: 1.35 }}>
                      {task.title}
                    </div>

                    {/* Footer metadata & quick move buttons */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '10px'
                    }}>
                      {/* Assignee pill */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={`Assigned to ${task.assignee.name}`}>
                        <img
                          src={task.assignee.avatar}
                          alt=""
                          style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                        />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                          {task.assignee.name.split(' ')[0]}
                        </span>
                      </div>

                      {/* Quick Move / Status Transition Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: '#94a3b8' }}>
                          <MessageSquare size={13} />
                          <span>{task.commentsCount}</span>
                        </div>

                        {/* Quick move forward button */}
                        {col.id !== 'COMPLETE' && (
                          <button
                            type="button"
                            onClick={() => onQuickMoveTask(task.id, nextStatusMap[task.status])}
                            style={{
                              padding: '3px 8px',
                              backgroundColor: '#faf5ff',
                              border: '1px solid #e9d5ff',
                              color: '#7c3aed',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                            title={`Move to ${nextStatusMap[task.status]}`}
                          >
                            <span>Move</span>
                            <ArrowRight size={11} />
                          </button>
                        )}

                        {/* Direct Select */}
                        <select
                          value={task.status}
                          onChange={(e) => onQuickMoveTask(task.id, e.target.value as any)}
                          style={{
                            fontSize: '0.7rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            padding: '2px 4px',
                            backgroundColor: '#f8fafc',
                            color: '#475569',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN PROGRESS">In Progress</option>
                          <option value="REVIEW">In Review</option>
                          <option value="COMPLETE">Complete</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div style={{
                    padding: '28px 16px',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '0.82rem',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '10px'
                  }}>
                    No tasks here yet. Click + to add.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
