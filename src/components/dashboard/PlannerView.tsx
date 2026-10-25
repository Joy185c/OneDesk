import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video, 
  Check, 
  X, 
  Sparkles, 
  Link2, 
  ChevronDown, 
  Flag, 
  Search, 
  RefreshCw, 
  Settings, 
  Sun, 
  Layout, 
  ArrowRight, 
  ArrowLeft, 
  CalendarCheck, 
  Zap, 
  Info,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Circle,
  AlertCircle,
  MoreVertical,
  CheckSquare,
  Lock,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// SVG ICONS & BRAND ASSETS
// ==========================================

const GoogleCalendarIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="6" y="6" width="36" height="36" rx="8" fill="#ffffff" stroke="#dadce0" strokeWidth="1.5"/>
    <path d="M6 14C6 9.58172 9.58172 6 14 6H34C38.4183 6 42 9.58172 42 14V16H6V14Z" fill="#4285F4"/>
    <rect x="13" y="3" width="4" height="6" rx="2" fill="#1976D2"/>
    <rect x="31" y="3" width="4" height="6" rx="2" fill="#1976D2"/>
    <text x="24" y="34" fill="#1976D2" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">31</text>
    <rect x="6" y="38" width="10" height="4" rx="2" fill="#34A853"/>
    <rect x="32" y="38" width="10" height="4" rx="2" fill="#EA4335"/>
  </svg>
);

const MicrosoftOutlookIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="8" y="10" width="32" height="28" rx="4" fill="#0078D4"/>
    <path d="M8 15L24 27L40 15" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="24" r="9" fill="#005A9E"/>
    <text x="18" y="28" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">O</text>
  </svg>
);

const ClickUpAIPetalIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2.5C10.6 5.5 10.6 7.5 12 9C13.4 7.5 13.4 5.5 12 2.5Z" fill="#ff70a6"/>
    <path d="M21.5 12C18.5 10.6 16.5 10.6 15 12C16.5 13.4 18.5 13.4 21.5 12Z" fill="#70d6ff"/>
    <path d="M12 21.5C13.4 18.5 13.4 16.5 12 15C10.6 16.5 10.6 18.5 12 21.5Z" fill="#ff9770"/>
    <path d="M2.5 12C5.5 13.4 7.5 13.4 9 12C7.5 10.6 5.5 10.6 2.5 12Z" fill="#a78bfa"/>
    <circle cx="12" cy="12" r="3" fill="#ec4899"/>
  </svg>
);

const ClickUpBrandLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M6 21L16 13L26 21" stroke="url(#cup-o-grad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="7" r="3" fill="#ff007a"/>
    <defs>
      <linearGradient id="cup-o-grad" x1="6" y1="21" x2="26" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ff007a"/>
        <stop offset="1" stopColor="#7b2cbf"/>
      </linearGradient>
    </defs>
  </svg>
);

const GoogleGLogo: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
);

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface CalendarEvent {
  id: string;
  title: string;
  dayIndex: number; // 0 (Sun) to 6 (Sat)
  dateStr: string; // YYYY-MM-DD
  startHour: number; // 1 to 23 (e.g. 10.5 = 10:30 AM)
  durationHours: number; // e.g. 1, 1.5, 0.5
  isAllDay?: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badge?: string;
  type: 'meeting' | 'focus' | 'task' | 'all-day';
  attendees?: string[];
  meetingUrl?: string;
  description?: string;
}

export interface PriorityItem {
  id: string;
  title: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  completed: boolean;
  dueDate: string;
  estimate: string;
}

export interface Teammate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  status: 'available' | 'in_meeting' | 'offline';
  role: string;
}

// ==========================================
// DEFAULT SEED DATA
// ==========================================

const INITIAL_EVENTS: CalendarEvent[] = [
  // All day events (matching screenshot)
  {
    id: 'evt-allday-1',
    title: '🎨 Design a Workflow... 2 events',
    dayIndex: 0,
    dateStr: '2026-10-25',
    startHour: 0,
    durationHours: 24,
    isAllDay: true,
    color: '#ea580c',
    bgColor: '#fff7ed',
    borderColor: '#fed7aa',
    textColor: '#c2410c',
    badge: '2 events',
    type: 'all-day',
    description: 'Quarterly UX workflow review & component audit'
  },
  {
    id: 'evt-allday-2',
    title: '🔗 Integrate Your Fav...',
    dayIndex: 2,
    dateStr: '2026-10-27',
    startHour: 0,
    durationHours: 24,
    isAllDay: true,
    color: '#7e22ce',
    bgColor: '#f3e8ff',
    borderColor: '#e9d5ff',
    textColor: '#7e22ce',
    type: 'all-day',
    description: 'GitHub & Slack webhook integration sync'
  },
  {
    id: 'evt-allday-3',
    title: '💬 Work Smarter with...',
    dayIndex: 3,
    dateStr: '2026-10-28',
    startHour: 0,
    durationHours: 24,
    isAllDay: true,
    color: '#be185d',
    bgColor: '#fdf2f8',
    borderColor: '#fbcfe8',
    textColor: '#be185d',
    type: 'all-day',
    description: 'ClickUp AI automation and prompt engineering demo'
  },
  // Timed Calendar events
  {
    id: 'evt-1',
    title: '🚀 Sprint Planning & Architecture Review',
    dayIndex: 0, // Sun 25
    dateStr: '2026-10-25',
    startHour: 10,
    durationHours: 1.5,
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    textColor: '#5b21b6',
    type: 'meeting',
    meetingUrl: 'https://meet.google.com/cup-sprt-sync',
    attendees: ['Joy Sarkar', 'Mugdho', 'Sarah Chen'],
    description: 'Review ClickUp 3.0 frontend & Supabase database schema updates.'
  },
  {
    id: 'evt-2',
    title: '⚡ Deep Work: Supabase Realtime Sync',
    dayIndex: 0, // Sun 25
    dateStr: '2026-10-25',
    startHour: 14,
    durationHours: 2,
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    textColor: '#047857',
    type: 'focus',
    attendees: ['Joy Sarkar'],
    description: 'Implement offline fallback and PostgreSQL realtime channel listeners.'
  },
  {
    id: 'evt-3',
    title: '📊 Executive Workspace Sync',
    dayIndex: 1, // Mon 26
    dateStr: '2026-10-26',
    startHour: 11,
    durationHours: 1,
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    textColor: '#1d4ed8',
    type: 'meeting',
    meetingUrl: 'https://meet.google.com/cup-exec-sync',
    attendees: ['Joy Sarkar', 'Alex Rivera'],
    description: 'Weekly team velocity and project milestones.'
  },
  {
    id: 'evt-4',
    title: '🎨 Design Review: Planner & Time Blocking',
    dayIndex: 2, // Tue 27
    dateStr: '2026-10-27',
    startHour: 15,
    durationHours: 1.5,
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    textColor: '#b45309',
    type: 'meeting',
    meetingUrl: 'https://meet.google.com/cup-dsgn-rev',
    attendees: ['Joy Sarkar', 'Mugdho'],
    description: 'Ensure 1-to-1 fidelity with official ClickUp 3.0 Planner UI.'
  },
  {
    id: 'evt-5',
    title: '👥 1-on-1 Mentorship & Engineering Sync',
    dayIndex: 3, // Wed 28
    dateStr: '2026-10-28',
    startHour: 13,
    durationHours: 1,
    color: '#0284c7',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    textColor: '#0369a1',
    type: 'meeting',
    meetingUrl: 'https://meet.google.com/cup-one-sync',
    attendees: ['Joy Sarkar', 'David Kim'],
    description: 'Career progression, code reviews, and tooling enhancements.'
  },
  {
    id: 'evt-6',
    title: '🎉 Team Demo & Release Celebration',
    dayIndex: 5, // Fri 30
    dateStr: '2026-10-30',
    startHour: 16,
    durationHours: 1.5,
    color: '#9333ea',
    bgColor: '#faf5ff',
    borderColor: '#e9d5ff',
    textColor: '#7e22ce',
    type: 'meeting',
    meetingUrl: 'https://meet.google.com/cup-team-demo',
    attendees: ['Joy Sarkar', 'Mugdho', 'Alex Rivera', 'Sarah Chen', 'David Kim'],
    description: 'Demo of live Vercel deployment with Supabase hybrid database.'
  }
];

