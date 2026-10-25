import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Circle, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Check, 
  X, 
  Filter, 
  Search, 
  MoreVertical, 
  Sparkles, 
  Zap, 
  AlertCircle,
  BarChart2,
  Folder
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

export interface SprintTask {
  id: string;
  title: string;
  points: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'TESTING' | 'DONE';
  priority: 'Urgent' | 'High' | 'Normal' | 'Low';
  assignee: { name: string; avatar: string; color: string };
  dueDate: string;
}

export interface Sprint {
  id: string;
  name: string;
  dates: string;
  status: 'active' | 'completed' | 'future';
  totalPoints: number;
  completedPoints: number;
}

const INITIAL_SPRINT_TASKS: SprintTask[] = [
  {
    id: 'sp-1',
    title: 'Design home page layout & responsive grid',
    points: 5,
    status: 'OPEN',
    priority: 'High',
    assignee: { name: 'Mugdho', avatar: '👓', color: '#2563eb' },
    dueDate: 'Jul 20'
  },
  {
    id: 'sp-2',
    title: 'Create user profile UI & settings modal',
    points: 3,
    status: 'OPEN',
    priority: 'Normal',
    assignee: { name: 'Alex Rivera', avatar: 'AR', color: '#059669' },
    dueDate: 'Jul 20'
  },
  {
    id: 'sp-3',
    title: 'Figma token synchronization pipeline in Supabase',
    points: 8,
    status: 'IN_PROGRESS',
    priority: 'Urgent',
    assignee: { name: 'Joy Sarkar', avatar: 'JS', color: '#7c3aed' },
    dueDate: 'Jul 22'
  },
  {
    id: 'sp-4',
    title: 'Implement Vercel SPA client router rewrites',
    points: 5,
    status: 'IN_PROGRESS',
    priority: 'High',
    assignee: { name: 'Joy Sarkar', avatar: 'JS', color: '#7c3aed' },
    dueDate: 'Jul 21'
  },
  {
    id: 'sp-5',
    title: 'Refine dashboard widgets & velocity metrics',
    points: 5,
    status: 'TESTING',
    priority: 'High',
    assignee: { name: 'Sarah Chen', avatar: 'SC', color: '#d97706' },
    dueDate: 'Jul 19'
  },
  {
    id: 'sp-6',
    title: 'Mockup mobile views & gesture interactions',
    points: 3,
    status: 'TESTING',
    priority: 'Normal',
    assignee: { name: 'Mugdho', avatar: '👓', color: '#2563eb' },
    dueDate: 'Jul 20'
  },
  {
    id: 'sp-7',
    title: 'Develop modal components & transition animations',
    points: 8,
    status: 'DONE',
    priority: 'Urgent',
    assignee: { name: 'Joy Sarkar', avatar: 'JS', color: '#7c3aed' },
    dueDate: 'Jun 28'
  },
  {
    id: 'sp-8',
    title: 'PostgreSQL schema replication v2 verification',
    points: 5,
    status: 'DONE',
    priority: 'High',
    assignee: { name: 'Alex Rivera', avatar: 'AR', color: '#059669' },
    dueDate: 'Jun 30'
  }
];

