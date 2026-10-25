import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause,
  Square, 
  Clock, 
  Plus, 
  Calendar, 
  BarChart2, 
  CheckCircle2, 
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  SlidersHorizontal,
  X,
  Tag,
  DollarSign,
  Archive,
  Layers,
  Sparkles,
  Users,
  Copy,
  Target,
  Edit2,
  ArrowRight,
  Check,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { TaskItem } from '../../types';

export interface TimeEntryItem {
  id: string;
  taskId: string;
  taskTitle: string;
  taskKey: string;
  durationSeconds: number; // in seconds
  dateStr: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  startTime: string;
  endTime: string;
  notes: string;
  tags: string[];
  billable: boolean;
  user: string;
}

export interface TimesheetApprovalSubmission {
  id: string;
  userName: string;
  userInitials: string;
  userAvatarBg: string;
  userRole: string;
  weekRange: string;
  trackedSeconds: number;
  capacityHours: number;
  billableSeconds: number;
  overCapacitySeconds: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

export interface TeamMemberTimesheet {
  id: string;
  name: string;
  initials: string;
  capacityHours: number;
  dailyHours: number[]; // 7 days: Sun, Mon, Tue, Wed, Thu, Fri, Sat
}

interface TimesheetViewProps {
  tasks: TaskItem[];
  initialSubTab?: 'my' | 'all' | 'approvals';
  tourStep?: number;
  onSetTourStep?: (step: number) => void;
  onOpenTrackTimeModal?: () => void;
}

export const TimesheetView: React.FC<TimesheetViewProps> = ({ 
  tasks, 
  initialSubTab = 'my',
  tourStep: propTourStep,
  onSetTourStep,
  onOpenTrackTimeModal
}) => {
  // Navigation: My timesheet, All timesheets, Approvals (Screenshots 1, 2, 3)
  const [topTab, setTopTab] = useState<'my' | 'all' | 'approvals'>(initialSubTab);
  const [viewMode, setViewMode] = useState<'timesheet' | 'entries'>('timesheet');
  const [hideWeekends, setHideWeekends] = useState(false);

  // Filters
  const [billableFilter, setBillableFilter] = useState<'all' | 'billable' | 'non-billable'>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('All members');
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);

