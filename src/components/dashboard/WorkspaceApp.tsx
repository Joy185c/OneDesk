import React, { useState, useEffect } from 'react';
import { 
  Kanban, 
  ListTodo, 
  FileText, 
  Zap, 
  BarChart3, 
  Search, 
  Plus, 
  Bell, 
  LogOut, 
  Home, 
  Folder, 
  CheckCircle2, 
  ChevronDown, 
  Sparkles,
  ExternalLink,
  Database,
  Phone,
  Video,
  Mic,
  Share2,
  Calendar,
  Users,
  Clock,
  MoreHorizontal,
  UserPlus,
  Rocket,
  Star,
  RefreshCw,
  SlidersHorizontal,
  X,
  Bookmark,
  Layers,
  MessageSquare,
  Bot,
  Settings,
  Check,
  Hash,
  UserCheck,
  Reply,
  Megaphone,
  Send,
  Radio,
  Pin,
  Compass,
  Grid,
  ChevronsLeft,
  CheckCheck,
  Pause,
  Play,
  Tag,
  DollarSign,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_TASKS } from '../../data/clickupData';
import { TaskItem } from '../../types';
import { KanbanBoard } from './KanbanBoard';
import { TaskListView } from './TaskListView';
import { DocsView } from './DocsView';
import { TaskDetailModal } from './TaskDetailModal';
import { NewTaskModal } from './NewTaskModal';
import { AutomationsSection } from '../AutomationsSection';
import { AutomationsHubView } from './AutomationsHubView';
import { SprintsView } from './SprintsView';
import { AiAgentsView } from './AiAgentsView';
import { supabaseService } from '../../services/supabaseService';
import { PlannerView } from './PlannerView';
import { ClickUpBrainView } from './ClickUpBrainView';
import { TeamsView } from './TeamsView';
import { DashboardHubView } from './DashboardHubView';
import { WhiteboardView } from './WhiteboardView';
import { TimesheetView } from './TimesheetView';
import { InviteModal } from './InviteModal';
import { UpgradeModal } from './UpgradeModal';
import { MoreFlyout } from './MoreFlyout';
import { AddCardModal, OverviewCardItem } from './AddCardModal';
import { ChannelChatView } from './ChannelChatView';
import { InboxView } from './InboxView';
import { RepliesView } from './RepliesView';
import { AssignedCommentsView } from './AssignedCommentsView';
import { PostsView } from './PostsView';
import { DirectMessageView } from './DirectMessageView';
import { ProfileToolsModal } from './ProfileToolsModal';
import { ConfettiCelebration } from './ConfettiCelebration';
import { FormsView } from './FormsView';
import { ClipsView } from './ClipsView';
import { GoalsView } from './GoalsView';
import { AppCenterModal } from './AppCenterModal';
import { ChatLaunchpadView } from './ChatLaunchpadView';
import { SpacesOverviewView } from './SpacesOverviewView';

interface WorkspaceAppProps {
  onBackToLanding: () => void;
}

// ClickUp AI Petal Logo Component
const ClickUpPetalIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4.2" fill="#ff72e5" />
    <circle cx="17" cy="12" r="4.2" fill="#00c0f3" />
    <circle cx="12" cy="17" r="4.2" fill="#7b68ee" />
    <circle cx="7" cy="12" r="4.2" fill="#f89d13" />
    <circle cx="12" cy="12" r="3.2" fill="#ffffff" />
  </svg>
);

// 1. Home Glowing Orb with ClickUp smile (Screenshot 1)
const ClickUpHomeOrb: React.FC<{ active?: boolean }> = ({ active }) => (
  <div style={{
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 50% 35%, #ff3399 0%, #a855f7 45%, #3b0764 85%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: active 
      ? '0 0 16px rgba(255, 51, 153, 0.75), 0 0 8px rgba(168, 85, 247, 0.5)' 
      : '0 0 12px rgba(255, 51, 153, 0.55), 0 0 6px rgba(168, 85, 247, 0.35)',
    position: 'relative'
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {/* White rounded house body */}
      <path 
        d="M12 4.2C12.7 4.2 13.3 4.6 13.8 5.1L18.4 9.3C19.1 9.9 19.5 10.8 19.5 11.7V17.5C19.5 19.4 17.9 21 16 21H8C6.1 21 4.5 19.4 4.5 17.5V11.7C4.5 10.8 4.9 9.9 5.6 9.3L10.2 5.1C10.7 4.6 11.3 4.2 12 4.2Z" 
        fill="#ffffff" 
      />
      {/* ClickUp pink/magenta smile */}
      <path 
        d="M8.5 13C9.8 15.6 14.2 15.6 15.5 13" 
        stroke="#db2777" 
        strokeWidth="2.4" 
        strokeLinecap="round" 
      />
    </svg>
  </div>
);

// 2. Planner Calendar with 25 (Screenshot 1)
const ClickUpPlannerCalendar25: React.FC<{ active?: boolean }> = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4.5" width="18" height="16.5" rx="3.5" stroke="#ffffff" strokeWidth="1.8" />
    <path d="M8 2.5V5.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 2.5V5.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 9.5H21" stroke="#ffffff" strokeWidth="1.5" />
    <text x="12" y="17.6" textAnchor="middle" fontSize="7.8" fontWeight="800" fill="#ffffff" fontFamily="Inter, system-ui, sans-serif">25</text>
  </svg>
);

// 3. AI 4-Petal Clover Logo Outline (Screenshot 1)
const ClickUpAiPetalOutline: React.FC<{ active?: boolean }> = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 8C10.6 8 9.5 6.9 9.5 5.5C9.5 4.1 10.6 3 12 3C13.4 3 14.5 4.1 14.5 5.5C14.5 6.9 13.4 8 12 8Z" stroke="#ffffff" strokeWidth="1.8" />
    <path d="M16 12C16 10.6 17.1 9.5 18.5 9.5C19.9 9.5 21 10.6 21 12C21 13.4 19.9 14.5 18.5 14.5C17.1 14.5 16 13.4 16 12Z" stroke="#ffffff" strokeWidth="1.8" />
    <path d="M12 16C13.4 16 14.5 17.1 14.5 18.5C14.5 19.9 13.4 21 12 21C10.6 21 9.5 19.9 9.5 18.5C9.5 17.1 10.6 16 12 16Z" stroke="#ffffff" strokeWidth="1.8" />
    <path d="M8 12C8 13.4 6.9 14.5 5.5 14.5C4.1 14.5 3 13.4 3 12C3 10.6 4.1 9.5 5.5 9.5C6.9 9.5 8 10.6 8 12Z" stroke="#ffffff" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="2.2" stroke="#ffffff" strokeWidth="1.6" />
  </svg>
);

// 4. Teams Double User Outline (Screenshot 1)
const ClickUpTeamsOutline: React.FC<{ active?: boolean }> = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// 5. Dashboard Badge with 3 bars (Screenshot 1)
const ClickUpDashboardBars: React.FC<{ active?: boolean }> = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="4.5" stroke="#ffffff" strokeWidth="1.8" />
    <line x1="7.5" y1="16" x2="7.5" y2="12" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="12" y1="16" x2="12" y2="9" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="16.5" y1="16" x2="16.5" y2="7" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// 6. Whiteboard Squiggle inside rounded rectangle (Screenshot 1)
const ClickUpWhiteboardSquiggle: React.FC<{ active?: boolean }> = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="4.5" stroke="#ffffff" strokeWidth="1.8" />
    <path d="M7 14.5C8 12 9.5 10.5 11 11.5C12.5 12.5 13.5 15 15 13.5C16 12.5 16.5 10 17 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 7. Timesheet Clock (Screenshot 1)
const ClickUpTimesheetClock: React.FC<{ active?: boolean }> = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 8.5 12" />
  </svg>
);

// 8. More 9-Dots Grid (Screenshot 1)
const ClickUpNineDots: React.FC<{ active?: boolean }> = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="5" r="2.2" fill="#ffffff" />
    <circle cx="12" cy="5" r="2.2" fill="#ffffff" />
    <circle cx="19" cy="5" r="2.2" fill="#ffffff" />
    <circle cx="5" cy="12" r="2.2" fill="#ffffff" />
    <circle cx="12" cy="12" r="2.2" fill="#ffffff" />
    <circle cx="19" cy="12" r="2.2" fill="#ffffff" />
    <circle cx="5" cy="19" r="2.2" fill="#ffffff" />
    <circle cx="12" cy="19" r="2.2" fill="#ffffff" />
    <circle cx="19" cy="19" r="2.2" fill="#ffffff" />
  </svg>
);

// 9. Invite Person with Plus (Screenshot 1)
const ClickUpInviteOutline: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" strokeWidth="2" />
    <line x1="16" y1="11" x2="22" y2="11" strokeWidth="2" />
  </svg>
);

