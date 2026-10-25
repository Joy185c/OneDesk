import React from 'react';
import { Plus, Flag, MessageSquare, MoreHorizontal, ArrowRight, Check } from 'lucide-react';
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
  const columns: Array<{ id: 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE'; label: string; color: string; dot: string }> = [
    { id: 'TODO', label: 'TO DO', color: '#64748b', dot: '#94a3b8' },
    { id: 'IN PROGRESS', label: 'IN PROGRESS', color: '#4f46e5', dot: '#6366f1' },
    { id: 'REVIEW', label: 'IN REVIEW', color: '#d97706', dot: '#f59e0b' },
    { id: 'COMPLETE', label: 'COMPLETE', color: '#16a34a', dot: '#22c55e' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      alignItems: 'start'
    }}>
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={task.assignee.avatar}
                        alt=""
                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{task.timeEstimate}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: '#94a3b8' }}>
                        <MessageSquare size={13} />
                        <span>{task.commentsCount}</span>
                      </div>

                      {/* Quick Move Dropdown */}
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
  );
};