  // Multi-Step Onboarding Tour (Screenshots 3, 4, 5, and new batch 1, 2)
  // Step 1: Popover above center (Screenshot 3)
  // Step 2: Popover above Individual tasks card (Screenshot 4)
  // Step 3: Popover below Approvals tab (Screenshot 5)
  // Step 4: Popover below Global Track Time button in header (New Screenshot 1)
  // 0: Tour completed/dismissed
  const [internalTourStep, setInternalTourStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('clickup_timesheet_tour_v2');
      if (saved === 'completed') return 0;
      return 1;
    } catch {
      return 1;
    }
  });

  const tourStep = propTourStep !== undefined ? propTourStep : internalTourStep;

  // Time Entries State
  const [entries, setEntries] = useState<TimeEntryItem[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_time_entries_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Active Timesheet Task Rows (for Timesheet Grid)
  const [timesheetTaskIds, setTimesheetTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_timesheet_tasks_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Team Members for "All timesheets" (Screenshot 1: /time/team)
  const [teamTimesheets, setTeamTimesheets] = useState<TeamMemberTimesheet[]>([
    {
      id: 'mem-joy',
      name: 'Joy Kumar Yuv',
      initials: 'JY',
      capacityHours: 40,
      dailyHours: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      id: 'mem-alex',
      name: 'Alex Rivera',
      initials: 'AR',
      capacityHours: 40,
      dailyHours: [0, 8, 8, 7.5, 8, 8, 0]
    },
    {
      id: 'mem-sarah',
      name: 'Sarah Chen',
      initials: 'SC',
      capacityHours: 40,
      dailyHours: [0, 8, 8, 8, 8, 8, 0]
    },
    {
      id: 'mem-emma',
      name: 'Emma Davis',
      initials: 'ED',
      capacityHours: 40,
      dailyHours: [0, 7, 8, 8, 8, 7, 0]
    }
  ]);

  // Approvals State (Screenshot 2: /time/approvals)
  const [approvalsList, setApprovalsList] = useState<TimesheetApprovalSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_approvals_submissions_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [isSetupApprovalsModalOpen, setIsSetupApprovalsModalOpen] = useState(false);
  const [approvalApprover, setApprovalApprover] = useState('Joy Kumar Yuv (Workspace Owner)');
  const [approvalDeadline, setApprovalDeadline] = useState('Every Friday at 5:00 PM');
  const [autoApproveEnabled, setAutoApproveEnabled] = useState(true);

  // New Entry / Timer Modal State (Screenshot 5)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTimeInput, setModalTimeInput] = useState('');
  const [modalSelectedTaskId, setModalSelectedTaskId] = useState<string>('');
  const [modalNotes, setModalNotes] = useState('');
  const [modalTags, setModalTags] = useState<string[]>(['Development']);
  const [modalBillable, setModalBillable] = useState(true);
  const [modalDate, setModalDate] = useState('Sun, Oct 25');
  const [modalStartTime, setModalStartTime] = useState('09:00 am');
  const [modalEndTime, setModalEndTime] = useState('11:30 am');

  // Live Stopwatch inside Modal
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clickup_time_entries_v1', JSON.stringify(entries));
    } catch (e) {}
  }, [entries]);

  useEffect(() => {
    try {
      localStorage.setItem('clickup_timesheet_tasks_v1', JSON.stringify(timesheetTaskIds));
    } catch (e) {}
  }, [timesheetTaskIds]);

  useEffect(() => {
    try {
      localStorage.setItem('clickup_approvals_submissions_v1', JSON.stringify(approvalsList));
    } catch (e) {}
  }, [approvalsList]);

  // Update Joy Kumar Yuv's daily hours in team sheet based on actual entries
  useEffect(() => {
    const joyDaily = [0, 0, 0, 0, 0, 0, 0];
    entries.forEach(e => {
      if (e.dayOfWeek >= 0 && e.dayOfWeek <= 6) {
        joyDaily[e.dayOfWeek] += Math.round((e.durationSeconds / 3600) * 10) / 10;
      }
    });

    setTeamTimesheets(prev => prev.map(m => {
      if (m.name === 'Joy Kumar Yuv') {
        return { ...m, dailyHours: joyDaily };
      }
      return m;
    }));
  }, [entries]);

  // Stopwatch interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Format seconds to hh:mm:ss or Xh Ym
  const formatStopwatch = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTimeToSeconds = (input: string): number => {
    if (!input.trim()) return 0;
    let totalSec = 0;
    const hMatch = input.match(/(\d+(?:\.\d+)?)\s*h/i);
    const mMatch = input.match(/(\d+)\s*m/i);
    const colonMatch = input.match(/^(\d+):(\d+)$/);

    if (colonMatch) {
      totalSec = parseInt(colonMatch[1]) * 3600 + parseInt(colonMatch[2]) * 60;
    } else if (hMatch || mMatch) {
      if (hMatch) totalSec += parseFloat(hMatch[1]) * 3600;
      if (mMatch) totalSec += parseInt(mMatch[1]) * 60;
    } else {
      const num = parseFloat(input);
      if (!isNaN(num)) totalSec = num * 3600;
    }
    return Math.round(totalSec);
  };

  const formatSecondsToDisplay = (totalSec: number): string => {
    if (!totalSec) return '0h';
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${mins}m`;
  };

  // Tour dismiss / advance
  const handleAdvanceTour = (nextStep: number) => {
    setInternalTourStep(nextStep);
    if (onSetTourStep) onSetTourStep(nextStep);
    if (nextStep === 0) {
      try {
        localStorage.setItem('clickup_timesheet_tour_v2', 'completed');
      } catch {}
      showToast('Tour completed! You are ready to track time.');
    }
  };

  const handleDismissTour = () => {
    setInternalTourStep(0);
    if (onSetTourStep) onSetTourStep(0);
    try {
      localStorage.setItem('clickup_timesheet_tour_v2', 'completed');
    } catch {}
  };

  // Add all assigned tasks to timesheet (Card 1)
  const handleAddAllAssignedTasks = () => {
    const taskIds = tasks.map(t => t.id);
    setTimesheetTaskIds(Array.from(new Set([...timesheetTaskIds, ...taskIds])));
    showToast(`Added ${tasks.length} workspace tasks to this week's timesheet!`);
  };

  // Copy last week's tasks (Card 2)
  const handleCopyLastWeekTasks = () => {
    const sampleIds = tasks.slice(0, 3).map(t => t.id);
    setTimesheetTaskIds(Array.from(new Set([...timesheetTaskIds, ...sampleIds])));
    showToast("Cloned 3 tasks from previous week's timesheet!");
  };

  // Add individual task (Card 3)
  const handleOpenIndividualTaskModal = () => {
    if (tasks.length > 0) {
      setModalSelectedTaskId(tasks[0].id);
    }
    setIsModalOpen(true);
  };

  // Track Time / New Entry (Card 4 & Screenshot 4 button)
  const handleOpenTrackTimeModal = () => {
    if (tasks.length > 0 && !modalSelectedTaskId) {
      setModalSelectedTaskId(tasks[0].id);
    }
    setModalTimeInput('');
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setIsModalOpen(true);
  };

  // Save Entry from Modal (Screenshot 5)
  const handleSaveModalEntry = () => {
    let dur = timerSeconds;
    if (dur === 0) {
      dur = parseTimeToSeconds(modalTimeInput);
    }

    if (dur === 0) {
      showToast('Please enter tracked time or start the timer');
      return;
    }

    const taskObj = tasks.find(t => t.id === modalSelectedTaskId) || tasks[0] || {
      id: 'task-gen',
      title: 'General Project Time',
      key: 'CRM-100'
    };

    const newEntry: TimeEntryItem = {
      id: 'te-' + Date.now(),
      taskId: taskObj.id,
      taskTitle: taskObj.title,
      taskKey: taskObj.key || 'CRM-101',
      durationSeconds: dur,
      dateStr: '2026-10-25',
      dayOfWeek: 0, // Sunday
      startTime: modalStartTime,
      endTime: modalEndTime,
      notes: modalNotes.trim(),
      tags: modalTags,
      billable: modalBillable,
      user: 'Joy Kumar Yuv'
    };

    setEntries([newEntry, ...entries]);

    if (!timesheetTaskIds.includes(taskObj.id)) {
      setTimesheetTaskIds([...timesheetTaskIds, taskObj.id]);
    }

    setIsModalOpen(false);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setModalTimeInput('');
    setModalNotes('');
    showToast(`Saved ${formatSecondsToDisplay(dur)} for "${taskObj.title}"!`);
  };

  // Add hours directly in Timesheet Grid Cell
  const handleCellTimeChange = (taskId: string, dayIdx: number, val: string) => {
    const sec = parseTimeToSeconds(val);
    const taskObj = tasks.find(t => t.id === taskId);
    if (!taskObj) return;

    const otherEntries = entries.filter(e => !(e.taskId === taskId && e.dayOfWeek === dayIdx));

    if (sec > 0) {
      const newE: TimeEntryItem = {
        id: 'te-' + Date.now(),
        taskId: taskObj.id,
        taskTitle: taskObj.title,
        taskKey: taskObj.key || 'CRM-101',
        durationSeconds: sec,
        dateStr: '2026-10-25',
        dayOfWeek: dayIdx,
        startTime: '09:00 am',
        endTime: '05:00 pm',
        notes: 'Logged via Timesheet grid',
        tags: ['Development'],
        billable: true,
        user: 'Joy Kumar Yuv'
      };
      setEntries([newE, ...otherEntries]);
    } else {
      setEntries(otherEntries);
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    showToast('Time entry deleted');
  };

  // Submit timesheet for approval
  const handleSubmitTimesheetForApproval = () => {
    const totalSec = entries.reduce((acc, e) => acc + e.durationSeconds, 0);
    const billableSec = entries.filter(e => e.billable).reduce((acc, e) => acc + e.durationSeconds, 0);

    const newSub: TimesheetApprovalSubmission = {
      id: 'sub-' + Date.now(),
      userName: 'Joy Kumar Yuv',
      userInitials: 'JY',
      userAvatarBg: '#0f172a',
      userRole: 'Founder & Workspace Owner',
      weekRange: 'Oct 25 - Oct 31',
      trackedSeconds: totalSec || 144000, // 40h fallback if 0
      capacityHours: 40,
      billableSeconds: billableSec || 129600, // 36h
      overCapacitySeconds: 0,
      status: 'pending',
      submittedDate: 'Today at 11:25 AM'
    };

    setApprovalsList([newSub, ...approvalsList]);
    setTopTab('approvals');
    showToast('Weekly timesheet successfully submitted for approval!');
  };

  // Approve or Reject Submission
  const handleReviewSubmission = (id: string, newStatus: 'approved' | 'rejected') => {
    setApprovalsList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    showToast(newStatus === 'approved' ? 'Timesheet Approved ✓' : 'Timesheet Rejected ✕');
  };

  // Days columns
  const allDays = [
    { label: 'Sun', date: '25', fullLabel: 'Sun, Oct 25', idx: 0, isWeekend: true },
    { label: 'Mon', date: '26', fullLabel: 'Mon, Oct 26', idx: 1, isWeekend: false },
    { label: 'Tue', date: '27', fullLabel: 'Tue, Oct 27', idx: 2, isWeekend: false },
    { label: 'Wed', date: '28', fullLabel: 'Wed, Oct 28', idx: 3, isWeekend: false },
    { label: 'Thu', date: '29', fullLabel: 'Thu, Oct 29', idx: 4, isWeekend: false },
    { label: 'Fri', date: '30', fullLabel: 'Fri, Oct 30', idx: 5, isWeekend: false },
    { label: 'Sat', date: '31', fullLabel: 'Sat, Oct 31', idx: 6, isWeekend: true }
  ];

  const visibleDays = hideWeekends ? allDays.filter(d => !d.isWeekend) : allDays;

  // Filtered entries for list view
  const filteredEntries = entries.filter(e => {
    if (billableFilter === 'billable' && !e.billable) return false;
    if (billableFilter === 'non-billable' && e.billable) return false;
    if (selectedTagFilter !== 'all' && !e.tags.includes(selectedTagFilter)) return false;
    return true;
  });

  const getDayTotalSeconds = (dayIdx: number) => {
    return entries
      .filter(e => e.dayOfWeek === dayIdx)
      .reduce((sum, e) => sum + e.durationSeconds, 0);
  };

  const getTotalWeekSeconds = () => {
    return entries.reduce((sum, e) => sum + e.durationSeconds, 0);
  };

  // Filter team members in "All timesheets"
  const filteredTeamMembers = teamTimesheets.filter(m => {
    if (selectedMemberFilter === 'All members') return true;
    return m.name === selectedMemberFilter;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#ffffff', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '10px',
          fontSize: '0.84rem',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={16} color="#c084fc" />
          {toastMessage}
        </div>
      )}

      {/* TOP HEADER: Timesheets Tabs (Screenshots 1, 2, 3) */}
      <div style={{
        height: '48px',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
        backgroundColor: '#ffffff',
        position: 'relative'
      }}>
        {/* Left Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 800, fontSize: '0.94rem' }}>
            <Clock size={18} color="#7c3aed" />
            <span>Timesheets</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '100%', marginLeft: '12px' }}>
            {/* My timesheet tab */}
            <button
              onClick={() => setTopTab('my')}
              style={{
                background: 'none',
                border: 'none',
                height: '100%',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: topTab === 'my' ? 700 : 500,
                color: topTab === 'my' ? '#0f172a' : '#64748b',
                borderBottom: topTab === 'my' ? '2px solid #0f172a' : '2px solid transparent',
                padding: '0 4px',
                transition: 'all 0.15s ease'
              }}
            >
              My timesheet
            </button>

            {/* All timesheets tab (Screenshot 1: /time/team) */}
            <button
              onClick={() => setTopTab('all')}
              style={{
                background: 'none',
                border: 'none',
                height: '100%',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: topTab === 'all' ? 700 : 500,
                color: topTab === 'all' ? '#0f172a' : '#64748b',
                borderBottom: topTab === 'all' ? '2px solid #0f172a' : '2px solid transparent',
                padding: '0 4px',
                transition: 'all 0.15s ease'
              }}
            >
              All timesheets
            </button>

            {/* Approvals tab (Screenshot 2 & Tour Step 3 in Screenshot 5) */}
            <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setTopTab('approvals')}
                style={{
                  background: tourStep === 3 ? '#ffffff' : 'none',
                  border: 'none',
                  height: tourStep === 3 ? '32px' : '100%',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: topTab === 'approvals' ? 700 : 500,
                  color: topTab === 'approvals' ? '#0f172a' : '#64748b',
                  borderBottom: (topTab === 'approvals' && tourStep !== 3) ? '2px solid #0f172a' : '2px solid transparent',
                  padding: tourStep === 3 ? '0 12px' : '0 4px',
                  borderRadius: tourStep === 3 ? '6px' : '0',
                  boxShadow: tourStep === 3 ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
                  zIndex: tourStep === 3 ? 120 : 'auto',
                  transition: 'all 0.15s ease'
                }}
              >
                Approvals
                {approvalsList.filter(a => a.status === 'pending').length > 0 && (
                  <span style={{
                    marginLeft: '6px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    padding: '1px 6px',
                    borderRadius: '10px'
                  }}>
                    {approvalsList.filter(a => a.status === 'pending').length}
                  </span>
                )}
              </button>

              {/* TOUR STEP 3 POPOVER (Screenshot 5) */}
              {tourStep === 3 && (
                <div style={{
                  position: 'absolute',
                  top: '46px',
                  left: '0',
                  width: '260px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  zIndex: 200
                }}>
                  {/* Upward beak pointing to Approvals tab */}
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    left: '26px',
                    transform: 'rotate(45deg)',
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#0f172a'
                  }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#f8fafc', lineHeight: 1.45, fontWeight: 500 }}>
                      Manage timesheet <b>submissions and approvals</b> here.
                    </p>
                    <button
                      onClick={handleDismissTour}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0', flexShrink: 0 }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button
                      onClick={() => handleAdvanceTour(4)}
                      style={{
                        backgroundColor: '#334155',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Settings & Tour Replay */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {tourStep === 0 && (
            <button
              onClick={() => handleAdvanceTour(1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#7c3aed',
                fontSize: '0.76rem',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '6px'
              }}
              title="Re-run interactive tour"
            >
              Tour Guide 👾
            </button>
          )}

          <button
            onClick={() => setIsSetupApprovalsModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '6px'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Settings size={15} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUB-HEADER: Date Range, Filters, View Toggles (Screenshot 1, 3) */}
      {/* ============================================================== */}
      {topTab !== 'approvals' && (
        <div style={{
          height: '46px',
          borderBottom: '1px solid #eaebf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          backgroundColor: '#fafbfc'
        }}>
          {/* Left: Week Navigator & Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Week picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => showToast('Viewing previous week')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px 4px' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => showToast('Viewing next week')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px 4px' }}
              >
                <ChevronRight size={16} />
              </button>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
                marginLeft: '4px'
              }}>
                <span>Oct 25 - Oct 31</span>
                <ChevronDown size={14} color="#64748b" />
              </div>
            </div>

            <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0' }} />

            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => {
                  setBillableFilter(f => f === 'all' ? 'billable' : f === 'billable' ? 'non-billable' : 'all');
                  showToast(`Filter: ${billableFilter === 'all' ? 'Billable Only' : billableFilter === 'billable' ? 'Non-billable Only' : 'All'}`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: billableFilter !== 'all' ? '#f5f3ff' : '#ffffff',
                  color: billableFilter !== 'all' ? '#7c3aed' : '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <span>$</span>
                <span>Billable status</span>
                {billableFilter !== 'all' && <span style={{ fontWeight: 800 }}>•</span>}
              </button>

              <button
                onClick={() => {
                  setSelectedTagFilter(t => t === 'all' ? 'Development' : t === 'Development' ? 'Design' : 'all');
                  showToast(`Tag Filter: ${selectedTagFilter === 'all' ? 'Development' : selectedTagFilter === 'Development' ? 'Design' : 'All'}`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: selectedTagFilter !== 'all' ? '#f5f3ff' : '#ffffff',
                  color: selectedTagFilter !== 'all' ? '#7c3aed' : '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Tag size={12} />
                <span>Tag</span>
                {selectedTagFilter !== 'all' && <span style={{ fontWeight: 800 }}>: {selectedTagFilter}</span>}
              </button>

              <button
                onClick={() => showToast('Tracked time filter applied')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Clock size={12} />
                <span>Tracked time</span>
              </button>

              <button
                onClick={() => {
                  setShowArchived(!showArchived);
                  showToast(showArchived ? 'Hidden archived tasks' : 'Showing archived tasks');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: showArchived ? '#f5f3ff' : '#ffffff',
                  color: showArchived ? '#7c3aed' : '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Archive size={12} />
                <span>Archived tasks</span>
              </button>
            </div>
          </div>

          {/* Right: Members Filter in "All timesheets" vs View Mode in "My timesheet" */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {topTab === 'all' ? (
              /* Screenshot 1 Right: All members dropdown */
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <span>{selectedMemberFilter}</span>
                  <ChevronDown size={14} color="#64748b" />
                </button>

                {isMemberDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '32px',
                    right: 0,
                    width: '160px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: '1px solid #e2e8f0',
                    zIndex: 60,
                    padding: '4px'
                  }}>
                    {['All members', 'Joy Kumar Yuv', 'Alex Rivera', 'Sarah Chen', 'Emma Davis'].map(m => (
                      <div
                        key={m}
                        onClick={() => {
                          setSelectedMemberFilter(m);
                          setIsMemberDropdownOpen(false);
                          showToast(`Filtered by ${m}`);
                        }}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: selectedMemberFilter === m ? 700 : 500,
                          color: selectedMemberFilter === m ? '#7c3aed' : '#334155',
                          backgroundColor: selectedMemberFilter === m ? '#f5f3ff' : 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Hide weekends toggle switch (Screenshot 1 & 3) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>Hide weekends</span>
              <div
                onClick={() => setHideWeekends(!hideWeekends)}
                style={{
                  width: '32px',
                  height: '18px',
                  borderRadius: '10px',
                  backgroundColor: hideWeekends ? '#7c3aed' : '#cbd5e1',
                  padding: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: hideWeekends ? 'flex-end' : 'flex-start',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }} />
              </div>
            </div>

            {/* Segmented Button: Timesheet / Time entries (Only in "My timesheet") */}
            {topTab === 'my' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                padding: '2px'
              }}>
                <button
                  onClick={() => setViewMode('timesheet')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: viewMode === 'timesheet' ? '#ffffff' : 'transparent',
                    boxShadow: viewMode === 'timesheet' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    color: viewMode === 'timesheet' ? '#0f172a' : '#64748b',
                    fontSize: '0.76rem',
                    fontWeight: viewMode === 'timesheet' ? 700 : 500,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Layers size={13} />
                  <span>Timesheet</span>
                </button>

                <button
                  onClick={() => setViewMode('entries')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: viewMode === 'entries' ? '#ffffff' : 'transparent',
                    boxShadow: viewMode === 'entries' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    color: viewMode === 'entries' ? '#0f172a' : '#64748b',
                    fontSize: '0.76rem',
                    fontWeight: viewMode === 'entries' ? 700 : 500,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <BarChart2 size={13} />
                  <span>Time entries</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: ALL TIMESHEETS VIEW (Screenshot 1: /time/team)           */}
      {/* ============================================================== */}
      {topTab === 'all' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eaebf0',
            borderRadius: '10px',
            marginTop: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            {/* Header row matching Screenshot 1 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `minmax(220px, 1.8fr) repeat(${visibleDays.length}, minmax(70px, 1fr)) 100px`,
              borderBottom: '1px solid #eaebf0',
              backgroundColor: '#fafbfc',
              padding: '10px 16px',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#64748b'
            }}>
              <div>People ({filteredTeamMembers.length})</div>
              {visibleDays.map(d => (
                <div key={d.idx} style={{ textAlign: 'center' }}>
                  {d.fullLabel}
                </div>
              ))}
              <div style={{ textAlign: 'center' }}>Total</div>
            </div>

            {/* People Rows */}
            {filteredTeamMembers.map((member) => {
              const totalLogged = visibleDays.reduce((acc, d) => acc + member.dailyHours[d.idx], 0);

              return (
                <div
                  key={member.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `minmax(220px, 1.8fr) repeat(${visibleDays.length}, minmax(70px, 1fr)) 100px`,
                    borderBottom: '1px solid #f1f5f9',
                    padding: '12px 16px',
                    alignItems: 'center',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafbfc'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  {/* Left Column: Avatar + Name + 40h + [ Open → ] */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {member.initials}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
                          {member.capacityHours}h
                        </div>
                      </div>
                    </div>

                    {/* Screenshot 1: [ Open → ] Button */}
                    <button
                      onClick={() => {
                        setTopTab('my');
                        showToast(`Viewing detailed timesheet for ${member.name}`);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#c084fc'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                      <span>Open</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Day Columns (e.g. 0h) */}
                  {visibleDays.map(d => {
                    const hrs = member.dailyHours[d.idx];
                    return (
                      <div key={d.idx} style={{ textAlign: 'center', fontSize: '0.8rem', color: hrs > 0 ? '#0f172a' : '#64748b', fontWeight: hrs > 0 ? 700 : 400 }}>
                        {hrs}h
                      </div>
                    );
                  })}

                  {/* Total Column (Screenshot 1: 0h with subtle light grey block) */}
                  <div style={{
                    textAlign: 'center',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: totalLogged > 0 ? '#0f172a' : '#64748b',
                    backgroundColor: '#f8fafc',
                    padding: '4px 0',
                    borderRadius: '4px'
                  }}>
                    {totalLogged}h
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: APPROVALS VIEW (Screenshot 2: /time/approvals)          */}
      {/* ============================================================== */}
      {topTab === 'approvals' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Section Title */}
          <h2 style={{
            margin: '0 0 20px 0',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            Timesheet Approvals
          </h2>

          {/* Approvals Table Container */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eaebf0',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            {/* Table Header (Screenshot 2) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(240px, 2.5fr) 120px 120px 120px 120px 160px',
              borderBottom: '1px solid #eaebf0',
              backgroundColor: '#fafbfc',
              padding: '12px 20px',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#64748b'
            }}>
              <div>Details</div>
              <div>Tracked</div>
              <div>Capacity</div>
              <div>Billable</div>
              <div>Over capacity</div>
              <div style={{ textAlign: 'right' }}>Review</div>
            </div>

            {/* Empty State when no submissions (Screenshot 2) */}
            {approvalsList.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 20px'
              }}>
                {/* Squircle Dashed Clock/Checkmark Icon (Screenshot 2) */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8.5" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="3 3" />
                    <polyline points="9 12 11 14 15 10" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  No submissions to review
                </div>

                <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '22px' }}>
                  Pending approvals will appear here.
                </div>

                {/* Screenshot 2: [ Setup Timesheet approvals ] Button */}
                <button
                  onClick={() => setIsSetupApprovalsModalOpen(true)}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e293b'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0f172a'}
                >
                  Setup Timesheet approvals
                </button>
              </div>
            ) : (
              /* Submissions Rows */
              <div>
                {approvalsList.map(sub => (
                  <div
                    key={sub.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(240px, 2.5fr) 120px 120px 120px 120px 160px',
                      borderBottom: '1px solid #f1f5f9',
                      padding: '14px 20px',
                      alignItems: 'center'
                    }}
                  >
                    {/* Details Column */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: sub.userAvatarBg,
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {sub.userInitials}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                          {sub.userName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {sub.weekRange} • {sub.submittedDate}
                        </div>
                      </div>
                    </div>

                    {/* Tracked */}
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                      {formatSecondsToDisplay(sub.trackedSeconds)}
                    </div>

                    {/* Capacity */}
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {sub.capacityHours}h
                    </div>

                    {/* Billable */}
                    <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600 }}>
                      {formatSecondsToDisplay(sub.billableSeconds)}
                    </div>

                    {/* Over Capacity */}
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {formatSecondsToDisplay(sub.overCapacitySeconds)}
                    </div>

                    {/* Review Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      {sub.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleReviewSubmission(sub.id, 'approved')}
                            style={{
                              backgroundColor: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReviewSubmission(sub.id, 'rejected')}
                            style={{
                              backgroundColor: '#ffffff',
                              color: '#ef4444',
                              border: '1px solid #fecaca',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: sub.status === 'approved' ? '#dcfce7' : '#fee2e2',
                          color: sub.status === 'approved' ? '#16a34a' : '#ef4444'
                        }}>
                          {sub.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: MY TIMESHEET VIEW (Screenshots 3, 4, 5)                  */}
      {/* ============================================================== */}
      {topTab === 'my' && (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* STEP 1 ONBOARDING POPOVER (Screenshot 3) */}
          {tourStep === 1 && (
            <div style={{
              position: 'absolute',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '320px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Test</span>
                <button
                  onClick={handleDismissTour}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={15} />
                </button>
              </div>

              <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                You can view and update all of your time entries 👾 here. Let us show you around.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleAdvanceTour(2)}
                  style={{
                    backgroundColor: '#334155',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Let's go
                </button>
              </div>

              {/* Popover Arrow pointing down */}
              <div style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                width: '12px',
                height: '12px',
                backgroundColor: '#0f172a'
              }} />
            </div>
          )}

          {/* VIEW MODE 1: TIMESHEET GRID */}
          {viewMode === 'timesheet' && (
            timesheetTaskIds.length === 0 ? (
              /* Screenshot 3: Empty State with 4 Action Cards */
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 24px',
                position: 'relative'
              }}>
                {/* Center Stopwatch Icon with Plus */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  marginBottom: '16px'
                }}>
                  <Clock size={32} color="#94a3b8" strokeWidth={1.5} />
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#64748b'
                  }}>
                    +
                  </div>
                </div>

                <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', marginBottom: '28px' }}>
                  Add entries to this week's timesheet
                </div>

                {/* 4 Cards Row (Screenshot 3 & Tour Step 2 in Screenshot 4) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 180px)', gap: '14px', position: 'relative' }}>
                  {/* 1. All assigned tasks */}
                  <div
                    onClick={handleAddAllAssignedTasks}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      opacity: tourStep === 2 ? 0.45 : 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#c084fc';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
                    }}
                  >
                    <Users size={18} color="#64748b" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                      All assigned tasks
                    </span>
                  </div>

                  {/* 2. Last week's tasks */}
                  <div
                    onClick={handleCopyLastWeekTasks}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      opacity: tourStep === 2 ? 0.45 : 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#c084fc';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
                    }}
                  >
                    <Copy size={18} color="#64748b" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                      Last week's tasks
                    </span>
                  </div>

                  {/* 3. Individual tasks (HIGHLIGHTED IN TOUR STEP 2 - Screenshot 4) */}
                  <div style={{ position: 'relative' }}>
                    {tourStep === 2 && (
                      /* Popover above Individual tasks (Screenshot 4) */
                      <div style={{
                        position: 'absolute',
                        bottom: '76px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '280px',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        zIndex: 150
                      }}>
                        {/* Downward beak pointing to Individual tasks */}
                        <div style={{
                          position: 'absolute',
                          bottom: '-5px',
                          left: '50%',
                          transform: 'translateX(-50%) rotate(45deg)',
                          width: '10px',
                          height: '10px',
                          backgroundColor: '#0f172a'
                        }} />

                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: '#f8fafc', lineHeight: 1.45, fontWeight: 500 }}>
                            You can also manually add tasks to your timesheet by clicking here.
                          </p>
                          <button
                            onClick={handleDismissTour}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0', flexShrink: 0 }}
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                          <button
                            onClick={() => handleAdvanceTour(3)}
                            style={{
                              backgroundColor: '#334155',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '5px 14px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}

                    <div
                      onClick={handleOpenIndividualTaskModal}
                      style={{
                        backgroundColor: '#ffffff',
                        border: tourStep === 2 ? '2px solid #ffffff' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '16px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        boxShadow: tourStep === 2 ? '0 10px 28px rgba(0,0,0,0.18)' : '0 1px 3px rgba(0,0,0,0.03)',
                        transform: tourStep === 2 ? 'scale(1.02)' : 'none',
                        zIndex: tourStep === 2 ? 10 : 1,
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#c084fc';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = tourStep === 2 ? '#ffffff' : '#e2e8f0';
                        e.currentTarget.style.boxShadow = tourStep === 2 ? '0 10px 28px rgba(0,0,0,0.18)' : '0 1px 3px rgba(0,0,0,0.03)';
                      }}
                    >
                      <Target size={18} color="#64748b" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                        Individual tasks
                      </span>
                    </div>
                  </div>

                  {/* 4. Track time */}
                  <div
                    onClick={handleOpenTrackTimeModal}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      opacity: tourStep === 2 ? 0.45 : 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#c084fc';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
                    }}
                  >
                    <Clock size={18} color="#64748b" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                      Track time
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Full Weekly Timesheet Grid Table */
              <div style={{ padding: '24px' }}>
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaebf0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  {/* Header row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `minmax(240px, 2fr) repeat(${visibleDays.length}, minmax(80px, 1fr)) 100px`,
                    borderBottom: '1px solid #eaebf0',
                    backgroundColor: '#f8fafc',
                    padding: '10px 16px',
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    color: '#64748b',
                    textTransform: 'uppercase'
                  }}>
                    <div>Task / Project</div>
                    {visibleDays.map(d => (
                      <div key={d.idx} style={{ textAlign: 'center' }}>
                        {d.label} {d.date}
                      </div>
                    ))}
                    <div style={{ textAlign: 'right' }}>Total</div>
                  </div>

                  {/* Task rows */}
                  {timesheetTaskIds.map(tId => {
                    const taskObj = tasks.find(t => t.id === tId) || {
                      id: tId,
                      title: 'General Project Work',
                      key: 'CRM-100'
                    };

                    const taskEntries = entries.filter(e => e.taskId === tId);
                    const taskTotalSeconds = taskEntries.reduce((sum, e) => sum + e.durationSeconds, 0);

                    return (
                      <div
                        key={tId}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: `minmax(240px, 2fr) repeat(${visibleDays.length}, minmax(80px, 1fr)) 100px`,
                          borderBottom: '1px solid #f1f5f9',
                          padding: '12px 16px',
                          alignItems: 'center'
                        }}
                      >
                        {/* Task Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            backgroundColor: '#f1f5f9',
                            color: '#64748b',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            flexShrink: 0
                          }}>
                            {taskObj.key || 'CRM'}
                          </span>
                          <span style={{
                            fontSize: '0.84rem',
                            fontWeight: 600,
                            color: '#0f172a',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {taskObj.title}
                          </span>
                        </div>

                        {/* Day hour cells */}
                        {visibleDays.map(d => {
                          const dayEntry = taskEntries.find(e => e.dayOfWeek === d.idx);

                          return (
                            <div key={d.idx} style={{ textAlign: 'center' }}>
                              <input
                                type="text"
                                defaultValue={dayEntry ? formatSecondsToDisplay(dayEntry.durationSeconds) : ''}
                                placeholder="-"
                                onBlur={(e) => handleCellTimeChange(tId, d.idx, e.target.value)}
                                style={{
                                  width: '60px',
                                  textAlign: 'center',
                                  padding: '4px',
                                  borderRadius: '6px',
                                  border: '1px solid transparent',
                                  backgroundColor: dayEntry ? '#f5f3ff' : 'transparent',
                                  color: dayEntry ? '#7c3aed' : '#94a3b8',
                                  fontWeight: dayEntry ? 700 : 500,
                                  fontSize: '0.8rem',
                                  outline: 'none'
                                }}
                                onFocus={e => e.currentTarget.style.border = '1px solid #c084fc'}
                              />
                            </div>
                          );
                        })}

                        {/* Row Total */}
                        <div style={{
                          textAlign: 'right',
                          fontWeight: 800,
                          fontSize: '0.84rem',
                          color: taskTotalSeconds > 0 ? '#0f172a' : '#94a3b8'
                        }}>
                          {formatSecondsToDisplay(taskTotalSeconds)}
                        </div>
                      </div>
                    );
                  })}

                  {/* Footer Totals Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `minmax(240px, 2fr) repeat(${visibleDays.length}, minmax(80px, 1fr)) 100px`,
                    backgroundColor: '#f8fafc',
                    padding: '12px 16px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    color: '#0f172a'
                  }}>
                    <div>WEEK TOTAL</div>
                    {visibleDays.map(d => (
                      <div key={d.idx} style={{ textAlign: 'center', color: '#7c3aed' }}>
                        {formatSecondsToDisplay(getDayTotalSeconds(d.idx))}
                      </div>
                    ))}
                    <div style={{ textAlign: 'right', color: '#16a34a', fontSize: '0.9rem' }}>
                      {formatSecondsToDisplay(getTotalWeekSeconds())}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleOpenTrackTimeModal}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={16} />
                      <span>Log Time Entry</span>
                    </button>

                    <button
                      onClick={handleAddAllAssignedTasks}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#ffffff',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Users size={16} />
                      <span>Pull More Tasks</span>
                    </button>
                  </div>

                  {/* Submit Timesheet for Approval Button */}
                  <button
                    onClick={handleSubmitTimesheetForApproval}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 18px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(124, 58, 237, 0.2)'
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Submit Timesheet for Approval</span>
                  </button>
                </div>
              </div>
            )
          )}

          {/* VIEW MODE 2: TIME ENTRIES LIST */}
          {viewMode === 'entries' && (
            filteredEntries.length === 0 ? (
              /* Screenshot 4: Empty State with [New Entry] button */
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 24px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Clock size={32} color="#94a3b8" strokeWidth={1.5} />
                </div>

                <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  No time entries for this week
                </div>

                <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
                  Add tasks or track time to begin.
                </div>

                <button
                  onClick={handleOpenTrackTimeModal}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e293b'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0f172a'}
                >
                  New Entry
                </button>
              </div>
            ) : (
              /* Filled Entries List */
              <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                    Logged Entries ({filteredEntries.length})
                  </div>
                  <button
                    onClick={handleOpenTrackTimeModal}
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    + New Entry
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredEntries.map(entry => (
                    <div
                      key={entry.id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#f5f3ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Clock size={16} color="#7c3aed" />
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px' }}>
                              {entry.taskKey}
                            </span>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                              {entry.taskTitle}
                            </span>
                            {entry.billable && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                                $ Billable
                              </span>
                            )}
                          </div>

                          {entry.notes && (
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                              {entry.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                            {formatSecondsToDisplay(entry.durationSeconds)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {entry.startTime} - {entry.endTime}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            padding: '6px',
                            borderRadius: '6px'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: NEW ENTRY / LIVE TRACK TIME MODAL (Screenshot 5)      */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3600
        }}>
          <div style={{
            width: '440px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 45px rgba(0,0,0,0.22)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Header: User Avatar + Name + Close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  J
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                  Joy Kumar Yuv
                </span>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Time Input Box with Play/Stop Button inside (Screenshot 5) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px',
              padding: '10px 14px',
              backgroundColor: isTimerRunning ? '#fdf4ff' : '#ffffff'
            }}>
              {isTimerRunning ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ec4899', animation: 'pulse 1s infinite' }} />
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#7c3aed', fontFamily: 'monospace' }}>
                    {formatStopwatch(timerSeconds)}
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Enter time (ex: 3h 20m) or start timer"
                  value={modalTimeInput}
                  onChange={e => setModalTimeInput(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.86rem',
                    color: '#0f172a',
                    width: '100%',
                    fontWeight: 500
                  }}
                />
              )}

              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isTimerRunning ? '#ef4444' : '#f1f5f9',
                  color: isTimerRunning ? '#ffffff' : '#64748b',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
                title={isTimerRunning ? "Pause live timer" : "Start live timer"}
              >
                {isTimerRunning ? <Pause size={15} /> : <Play size={15} fill="#64748b" />}
              </button>
            </div>

            {/* Row 2: Select Task Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1', flexShrink: 0 }} />
              <select
                value={modalSelectedTaskId}
                onChange={e => setModalSelectedTaskId(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.84rem',
                  color: modalSelectedTaskId ? '#0f172a' : '#64748b',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="">Select task</option>
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>
                    [{t.key || 'CRM'}] {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 3: Date & Time Range */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={16} color="#64748b" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <input
                  type="text"
                  value={modalDate}
                  onChange={e => setModalDate(e.target.value)}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    color: '#334155',
                    width: '110px'
                  }}
                />
                <input
                  type="text"
                  value={modalStartTime}
                  onChange={e => setModalStartTime(e.target.value)}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '4px 6px',
                    fontSize: '0.78rem',
                    color: '#334155',
                    width: '80px',
                    textAlign: 'center'
                  }}
                />
                <span style={{ color: '#94a3b8' }}>-</span>
                <input
                  type="text"
                  value={modalEndTime}
                  onChange={e => setModalEndTime(e.target.value)}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '4px 6px',
                    fontSize: '0.78rem',
                    color: '#334155',
                    width: '80px',
                    textAlign: 'center'
                  }}
                />
              </div>
            </div>

            {/* Row 4: Notes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1 }}>≡</div>
              <input
                type="text"
                placeholder="Notes"
                value={modalNotes}
                onChange={e => setModalNotes(e.target.value)}
                style={{
                  flex: 1,
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Row 5: Add Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Tag size={16} color="#64748b" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Development', 'Design', 'Meeting', 'Review', 'Bugfix'].map(t => {
                  const isSelected = modalTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setModalTags(isSelected ? modalTags.filter(x => x !== t) : [...modalTags, t]);
                      }}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: isSelected ? '#7c3aed' : '#e2e8f0',
                        backgroundColor: isSelected ? '#f5f3ff' : '#ffffff',
                        color: isSelected ? '#7c3aed' : '#64748b',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer: Billable toggle + Save button (Screenshot 5) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '10px',
              borderTop: '1px solid #f1f5f9'
            }}>
              <button
                type="button"
                onClick={() => setModalBillable(!modalBillable)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: modalBillable ? '#16a34a' : '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                <DollarSign size={16} />
                <span>{modalBillable ? 'Billable' : 'Non-billable'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveModalEntry}
                style={{
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 22px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(124, 58, 237, 0.2)'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: SETUP TIMESHEET APPROVALS MODAL                       */}
      {/* ============================================================== */}
      {isSetupApprovalsModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3600
        }}>
          <div style={{
            width: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 45px rgba(0,0,0,0.22)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#7c3aed" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Setup Timesheet Approvals
                </h3>
              </div>
              <button
                onClick={() => setIsSetupApprovalsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45 }}>
              Enable structured weekly review cycles for all members. Approvers can approve, reject, or request time edits before billing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Primary Approver
                </label>
                <select
                  value={approvalApprover}
                  onChange={e => setApprovalApprover(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                >
                  <option value="Joy Kumar Yuv (Workspace Owner)">Joy Kumar Yuv (Workspace Owner)</option>
                  <option value="Alex Rivera (Engineering Lead)">Alex Rivera (Engineering Lead)</option>
                  <option value="Sarah Chen (Product Lead)">Sarah Chen (Product Lead)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Submission Cutoff Deadline
                </label>
                <select
                  value={approvalDeadline}
                  onChange={e => setApprovalDeadline(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                >
                  <option value="Every Friday at 5:00 PM">Every Friday at 5:00 PM</option>
                  <option value="Every Sunday at 11:59 PM">Every Sunday at 11:59 PM</option>
                  <option value="Every Monday at 9:00 AM">Every Monday at 9:00 AM</option>
                </select>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    Auto-approve Full Capacity
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Auto-approve if user tracked ≥ 40h without over-capacity flags
                  </div>
                </div>

                <div
                  onClick={() => setAutoApproveEnabled(!autoApproveEnabled)}
                  style={{
                    width: '32px',
                    height: '18px',
                    borderRadius: '10px',
                    backgroundColor: autoApproveEnabled ? '#7c3aed' : '#cbd5e1',
                    padding: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: autoApproveEnabled ? 'flex-end' : 'flex-start',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff'
                  }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <button
                onClick={() => setIsSetupApprovalsModalOpen(false)}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsSetupApprovalsModalOpen(false);
                  showToast('Timesheet approvals activated!');
                }}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
