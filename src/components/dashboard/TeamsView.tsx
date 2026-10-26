import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Check, 
  MoreHorizontal, 
  Trash2, 
  Sparkles, 
  Building, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Bookmark, 
  Plus, 
  Filter, 
  Calendar, 
  Clock, 
  BarChart2, 
  ExternalLink, 
  Flag, 
  Share2,
  ChevronDown,
  LayoutGrid,
  List as ListIcon,
  Download,
  Copy,
  Phone,
  Square,
  Network,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Info,
  DollarSign,
  Tag,
  Maximize2,
  Minus,
  MessageSquare,
  Send,
  Mic,
  Columns,
  Link2,
  User,
  Folder
} from 'lucide-react';
import { TaskItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Guest';
  status: 'Online' | 'Away' | 'Offline';
  avatarBg: string;
  initials: string;
  isYou?: boolean;
}

export interface TeamBookmark {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

export interface TeamFeedItem {
  id: string;
  actor: string;
  action: string;
  target?: string;
  spaceName?: string;
  time: string;
  type: 'task' | 'create' | 'member' | 'bookmark' | 'priority' | 'standup';
  taskId?: string;
}

export interface TeamPriorityItem {
  id: string;
  memberId: string;
  memberName: string;
  order: number;
  title: string;
  completed: boolean;
  priority?: 'Urgent' | 'High' | 'Normal' | 'Low';
  dueDate?: string;
  taskId?: string;
}

export interface TeamStandupEntry {
  id: string;
  author: string;
  authorInitials: string;
  avatarBg: string;
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
}

export interface TeamGroup {
  id: string;
  name: string;
  handle: string;
  color: string;
  initial: string;
  description: string;
  createdAt: string;
  members: TeamMember[];
  bookmarks: TeamBookmark[];
  feed: TeamFeedItem[];
  priorities: TeamPriorityItem[];
  standups: TeamStandupEntry[];
}

interface TeamsViewProps {
  tasks?: TaskItem[];
  onOpenTask?: (task: TaskItem) => void;
  onOpenInviteModal?: () => void;
  onOpenUpgradeModal?: () => void;
}

const COLOR_PALETTE = ['#176B50', '#2563eb', '#059669', '#db2777', '#ea580c', '#0891b2', '#123D32'];

export const TeamsView: React.FC<TeamsViewProps> = ({ 
  tasks = [], 
  onOpenTask,
  onOpenInviteModal: _onOpenInviteModal, 
  onOpenUpgradeModal 
}) => {
  const { user } = useAuth();
  const currentUserName = user?.name || 'Workspace User';
  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'WU';

  const currentUserMember: TeamMember = useMemo(() => ({
    id: user?.id || 'u-you',
    name: currentUserName,
    email: user?.email || 'user@clickup.com',
    role: (user?.role as 'Owner' | 'Admin' | 'Member' | 'Guest') || 'Owner',
    status: 'Online',
    avatarBg: '#059669',
    initials: userInitials,
    isYou: true
  }), [user?.id, currentUserName, user?.email, user?.role, userInitials]);

  const availableMembers: TeamMember[] = useMemo(() => [
    currentUserMember,
    {
      id: 'u-priya',
      name: 'Priya Gupta',
      email: 'priya.gupta@clickup.demo',
      role: 'Member',
      status: 'Online',
      avatarBg: '#10b981',
      initials: 'PG'
    },
    {
      id: 'u-sarah',
      name: 'Sarah Chang',
      email: 'sarah.chang@clickup.demo',
      role: 'Member',
      status: 'Online',
      avatarBg: '#8b5cf6',
      initials: 'SC'
    },
    {
      id: 'u-mei',
      name: 'Mei Chen',
      email: 'mei.chen@clickup.demo',
      role: 'Member',
      status: 'Away',
      avatarBg: '#06b6d4',
      initials: 'MC'
    },
    {
      id: 'u-ryan',
      name: 'Ryan Johnson',
      email: 'ryan.johnson@clickup.demo',
      role: 'Member',
      status: 'Offline',
      avatarBg: '#f97316',
      initials: 'RJ'
    },
    {
      id: 'u-alex',
      name: 'Alex Rivera',
      email: 'alex.rivera@clickup.demo',
      role: 'Admin',
      status: 'Online',
      avatarBg: '#7c3aed',
      initials: 'AR'
    }
  ], [currentUserMember]);

  const defaultTeams: TeamGroup[] = useMemo(() => [
    {
      id: 'team-falcon',
      name: 'Falcon',
      handle: '@falcon',
      color: '#7c3aed',
      initial: 'F',
      description: 'Core product engineering, sprint execution, and client CRM deliverables.',
      createdAt: '2026-10-25T10:28:00Z',
      members: [currentUserMember],
      bookmarks: [],
      feed: [
        {
          id: 'f-1',
          actor: currentUserName,
          action: 'created team',
          target: 'Falcon',
          time: 'Just now',
          type: 'create'
        }
      ],
      priorities: [],
      standups: [
        {
          id: 'su-1',
          author: currentUserName,
          authorInitials: userInitials,
          avatarBg: '#059669',
          date: 'Oct 25, 2026',
          yesterday: 'Finalized ClickUp 3.0 pulse analytics and sprint backlog',
          today: 'Building workspace collaboration features & member matrix',
          blockers: 'None'
        }
      ]
    }
  ], [currentUserMember, currentUserName, userInitials]);

  // Persistence state
  const [teams, setTeams] = useState<TeamGroup[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_teams_v3');
      if (saved) {
        const parsed: TeamGroup[] = JSON.parse(saved);
        return parsed.filter(t => t.id !== 'team-joyt' && !t.name.toLowerCase().includes('joyt'));
      }
    } catch (e) {
      console.error(e);
    }
    return defaultTeams;
  });

  const [activeTeamId, setActiveTeamId] = useState<string | null>(() => {
    const savedId = localStorage.getItem('clickup_active_team_id');
    return savedId !== null ? savedId : 'team-falcon';
  });

  const [activeSubtab, setActiveSubtab] = useState<
    'overview' | 'analytics' | 'priorities' | 'team' | 'team_chart' | 'standup' | 'workload' | 'timesheet'
  >('overview');

  // Sidebar collapse state matching Screenshot 2 « button
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Modals
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false);
  const [isBrowsePeopleOpen, setIsBrowsePeopleOpen] = useState(false);

  // Form states for Create Team
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('#176B50');

  // Form states for Add Member
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([currentUserMember.id]);

  // Form state for Bookmark
  const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
  const [newBookmarkUrl, setNewBookmarkUrl] = useState('');
  const [bookmarkVisibility, setBookmarkVisibility] = useState<'Public' | 'Team Only'>('Public');
  const [isBookmarkVisDropdownOpen, setIsBookmarkVisDropdownOpen] = useState(false);

  // Priority Form State
  const [isAddPriorityOpen, setIsAddPriorityOpen] = useState(false);
  const [newPriorityTitle, setNewPriorityTitle] = useState('');
  const [newPriorityLevel, setNewPriorityLevel] = useState<'Urgent' | 'High' | 'Normal' | 'Low'>('High');
  const [selectedTaskForPriority, setSelectedTaskForPriority] = useState<string>('');

  // Standup Form State
  const [standupYesterday, setStandupYesterday] = useState('');
  const [standupToday, setStandupToday] = useState('');
  const [standupBlockers, setStandupBlockers] = useState('');
  const [_isStandupFormOpen, setIsStandupFormOpen] = useState(false);

  // Analytics Tab State
  const [analyticsDateOffset, setAnalyticsDateOffset] = useState<number>(0);
  const [analyticsStatusFilter, setAnalyticsStatusFilter] = useState<'online' | 'offline'>('online');

  // Team Tab View Mode (Grid vs List matching Screenshot 5)
  const [teamViewMode, setTeamViewMode] = useState<'grid' | 'list'>('grid');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState<string>('all');
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>('all');

  // Overview Feed filter
  const [feedTypeFilter, setFeedTypeFilter] = useState<'all' | 'task' | 'member' | 'bookmark'>('all');
  const [showSubtasksInFeed, setShowSubtasksInFeed] = useState<boolean>(true);

  // -------------------------------------------------------------
  // TAB 5: Team Chart State (Screenshot 1)
  // -------------------------------------------------------------
  const [chartZoom, setChartZoom] = useState<number>(80);
  const [isChartExpanded, setIsChartExpanded] = useState<boolean>(true);
  const [chartMode, setChartMode] = useState<'people' | 'agents' | 'all'>('people');
  const [chartSearchQuery, setChartSearchQuery] = useState<string>('');
  const [isAgentDetailOpen, setIsAgentDetailOpen] = useState<boolean>(false);

  // -------------------------------------------------------------
  // TAB 6: AI StandUp State (Screenshots 2 & 3)
  // -------------------------------------------------------------
  const [isStandupRefreshing, setIsStandupRefreshing] = useState<boolean>(false);
  const [standupFeedback, setStandupFeedback] = useState<'up' | 'down' | null>(null);
  const [standupContextMenu, setStandupContextMenu] = useState<{
    x: number;
    y: number;
    deal: { id: string; name: string; status: string; color: string; badge: string };
  } | null>(null);

  // -------------------------------------------------------------
  // TAB 7: Workload State (Screenshot 4)
  // -------------------------------------------------------------
  const [isBacklogOpen, setIsBacklogOpen] = useState<boolean>(false);
  const [workloadTimeEstimate, setWorkloadTimeEstimate] = useState<string>('Time Estimates');
  const [workloadTimeRange, setWorkloadTimeRange] = useState<string>('14 days');
  const [workloadDailySchedule, setWorkloadDailySchedule] = useState<string>('Daily Scheduled');
  const [backlogTab, setBacklogTab] = useState<'Unscheduled' | 'No estimate' | 'Overdue' | 'Unassigned'>('Unscheduled');
  const [_backlogSearchQuery, _setBacklogSearchQuery] = useState<string>('');
  const [isClosedIncluded, setIsClosedIncluded] = useState<boolean>(true);
  const [workloadOffset, setWorkloadOffset] = useState<number>(0);

  // -------------------------------------------------------------
  // TAB 8: Timesheet State (Screenshot 5)
  // -------------------------------------------------------------
  const [hideWeekends, setHideWeekends] = useState<boolean>(false);
  const [timesheetWeekOffset, setTimesheetWeekOffset] = useState<number>(0);
  const [isLogTimeModalOpen, setIsLogTimeModalOpen] = useState<boolean>(false);
  const [selectedLogDay, setSelectedLogDay] = useState<string>('Mon, Oct 26');
  const [logTimeAmount, setLogTimeAmount] = useState<string>('8');
  const [logTimeNote, setLogTimeNote] = useState<string>('Sprint task execution & review');
  const [timesheetLoggedHours, setTimesheetLoggedHours] = useState<{ [dayKey: string]: number }>({
    'Mon, Oct 26': 0,
    'Tue, Oct 27': 0,
    'Wed, Oct 28': 0,
    'Thu, Oct 29': 0,
    'Fri, Oct 30': 0,
    'Sun, Oct 25': 0,
    'Sat, Oct 31': 0
  });

  // Priorities Tab Date & Priority Popover state (Screenshots 1, 2, 3)
  const [openDatePickerId, setOpenDatePickerId] = useState<string | null>(null);
  const [openPriorityPickerId, setOpenPriorityPickerId] = useState<string | null>(null);
  const [hoveredFlagId, setHoveredFlagId] = useState<string | null>(null);

  // Member Drawer State in Team tab (Screenshots 4 & 5)
  const [selectedDrawerMember, setSelectedDrawerMember] = useState<TeamMember | null>(null);
  const [memberDrawerTab, setMemberDrawerTab] = useState<'activity' | 'tasks' | 'comments' | 'calendar'>('activity');
  const [isStandupTooltipHovered, setIsStandupTooltipHovered] = useState<boolean>(false);

  // AI StandUp Side Panel & Split Screen State (Screenshots 2, 3, 4)
  const [isAiStandupPanelOpen, setIsAiStandupPanelOpen] = useState<boolean>(true);
  const [isStandupGenerated, setIsStandupGenerated] = useState<boolean>(false);
  const [standupTimePeriod, setStandupTimePeriod] = useState<string>('Last 24 hours');
  const [isSplitTaskViewOpen, setIsSplitTaskViewOpen] = useState<boolean>(false);
  const [selectedSplitTaskDeal, setSelectedSplitTaskDeal] = useState<{
    id: string;
    title: string;
    status: string;
    priority: string;
    space: string;
  } | null>({
    id: 'deal-cloud',
    title: 'Enterprise Cloud Migration Deal',
    status: 'QUALIFIED',
    priority: 'Urgent',
    space: 'Sales CRM'
  });
  const [aiNextPrompt, setAiNextPrompt] = useState<string>('');
  const [aiStandupChatReplies, setAiStandupChatReplies] = useState<{ role: 'user' | 'assistant'; text: string; time: string }[]>([]);
  const [activeDealHoverPopover, setActiveDealHoverPopover] = useState<{
    title: string;
    space: string;
    status: string;
    statusBg: string;
    priority: string;
    assignee: string;
    dueDate: string;
  } | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clickup_teams_v3', JSON.stringify(teams));
      if (activeTeamId) {
        localStorage.setItem('clickup_active_team_id', activeTeamId);
      } else {
        localStorage.removeItem('clickup_active_team_id');
      }
    } catch (e) {
      console.error(e);
    }
  }, [teams, activeTeamId]);

  const activeTeam = teams.find(t => t.id === activeTeamId) || teams[0];

  // Percentage of members with priorities set (Screenshot 2 & 4 pink pill)
  const membersWithPrioritiesCount = activeTeam 
    ? activeTeam.members.filter(m => activeTeam.priorities.some(p => p.memberId === m.id)).length 
    : 0;
  const prioritiesPercentage = activeTeam && activeTeam.members.length > 0 
    ? Math.round((membersWithPrioritiesCount / activeTeam.members.length) * 100) 
    : 0;

  // Handle Team Creation
  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const trimmed = newTeamName.trim();
    const newTeam: TeamGroup = {
      id: 'team-' + Date.now(),
      name: trimmed,
      handle: `@${trimmed.toLowerCase().replace(/\s+/g, '')}`,
      color: newTeamColor,
      initial: trimmed.charAt(0).toUpperCase() || 'T',
      description: newTeamDescription.trim(),
      createdAt: new Date().toISOString(),
      members: [currentUserMember],
      bookmarks: [],
      feed: [
        {
          id: 'f-' + Date.now(),
          actor: currentUserName,
          action: 'created team',
          target: trimmed,
          time: 'Just now',
          type: 'create'
        }
      ],
      priorities: [],
      standups: []
    };

    setTeams([newTeam, ...teams]);
    setActiveTeamId(newTeam.id);
    setIsCreateTeamOpen(false);
    setNewTeamName('');
    setNewTeamDescription('');
    showToast(`Team "${newTeam.name}" created!`);
    
    // Automatically open Add Members modal
    setSelectedMemberIds([currentUserMember.id]);
    setIsAddMemberOpen(true);
  };

  // Handle Add Member Submit
  const handleAddMemberSubmit = () => {
    if (!activeTeam) return;

    const membersToAdd = availableMembers.filter(m => selectedMemberIds.includes(m.id));
    
    // Update active team
    const updatedTeams = teams.map(t => {
      if (t.id === activeTeam.id) {
        const newFeedItems: TeamFeedItem[] = membersToAdd
          .filter(m => !t.members.some(existing => existing.id === m.id))
          .map(m => ({
            id: 'f-' + Date.now() + '-' + m.id,
            actor: m.name.split(' ')[0],
            action: `has been added to ${t.name}`,
            time: 'Just now',
            type: 'member' as const
          }));

        return {
          ...t,
          members: membersToAdd,
          feed: [...newFeedItems, ...t.feed]
        };
      }
      return t;
    });

    setTeams(updatedTeams);
    setIsAddMemberOpen(false);
    showToast(`Team members updated for ${activeTeam.name}`);
  };

  // Handle Add Bookmark
  const handleAddBookmarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam || !newBookmarkTitle.trim() || !newBookmarkUrl.trim()) return;

    let url = newBookmarkUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const bookmark: TeamBookmark = {
      id: 'bm-' + Date.now(),
      title: newBookmarkTitle.trim(),
      url,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const feedItem: TeamFeedItem = {
      id: 'f-' + Date.now(),
      actor: currentUserName,
      action: 'added bookmark',
      target: bookmark.title,
      time: 'Just now',
      type: 'bookmark'
    };

    setTeams(teams.map(t => {
      if (t.id === activeTeam.id) {
        return {
          ...t,
          bookmarks: [bookmark, ...t.bookmarks],
          feed: [feedItem, ...t.feed]
        };
      }
      return t;
    }));

    setNewBookmarkTitle('');
    setNewBookmarkUrl('');
    setIsAddBookmarkOpen(false);
    showToast(`Bookmark "${bookmark.title}" added to ${activeTeam.name}`);
  };

  // Handle Remove Bookmark
  const handleRemoveBookmark = (bmId: string) => {
    if (!activeTeam) return;
    setTeams(teams.map(t => {
      if (t.id === activeTeam.id) {
        return {
          ...t,
          bookmarks: t.bookmarks.filter(b => b.id !== bmId)
        };
      }
      return t;
    }));
    showToast('Bookmark removed');
  };

  // Handle Update Team Description Inline (Screenshot 2)
  const handleUpdateDescription = (desc: string) => {
    if (!activeTeam) return;
    setTeams(teams.map(t => t.id === activeTeam.id ? { ...t, description: desc } : t));
  };

  // Handle Add Priority
  const handleAddPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam) return;

    let titleToAdd = newPriorityTitle.trim();
    let linkedTaskId: string | undefined = undefined;

    if (selectedTaskForPriority) {
      const foundTask = tasks.find(t => t.id === selectedTaskForPriority);
      if (foundTask) {
        titleToAdd = foundTask.title;
        linkedTaskId = foundTask.id;
      }
    }

    if (!titleToAdd) return;

    const newPriority: TeamPriorityItem = {
      id: 'p-' + Date.now(),
      memberId: currentUserMember.id,
      memberName: currentUserName,
      order: activeTeam.priorities.length + 1,
      title: titleToAdd,
      completed: false,
      priority: newPriorityLevel,
      dueDate: 'Today',
      taskId: linkedTaskId
    };

    const feedItem: TeamFeedItem = {
      id: 'f-' + Date.now(),
      actor: currentUserName,
      action: 'set priority',
      target: titleToAdd,
      time: 'Just now',
      type: 'priority'
    };

    setTeams(teams.map(t => {
      if (t.id === activeTeam.id) {
        return {
          ...t,
          priorities: [...t.priorities, newPriority],
          feed: [feedItem, ...t.feed]
        };
      }
      return t;
    }));

    setNewPriorityTitle('');
    setSelectedTaskForPriority('');
    setIsAddPriorityOpen(false);
    showToast('Priority task added!');
  };

  const handleTogglePriority = (priorityId: string) => {
    if (!activeTeam) return;
    setTeams(teams.map(t => {
      if (t.id === activeTeam.id) {
        return {
          ...t,
          priorities: t.priorities.map(p => p.id === priorityId ? { ...p, completed: !p.completed } : p)
        };
      }
      return t;
    }));
  };

  const handleDeletePriority = (priorityId: string) => {
    if (!activeTeam) return;
    setTeams(teams.map(t => {
      if (t.id === activeTeam.id) {
        return {
          ...t,
          priorities: t.priorities.filter(p => p.id !== priorityId)
        };
      }
      return t;
    }));
    showToast('Priority removed');
  };

  // Handle Post Standup
  const _handlePostStandup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam || !standupToday.trim()) return;

    const entry: TeamStandupEntry = {
      id: 'su-' + Date.now(),
      author: currentUserName,
      authorInitials: userInitials,
      avatarBg: '#059669',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      yesterday: standupYesterday.trim() || 'Worked on assigned sprint deliverables',
      today: standupToday.trim(),
      blockers: standupBlockers.trim() || 'None'
    };

    const feedItem: TeamFeedItem = {
      id: 'f-' + Date.now(),
      actor: currentUserName,
      action: 'posted standup update',
      time: 'Just now',
      type: 'standup'
    };

    setTeams(teams.map(t => {
      if (t.id === activeTeam.id) {
        return {
          ...t,
          standups: [entry, ...t.standups],
          feed: [feedItem, ...t.feed]
        };
      }
      return t;
    }));

    setStandupYesterday('');
    setStandupToday('');
    setStandupBlockers('');
    setIsStandupFormOpen(false);
    showToast('Standup update posted!');
  };

  // Export members CSV
  const handleExportMembers = () => {
    if (!activeTeam) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Email,Role,Status"].concat(
          activeTeam.members.map(m => `"${m.name}","${m.email}","${m.role}","${m.status}"`)
        ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTeam.name}_members.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${activeTeam.members.length} members to CSV!`);
  };

  // Compute feed items merging tasks and activities
  const combinedFeed = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      space: string;
      actor: string;
      time: string;
      type: 'task' | 'action';
      iconType?: 'phone' | 'square' | 'general';
      rawTask?: TaskItem;
    }> = [];

    // Real tasks from workspace
    tasks.slice(0, 4).forEach((task, idx) => {
      list.push({
        id: 'feed-task-' + task.id,
        title: task.title,
        space: 'Sales CRM',
        actor: 'You created this task',
        time: idx === 0 ? 'Yesterday at 10:52 pm' : idx === 1 ? 'Yesterday at 10:48 pm' : '2 days ago',
        type: 'task',
        iconType: idx % 2 === 0 ? 'phone' : 'square',
        rawTask: task
      });
    });

    // Team events
    if (activeTeam) {
      activeTeam.feed.forEach(f => {
        list.push({
          id: f.id,
          title: `${f.actor} ${f.action} ${f.target || ''}`.trim(),
          space: activeTeam.name,
          actor: f.actor,
          time: f.time,
          type: 'action'
        });
      });
    }

    return list;
  }, [tasks, activeTeam]);

  // Date for analytics switcher
  const analyticsDate = useMemo(() => {
    const d = new Date(2026, 9, 25);
    d.setDate(d.getDate() + analyticsDateOffset);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [analyticsDateOffset]);

  // Filtered members for Team Tab
  const filteredTeamMembers = useMemo(() => {
    if (!activeTeam) return [];
    return activeTeam.members.filter(m => {
      if (memberSearchQuery.trim()) {
        const q = memberSearchQuery.toLowerCase();
        if (!m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
      }
      if (memberRoleFilter !== 'all' && m.role.toLowerCase() !== memberRoleFilter.toLowerCase()) return false;
      if (memberStatusFilter !== 'all' && m.status.toLowerCase() !== memberStatusFilter.toLowerCase()) return false;
      return true;
    });
  }, [activeTeam, memberSearchQuery, memberRoleFilter, memberStatusFilter]);

  return (
    <div style={{ flex: 1, display: 'flex', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      
      {/* ==================================================================== */}
      {/* LEFT SIDEBAR: TEAMS PULSE NAV (Screenshots 2, 3, 4, 5)                */}
      {/* ==================================================================== */}
      <div style={{
        width: isSidebarCollapsed ? '52px' : '224px',
        transition: 'width 0.2s ease',
        backgroundColor: '#fafbfc',
        borderRight: '1px solid #eaebf0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: isSidebarCollapsed ? '14px 10px' : '14px 16px',
          borderBottom: '1px solid #eaebf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
          height: '52px',
          boxSizing: 'border-box'
        }}>
          {!isSidebarCollapsed ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Teams</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  title="Collapse sidebar"
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '3px'
                  }}
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={() => setIsCreateTeamOpen(true)}
                  title="Create new team"
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={12} />
                  <span>Create</span>
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              title="Expand sidebar"
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronsRight size={18} />
            </button>
          )}
        </div>

        {/* Sidebar Nav Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isSidebarCollapsed ? '8px 4px' : '10px 8px' }}>
          {/* All Teams */}
          <div
            onClick={() => {
              setActiveTeamId(null);
            }}
            title="All Teams"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
              padding: isSidebarCollapsed ? '8px 0' : '7px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              color: !activeTeamId ? '#0f172a' : '#475569',
              fontWeight: !activeTeamId ? 700 : 500,
              backgroundColor: !activeTeamId ? '#e2e8f0' : 'transparent',
              marginBottom: '2px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#64748b" />
              {!isSidebarCollapsed && <span>All Teams</span>}
            </div>
            {!isSidebarCollapsed && (
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{teams.length}</span>
            )}
          </div>

          {/* All People */}
          <div
            onClick={() => setIsBrowsePeopleOpen(true)}
            title="All People Directory"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
              padding: isSidebarCollapsed ? '8px 0' : '7px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              color: '#475569',
              fontWeight: 500,
              marginBottom: '2px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={16} color="#64748b" />
              {!isSidebarCollapsed && <span>All People</span>}
            </div>
            {!isSidebarCollapsed && (
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{availableMembers.length}</span>
            )}
          </div>

          {/* Org Chart */}
          <div
            onClick={() => {
              if (activeTeam) {
                setActiveSubtab('team_chart');
              }
            }}
            title="Org Chart"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              padding: isSidebarCollapsed ? '8px 0' : '7px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              color: activeSubtab === 'team_chart' ? '#0f172a' : '#475569',
              fontWeight: activeSubtab === 'team_chart' ? 700 : 500,
              backgroundColor: activeSubtab === 'team_chart' ? '#f1f5f9' : 'transparent',
              gap: '8px',
              marginBottom: '2px'
            }}
          >
            <Network size={16} color="#64748b" />
            {!isSidebarCollapsed && <span>Org Chart</span>}
          </div>

          {/* Analytics */}
          <div
            onClick={() => {
              if (activeTeam) {
                setActiveSubtab('analytics');
              }
            }}
            title="Analytics"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              padding: isSidebarCollapsed ? '8px 0' : '7px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              color: activeSubtab === 'analytics' ? '#0f172a' : '#475569',
              fontWeight: activeSubtab === 'analytics' ? 700 : 500,
              backgroundColor: activeSubtab === 'analytics' ? '#f1f5f9' : 'transparent',
              gap: '8px',
              marginBottom: '16px'
            }}
          >
            <BarChart2 size={16} color="#64748b" />
            {!isSidebarCollapsed && <span>Analytics</span>}
          </div>

          {/* My Teams Section */}
          {!isSidebarCollapsed && (
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#94a3b8',
              textTransform: 'uppercase',
              padding: '6px 10px',
              letterSpacing: '0.04em'
            }}>
              My Teams
            </div>
          )}

          {/* Teams List */}
          {teams.map(team => {
            const isSelected = activeTeamId === team.id;
            return (
              <div
                key={team.id}
                onClick={() => {
                  setActiveTeamId(team.id);
                  if (!activeSubtab) setActiveSubtab('overview');
                }}
                title={team.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: isSidebarCollapsed ? '8px 0' : '6px 10px',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#ede9fe' : 'transparent',
                  color: isSelected ? '#6d28d9' : '#334155',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.82rem',
                  marginBottom: '2px',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: team.color,
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {team.initial}
                </div>
                {!isSidebarCollapsed && (
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {team.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MAIN RIGHT CONTAINER                                                 */}
      {/* ==================================================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Toast Alert */}
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
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View Mode: If No Active Team (All Teams Hub) */}
        {!activeTeamId || !activeTeam ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Workspace Teams ({teams.length})
                </h1>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
                  Manage teams, assign tasks, organize sprint focus, and review team velocity.
                </p>
              </div>
              <button
                onClick={() => setIsCreateTeamOpen(true)}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={14} /> Create Team
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {teams.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveTeamId(t.id);
                    setActiveSubtab('overview');
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = t.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#eaebf0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: t.color,
                      color: '#fff',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {t.initial}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.handle}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px', minHeight: '36px' }}>
                    {t.description || 'No description added yet. Click to add team wiki.'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                      {t.members.length} {t.members.length === 1 ? 'member' : 'members'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 700 }}>
                      Open Overview →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* View Mode: Active Team View (Screenshots 1, 2, 3, 4, 5) */
          <>
            {/* Top Team Header Bar */}
            <div style={{
              padding: '12px 28px',
              borderBottom: '1px solid #eaebf0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff',
              height: '54px',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: activeTeam.color,
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeTeam.initial}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {activeTeam.name}
                  </h2>
                  <span style={{
                    fontSize: '0.76rem',
                    color: '#64748b',
                    backgroundColor: '#f1f5f9',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    {activeTeam.handle}
                  </span>
                </div>
              </div>

              {/* Add member button (Screenshot 2, 3, 4, 5) */}
              <button
                onClick={() => {
                  setSelectedMemberIds(activeTeam.members.map(m => m.id));
                  setIsAddMemberOpen(true);
                }}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Add member</span>
              </button>
            </div>

            {/* Subtab Navigation Bar (Screenshots 2-5) */}
            <div style={{
              padding: '0 28px',
              borderBottom: '1px solid #eaebf0',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: '#ffffff',
              overflowX: 'auto',
              flexShrink: 0
            }}>
              {[
                { key: 'overview', label: 'Overview', icon: Info, bg: '#475569' },
                { key: 'analytics', label: 'Analytics', icon: BarChart2, bg: '#6366f1' },
                { key: 'priorities', label: 'Priorities', icon: Flag, bg: '#ef4444' },
                { key: 'team', label: 'Team', icon: Users, bg: '#a855f7' },
                { key: 'team_chart', label: 'Team Chart', icon: Network, bg: '#10b981' },
                { key: 'standup', label: 'StandUp', icon: Sparkles, bg: '#7c3aed' },
                { key: 'workload', label: 'Workload', icon: Columns, bg: '#0d9488' },
                { key: 'timesheet', label: 'Timesheet', icon: Clock, bg: '#ea580c' }
              ].map(tab => {
                const isActive = activeSubtab === tab.key;
                const IconComponent = tab.icon;
                return (
                  <div
                    key={tab.key}
                    onClick={() => setActiveSubtab(tab.key as any)}
                    style={{
                      padding: '12px 2px',
                      cursor: 'pointer',
                      color: isActive ? '#0f172a' : '#475569',
                      fontWeight: isActive ? 700 : 600,
                      borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: tab.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
                    }}>
                      <IconComponent size={11} color="#ffffff" strokeWidth={2.4} />
                    </div>
                    <span>{tab.label}</span>
                  </div>
                );
              })}
            </div>

            {/* ================================================================ */}
            {/* SUBTAB 1: OVERVIEW (Screenshot 2)                                 */}
            {/* ================================================================ */}
            {activeSubtab === 'overview' && (
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 28px',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 330px',
                gap: '24px',
                backgroundColor: '#f8fafc'
              }}>
                {/* Left Column (Main) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Card 1: Team Wiki & Description (Screenshot 2) */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Team Wiki &amp; Description
                      </span>
                      <span
                        onClick={() => {
                          const input = document.getElementById('team-desc-input');
                          if (input) input.focus();
                        }}
                        style={{ fontSize: '0.74rem', color: '#7c3aed', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Click to edit
                      </span>
                    </div>
                    <textarea
                      id="team-desc-input"
                      rows={2}
                      value={activeTeam.description}
                      onChange={e => handleUpdateDescription(e.target.value)}
                      placeholder="Add Team description, information, and wiki"
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.88rem',
                        color: '#0f172a',
                        fontWeight: 500,
                        backgroundColor: 'transparent',
                        resize: 'none',
                        fontFamily: 'inherit',
                        lineHeight: '1.45'
                      }}
                    />
                  </div>

                  {/* Card 2: Bookmarks Section (Screenshot 2) */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Bookmarks</span>
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => setIsBookmarkVisDropdownOpen(!isBookmarkVisDropdownOpen)}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.78rem',
                            fontWeight: 600
                          }}
                        >
                          <span>+ {bookmarkVisibility}</span>
                          <ChevronDown size={14} />
                        </button>
                        {isBookmarkVisDropdownOpen && (
                          <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '24px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            border: '1px solid #eaebf0',
                            padding: '6px',
                            zIndex: 100,
                            width: '140px'
                          }}>
                            <div
                              onClick={() => { setBookmarkVisibility('Public'); setIsBookmarkVisDropdownOpen(false); }}
                              style={{ padding: '6px 10px', fontSize: '0.78rem', cursor: 'pointer', borderRadius: '4px', fontWeight: 600, color: '#0f172a' }}
                            >
                              Public
                            </div>
                            <div
                              onClick={() => { setBookmarkVisibility('Team Only'); setIsBookmarkVisDropdownOpen(false); }}
                              style={{ padding: '6px 10px', fontSize: '0.78rem', cursor: 'pointer', borderRadius: '4px', fontWeight: 600, color: '#0f172a' }}
                            >
                              Team Only
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {activeTeam.bookmarks.length === 0 ? (
                      /* Empty state matching Screenshot 2 */
                      <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94a3b8',
                          marginBottom: '12px',
                          position: 'relative'
                        }}>
                          <Bookmark size={20} />
                          <div style={{
                            position: 'absolute',
                            bottom: '-4px',
                            right: '-4px',
                            backgroundColor: '#64748b',
                            borderRadius: '50%',
                            width: '14px',
                            height: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '0.62rem',
                            fontWeight: 800
                          }}>+</div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px', maxWidth: '320px', margin: '0 auto 14px auto', lineHeight: '1.4' }}>
                          Bookmarks make it easy to save ClickUp items or any URL from around the web.
                        </div>
                        <button
                          onClick={() => setIsAddBookmarkOpen(true)}
                          style={{
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '7px 16px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Add Bookmark
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {activeTeam.bookmarks.map(bm => (
                          <div
                            key={bm.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #f1f5f9'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <Bookmark size={16} color="#7c3aed" />
                              <div>
                                <a
                                  href={bm.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}
                                >
                                  {bm.title}
                                </a>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{bm.url}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(bm.url);
                                  showToast('Link copied to clipboard!');
                                }}
                                title="Copy Link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                              >
                                <Copy size={14} />
                              </button>
                              <button
                                onClick={() => handleRemoveBookmark(bm.id)}
                                title="Remove Bookmark"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => setIsAddBookmarkOpen(true)}
                          style={{
                            marginTop: '8px',
                            alignSelf: 'flex-start',
                            background: 'none',
                            border: 'none',
                            color: '#7c3aed',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Plus size={14} /> Add another bookmark
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card 3: Feed Section (Screenshot 2) */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Feed</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                        <span 
                          onClick={() => setFeedTypeFilter(feedTypeFilter === 'all' ? 'task' : 'all')}
                          style={{ cursor: 'pointer' }}
                        >
                          Filter by type {feedTypeFilter !== 'all' ? `(${feedTypeFilter})` : '▾'}
                        </span>
                        <span 
                          onClick={() => setShowSubtasksInFeed(!showSubtasksInFeed)}
                          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          Subtasks: {showSubtasksInFeed ? 'Shown ✕' : 'Hidden +'}
                        </span>
                      </div>
                    </div>

                    {/* Feed Content matching Screenshot 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>
                        Yesterday
                      </div>

                      {combinedFeed.map(item => (
                        <div
                          key={item.id}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {item.iconType === 'phone' ? (
                                <Phone size={14} color="#0284c7" />
                              ) : (
                                <Square size={13} color="#64748b" />
                              )}
                              <span
                                onClick={() => {
                                  if (item.rawTask && onOpenTask) {
                                    onOpenTask(item.rawTask);
                                  }
                                }}
                                style={{
                                  fontSize: '0.86rem',
                                  fontWeight: 700,
                                  color: '#0f172a',
                                  cursor: item.rawTask ? 'pointer' : 'default'
                                }}
                              >
                                {item.title}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                              {item.time}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.74rem', color: '#64748b', paddingLeft: '22px' }}>
                            <span>Space / {item.space}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '22px', marginTop: '2px' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: '#059669',
                              color: '#fff',
                              fontSize: '0.58rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {userInitials}
                            </div>
                            <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 500 }}>
                              {item.actor}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (Sidebar) matching Screenshot 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Card 1: Members */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                      Members
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      {activeTeam.members.map(m => (
                        <div
                          key={m.id}
                          title={`${m.name} (${m.role}) - ${m.status}`}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: m.avatarBg,
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            position: 'relative'
                          }}
                        >
                          {m.initials}
                          <div style={{
                            position: 'absolute',
                            bottom: '-1px',
                            right: '-1px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#16a34a',
                            border: '1.5px solid #ffffff'
                          }} />
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          setSelectedMemberIds(activeTeam.members.map(m => m.id));
                          setIsAddMemberOpen(true);
                        }}
                        title="Add member to team"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1px dashed #cbd5e1',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#64748b'
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Pink Warning Pill: 0% of people have Priorities set (Screenshot 2) */}
                    <div
                      onClick={() => setActiveSubtab('priorities')}
                      title="Click to set team priorities"
                      style={{
                        backgroundColor: '#fff1f2',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '0.76rem',
                        color: '#be123c',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <span>🙃</span>
                      <span>{prioritiesPercentage}% of people have Priorities set</span>
                    </div>
                  </div>

                  {/* Card 2: Time off (Screenshot 2) */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                      Time off
                    </div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                      Business Plus
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '14px', lineHeight: '1.4' }}>
                      Try FREE for 15 days<br />No credit card required!
                    </div>

                    <button
                      onClick={() => {
                        if (onOpenUpgradeModal) onOpenUpgradeModal();
                        else showToast('Business Plus trial activated!');
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--brand-primary, #176B50)',
                        color: 'var(--interactive-primary-text, #ffffff)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '9px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
                      }}
                    >
                      Start FREE Trial
                    </button>
                  </div>

                  {/* Card 3: Team Analytics (Screenshot 2) */}
                  <div
                    onClick={() => setActiveSubtab('analytics')}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #eaebf0',
                      borderRadius: '12px',
                      padding: '18px 20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                      Team Analytics
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: '#f1f5f9',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        marginBottom: '10px'
                      }}>
                        <BarChart2 size={22} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                        Not enough data.
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Team Member Preview Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {availableMembers.slice(1, 3).map(m => (
                      <div
                        key={m.id}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #eaebf0',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: m.avatarBg,
                            color: '#fff',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {m.initials}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{m.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{m.role}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>Online</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* SUBTAB 2: ANALYTICS (Screenshot 3)                                */}
            {/* ================================================================ */}
            {activeSubtab === 'analytics' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', backgroundColor: '#f8fafc' }}>
                {/* Date Selector Header (Screenshot 3) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <button
                    onClick={() => setAnalyticsDateOffset(prev => prev - 1)}
                    style={{
                      width: '26px',
                      height: '26px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      background: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ChevronLeft size={14} color="#64748b" />
                  </button>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <span>{analyticsDate}</span>
                    <ChevronDown size={12} />
                  </div>
                  <button
                    onClick={() => setAnalyticsDateOffset(prev => prev + 1)}
                    style={{
                      width: '26px',
                      height: '26px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      background: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ChevronRight size={14} color="#64748b" />
                  </button>
                </div>

                {/* Top Activity Timeline Bar Chart (Screenshot 3) */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaebf0',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  marginBottom: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '24px' }}>
                    • NUMBER OF PEOPLE WHO WERE ONLINE
                  </div>

                  {/* 24-hour timeline */}
                  <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', gap: '4px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    {[
                      { label: '12am', val: 0 },
                      { label: '1am', val: 0 },
                      { label: '2am', val: 0 },
                      { label: '3am', val: 0 },
                      { label: '4am', val: 0 },
                      { label: '5am', val: 0 },
                      { label: '6am', val: 0 },
                      { label: '7am', val: 0 },
                      { label: '8am', val: 0 },
                      { label: '9am', val: 100 }, // Purple bar matching Screenshot 3!
                      { label: '10am', val: 0 },
                      { label: '11am', val: 0 },
                      { label: '12pm', val: 0 },
                      { label: '1pm', val: 0 },
                      { label: '2pm', val: 0 },
                      { label: '3pm', val: 0 },
                      { label: '4pm', val: 0 },
                      { label: '5pm', val: 0 },
                      { label: '6pm', val: 0 },
                      { label: '7pm', val: 0 },
                      { label: '8pm', val: 0 },
                      { label: '9pm', val: 0 },
                      { label: '10pm', val: 0 },
                      { label: '11pm', val: 0 }
                    ].map((hour, idx) => (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        {hour.val > 0 && (
                          <div 
                            title={`1 member online at ${hour.label} (${currentUserName})`}
                            style={{
                              width: '18px',
                              height: '90px',
                              backgroundColor: 'var(--brand-primary, #176B50)',
                              borderRadius: '4px 4px 0 0',
                              marginBottom: '4px',
                              cursor: 'pointer'
                            }} 
                          />
                        )}
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{hour.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Member Pulse List matching Screenshot 3 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span 
                      onClick={() => setAnalyticsStatusFilter('online')}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: analyticsStatusFilter === 'online' ? '#0f172a' : '#64748b',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: analyticsStatusFilter === 'online' ? '#f1f5f9' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      {activeTeam.members.filter(m => m.status === 'Online').length} Online
                    </span>
                    <span 
                      onClick={() => setAnalyticsStatusFilter('offline')}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: analyticsStatusFilter === 'offline' ? '#0f172a' : '#64748b',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: analyticsStatusFilter === 'offline' ? '#f1f5f9' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      {activeTeam.members.filter(m => m.status !== 'Online').length} Offline
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#64748b' }}>
                    <span style={{ cursor: 'pointer' }}>Sort ▾</span>
                    <span style={{ cursor: 'pointer' }}>Item type ▾</span>
                  </div>
                </div>

                {/* Member Activity Card matching Screenshot 3 */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaebf0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  maxWidth: '380px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#059669',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.76rem',
                        position: 'relative'
                      }}>
                        {userInitials}
                        <div style={{
                          position: 'absolute',
                          bottom: '-1px',
                          right: '-1px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#16a34a',
                          border: '1.5px solid #ffffff'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>You</span>
                    </div>
                    <span style={{ color: '#cbd5e1', cursor: 'pointer' }}>•••</span>
                  </div>

                  <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                    Nothing to see here
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* ================================================================ */}
            {/* SUBTAB 3: PRIORITIES (Screenshots 1, 2, 3)                         */}
            {/* ================================================================ */}
            {activeSubtab === 'priorities' && (
              <div 
                onClick={() => {
                  if (openDatePickerId) setOpenDatePickerId(null);
                  if (openPriorityPickerId) setOpenPriorityPickerId(null);
                }}
                style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', backgroundColor: '#f8fafc', position: 'relative' }}
              >
                <div style={{ maxWidth: '640px' }}>
                  {/* Sort dropdown (Screenshot 1) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Sort</span>
                      <ChevronDown size={13} />
                    </div>
                  </div>

                  {/* Member Priority Card (Screenshots 1, 2, 3) */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    position: 'relative'
                  }}>
                    {/* Member Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          position: 'relative'
                        }}>
                          {userInitials}
                          <div style={{
                            position: 'absolute',
                            bottom: '-1px',
                            right: '-1px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#16a34a',
                            border: '1.5px solid #ffffff'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                          {currentUserName}
                        </span>
                      </div>

                      {/* Expand icon (Screenshot 1) */}
                      <button
                        onClick={() => showToast('Expanded member priority view')}
                        title="Expand view"
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}
                      >
                        <Maximize2 size={14} />
                      </button>
                    </div>

                    {/* Priorities Task List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                      {activeTeam.priorities.map(p => (
                        <div
                          key={p.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #f1f5f9',
                            position: 'relative'
                          }}
                        >
                          {/* Left: Drag handle, Circle checkbox, Phone icon, Title */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Drag handle dots (Screenshot 1) */}
                            <span style={{ color: '#cbd5e1', fontSize: '0.85rem', cursor: 'grab', userSelect: 'none' }}>
                              ⠿
                            </span>

                            {/* Circular checkbox */}
                            <div
                              onClick={() => handleTogglePriority(p.id)}
                              style={{
                                width: '15px',
                                height: '15px',
                                borderRadius: '50%',
                                border: p.completed ? '1.5px solid #16a34a' : '1.5px dashed #cbd5e1',
                                backgroundColor: p.completed ? '#16a34a' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              {p.completed && <Check size={10} color="#ffffff" />}
                            </div>

                            {/* Phone / task icon */}
                            <Phone size={13} color="#0284c7" />

                            {/* Title */}
                            <span style={{
                              fontSize: '0.84rem',
                              fontWeight: 600,
                              color: p.completed ? '#94a3b8' : '#0f172a',
                              textDecoration: p.completed ? 'line-through' : 'none'
                            }}>
                              {p.title}
                            </span>
                          </div>

                          {/* Right Actions: Due date, Priority Flag, Clear button */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                            
                            {/* Due date button (Screenshot 1 & 2) */}
                            <div style={{ position: 'relative' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDatePickerId(openDatePickerId === p.id ? null : p.id);
                                  setOpenPriorityPickerId(null);
                                }}
                                title="Set due date"
                                style={{
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  color: p.dueDate ? '#7c3aed' : '#64748b',
                                  padding: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  borderRadius: '4px'
                                }}
                              >
                                <Calendar size={14} />
                              </button>

                              {/* Date Picker Popover (Screenshot 2) */}
                              {openDatePickerId === p.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    position: 'absolute',
                                    top: '28px',
                                    right: 0,
                                    backgroundColor: '#ffffff',
                                    borderRadius: '12px',
                                    border: '1px solid #eaebf0',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                                    width: '380px',
                                    zIndex: 6000,
                                    overflow: 'hidden'
                                  }}
                                >
                                  {/* Date Picker Tabs Header (Screenshot 2) */}
                                  <div style={{ display: 'flex', borderBottom: '1px solid #eaebf0', padding: '10px 14px', gap: '10px' }}>
                                    <button style={{
                                      flex: 1,
                                      padding: '6px',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '6px',
                                      backgroundColor: '#ffffff',
                                      fontSize: '0.76rem',
                                      fontWeight: 600,
                                      color: '#64748b',
                                      cursor: 'pointer'
                                    }}>
                                      Start date
                                    </button>
                                    <button style={{
                                      flex: 1,
                                      padding: '6px',
                                      border: '1.5px solid #0f172a',
                                      borderRadius: '6px',
                                      backgroundColor: '#ffffff',
                                      fontSize: '0.76rem',
                                      fontWeight: 700,
                                      color: '#0f172a',
                                      cursor: 'pointer'
                                    }}>
                                      Due date
                                    </button>
                                  </div>

                                  {/* Date Picker Body: Quick options + Calendar Grid (Screenshot 2) */}
                                  <div style={{ display: 'flex', padding: '12px 14px', gap: '14px' }}>
                                    {/* Left presets column */}
                                    <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '4px', borderRight: '1px solid #f1f5f9', paddingRight: '10px' }}>
                                      {[
                                        { label: 'Today', sub: 'Sun' },
                                        { label: 'Later', sub: '10:10 pm' },
                                        { label: 'Tomorrow', sub: 'Mon' },
                                        { label: 'Next week', sub: 'Mon' },
                                        { label: 'Next weekend', sub: 'Sat' },
                                        { label: '2 weeks', sub: '8 Nov' },
                                        { label: '4 weeks', sub: '22 Nov' },
                                        { label: '8 weeks', sub: '20 Dec' }
                                      ].map((preset, idx) => (
                                        <div
                                          key={idx}
                                          onClick={() => {
                                            setOpenDatePickerId(null);
                                            showToast(`Due date set to ${preset.label} (${preset.sub})`);
                                          }}
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '4px 6px',
                                            fontSize: '0.74rem',
                                            cursor: 'pointer',
                                            borderRadius: '4px'
                                          }}
                                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{preset.label}</span>
                                          <span style={{ color: '#94a3b8' }}>{preset.sub}</span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Right Calendar Month Grid (Screenshot 2) */}
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>October 2026</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#64748b' }}>
                                          <span style={{ fontWeight: 600 }}>Today</span>
                                          <span>^</span>
                                          <span>v</span>
                                        </div>
                                      </div>

                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.68rem', color: '#94a3b8', marginBottom: '6px' }}>
                                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                                      </div>

                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '2px', fontSize: '0.74rem' }}>
                                        {[27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day, idx) => {
                                          const isToday = day === 25 && idx >= 28;
                                          return (
                                            <div
                                              key={idx}
                                              onClick={() => {
                                                setOpenDatePickerId(null);
                                                showToast(`Due date set to Oct ${day}`);
                                              }}
                                              style={{
                                                padding: '4px 0',
                                                cursor: 'pointer',
                                                borderRadius: '50%',
                                                backgroundColor: isToday ? '#ef4444' : 'transparent',
                                                color: isToday ? '#ffffff' : idx < 4 ? '#cbd5e1' : '#0f172a',
                                                fontWeight: isToday ? 800 : 500
                                              }}
                                            >
                                              {day}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Bottom Schedule Banner (Screenshot 2) */}
                                  <div style={{
                                    borderTop: '1px solid #eaebf0',
                                    backgroundColor: '#fafbfc',
                                    padding: '10px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span>🏖️</span>
                                      <div>
                                        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0f172a' }}>Set up your work schedule</div>
                                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Set working days/hours and holidays for your workspace.</div>
                                      </div>
                                    </div>
                                    <span
                                      onClick={() => setOpenDatePickerId(null)}
                                      style={{ cursor: 'pointer', color: '#94a3b8', fontSize: '0.8rem' }}
                                    >
                                      ✕
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Priority Flag with hover tooltip & popover (Screenshots 1 & 3) */}
                            <div style={{ position: 'relative' }}>
                              <button
                                onMouseEnter={() => setHoveredFlagId(p.id)}
                                onMouseLeave={() => setHoveredFlagId(null)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenPriorityPickerId(openPriorityPickerId === p.id ? null : p.id);
                                  setOpenDatePickerId(null);
                                }}
                                style={{
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Flag
                                  size={14}
                                  color={p.priority === 'Urgent' ? '#ef4444' : p.priority === 'High' ? '#f97316' : p.priority === 'Normal' ? '#3b82f6' : '#94a3b8'}
                                />
                              </button>

                              {/* Hover Tooltip (Screenshot 3) */}
                              {hoveredFlagId === p.id && !openPriorityPickerId && (
                                <div style={{
                                  position: 'absolute',
                                  bottom: '26px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  backgroundColor: '#0f172a',
                                  color: '#ffffff',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  whiteSpace: 'nowrap',
                                  zIndex: 6000,
                                  pointerEvents: 'none'
                                }}>
                                  Set priority
                                </div>
                              )}

                              {/* Priority Dropdown Menu */}
                              {openPriorityPickerId === p.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    position: 'absolute',
                                    top: '28px',
                                    right: 0,
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #eaebf0',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                                    padding: '6px',
                                    zIndex: 6000,
                                    minWidth: '130px'
                                  }}
                                >
                                  {(['Urgent', 'High', 'Normal', 'Low'] as const).map(lvl => (
                                    <div
                                      key={lvl}
                                      onClick={() => {
                                        setTeams(prev => prev.map(t => {
                                          if (t.id === activeTeam.id) {
                                            return {
                                              ...t,
                                              priorities: t.priorities.map(item => item.id === p.id ? { ...item, priority: lvl } : item)
                                            };
                                          }
                                          return t;
                                        }));
                                        setOpenPriorityPickerId(null);
                                        showToast(`Priority set to ${lvl}`);
                                      }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '6px 8px',
                                        fontSize: '0.76rem',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                        fontWeight: 600,
                                        color: '#0f172a'
                                      }}
                                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                      <Flag size={12} color={lvl === 'Urgent' ? '#ef4444' : lvl === 'High' ? '#f97316' : lvl === 'Normal' ? '#3b82f6' : '#94a3b8'} />
                                      <span>{lvl}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Clear button (Screenshot 1) */}
                            <button
                              onClick={() => {
                                handleDeletePriority(p.id);
                                showToast('Priority cleared');
                              }}
                              style={{
                                backgroundColor: '#0f172a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '3px 10px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Check size={11} color="#ffffff" />
                              <span>Clear</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* + Add Task Button (Screenshot 1) */}
                    {!isAddPriorityOpen ? (
                      <button
                        onClick={() => setIsAddPriorityOpen(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748b',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 0'
                        }}
                      >
                        <Plus size={14} />
                        <span>Add task</span>
                      </button>
                    ) : (
                      <form onSubmit={handleAddPriority} style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        <input
                          type="text"
                          placeholder="What needs to get done today?"
                          value={newPriorityTitle}
                          onChange={e => setNewPriorityTitle(e.target.value)}
                          autoFocus
                          style={{
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            fontSize: '0.84rem',
                            outline: 'none',
                            color: '#0f172a'
                          }}
                        />

                        {tasks.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Or select task:</span>
                            <select
                              value={selectedTaskForPriority}
                              onChange={e => setSelectedTaskForPriority(e.target.value)}
                              style={{
                                flex: 1,
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                fontSize: '0.76rem',
                                color: '#0f172a'
                              }}
                            >
                              <option value="">-- Choose from backlog --</option>
                              {tasks.map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {(['Urgent', 'High', 'Normal', 'Low'] as const).map(lvl => (
                              <button
                                type="button"
                                key={lvl}
                                onClick={() => setNewPriorityLevel(lvl)}
                                style={{
                                  border: newPriorityLevel === lvl ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                                  backgroundColor: newPriorityLevel === lvl ? '#f5f3ff' : '#ffffff',
                                  color: newPriorityLevel === lvl ? '#7c3aed' : '#64748b',
                                  borderRadius: '4px',
                                  padding: '2px 6px',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => setIsAddPriorityOpen(false)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.76rem',
                                color: '#64748b'
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              style={{
                                backgroundColor: '#0f172a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* Floating Bottom-Left Widget: ⚑ 1 Priority (Screenshots 1, 2, 3, 4) */}
                <div
                  onClick={() => setActiveSubtab('priorities')}
                  style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: isSidebarCollapsed ? '72px' : '244px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    zIndex: 2000
                  }}
                >
                  <Flag size={13} color="#f97316" />
                  <span>{activeTeam.priorities.length} {activeTeam.priorities.length === 1 ? 'Priority' : 'Priorities'}</span>
                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* SUBTAB 4: TEAM / MEMBERS (Screenshots 4 & 5)                      */}
            {/* ================================================================ */}
            {activeSubtab === 'team' && (
              <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden', position: 'relative' }}>
                
                {/* Main Left Area: Filters & Member Cards Grid/List OR Split Task View (Screenshot 4) */}
                {isSplitTaskViewOpen && selectedSplitTaskDeal ? (
                  <div style={{
                    flex: 1,
                    borderRight: '1px solid #eaebf0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    minWidth: '460px'
                  }}>
                    {/* Top Breadcrumb & Actions Bar (Screenshot 4) */}
                    <div style={{
                      padding: '12px 20px',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#ffffff'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Folder size={15} color="#64748b" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                          Sales CRM
                        </span>
                        <button
                          onClick={() => showToast('Add task to CRM')}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                        >
                          <Plus size={13} />
                        </button>
                        <ExternalLink size={12} color="#94a3b8" style={{ cursor: 'pointer' }} />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(window.location.href);
                            showToast('Deal link copied to clipboard!');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            cursor: 'pointer'
                          }}
                        >
                          <Share2 size={12} />
                          <span>Share</span>
                        </button>

                        <button
                          onClick={() => showToast('Task settings and automations')}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        <button
                          onClick={() => setIsSplitTaskViewOpen(false)}
                          title="Close split view"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Task Card Body (Screenshot 4) */}
                    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Task Pill & Estimate */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          color: '#0f172a'
                        }}>
                          <Phone size={12} color="#64748b" />
                          <span>Task ▾</span>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.74rem',
                          color: '#64748b',
                          fontWeight: 600
                        }}>
                          <Clock size={12} />
                          <span>2</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h1 style={{
                        fontSize: '1.45rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: 0,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.25
                      }}>
                        {selectedSplitTaskDeal.title}
                      </h1>

                      {/* ClickUp Brain AI Banner (Screenshot 4) */}
                      <div style={{
                        backgroundColor: '#fdf2f8',
                        border: '1px solid #fbcfe8',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}
                      onClick={() => showToast('Brain² generating deal presentation...')}
                      >
                        <Sparkles size={15} color="#db2777" />
                        <span style={{ fontSize: '0.8rem', color: '#db2777', fontWeight: 600 }}>
                          Ask Brain² to build an agent, draft an email or create a presentation
                        </span>
                      </div>

                      {/* Metadata Attributes Grid (Screenshot 4) */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '14px 28px',
                        padding: '12px 0',
                        borderTop: '1px solid #f1f5f9',
                        borderBottom: '1px solid #f1f5f9'
                      }}>
                        {/* Status */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', width: '80px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={13} color="#94a3b8" />
                            Status
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              backgroundColor: '#fef08a',
                              color: '#854d0e',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              {selectedSplitTaskDeal.status} ▾
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#16a34a' }}>✓</span>
                          </div>
                        </div>

                        {/* Assignees */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', width: '80px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Users size={13} color="#94a3b8" />
                            Assignees
                          </span>
                          <span
                            onClick={() => showToast(`Assigned ${selectedSplitTaskDeal.title} to ${currentUserName}`)}
                            style={{ fontSize: '0.78rem', color: '#94a3b8', cursor: 'pointer' }}
                          >
                            Empty
                          </span>
                        </div>

                        {/* Dates */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', width: '80px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={13} color="#94a3b8" />
                            Dates
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 600 }}>
                            5 days ago → Due
                          </span>
                        </div>

                        {/* Priority */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', width: '80px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Flag size={13} color="#94a3b8" />
                            Priority
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Flag size={12} color="#dc2626" fill="#dc2626" />
                            <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 800 }}>
                              {selectedSplitTaskDeal.priority || 'Urgent'}
                            </span>
                          </div>
                        </div>

                        {/* Track Time */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', width: '80px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={13} color="#94a3b8" />
                            Track time
                          </span>
                          <button
                            onClick={() => showToast('Timer started for Cloud Migration Deal')}
                            style={{
                              background: 'none',
                              border: '1px solid #cbd5e1',
                              borderRadius: '4px',
                              padding: '2px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#0f172a',
                              cursor: 'pointer'
                            }}
                          >
                            ▶ Start
                          </button>
                        </div>

                        {/* Tags */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', width: '80px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Tag size={13} color="#94a3b8" />
                            Tags
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', cursor: 'pointer' }}>
                            Empty
                          </span>
                        </div>
                      </div>

                      {/* Description Area */}
                      <div>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', cursor: 'pointer' }}>
                          Add description, or write with 🪄 AI
                        </span>
                      </div>

                      {/* Custom CRM Fields (Screenshot 4) */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                          <ChevronDown size={14} color="#64748b" />
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                            Fields
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {[
                            { name: 'Company Name', icon: null, textIcon: 'T', val: '—' },
                            { name: 'Contact Email', icon: Mail, val: '—' },
                            { name: 'Deal Summary', icon: Link2, val: '—' },
                            { name: 'Expected Value', icon: null, textIcon: '$', val: '$' },
                            { name: 'Lead Owner', icon: User, val: '—' },
                            { name: 'Next Follow-up', icon: Calendar, val: '—' }
                          ].map(f => {
                            const FieldIcon = f.icon;
                            return (
                              <div key={f.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8fafc' }}>
                                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ width: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                    {FieldIcon ? <FieldIcon size={13} color="#94a3b8" /> : f.textIcon}
                                  </span>
                                  <span>{f.name}</span>
                                </span>
                                <span style={{ fontSize: '0.78rem', color: '#94a3b8', cursor: 'pointer' }}>
                                  {f.val}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* Main Left Area: Filters & Member Cards Grid/List */
                  <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', backgroundColor: '#ffffff' }}>
                    
                    {/* Top Filter Bar (Screenshot 5) */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '24px',
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}>
                      {/* Left Dropdown Filters */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <select
                          value={memberStatusFilter}
                          onChange={e => setMemberStatusFilter(e.target.value)}
                          style={{
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '0.78rem',
                            color: '#0f172a',
                            fontWeight: 600,
                            backgroundColor: '#ffffff'
                          }}
                        >
                          <option value="all">Status ▾</option>
                          <option value="online">Online</option>
                          <option value="away">Away</option>
                          <option value="offline">Offline</option>
                        </select>

                        <select
                          value={memberRoleFilter}
                          onChange={e => setMemberRoleFilter(e.target.value)}
                          style={{
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '0.78rem',
                            color: '#0f172a',
                            fontWeight: 600,
                            backgroundColor: '#ffffff'
                          }}
                        >
                          <option value="all">Account type ▾</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                          <option value="guest">Guest</option>
                        </select>

                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>
                          Manager ▾
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>
                          Sort ▾
                        </span>
                      </div>

                      {/* Right Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          onClick={handleExportMembers}
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Download size={13} />
                          <span>Export</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedMemberIds(activeTeam.members.map(m => m.id));
                            setIsAddMemberOpen(true);
                          }}
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
                            gap: '6px'
                          }}
                        >
                          <span>Add member</span>
                        </button>

                        {/* Write StandUp button (Screenshot 2) */}
                        <button
                          onClick={() => setIsAiStandupPanelOpen(prev => !prev)}
                          style={{
                            backgroundColor: isAiStandupPanelOpen ? '#f1f5f9' : '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Sparkles size={13} color="#ec4899" />
                          <span>Write StandUp</span>
                        </button>

                      {/* Search box */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        backgroundColor: '#ffffff'
                      }}>
                        <Search size={14} color="#94a3b8" />
                        <input
                          type="text"
                          placeholder="Search People"
                          value={memberSearchQuery}
                          onChange={e => setMemberSearchQuery(e.target.value)}
                          style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: '0.78rem',
                            color: '#0f172a',
                            width: '130px'
                          }}
                        />
                      </div>

                      {/* View Switcher: Grid vs List */}
                      <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                        <button
                          onClick={() => setTeamViewMode('grid')}
                          title="Grid View"
                          style={{
                            border: 'none',
                            padding: '6px 8px',
                            cursor: 'pointer',
                            backgroundColor: teamViewMode === 'grid' ? '#0f172a' : '#ffffff',
                            color: teamViewMode === 'grid' ? '#ffffff' : '#64748b'
                          }}
                        >
                          <LayoutGrid size={14} />
                        </button>
                        <button
                          onClick={() => setTeamViewMode('list')}
                          title="List View"
                          style={{
                            border: 'none',
                            padding: '6px 8px',
                            cursor: 'pointer',
                            backgroundColor: teamViewMode === 'list' ? '#0f172a' : '#ffffff',
                            color: teamViewMode === 'list' ? '#ffffff' : '#64748b'
                          }}
                        >
                          <ListIcon size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Member Cards Grid View (Screenshot 4 & 5) */}
                  {teamViewMode === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                      {filteredTeamMembers.map(m => {
                        const isSelected = selectedDrawerMember?.id === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => setSelectedDrawerMember(isSelected ? null : m)}
                            style={{
                              borderRadius: '12px',
                              overflow: 'hidden',
                              border: isSelected ? '2px solid #7c3aed' : '1px solid #eaebf0',
                              backgroundColor: '#ffffff',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                              display: 'flex',
                              flexDirection: 'column',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => {
                              if (!isSelected) e.currentTarget.style.borderColor = '#cbd5e1';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                              if (!isSelected) e.currentTarget.style.borderColor = '#eaebf0';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            {/* Big Dark Box with Large Initials (Screenshot 4 & 5) */}
                            <div style={{
                              height: '150px',
                              backgroundColor: '#1e293b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontSize: '2.5rem',
                              fontWeight: 900,
                              letterSpacing: '-0.02em'
                            }}>
                              {m.initials}
                            </div>

                            {/* Bottom Label with Status Dot */}
                            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                                    {m.name}
                                  </span>
                                  <div style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    backgroundColor: m.status === 'Online' ? '#16a34a' : '#94a3b8'
                                  }} />
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                                  {m.role}
                                </div>
                              </div>

                              <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                                •••
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Table List View */
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid #eaebf0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '10px 14px' }}>Member</th>
                          <th style={{ padding: '10px 14px' }}>Role</th>
                          <th style={{ padding: '10px 14px' }}>Status</th>
                          <th style={{ padding: '10px 14px' }}>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTeamMembers.map(m => (
                          <tr
                            key={m.id}
                            onClick={() => setSelectedDrawerMember(m)}
                            style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: m.avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.76rem' }}>
                                  {m.initials}
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>
                                  {m.name} {m.isYou && <span style={{ color: '#059669', fontSize: '0.72rem' }}>(You)</span>}
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '12px 14px', fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                              {m.role}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: m.status === 'Online' ? '#16a34a' : '#94a3b8' }}>
                                ● {m.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#64748b' }}>
                              {m.email}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                </div>
              )}

                {/* 2. RIGHT PANE: AI STANDUP SIDE PANEL (Screenshots 2, 3, 4 1:1) */}
                {isAiStandupPanelOpen && (
                  <div style={{
                    width: isSplitTaskViewOpen ? '50%' : '480px',
                    maxWidth: isSplitTaskViewOpen ? '50%' : '520px',
                    borderLeft: '1px solid #eaebf0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    height: '100%',
                    overflow: 'hidden',
                    boxShadow: '-4px 0 16px rgba(0,0,0,0.03)',
                    position: 'relative'
                  }}>
                    {/* Top Bar (Screenshots 2, 3, 4) */}
                    <div style={{
                      padding: '12px 20px',
                      borderBottom: '1px solid #eaebf0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#ffffff'
                    }}>
                      {/* Left: New Chat Button */}
                      <button
                        onClick={() => {
                          setIsStandupGenerated(false);
                          showToast('Started new AI StandUp chat');
                        }}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '5px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <MessageSquare size={13} />
                        <span>New Chat</span>
                      </button>

                      {/* Right: Slash, Split Screen, Close */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {!isStandupGenerated && (
                          <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>
                            Write StandUp
                          </span>
                        )}

                        <button
                          onClick={() => showToast('Slash commands: /standup, /summarize, /task')}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', fontSize: '0.85rem' }}
                        >
                          /
                        </button>

                        <button
                          onClick={() => {
                            if (!isSplitTaskViewOpen) {
                              setIsSplitTaskViewOpen(true);
                              setSelectedSplitTaskDeal({
                                id: 'deal-cloud',
                                title: 'Enterprise Cloud Migration Deal',
                                status: 'QUALIFIED',
                                priority: 'Urgent',
                                space: 'Sales CRM'
                              });
                            } else {
                              setIsSplitTaskViewOpen(false);
                            }
                          }}
                          title="Toggle split view"
                          style={{ background: 'none', border: 'none', color: isSplitTaskViewOpen ? '#7c3aed' : '#94a3b8', cursor: 'pointer', padding: '2px' }}
                        >
                          <Maximize2 size={15} />
                        </button>

                        <button
                          onClick={() => setIsAiStandupPanelOpen(false)}
                          title="Close panel"
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Panel Body */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
                      
                      {/* MODE 1: FORM (Screenshot 2 1:1) */}
                      {!isStandupGenerated ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {/* Brain Branding */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={16} color="#7c3aed" />
                            <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                              Brain
                            </span>
                          </div>

                          {/* Hero Title & Subtitle */}
                          <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                              Automate work updates with AI StandUp™
                            </h2>
                            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                              Track daily progress and insights with real time task updates.
                            </p>
                          </div>

                          {/* Form Input 1: People or Teams* */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                              People or Teams<span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div style={{
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: '#ffffff'
                            }}>
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: '#1e293b',
                                color: '#ffffff',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {userInitials}
                              </div>
                              <ChevronDown size={14} color="#94a3b8" />
                            </div>
                          </div>

                          {/* Form Input 2: Time period */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                              Time period
                            </label>
                            <select
                              value={standupTimePeriod}
                              onChange={e => setStandupTimePeriod(e.target.value)}
                              style={{
                                width: '100%',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                fontSize: '0.82rem',
                                color: '#0f172a',
                                fontWeight: 600,
                                backgroundColor: '#ffffff',
                                outline: 'none'
                              }}
                            >
                              <option value="Last 24 hours">Last 24 hours</option>
                              <option value="Last 3 days">Last 3 days</option>
                              <option value="Last 7 days">Last 7 days</option>
                              <option value="This week">This week</option>
                            </select>
                          </div>

                          {/* Generate Button (Screenshot 2) */}
                          <button
                            onClick={() => {
                              setIsStandupGenerated(true);
                              showToast('AI StandUp™ report generated successfully');
                            }}
                            style={{
                              backgroundColor: '#0f172a',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '12px',
                              fontSize: '0.86rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              marginTop: '8px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            Generate
                          </button>
                        </div>
                      ) : (
                        /* MODE 2: OUTPUT (Screenshot 3 1:1) */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          
                          {/* Compact Form Selectors (Screenshot 3) */}
                          <div style={{
                            border: '1px solid #eaebf0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            backgroundColor: '#fafbfc'
                          }}>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                              People or Teams<span style={{ color: '#ef4444' }}>*</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                              <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                backgroundColor: '#1e293b',
                                color: '#fff',
                                fontSize: '0.58rem',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {userInitials}
                              </div>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginTop: '6px' }}>
                              Time period
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 600 }}>
                              {standupTimePeriod}
                            </div>
                          </div>

                          {/* Brain Branding */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={15} color="#7c3aed" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                              Brain
                            </span>
                          </div>

                          {/* Overview (Screenshot 3 1:1) */}
                          <div>
                            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                              Overview
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                              Over the last day, I organized next steps across four work items, including scheduling, preparation, and follow-up tasks. I also updated priorities.
                            </p>
                          </div>

                          {/* Key Highlights (Screenshot 3 1:1) */}
                          <div>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                              Key Highlights
                            </h4>

                            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.81rem', color: '#334155', lineHeight: 1.5 }}>
                              {/* Item 1 */}
                              <li>
                                <span>For the cloud migration work, I created subtasks for a technical scoping call and an initial architecture draft, and set the work to </span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>urgent</span>. (
                                <span
                                  onClick={() => {
                                    setSelectedSplitTaskDeal({
                                      id: 'deal-cloud',
                                      title: 'Enterprise Cloud Migration Deal',
                                      status: 'QUALIFIED',
                                      priority: 'Urgent',
                                      space: 'Sales CRM'
                                    });
                                    setIsSplitTaskViewOpen(true);
                                  }}
                                  onMouseEnter={() => {
                                    setActiveDealHoverPopover({
                                      title: 'Enterprise Cloud Migration Deal',
                                      space: 'Sales CRM',
                                      status: 'QUALIFIED',
                                      statusBg: '#fef08a',
                                      priority: 'Urgent',
                                      assignee: 'Not set',
                                      dueDate: 'Not set'
                                    });
                                  }}
                                  onMouseLeave={() => setActiveDealHoverPopover(null)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backgroundColor: '#fefce8',
                                    border: '1px solid #fef08a',
                                    borderRadius: '4px',
                                    padding: '1px 6px',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    color: '#854d0e',
                                    cursor: 'pointer',
                                    margin: '0 4px'
                                  }}
                                >
                                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#eab308', display: 'inline-block' }} />
                                  <span>Enterprise Cloud Migration Deal</span>
                                  <span style={{ backgroundColor: '#fef08a', padding: '0 4px', borderRadius: '3px', fontSize: '0.66rem' }}>QUALIFIED</span>
                                </span>
                                )
                              </li>

                              {/* Item 2 */}
                              <li>
                                <span>For the hardware refresh, I added kickoff slide deck and implementation demo subtasks; the work is marked </span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>low priority</span>. (
                                <span
                                  onClick={() => {
                                    setSelectedSplitTaskDeal({
                                      id: 'deal-hardware',
                                      title: 'Q4 Server Hardware Refresh',
                                      status: 'WON',
                                      priority: 'Low',
                                      space: 'Sales CRM'
                                    });
                                    setIsSplitTaskViewOpen(true);
                                  }}
                                  onMouseEnter={() => {
                                    setActiveDealHoverPopover({
                                      title: 'Q4 Server Hardware Refresh',
                                      space: 'Sales CRM',
                                      status: 'WON',
                                      statusBg: '#bbf7d0',
                                      priority: 'Low',
                                      assignee: 'Not set',
                                      dueDate: 'Not set'
                                    });
                                  }}
                                  onMouseLeave={() => setActiveDealHoverPopover(null)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backgroundColor: '#f0fdf4',
                                    border: '1px solid #bbf7d0',
                                    borderRadius: '4px',
                                    padding: '1px 6px',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    color: '#166534',
                                    cursor: 'pointer',
                                    margin: '0 4px'
                                  }}
                                >
                                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                                  <span>Q4 Server Hardware Refresh</span>
                                  <span style={{ backgroundColor: '#bbf7d0', padding: '0 4px', borderRadius: '3px', fontSize: '0.66rem' }}>WON</span>
                                </span>
                                )
                              </li>

                              {/* Item 3 */}
                              <li>
                                <span>For the licensing expansion, I added a follow-up email subtask and set the work to </span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>high priority</span>. (
                                <span
                                  onClick={() => {
                                    setSelectedSplitTaskDeal({
                                      id: 'deal-licensing',
                                      title: 'Software Licensing Expansion',
                                      status: 'PROPOSAL',
                                      priority: 'High',
                                      space: 'Sales CRM'
                                    });
                                    setIsSplitTaskViewOpen(true);
                                  }}
                                  onMouseEnter={() => {
                                    setActiveDealHoverPopover({
                                      title: 'Software Licensing Expansion',
                                      space: 'Sales CRM',
                                      status: 'PROPOSAL',
                                      statusBg: '#e9d5ff',
                                      priority: 'High',
                                      assignee: 'Not set',
                                      dueDate: 'Not set'
                                    });
                                  }}
                                  onMouseLeave={() => setActiveDealHoverPopover(null)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backgroundColor: '#faf5ff',
                                    border: '1px solid #e9d5ff',
                                    borderRadius: '4px',
                                    padding: '1px 6px',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    color: '#6b21a8',
                                    cursor: 'pointer',
                                    margin: '0 4px'
                                  }}
                                >
                                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#a855f7', display: 'inline-block' }} />
                                  <span>Software Licensing Expansion</span>
                                  <span style={{ backgroundColor: '#e9d5ff', padding: '0 4px', borderRadius: '3px', fontSize: '0.66rem' }}>PROPOSAL</span>
                                </span>
                                )
                              </li>

                              {/* Item 4 */}
                              <li>
                                <span>Set the inbound website inquiry to </span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>normal priority</span>. (
                                <span
                                  onClick={() => {
                                    setSelectedSplitTaskDeal({
                                      id: 'deal-inbound',
                                      title: 'Inbound Website Inquiry',
                                      status: 'NEW LEAD',
                                      priority: 'Normal',
                                      space: 'Sales CRM'
                                    });
                                    setIsSplitTaskViewOpen(true);
                                  }}
                                  onMouseEnter={() => {
                                    setActiveDealHoverPopover({
                                      title: 'Inbound Website Inquiry',
                                      space: 'Sales CRM',
                                      status: 'NEW LEAD',
                                      statusBg: '#e2e8f0',
                                      priority: 'Normal',
                                      assignee: 'Not set',
                                      dueDate: 'Not set'
                                    });
                                  }}
                                  onMouseLeave={() => setActiveDealHoverPopover(null)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '4px',
                                    padding: '1px 6px',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    color: '#334155',
                                    cursor: 'pointer',
                                    margin: '0 4px'
                                  }}
                                >
                                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#64748b', display: 'inline-block' }} />
                                  <span>Inbound Website Inquiry</span>
                                  <span style={{ backgroundColor: '#e2e8f0', padding: '0 4px', borderRadius: '3px', fontSize: '0.66rem' }}>NEW LEAD</span>
                                </span>
                                )
                              </li>
                            </ul>
                          </div>

                          {/* Action Feedback Buttons (Screenshot 3) */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '6px' }}>
                            <button
                              onClick={() => showToast('Start thread conversation')}
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                            >
                              <MessageSquare size={14} />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText("Over the last day, I organized next steps across four work items...");
                                showToast('AI StandUp report copied to clipboard');
                              }}
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => showToast('Regenerating AI StandUp...')}
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                            >
                              <RotateCw size={14} />
                            </button>
                            <button
                              onClick={() => showToast('Thank you for your feedback! 👍')}
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                            >
                              <ThumbsUp size={14} />
                            </button>
                            <button
                              onClick={() => showToast('Feedback recorded. Will refine next time.')}
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                            >
                              <ThumbsDown size={14} />
                            </button>
                          </div>

                          {/* Dynamic Chat Replies if user interacted with AI */}
                          {aiStandupChatReplies.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                              {aiStandupChatReplies.map((reply, i) => (
                                <div key={i} style={{
                                  backgroundColor: reply.role === 'user' ? '#f1f5f9' : '#f5f3ff',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.8rem',
                                  color: reply.role === 'user' ? '#0f172a' : '#5b21b6',
                                  lineHeight: 1.45
                                }}>
                                  <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', marginBottom: '2px' }}>
                                    {reply.role === 'user' ? currentUserName : (
                                      <>
                                        <Sparkles size={11} color="#7c3aed" />
                                        <span>ClickUp Brain</span>
                                      </>
                                    )}
                                  </span>
                                  {reply.text}
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      )}

                    </div>

                    {/* Footer Upgrade Notice & Prompt Composer (Screenshot 3 1:1) */}
                    {isStandupGenerated && (
                      <div style={{
                        padding: '12px 18px',
                        borderTop: '1px solid #eaebf0',
                        backgroundColor: '#ffffff'
                      }}>
                        {/* Standard Models Notice Banner */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '10px',
                          fontSize: '0.74rem',
                          color: '#64748b'
                        }}>
                          <div>
                            <div>You're using standard models</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>Get premium models</span>
                              <Sparkles size={11} color="#db2777" />
                            </div>
                          </div>
                          <button
                            onClick={onOpenUpgradeModal}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#0f172a',
                              cursor: 'pointer'
                            }}
                          >
                            See upgrades
                          </button>
                        </div>

                        {/* Bottom AI Prompt Composer (Screenshot 3) */}
                        <div style={{
                          border: '1px solid #cbd5e1',
                          borderRadius: '10px',
                          backgroundColor: '#ffffff',
                          overflow: 'hidden'
                        }}>
                          <input
                            type="text"
                            placeholder="Tell AI what to do next"
                            value={aiNextPrompt}
                            onChange={e => setAiNextPrompt(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && aiNextPrompt.trim()) {
                                const p = aiNextPrompt.trim();
                                setAiStandupChatReplies(prev => [
                                  ...prev,
                                  { role: 'user', text: p, time: 'Just now' },
                                  { role: 'assistant', text: `Processed with Brain™: "${p}". Updated task assignments and logged follow-up actions.`, time: 'Just now' }
                                ]);
                                setAiNextPrompt('');
                                showToast('AI Action completed');
                              }
                            }}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              border: 'none',
                              outline: 'none',
                              fontSize: '0.82rem',
                              color: '#0f172a'
                            }}
                          />

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderTop: '1px solid #f8fafc',
                            backgroundColor: '#fafbfc'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => showToast('Add attachment to AI context')}
                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                              >
                                <Plus size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => showToast('AI Skills: Write email, Analyze deal, Create subtask')}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: 'none',
                                  border: 'none',
                                  color: '#64748b',
                                  fontSize: '0.74rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                <Sparkles size={12} color="#7c3aed" />
                                <span>Skills</span>
                              </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                <Sparkles size={11} color="#db2777" />
                                <span>Max ▾</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => showToast('Voice AI activated')}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                              >
                                <Mic size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (aiNextPrompt.trim()) {
                                    const p = aiNextPrompt.trim();
                                    setAiStandupChatReplies(prev => [
                                      ...prev,
                                      { role: 'user', text: p, time: 'Just now' },
                                      { role: 'assistant', text: `Processed with Brain™: "${p}". Updated task assignments and logged follow-up actions.`, time: 'Just now' }
                                    ]);
                                    setAiNextPrompt('');
                                    showToast('AI Action completed');
                                  }
                                }}
                                style={{
                                  backgroundColor: aiNextPrompt.trim() ? '#0f172a' : '#e2e8f0',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  cursor: aiNextPrompt.trim() ? 'pointer' : 'not-allowed'
                                }}
                              >
                                <Send size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* HOVER POPOVER CARD (Screenshot 4 Center) */}
                    {activeDealHoverPopover && (
                      <div style={{
                        position: 'absolute',
                        top: '180px',
                        left: '10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #eaebf0',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.14)',
                        zIndex: 4000,
                        width: '280px',
                        pointerEvents: 'none'
                      }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                          {activeDealHoverPopover.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '10px' }}>
                          Task in {activeDealHoverPopover.space}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.76rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Status</span>
                            <span style={{
                              backgroundColor: activeDealHoverPopover.statusBg,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '0.7rem'
                            }}>
                              {activeDealHoverPopover.status}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Assignee</span>
                            <span style={{ color: '#0f172a' }}>{activeDealHoverPopover.assignee}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Due Date</span>
                            <span style={{ color: '#0f172a' }}>{activeDealHoverPopover.dueDate}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Priority</span>
                            <span style={{ color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Flag size={10} color="#dc2626" fill="#dc2626" />
                              {activeDealHoverPopover.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* Member Profile Drawer (Screenshots 4 & 5) */}
                {selectedDrawerMember && !isAiStandupPanelOpen && (
                  <div style={{
                    width: '390px',
                    borderLeft: '1px solid #eaebf0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    overflowY: 'auto',
                    boxShadow: '-4px 0 16px rgba(0,0,0,0.03)'
                  }}>
                    {/* Drawer Header & Profile Card (Screenshots 4 & 5) */}
                    <div style={{ padding: '20px 22px 16px 22px', borderBottom: '1px solid #eaebf0', position: 'relative' }}>
                      <button
                        onClick={() => setSelectedDrawerMember(null)}
                        title="Close profile drawer"
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          color: '#94a3b8'
                        }}
                      >
                        <X size={18} />
                      </button>

                      {/* Profile Box */}
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '14px' }}>
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '12px',
                          backgroundColor: '#1e293b',
                          color: '#ffffff',
                          fontSize: '1.4rem',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {selectedDrawerMember.initials}
                        </div>

                        <div style={{ flex: 1, paddingRight: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                              {selectedDrawerMember.name}
                            </h3>
                            <ChevronDown size={14} color="#64748b" style={{ cursor: 'pointer' }} />
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.76rem' }}>
                            <span style={{ color: '#94a3b8', cursor: 'pointer' }}>Add description...</span>
                            <span style={{ color: '#16a34a', fontWeight: 700 }}>● Online</span>
                          </div>

                          {/* Action Buttons: Chat & Get StandUp (Screenshots 4 & 5) */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', position: 'relative' }}>
                            <button
                              onClick={() => showToast(`Opened direct chat with ${selectedDrawerMember.name}`)}
                              title="Chat"
                              style={{
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                padding: '5px 8px',
                                backgroundColor: '#ffffff',
                                cursor: 'pointer',
                                color: '#64748b',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Mail size={13} />
                            </button>

                            <div style={{ position: 'relative' }}>
                              <button
                                onMouseEnter={() => setIsStandupTooltipHovered(true)}
                                onMouseLeave={() => setIsStandupTooltipHovered(false)}
                                onClick={() => {
                                  setActiveSubtab('standup');
                                  showToast(`Viewing AI StandUp summary for ${selectedDrawerMember.name}`);
                                }}
                                style={{
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '6px',
                                  padding: '5px 12px',
                                  backgroundColor: '#ffffff',
                                  cursor: 'pointer',
                                  color: '#0f172a',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <span style={{ color: '#ec4899' }}>🌸</span>
                                <span>Get StandUp</span>
                              </button>

                              {/* Tooltip matching Screenshot 5 */}
                              {isStandupTooltipHovered && (
                                <div style={{
                                  position: 'absolute',
                                  top: '32px',
                                  left: 0,
                                  backgroundColor: '#0f172a',
                                  color: '#ffffff',
                                  fontSize: '0.7rem',
                                  padding: '5px 9px',
                                  borderRadius: '6px',
                                  whiteSpace: 'nowrap',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                  zIndex: 7000,
                                  pointerEvents: 'none'
                                }}>
                                  Use AI to create a summary of recent activity.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Drawer Subtabs (Screenshot 4 & 5) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.76rem', fontWeight: 600, color: '#64748b', marginTop: '14px' }}>
                        {(['activity', 'tasks', 'comments', 'calendar'] as const).map(tab => (
                          <span
                            key={tab}
                            onClick={() => setMemberDrawerTab(tab)}
                            style={{
                              cursor: 'pointer',
                              color: memberDrawerTab === tab ? '#0f172a' : '#64748b',
                              fontWeight: memberDrawerTab === tab ? 800 : 500,
                              borderBottom: memberDrawerTab === tab ? '2px solid #7c3aed' : '2px solid transparent',
                              paddingBottom: '4px',
                              textTransform: 'capitalize'
                            }}
                          >
                            {tab === 'activity' ? 'Activity' : tab === 'tasks' ? `Tasks (${tasks.length})` : tab === 'comments' ? 'Comments (0)' : 'Calendar'}
                          </span>
                        ))}
                        <span style={{ cursor: 'pointer', color: '#94a3b8' }}>1 more...</span>
                      </div>
                    </div>

                    {/* Drawer Content */}
                    <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      
                      {/* Member Info List (Screenshot 4) */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem', color: '#475569' }}>
                        <div style={{ color: '#64748b', cursor: 'pointer', fontWeight: 600 }}>
                          + Add time off
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={13} color="#94a3b8" />
                          <span>{selectedDrawerMember.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={13} color="#94a3b8" />
                          <span>8:11 pm local time</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users size={13} color="#94a3b8" />
                          <span>Select manager ▾</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building size={13} color="#94a3b8" />
                          <span>{activeTeam.name}</span>
                        </div>
                      </div>

                      {/* Priorities Section in Drawer (Screenshot 4) */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>
                            <span>Priorities</span>
                            <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>ℹ</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem', color: '#64748b' }}>
                            <span style={{ cursor: 'pointer' }}>⤢ Expand</span>
                            <span style={{ cursor: 'pointer', color: '#7c3aed', fontWeight: 700 }}>+ Add</span>
                          </div>
                        </div>

                        {/* Priority Item in Drawer */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 8px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '6px',
                          fontSize: '0.78rem'
                        }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>1</span>
                          <span style={{ color: '#cbd5e1' }}>○</span>
                          <Phone size={12} color="#0284c7" />
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>Send follow-up email</span>
                        </div>
                      </div>

                      {/* Activity Timeline in Drawer (Screenshot 4 & 5) */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Activity</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Search size={13} color="#94a3b8" />
                            <Filter size={13} color="#94a3b8" />
                          </div>
                        </div>

                        {/* Today Activities */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
                            Today
                          </div>
                          
                          <div style={{
                            border: '1px solid #eaebf0',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            backgroundColor: '#ffffff',
                            marginBottom: '8px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                              <Phone size={12} color="#0284c7" />
                              <span>Send follow-up email</span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '8px' }}>
                              Space / Sales CRM
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f8fafc', paddingTop: '6px', fontSize: '0.7rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.55rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {userInitials}
                                </div>
                                <span style={{ color: '#475569' }}>You added the task to your priorities</span>
                              </div>
                              <span style={{ color: '#94a3b8' }}>1 min</span>
                            </div>
                          </div>
                        </div>

                        {/* Yesterday Activities */}
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
                            Yesterday
                          </div>
                          
                          <div style={{
                            border: '1px solid #eaebf0',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            backgroundColor: '#ffffff'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                              <span style={{ color: '#eab308' }}>🟡</span>
                              <span>Enterprise Cloud Migration Deal</span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                              Space / Sales CRM
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ================================================================ */}
            {/* SUBTAB 5: ORG / TEAM CHART (Screenshot 1)                         */}
            {/* ================================================================ */}
            {activeSubtab === 'team_chart' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
                {/* Top Control Bar (Screenshot 1) */}
                <div style={{
                  padding: '10px 24px',
                  borderBottom: '1px solid #eaebf0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  backgroundColor: '#ffffff',
                  zIndex: 10
                }}>
                  {/* Search box */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    width: '260px'
                  }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Jump to person..."
                      value={chartSearchQuery}
                      onChange={e => setChartSearchQuery(e.target.value)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.8rem',
                        color: '#0f172a',
                        width: '100%'
                      }}
                    />
                  </div>

                  {/* Mode switcher: People vs + Agents */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setChartMode('people')}
                      style={{
                        border: 'none',
                        backgroundColor: chartMode === 'people' ? '#f1f5f9' : '#ffffff',
                        color: '#0f172a',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Users size={14} />
                      <span>People</span>
                    </button>
                    <button
                      onClick={() => {
                        setChartMode('agents');
                        showToast('Showing AI & Automation Agents in Org Chart');
                      }}
                      style={{
                        border: 'none',
                        borderLeft: '1px solid #cbd5e1',
                        backgroundColor: chartMode === 'agents' ? '#f1f5f9' : '#ffffff',
                        color: '#7c3aed',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ fontSize: '1rem', lineHeight: '1' }}>∞</span>
                      <span>+ Agents</span>
                    </button>
                  </div>

                  {/* Settings Gear */}
                  <button
                    onClick={() => showToast('Team Chart settings: Auto-layout enabled')}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Settings size={15} />
                  </button>
                </div>

                {/* Dotted Canvas Area (Screenshot 1) */}
                <div style={{
                  flex: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                  backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
                  backgroundSize: '20px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Zoomable Container */}
                  <div style={{
                    transform: `scale(${chartZoom / 100})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease',
                    position: 'relative',
                    width: '600px',
                    height: '400px'
                  }}>
                    {/* Leader Node (Screenshot 1) */}
                    <div style={{
                      position: 'absolute',
                      top: '120px',
                      left: '160px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '10px 18px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minWidth: '180px',
                      zIndex: 2
                    }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.78rem',
                          fontWeight: 800
                        }}>
                          {userInitials}
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '-1px',
                          right: '-1px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#16a34a',
                          border: '1.5px solid #ffffff'
                        }} />
                      </div>

                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                        {currentUserName}
                      </div>

                      {/* Collapse/Expand - button at bottom center of leader card */}
                      <div
                        onClick={() => setIsChartExpanded(!isChartExpanded)}
                        title={isChartExpanded ? "Collapse node" : "Expand node"}
                        style={{
                          position: 'absolute',
                          bottom: '-10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          zIndex: 3
                        }}
                      >
                        <Minus size={11} color="#64748b" />
                      </div>
                    </div>

                    {/* Connector Line (Curved arrow downwards & right to Meeting Agent) */}
                    {isChartExpanded && (
                      <svg style={{ position: 'absolute', top: '165px', left: '250px', width: '120px', height: '100px', pointerEvents: 'none', zIndex: 1 }}>
                        <path
                          d="M 0,0 L 0,46 Q 0,58 14,58 L 74,58"
                          fill="none"
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                        />
                        <polygon points="74,54 80,58 74,62" fill="#cbd5e1" />
                      </svg>
                    )}

                    {/* Child Node: Meeting Agent (Screenshot 1) */}
                    {isChartExpanded && (
                      <div style={{
                        position: 'absolute',
                        top: '196px',
                        left: '330px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '10px 18px',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        minWidth: '180px',
                        zIndex: 2
                      }}>
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#fbbf24',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem'
                          }}>
                            😎
                          </div>
                          <div style={{
                            position: 'absolute',
                            bottom: '-1px',
                            right: '-1px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#16a34a',
                            border: '1.5px solid #ffffff'
                          }} />
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                            Meeting Agent
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            Today
                          </div>
                        </div>

                        {/* Info icon button */}
                        <div
                          onClick={() => setIsAgentDetailOpen(true)}
                          title="Agent details & settings"
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          i
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Bar: Zoom controls & Expand all (Screenshot 1) */}
                <div style={{
                  padding: '10px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #eaebf0',
                  backgroundColor: '#ffffff',
                  zIndex: 10
                }}>
                  {/* Zoom controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => setChartZoom(80)}
                      title="Reset view"
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ChevronDown size={16} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    <button
                      onClick={() => setChartZoom(Math.max(40, chartZoom - 10))}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontSize: '1rem',
                        fontWeight: 700,
                        padding: '0 4px'
                      }}
                    >
                      —
                    </button>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', minWidth: '42px', textAlign: 'center' }}>
                      {chartZoom}%
                    </span>
                    <button
                      onClick={() => setChartZoom(Math.min(150, chartZoom + 10))}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontSize: '1rem',
                        fontWeight: 700,
                        padding: '0 4px'
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Expand All toggle */}
                  <button
                    onClick={() => setIsChartExpanded(!isChartExpanded)}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Maximize2 size={13} color="#64748b" />
                    <span>Expand all (2)</span>
                  </button>
                </div>

                {/* Agent Detail Modal */}
                {isAgentDetailOpen && (
                  <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.45)',
                    backdropFilter: 'blur(3px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5000
                  }}>
                    <div style={{
                      width: '420px',
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      padding: '24px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.5rem' }}>😎</span>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Meeting Agent</div>
                            <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600 }}>● Active &amp; Online</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsAgentDetailOpen(false)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.45', margin: '0 0 16px 0' }}>
                        Meeting Agent listens to team calls, automatically transcribes discussions, extracts actionable items, and generates daily standup summaries for {activeTeam.name}.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Assigned Supervisor:</span>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentUserName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Standup Cadence:</span>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>Daily at 9:00 AM</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Deals Analyzed:</span>
                          <span style={{ fontWeight: 700, color: '#7c3aed' }}>4 CRM Items</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setIsAgentDetailOpen(false);
                            setActiveSubtab('standup');
                          }}
                          style={{
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          View AI StandUp →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================================================================ */}
            {/* SUBTAB 6: AI STANDUP (Screenshots 2 & 3)                           */}
            {/* ================================================================ */}
            {activeSubtab === 'standup' && (
              <div 
                onClick={() => {
                  if (standupContextMenu) setStandupContextMenu(null);
                }}
                style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', backgroundColor: '#ffffff', position: 'relative' }}
              >
                <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                  {/* AI StandUp Header (Screenshot 2) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#ec4899', fontSize: '1.1rem' }}>🌸</span>
                      <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                        AI StandUp (Last 7 days)
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: '#94a3b8' }}>
                      <span>Just now</span>
                      <button
                        onClick={() => {
                          setIsStandupRefreshing(true);
                          setTimeout(() => {
                            setIsStandupRefreshing(false);
                            showToast('AI StandUp refreshed with latest workspace activity!');
                          }, 750);
                        }}
                        title="Refresh AI StandUp"
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                      >
                        <RotateCw size={15} style={{ animation: isStandupRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`AI StandUp (Last 7 days)\nOverview: Over the last 7 days, I organized next steps across cloud migration, server hardware, and software licensing work.`);
                          showToast('StandUp copied to clipboard!');
                        }}
                        title="Copy summary"
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={() => showToast('AI Standup settings: Analyzing workspace pulse')}
                        title="StandUp settings"
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                      >
                        <Settings size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Brain Tag (Screenshot 2) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '1rem', color: '#8b5cf6' }}>🌸</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Brain</span>
                  </div>

                  {/* Section 1: Overview (Screenshot 2) */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      Overview
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: '1.6' }}>
                      Over the last 7 days, I organized next steps across cloud migration, server hardware, and software licensing work. A cloud migration deal was marked urgent; no completion or status details were provided.
                    </p>
                  </div>

                  {/* Section 2: Key Highlights (Screenshot 2 & 3) */}
                  <div style={{ marginBottom: '32px' }}>
                    <h4 style={{ margin: '0 0 14px 0', fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      Key Highlights
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem', color: '#334155', lineHeight: '1.6' }}>
                      
                      {/* Highlight 1: Enterprise Cloud Migration Deal */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: '#0f172a', fontWeight: 800 }}>•</span>
                        <div>
                          <span>Set up next steps for an </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setStandupContextMenu({
                                x: rect.left,
                                y: rect.bottom + 4,
                                deal: { id: 'deal-cloud-01', name: 'Enterprise Cloud Migration Deal', status: 'QUALIFIED', color: '#eab308', badge: 'QUALIFIED' }
                              });
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              color: '#0f172a',
                              margin: '0 4px',
                              verticalAlign: 'middle',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          >
                            <span style={{ color: '#eab308' }}>🟡</span>
                            <span>Enterprise Cloud Migration Deal</span>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              backgroundColor: '#fef08a',
                              color: '#854d0e',
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}>
                              QUALIFIED
                            </span>
                          </span>
                          <span>, including a technical scoping call and an initial architecture draft.</span>
                        </div>
                      </div>

                      {/* Highlight 2: Q4 Server Hardware Refresh */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: '#0f172a', fontWeight: 800 }}>•</span>
                        <div>
                          <span>Created kickoff and implementation-demo follow-ups for a </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setStandupContextMenu({
                                x: rect.left,
                                y: rect.bottom + 4,
                                deal: { id: 'deal-server-02', name: 'Q4 Server Hardware Refresh', status: 'WON', color: '#22c55e', badge: 'WON' }
                              });
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              color: '#0f172a',
                              margin: '0 4px',
                              verticalAlign: 'middle',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          >
                            <span style={{ color: '#22c55e' }}>🟢</span>
                            <span>Q4 Server Hardware Refresh</span>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              backgroundColor: '#22c55e',
                              color: '#ffffff',
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}>
                              WON
                            </span>
                          </span>
                          <span>; the work was marked low priority.</span>
                        </div>
                      </div>

                      {/* Highlight 3: Software Licensing Expansion */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: '#0f172a', fontWeight: 800 }}>•</span>
                        <div>
                          <span>Added a follow-up email for a </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setStandupContextMenu({
                                x: rect.left,
                                y: rect.bottom + 4,
                                deal: { id: 'deal-license-03', name: 'Software Licensing Expansion', status: 'PROPOSAL', color: '#a855f7', badge: 'PROPOSAL' }
                              });
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              color: '#0f172a',
                              margin: '0 4px',
                              verticalAlign: 'middle',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          >
                            <span style={{ color: '#a855f7' }}>🟣</span>
                            <span>Software Licensing Expansion</span>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              backgroundColor: '#a855f7',
                              color: '#ffffff',
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}>
                              PROPOSAL
                            </span>
                          </span>
                          <span>, marked high priority.</span>
                        </div>
                      </div>

                      {/* Highlight 4: Inbound Website Inquiry */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: '#0f172a', fontWeight: 800 }}>•</span>
                        <div>
                          <span>An </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setStandupContextMenu({
                                x: rect.left,
                                y: rect.bottom + 4,
                                deal: { id: 'deal-inquiry-04', name: 'Inbound Website Inquiry', status: 'NEW LEAD', color: '#64748b', badge: 'NEW LEAD' }
                              });
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              color: '#0f172a',
                              margin: '0 4px',
                              verticalAlign: 'middle',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          >
                            <span style={{ color: '#64748b' }}>🔘</span>
                            <span>Inbound Website Inquiry</span>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              backgroundColor: '#64748b',
                              color: '#ffffff',
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}>
                              NEW LEAD
                            </span>
                          </span>
                          <span> was marked normal priority.</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Feedback thumbs at bottom right (Screenshot 2) */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', paddingTop: '40px', color: '#94a3b8' }}>
                    <button
                      onClick={() => {
                        setStandupFeedback('up');
                        showToast('Thank you for your feedback! 👍');
                      }}
                      title="Good summary"
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: standupFeedback === 'up' ? '#16a34a' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.15s ease'
                      }}
                    >
                      <ThumbsUp size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setStandupFeedback('down');
                        showToast('Feedback noted. We will adjust the summary.');
                      }}
                      title="Needs improvement"
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: standupFeedback === 'down' ? '#ef4444' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.15s ease'
                      }}
                    >
                      <ThumbsDown size={16} />
                    </button>
                  </div>
                </div>

                {/* Context Menu Popover (Screenshot 3) */}
                {standupContextMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'fixed',
                      top: standupContextMenu.y,
                      left: standupContextMenu.x,
                      backgroundColor: '#ffffff',
                      border: '1px solid #eaebf0',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                      padding: '6px',
                      zIndex: 6000,
                      minWidth: '170px'
                    }}
                  >
                    <div
                      onClick={() => {
                        navigator.clipboard.writeText(`https://app.clickup.com/deals/${standupContextMenu.deal.id}`);
                        showToast('Link copied to clipboard!');
                        setStandupContextMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Copy size={13} color="#64748b" />
                      <span>Copy link</span>
                    </div>

                    <div
                      onClick={() => {
                        showToast(`Opened "${standupContextMenu.deal.name}" in new tab`);
                        setStandupContextMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <ExternalLink size={13} color="#64748b" />
                      <span>Open in new tab</span>
                    </div>

                    <div
                      onClick={() => {
                        navigator.clipboard.writeText(standupContextMenu.deal.id);
                        showToast(`ID copied: ${standupContextMenu.deal.id}`);
                        setStandupContextMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Bookmark size={13} color="#64748b" />
                      <span>Copy ID</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================================================================ */}
            {/* SUBTAB 7: WORKLOAD (Screenshot 4)                                  */}
            {/* ================================================================ */}
            {activeSubtab === 'workload' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                {/* Workload Control Toolbar (Screenshot 4) */}
                <div style={{
                  padding: '8px 20px',
                  borderBottom: '1px solid #eaebf0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#475569',
                  flexShrink: 0
                }}>
                  {/* Left Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setWorkloadOffset(0);
                        showToast('Jumped to Today (Oct 25)');
                      }}
                      style={{
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#0f172a'
                      }}
                    >
                      Today
                    </button>

                    <select
                      value={workloadTimeEstimate}
                      onChange={e => setWorkloadTimeEstimate(e.target.value)}
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.78rem',
                        color: '#0f172a',
                        fontWeight: 600,
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="Time Estimates">Time Estimates ▾</option>
                      <option value="Sprint Points">Sprint Points ▾</option>
                      <option value="Task Count">Task Count ▾</option>
                    </select>

                    <select
                      value={workloadTimeRange}
                      onChange={e => setWorkloadTimeRange(e.target.value)}
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.78rem',
                        color: '#0f172a',
                        fontWeight: 600,
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="7 days">7 days ▾</option>
                      <option value="14 days">14 days ▾</option>
                      <option value="1 month">1 month ▾</option>
                    </select>

                    <select
                      value={workloadDailySchedule}
                      onChange={e => setWorkloadDailySchedule(e.target.value)}
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.78rem',
                        color: '#0f172a',
                        fontWeight: 600,
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="Daily Scheduled">Daily Scheduled ▾</option>
                      <option value="Weekly Scheduled">Weekly Scheduled ▾</option>
                    </select>

                    <button
                      onClick={() => showToast('Modify work by day modal')}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 600,
                        fontSize: '0.78rem'
                      }}
                    >
                      <span>☵</span>
                      <span>Modify work by day</span>
                    </button>
                  </div>

                  {/* Right Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ cursor: 'pointer', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Group: Team / Assignee</span>
                      <ChevronDown size={13} />
                    </span>

                    <span style={{ cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Filter size={13} />
                      <span>Filter</span>
                    </span>

                    {/* Closed pill */}
                    <div
                      onClick={() => setIsClosedIncluded(!isClosedIncluded)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: isClosedIncluded ? '#f3e8ff' : '#f1f5f9',
                        color: isClosedIncluded ? '#7c3aed' : '#64748b',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.72rem'
                      }}
                    >
                      <Check size={11} />
                      <span>Closed</span>
                    </div>

                    <Search size={14} color="#64748b" style={{ cursor: 'pointer' }} />

                    <button
                      onClick={() => showToast('Customize Workload columns and capacity')}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 600
                      }}
                    >
                      <Settings size={13} />
                      <span>Customize</span>
                    </button>

                    {/* Backlog button */}
                    <button
                      onClick={() => setIsBacklogOpen(!isBacklogOpen)}
                      style={{
                        backgroundColor: isBacklogOpen ? '#0f172a' : '#ffffff',
                        color: isBacklogOpen ? '#ffffff' : '#0f172a',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Backlog
                    </button>
                  </div>
                </div>

                {/* Main Workload Matrix & Backlog Container */}
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                  
                  {/* Calendar Matrix View */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'auto', backgroundColor: '#ffffff' }}>
                    
                    {/* Month & Week Header (Screenshot 4) */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #eaebf0', backgroundColor: '#fafbfc', minWidth: '850px' }}>
                      {/* Left info column: Date switcher */}
                      <div style={{
                        width: '260px',
                        padding: '10px 16px',
                        borderRight: '1px solid #eaebf0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        flexShrink: 0
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ cursor: 'pointer' }} onClick={() => setWorkloadOffset(workloadOffset - 7)}>‹</span>
                          <span style={{ cursor: 'pointer' }} onClick={() => setWorkloadOffset(workloadOffset + 7)}>›</span>
                          <span>Oct 25 - Oct 31</span>
                          <ChevronDown size={13} color="#94a3b8" />
                        </div>
                      </div>

                      {/* Day Columns Header */}
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)' }}>
                        {[
                          { day: 'S', date: '25', isToday: true, count: 0 },
                          { day: 'M', date: '26', isToday: false, count: 2 },
                          { day: 'T', date: '27', isToday: false, count: 1 },
                          { day: 'W', date: '28', isToday: false, count: 1 },
                          { day: 'T', date: '29', isToday: false, count: 0 },
                          { day: 'F', date: '30', isToday: false, count: 0 },
                          { day: 'S', date: '31', isToday: false, count: 0 },
                          { day: 'S', date: '1', isToday: false, count: 0, isNextMonth: true },
                          { day: 'M', date: '2', isToday: false, count: 0, isNextMonth: true }
                        ].map((d, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '8px 4px',
                              textAlign: 'center',
                              borderRight: '1px solid #eaebf0',
                              position: 'relative'
                            }}
                          >
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>{d.day}</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', marginTop: '2px' }}>
                              <span style={{
                                fontSize: '0.82rem',
                                fontWeight: 800,
                                color: d.isToday ? '#ffffff' : d.isNextMonth ? '#94a3b8' : '#0f172a',
                                backgroundColor: d.isToday ? '#ef4444' : 'transparent',
                                width: d.isToday ? '20px' : 'auto',
                                height: d.isToday ? '20px' : 'auto',
                                borderRadius: '50%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {d.date}
                              </span>
                              {d.count > 0 && (
                                <span style={{
                                  fontSize: '0.62rem',
                                  fontWeight: 800,
                                  backgroundColor: '#fef08a',
                                  color: '#854d0e',
                                  borderRadius: '50%',
                                  width: '14px',
                                  height: '14px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {d.count}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Row 1: Team Capacity Row (Screenshot 4) */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #eaebf0', minWidth: '850px' }}>
                      <div style={{
                        width: '260px',
                        padding: '12px 16px',
                        borderRight: '1px solid #eaebf0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#ffffff',
                        flexShrink: 0
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: activeTeam.color,
                            color: '#fff',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {activeTeam.initial}
                          </div>
                          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{activeTeam.name}</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>0h/40h</span>
                      </div>

                      {/* Team Capacity Blocks */}
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)' }}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(colIdx => {
                          const isWeekend = colIdx === 0 || colIdx === 6 || colIdx === 7;
                          return (
                            <div
                              key={colIdx}
                              style={{
                                borderRight: '1px solid #eaebf0',
                                padding: '8px 6px',
                                backgroundColor: isWeekend ? '#fafbfc' : '#ffffff'
                              }}
                            >
                              {!isWeekend && (
                                <div style={{
                                  backgroundColor: '#bbf7d0',
                                  borderRadius: '4px',
                                  padding: '4px 0',
                                  textAlign: 'center',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: '#166534',
                                  marginBottom: '4px'
                                }}>
                                  0h
                                </div>
                              )}
                              {!isWeekend && (
                                <div style={{
                                  backgroundColor: '#dcfce7',
                                  borderRadius: '3px',
                                  padding: '2px 0',
                                  textAlign: 'center',
                                  fontSize: '0.65rem',
                                  color: '#15803d'
                                }}>
                                  8h
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Row 2: Member Capacity & Scheduled Tasks Row (Screenshot 4) */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #eaebf0', minWidth: '850px', minHeight: '140px' }}>
                      <div style={{
                        width: '260px',
                        padding: '14px 16px',
                        borderRight: '1px solid #eaebf0',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        backgroundColor: '#ffffff',
                        flexShrink: 0
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#0f172a',
                            color: '#fff',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {userInitials}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{currentUserName}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>0h/40h</div>
                          </div>
                        </div>
                      </div>

                      {/* Member Scheduled Columns */}
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)' }}>
                        {/* Sun 25 (Today) */}
                        <div style={{ borderRight: '1px solid #eaebf0', backgroundColor: '#fafbfc', padding: '6px' }} />

                        {/* Mon 26 (2 tasks scheduled - Screenshot 4) */}
                        <div style={{ borderRight: '1px solid #eaebf0', padding: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div
                            onClick={() => {
                              const found = tasks.find(t => t.title.toLowerCase().includes('cloud') || t.title.toLowerCase().includes('migration'));
                              if (found && onOpenTask) onOpenTask(found);
                              else showToast('Enterprise Cloud Migration Deal: Scheduled on Oct 26');
                            }}
                            title="Enterprise Cloud Migration Deal"
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                            }}
                          >
                            <span style={{ color: '#eab308' }}>🟡</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>...</span>
                            <span style={{ color: '#94a3b8' }}>-</span>
                          </div>

                          <div
                            onClick={() => {
                              const found = tasks.find(t => t.title.toLowerCase().includes('licens'));
                              if (found && onOpenTask) onOpenTask(found);
                              else showToast('Software Licensing Expansion: Scheduled on Oct 26');
                            }}
                            title="Software Licensing Expansion"
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                            }}
                          >
                            <span style={{ color: '#a855f7' }}>🟣</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>L...</span>
                            <span style={{ color: '#94a3b8' }}>-</span>
                          </div>
                        </div>

                        {/* Tue 27 (1 task scheduled) */}
                        <div style={{ borderRight: '1px solid #eaebf0', padding: '6px' }}>
                          <div
                            onClick={() => showToast('Technical Scoping Call: Scheduled on Oct 27')}
                            title="Technical Scoping Call"
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                            }}
                          >
                            <span style={{ color: '#eab308' }}>🟡</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>...</span>
                            <span style={{ color: '#94a3b8' }}>-</span>
                          </div>
                        </div>

                        {/* Wed 28 (1 task scheduled) */}
                        <div style={{ borderRight: '1px solid #eaebf0', padding: '6px' }}>
                          <div
                            onClick={() => showToast('Initial Architecture Draft: Scheduled on Oct 28')}
                            title="Initial Architecture Draft"
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                            }}
                          >
                            <span style={{ color: '#a855f7' }}>🟣</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>...</span>
                            <span style={{ color: '#94a3b8' }}>-</span>
                          </div>
                        </div>

                        {/* Thu 29 through Mon 2 */}
                        {[4, 5, 6, 7, 8].map(colIdx => {
                          const isWeekend = colIdx === 6 || colIdx === 7;
                          return (
                            <div
                              key={colIdx}
                              style={{
                                borderRight: '1px solid #eaebf0',
                                backgroundColor: isWeekend ? '#fafbfc' : '#ffffff',
                                padding: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {!isWeekend && (
                                <button
                                  onClick={() => {
                                    setIsBacklogOpen(true);
                                    showToast('Choose a task from the Backlog to schedule');
                                  }}
                                  title="Schedule task on this day"
                                  style={{
                                    border: '1px dashed #cbd5e1',
                                    borderRadius: '6px',
                                    width: '28px',
                                    height: '28px',
                                    backgroundColor: 'transparent',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  +
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Backlog Drawer (Screenshot 4) */}
                  {isBacklogOpen && (
                    <div style={{
                      width: '320px',
                      borderLeft: '1px solid #eaebf0',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      flexShrink: 0
                    }}>
                      {/* Backlog Header */}
                      <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #eaebf0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>Tasks</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Search size={14} color="#94a3b8" />
                          <button
                            onClick={() => setIsBacklogOpen(false)}
                            title="Close backlog"
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}
                          >
                            <ChevronsRight size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Backlog Tabs (Screenshot 4) */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 16px',
                        borderBottom: '1px solid #eaebf0',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: '#64748b',
                        overflowX: 'auto'
                      }}>
                        {(['Unscheduled', 'No estimate', 'Overdue', 'Unassigned'] as const).map(tab => (
                          <span
                            key={tab}
                            onClick={() => setBacklogTab(tab)}
                            style={{
                              cursor: 'pointer',
                              color: backlogTab === tab ? '#0f172a' : '#64748b',
                              fontWeight: backlogTab === tab ? 800 : 500,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {tab}
                          </span>
                        ))}
                      </div>

                      {/* Sort bar */}
                      <div style={{
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.72rem',
                        color: '#94a3b8',
                        borderBottom: '1px solid #f1f5f9'
                      }}>
                        <span style={{ cursor: 'pointer' }}>Sort by Status ▾</span>
                        <span>{tasks.length} tasks</span>
                      </div>

                      {/* Tasks List */}
                      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {tasks.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '0.8rem' }}>
                            0 tasks in backlog
                          </div>
                        ) : (
                          tasks.map(t => (
                            <div
                              key={t.id}
                              onClick={() => {
                                if (onOpenTask) onOpenTask(t);
                              }}
                              style={{
                                border: '1px solid #eaebf0',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                cursor: 'pointer',
                                backgroundColor: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = '#cbd5e1';
                                e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.05)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#eaebf0';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                              }}
                            >
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                                {t.title}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                                <span style={{
                                  backgroundColor: t.status === 'COMPLETE' ? '#dcfce7' : '#f1f5f9',
                                  color: t.status === 'COMPLETE' ? '#15803d' : '#475569',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontWeight: 600
                                }}>
                                  {t.status || 'TODO'}
                                </span>
                                <span style={{ color: '#7c3aed', fontWeight: 600 }}>+ Schedule</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* SUBTAB 8: TIMESHEET (Screenshot 5)                                */}
            {/* ================================================================ */}
            {activeSubtab === 'timesheet' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                {/* Top Control Toolbar (Screenshot 5) */}
                <div style={{
                  padding: '12px 28px',
                  borderBottom: '1px solid #eaebf0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  flexShrink: 0
                }}>
                  {/* Left Filters */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    {/* Date Navigator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 700 }}>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setTimesheetWeekOffset(timesheetWeekOffset - 1);
                          showToast('Previous week loaded');
                        }}
                      >‹</span>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setTimesheetWeekOffset(timesheetWeekOffset + 1);
                          showToast('Next week loaded');
                        }}
                      >›</span>
                      <span>Oct 25 - Oct 31</span>
                      <ChevronDown size={14} color="#94a3b8" />
                    </div>

                    {/* Filter chips (Screenshot 5) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <DollarSign size={13} color="#64748b" />
                        <span>Billable status</span>
                      </span>

                      <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Tag size={13} color="#64748b" />
                        <span>Tag</span>
                      </span>

                      <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} color="#64748b" />
                        <span>Tracked time</span>
                      </span>

                      <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Bookmark size={13} color="#64748b" />
                        <span>Archived tasks</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Switch: Hide weekends (Screenshot 5) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      onClick={() => {
                        setHideWeekends(!hideWeekends);
                        showToast(hideWeekends ? 'Showing weekends' : 'Weekends hidden');
                      }}
                      style={{
                        width: '32px',
                        height: '18px',
                        borderRadius: '9px',
                        backgroundColor: hideWeekends ? '#0f172a' : '#cbd5e1',
                        padding: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: hideWeekends ? 'flex-end' : 'flex-start',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Hide weekends</span>
                  </div>
                </div>

                {/* Timesheet Table (Screenshot 5) */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px', backgroundColor: '#ffffff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eaebf0', color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>
                        <th style={{ padding: '14px 12px', width: '220px' }}>People (1)</th>
                        {!hideWeekends && <th style={{ padding: '14px 12px', textAlign: 'center' }}>Sun, Oct 25</th>}
                        <th style={{ padding: '14px 12px', textAlign: 'center' }}>Mon, Oct 26</th>
                        <th style={{ padding: '14px 12px', textAlign: 'center' }}>Tue, Oct 27</th>
                        <th style={{ padding: '14px 12px', textAlign: 'center' }}>Wed, Oct 28</th>
                        <th style={{ padding: '14px 12px', textAlign: 'center' }}>Thu, Oct 29</th>
                        <th style={{ padding: '14px 12px', textAlign: 'center' }}>Fri, Oct 30</th>
                        {!hideWeekends && <th style={{ padding: '14px 12px', textAlign: 'center' }}>Sat, Oct 31</th>}
                        <th style={{ padding: '14px 12px', textAlign: 'center', width: '80px' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        {/* Member cell with Open -> button (Screenshot 5) */}
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#0f172a',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.74rem',
                                fontWeight: 800
                              }}>
                                {userInitials}
                              </div>
                              <div>
                                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{currentUserName}</div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>40h</div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setIsLogTimeModalOpen(true);
                              }}
                              style={{
                                border: 'none',
                                backgroundColor: '#f1f5f9',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                color: '#475569',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>Open</span>
                              <span>→</span>
                            </button>
                          </div>
                        </td>

                        {/* Day cells */}
                        {!hideWeekends && (
                          <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                            <span
                              onClick={() => {
                                setSelectedLogDay('Sun, Oct 25');
                                setIsLogTimeModalOpen(true);
                              }}
                              style={{ fontSize: '0.82rem', color: '#64748b', cursor: 'pointer' }}
                            >
                              {timesheetLoggedHours['Sun, Oct 25'] || 0}h
                            </span>
                          </td>
                        )}

                        {['Mon, Oct 26', 'Tue, Oct 27', 'Wed, Oct 28', 'Thu, Oct 29', 'Fri, Oct 30'].map(day => (
                          <td key={day} style={{ padding: '14px 12px', textAlign: 'center' }}>
                            <span
                              onClick={() => {
                                setSelectedLogDay(day);
                                setIsLogTimeModalOpen(true);
                              }}
                              style={{
                                fontSize: '0.82rem',
                                color: timesheetLoggedHours[day] ? '#0f172a' : '#64748b',
                                fontWeight: timesheetLoggedHours[day] ? 700 : 500,
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                backgroundColor: timesheetLoggedHours[day] ? '#ede9fe' : 'transparent'
                              }}
                            >
                              {timesheetLoggedHours[day] || 0}h
                            </span>
                          </td>
                        ))}

                        {!hideWeekends && (
                          <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                            <span
                              onClick={() => {
                                setSelectedLogDay('Sat, Oct 31');
                                setIsLogTimeModalOpen(true);
                              }}
                              style={{ fontSize: '0.82rem', color: '#64748b', cursor: 'pointer' }}
                            >
                              {timesheetLoggedHours['Sat, Oct 31'] || 0}h
                            </span>
                          </td>
                        )}

                        {/* Total cell */}
                        <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>
                          {Object.values(timesheetLoggedHours).reduce((a, b) => a + b, 0)}h
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Log Time Modal */}
                {isLogTimeModalOpen && (
                  <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.45)',
                    backdropFilter: 'blur(3px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5000
                  }}>
                    <div style={{
                      width: '420px',
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      padding: '24px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                            Log Tracked Time
                          </h4>
                          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                            {selectedLogDay} • {currentUserName}
                          </div>
                        </div>
                        <button
                          onClick={() => setIsLogTimeModalOpen(false)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                          Time Spent (Hours)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="24"
                          value={logTimeAmount}
                          onChange={e => setLogTimeAmount(e.target.value)}
                          style={{
                            width: '100%',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            fontSize: '0.86rem',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                          Description / Note
                        </label>
                        <input
                          type="text"
                          value={logTimeNote}
                          onChange={e => setLogTimeNote(e.target.value)}
                          placeholder="What did you work on?"
                          style={{
                            width: '100%',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            fontSize: '0.82rem',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => setIsLogTimeModalOpen(false)}
                          style={{
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            borderRadius: '6px',
                            padding: '7px 14px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: '#64748b'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            const parsed = parseFloat(logTimeAmount) || 0;
                            setTimesheetLoggedHours(prev => ({
                              ...prev,
                              [selectedLogDay]: parsed
                            }));
                            setIsLogTimeModalOpen(false);
                            showToast(`Logged ${parsed}h on ${selectedLogDay}!`);
                          }}
                          style={{
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '7px 16px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Save Time Log
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </>
        )}
      </div>

      {/* ==================================================================== */}
      {/* MODAL 1: CREATE TEAM                                                 */}
      {/* ==================================================================== */}
      {isCreateTeamOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4000
        }}>
          <div style={{
            width: '480px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px 28px 20px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Create Team</h3>
                <button
                  onClick={() => setIsCreateTeamOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={18} />
                </button>
              </div>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.82rem', color: '#64748b' }}>
                Use Teams to easily create groups of people you can assign to tasks, mention in comments, or add as watchers.
              </p>

              <form onSubmit={handleCreateTeamSubmit}>
                {/* Icon & name section */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Icon &amp; name
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: newTeamColor,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      flexShrink: 0
                    }}>
                      {newTeamName.trim().charAt(0).toUpperCase() || 'T'}
                    </div>
                    <input
                      type="text"
                      placeholder="Team name (e.g. Falcon, Sales, Design)..."
                      value={newTeamName}
                      onChange={e => setNewTeamName(e.target.value)}
                      autoFocus
                      required
                      style={{
                        flex: 1,
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.88rem',
                        outline: 'none',
                        color: '#0f172a'
                      }}
                    />
                  </div>

                  {/* Color palette pills */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px', marginLeft: '46px' }}>
                    {COLOR_PALETTE.map(c => (
                      <div
                        key={c}
                        onClick={() => setNewTeamColor(c)}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: c,
                          cursor: 'pointer',
                          outline: newTeamColor === c ? '2px solid #0f172a' : 'none',
                          outlineOffset: '2px'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Description (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe what this team focuses on..."
                    value={newTeamDescription}
                    onChange={e => setNewTeamDescription(e.target.value)}
                    style={{
                      width: '100%',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.84rem',
                      outline: 'none',
                      color: '#0f172a',
                      boxSizing: 'border-box',
                      resize: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCreateTeamOpen(false)}
                    style={{
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 20px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: ADD MEMBER TO TEAM                                          */}
      {/* ==================================================================== */}
      {isAddMemberOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4000
        }}>
          <div style={{
            width: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Add members to {activeTeam?.name || 'team'}
                </h3>
                <button
                  onClick={() => setIsAddMemberOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={18} />
                </button>
              </div>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: '#64748b' }}>
                Select members from your workspace to include in this team group.
              </p>

              {/* Members selector */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '260px',
                overflowY: 'auto',
                marginBottom: '24px'
              }}>
                {availableMembers.map(m => {
                  const isSelected = selectedMemberIds.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        if (isSelected) {
                          if (selectedMemberIds.length > 1) {
                            setSelectedMemberIds(selectedMemberIds.filter(id => id !== m.id));
                          }
                        } else {
                          setSelectedMemberIds([...selectedMemberIds, m.id]);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid #7c3aed' : '1px solid #eaebf0',
                        backgroundColor: isSelected ? '#f5f3ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: m.avatarBg,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.78rem'
                        }}>
                          {m.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                            {m.name} {m.isYou && <span style={{ color: '#059669', fontSize: '0.72rem' }}>(You)</span>}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{m.role} • {m.email}</div>
                        </div>
                      </div>

                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: isSelected ? 'none' : '1.5px solid #cbd5e1',
                        backgroundColor: isSelected ? '#7c3aed' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}>
                        {isSelected && <Check size={12} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  style={{
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMemberSubmit}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Members
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: ADD BOOKMARK                                                */}
      {/* ==================================================================== */}
      {isAddBookmarkOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4000
        }}>
          <div style={{
            width: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Add Bookmark</h3>
                <button
                  onClick={() => setIsAddBookmarkOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={18} />
                </button>
              </div>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: '#64748b' }}>
                Pin key resources, dashboards, or external links for {activeTeam?.name}.
              </p>

              <form onSubmit={handleAddBookmarkSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Q4 Roadmap Figma, Production DB Console"
                    value={newBookmarkTitle}
                    onChange={e => setNewBookmarkTitle(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.84rem',
                      outline: 'none',
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/project"
                    value={newBookmarkUrl}
                    onChange={e => setNewBookmarkUrl(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.84rem',
                      outline: 'none',
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddBookmarkOpen(false)}
                    style={{
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 20px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Add Bookmark
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: PEOPLE DIRECTORY                                            */}
      {/* ==================================================================== */}
      {isBrowsePeopleOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4000
        }}>
          <div style={{
            width: '500px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Workspace People Directory ({availableMembers.length})
              </h3>
              <button onClick={() => setIsBrowsePeopleOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
              {availableMembers.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: m.avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                      {m.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{m.name} {m.isYou && <span style={{ color: '#059669', fontSize: '0.72rem' }}>(You)</span>}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{m.email} • {m.role}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 700 }}>● {m.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