const INITIAL_PRIORITIES: PriorityItem[] = [
  {
    id: 'prio-1',
    title: 'Finalize ClickUp 3.0 Planner Interactions',
    priority: 'urgent',
    completed: false,
    dueDate: 'Today',
    estimate: '2h'
  },
  {
    id: 'prio-2',
    title: 'Supabase Realtime Channel Sync Verification',
    priority: 'high',
    completed: false,
    dueDate: 'Tomorrow',
    estimate: '3h'
  }
];

const TEAMMATES: Teammate[] = [
  { id: 'tm-1', name: 'Joy Sarkar (You)', email: 'joy185c@gmail.com', avatar: 'JS', color: '#7c3aed', status: 'available', role: 'Full Stack Lead' },
  { id: 'tm-2', name: 'Junaed Al Mugdho', email: 'junaedalmugdho@gmail.com', avatar: '👓', color: '#2563eb', status: 'available', role: 'Lead Product Designer' },
  { id: 'tm-3', name: 'Alex Rivera', email: 'alex.rivera@clickup.team', avatar: 'AR', color: '#059669', status: 'available', role: 'Product Manager' },
  { id: 'tm-4', name: 'Sarah Chen', email: 'sarah.chen@clickup.team', avatar: 'SC', color: '#d97706', status: 'in_meeting', role: 'QA & Test Engineer' },
  { id: 'tm-5', name: 'David Kim', email: 'david.kim@clickup.team', avatar: 'DK', color: '#dc2626', status: 'offline', role: 'DevOps & Cloud Architect' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export const PlannerView: React.FC = () => {
  const { user } = useAuth();
  const currentUserName = user?.name || 'Workspace User';
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'WU';

  // Calendar Connection State (Defaults to true so user immediately accesses Planner, persisted)
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    const saved = localStorage.getItem('clickup_planner_connected');
    return saved !== null ? saved === 'true' : true;
  });

  // Google Auth Dialog State
  const [authModalStep, setAuthModalStep] = useState<'none' | 'account_chooser' | 'consent' | 'connecting'>('none');
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState({
    name: currentUserName,
    email: user?.email || 'user@work.com',
    avatar: userInitials
  });

  // Current Week Offset (0 = current week starting Sun Oct 25, 2026)
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // View Mode: Week, Day, Month
  const [calendarViewMode, setCalendarViewMode] = useState<'Week' | 'Day' | 'Month'>('Week');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState<boolean>(false);

  // Selected Day for Day View (0 = Sun, 1 = Mon, ...)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Events & Priorities State (Saved to localStorage)
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('clickup_planner_events_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_EVENTS;
  });

  const [priorities, setPriorities] = useState<PriorityItem[]>(() => {
    const saved = localStorage.getItem('clickup_planner_priorities_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PRIORITIES;
  });

  // UI Panels & Popovers State
  const [isPlannerSidebarOpen, setIsPlannerSidebarOpen] = useState<boolean>(true);
  const [lightenNonWorking, setLightenNonWorking] = useState<boolean>(false);
  const [showWeekNumbers, setShowWeekNumbers] = useState<boolean>(false);
  const [isMeetingAgentToastOpen, setIsMeetingAgentToastOpen] = useState<boolean>(true);
  const [isMeetingAgentReady, setIsMeetingAgentReady] = useState<boolean>(false);
  const [meetWithSearch, setMeetWithSearch] = useState<string>('');
  const [assignedOpen, setAssignedOpen] = useState<boolean>(true);
  const [todayOverdueOpen, setTodayOverdueOpen] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isPlannerMenuOpen, setIsPlannerMenuOpen] = useState<boolean>(false);
  const [isCommandPopoverOpen, setIsCommandPopoverOpen] = useState<boolean>(false);
  const [commandSearchQuery, setCommandSearchQuery] = useState<string>('');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State for Event Creation / Editing
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventFormDay, setEventFormDay] = useState<number>(0);
  const [eventFormHour, setEventFormHour] = useState<number>(10);
  const [eventFormDuration, setEventFormDuration] = useState<number>(1);
  const [eventFormTitle, setEventFormTitle] = useState<string>('');
  const [eventFormType, setEventFormType] = useState<'meeting' | 'focus' | 'task' | 'all-day'>('meeting');
  const [eventFormColor, setEventFormColor] = useState<string>('#7c3aed');
  const [eventFormWithMeet, setEventFormWithMeet] = useState<boolean>(true);
  const [eventFormDescription, setEventFormDescription] = useState<string>('');
  const [eventFormAttendee, setEventFormAttendee] = useState<string>('Joy Sarkar');

  // Modal State for Adding Priority Task
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState<boolean>(false);
  const [newPriorityTitle, setNewPriorityTitle] = useState<string>('');
  const [newPriorityLevel, setNewPriorityLevel] = useState<'urgent' | 'high' | 'normal' | 'low'>('high');
  const [newPriorityEstimate, setNewPriorityEstimate] = useState<string>('1h');

  // Modal State for 1:1 Teammate Booking
  const [bookingTeammate, setBookingTeammate] = useState<Teammate | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('clickup_planner_connected', isConnected ? 'true' : 'false');
  }, [isConnected]);

  useEffect(() => {
    localStorage.setItem('clickup_planner_events_v3', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('clickup_planner_priorities_v1', JSON.stringify(priorities));
  }, [priorities]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Google Accounts List
  const googleAccounts = [
    { name: currentUserName, email: user?.email || 'user@work.com', avatar: userInitials, signedOut: false },
    { name: 'Sarah Miller', email: 'sarah.miller@clickup.team', avatar: 'SM', signedOut: false },
    { name: 'Alex Rivera', email: 'alex.rivera@clickup.team', avatar: 'AR', signedOut: false },
    { name: 'Priya Gupta', email: 'priya.gupta@clickup.team', avatar: 'PG', signedOut: true }
  ];

  // Base Reference Date: Sunday, October 25, 2026
  const baseDate = useMemo(() => {
    const d = new Date(2026, 9, 25); // Month is 0-indexed (9 = Oct)
    d.setDate(d.getDate() + (weekOffset * 7));
    return d;
  }, [weekOffset]);

  // Compute 7 Week Days dynamically based on weekOffset
  const weekDays = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((dayName, idx) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + idx);
      const isToday = weekOffset === 0 && idx === 0; // Sun 25 is 'Today' in reference screenshot
      return {
        name: dayName,
        date: d.getDate(),
        fullDate: d,
        dateStr: d.toISOString().split('T')[0],
        dayIndex: idx,
        isToday
      };
    });
  }, [baseDate, weekOffset]);

  // Month & Year header display
  const headerMonthYear = useMemo(() => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const midWeek = new Date(baseDate);
    midWeek.setDate(baseDate.getDate() + 3);
    return `${monthNames[midWeek.getMonth()]} ${midWeek.getFullYear()}`;
  }, [baseDate]);

  // Hours array from 1 am to 11 pm
  const hours = [
    '1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am', '8 am', '9 am', 
    '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', 
    '7 pm', '8 pm', '9 pm', '10 pm', '11 pm'
  ];

  // Colors Palette
  const colorPresets = [
    { label: 'Purple', color: '#7c3aed', bgColor: '#f5f3ff', borderColor: '#ddd6fe', textColor: '#5b21b6' },
    { label: 'Blue', color: '#2563eb', bgColor: '#eff6ff', borderColor: '#bfdbfe', textColor: '#1d4ed8' },
    { label: 'Emerald', color: '#059669', bgColor: '#ecfdf5', borderColor: '#a7f3d0', textColor: '#047857' },
    { label: 'Amber', color: '#d97706', bgColor: '#fffbeb', borderColor: '#fde68a', textColor: '#b45309' },
    { label: 'Rose', color: '#e11d48', bgColor: '#fff1f2', borderColor: '#fecdd3', textColor: '#be123c' }
  ];

  // Handle Google Auth flow
  const handleSelectAccount = (acc: typeof googleAccounts[0]) => {
    if (acc.signedOut) return;
    setSelectedGoogleAccount({ name: acc.name, email: acc.email, avatar: acc.avatar });
    setAuthModalStep('consent');
  };

  const handleCompleteGoogleAuth = () => {
    setAuthModalStep('connecting');
    setTimeout(() => {
      setAuthModalStep('none');
      setIsConnected(true);
      showToast(`Connected to Google Calendar (${selectedGoogleAccount.email})`);
    }, 900);
  };

  // Open Event Modal for New Event at given slot
  const handleOpenNewEvent = (dayIdx: number, hour: number, isAllDay: boolean = false) => {
    setEditingEvent(null);
    setEventFormDay(dayIdx);
    setEventFormHour(hour);
    setEventFormDuration(1);
    setEventFormTitle('');
    setEventFormType(isAllDay ? 'all-day' : 'meeting');
    setEventFormColor('#7c3aed');
    setEventFormWithMeet(true);
    setEventFormDescription('');
    setEventFormAttendee('Joy Sarkar');
    setIsEventModalOpen(true);
  };

  // Open Event Modal to Edit existing event
  const handleOpenEditEvent = (evt: CalendarEvent) => {
    setEditingEvent(evt);
    setEventFormDay(evt.dayIndex);
    setEventFormHour(evt.startHour);
    setEventFormDuration(evt.durationHours);
    setEventFormTitle(evt.title);
    setEventFormType(evt.type);
    setEventFormColor(evt.color);
    setEventFormWithMeet(!!evt.meetingUrl);
    setEventFormDescription(evt.description || '');
    setEventFormAttendee(evt.attendees?.[0] || 'Joy Sarkar');
    setIsEventModalOpen(true);
  };

  // Save Event (Create or Update)
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormTitle.trim()) {
      showToast('Please enter an event title');
      return;
    }

    const preset = colorPresets.find(p => p.color === eventFormColor) || colorPresets[0];

    if (editingEvent) {
      // Update
      setEvents(prev => prev.map(ev => {
        if (ev.id === editingEvent.id) {
          return {
            ...ev,
            title: eventFormTitle,
            dayIndex: eventFormDay,
            startHour: eventFormType === 'all-day' ? 0 : eventFormHour,
            durationHours: eventFormType === 'all-day' ? 24 : eventFormDuration,
            isAllDay: eventFormType === 'all-day',
            type: eventFormType,
            color: preset.color,
            bgColor: preset.bgColor,
            borderColor: preset.borderColor,
            textColor: preset.textColor,
            meetingUrl: eventFormWithMeet ? (ev.meetingUrl || `https://meet.google.com/cup-${Math.random().toString(36).substring(2, 7)}`) : undefined,
            description: eventFormDescription,
            attendees: [eventFormAttendee]
          };
        }
        return ev;
      }));
      showToast(`Event "${eventFormTitle}" updated`);
    } else {
      // Create New
      const newEvt: CalendarEvent = {
        id: `evt-${Date.now()}`,
        title: eventFormTitle,
        dayIndex: eventFormDay,
        dateStr: weekDays[eventFormDay]?.dateStr || '2026-10-25',
        startHour: eventFormType === 'all-day' ? 0 : eventFormHour,
        durationHours: eventFormType === 'all-day' ? 24 : eventFormDuration,
        isAllDay: eventFormType === 'all-day',
        type: eventFormType,
        color: preset.color,
        bgColor: preset.bgColor,
        borderColor: preset.borderColor,
        textColor: preset.textColor,
        meetingUrl: eventFormWithMeet ? `https://meet.google.com/cup-${Math.random().toString(36).substring(2, 7)}` : undefined,
        description: eventFormDescription,
        attendees: [eventFormAttendee]
      };
      setEvents(prev => [...prev, newEvt]);
      showToast(`Event "${eventFormTitle}" scheduled`);
    }

    setIsEventModalOpen(false);
  };

  // Delete Event
  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setIsEventModalOpen(false);
    showToast('Event removed from calendar');
  };

  // Add Priority Task
  const handleAddPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPriorityTitle.trim()) return;

    const newPrio: PriorityItem = {
      id: `prio-${Date.now()}`,
      title: newPriorityTitle,
      priority: newPriorityLevel,
      completed: false,
      dueDate: 'Today',
      estimate: newPriorityEstimate
    };

    setPriorities(prev => [newPrio, ...prev]);
    setNewPriorityTitle('');
    setIsPriorityModalOpen(false);
    showToast(`Priority "${newPrio.title}" added`);
  };

  // Schedule Priority Task onto Calendar
  const handleSchedulePriorityOnCalendar = (prio: PriorityItem) => {
    // Find next available afternoon hour
    const existingHours = events.filter(e => e.dayIndex === 0).map(e => Math.floor(e.startHour));
    let targetHour = 13;
    while (existingHours.includes(targetHour) && targetHour < 20) {
      targetHour++;
    }

    const newEvt: CalendarEvent = {
      id: `evt-task-${Date.now()}`,
      title: `⚡ Focus: ${prio.title}`,
      dayIndex: 0,
      dateStr: weekDays[0].dateStr,
      startHour: targetHour,
      durationHours: 1,
      type: 'task',
      color: '#7c3aed',
      bgColor: '#faf5ff',
      borderColor: '#e9d5ff',
      textColor: '#6b21a8',
      description: `Time-blocked for priority task: ${prio.title}`,
      attendees: ['Joy Sarkar']
    };

    setEvents(prev => [...prev, newEvt]);
    showToast(`Time-blocked "${prio.title}" for Today at ${targetHour % 12 || 12} ${targetHour >= 12 ? 'pm' : 'am'}`);
  };

  // Book 1:1 with Teammate
  const handleScheduleWithTeammate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTeammate) return;

    const newEvt: CalendarEvent = {
      id: `evt-meet-${Date.now()}`,
      title: `👥 1:1 Sync with ${bookingTeammate.name}`,
      dayIndex: 0,
      dateStr: weekDays[0].dateStr,
      startHour: 15,
      durationHours: 0.75,
      type: 'meeting',
      color: bookingTeammate.color,
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
      textColor: '#1e40af',
      meetingUrl: `https://meet.google.com/cup-${Math.random().toString(36).substring(2, 7)}`,
      description: `1-on-1 team sync with ${bookingTeammate.name} (${bookingTeammate.role})`,
      attendees: ['Joy Sarkar', bookingTeammate.name]
    };

    setEvents(prev => [...prev, newEvt]);
    setBookingTeammate(null);
    showToast(`Meeting booked with ${bookingTeammate.name}`);
  };

  // Filter Teammates based on Meet With search
  const filteredTeammates = useMemo(() => {
    if (!meetWithSearch.trim()) return TEAMMATES;
    return TEAMMATES.filter(t => 
      t.name.toLowerCase().includes(meetWithSearch.toLowerCase()) || 
      t.role.toLowerCase().includes(meetWithSearch.toLowerCase())
    );
  }, [meetWithSearch]);

  // Filter Commands for Command Bar Popover
  const commandsList = [
    { id: 'c-lighten', icon: '💡', title: 'Lighten non-working hours', action: () => setLightenNonWorking(!lightenNonWorking), status: lightenNonWorking ? 'ON' : 'OFF' },
    { id: 'c-weeknum', icon: '📅', title: 'Show week numbers', action: () => setShowWeekNumbers(!showWeekNumbers), status: showWeekNumbers ? 'ON' : 'OFF' },
    { id: 'c-sidebar', icon: '📐', title: 'Toggle planner sidebar', action: () => setIsPlannerSidebarOpen(!isPlannerSidebarOpen), shortcut: 'Ctrl \\' },
    { id: 'c-next', icon: '➡️', title: 'Next week', action: () => setWeekOffset(w => w + 1), shortcut: '→' },
    { id: 'c-prev', icon: '⬅️', title: 'Previous week', action: () => setWeekOffset(w => w - 1), shortcut: '←' },
    { id: 'c-today', icon: '🎯', title: 'Jump to Today', action: () => setWeekOffset(0), shortcut: 'T' },
    { id: 'c-quickfocus', icon: '⚡', title: 'Schedule 1-Hour Focus Block', action: () => handleOpenNewEvent(0, 14, false), shortcut: 'F' },
    { id: 'c-addevent', icon: '➕', title: 'Create new calendar event', action: () => handleOpenNewEvent(0, 10, false), shortcut: 'C' }
  ];

  const filteredCommands = useMemo(() => {
    if (!commandSearchQuery.trim()) return commandsList;
    return commandsList.filter(c => c.title.toLowerCase().includes(commandSearchQuery.toLowerCase()));
  }, [commandSearchQuery, lightenNonWorking, showWeekNumbers, isPlannerSidebarOpen]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Toast Notification */}
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

      {/* ============================================================== */}
      {/* VIEW 1: ONBOARDING SCREEN (If disconnected)                     */}
      {/* ============================================================== */}
      {!isConnected && (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.6,
            pointerEvents: 'none'
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1180px',
            width: '100%',
            gap: '60px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ flex: 1, maxWidth: '520px' }}>
              <h1 style={{
                fontSize: '2.8rem',
                fontWeight: 900,
                color: '#1e1f21',
                lineHeight: 1.15,
                margin: '0 0 18px 0',
                letterSpacing: '-0.025em'
              }}>
                You, but better organized
              </h1>
              <p style={{
                fontSize: '1.08rem',
                color: '#4f5762',
                lineHeight: 1.6,
                margin: '0 0 36px 0',
                fontWeight: 400
              }}>
                Connect your calendar to manage events, time block your work, and take meeting notes - powered by ClickUp AI.
              </p>

              <div>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#6c757d',
                  marginBottom: '12px',
                  letterSpacing: '0.02em'
                }}>
                  Get started with
                </div>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setAuthModalStep('account_chooser')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '11px 20px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#202124',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                  >
                    <GoogleCalendarIcon size={20} />
                    <span>Google Calendar</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsConnected(true);
                      showToast('Connected to Microsoft Outlook Calendar');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '11px 20px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#202124',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                  >
                    <MicrosoftOutlookIcon size={20} />
                    <span>Microsoft Outlook</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right preview card */}
            <div style={{ flex: 1, maxWidth: '520px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #ebebeb',
                boxShadow: '0 12px 36px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
                padding: '24px',
                minHeight: '380px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#8c8c8c' }}>1</span>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7' }} />
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e1f21' }}>Update color tokens</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem', color: '#7c3aed', fontWeight: 600 }}>
                      <span>📅 17 Mar</span>
                      <span>⌛ 4h</span>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    backgroundColor: '#fbf9fe',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid #f3e8ff'
                  }}>
                    <div style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '8px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700 }}>
                      Design Sprint Feedback
                      <div style={{ fontSize: '0.68rem', fontWeight: 500, color: '#9333ea', marginTop: '2px' }}>12 - 1pm</div>
                    </div>
                    <div style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '8px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700 }}>
                      Calendar Squad Sync
                      <div style={{ fontSize: '0.68rem', fontWeight: 500, color: '#9333ea', marginTop: '2px' }}>1 - 2pm</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#1e1f21', margin: '0 0 6px 0' }}>
                    Automatic time blocking
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
                    AI suggests and schedules tasks on your calendar. Like your own personal assistant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* GOOGLE OAUTH MODALS (Account Chooser & Consent)                */}
      {/* ============================================================== */}
      {authModalStep === 'account_chooser' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '450px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '12px 18px',
              borderBottom: '1px solid #f1f3f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GoogleGLogo size={18} />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#3c4043' }}>Sign in with Google</span>
              </div>
              <button onClick={() => setAuthModalStep('none')} style={{ border: 'none', background: 'none', color: '#5f6368', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <ClickUpBrandLogo size={42} />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#202124', textAlign: 'center', margin: '0 0 6px 0' }}>
                Choose an account
              </h2>
              <p style={{ fontSize: '0.94rem', color: '#5f6368', textAlign: 'center', margin: '0 0 20px 0' }}>
                to continue to <span style={{ color: '#1a73e8', fontWeight: 600 }}>ClickUp</span>
              </p>

              <div style={{ border: '1px solid #dadce0', borderRadius: '8px', overflow: 'hidden', maxHeight: '300px', overflowY: 'auto' }}>
                {googleAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectAccount(acc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderBottom: idx < googleAccounts.length - 1 ? '1px solid #f1f3f4' : 'none',
                      cursor: acc.signedOut ? 'default' : 'pointer'
                    }}
                    onMouseEnter={e => { if (!acc.signedOut) e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                    onMouseLeave={e => { if (!acc.signedOut) e.currentTarget.style.backgroundColor = '#ffffff'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: acc.signedOut ? '#9aa0a6' : '#1a73e8',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.88rem'
                      }}>
                        {acc.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#202124' }}>{acc.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#5f6368' }}>{acc.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {authModalStep === 'consent' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8f9fa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GoogleGLogo size={18} />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#3c4043' }}>Sign in with Google</span>
              </div>
              <button onClick={() => setAuthModalStep('none')} style={{ border: 'none', background: 'none', color: '#5f6368', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <ClickUpBrandLogo size={42} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#202124', lineHeight: 1.3, margin: '0 0 12px 0' }}>
                ClickUp wants access to your Google Account
              </h2>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #dadce0',
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '0.8rem',
                color: '#3c4043',
                marginBottom: '20px'
              }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#1a73e8', color: '#fff', fontSize: '0.66rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {selectedGoogleAccount.avatar}
                </div>
                <span>{selectedGoogleAccount.email}</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: '#f8fafd',
                marginBottom: '24px'
              }}>
                <GoogleCalendarIcon size={24} />
                <div style={{ flex: 1, fontSize: '0.78rem', color: '#3c4043', lineHeight: 1.4 }}>
                  See, edit, share and permanently delete all calendars that you can access using Google Calendar.
                </div>
                <input type="checkbox" defaultChecked style={{ marginTop: '3px', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setAuthModalStep('account_chooser')}
                  style={{ padding: '8px 22px', backgroundColor: '#ffffff', border: '1px solid #dadce0', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, color: '#1a73e8', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteGoogleAuth}
                  style={{ padding: '8px 26px', backgroundColor: '#1a73e8', border: 'none', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', cursor: 'pointer' }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: FULL CONNECTED PLANNER & CALENDAR                       */}
      {/* ============================================================== */}
      {isConnected && (
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          position: 'relative'
        }}>
          {/* 1. LEFT PLANNER SUB-PANEL */}
          {isPlannerSidebarOpen && (
            <div style={{
              width: '260px',
              backgroundColor: '#fafbfc',
              borderRight: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 14px',
              overflowY: 'auto',
              flexShrink: 0
            }}>
              {/* Header: Planner + ▾ */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
                position: 'relative'
              }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1f21', margin: 0 }}>
                  Planner
                </h3>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsPlannerMenuOpen(!isPlannerMenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: isPlannerMenuOpen ? '#f1f5f9' : '#ffffff',
                      borderRadius: '6px',
                      padding: '3px 6px',
                      cursor: 'pointer',
                      color: '#475569',
                      fontSize: '0.78rem'
                    }}
                  >
                    <Plus size={14} />
                    <ChevronDown size={12} />
                  </button>

                  {/* Planner Quick Add Dropdown */}
                  {isPlannerMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '6px',
                      width: '210px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      border: '1px solid #e2e8f0',
                      padding: '6px',
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}>
                      <div
                        onClick={() => {
                          setIsPlannerMenuOpen(false);
                          handleOpenNewEvent(0, 10, false);
                        }}
                        style={{ padding: '7px 10px', borderRadius: '5px', fontSize: '0.8rem', color: '#1e1f21', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <CalendarCheck size={14} color="#7c3aed" />
                        <span>New Calendar Event</span>
                      </div>

                      <div
                        onClick={() => {
                          setIsPlannerMenuOpen(false);
                          setIsPriorityModalOpen(true);
                        }}
                        style={{ padding: '7px 10px', borderRadius: '5px', fontSize: '0.8rem', color: '#1e1f21', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Flag size={14} color="#e11d48" />
                        <span>Add Priority Task</span>
                      </div>

                      <div
                        onClick={() => {
                          setIsPlannerMenuOpen(false);
                          handleOpenNewEvent(0, 14, false);
                        }}
                        style={{ padding: '7px 10px', borderRadius: '5px', fontSize: '0.8rem', color: '#1e1f21', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Zap size={14} color="#059669" />
                        <span>Schedule Focus Time</span>
                      </div>

                      <div
                        onClick={() => {
                          setIsPlannerMenuOpen(false);
                          handleOpenNewEvent(0, 0, true);
                        }}
                        style={{ padding: '7px 10px', borderRadius: '5px', fontSize: '0.8rem', color: '#1e1f21', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Sun size={14} color="#d97706" />
                        <span>Add All-Day Event</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 1: Priorities */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                    Priorities ({priorities.length})
                  </div>
                  <button
                    onClick={() => setIsPriorityModalOpen(true)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#7c3aed',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    + Add
                  </button>
                </div>

                {priorities.length === 0 ? (
                  <div style={{
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    padding: '16px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '8px'
                  }}>
                    <Flag size={18} color="#94a3b8" />
                    <span style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.3 }}>
                      Prioritize a task to see it appear here
                    </span>
                    <button
                      onClick={() => setIsPriorityModalOpen(true)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#7c3aed',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      + Add priority
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {priorities.map(prio => (
                      <div
                        key={prio.id}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '10px 10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                            <button
                              onClick={() => {
                                setPriorities(prev => prev.map(p => p.id === prio.id ? { ...p, completed: !p.completed } : p));
                              }}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                            >
                              {prio.completed ? (
                                <CheckCircle2 size={15} color="#10b981" />
                              ) : (
                                <Circle size={15} color="#94a3b8" />
                              )}
                            </button>
                            <span style={{
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              color: prio.completed ? '#94a3b8' : '#1e1f21',
                              textDecoration: prio.completed ? 'line-through' : 'none',
                              lineHeight: 1.3
                            }}>
                              {prio.title}
                            </span>
                          </div>
                          <button
                            onClick={() => setPriorities(prev => prev.filter(p => p.id !== prio.id))}
                            style={{ border: 'none', background: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '1px' }}
                            title="Remove priority"
                          >
                            <X size={13} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              color: prio.priority === 'urgent' ? '#e11d48' : prio.priority === 'high' ? '#ea580c' : '#2563eb',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              fontSize: '0.64rem',
                              backgroundColor: prio.priority === 'urgent' ? '#ffe4e6' : '#fff7ed',
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}>
                              {prio.priority}
                            </span>
                            <span style={{ color: '#64748b' }}>⌛ {prio.estimate}</span>
                          </div>

                          <button
                            onClick={() => handleSchedulePriorityOnCalendar(prio)}
                            title="Block time on Calendar"
                            style={{
                              backgroundColor: '#f5f3ff',
                              border: '1px solid #ddd6fe',
                              color: '#7c3aed',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <Zap size={10} />
                            <span>Schedule</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Meet with */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                  Meet with
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  padding: '6px 10px',
                  marginBottom: '8px'
                }}>
                  <Users size={14} color="#94a3b8" />
                  <input
                    type="text"
                    value={meetWithSearch}
                    onChange={e => setMeetWithSearch(e.target.value)}
                    placeholder="Search for people..."
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.78rem',
                      color: '#1e1f21',
                      backgroundColor: 'transparent'
                    }}
                  />
                  {meetWithSearch && (
                    <button onClick={() => setMeetWithSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                      <X size={12} color="#94a3b8" />
                    </button>
                  )}
                </div>

                {/* Filtered Teammates quick booking list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '140px', overflowY: 'auto' }}>
                  {filteredTeammates.map(tm => (
                    <div
                      key={tm.id}
                      onClick={() => setBookingTeammate(tm)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: '#ffffff',
                        border: '1px solid #f1f5f9'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: tm.color,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.68rem',
                          fontWeight: 700
                        }}>
                          {tm.avatar}
                        </div>
                        <span style={{ fontSize: '0.76rem', color: '#1e1f21', fontWeight: 600 }}>
                          {tm.name.split(' ')[0]}
                        </span>
                      </div>
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: tm.status === 'available' ? '#10b981' : tm.status === 'in_meeting' ? '#f59e0b' : '#94a3b8'
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Expandable Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {/* Assigned to me */}
                <div>
                  <button
                    onClick={() => setAssignedOpen(!assignedOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '4px 0',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ChevronRight size={14} style={{ transform: assignedOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                      <span>Assigned to me</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '10px' }}>3</span>
                  </button>

                  {assignedOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', paddingLeft: '14px' }}>
                      <div
                        onClick={() => handleSchedulePriorityOnCalendar({ id: 'a-1', title: 'Q4 Product Roadmap Deck', priority: 'high', completed: false, dueDate: 'Tomorrow', estimate: '1.5h' })}
                        style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf5ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                        title="Click to schedule on calendar"
                      >
                        <span style={{ color: '#1e1f21', fontWeight: 600 }}>Q4 Roadmap Deck</span>
                        <Zap size={11} color="#7c3aed" />
                      </div>

                      <div
                        onClick={() => handleSchedulePriorityOnCalendar({ id: 'a-2', title: 'Supabase Realtime Reconnects', priority: 'urgent', completed: false, dueDate: 'Today', estimate: '2h' })}
                        style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf5ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                        title="Click to schedule on calendar"
                      >
                        <span style={{ color: '#1e1f21', fontWeight: 600 }}>Supabase Reconnects</span>
                        <Zap size={11} color="#7c3aed" />
                      </div>

                      <div
                        onClick={() => handleSchedulePriorityOnCalendar({ id: 'a-3', title: 'Mobile Navigation Polish', priority: 'normal', completed: false, dueDate: 'Oct 30', estimate: '1h' })}
                        style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf5ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                        title="Click to schedule on calendar"
                      >
                        <span style={{ color: '#1e1f21', fontWeight: 600 }}>Mobile Nav Polish</span>
                        <Zap size={11} color="#7c3aed" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Today & overdue */}
                <div>
                  <button
                    onClick={() => setTodayOverdueOpen(!todayOverdueOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '4px 0',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ChevronRight size={14} style={{ transform: todayOverdueOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                      <span>Today & overdue</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#e11d48', backgroundColor: '#ffe4e6', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>2</span>
                  </button>

                  {todayOverdueOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', paddingLeft: '14px' }}>
                      <div
                        onClick={() => handleSchedulePriorityOnCalendar({ id: 'to-1', title: 'Vercel Deployment Verification', priority: 'urgent', completed: false, dueDate: 'Overdue', estimate: '1h' })}
                        style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#ffffff', border: '1px solid #fecdd3', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff1f2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ color: '#e11d48' }}>⚠️</span>
                          <span style={{ color: '#9f1239', fontWeight: 600 }}>Vercel Deploy Check</span>
                        </div>
                        <span style={{ fontSize: '0.64rem', color: '#e11d48', fontWeight: 700 }}>Overdue</span>
                      </div>

                      <div
                        onClick={() => handleSchedulePriorityOnCalendar({ id: 'to-2', title: 'Submit Weekly Timesheet', priority: 'high', completed: false, dueDate: 'Today', estimate: '0.5h' })}
                        style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#ffffff', border: '1px solid #fed7aa', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff7ed'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} color="#ea580c" />
                          <span style={{ color: '#9a3412', fontWeight: 600 }}>Weekly Timesheet</span>
                        </div>
                        <span style={{ fontSize: '0.64rem', color: '#c2410c', fontWeight: 700 }}>Due Today</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Backlog */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                  Backlog
                </div>
                <div style={{
                  border: '1px solid #f1f5f9',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: '#94a3b8'
                }}>
                  No tasks match these filters
                  <div style={{ marginTop: '8px' }}>
                    <button
                      onClick={() => setIsPriorityModalOpen(true)}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      + Add to Backlog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MAIN CALENDAR STAGE */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#ffffff'
          }}>
            {/* Top Calendar Toolbar */}
            <div style={{
              padding: '10px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff'
            }}>
              {/* Left: Nav arrows + Month Year + Today jump */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => setWeekOffset(w => w - 1)}
                    title="Previous Week (←)"
                    style={{
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setWeekOffset(w => w + 1)}
                    title="Next Week (→)"
                    style={{
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <h2 style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#1e1f21',
                  margin: 0
                }}>
                  {headerMonthYear}
                </h2>

                {weekOffset !== 0 && (
                  <button
                    onClick={() => setWeekOffset(0)}
                    style={{
                      border: '1px solid #ddd6fe',
                      backgroundColor: '#f5f3ff',
                      color: '#7c3aed',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Return to Today
                  </button>
                )}

                {showWeekNumbers && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    W{43 + weekOffset}
                  </span>
                )}
              </div>

              {/* Right: View mode dropdown, Quick New Event, Refresh, Settings */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* View Mode Selector */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{calendarViewMode}</span>
                    <ChevronDown size={14} />
                  </button>

                  {isViewDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '6px',
                      width: '130px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      border: '1px solid #e2e8f0',
                      padding: '4px',
                      zIndex: 100
                    }}>
                      {(['Week', 'Day', 'Month'] as const).map(mode => (
                        <div
                          key={mode}
                          onClick={() => {
                            setCalendarViewMode(mode);
                            setIsViewDropdownOpen(false);
                            showToast(`Switched to ${mode} View`);
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '5px',
                            fontSize: '0.8rem',
                            color: calendarViewMode === mode ? '#7c3aed' : '#1e1f21',
                            fontWeight: calendarViewMode === mode ? 700 : 500,
                            backgroundColor: calendarViewMode === mode ? '#f5f3ff' : 'transparent',
                            cursor: 'pointer'
                          }}
                        >
                          {mode} View
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Day 1 Shortcut button */}
                <button
                  onClick={() => {
                    setCalendarViewMode('Day');
                    setSelectedDayIndex(0);
                    showToast('Focused on Sunday 25 Oct');
                  }}
                  title="Day View (Today)"
                  style={{
                    border: '1px solid #e2e8f0',
                    backgroundColor: calendarViewMode === 'Day' ? '#f5f3ff' : '#ffffff',
                    color: calendarViewMode === 'Day' ? '#7c3aed' : '#334155',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CalendarIcon size={14} />
                  <span>1</span>
                </button>

                {/* Quick Add Event button */}
                <button
                  onClick={() => handleOpenNewEvent(0, 10, false)}
                  style={{
                    backgroundColor: '#7c3aed',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 1px 3px rgba(124, 58, 237, 0.3)'
                  }}
                >
                  <Plus size={14} />
                  <span>Event</span>
                </button>

                {/* Sync / Refresh */}
                <button
                  onClick={() => {
                    showToast('Syncing with Google Calendar & Supabase...');
                    setTimeout(() => showToast('Planner synced successfully'), 1000);
                  }}
                  title="Sync with Google Calendar"
                  style={{
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <RefreshCw size={14} />
                </button>

                {/* Settings Gear Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    title="Calendar Settings & Integrations"
                    style={{
                      border: '1px solid #e2e8f0',
                      backgroundColor: isSettingsOpen ? '#f1f5f9' : '#ffffff',
                      borderRadius: '6px',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Settings size={14} />
                  </button>

                  {isSettingsOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '6px',
                      width: '230px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      border: '1px solid #e2e8f0',
                      padding: '6px',
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}>
                      <div
                        onClick={() => {
                          setLightenNonWorking(!lightenNonWorking);
                          setIsSettingsOpen(false);
                          showToast(`Non-working hours ${!lightenNonWorking ? 'lightened' : 'hatched'}`);
                        }}
                        style={{ padding: '7px 10px', borderRadius: '5px', fontSize: '0.8rem', color: '#1e1f21', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Sun size={13} color="#64748b" />
                          <span>Lighten non-working</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>{lightenNonWorking ? 'ON' : 'OFF'}</span>
                      </div>

                      <div
                        onClick={() => {
                          setShowWeekNumbers(!showWeekNumbers);
                          setIsSettingsOpen(false);
                        }}
                        style={{ padding: '7px 10px', borderRadius: '5px', fontSize: '0.8rem', color: '#1e1f21', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CalendarIcon size={13} color="#64748b" />
                          <span>Show week numbers</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>{showWeekNumbers ? 'ON' : 'OFF'}</span>
                      </div>

                      <div
                        onClick={() => {
                          setEvents(INITIAL_EVENTS);
                          setIsSettingsOpen(false);
                          showToast('Calendar restored to default events');
                        }}
                        style={{ padding: '7px 10px', borderRadius: '5px', fontSize: '0.8rem', color: '#1e1f21', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <RefreshCw size={13} color="#64748b" />
                        <span>Reset Default Events</span>
                      </div>

                      <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />

                      <div
                        onClick={() => {
                          setIsConnected(false);
                          setIsSettingsOpen(false);
                          showToast('Disconnected from Google Calendar');
                        }}
                        style={{ padding: '7px 10px', borderRadius: '5px', fontSize: '0.8rem', color: '#e11d48', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff1f2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <X size={13} color="#e11d48" />
                        <span>Disconnect Google Calendar</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* VIEW MODE 1: WEEK CALENDAR (Default matching screenshot)   */}
            {/* ========================================================== */}
            {calendarViewMode === 'Week' && (
              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                {/* Day Columns Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '70px repeat(7, 1fr)',
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  position: 'sticky',
                  top: 0,
                  zIndex: 20
                }}>
                  {/* Timezone Indicator */}
                  <div style={{
                    padding: '10px 8px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textAlign: 'center',
                    borderRight: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px'
                  }}>
                    <span>+ GMT+6</span>
                  </div>

                  {/* 7 Week Day Headers */}
                  {weekDays.map(day => (
                    <div
                      key={day.dayIndex}
                      onClick={() => {
                        setSelectedDayIndex(day.dayIndex);
                        setCalendarViewMode('Day');
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRight: '1px solid #f1f5f9',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                      title="Click to view full Day schedule"
                    >
                      <div style={{
                        fontSize: '0.76rem',
                        fontWeight: day.isToday ? 700 : 500,
                        color: day.isToday ? '#1e1f21' : '#64748b'
                      }}>
                        {day.name}
                      </div>

                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: day.isToday ? '#e11d48' : 'transparent',
                        color: day.isToday ? '#ffffff' : '#1e1f21',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        marginTop: '2px'
                      }}>
                        {day.date}
                      </div>
                    </div>
                  ))}
                </div>

                {/* All-Day Events Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '70px repeat(7, 1fr)',
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: '#fafbfc',
                  minHeight: '36px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    padding: '6px 8px',
                    fontSize: '0.72rem',
                    color: '#64748b',
                    textAlign: 'center',
                    borderRight: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}>
                    <span>◇ All day</span>
                  </div>

                  {/* 7 All-Day columns */}
                  {weekDays.map(day => {
                    const allDayEvts = events.filter(e => e.dayIndex === day.dayIndex && e.isAllDay);
                    return (
                      <div
                        key={day.dayIndex}
                        style={{
                          padding: '4px 6px',
                          borderRight: '1px solid #f1f5f9',
                          minHeight: '32px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px',
                          justifyContent: 'center'
                        }}
                      >
                        {allDayEvts.map(evt => (
                          <div
                            key={evt.id}
                            onClick={() => handleOpenEditEvent(evt)}
                            style={{
                              backgroundColor: evt.bgColor,
                              border: `1px solid ${evt.borderColor}`,
                              color: evt.textColor,
                              borderRadius: '4px',
                              padding: '3px 8px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                            }}
                            title={`Click to edit: ${evt.title}`}
                          >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{evt.title}</span>
                            {evt.badge && (
                              <span style={{ fontSize: '0.64rem', color: evt.color, marginLeft: '4px' }}>{evt.badge}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Time Grid with Red Current-Time Line */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '70px repeat(7, 1fr)',
                  position: 'relative'
                }}>
                  {/* Red Current Time Line Indicator (Screenshot 4 at 9:35 AM) */}
                  {weekOffset === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '480px', // ~9:35 AM
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: '#e11d48',
                      zIndex: 15,
                      pointerEvents: 'none'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '14px',
                        top: '-10px',
                        backgroundColor: '#e11d48',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        boxShadow: '0 1px 3px rgba(225, 29, 72, 0.4)'
                      }}>
                        9:35
                      </span>
                      <div style={{
                        position: 'absolute',
                        left: '115px',
                        top: '-4px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#e11d48',
                        border: '2px solid #ffffff'
                      }} />
                    </div>
                  )}

                  {/* Time Axis Column */}
                  <div style={{ borderRight: '1px solid #f1f5f9' }}>
                    {hours.map((hr, idx) => (
                      <div
                        key={idx}
                        style={{
                          height: '56px',
                          padding: '4px 8px',
                          textAlign: 'right',
                          fontSize: '0.72rem',
                          color: '#94a3b8',
                          borderBottom: '1px solid #f8fafc',
                          boxSizing: 'border-box'
                        }}
                      >
                        {hr}
                      </div>
                    ))}
                  </div>

                  {/* 7 Day Columns with Events Overlay */}
                  {weekDays.map(day => {
                    const dayEvents = events.filter(e => e.dayIndex === day.dayIndex && !e.isAllDay);
                    return (
                      <div
                        key={day.dayIndex}
                        style={{
                          borderRight: '1px solid #f1f5f9',
                          position: 'relative',
                          boxSizing: 'border-box'
                        }}
                      >
                        {/* Hour Slot Backgrounds */}
                        {hours.map((_, hIdx) => {
                          const hourNum = hIdx + 1; // 1 to 23
                          const isNonWorking = hIdx < 7 || hIdx > 17;
                          return (
                            <div
                              key={hIdx}
                              onClick={() => handleOpenNewEvent(day.dayIndex, hourNum, false)}
                              style={{
                                height: '56px',
                                borderBottom: '1px solid #f1f5f9',
                                boxSizing: 'border-box',
                                background: isNonWorking
                                  ? (lightenNonWorking
                                      ? 'none'
                                      : 'repeating-linear-gradient(45deg, #fbfcfe, #fbfcfe 8px, #ffffff 8px, #ffffff 16px)')
                                  : 'transparent',
                                cursor: 'pointer',
                                transition: 'background-color 0.1s'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = isNonWorking
                                  ? (lightenNonWorking ? 'transparent' : 'transparent')
                                  : 'transparent';
                              }}
                              title={`Click to add event on ${day.name} at ${hours[hIdx]}`}
                            />
                          );
                        })}

                        {/* Positioned Event Blocks */}
                        {dayEvents.map(evt => {
                          const topPx = (evt.startHour - 1) * 56;
                          const heightPx = Math.max(34, evt.durationHours * 56 - 4);
                          return (
                            <div
                              key={evt.id}
                              onClick={e => {
                                e.stopPropagation();
                                handleOpenEditEvent(evt);
                              }}
                              style={{
                                position: 'absolute',
                                top: `${topPx}px`,
                                left: '4px',
                                right: '4px',
                                height: `${heightPx}px`,
                                backgroundColor: evt.bgColor,
                                border: `1.5px solid ${evt.borderColor}`,
                                borderLeft: `4px solid ${evt.color}`,
                                borderRadius: '6px',
                                padding: '6px 8px',
                                zIndex: 10,
                                cursor: 'pointer',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                                transition: 'transform 0.1s, box-shadow 0.1s'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
                              }}
                              title={`Click to edit: ${evt.title}`}
                            >
                              <div>
                                <div style={{
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  color: evt.textColor,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {evt.title}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: evt.color, fontWeight: 600, marginTop: '2px' }}>
                                  {evt.startHour % 12 || 12}:00 {evt.startHour >= 12 ? 'PM' : 'AM'} • {evt.durationHours}h
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                                {evt.meetingUrl ? (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.64rem', color: evt.color, fontWeight: 700 }}>
                                    <Video size={10} /> Meet
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '0.64rem', color: evt.color, fontWeight: 700 }}>
                                    {evt.type === 'focus' ? '⚡ Focus' : '📋 Task'}
                                  </span>
                                )}

                                {evt.attendees && evt.attendees.length > 0 && (
                                  <span style={{ fontSize: '0.64rem', color: '#64748b' }}>
                                    👥 {evt.attendees.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* VIEW MODE 2: DAY VIEW                                      */}
            {/* ========================================================== */}
            {calendarViewMode === 'Day' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                {/* Day Header banner */}
                <div style={{
                  padding: '14px 24px',
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: weekDays[selectedDayIndex]?.isToday ? '#e11d48' : '#7c3aed',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 800
                    }}>
                      {weekDays[selectedDayIndex]?.date}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e1f21' }}>
                        {weekDays[selectedDayIndex]?.name}, October {weekDays[selectedDayIndex]?.date}, 2026
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {events.filter(e => e.dayIndex === selectedDayIndex).length} scheduled events today
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {weekDays.map((d, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDayIndex(idx)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: selectedDayIndex === idx ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
                          backgroundColor: selectedDayIndex === idx ? '#f5f3ff' : '#ffffff',
                          color: selectedDayIndex === idx ? '#7c3aed' : '#475569',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                          cursor: 'pointer'
                        }}
                      >
                        {d.name} {d.date}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day Schedule Timeline */}
                <div style={{ padding: '20px 30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {hours.map((hr, idx) => {
                    const hourNum = idx + 1;
                    const matchedEvents = events.filter(e => e.dayIndex === selectedDayIndex && Math.floor(e.startHour) === hourNum);

                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '18px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid #f1f5f9'
                        }}
                      >
                        <div style={{ width: '60px', textAlign: 'right', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', paddingTop: '4px' }}>
                          {hr}
                        </div>

                        <div style={{ flex: 1, minHeight: '44px' }}>
                          {matchedEvents.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {matchedEvents.map(evt => (
                                <div
                                  key={evt.id}
                                  onClick={() => handleOpenEditEvent(evt)}
                                  style={{
                                    backgroundColor: evt.bgColor,
                                    border: `1.5px solid ${evt.borderColor}`,
                                    borderLeft: `4px solid ${evt.color}`,
                                    borderRadius: '8px',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <div>
                                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: evt.textColor }}>
                                      {evt.title}
                                    </div>
                                    <div style={{ fontSize: '0.76rem', color: evt.color, marginTop: '4px' }}>
                                      {evt.description || 'Calendar Event'}
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {evt.meetingUrl && (
                                      <a
                                        href={evt.meetingUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          backgroundColor: '#ffffff',
                                          border: `1px solid ${evt.borderColor}`,
                                          borderRadius: '6px',
                                          padding: '5px 10px',
                                          fontSize: '0.76rem',
                                          color: evt.color,
                                          fontWeight: 700,
                                          textDecoration: 'none'
                                        }}
                                      >
                                        <Video size={12} />
                                        <span>Join Meet</span>
                                      </a>
                                    )}
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleDeleteEvent(evt.id);
                                      }}
                                      style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenNewEvent(selectedDayIndex, hourNum, false)}
                              style={{
                                width: '100%',
                                height: '36px',
                                border: '1px dashed #e2e8f0',
                                borderRadius: '6px',
                                backgroundColor: 'transparent',
                                color: '#94a3b8',
                                fontSize: '0.76rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = '#7c3aed';
                                e.currentTarget.style.color = '#7c3aed';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.color = '#94a3b8';
                              }}
                            >
                              <Plus size={13} />
                              <span>Schedule at {hr}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* VIEW MODE 3: MONTH VIEW                                    */}
            {/* ========================================================== */}
            {calendarViewMode === 'Month' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '16px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.78rem', color: '#64748b', padding: '6px' }}>
                      {d}
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gridAutoRows: '110px',
                  gap: '8px',
                  flex: 1
                }}>
                  {Array.from({ length: 35 }).map((_, idx) => {
                    const dateNum = (idx - 3) > 0 && (idx - 3) <= 31 ? (idx - 3) : '';
                    const dayIdx = idx % 7;
                    const dayEvts = dateNum ? events.filter(e => e.dayIndex === dayIdx) : [];

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (dateNum) {
                            setSelectedDayIndex(dayIdx);
                            setCalendarViewMode('Day');
                          }
                        }}
                        style={{
                          backgroundColor: dateNum ? '#ffffff' : '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: dateNum ? 'pointer' : 'default'
                        }}
                        onMouseEnter={e => { if (dateNum) e.currentTarget.style.borderColor = '#7c3aed'; }}
                        onMouseLeave={e => { if (dateNum) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: dateNum === 25 ? 800 : 600,
                            color: dateNum === 25 ? '#ffffff' : '#1e1f21',
                            backgroundColor: dateNum === 25 ? '#e11d48' : 'transparent',
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {dateNum}
                          </span>
                          {dateNum && (
                            <span style={{ fontSize: '0.64rem', color: '#94a3b8' }}>
                              {dayEvts.length > 0 ? `${dayEvts.length} evts` : ''}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden' }}>
                          {dayEvts.slice(0, 2).map(ev => (
                            <div
                              key={ev.id}
                              style={{
                                fontSize: '0.66rem',
                                fontWeight: 700,
                                backgroundColor: ev.bgColor,
                                color: ev.textColor,
                                padding: '2px 5px',
                                borderRadius: '4px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {ev.title}
                            </div>
                          ))}
                          {dayEvts.length > 2 && (
                            <span style={{ fontSize: '0.62rem', color: '#7c3aed', fontWeight: 700 }}>
                              +{dayEvts.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. BOTTOM-LEFT MEETING AGENT NOTIFICATION TOAST */}
          {isMeetingAgentToastOpen && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '14px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
              border: isMeetingAgentReady ? '1px solid #10b981' : '1px solid #e5e7eb',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: '240px',
              zIndex: 30,
              animation: 'slideUp 0.3s ease'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: isMeetingAgentReady ? '#ecfdf5' : '#fffbeb',
                border: isMeetingAgentReady ? '1px solid #a7f3d0' : '1px solid #fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                flexShrink: 0
              }}>
                {isMeetingAgentReady ? '✨' : '💡'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1e1f21', marginBottom: '2px', lineHeight: 1.2 }}>
                  {isMeetingAgentReady ? 'Meeting Agent Ready!' : 'Creating your Meeting Agent...'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.25 }}>
                  {isMeetingAgentReady ? 'Transcribing & summarizing calls.' : "We're finishing setup."}
                </div>
              </div>

              {!isMeetingAgentReady ? (
                <button
                  onClick={() => {
                    setIsMeetingAgentReady(true);
                    showToast('ClickUp Meeting Agent activated');
                  }}
                  style={{
                    backgroundColor: '#7c3aed',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '4px',
                    padding: '3px 6px',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Activate
                </button>
              ) : (
                <button
                  onClick={() => setIsMeetingAgentToastOpen(false)}
                  style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {/* 4. BOTTOM FLOATING COMMAND BAR & POPOVER */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: isPlannerSidebarOpen ? 'calc(50% + 130px)' : '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Popover Menu */}
            {isCommandPopoverOpen && (
              <div style={{
                width: '460px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
                padding: '14px',
                marginBottom: '8px',
                animation: 'slideUp 0.18s ease'
              }}>
                {/* Up Next Section */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                    Up next
                  </div>
                  {events.length > 0 ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7c3aed' }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e1f21' }}>
                          {events[0]?.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                        {events[0]?.startHour % 12 || 12}:00 {events[0]?.startHour >= 12 ? 'pm' : 'am'}
                      </span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Nothing on your calendar coming up.
                    </div>
                  )}
                </div>

                {/* Commands Section */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                    Commands
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '180px', overflowY: 'auto' }}>
                    {filteredCommands.map(cmd => (
                      <div
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          setIsCommandPopoverOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          color: '#1e1f21',
                          backgroundColor: '#ffffff'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{cmd.icon}</span>
                          <span>{cmd.title}</span>
                        </div>
                        {cmd.status && (
                          <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 700 }}>
                            {cmd.status}
                          </span>
                        )}
                        {cmd.shortcut && (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {cmd.shortcut}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Connected Section */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                    Connected Account
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 10px', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>
                      J
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e1f21' }}>Joy Sarkar</span>{' '}
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>joy185c@gmail.com</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>● Synced</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pill Search Capsule */}
            <div
              style={{
                width: '460px',
                height: '42px',
                backgroundColor: '#ffffff',
                borderRadius: '100px',
                border: isCommandPopoverOpen ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  value={commandSearchQuery}
                  onChange={e => {
                    setCommandSearchQuery(e.target.value);
                    if (!isCommandPopoverOpen) setIsCommandPopoverOpen(true);
                  }}
                  onFocus={() => setIsCommandPopoverOpen(true)}
                  placeholder="Search events, teammates, commands..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.82rem',
                    color: '#1e1f21',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>

              {/* ClickUp AI Petal Toggle */}
              <div
                onClick={() => setIsCommandPopoverOpen(!isCommandPopoverOpen)}
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                title="ClickUp AI & Commands"
              >
                <ClickUpAIPetalIcon size={18} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: CREATE / EDIT CALENDAR EVENT                          */}
      {/* ============================================================== */}
      {isEventModalOpen && (
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
            width: '480px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            animation: 'scaleIn 0.2s ease'
          }}>
            {/* Header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid #f1f3f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarCheck size={18} color="#7c3aed" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1f21' }}>
                  {editingEvent ? 'Edit Calendar Event' : 'New Calendar Event'}
                </span>
              </div>
              <button
                onClick={() => setIsEventModalOpen(false)}
                style={{ border: 'none', background: 'none', color: '#5f6368', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEvent} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventFormTitle}
                  onChange={e => setEventFormTitle(e.target.value)}
                  placeholder="e.g. Design Sprint Sync, Deep Work Block"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    color: '#1e1f21',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
              </div>

              {/* Day & Time Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Day
                  </label>
                  <select
                    value={eventFormDay}
                    onChange={e => setEventFormDay(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                      color: '#1e1f21',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {weekDays.map(d => (
                      <option key={d.dayIndex} value={d.dayIndex}>
                        {d.name} {d.date} Oct
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Start Time
                  </label>
                  <select
                    value={eventFormHour}
                    onChange={e => setEventFormHour(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                      color: '#1e1f21',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {hours.map((h, i) => (
                      <option key={i} value={i + 1}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Event Type & Duration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Type
                  </label>
                  <select
                    value={eventFormType}
                    onChange={e => setEventFormType(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                      color: '#1e1f21',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="meeting">👥 Meeting</option>
                    <option value="focus">⚡ Focus Block</option>
                    <option value="task">📋 Task Time</option>
                    <option value="all-day">◇ All Day Event</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Duration
                  </label>
                  <select
                    value={eventFormDuration}
                    onChange={e => setEventFormDuration(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                      color: '#1e1f21',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value={0.5}>30 minutes</option>
                    <option value={0.75}>45 minutes</option>
                    <option value={1}>1 hour</option>
                    <option value={1.5}>1.5 hours</option>
                    <option value={2}>2 hours</option>
                  </select>
                </div>
              </div>

              {/* Color Theme Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Color Theme
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {colorPresets.map(preset => (
                    <button
                      type="button"
                      key={preset.color}
                      onClick={() => setEventFormColor(preset.color)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: preset.color,
                        border: eventFormColor === preset.color ? '3px solid #0f172a' : '2px solid transparent',
                        cursor: 'pointer'
                      }}
                      title={preset.label}
                    />
                  ))}
                </div>
              </div>

              {/* Video Call & Attendees */}
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="meetCheckbox"
                  checked={eventFormWithMeet}
                  onChange={e => setEventFormWithMeet(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="meetCheckbox" style={{ fontSize: '0.8rem', color: '#1e1f21', fontWeight: 600, cursor: 'pointer' }}>
                  Generate Google Meet video link
                </label>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Notes & Agenda
                </label>
                <textarea
                  rows={2}
                  value={eventFormDescription}
                  onChange={e => setEventFormDescription(e.target.value)}
                  placeholder="Optional meeting details, agenda, or links..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    color: '#1e1f21',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f3f4', paddingTop: '16px' }}>
                {editingEvent ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(editingEvent.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#e11d48',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Delete Event</span>
                  </button>
                ) : <div />}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEventModalOpen(false)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    style={{
                      padding: '8px 20px',
                      backgroundColor: '#7c3aed',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(124, 58, 237, 0.4)'
                    }}
                  >
                    {editingEvent ? 'Save Changes' : 'Schedule Event'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ADD PRIORITY TASK                                     */}
      {/* ============================================================== */}
      {isPriorityModalOpen && (
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
            width: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid #f1f3f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flag size={18} color="#e11d48" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1f21' }}>Add Priority Task</span>
              </div>
              <button onClick={() => setIsPriorityModalOpen(false)} style={{ border: 'none', background: 'none', color: '#5f6368', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPriority} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Task Name *
                </label>
                <input
                  type="text"
                  required
                  value={newPriorityTitle}
                  onChange={e => setNewPriorityTitle(e.target.value)}
                  placeholder="e.g. Supabase production migration test"
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
                    Priority Level
                  </label>
                  <select
                    value={newPriorityLevel}
                    onChange={e => setNewPriorityLevel(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  >
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="normal">🔵 Normal</option>
                    <option value="low">⚪ Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Estimate
                  </label>
                  <input
                    type="text"
                    value={newPriorityEstimate}
                    onChange={e => setNewPriorityEstimate(e.target.value)}
                    placeholder="e.g. 2h, 45m"
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsPriorityModalOpen(false)}
                  style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', backgroundColor: '#7c3aed', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                >
                  Add Priority
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: BOOK 1:1 WITH TEAMMATE                                */}
      {/* ============================================================== */}
      {bookingTeammate && (
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
            width: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid #f1f3f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#2563eb" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1f21' }}>
                  Book 1:1 with {bookingTeammate.name}
                </span>
              </div>
              <button onClick={() => setBookingTeammate(null)} style={{ border: 'none', background: 'none', color: '#5f6368', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleWithTeammate} style={{ padding: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: bookingTeammate.color,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.86rem'
                }}>
                  {bookingTeammate.avatar}
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e1f21' }}>{bookingTeammate.name}</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{bookingTeammate.role} • {bookingTeammate.email}</div>
                </div>
              </div>

              <div style={{ marginBottom: '16px', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                ClickUp will automatically find available sync slots and create a Google Meet video conference link for both of you.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setBookingTeammate(null)}
                  style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', backgroundColor: '#2563eb', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                >
                  Schedule 1:1 Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
