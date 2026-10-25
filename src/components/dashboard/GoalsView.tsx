import React, { useState, useEffect } from 'react';
import {
  Target,
  Trophy,
  Rocket,
  Star,
  TrendingUp,
  Plus,
  CheckCircle2,
  Calendar,
  User,
  MoreHorizontal,
  ChevronRight,
  X,
  SlidersHorizontal,
  Search,
  Flag,
  Sparkles,
  Layers,
  ArrowUpRight,
  DollarSign,
  Check,
  Edit2,
  Trash2
} from 'lucide-react';
import { TaskItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

export interface GoalTarget {
  id: string;
  name: string;
  type: 'currency' | 'number' | 'tasks' | 'boolean';
  currentValue: number;
  targetValue: number;
  unit?: string;
}

export interface GoalItem {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerInitials: string;
  color: string;
  icon: string;
  dueDate: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
  targets: GoalTarget[];
}

const getDefaultGoals = (ownerName: string, ownerInitials: string): GoalItem[] => [
  {
    id: 'goal-1',
    name: 'Scale Q4 Enterprise Pipeline',
    description: 'Accelerate outbound sales CRM demos and close 12 key enterprise deals before year end.',
    owner: ownerName,
    ownerInitials: ownerInitials,
    color: '#7c3aed',
    icon: '🎯',
    dueDate: 'Dec 31, 2026',
    status: 'on_track',
    targets: [
      {
        id: 't-1',
        name: 'Generate Qualified Pipeline Value',
        type: 'currency',
        currentValue: 250000,
        targetValue: 1000000,
        unit: '$'
      },
      {
        id: 't-2',
        name: 'Enterprise Contracts Signed',
        type: 'number',
        currentValue: 3,
        targetValue: 12
      },
      {
        id: 't-3',
        name: 'Client Onboarding Satisfaction',
        type: 'number',
        currentValue: 94,
        targetValue: 100,
        unit: 'NPS'
      }
    ]
  }
];

export const GoalsView: React.FC<{ tasks?: TaskItem[] }> = ({ tasks = [] }) => {
  const { user } = useAuth();
  const currentUserName = user?.name || 'You';
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME';

  const [goals, setGoals] = useState<GoalItem[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_goals_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return getDefaultGoals(currentUserName, userInitials);
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'all' | 'my'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Goal Form State
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalColor, setNewGoalColor] = useState('#7c3aed');
  const [newGoalIcon, setNewGoalIcon] = useState('🎯');
  const [newGoalDueDate, setNewGoalDueDate] = useState('2026-12-31');
  const [newGoalTargetName, setNewGoalTargetName] = useState('Sprint Deliverables Completed');
  const [newGoalTargetType, setNewGoalTargetType] = useState<'currency' | 'number' | 'tasks'>('tasks');
  const [newGoalTargetVal, setNewGoalTargetVal] = useState(25);

  useEffect(() => {
    try {
      localStorage.setItem('clickup_goals_v1', JSON.stringify(goals));
    } catch {}
  }, [goals]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const calculateGoalProgress = (goal: GoalItem) => {
    if (!goal.targets || goal.targets.length === 0) return 0;
    const total = goal.targets.reduce((acc, t) => {
      const pct = Math.min(Math.round((t.currentValue / (t.targetValue || 1)) * 100), 100);
      return acc + pct;
    }, 0);
    return Math.round(total / goal.targets.length);
  };

  const handleCreateGoal = () => {
    if (!newGoalName.trim()) {
      showToast('Please enter a goal title');
      return;
    }

    const newG: GoalItem = {
      id: 'goal-' + Date.now(),
      name: newGoalName.trim(),
      description: newGoalDesc.trim() || 'Strategic high-level workspace milestone',
      owner: currentUserName,
      ownerInitials: userInitials,
      color: newGoalColor,
      icon: newGoalIcon,
      dueDate: newGoalDueDate,
      status: 'on_track',
      targets: [
        {
          id: 'tgt-' + Date.now(),
          name: newGoalTargetName.trim() || 'Target 1',
          type: newGoalTargetType,
          currentValue: 0,
          targetValue: Number(newGoalTargetVal) || 10,
          unit: newGoalTargetType === 'currency' ? '$' : undefined
        }
      ]
    };

    setGoals([newG, ...goals]);
    setIsNewGoalModalOpen(false);
    setNewGoalName('');
    setNewGoalDesc('');
    showToast(`Goal "${newG.name}" created successfully!`);
  };

  const handleUpdateTargetValue = (goalId: string, targetId: string, delta: number) => {
    setGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        targets: g.targets.map(t => {
          if (t.id !== targetId) return t;
          const newVal = Math.max(0, Math.min(t.currentValue + delta, t.targetValue));
          return { ...t, currentValue: newVal };
        })
      };
    }));
  };

  const handleDeleteGoal = (goalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGoals(goals.filter(g => g.id !== goalId));
    showToast('Goal deleted');
  };

  const filteredGoals = goals.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#fcfcfd', overflowY: 'auto' }}>
      {/* Top Header */}
      <div style={{
        padding: '16px 28px',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={15} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Goals
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                border: 'none',
                background: activeTab === 'overview' ? '#ffffff' : 'transparent',
                color: activeTab === 'overview' ? '#0f172a' : '#64748b',
                fontWeight: activeTab === 'overview' ? 700 : 500,
                fontSize: '0.8rem',
                padding: '4px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: activeTab === 'overview' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                border: 'none',
                background: activeTab === 'all' ? '#ffffff' : 'transparent',
                color: activeTab === 'all' ? '#0f172a' : '#64748b',
                fontWeight: activeTab === 'all' ? 700 : 500,
                fontSize: '0.8rem',
                padding: '4px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              All Goals ({goals.length})
            </button>
            <button
              onClick={() => setActiveTab('my')}
              style={{
                border: 'none',
                background: activeTab === 'my' ? '#ffffff' : 'transparent',
                color: activeTab === 'my' ? '#0f172a' : '#64748b',
                fontWeight: activeTab === 'my' ? 700 : 500,
                fontSize: '0.8rem',
                padding: '4px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: activeTab === 'my' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              My Goals ({goals.filter(g => g.owner === currentUserName).length})
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '6px 12px'
          }}>
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '0.8rem',
                color: '#1e293b',
                width: '160px'
              }}
            />
          </div>

          {/* Set a Goal Button */}
          <button
            onClick={() => setIsNewGoalModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 16px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
            }}
          >
            <Plus size={15} />
            <span>Set a Goal</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ padding: '32px 36px', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* Screenshot 7 1:1 Hero Section: "Make your goals a reality." */}
        <div style={{
          textAlign: 'center',
          marginBottom: '36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: '#0f172a',
            margin: '0 0 10px 0',
            letterSpacing: '-0.02em'
          }}>
            Make your goals a reality.
          </h2>
          <p style={{
            fontSize: '0.96rem',
            color: '#64748b',
            margin: '0 0 28px 0',
            maxWidth: '540px',
            lineHeight: 1.5
          }}>
            Connect your daily tasks to high-level strategic objectives with auto-calculated sprint targets, milestone tracking, and OKRs.
          </p>

          {/* Screenshot 7 Center Card Mockup with 20% Circular Progress */}
          <div style={{
            width: '100%',
            maxWidth: '540px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #eaebf0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            padding: '24px',
            textAlign: 'left',
            position: 'relative'
          }}>
            {/* Header of Mockup Card */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>🎯</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Q4 Strategic Growth & Sales
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Sprint Cycle 4 • Target Due Dec 31
                  </span>
                </div>
              </div>

              <span style={{
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '12px',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                On Track
              </span>
            </div>

            {/* Circular Progress & Targets Breakdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '18px' }}>
              {/* Circular Gauge */}
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                <svg width="90" height="90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="3.8"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="3.8"
                    strokeDasharray="20, 100"
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>20%</span>
                  <span style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase' }}>Done</span>
                </div>
              </div>

              {/* Progress lines */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Pipeline Revenue</span>
                    <span style={{ fontWeight: 700, color: '#7c3aed' }}>$250k / $1.2M</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '21%', height: '100%', backgroundColor: '#7c3aed', borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Active Sprint Tasks</span>
                    <span style={{ fontWeight: 700, color: '#0ea5e9' }}>12 / 60 tasks</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '20%', height: '100%', backgroundColor: '#0ea5e9', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar inside mockup card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #f1f5f9',
              paddingTop: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {userInitials}
                </div>
                <span style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>{currentUserName} (Lead)</span>
              </div>

              <button
                type="button"
                onClick={() => setIsNewGoalModalOpen(true)}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={13} />
                <span>Set a Goal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Workspace Goals Section */}
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Active Objectives & Key Results ({filteredGoals.length})
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Target metrics updated in real time as tasks are completed
              </p>
            </div>

            <button
              onClick={() => setIsNewGoalModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Add Goal</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredGoals.map(goal => {
              const progress = calculateGoalProgress(goal);
              return (
                <div
                  key={goal.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '14px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'box-shadow 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'}
                >
                  {/* Goal Top Row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{goal.icon}</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                          {goal.name}
                        </h4>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                          {goal.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                        {goal.status.replace('_', ' ').toUpperCase()}
                      </span>

                      <button
                        onClick={e => handleDeleteGoal(goal.id, e)}
                        title="Delete Goal"
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Overall Goal Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>Overall Progress</span>
                      <span style={{ fontWeight: 800, color: goal.color }}>{progress}% Complete</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: goal.color,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  {/* Targets Breakdown */}
                  <div style={{
                    backgroundColor: '#fafbfc',
                    border: '1px solid #f1f5f9',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                      Key Results / Targets
                    </span>

                    {goal.targets.map(target => {
                      const targetPct = Math.min(Math.round((target.currentValue / (target.targetValue || 1)) * 100), 100);
                      return (
                        <div key={target.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                              <span style={{ fontWeight: 600, color: '#1e293b' }}>{target.name}</span>
                              <span style={{ fontWeight: 700, color: '#475569' }}>
                                {target.unit === '$' && '$'}
                                {target.currentValue.toLocaleString()} / {target.unit === '$' && '$'}{target.targetValue.toLocaleString()} {target.unit && target.unit !== '$' ? target.unit : ''} ({targetPct}%)
                              </span>
                            </div>
                            <div style={{ height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${targetPct}%`, height: '100%', backgroundColor: goal.color, borderRadius: '3px' }} />
                            </div>
                          </div>

                          {/* Quick Increment Buttons */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateTargetValue(goal.id, target.id, target.type === 'currency' ? 25000 : 1)}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#1e293b',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              + {target.type === 'currency' ? '$25k' : '1'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer metadata */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {goal.ownerInitials}
                      </div>
                      <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Owner: {goal.owner}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#64748b' }}>
                      <Calendar size={13} />
                      <span>Due {goal.dueDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Set a Goal Modal */}
      {isNewGoalModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3800
        }}>
          <div style={{
            width: '480px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color="#7c3aed" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Create Strategic Goal
                </h3>
              </div>
              <button
                onClick={() => setIsNewGoalModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Goal Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Goal Name
              </label>
              <input
                type="text"
                placeholder="e.g. Expand Market Share in Enterprise Deals"
                value={newGoalName}
                onChange={e => setNewGoalName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.86rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Objective & Scope
              </label>
              <textarea
                placeholder="Outline why this goal is important and key success criteria..."
                value={newGoalDesc}
                onChange={e => setNewGoalDesc(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Icon & Color selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Icon
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['🎯', '🚀', '🏆', '📈', '⭐'].map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewGoalIcon(ic)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: newGoalIcon === ic ? '#7c3aed' : '#e2e8f0',
                        backgroundColor: newGoalIcon === ic ? '#f5f3ff' : '#ffffff',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Target Due Date
                </label>
                <input
                  type="date"
                  value={newGoalDueDate}
                  onChange={e => setNewGoalDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Key Result target definition */}
            <div style={{
              backgroundColor: '#fafbfc',
              border: '1px solid #f1f5f9',
              borderRadius: '10px',
              padding: '12px'
            }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '8px' }}>
                Primary Key Result (Target)
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Target description (e.g. Active sprint tickets delivered)"
                  value={newGoalTargetName}
                  onChange={e => setNewGoalTargetName(e.target.value)}
                  style={{
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />

                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={newGoalTargetType}
                    onChange={e => setNewGoalTargetType(e.target.value as any)}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="tasks">Tasks Completed</option>
                    <option value="currency">Currency ($)</option>
                    <option value="number">Number Metric</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Target value"
                    value={newGoalTargetVal}
                    onChange={e => setNewGoalTargetVal(Number(e.target.value))}
                    style={{
                      width: '110px',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsNewGoalModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateGoal}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)'
                }}
              >
                Set Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '8px',
          fontSize: '0.84rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          zIndex: 4000
        }}>
          <CheckCircle2 size={16} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