// 10. Upgrade Rocket with Sparkles (Screenshot 1)
const ClickUpUpgradeRocket: React.FC = () => (
  <div style={{ position: 'relative', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {/* Top-Right Yellow Sparkle */}
      <path d="M19 4L19.5 5.5L21 6L19.5 6.5L19 8L18.5 6.5L17 6L18.5 5.5L19 4Z" fill="#facc15" />
      {/* Left Magenta Sparkle */}
      <path d="M4 8L4.4 9.2L5.5 9.5L4.4 9.8L4 11L3.6 9.8L2.5 9.5L3.6 9.2L4 8Z" fill="#ff41b4" />
      {/* Rocket ship body */}
      <path d="M12 2C10.5 4 8.5 7.5 8.5 12L7 13.5V16L10 15V17L12 18.5L14 17V15L17 16V13.5L15.5 12C15.5 7.5 13.5 4 12 2Z" fill="url(#rocketGrad)" />
      {/* Rocket flame */}
      <path d="M10.5 18.5L12 22L13.5 18.5H10.5Z" fill="#00c0f3" />
      {/* Bottom Sparkle */}
      <circle cx="18" cy="18" r="1" fill="#c084fc" />
      <defs>
        <linearGradient id="rocketGrad" x1="12" y1="2" x2="12" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff41b4" />
          <stop offset="0.6" stopColor="#fb923c" />
          <stop offset="1" stopColor="#e11d48" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const WorkspaceApp: React.FC<WorkspaceAppProps> = ({ onBackToLanding }) => {
  const { user, logout } = useAuth();
  
  // Determine initial activeTab from URL pathname or search params if present
  const getInitialTab = (): 'overview' | 'inbox' | 'replies' | 'assigned_comments' | 'posts' | 'board' | 'list' | 'docs' | 'forms' | 'clips' | 'goals' | 'chat_launchpad' | 'spaces_overview' | 'automations' | 'analytics' | 'planner' | 'ai' | 'teams' | 'whiteboard' | 'timesheet' | 'channel' | 'dm' | 'sprints' | 'agents' => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      if (tabParam) {
        if (tabParam === 'sprints') return 'sprints';
        if (tabParam === 'agents') return 'agents';
        if (tabParam === 'automations') return 'automations';
        if (tabParam === 'projects' || tabParam === 'board' || tabParam === 'list') return 'board';
        if (tabParam === 'spaces' || tabParam === 'spaces_overview') return 'spaces_overview';
        if (tabParam === 'chat') return 'chat_launchpad';
        if (tabParam === 'brain' || tabParam === 'ai') return 'ai';
        if (tabParam === 'time' || tabParam === 'timesheet') return 'timesheet';
        if (tabParam === 'calendar' || tabParam === 'scheduling' || tabParam === 'planner') return 'planner';
        if (tabParam === 'docs') return 'docs';
        if (tabParam === 'whiteboards' || tabParam === 'whiteboard') return 'whiteboard';
        if (tabParam === 'dashboards' || tabParam === 'analytics') return 'analytics';
      }

      const p = window.location.pathname;
      if (p.startsWith('/sprints')) return 'sprints';
      if (p.startsWith('/agents')) return 'agents';
      if (p.startsWith('/automations')) return 'automations';
      if (p.startsWith('/projects')) return 'board';
      if (p.startsWith('/time')) return 'timesheet';
      if (p.includes('/dashboards')) return 'analytics';
      if (p.includes('/whiteboards')) return 'whiteboard';
      if (p.startsWith('/docs')) return 'docs';
      if (p.startsWith('/forms')) return 'forms';
      if (p.startsWith('/hubs/clips') || p.startsWith('/clips')) return 'clips';
      if (p.startsWith('/goals')) return 'goals';
      if (p.startsWith('/chat')) return 'chat_launchpad';
      if (p.startsWith('/v/o/s')) return 'spaces_overview';
      if (p.includes('/teams')) return 'teams';
      if (p.includes('/planner') || p.startsWith('/calendar') || p.startsWith('/scheduling')) return 'planner';
      if (p.includes('/ai') || p.startsWith('/brain')) return 'ai';
    }
    return 'inbox';
  };

  const getInitialTimesheetSubTab = (): 'my' | 'all' | 'approvals' => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.includes('/team')) return 'all';
      if (p.includes('/approvals')) return 'approvals';
    }
    return 'my';
  };

  const [activeTab, setActiveTab] = useState<
    'overview' | 'inbox' | 'replies' | 'assigned_comments' | 'posts' | 'board' | 'list' | 'docs' | 'forms' | 'clips' | 'goals' | 'chat_launchpad' | 'spaces_overview' | 'automations' | 'analytics' | 'planner' | 'ai' | 'teams' | 'whiteboard' | 'timesheet' | 'channel' | 'dm' | 'sprints' | 'agents'
  >(getInitialTab);

  const [isAppCenterOpen, setIsAppCenterOpen] = useState(() => {
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/apps');
  });

  const isDemoUser = user?.id === 'u_joy_1';
  const currentUserName = user?.name || 'You';
  const userRole = user?.role || 'Workspace Owner';
  const isAdmin = userRole.toLowerCase().includes('admin') || userRole.toLowerCase().includes('owner');
  const workspaceName = user?.workspaceName || (user?.name ? `${user.name}'s Workspace` : 'My Workspace');
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME';

  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [activeDmUser, setActiveDmUser] = useState({ name: `${currentUserName} — You`, initials: userInitials });
  const [currentSpaceName, setCurrentSpaceName] = useState('Space');

  // Dynamic Sidebar Elements
  const [superAgents, setSuperAgents] = useState<Array<{ id: string; name: string; role: string }>>([
    { id: 'brain', name: 'Brain', role: 'ClickUp Brain 3.0' }
  ]);

  const [channels, setChannels] = useState<Array<{ id: string; name: string; isGeneral?: boolean }>>(() => {
    try {
      const saved = localStorage.getItem('clickjoy_workspace_channels_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'general', name: `General - ${workspaceName}`, isGeneral: true },
      { id: 'welcome', name: 'Welcome', isGeneral: false }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('clickjoy_workspace_channels_v2', JSON.stringify(channels));
    } catch {}
  }, [channels]);

  const [directMessages, setDirectMessages] = useState<Array<{ id: string; name: string; initials: string }>>([
    { id: user?.id || 'me', name: `${currentUserName} — You`, initials: userInitials }
  ]);

  const [spacesList, setSpacesList] = useState<Array<{ id: string; name: string; folder: string; color: string; initial: string }>>([
    { id: 'space-crm', name: 'Space', folder: 'Sales CRM', color: '#7c3aed', initial: 'S' }
  ]);

  // Modals for Sidebar Actions
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isMoreFlyoutOpen, setIsMoreFlyoutOpen] = useState(false);
  const [isCustomizeNavOpen, setIsCustomizeNavOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isNewAgentOpen, setIsNewAgentOpen] = useState(false);
  const [isNewChannelOpen, setIsNewChannelOpen] = useState(false);
  const [isNewSpaceOpen, setIsNewSpaceOpen] = useState(false);
  const [isNewDmOpen, setIsNewDmOpen] = useState(false);
  const [isSupabaseDiagOpen, setIsSupabaseDiagOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isInnerMoreOpen, setIsInnerMoreOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);

  // Inputs for modals
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('Workspace Task Assistant');
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelTopic, setNewChannelTopic] = useState('');
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceColor, setNewSpaceColor] = useState('#7c3aed');
  const [newDmTarget, setNewDmTarget] = useState('Sarah Miller');
  const [newDmInitialNote, setNewDmInitialNote] = useState('');

  const [currentPlan, setCurrentPlan] = useState('Free Forever');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom Overview cards added by user
  const [overviewCards, setOverviewCards] = useState<OverviewCardItem[]>([]);
  // Custom Bookmarks added by user
  const [bookmarks, setBookmarks] = useState<Array<{ id: string; title: string; url: string }>>([]);

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const storageKey = isDemoUser ? 'clickjoy_saved_tasks' : `clickjoy_saved_tasks_${user?.id || 'guest'}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
      return isDemoUser ? INITIAL_TASKS : [];
    } catch {
      return isDemoUser ? INITIAL_TASKS : [];
    }
  });

  useEffect(() => {
    try {
      const storageKey = isDemoUser ? 'clickjoy_saved_tasks' : `clickjoy_saved_tasks_${user?.id || 'guest'}`;
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch {}
  }, [tasks, user?.id, isDemoUser]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [defaultNewStatus, setDefaultNewStatus] = useState<'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE'>('TODO');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Tour & Confetti Celebration States (Screenshots 1 & 2)
  const [timesheetTourStep, setTimesheetTourStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('clickup_timesheet_tour_v2');
      if (saved === 'completed') return 0;
      return 1;
    } catch {
      return 1;
    }
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHappyToast, setShowHappyToast] = useState(false);
  const [isGlobalTrackTimeOpen, setIsGlobalTrackTimeOpen] = useState(false);
  const [globalTimeInput, setGlobalTimeInput] = useState('');
  const [globalTimerRunning, setGlobalTimerRunning] = useState(false);
  const [globalTimerSeconds, setGlobalTimerSeconds] = useState(0);
  const [globalSelectedTaskId, setGlobalSelectedTaskId] = useState('');
  const [globalNotes, setGlobalNotes] = useState('');
  const [globalTags, setGlobalTags] = useState<string[]>(['Development']);
  const [globalBillable, setGlobalBillable] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (globalTimerRunning) {
      interval = setInterval(() => {
        setGlobalTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [globalTimerRunning]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load from Supabase on mount
  useEffect(() => {
    const loadTasks = async () => {
      const loaded = await supabaseService.getTasks();
      setTasks(loaded);
    };
    loadTasks();

    const unsubscribe = supabaseService.subscribeToTasks(() => {
      loadTasks();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('clickjoy_saved_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = async (newTask: TaskItem) => {
    setTasks([newTask, ...tasks]);
    await supabaseService.createTask(newTask);
  };

  const handleUpdateTask = async (updated: TaskItem) => {
    setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    setSelectedTask(updated);
    await supabaseService.updateTask(updated);
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
    await supabaseService.deleteTask(taskId);
  };

  const handleQuickMove = async (taskId: string, newStatus: 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE') => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const updated = { ...target, status: newStatus };
    setTasks(tasks.map(t => t.id === taskId ? updated : t));
    if (selectedTask?.id === taskId) {
      setSelectedTask(updated);
    }
    await supabaseService.updateTask(updated);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      {/* ======================================================== */}
      {/* 1. TOP GLOBAL APP HEADER BAR (MATCHING OFFICIAL SCREENSHOT)*/}
      {/* ======================================================== */}
      <header style={{
        height: '46px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        zIndex: 100
      }}>
        {/* Left: Workspace Selector + Calendar 25 (Matches Screenshot 2) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              backgroundColor: '#0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '0.76rem',
              fontWeight: 800
            }}>
              J
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e293b' }}>
              {workspaceName}
            </span>
            <ChevronDown size={14} color="#64748b" />
          </div>

          {/* Mini Calendar 25 Shortcut (Matches Screenshot 2) */}
          <div 
            onClick={() => setActiveTab('planner')}
            style={{ 
              color: '#64748b', 
              cursor: 'pointer', 
              padding: '4px 6px', 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Planner & Sprint Calendar (25)"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4.5" width="18" height="16.5" rx="3.5" stroke="#64748b" strokeWidth="1.8" />
              <path d="M8 2.5V5.5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 2.5V5.5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 9.5H21" stroke="#64748b" strokeWidth="1.5" />
              <text x="12" y="17.6" textAnchor="middle" fontSize="7.8" fontWeight="800" fill="#64748b" fontFamily="Inter, system-ui, sans-serif">25</text>
            </svg>
          </div>
        </div>

        {/* Center: Search Ctrl K + Build Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f1f5f9',
            padding: '5px 14px',
            borderRadius: '8px',
            width: '280px',
            border: '1px solid #e2e8f0'
          }}>
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search Ctrl K"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#1e293b',
                fontSize: '0.8rem',
                width: '100%'
              }}
            />
          </div>

          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#1e293b',
            cursor: 'pointer'
          }}>
            <span>Build</span>
            <ClickUpPetalIcon size={14} />
          </button>
        </div>

        {/* Right: Quick Action Icons & User Avatar (Matches Screenshot) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
            <span 
              onClick={() => setIsNewTaskOpen(true)}
              style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} 
              title="Quick Create Task"
            >
              <CheckCircle2 size={16} color="#64748b" />
            </span>

            {/* Global Quick Track Time Button (Matches Official ClickUp 3.0 & Screenshot 1) */}
            <div style={{ position: 'relative' }}>
              <div
                id="global-track-time-btn"
                onClick={() => setIsGlobalTrackTimeOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3px 6px',
                  borderRadius: '8px',
                  border: timesheetTourStep === 4 ? '1.5px solid #cbd5e1' : '1px solid transparent',
                  backgroundColor: timesheetTourStep === 4 ? '#ffffff' : 'transparent',
                  boxShadow: timesheetTourStep === 4 ? '0 4px 14px rgba(0,0,0,0.12)' : 'none',
                  cursor: 'pointer',
                  color: timesheetTourStep === 4 ? '#7c3aed' : '#64748b',
                  zIndex: timesheetTourStep === 4 ? 120 : 'auto',
                  transition: 'all 0.15s ease'
                }}
                title="Track Time from anywhere in ClickUp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
                  <polygon points="10 8.5 15.5 12 10 15.5 10 8.5" fill="currentColor" />
                </svg>
              </div>

              {/* TOUR STEP 4 POPOVER (Screenshot 1) */}
              {timesheetTourStep === 4 && (
                <div style={{
                  position: 'absolute',
                  top: '36px',
                  right: '-16px',
                  width: '280px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '16px',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
                  zIndex: 200
                }}>
                  {/* Upward pointing beak */}
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '26px',
                    transform: 'rotate(45deg)',
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#0f172a'
                  }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#f8fafc', lineHeight: 1.45, fontWeight: 500 }}>
                      <b>Track time</b> using this button from anywhere in ClickUp.
                    </p>
                    <button
                      onClick={() => {
                        setTimesheetTourStep(0);
                        try { localStorage.setItem('clickup_timesheet_tour_v2', 'completed'); } catch {}
                      }}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0', flexShrink: 0 }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
                    <button
                      onClick={() => {
                        setTimesheetTourStep(0);
                        try { localStorage.setItem('clickup_timesheet_tour_v2', 'completed'); } catch {}
                        setShowConfetti(true);
                        setShowHappyToast(true);
                        setTimeout(() => setShowHappyToast(false), 4500);
                        setTimeout(() => setShowConfetti(false), 5000);
                      }}
                      style={{
                        backgroundColor: '#334155',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 16px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Got it
                    </button>
                  </div>
                </div>
              )}
            </div>

            <span 
              onClick={() => setProfileDropdownOpen(true)}
              style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} 
              title="Record Clip"
            >
              <Video size={16} color="#64748b" />
            </span>
            <span 
              onClick={() => setProfileDropdownOpen(true)}
              style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} 
              title="Talk to Text"
            >
              <Mic size={16} color="#64748b" />
            </span>
            <span 
              onClick={() => setActiveTab('whiteboard')}
              style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} 
              title="Whiteboard"
            >
              <Layers size={16} color="#64748b" />
            </span>
            <span 
              onClick={() => setActiveTab('analytics')}
              style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} 
              title="Dashboard"
            >
              <BarChart3 size={16} color="#64748b" />
            </span>
          </div>

          {/* User Avatar with Green Dot (Matches Screenshot) */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              style={{
                position: 'relative',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: '1.5px solid #e2e8f0',
                transition: 'transform 0.1s'
              }}
              title={`${currentUserName} (Click to open profile & personal tools)`}
            >
              {userInitials}
              {/* Online Green Indicator Dot */}
              <span style={{
                position: 'absolute',
                bottom: '-1px',
                right: '-1px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '1.5px solid #ffffff'
              }} />
            </div>

            {/* Complete Profile & Personal Tools Modal */}
            <ProfileToolsModal
              isOpen={profileDropdownOpen}
              onClose={() => setProfileDropdownOpen(false)}
              user={{
                name: currentUserName,
                email: user?.email || 'user@clickup.com',
                initials: userInitials
              }}
              tasks={tasks}
              onAddTask={handleAddTask}
              onNavigateToTab={setActiveTab}
              onLogout={logout}
              onBackToLanding={onBackToLanding}
              onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. BODY SPLIT: DARK ICON RAIL + INNER SIDEBAR + MAIN AREA*/}
      {/* ======================================================== */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Leftmost Dark Icon Rail (Matches Screenshot 1 & 2 precisely) */}
        <div style={{
          width: '56px',
          backgroundColor: '#000000',
          borderRadius: '16px',
          margin: '4px 0 6px 6px',
          height: 'calc(100vh - 56px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0 10px 0',
          flexShrink: 0,
          zIndex: 10,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
        }}>
          {/* Top app icons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
            {/* ClickUp Orb / Home button */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
                padding: '4px 2px',
                borderRadius: '8px',
                width: '48px',
                transition: 'all 0.15s ease'
              }} 
              onClick={() => setActiveTab('overview')}
              title="Home / Overview"
            >
              <ClickUpHomeOrb active={activeTab === 'overview'} />
              <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#ffffff', marginTop: '1px' }}>Home</span>
            </div>

            {/* Planner with date 25 */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '3px', 
                cursor: 'pointer',
                padding: '4px 2px',
                borderRadius: '8px',
                width: '48px',
                backgroundColor: activeTab === 'planner' ? 'rgba(255,255,255,0.18)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setActiveTab('planner')}
              onMouseEnter={e => { if (activeTab !== 'planner') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { if (activeTab !== 'planner') e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Planner & Sprint Calendar"
            >
              <ClickUpPlannerCalendar25 active={activeTab === 'planner'} />
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#ffffff' }}>Planner</span>
            </div>

            {/* AI */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '3px', 
                cursor: 'pointer',
                padding: '4px 2px',
                borderRadius: '8px',
                width: '48px',
                backgroundColor: activeTab === 'ai' ? 'rgba(255,255,255,0.18)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setActiveTab('ai')}
              onMouseEnter={e => { if (activeTab !== 'ai') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { if (activeTab !== 'ai') e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="ClickUp Brain™ AI"
            >
              <ClickUpAiPetalOutline active={activeTab === 'ai'} />
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#ffffff' }}>AI</span>
            </div>

            {/* Teams */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '3px', 
                cursor: 'pointer',
                padding: '4px 2px',
                borderRadius: '8px',
                width: '48px',
                backgroundColor: activeTab === 'teams' ? 'rgba(255,255,255,0.18)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setActiveTab('teams')}
              onMouseEnter={e => { if (activeTab !== 'teams') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { if (activeTab !== 'teams') e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Workspace Team Members"
            >
              <ClickUpTeamsOutline active={activeTab === 'teams'} />
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#ffffff' }}>Teams</span>
            </div>

            {/* Dashboard */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '3px', 
                cursor: 'pointer',
                padding: '4px 2px',
                borderRadius: '8px',
                width: '48px',
                backgroundColor: activeTab === 'analytics' ? 'rgba(255,255,255,0.18)' : 'transparent',
                transition: 'all 0.15s ease'
              }} 
              onClick={() => setActiveTab('analytics')}
              onMouseEnter={e => { if (activeTab !== 'analytics') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { if (activeTab !== 'analytics') e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Dashboard & Analytics"
            >
              <ClickUpDashboardBars active={activeTab === 'analytics'} />
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#ffffff' }}>Dashboard</span>
            </div>

            {/* Whiteboard */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '3px', 
                cursor: 'pointer',
                padding: '4px 2px',
                borderRadius: '8px',
                width: '48px',
                backgroundColor: activeTab === 'whiteboard' ? 'rgba(255,255,255,0.18)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setActiveTab('whiteboard')}
              onMouseEnter={e => { if (activeTab !== 'whiteboard') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { if (activeTab !== 'whiteboard') e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Whiteboard Canvas"
            >
              <ClickUpWhiteboardSquiggle active={activeTab === 'whiteboard'} />
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#ffffff' }}>Whiteboa..</span>
            </div>

            {/* Timesheet */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '3px', 
                cursor: 'pointer',
                padding: '4px 2px',
                borderRadius: '8px',
                width: '48px',
                backgroundColor: activeTab === 'timesheet' ? 'rgba(255,255,255,0.18)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setActiveTab('timesheet')}
              onMouseEnter={e => { if (activeTab !== 'timesheet') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { if (activeTab !== 'timesheet') e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Timesheet & Time Tracker"
            >
              <ClickUpTimesheetClock active={activeTab === 'timesheet'} />
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#ffffff' }}>Timesheet</span>
            </div>

            {/* More */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '3px', 
                cursor: 'pointer',
                padding: '4px 2px',
                borderRadius: '8px',
                width: '48px',
                backgroundColor: isMoreFlyoutOpen ? 'rgba(255,255,255,0.18)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setIsMoreFlyoutOpen(!isMoreFlyoutOpen)}
              onMouseEnter={e => { if (!isMoreFlyoutOpen) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { if (!isMoreFlyoutOpen) e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="More Workspace Apps"
            >
              <ClickUpNineDots active={isMoreFlyoutOpen} />
              <span style={{ fontSize: '0.66rem', color: '#ffffff', fontWeight: 700 }}>More</span>
            </div>
          </div>

          {/* Bottom Rail Actions: Invite & Upgrade (Matches Screenshot 1) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '3px', 
                cursor: 'pointer',
                padding: '4px 2px',
                borderRadius: '8px',
                width: '48px',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setIsInviteOpen(true)}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Invite Team Members"
            >
              <ClickUpInviteOutline />
              <span style={{ fontSize: '0.66rem', color: '#ffffff', fontWeight: 700 }}>Invite</span>
            </div>
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '3px', 
                cursor: 'pointer',
                padding: '4px 2px',
                borderRadius: '8px',
                width: '48px',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setIsUpgradeOpen(true)}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Upgrade Workspace Plan"
            >
              <ClickUpUpgradeRocket />
              <span style={{ fontSize: '0.66rem', color: '#ffffff', fontWeight: 800 }}>Upgrade</span>
            </div>
          </div>
        </div>

        {/* Inner Left Workspace Sidebar (Tree Navigation matching Screenshot) - Hidden on Planner, AI, Teams, Dashboards, Whiteboards, Timesheets, Docs, Forms, Clips, Goals, Chat Launchpad, Spaces Overview, Sprints, Agents, Automations */}
        {activeTab !== 'planner' && activeTab !== 'ai' && activeTab !== 'teams' && activeTab !== 'analytics' && activeTab !== 'whiteboard' && activeTab !== 'timesheet' && activeTab !== 'docs' && activeTab !== 'forms' && activeTab !== 'clips' && activeTab !== 'goals' && activeTab !== 'chat_launchpad' && activeTab !== 'spaces_overview' && activeTab !== 'sprints' && activeTab !== 'agents' && activeTab !== 'automations' && (
          <aside style={{
          width: isSidebarCollapsed ? '48px' : '216px',
          backgroundColor: '#fafbfc',
          borderRight: '1px solid #eaebf0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isSidebarCollapsed ? '14px 4px' : '14px 10px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 40,
          overflow: isInnerMoreOpen ? 'visible' : 'auto',
          transition: 'width 0.2s ease'
        }}>
          <div>
            {/* Top row: Home + Search/Filter/Collapse + Create button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span 
                  style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a', cursor: 'pointer' }}
                  onClick={() => setActiveTab('overview')}
                >
                  Home
                </span>
                {/* Search, Filter, Collapse icons matching Screenshot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                  <span
                    title="Search workspace"
                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                    onClick={() => {
                      const el = document.querySelector('input[placeholder="Search Ctrl K"]') as HTMLInputElement;
                      if (el) el.focus();
                    }}
                  >
                    <Search size={13} />
                  </span>
                  <span
                    title="Filter views"
                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                    onClick={() => showToast('Filters: All views active')}
                  >
                    <SlidersHorizontal size={13} />
                  </span>
                  <span 
                    style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', lineHeight: 1 }} 
                    title="Collapse sidebar"
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  >
                    «
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <span>+</span>
                <span>Create</span>
              </button>

              {/* Quick Create Dropdown */}
              {isCreateDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: '0',
                  top: '115%',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: '6px',
                  width: '160px',
                  zIndex: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  <button
                    onClick={() => { setIsCreateDropdownOpen(false); setDefaultNewStatus('TODO'); setIsNewTaskOpen(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', border: 'none', background: 'none', borderRadius: '6px', fontSize: '0.78rem', color: '#1e293b', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Check size={14} color="#7c3aed" />
                    <span>New Task</span>
                  </button>
                  <button
                    onClick={() => { setIsCreateDropdownOpen(false); setActiveTab('docs'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', border: 'none', background: 'none', borderRadius: '6px', fontSize: '0.78rem', color: '#1e293b', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FileText size={14} color="#0284c7" />
                    <span>New Doc</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCreateDropdownOpen(false);
                      if (!isAdmin) {
                        showToast('Permission Denied: Only Workspace Admins can create new channels.');
                        return;
                      }
                      setIsNewChannelOpen(true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', border: 'none', background: 'none', borderRadius: '6px', fontSize: '0.78rem', color: '#1e293b', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Hash size={14} color="#10b981" />
                    <span>New Channel {isAdmin ? '' : '(Admin Only)'}</span>
                  </button>
                  <button
                    onClick={() => { setIsCreateDropdownOpen(false); setActiveTab('posts'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', border: 'none', background: 'none', borderRadius: '6px', fontSize: '0.78rem', color: '#1e293b', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Megaphone size={14} color="#f59e0b" />
                    <span>New Post</span>
                  </button>
                </div>
              )}
            </div>

            {/* Home Submenu Items: Inbox, Replies, Assigned Comments, Posts, Skills, Artifacts, Meetings, My Tasks, More */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '18px' }}>
              <div 
                onClick={() => setActiveTab('inbox')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: activeTab === 'inbox' ? 700 : 500,
                  color: activeTab === 'inbox' ? '#0f172a' : '#475569',
                  backgroundColor: activeTab === 'inbox' ? '#ececee' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { if (activeTab !== 'inbox') e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                onMouseLeave={e => { if (activeTab !== 'inbox') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'inbox' ? '#0f172a' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
                <span>Inbox</span>
              </div>

              <div 
                onClick={() => setActiveTab('replies')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'replies' ? 700 : 500,
                  color: activeTab === 'replies' ? '#0f172a' : '#475569',
                  backgroundColor: activeTab === 'replies' ? '#ececee' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { if (activeTab !== 'replies') e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                onMouseLeave={e => { if (activeTab !== 'replies') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'replies' ? '#0f172a' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 17 4 12 9 7" />
                  <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                </svg>
                <span>Replies</span>
              </div>

              <div 
                onClick={() => setActiveTab('assigned_comments')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'assigned_comments' ? 700 : 500,
                  color: activeTab === 'assigned_comments' ? '#0f172a' : '#475569',
                  backgroundColor: activeTab === 'assigned_comments' ? '#ececee' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { if (activeTab !== 'assigned_comments') e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                onMouseLeave={e => { if (activeTab !== 'assigned_comments') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'assigned_comments' ? '#0f172a' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Assigned Comments</span>
              </div>

              <div 
                onClick={() => setActiveTab('posts')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'posts' ? 700 : 500,
                  color: activeTab === 'posts' ? '#0f172a' : '#475569',
                  backgroundColor: activeTab === 'posts' ? '#ececee' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { if (activeTab !== 'posts') e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                onMouseLeave={e => { if (activeTab !== 'posts') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'posts' ? '#0f172a' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Posts</span>
              </div>

              {/* Skills */}
              <div 
                onClick={() => {
                  showToast('ClickUp Skills & AI Superpowers active');
                  setActiveTab('ai');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Zap size={14} color="#64748b" />
                <span>Skills</span>
              </div>

              {/* Artifacts */}
              <div 
                onClick={() => {
                  setActiveTab('docs');
                  showToast('Viewing Artifacts & Docs');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Bookmark size={14} color="#64748b" />
                <span>Artifacts</span>
              </div>

              {/* Meetings */}
              <div 
                onClick={() => {
                  showToast('ClickUp Meetings & Live AI Notes ready');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Phone size={14} color="#64748b" />
                <span>Meetings</span>
              </div>

              {/* My Tasks */}
              <div 
                onClick={() => {
                  setActiveTab('list');
                  showToast(`Filtered to ${currentUserName} tasks`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <UserCheck size={14} color="#64748b" />
                <span>My Tasks</span>
              </div>

              {/* More with Authentic ClickUp 3.0 Popover Flyout */}
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => setIsInnerMoreOpen(!isInnerMoreOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: isInnerMoreOpen ? 700 : 500,
                    color: isInnerMoreOpen ? '#0f172a' : '#64748b',
                    backgroundColor: isInnerMoreOpen ? '#ececee' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { if (!isInnerMoreOpen) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                  onMouseLeave={e => { if (!isInnerMoreOpen) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <MoreHorizontal size={14} color={isInnerMoreOpen ? '#0f172a' : '#64748b'} />
                  <span>More</span>
                </div>

                {/* Floating Popover matching Screenshot */}
                {isInnerMoreOpen && (
                  <div style={{
                    position: 'absolute',
                    left: '100%',
                    top: '-10px',
                    marginLeft: '8px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    width: '210px',
                    padding: '6px',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    {/* 1. Chat Activity */}
                    <div
                      onClick={() => {
                        setActiveChannel('general');
                        setActiveTab('channel');
                        setIsInnerMoreOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: '#1e293b'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: '#64748b', fontSize: '0.85rem' }}>@</span>
                        <span>Chat Activity</span>
                      </div>
                      <Pin size={12} color="#94a3b8" />
                    </div>

                    {/* 2. Drafts & Sent */}
                    <div
                      onClick={() => {
                        showToast('Drafts & Sent: No unsent messages in queue');
                        setIsInnerMoreOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: '#1e293b'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Send size={13} color="#64748b" />
                        <span>Drafts & Sent</span>
                      </div>
                      <Pin size={12} color="#94a3b8" />
                    </div>

                    {/* 3. All Channels */}
                    <div
                      onClick={() => {
                        setActiveTab('channel');
                        setIsInnerMoreOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: '#1e293b'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Grid size={13} color="#64748b" />
                        <span>All Channels</span>
                      </div>
                      <Pin size={12} color="#94a3b8" />
                    </div>

                    {/* 4. All Spaces */}
                    <div
                      onClick={() => {
                        setActiveTab('board');
                        setIsInnerMoreOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: '#1e293b'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Compass size={13} color="#64748b" />
                        <span>All Spaces</span>
                      </div>
                      <Pin size={12} color="#94a3b8" />
                    </div>

                    {/* 5. All Tasks */}
                    <div
                      onClick={() => {
                        setActiveTab('list');
                        setIsInnerMoreOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: '#1e293b'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCheck size={14} color="#64748b" />
                        <span>All Tasks</span>
                      </div>
                      <Pin size={12} color="#94a3b8" />
                    </div>

                    {/* Separator */}
                    <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />

                    {/* 6. Customize */}
                    <div
                      onClick={() => {
                        setIsInnerMoreOpen(false);
                        setIsCustomizeNavOpen(true);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: '#1e293b',
                        fontWeight: 600
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <SlidersHorizontal size={13} color="#64748b" />
                      <span>Customize</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Chats Section (Matches Screenshot 1:1) */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', padding: '0 4px' }}>
                AI Chats
              </div>
              {isDemoUser && (
                <>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', padding: '2px 6px', fontWeight: 600 }}>
                    Yesterday
                  </div>
                  <div 
                    onClick={() => {
                      setActiveChannel('sales-crm');
                      setActiveTab('ai');
                      showToast('Opened Sales & CRM Setup with ClickUp Brain');
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '4px 6px', 
                      fontSize: '0.76rem', 
                      color: '#334155', 
                      cursor: 'pointer',
                      borderRadius: '6px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                      <MessageSquare size={13} color="#64748b" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sales & CRM Setup</span>
                    </div>
                    <span style={{ fontSize: '0.66rem', color: '#94a3b8', flexShrink: 0 }}>2 hours ago</span>
                  </div>
                </>
              )}
              <div 
                onClick={() => {
                  setActiveTab('ai');
                  showToast('ClickUp Brain AI Assistant ready');
                }}
                style={{ fontSize: '0.74rem', color: '#64748b', padding: '4px 6px', cursor: 'pointer', borderRadius: '4px', marginTop: '2px' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                + Ask, Build, Create
              </div>
            </div>

            {/* Agents Section */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', padding: '0 4px' }}>
                Agents
              </div>
              {superAgents.map(ag => (
                <div 
                  key={ag.id}
                  onClick={() => setActiveTab('ai')}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '4px 6px', 
                    fontSize: '0.76rem', 
                    color: (activeTab as string) === 'ai' ? '#7c3aed' : '#334155', 
                    cursor: 'pointer',
                    borderRadius: '6px',
                    backgroundColor: (activeTab as string) === 'ai' ? '#f5f3ff' : 'transparent',
                    fontWeight: (activeTab as string) === 'ai' ? 700 : 500
                  }}
                  onMouseEnter={e => { if ((activeTab as string) !== 'ai') e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={e => { if ((activeTab as string) !== 'ai') e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <ClickUpPetalIcon size={14} />
                  <span>{ag.name}</span>
                </div>
              ))}
              <div 
                onClick={() => setIsNewAgentOpen(true)}
                style={{ fontSize: '0.74rem', color: '#64748b', padding: '4px 6px', cursor: 'pointer', borderRadius: '4px' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                + New Super Agent
              </div>
            </div>

            {/* Channels Section (Matches Screenshot 1:1) */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 600, color: '#475569', marginBottom: '6px', padding: '0 4px' }}>
                <span>Channels</span>
                {isAdmin ? (
                  <button
                    onClick={() => setIsNewChannelOpen(true)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      lineHeight: 1,
                      padding: '0 2px'
                    }}
                    title="Create New Channel (Admin only)"
                  >
                    +
                  </button>
                ) : (
                  <span title="Only Workspace Admins can create new channels" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                    <Lock size={12} />
                  </span>
                )}
              </div>

              {/* General Channel with J Badge on Hash */}
              <div 
                onClick={() => {
                  setActiveChannel('general');
                  setActiveTab('channel');
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '4px 6px', 
                  fontSize: '0.78rem', 
                  color: '#334155', 
                  cursor: 'pointer',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'channel' && activeChannel === 'general' ? '#f1f5f9' : 'transparent'
                }}
                onMouseEnter={e => { if (activeTab !== 'channel' || activeChannel !== 'general') e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                onMouseLeave={e => { if (activeTab !== 'channel' || activeChannel !== 'general') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '15px', height: '15px', flexShrink: 0 }}>
                  <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1 }}>#</span>
                  <span style={{ 
                    position: 'absolute', 
                    bottom: '-2px', 
                    right: '-4px', 
                    width: '9px', 
                    height: '9px', 
                    borderRadius: '2px', 
                    backgroundColor: '#0d9488', 
                    color: '#ffffff', 
                    fontSize: '0.45rem', 
                    fontWeight: 900, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    lineHeight: 1
                  }}>
                    {userInitials[0] || 'W'}
                  </span>
                </div>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  General - {workspaceName}
                </span>
              </div>

              {/* Welcome Channel */}
              <div 
                onClick={() => {
                  setActiveChannel('welcome');
                  setActiveTab('channel');
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '4px 6px', 
                  fontSize: '0.78rem', 
                  color: '#334155', 
                  cursor: 'pointer',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'channel' && activeChannel === 'welcome' ? '#f1f5f9' : 'transparent'
                }}
                onMouseEnter={e => { if (activeTab !== 'channel' || activeChannel !== 'welcome') e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                onMouseLeave={e => { if (activeTab !== 'channel' || activeChannel !== 'welcome') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.85rem', width: '15px', textAlign: 'center' }}>#</span>
                <span>Welcome</span>
              </div>

              {/* Dynamic Added Channels */}
              {channels.filter(ch => ch.id !== 'general' && ch.id !== 'welcome').map(ch => {
                const isActive = activeTab === 'channel' && activeChannel === ch.id;
                return (
                  <div 
                    key={ch.id}
                    onClick={() => {
                      setActiveChannel(ch.id);
                      setActiveTab('channel');
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '4px 6px', 
                      fontSize: '0.78rem', 
                      color: '#334155', 
                      cursor: 'pointer',
                      borderRadius: '6px',
                      backgroundColor: isActive ? '#f1f5f9' : 'transparent'
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.85rem', width: '15px', textAlign: 'center' }}>#</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ch.name}
                    </span>
                  </div>
                );
              })}

              <div 
                onClick={() => {
                  if (!isAdmin) {
                    showToast('Permission Denied: Only Workspace Admins can create new channels.');
                    return;
                  }
                  setIsNewChannelOpen(true);
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '0.76rem', 
                  color: isAdmin ? '#64748b' : '#94a3b8', 
                  padding: '4px 6px', 
                  cursor: 'pointer', 
                  borderRadius: '4px', 
                  marginTop: '2px' 
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                title={isAdmin ? "Create Channel (Admin Only)" : "Only Workspace Admins can create channels"}
              >
                {isAdmin ? <span style={{ fontSize: '0.85rem' }}>+</span> : <Lock size={12} />}
                <span>Add Channel {isAdmin ? '' : '(Admin)'}</span>
              </div>
            </div>

            {/* Direct Messages Section (Matches Screenshot 1:1) */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', marginBottom: '6px', padding: '0 4px' }}>
                Direct Messages
              </div>

              {/* Current User with Online Green Dot */}
              <div 
                onClick={() => {
                  setActiveDmUser({ name: `${currentUserName} — You`, initials: userInitials });
                  setActiveTab('dm');
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '4px 6px', 
                  fontSize: '0.78rem', 
                  color: '#334155', 
                  cursor: 'pointer',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'dm' && activeDmUser.name.includes(currentUserName) ? '#f1f5f9' : 'transparent'
                }}
                onMouseEnter={e => { if (activeTab !== 'dm' || !activeDmUser.name.includes(currentUserName)) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                onMouseLeave={e => { if (activeTab !== 'dm' || !activeDmUser.name.includes(currentUserName)) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div style={{ position: 'relative', width: '18px', height: '18px', flexShrink: 0 }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#1e293b', color: '#14b8a6', fontSize: '0.66rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {userInitials[0] || 'U'}
                  </div>
                  <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', border: '1px solid #ffffff' }} />
                </div>
                <span>{currentUserName} — You</span>
              </div>

              {/* Additional DMs if any */}
              {directMessages.filter(dm => !dm.name.includes(currentUserName)).map(dm => {
                const isActive = activeTab === 'dm' && activeDmUser.name === dm.name;
                return (
                  <div 
                    key={dm.id}
                    onClick={() => {
                      setActiveDmUser({ name: dm.name, initials: dm.initials });
                      setActiveTab('dm');
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '4px 6px', 
                      fontSize: '0.78rem', 
                      color: '#334155', 
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#f1f5f9' : 'transparent',
                      borderRadius: '6px'
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#1e293b', color: '#fff', fontSize: '0.62rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {dm.initials}
                    </div>
                    <span>{dm.name}</span>
                  </div>
                );
              })}

              <div 
                onClick={() => setIsNewDmOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#64748b', padding: '4px 6px', cursor: 'pointer', borderRadius: '4px', marginTop: '2px' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontSize: '0.85rem' }}>+</span>
                <span>New message</span>
              </div>
            </div>

            {/* Spaces Section (Matches Screenshot 1:1) */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 600, color: '#475569', marginBottom: '6px', padding: '0 4px' }}>
                <span>Spaces</span>
                <button 
                  onClick={() => setIsNewSpaceOpen(true)}
                  style={{ 
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '4px', 
                    backgroundColor: '#f1f5f9', 
                    border: 'none', 
                    color: '#64748b', 
                    fontSize: '0.85rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer',
                    padding: 0
                  }}
                  title="Create New Space"
                >
                  +
                </button>
              </div>

              {/* 1. All Tasks with Branching Node Icon */}
              <div 
                onClick={() => setActiveTab('list')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '5px 6px', 
                  fontSize: '0.78rem', 
                  color: activeTab === 'list' ? '#0f172a' : '#334155', 
                  cursor: 'pointer', 
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'list' ? '#f1f5f9' : 'transparent',
                  fontWeight: activeTab === 'list' ? 700 : 500
                }}
                onMouseEnter={e => { if (activeTab !== 'list') e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                onMouseLeave={e => { if (activeTab !== 'list') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 9V3" />
                    <path d="M12 15v6" />
                    <path d="M15 12h6" />
                    <path d="M9 12H3" />
                    <circle cx="12" cy="3" r="1.5" />
                    <circle cx="12" cy="21" r="1.5" />
                    <circle cx="21" cy="12" r="1.5" />
                    <circle cx="3" cy="12" r="1.5" />
                  </svg>
                </div>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  All Tasks - {workspaceName}
                </span>
              </div>

              {/* 2. Space with Purple S Icon */}
              <div 
                onClick={() => {
                  setCurrentSpaceName('Space');
                  setActiveTab('board');
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '5px 6px', 
                  fontSize: '0.78rem', 
                  color: '#1e293b', 
                  fontWeight: 500, 
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: '#6366f1', color: '#ffffff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>
                  S
                </div>
                <span>Space</span>
              </div>

              {/* 3. Team Space with Blue Two-Person Icon */}
              <div 
                onClick={() => setActiveTab('teams')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '5px 6px', 
                  fontSize: '0.78rem', 
                  color: '#1e293b', 
                  fontWeight: 500, 
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: '#3b82f6', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Users size={11} color="#ffffff" />
                </div>
                <span>Team Space</span>
              </div>

              {/* 4. + New Space */}
              <div 
                onClick={() => setIsNewSpaceOpen(true)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '5px 6px', 
                  fontSize: '0.76rem', 
                  color: '#64748b', 
                  cursor: 'pointer',
                  borderRadius: '6px',
                  marginTop: '2px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontSize: '0.85rem' }}>+</span>
                <span>New Space</span>
              </div>
            </div>
          </div>

          {/* Database indicator (Clickable for Diagnostics) */}
          <div 
            onClick={() => setIsSupabaseDiagOpen(true)}
            style={{ 
              borderTop: '1px solid #eaebf0', 
              paddingTop: '8px', 
              paddingLeft: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            title="Click to view Supabase Realtime & PostgreSQL Diagnostics"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
              <Database size={12} color="#16a34a" />
              <span>Supabase Live 🟢</span>
            </div>
          </div>
        </aside>
        )}

        {/* Main Stage: Space Overview & Tabbed Views */}
        <main style={{
          flex: 1,
          overflow: (['planner', 'ai', 'teams', 'analytics', 'whiteboard', 'timesheet'].includes(activeTab)) ? 'hidden' : 'auto',
          backgroundColor: '#fafbfc',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Conditional Space Header Bar & Subtabs Bar (Visible only on Space Views) */}
          {['overview', 'board', 'list', 'docs'].includes(activeTab) && (
            <>
              {/* Space Header Bar */}
              <div style={{
                padding: '12px 24px',
                borderBottom: '1px solid #eaebf0',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', backgroundColor: '#7c3aed', color: '#fff', fontSize: '0.68rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                    S
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{currentSpaceName}</span>
                  <Star size={14} color="#94a3b8" />
                </div>

                {/* Right Tools: Call, Agents, Automate, Brain², Share */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', color: '#64748b' }}>
                  <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14} /></span>
                  <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setActiveTab('ai')}><Bot size={14} /> Agents</span>
                  <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setActiveTab('automations')}><Zap size={14} /> Automate</span>
                  <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#7c3aed', fontWeight: 700 }} onClick={() => setActiveTab('ai')}><ClickUpPetalIcon size={14} /> Brain²</span>
                  <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setIsInviteOpen(true)}><Share2 size={14} /> Share</span>
                </div>
              </div>

              {/* Subtabs Bar (Add Channel, Overview, List, Board, Docs, + View) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                padding: '0 24px',
                borderBottom: '1px solid #eaebf0',
                backgroundColor: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 700
              }}>
                <span 
                  onClick={() => setIsNewChannelOpen(true)}
                  style={{ color: '#64748b', cursor: 'pointer', padding: '10px 0' }}
                >
                  Add Channel
                </span>
                
                <span
                  onClick={() => setActiveTab('overview')}
                  style={{
                    color: activeTab === 'overview' ? '#0f172a' : '#64748b',
                    borderBottom: activeTab === 'overview' ? '2px solid #0f172a' : 'none',
                    padding: '10px 0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>ℹ️</span> Overview
                </span>

                <span
                  onClick={() => setActiveTab('list')}
                  style={{
                    color: activeTab === 'list' ? '#0f172a' : '#64748b',
                    borderBottom: activeTab === 'list' ? '2px solid #0f172a' : 'none',
                    padding: '10px 0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ListTodo size={14} /> List
                </span>

                <span
                  onClick={() => setActiveTab('board')}
                  style={{
                    color: activeTab === 'board' ? '#0f172a' : '#64748b',
                    borderBottom: activeTab === 'board' ? '2px solid #0f172a' : 'none',
                    padding: '10px 0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Kanban size={14} /> Board
                </span>

                <span
                  onClick={() => setActiveTab('docs')}
                  style={{
                    color: activeTab === 'docs' ? '#0f172a' : '#64748b',
                    borderBottom: activeTab === 'docs' ? '2px solid #0f172a' : 'none',
                    padding: '10px 0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FileText size={14} /> Docs
                </span>

                <span 
                  onClick={() => showToast('View customization drawer opened')}
                  style={{ color: '#94a3b8', cursor: 'pointer', padding: '10px 0' }}
                >
                  + View
                </span>
              </div>
            </>
          )}

          {/* DEDICATED SIDEBAR VIEWS */}
          {/* Inbox View */}
          {activeTab === 'inbox' && (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <InboxView 
                tasks={tasks} 
                onOpenTask={setSelectedTask} 
                onNavigateToTab={setActiveTab} 
                onOpenInvite={() => setIsInviteOpen(true)} 
              />
            </div>
          )}

          {/* Replies View */}
          {activeTab === 'replies' && (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <RepliesView tasks={tasks} onOpenTask={setSelectedTask} />
            </div>
          )}

          {/* Assigned Comments View */}
          {activeTab === 'assigned_comments' && (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <AssignedCommentsView tasks={tasks} onOpenTask={setSelectedTask} />
            </div>
          )}

          {/* Posts Feed View */}
          {activeTab === 'posts' && (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <PostsView />
            </div>
          )}

          {/* Direct Message View */}
          {activeTab === 'dm' && (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <DirectMessageView recipientName={activeDmUser.name} recipientInitials={activeDmUser.initials} />
            </div>
          )}

          {/* OVERVIEW CONTENT VIEW (MATCHING USER SCREENSHOT) */}
          {activeTab === 'overview' && (
            <div style={{ padding: '16px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Purple/Blue Tip Banner */}
              {showBanner && (
                <div style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.82rem',
                  color: '#334155'
                }}>
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    Get the most out of your Overview! Add, reorder, and resize cards to customize this page{' '}
                    <span style={{ textDecoration: 'underline', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>Get Started</span>
                  </div>
                  <X size={15} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setShowBanner(false)} />
                </div>
              )}

              {/* Controls Toolbar: Filters, Auto Refresh, Customize, Add Card */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button 
                  onClick={() => showToast('Filters applied: Showing all active Sales CRM tasks')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  <SlidersHorizontal size={13} />
                  <span>Filters</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RefreshCw size={13} className={autoRefresh ? 'animate-spin' : ''} /> Refreshing...
                  </span>
                  <span 
                    onClick={() => {
                      setAutoRefresh(!autoRefresh);
                      showToast(autoRefresh ? 'Auto refresh paused' : 'Auto refresh enabled');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    ⏱ Auto refresh: <strong>{autoRefresh ? 'On' : 'Off'}</strong>
                  </span>
                  <span 
                    onClick={() => showToast('Overview layout customized')}
                    style={{ cursor: 'pointer' }}
                  >
                    Customize
                  </span>
                  
                  <button
                    onClick={() => setIsAddCardOpen(true)}
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>+</span>
                    <span>Add card</span>
                  </button>
                </div>
              </div>

              {/* Overview Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                {/* Card 1: Recent */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaebf0',
                  borderRadius: '12px',
                  padding: '16px',
                  minHeight: '260px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: '20px' }}>
                    Recent
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                      marginBottom: '10px'
                    }}>
                      <Layers size={20} />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
                      Your recently opened items will appear here.
                    </div>
                    <button 
                      onClick={() => setActiveTab('list')}
                      style={{
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Browse Recent Tasks
                    </button>
                  </div>
                </div>

                {/* Card 2: Docs */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaebf0',
                  borderRadius: '12px',
                  padding: '16px',
                  minHeight: '260px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: '14px' }}>
                    Docs
                  </div>
                  <div
                    onClick={() => setActiveTab('docs')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer'
                    }}
                  >
                    <FileText size={15} color="#0084ff" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>
                      Welcome <span style={{ color: '#94a3b8', fontWeight: 400 }}>• in Welcome</span>
                    </span>
                  </div>
                </div>

                {/* Card 3: Bookmarks */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaebf0',
                  borderRadius: '12px',
                  padding: '16px',
                  minHeight: '260px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                      Bookmarks {bookmarks.length > 0 && `(${bookmarks.length})`}
                    </div>
                    {bookmarks.length > 0 && (
                      <button
                        onClick={() => {
                          const title = window.prompt("Enter Bookmark Title:", "Google Drive Assets");
                          if (!title) return;
                          const url = window.prompt("Enter URL:", "https://drive.google.com");
                          if (!url) return;
                          setBookmarks([...bookmarks, { id: 'bm-' + Date.now(), title, url }]);
                          showToast(`Bookmark "${title}" added!`);
                        }}
                        style={{ border: 'none', background: 'none', color: '#7c3aed', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        + Add
                      </button>
                    )}
                  </div>

                  {bookmarks.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        marginBottom: '10px'
                      }}>
                        <Bookmark size={20} />
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px', maxWidth: '240px' }}>
                        Bookmarks make it easy to save ClickUp items or any URL from around the web.
                      </div>
                      <button 
                        onClick={() => {
                          const title = window.prompt("Enter Bookmark Title:", "Sales CRM Figma Design");
                          if (!title) return;
                          const url = window.prompt("Enter URL:", "https://figma.com");
                          if (!url) return;
                          setBookmarks([...bookmarks, { id: 'bm-' + Date.now(), title, url }]);
                          showToast(`Bookmark "${title}" added!`);
                        }}
                        style={{
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Add Bookmark
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {bookmarks.map(bm => (
                        <div
                          key={bm.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #f1f5f9'
                          }}
                        >
                          <a 
                            href={bm.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#1e293b', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            <Bookmark size={14} color="#7c3aed" />
                            <span>{bm.title}</span>
                          </a>
                          <button
                            onClick={() => setBookmarks(bookmarks.filter(b => b.id !== bm.id))}
                            style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.7rem' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamically Added Overview Cards */}
              {overviewCards.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                  {overviewCards.map(c => (
                    <div
                      key={c.id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #eaebf0',
                        borderRadius: '12px',
                        padding: '16px',
                        minHeight: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                            {c.title}
                          </span>
                          <button
                            onClick={() => setOverviewCards(overviewCards.filter(x => x.id !== c.id))}
                            style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>

                        {c.type === 'assigned_to_me' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {tasks.slice(0, 3).map(t => (
                              <div 
                                key={t.id} 
                                onClick={() => setSelectedTask(t)}
                                style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#f8fafc', fontSize: '0.78rem', color: '#334155', cursor: 'pointer' }}
                              >
                                <strong>{t.key}</strong>: {t.title}
                              </div>
                            ))}
                          </div>
                        )}

                        {c.type === 'sprint_progress' && (
                          <div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#7c3aed', marginTop: '4px' }}>
                              78% On Track
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                              4 of 5 deliverables estimated for delivery before Friday.
                            </div>
                          </div>
                        )}

                        {c.type === 'time_logged' && (
                          <div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
                              5.5 hrs
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                              Logged across Sales CRM tasks today.
                            </div>
                          </div>
                        )}

                        {c.type === 'scratchpad' && (
                          <textarea
                            placeholder="Write your quick workspace notes here..."
                            style={{
                              width: '100%',
                              minHeight: '90px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '8px',
                              fontSize: '0.8rem',
                              fontFamily: 'inherit',
                              outline: 'none',
                              resize: 'none'
                            }}
                          />
                        )}
                      </div>

                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '10px' }}>
                        Live workspace widget
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Lower Section: Folders Card */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #eaebf0',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: '12px' }}>
                  Folders
                </div>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    width: 'fit-content',
                    cursor: 'pointer'
                  }} 
                  onClick={() => setActiveTab('board')}
                >
                  <Folder size={18} color="#7c3aed" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>Sales CRM</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{tasks.length} active tasks in pipeline</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Board View (Kanban) */}
          {activeTab === 'board' && (
            <div style={{ padding: '20px 24px', flex: 1 }}>
              <KanbanBoard
                tasks={filteredTasks}
                onSelectTask={setSelectedTask}
                onOpenNewTaskModal={(status) => {
                  setDefaultNewStatus(status);
                  setIsNewTaskOpen(true);
                }}
                onQuickMoveTask={handleQuickMove}
              />
            </div>
          )}

          {/* List View */}
          {activeTab === 'list' && (
            <div style={{ padding: '20px 24px', flex: 1 }}>
              <TaskListView
                tasks={filteredTasks}
                onSelectTask={setSelectedTask}
                onQuickMoveTask={handleQuickMove}
                onDeleteTask={handleDeleteTask}
                onOpenNewTaskModal={() => {
                  setDefaultNewStatus('TODO');
                  setIsNewTaskOpen(true);
                }}
              />
            </div>
          )}

          {/* Docs View */}
          {activeTab === 'docs' && (
            <div style={{ flex: 1 }}>
              <DocsView />
            </div>
          )}

          {/* Automations Hub View */}
          {activeTab === 'automations' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <AutomationsHubView />
            </div>
          )}

          {/* Sprints Hub View */}
          {activeTab === 'sprints' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <SprintsView />
            </div>
          )}

          {/* AI Super Agents View */}
          {activeTab === 'agents' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <AiAgentsView />
            </div>
          )}

          {/* Analytics / Dashboard Hub View (Screenshot 1) */}
          {activeTab === 'analytics' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <DashboardHubView 
                tasks={tasks}
                onOpenNewTaskModal={() => {
                  setDefaultNewStatus('TODO');
                  setIsNewTaskOpen(true);
                }}
              />
            </div>
          )}

          {/* Planner / Calendar View */}
          {activeTab === 'planner' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <PlannerView />
            </div>
          )}

          {/* ClickUp Brain AI View */}
          {activeTab === 'ai' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <ClickUpBrainView 
                tasks={tasks}
                onAddTask={handleAddTask}
                onNavigateToTab={setActiveTab}
              />
            </div>
          )}

          {/* Teams Management View */}
          {activeTab === 'teams' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <TeamsView 
                tasks={tasks}
                onOpenTask={(task) => setSelectedTask(task)}
                onOpenInviteModal={() => setIsInviteOpen(true)} 
                onOpenUpgradeModal={() => setIsUpgradeOpen(true)}
              />
            </div>
          )}

          {/* Whiteboard Canvas View (Screenshot 2) */}
          {activeTab === 'whiteboard' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <WhiteboardView />
            </div>
          )}

          {/* Timesheet & Time Tracking View (Screenshots 1, 2, 3, 4, 5) */}
          {activeTab === 'timesheet' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <TimesheetView 
                tasks={tasks} 
                initialSubTab={getInitialTimesheetSubTab()} 
                tourStep={timesheetTourStep}
                onSetTourStep={setTimesheetTourStep}
                onOpenTrackTimeModal={() => setIsGlobalTrackTimeOpen(true)}
              />
            </div>
          )}

          {/* Channel Chat View */}
          {activeTab === 'channel' && (
            <div style={{ flex: 1, display: 'flex' }}>
              <ChannelChatView 
                channelKey={activeChannel} 
                onOpenInviteModal={() => setIsInviteOpen(true)} 
              />
            </div>
          )}

          {/* Forms Hub View (Screenshot 5) */}
          {activeTab === 'forms' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <FormsView />
            </div>
          )}

          {/* Clips Hub View (Screenshot 6) */}
          {activeTab === 'clips' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <ClipsView />
            </div>
          )}

          {/* Goals Hub View (Screenshot 7) */}
          {activeTab === 'goals' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <GoalsView tasks={tasks} />
            </div>
          )}

          {/* Chat Launchpad View (Screenshot 3) */}
          {activeTab === 'chat_launchpad' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <ChatLaunchpadView
                onOpenChannel={(ch) => {
                  setActiveChannel(ch);
                  setActiveTab('channel');
                }}
                onOpenDm={(usr) => {
                  setActiveDmUser({ name: usr, initials: usr.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() });
                  setActiveTab('dm');
                }}
              />
            </div>
          )}

          {/* Spaces Overview View (Screenshot 2) */}
          {activeTab === 'spaces_overview' && (
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
              <SpacesOverviewView
                tasks={tasks}
                currentSpaceName={currentSpaceName}
                onSelectViewTab={(vt) => setActiveTab(vt as any)}
                onOpenNewTaskModal={() => {
                  setDefaultNewStatus('TODO');
                  setIsNewTaskOpen(true);
                }}
              />
            </div>
          )}
        </main>
      </div>

      {/* Quick Apps Flyout Menu (More ...) */}
      <MoreFlyout
        isOpen={isMoreFlyoutOpen}
        onClose={() => setIsMoreFlyoutOpen(false)}
        onSelectApp={(appId) => {
          if (appId === 'spaces') {
            setActiveTab('spaces_overview');
            showToast('Spaces: Viewing Sales CRM Space Overview');
          } else if (appId === 'chat') {
            setActiveTab('chat_launchpad');
          } else if (appId === 'docs') {
            setActiveTab('docs');
          } else if (appId === 'sprints') {
            setActiveTab('sprints');
            showToast('Sprints 52 Agile Management active');
          } else if (appId === 'agents') {
            setActiveTab('agents');
            showToast('ClickUp Super Agents Hub active');
          } else if (appId === 'automations') {
            setActiveTab('automations');
            showToast('Automations Workflow Engine active');
          } else if (appId === 'forms') {
            setActiveTab('forms');
          } else if (appId === 'clips') {
            setActiveTab('clips');
          } else if (appId === 'goals') {
            setActiveTab('goals');
          } else if (appId === 'apps') {
            setIsAppCenterOpen(true);
          } else if (appId === 'timesheets' || appId === 'time') {
            setActiveTab('timesheet');
          } else if (appId === 'whiteboards' || appId === 'whiteboard') {
            setActiveTab('whiteboard');
          } else if (appId === 'dashboards' || appId === 'analytics') {
            setActiveTab('analytics');
          } else if (appId === 'projects') {
            setActiveTab('board');
          } else if (appId === 'calendar' || appId === 'scheduling' || appId === 'planner') {
            setActiveTab('planner');
          } else if (appId === 'brain') {
            setActiveTab('ai');
          } else {
            showToast(`App ${appId} opened`);
          }
        }}
        onCustomizeNav={() => setIsCustomizeNavOpen(true)}
      />

      {/* Customize Navigation Rail Modal */}
      {isCustomizeNavOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3500
        }}>
          <div style={{
            width: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={18} color="#7c3aed" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Customize Navigation</h3>
              </div>
              <button 
                onClick={() => setIsCustomizeNavOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Pin, unpin, or reorder apps appearing on your left dark navigation rail.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Home', pinned: true, locked: true },
                { name: 'Planner & Calendar (25)', pinned: true, locked: false },
                { name: 'ClickUp Brain AI', pinned: true, locked: false },
                { name: 'Teams & Workspace Members', pinned: true, locked: false },
                { name: 'Dashboards & Analytics', pinned: true, locked: false },
                { name: 'Whiteboards Canvas', pinned: true, locked: false },
                { name: 'Timesheets & Timer', pinned: true, locked: false }
              ].map(item => (
                <div key={item.name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>{item.name}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: item.locked ? '#94a3b8' : '#7c3aed',
                    backgroundColor: item.locked ? '#f1f5f9' : '#f5f3ff',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    {item.locked ? 'Required' : 'Pinned'}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setIsCustomizeNavOpen(false);
                showToast('Navigation rail preferences saved!');
              }}
              style={{
                width: '100%',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Workspace Invite Modal */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInviteSent={(email, role) => showToast(`Invite successfully sent to ${email} as ${role}!`)}
      />

      {/* Workspace Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        currentPlan={currentPlan}
        onPlanUpgraded={(newPlan) => {
          setCurrentPlan(newPlan);
          showToast(`Successfully upgraded to ClickUp 3.0 ${newPlan}!`);
        }}
      />

      {/* App Center & Integrations Modal (Screenshot 8) */}
      <AppCenterModal
        isOpen={isAppCenterOpen}
        onClose={() => setIsAppCenterOpen(false)}
      />

      {/* Add Overview Card Modal */}
      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onAddCard={(card) => {
          setOverviewCards([...overviewCards, card]);
          showToast(`Added "${card.title}" to Overview!`);
        }}
      />

      {/* Task Details Drawer */}
      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* New Task Creation Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onAddTask={handleAddTask}
        defaultStatus={defaultNewStatus}
      />

      {/* 1. Create Super Agent Modal */}
      {isNewAgentOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
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
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClickUpPetalIcon size={20} />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Create Super Agent</h3>
              </div>
              <button 
                onClick={() => setIsNewAgentOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Super Agents proactively manage tasks, write docs, run automations, and analyze company knowledge in real time.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Agent Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. QA Automation Bot, Research Copilot..."
                  value={newAgentName}
                  onChange={e => setNewAgentName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Super Agent Specialty
                </label>
                <select
                  value={newAgentRole}
                  onChange={e => setNewAgentRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    backgroundColor: '#ffffff',
                    outline: 'none'
                  }}
                >
                  <option value="Workspace Task Assistant">Workspace Task Assistant & Auto-Assigner</option>
                  <option value="Code Review & QA Engineer">Code Review & QA Engineer</option>
                  <option value="Executive Summary & Docs Writer">Executive Summary & Docs Writer</option>
                  <option value="Sales Pipeline Analyzer">Sales Pipeline Analyzer</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => setIsNewAgentOpen(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newAgentName.trim()) {
                    showToast('Please enter an agent name');
                    return;
                  }
                  const newAgent = {
                    id: 'agent-' + Date.now(),
                    name: newAgentName.trim(),
                    role: newAgentRole
                  };
                  setSuperAgents([...superAgents, newAgent]);
                  setNewAgentName('');
                  setIsNewAgentOpen(false);
                  setActiveTab('ai');
                  showToast(`Super Agent "${newAgent.name}" deployed and activated!`);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Deploy Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Create Channel Modal */}
      {isNewChannelOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3600
        }}>
          <div style={{
            width: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hash size={18} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Create Channel</h3>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  backgroundColor: isAdmin ? '#dcfce7' : '#fee2e2',
                  color: isAdmin ? '#16a34a' : '#dc2626',
                  padding: '2px 6px',
                  borderRadius: '100px'
                }}>
                  {isAdmin ? 'Admin Authorized' : 'Admin Only'}
                </span>
              </div>
              <button 
                onClick={() => setIsNewChannelOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {!isAdmin && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '10px 12px',
                color: '#991b1b',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Lock size={15} />
                <span>Only Workspace Admins or Owners are authorized to create new channels.</span>
              </div>
            )}

            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Channels are where your team communicates. They’re best organized around a topic or project.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Channel Name *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '10px', color: '#94a3b8', fontWeight: 800 }}>#</span>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    placeholder="e.g. sprint-planning, leads-crm"
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 24px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: isAdmin ? '#ffffff' : '#f1f5f9'
                    }}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Channel Topic / Purpose
                </label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  placeholder="What is this channel about?"
                  value={newChannelTopic}
                  onChange={e => setNewChannelTopic(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: isAdmin ? '#ffffff' : '#f1f5f9'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => setIsNewChannelOpen(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                disabled={!isAdmin}
                onClick={() => {
                  if (!isAdmin) {
                    showToast('Permission Denied: Only Workspace Admins can create new channels.');
                    return;
                  }
                  if (!newChannelName.trim()) {
                    showToast('Please enter a channel name');
                    return;
                  }
                  const channelId = newChannelName.trim().toLowerCase();
                  const newCh = {
                    id: channelId,
                    name: newChannelName.trim(),
                    isGeneral: false
                  };
                  setChannels([...channels, newCh]);
                  setActiveChannel(channelId);
                  setActiveTab('channel');
                  setNewChannelName('');
                  setNewChannelTopic('');
                  setIsNewChannelOpen(false);
                  showToast(`Channel #${newCh.name} created!`);
                }}
                style={{
                  flex: 1,
                  backgroundColor: isAdmin ? '#059669' : '#cbd5e1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: isAdmin ? 'pointer' : 'not-allowed'
                }}
              >
                {isAdmin ? 'Create Channel' : 'Admin Required'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Create Space Modal */}
      {isNewSpaceOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
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
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Folder size={18} color="#7c3aed" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Create Space</h3>
              </div>
              <button 
                onClick={() => setIsNewSpaceOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Spaces organize your high-level teams, departments, or client workflows.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Space Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marketing, Product Engineering, Operations"
                  value={newSpaceName}
                  onChange={e => setNewSpaceName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Space Accent Color
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['#7c3aed', '#0284c7', '#059669', '#f59e0b', '#e11d48', '#4f46e5'].map(clr => (
                    <div
                      key={clr}
                      onClick={() => setNewSpaceColor(clr)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: clr,
                        cursor: 'pointer',
                        border: newSpaceColor === clr ? '3px solid #0f172a' : '2px solid transparent',
                        transition: 'transform 0.15s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => setIsNewSpaceOpen(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newSpaceName.trim()) {
                    showToast('Please enter a space name');
                    return;
                  }
                  const newSp = {
                    id: 'space-' + Date.now(),
                    name: newSpaceName.trim(),
                    folder: `${newSpaceName.trim()} Tasks`,
                    color: newSpaceColor,
                    initial: newSpaceName.trim().charAt(0).toUpperCase()
                  };
                  setSpacesList([...spacesList, newSp]);
                  setCurrentSpaceName(newSp.name);
                  setActiveTab('board');
                  setNewSpaceName('');
                  setIsNewSpaceOpen(false);
                  showToast(`Space "${newSp.name}" created!`);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Create Space
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. New Direct Message Modal */}
      {isNewDmOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3600
        }}>
          <div style={{
            width: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#7c3aed" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>New Direct Message</h3>
              </div>
              <button 
                onClick={() => setIsNewDmOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Send a 1-on-1 private message or create personal scratchpad notes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Select Teammate
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {[
                    { name: 'Sarah Miller', initials: 'SM' },
                    { name: `${currentUserName} — You`, initials: userInitials },
                    { name: 'Alex Morgan', initials: 'AM' },
                    { name: 'Emma Davis', initials: 'ED' },
                    { name: 'David Chen', initials: 'DC' }
                  ].map(m => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setNewDmTarget(m.name)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: newDmTarget === m.name ? '#7c3aed' : '#e2e8f0',
                        backgroundColor: newDmTarget === m.name ? '#f5f3ff' : '#ffffff',
                        color: newDmTarget === m.name ? '#7c3aed' : '#475569',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Opening Message / Note (Optional)
                </label>
                <textarea
                  placeholder="Hey, let's sync up on the deliverable..."
                  value={newDmInitialNote}
                  onChange={e => setNewDmInitialNote(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '70px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => setIsNewDmOpen(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const initials = newDmTarget.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
                  if (!directMessages.some(d => d.name === newDmTarget)) {
                    setDirectMessages([...directMessages, { id: 'dm-' + Date.now(), name: newDmTarget, initials }]);
                  }
                  setActiveDmUser({ name: newDmTarget, initials });
                  setActiveTab('dm');
                  setIsNewDmOpen(false);
                  setNewDmInitialNote('');
                  showToast(`Opened Direct Message with ${newDmTarget}!`);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Supabase Real-Time Diagnostics Modal */}
      {isSupabaseDiagOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
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
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={20} color="#16a34a" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Supabase Live Realtime Engine</h3>
              </div>
              <button 
                onClick={() => setIsSupabaseDiagOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 1.5s infinite' }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>
                    PostgreSQL WebSocket Replication: ACTIVE
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#15803d' }}>
                    Endpoint: wss://supabase-engine.realtime/v1 • Latency: 24ms
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '12px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Monitored Tables & Channels
                </div>
                {[
                  { table: 'public.tasks', records: tasks.length, status: 'Synced' },
                  { table: 'public.task_comments', records: '24', status: 'Synced' },
                  { table: 'public.super_agents', records: superAgents.length, status: 'Active' },
                  { table: 'public.channels', records: channels.length, status: 'Active' },
                  { table: 'public.workspaces', records: `1 (${workspaceName})`, status: 'Connected' }
                ].map(r => (
                  <div key={r.table} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontFamily: 'monospace', color: '#334155' }}>{r.table}</span>
                    <span style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={12} /> {r.records} {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                onClick={() => setIsSupabaseDiagOpen(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={async () => {
                  setIsSyncingSupabase(true);
                  showToast('Re-syncing with PostgreSQL and Supabase Realtime channel...');
                  const loaded = await supabaseService.getTasks();
                  setTasks(loaded);
                  setTimeout(() => {
                    setIsSyncingSupabase(false);
                    showToast('Supabase PostgreSQL data successfully synced!');
                  }, 800);
                }}
                disabled={isSyncingSupabase}
                style={{
                  flex: 1,
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {isSyncingSupabase ? <RefreshCw size={14} className="spin-animation" /> : <RefreshCw size={14} />}
                <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Schema Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti Celebration Overlay (Screenshot 2) */}
      {showConfetti && <ConfettiCelebration />}

      {/* Happy Time Tracking Celebration Banner (Matches Screenshot 2) */}
      {showHappyToast && (
        <div style={{
          position: 'fixed',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '10px 24px',
          borderRadius: '9999px',
          fontSize: '0.86rem',
          fontWeight: 700,
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 9999
        }}>
          <span>🎉</span>
          <span>Happy Time Tracking!</span>
        </div>
      )}

      {/* Global Quick Track Time Modal (Accessible from anywhere) */}
      {isGlobalTrackTimeOpen && (
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
                  {userInitials[0] || 'U'}
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                  {currentUserName}
                </span>
              </div>

              <button
                onClick={() => setIsGlobalTrackTimeOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Time Input Box with Play/Stop Button inside */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px',
              padding: '10px 14px',
              backgroundColor: globalTimerRunning ? '#fdf4ff' : '#ffffff'
            }}>
              {globalTimerRunning ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ec4899' }} />
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#7c3aed', fontFamily: 'monospace' }}>
                    {Math.floor(globalTimerSeconds / 3600).toString().padStart(2, '0')}:
                    {Math.floor((globalTimerSeconds % 3600) / 60).toString().padStart(2, '0')}:
                    {(globalTimerSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Enter time (ex: 3h 20m) or start timer"
                  value={globalTimeInput}
                  onChange={e => setGlobalTimeInput(e.target.value)}
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
                onClick={() => setGlobalTimerRunning(!globalTimerRunning)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: globalTimerRunning ? '#ef4444' : '#f1f5f9',
                  color: globalTimerRunning ? '#ffffff' : '#64748b',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {globalTimerRunning ? <Pause size={15} /> : <Play size={15} fill="#64748b" />}
              </button>
            </div>

            {/* Select Task Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1', flexShrink: 0 }} />
              <select
                value={globalSelectedTaskId}
                onChange={e => setGlobalSelectedTaskId(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.84rem',
                  color: globalSelectedTaskId ? '#0f172a' : '#64748b',
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

            {/* Notes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1 }}>≡</div>
              <input
                type="text"
                placeholder="Notes"
                value={globalNotes}
                onChange={e => setGlobalNotes(e.target.value)}
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

            {/* Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Tag size={16} color="#64748b" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Development', 'Design', 'Meeting', 'Review', 'Bugfix'].map(t => {
                  const isSelected = globalTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setGlobalTags(isSelected ? globalTags.filter(x => x !== t) : [...globalTags, t]);
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

            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '10px',
              borderTop: '1px solid #f1f5f9'
            }}>
              <button
                type="button"
                onClick={() => setGlobalBillable(!globalBillable)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: globalBillable ? '#16a34a' : '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                <DollarSign size={16} />
                <span>{globalBillable ? 'Billable' : 'Non-billable'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const taskObj = tasks.find(t => t.id === globalSelectedTaskId) || tasks[0] || {
                    id: 'task-gen',
                    title: 'General Project Time',
                    key: 'CRM-100'
                  };

                  let dur = globalTimerSeconds;
                  if (dur === 0) {
                    const num = parseFloat(globalTimeInput);
                    dur = !isNaN(num) ? num * 3600 : 3600;
                  }

                  const newEntry = {
                    id: 'te-' + Date.now(),
                    taskId: taskObj.id,
                    taskTitle: taskObj.title,
                    taskKey: taskObj.key || 'CRM-101',
                    durationSeconds: dur,
                    dateStr: '2026-10-25',
                    dayOfWeek: 0,
                    startTime: '10:00 am',
                    endTime: '11:00 am',
                    notes: globalNotes.trim(),
                    tags: globalTags,
                    billable: globalBillable,
                    user: currentUserName
                  };

                  try {
                    const existing = JSON.parse(localStorage.getItem('clickup_time_entries_v1') || '[]');
                    localStorage.setItem('clickup_time_entries_v1', JSON.stringify([newEntry, ...existing]));
                  } catch {}

                  setIsGlobalTrackTimeOpen(false);
                  setGlobalTimerRunning(false);
                  setGlobalTimerSeconds(0);
                  setGlobalTimeInput('');
                  setGlobalNotes('');
                  showToast(`Tracked time saved for "${taskObj.title}"!`);
                }}
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

      {/* Live Toast Feedback Notification */}
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
          zIndex: 3000
        }}>
          <CheckCircle2 size={16} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
