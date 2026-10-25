import React from 'react';
import { Flag, Trash2, CheckSquare, Clock, Plus } from 'lucide-react';
import { TaskItem } from '../../types';

interface TaskListViewProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onQuickMoveTask: (taskId: string, newStatus: 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE') => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTaskModal: (status: 'TODO') => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onSelectTask,
  onQuickMoveTask,
  onDeleteTask,
  onOpenNewTaskModal
}) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1e293b' }}>
            All Active Tasks ({tasks.length})
          </span>
        </div>

        <button
          onClick={() => onOpenNewTaskModal('TODO')}
          className="btn-primary"
          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
        >
          <Plus size={14} />
          <span>Add Task</span>
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '12px 16px', width: '40px' }}>Done</th>
              <th style={{ padding: '12px 16px' }}>Key</th>
              <th style={{ padding: '12px 16px' }}>Task Name</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Priority</th>
              <th style={{ padding: '12px 16px' }}>Assignee</th>
              <th style={{ padding: '12px 16px' }}>Due Date</th>
              <th style={{ padding: '12px 16px' }}>Estimate</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const isCompleted = task.status === 'COMPLETE';
              return (
                <tr
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'background 0.12s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => onQuickMoveTask(task.id, isCompleted ? 'TODO' : 'COMPLETE')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>

                  <td style={{ padding: '12px 16px', fontWeight: 800, color: '#7b68ee' }}>
                    {task.key}
                  </td>

                  <td style={{ padding: '12px 16px', fontWeight: 600, color: isCompleted ? '#94a3b8' : '#1e293b', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                    {task.title}
                  </td>

                  <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                    <select
                      value={task.status}
                      onChange={(e) => onQuickMoveTask(task.id, e.target.value as any)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.78rem',
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
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: task.priority === 'Urgent' ? '#dc2626' : task.priority === 'High' ? '#ea580c' : '#475569'
                    }}>
                      <Flag size={12} />
                      {task.priority}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={task.assignee.avatar} alt="" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                      <span style={{ color: '#334155' }}>{task.assignee.name}</span>
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', color: '#64748b' }}>
                    {task.dueDate}
                  </td>

                  <td style={{ padding: '12px 16px', color: '#64748b' }}>
                    {task.timeEstimate}
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                      title="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