export const SprintsView: React.FC = () => {
  const { user } = useAuth();
  const isDemoUser = user?.id === 'u_joy_1';
  const currentUserName = user?.name || 'You';
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME';

  const [tasks, setTasks] = useState<SprintTask[]>(() => {
    const storageKey = isDemoUser ? 'clickup_sprint_tasks_v1' : `clickup_sprint_tasks_${user?.id || 'guest'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return isDemoUser ? INITIAL_SPRINT_TASKS : [];
  });

  const [activeSprint, setActiveSprint] = useState<string>('sprint-52');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskPoints, setNewTaskPoints] = useState<number>(3);
  const [newTaskStatus, setNewTaskStatus] = useState<SprintTask['status']>('OPEN');
  const [newTaskPriority, setNewTaskPriority] = useState<SprintTask['priority']>('High');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const storageKey = isDemoUser ? 'clickup_sprint_tasks_v1' : `clickup_sprint_tasks_${user?.id || 'guest'}`;
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks, user?.id, isDemoUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);
  const completedPoints = tasks.filter(t => t.status === 'DONE').reduce((sum, t) => sum + t.points, 0);
  const inProgressPoints = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'TESTING').reduce((sum, t) => sum + t.points, 0);
  const percentComplete = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const handleMoveStatus = (taskId: string, newStatus: SprintTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    if (newStatus === 'DONE') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      showToast('Task marked as DONE! Sprint points updated');
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: SprintTask = {
      id: `sp-${Date.now()}`,
      title: newTaskTitle.trim(),
      points: Number(newTaskPoints),
      status: newTaskStatus,
      priority: newTaskPriority,
      assignee: { name: currentUserName, avatar: userInitials, color: '#7c3aed' },
      dueDate: 'Jul 24'
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setIsNewTaskOpen(false);
    showToast(`Task "${newTask.title}" added to Sprint 52`);
  };

  const handleCompleteSprint = () => {
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    showToast('🎉 Sprint 52 completed! Retrospective report ready.');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Toast notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease'
        }}>
          <Check size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Sprint Bar */}
      <div style={{
        padding: '14px 24px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left: Spaces Breadcrumbs & Active Sprint Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>📁</span>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>
              Product Space • Sprint 52
            </span>
            <span style={{
              backgroundColor: '#ecfdf5',
              color: '#059669',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '100px',
              border: '1px solid #a7f3d0'
            }}>
              ● ACTIVE SPRINT
            </span>
          </div>
          <span style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
            Jul 18 – Jul 24 (4 days remaining)
          </span>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsNewTaskOpen(true)}
            style={{
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(124, 58, 237, 0.3)'
            }}
          >
            <Plus size={15} />
            <span>Add Sprint Task</span>
          </button>

          <button
            onClick={handleCompleteSprint}
            style={{
              backgroundColor: '#ffffff',
              color: '#059669',
              border: '1.5px solid #10b981',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle2 size={15} color="#059669" />
            <span>Complete Sprint</span>
          </button>
        </div>
      </div>

      {/* Velocity & Burndown Metric Ribbon */}
      <div style={{
        padding: '12px 24px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.82rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Total Points: </span>
            <span style={{ fontWeight: 800, color: '#0f172a' }}>{totalPoints} pts</span>
          </div>

          <div>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Completed: </span>
            <span style={{ fontWeight: 800, color: '#059669' }}>{completedPoints} pts ({percentComplete}%)</span>
          </div>

          <div>
            <span style={{ color: '#64748b', fontWeight: 600 }}>In Flight: </span>
            <span style={{ fontWeight: 800, color: '#2563eb' }}>{inProgressPoints} pts</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '320px' }}>
          <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${percentComplete}%`,
              height: '100%',
              backgroundColor: '#10b981',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669' }}>
            {percentComplete}% Burndown
          </span>
        </div>
      </div>

      {/* Main Agile Kanban Stage (4 Columns) */}
      <div style={{
        flex: 1,
        overflowX: 'auto',
        overflowY: 'hidden',
        padding: '20px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))',
        gap: '16px',
        backgroundColor: '#fafbfc'
      }}>
        {/* Column 1: OPEN / TO DO */}
        <div style={{
          backgroundColor: '#f1f5f9',
          borderRadius: '10px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#64748b' }} />
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1e293b' }}>OPEN</span>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>
                ({tasks.filter(t => t.status === 'OPEN').length})
              </span>
            </div>
            <button
              onClick={() => { setNewTaskStatus('OPEN'); setIsNewTaskOpen(true); }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', padding: '2px' }}
            >
              <Plus size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.filter(t => t.status === 'OPEN').map(task => (
              <div
                key={task.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                  {task.title}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      backgroundColor: '#ede9fe',
                      color: '#6d28d9',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {task.points} pts
                    </span>
                    <span style={{ color: task.priority === 'Urgent' ? '#e11d48' : '#ea580c', fontWeight: 700 }}>
                      ⚑ {task.priority}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#64748b' }}>📅 {task.dueDate}</span>
                    <button
                      onClick={() => handleMoveStatus(task.id, 'IN_PROGRESS')}
                      style={{
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#2563eb',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Start →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: IN PROGRESS */}
        <div style={{
          backgroundColor: '#eff6ff',
          borderRadius: '10px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          border: '1px solid #dbeafe'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1e40af' }}>IN PROGRESS</span>
              <span style={{ fontSize: '0.74rem', color: '#3b82f6', fontWeight: 700 }}>
                ({tasks.filter(t => t.status === 'IN_PROGRESS').length})
              </span>
            </div>
            <button
              onClick={() => { setNewTaskStatus('IN_PROGRESS'); setIsNewTaskOpen(true); }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb', padding: '2px' }}
            >
              <Plus size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.filter(t => t.status === 'IN_PROGRESS').map(task => (
              <div
                key={task.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid #bfdbfe',
                  borderLeft: '4px solid #2563eb',
                  boxShadow: '0 2px 6px rgba(37,99,235,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                  {task.title}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                      {task.points} pts
                    </span>
                    <span style={{ color: task.priority === 'Urgent' ? '#e11d48' : '#ea580c', fontWeight: 700 }}>
                      ⚑ {task.priority}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => handleMoveStatus(task.id, 'TESTING')}
                      style={{
                        backgroundColor: '#fef3c7',
                        border: '1px solid #fde68a',
                        color: '#d97706',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Review →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: TESTING / REVIEW */}
        <div style={{
          backgroundColor: '#fffbeb',
          borderRadius: '10px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          border: '1px solid #fef3c7'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706' }} />
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#b45309' }}>TESTING & REVIEW</span>
              <span style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 700 }}>
                ({tasks.filter(t => t.status === 'TESTING').length})
              </span>
            </div>
            <button
              onClick={() => { setNewTaskStatus('TESTING'); setIsNewTaskOpen(true); }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#d97706', padding: '2px' }}
            >
              <Plus size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.filter(t => t.status === 'TESTING').map(task => (
              <div
                key={task.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid #fde68a',
                  borderLeft: '4px solid #f59e0b',
                  boxShadow: '0 2px 6px rgba(245,158,11,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                  {task.title}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ backgroundColor: '#fffbeb', color: '#b45309', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                      {task.points} pts
                    </span>
                    <span style={{ color: task.priority === 'Urgent' ? '#e11d48' : '#ea580c', fontWeight: 700 }}>
                      ⚑ {task.priority}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => handleMoveStatus(task.id, 'DONE')}
                      style={{
                        backgroundColor: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#059669',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Complete ✔
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 4: DONE */}
        <div style={{
          backgroundColor: '#ecfdf5',
          borderRadius: '10px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          border: '1px solid #d1fae5'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }} />
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#065f46' }}>DONE</span>
              <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
                ({tasks.filter(t => t.status === 'DONE').length})
              </span>
            </div>
            <button
              onClick={() => { setNewTaskStatus('DONE'); setIsNewTaskOpen(true); }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#059669', padding: '2px' }}
            >
              <Plus size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.filter(t => t.status === 'DONE').map(task => (
              <div
                key={task.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid #a7f3d0',
                  borderLeft: '4px solid #10b981',
                  boxShadow: '0 1px 3px rgba(16,185,129,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#475569',
                  textDecoration: 'line-through',
                  lineHeight: 1.3
                }}>
                  {task.title}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <span style={{ backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                    {task.points} pts
                  </span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>
                    ✔ Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Add Task to Sprint */}
      {isNewTaskOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '440px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid #f1f3f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>
                Add Task to Sprint 52
              </div>
              <button onClick={() => setIsNewTaskOpen(false)} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTask} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement webhook retry mechanism"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.86rem',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Story Points
                  </label>
                  <select
                    value={newTaskPoints}
                    onChange={e => setNewTaskPoints(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  >
                    <option value={1}>1 point (Trivial)</option>
                    <option value={2}>2 points (Small)</option>
                    <option value={3}>3 points (Medium)</option>
                    <option value={5}>5 points (Large)</option>
                    <option value={8}>8 points (Complex)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  >
                    <option value="Urgent">🔴 Urgent</option>
                    <option value="High">🟠 High</option>
                    <option value="Normal">🔵 Normal</option>
                    <option value="Low">⚪ Low</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', backgroundColor: '#7c3aed', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                >
                  Add to Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
