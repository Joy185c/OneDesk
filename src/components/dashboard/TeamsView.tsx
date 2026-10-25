import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
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
  BarChart3,
  TrendingUp,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Edit2,
  CheckCheck,
  Smile,
  HelpCircle,
  Briefcase,
  Lock,
  Globe,
  Flag,
  Share2
} from 'lucide-react';
import { TaskItem } from '../../types';

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
  time: string;
  type: 'create' | 'member' | 'bookmark' | 'priority' | 'standup';
}

export interface TeamPriorityItem {
  id: string;
  memberId: string;
  memberName: string;
  order: number;
  title: string;
  completed: boolean;
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
  onOpenInviteModal?: () => void;
  onOpenUpgradeModal?: () => void;
}

const AVAILABLE_WORKSPACE_MEMBERS: TeamMember[] = [
  {
    id: 'u-joy',
    name: 'Joy Kumar Yuv',
    email: 'joy.kumar.yuv@clickup.com',
    role: 'Owner',
    status: 'Online',
    avatarBg: '#059669',
    initials: 'JY',
    isYou: true
  },
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
];

const DEFAULT_TEAMS: TeamGroup[] = [
  {
    id: 'team-joyt',
    name: 'joyt',
    handle: '@joyt',
    color: '#7c3aed',
    initial: 'J',
    description: 'gfbds',
    createdAt: '2026-10-25T10:28:00Z',
    members: [
      {
        id: 'u-joy',
        name: 'Joy Kumar Yuv',
        email: 'joy.kumar.yuv@clickup.com',
        role: 'Owner',
        status: 'Online',
        avatarBg: '#059669',
        initials: 'JY',
        isYou: true
      }
    ],
    bookmarks: [],
    feed: [
      {
        id: 'f-1',
        actor: 'Joy Kumar Yuv',
        action: 'created team',
        target: 'joyt',
        time: 'Today at 10:28 AM',
        type: 'create'
      },
      {
        id: 'f-2',
        actor: 'Joy',
        action: 'has been added to joyt',
        time: 'Today at 10:31 AM',
        type: 'member'
      }
    ],
    priorities: [],
    standups: [
      {
        id: 'su-1',
        author: 'Joy Kumar Yuv',
        authorInitials: 'JY',
        avatarBg: '#059669',
        date: 'Oct 25, 2026',
        yesterday: 'Finalized ClickUp 3.0 Super Agents & Artifacts UI integration',
        today: 'Building Teams Hub, Member Management & Pulse Analytics',
        blockers: 'None'
      }
    ]
  }
];

const COLOR_PALETTE = ['#7c3aed', '#2563eb', '#059669', '#db2777', '#ea580c', '#0891b2', '#4f46e5'];

export const TeamsView: React.FC<TeamsViewProps> = ({ 
  tasks = [], 
  onOpenInviteModal, 
  onOpenUpgradeModal 
}) => {
  // Persistence state
  const [teams, setTeams] = useState<TeamGroup[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_teams_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TEAMS;
  });

  const [activeTeamId, setActiveTeamId] = useState<string | null>(() => {
    const savedId = localStorage.getItem('clickup_active_team_id');
    return savedId !== null ? savedId : 'team-joyt';
  });

  const [activeSubtab, setActiveSubtab] = useState<
    'overview' | 'analytics' | 'priorities' | 'team' | 'team_chart' | 'standup' | 'workload' | 'timesheet'
  >('overview');

  // Carousel in Teams Hub
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Modals
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false);
  const [isBrowsePeopleOpen, setIsBrowsePeopleOpen] = useState(false);

  // Form states for Create Team
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('#7c3aed');

  // Form states for Add Member
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(['u-joy']);

  // Form state for Bookmark
  const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
  const [newBookmarkUrl, setNewBookmarkUrl] = useState('');

  // Form state for Standup
  const [standupYesterday, setStandupYesterday] = useState('');
  const [standupToday, setStandupToday] = useState('');
  const [standupBlockers, setStandupBlockers] = useState('');
  const [isStandupFormOpen, setIsStandupFormOpen] = useState(false);

  // Priority Form
  const [newPriorityTitle, setNewPriorityTitle] = useState('');

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>('Joy has been added to joyt');
  useEffect(() => {
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clickup_teams_v2', JSON.stringify(teams));
      if (activeTeamId) {
        localStorage.setItem('clickup_active_team_id', activeTeamId);
      } else {
        localStorage.removeItem('clickup_active_team_id');
      }
    } catch (e) {
      console.error(e);
    }
  }, [teams, activeTeamId]);

  const activeTeam = teams.find(t => t.id === activeTeamId);

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
      members: [AVAILABLE_WORKSPACE_MEMBERS[0]], // Creator Joy Kumar Yuv
      bookmarks: [],
      feed: [
        {
          id: 'f-' + Date.now(),
          actor: 'Joy Kumar Yuv',
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
    
    // Automatically open Add Members modal matching Screenshot 3!
    setSelectedMemberIds(['u-joy']);
    setIsAddMemberOpen(true);
  };

  // Handle Add Member Submit
  const handleAddMemberSubmit = () => {
    if (!activeTeam) return;

    const membersToAdd = AVAILABLE_WORKSPACE_MEMBERS.filter(m => selectedMemberIds.includes(m.id));
    
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
    showToast(`Joy has been added to ${activeTeam.name}`);
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
      actor: 'Joy Kumar Yuv',
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

  // Handle Update Team Description Inline
  const handleUpdateDescription = (desc: string) => {
    if (!activeTeam) return;
    setTeams(teams.map(t => t.id === activeTeam.id ? { ...t, description: desc } : t));
  };

  // Handle Add Priority
  const handleAddPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam || !newPriorityTitle.trim()) return;

    const newPriority: TeamPriorityItem = {
      id: 'p-' + Date.now(),
      memberId: 'u-joy',
      memberName: 'Joy Kumar Yuv',
      order: activeTeam.priorities.length + 1,
      title: newPriorityTitle.trim(),
      completed: false
    };

    setTeams(teams.map(t => {
      if (t.id === activeTeam.id) {
        return {
          ...t,
          priorities: [...t.priorities, newPriority]
        };
      }
      return t;
    }));

    setNewPriorityTitle('');
    showToast('Team priority added');
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

  // Handle Post Standup
  const handlePostStandup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam || !standupToday.trim()) return;

    const entry: TeamStandupEntry = {
      id: 'su-' + Date.now(),
      author: 'Joy Kumar Yuv',
      authorInitials: 'JY',
      avatarBg: '#059669',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      yesterday: standupYesterday.trim() || 'Working on assigned items',
      today: standupToday.trim(),
      blockers: standupBlockers.trim() || 'None'
    };

    setTeams(teams.map(t => {
      if (t.id === activeTeam.id) {
        return {
          ...t,
          standups: [entry, ...t.standups]
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

  // Percentage of members with priorities set
  const membersWithPrioritiesCount = activeTeam 
    ? activeTeam.members.filter(m => activeTeam.priorities.some(p => p.memberId === m.id)).length 
    : 0;
  const prioritiesPercentage = activeTeam && activeTeam.members.length > 0 
    ? Math.round((membersWithPrioritiesCount / activeTeam.members.length) * 100) 
    : 0;

  // --------------------------------------------------------------------------
  // RENDER: TEAMS HUB (When activeTeamId is null or user clicked All Teams)
  // --------------------------------------------------------------------------
  if (!activeTeamId || !activeTeam) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        backgroundColor: '#ffffff',
        overflowY: 'auto'
      }}>
        {/* Main Hero Container matching Screenshot 1 */}
        <div style={{
          padding: '40px 48px',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(360px, 460px) 1fr',
            gap: '48px',
            alignItems: 'center',
            marginBottom: '48px'
          }}>
            {/* Left Headline & Action Buttons */}
            <div>
              <h1 style={{
                fontSize: '2.8rem',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                margin: '0 0 20px 0'
              }}>
                Align teams<br />and visualize<br />their work!
              </h1>
              <p style={{
                fontSize: '1rem',
                color: '#475569',
                lineHeight: 1.6,
                margin: '0 0 28px 0',
                maxWidth: '400px'
              }}>
                Use Teams Hub to coordinate teams, organize priorities, and understand the details of their work.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setIsCreateTeamOpen(true)}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 22px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e293b'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0f172a'}
                >
                  Create Team
                </button>

                <button
                  onClick={() => setIsBrowsePeopleOpen(true)}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  Browse People
                </button>
              </div>
            </div>

            {/* Right Interactive Carousel matching Screenshot 1 */}
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                gap: '20px',
                overflow: 'hidden',
                padding: '10px 0'
              }}>
                {/* Carousel Card 1: Team Hub Preview */}
                {carouselIndex === 0 && (
                  <div style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #eaebf0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          J
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>joyt</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>@joyt • 1 member</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', backgroundColor: '#f0fdf4', color: '#16a34a', fontWeight: 700, padding: '3px 8px', borderRadius: '100px' }}>
                        Active Pulse
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#059669', color: '#fff', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        JY
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>Joy Kumar Yuv (You)</span>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>• Online</span>
                    </div>

                    <div style={{ height: '60px', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                      {[4, 2, 7, 3, 10, 5, 8, 12, 6, 9, 4, 8, 14, 5, 8].map((h, i) => (
                        <div key={i} style={{ flex: 1, height: `${h * 4}px`, backgroundColor: i === 12 ? '#7c3aed' : '#cbd5e1', borderRadius: '3px' }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Carousel Card 2: Member & team management (Screenshot 1 & 2) */}
                {carouselIndex === 1 && (
                  <div style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #eaebf0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <div>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        Member &amp; team management
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                        Easily browse, find, and manage all teams and members in one convenient area. Add, remove, or update roles with ease.
                      </p>
                    </div>

                    {/* Member Cards Preview Matching Screenshot 1 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {/* Priya Gupta */}
                      <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#10b981', color: '#fff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                            PG
                          </div>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Priya Gupta</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>UI designer</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', color: '#475569' }}>
                          <div>1 ⚪ 4.0 design</div>
                          <div>2 ⚪ Todo page</div>
                          <div>3 ⚪ Chat : Next gen view ch...</div>
                          <div>4 ⚪ AI creation modal</div>
                          <div>5 ⚪ Update WS picker</div>
                        </div>
                      </div>

                      {/* Sarah Chang */}
                      <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#8b5cf6', color: '#fff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                            SC
                          </div>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Sarah Chang</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Software Engineer</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', color: '#475569' }}>
                          <div>1 ⚪ DevForge 3.0</div>
                          <div>2 ⚪ TaskFlow Centr...</div>
                          <div>3 ⚪ ChatSphere: Fu...</div>
                          <div>4 ⚪ Innovate Studio...</div>
                          <div>5 ⚪ Project Revive</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Carousel Card 3: Stay focused with Priorities */}
                {carouselIndex === 2 && (
                  <div style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #eaebf0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <div>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        Stay focused with Priorities
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                        Instantly know what each team is working on now and what's on their agenda. Keep everyone aligned on key milestones.
                      </p>
                    </div>

                    <div style={{
                      backgroundColor: '#fff1f2',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '0.78rem',
                      color: '#be123c',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>🙃</span>
                      <span>Track top priorities across sprints and daily standups.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Carousel Pagination Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '12px' }}>
                <button
                  onClick={() => setCarouselIndex((carouselIndex + 2) % 3)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[0, 1, 2].map(idx => (
                    <div
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: carouselIndex === idx ? '#0f172a' : '#cbd5e1',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCarouselIndex((carouselIndex + 1) % 3)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Your Workspace Teams */}
          <div style={{ borderTop: '1px solid #eaebf0', paddingTop: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Workspace Teams ({teams.length})
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
                  Click a team to manage members, priorities, analytics, and standups.
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
                  fontSize: '0.8rem',
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {teams.map(team => (
                <div
                  key={team.id}
                  onClick={() => {
                    setActiveTeamId(team.id);
                    setActiveSubtab('overview');
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = team.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#eaebf0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: team.color,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1rem'
                      }}>
                        {team.initial}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a' }}>{team.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{team.handle}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                      {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>

                  {team.description && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#475569',
                      backgroundColor: '#f8fafc',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      marginBottom: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {team.description}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {team.members.slice(0, 3).map(m => (
                        <div
                          key={m.id}
                          title={m.name}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: m.avatarBg,
                            color: '#ffffff',
                            fontSize: '0.66rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800
                          }}
                        >
                          {m.initials}
                        </div>
                      ))}
                    </div>

                    <span style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 700 }}>
                      Open Overview →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal: Create Team (Screenshot 2) */}
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
              width: '520px',
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
                  {/* Icon & name section matching Screenshot 2 */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Icon &amp; name
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Team Avatar initial with color picker toggle */}
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
                        {newTeamName.trim().charAt(0).toUpperCase() || 'M'}
                      </div>
                      <input
                        type="text"
                        placeholder="Team name..."
                        value={newTeamName}
                        onChange={e => setNewTeamName(e.target.value)}
                        autoFocus
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
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', marginLeft: '46px' }}>
                      {COLOR_PALETTE.map(c => (
                        <div
                          key={c}
                          onClick={() => setNewTeamColor(c)}
                          style={{
                            width: '16px',
                            height: '16px',
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

                  {/* Description (optional) section matching Screenshot 2 */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Description (optional)
                    </label>
                    <textarea
                      placeholder="Add Team description, information, and wiki"
                      value={newTeamDescription}
                      onChange={e => setNewTeamDescription(e.target.value)}
                      rows={4}
                      style={{
                        width: '100%',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '0.84rem',
                        outline: 'none',
                        color: '#0f172a',
                        resize: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="submit"
                      disabled={!newTeamName.trim()}
                      style={{
                        backgroundColor: newTeamName.trim() ? '#0f172a' : '#94a3b8',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '9px 20px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: newTeamName.trim() ? 'pointer' : 'not-allowed',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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

        {/* Modal: Browse People */}
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
              width: '460px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Workspace People Directory</h3>
                <button onClick={() => setIsBrowsePeopleOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                {AVAILABLE_WORKSPACE_MEMBERS.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: m.avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                        {m.initials}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{m.name} {m.isYou && <span style={{ color: '#059669', fontSize: '0.72rem' }}>(You)</span>}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{m.email}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: ACTIVE TEAM VIEW (Matches Screenshots 3, 4, 5)
  // --------------------------------------------------------------------------
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
      backgroundColor: '#ffffff',
      overflow: 'hidden'
    }}>
      {/* Toast alert matching Screenshot 4: "🟢 Joy has been added to joyt" */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '70px',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '0.82rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid #e2e8f0',
          zIndex: 3000
        }}>
          <CheckCircle2 size={16} color="#16a34a" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Team Top Header matching Screenshots 3, 4, 5 */}
      <div style={{
        padding: '14px 28px',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Back to all teams button */}
          <button
            onClick={() => setActiveTeamId(null)}
            title="Back to Teams Hub"
            style={{
              background: 'none',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              color: '#64748b',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={14} /> Teams
          </button>

          {/* Team Initial Icon Circle */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: activeTeam.color,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem'
          }}>
            {activeTeam.initial}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {activeTeam.name}
            </h2>
            <span style={{
              backgroundColor: '#f1f5f9',
              color: '#475569',
              fontSize: '0.76rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {activeTeam.handle}
            </span>
          </div>
        </div>

        {/* Right side: Add member button matching Screenshot 3 & 4 */}
        <button
          onClick={() => {
            setSelectedMemberIds(activeTeam.members.map(m => m.id));
            setIsAddMemberOpen(true);
          }}
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <span>Add member</span>
        </button>
      </div>

      {/* Subtab Navigation Bar matching Screenshot 4 & 5 */}
      <div style={{
        padding: '0 28px',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        fontSize: '0.82rem',
        fontWeight: 700,
        backgroundColor: '#ffffff'
      }}>
        {[
          { key: 'overview', label: 'Overview', icon: 'ℹ️' },
          { key: 'analytics', label: 'Analytics', icon: '📊' },
          { key: 'priorities', label: 'Priorities', icon: '🎯' },
          { key: 'team', label: 'Team', icon: '👥' },
          { key: 'team_chart', label: 'Team Chart', icon: '📈' },
          { key: 'standup', label: 'StandUp', icon: '🗣️' },
          { key: 'workload', label: 'Workload', icon: '📊' },
          { key: 'timesheet', label: 'Timesheet', icon: '⏱️' }
        ].map(tab => (
          <div
            key={tab.key}
            onClick={() => setActiveSubtab(tab.key as any)}
            style={{
              padding: '12px 0',
              cursor: 'pointer',
              color: activeSubtab === tab.key ? '#0f172a' : '#64748b',
              borderBottom: activeSubtab === tab.key ? '2px solid #0f172a' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </div>
        ))}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* SUBTAB 1: OVERVIEW (Screenshot 4)                                     */}
      {/* -------------------------------------------------------------------- */}
      {activeSubtab === 'overview' && (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '24px'
        }}>
          {/* Left Column (Main) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Description Box (e.g. "gfbds" from Screenshot 4) */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #eaebf0',
              borderRadius: '12px',
              padding: '18px 20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Team Wiki &amp; Description
                </span>
                <span style={{ fontSize: '0.72rem', color: '#7c3aed', cursor: 'pointer', fontWeight: 600 }}>
                  Click to edit
                </span>
              </div>
              <input
                type="text"
                value={activeTeam.description}
                onChange={e => handleUpdateDescription(e.target.value)}
                placeholder="Add team wiki, goals, or notes here..."
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.92rem',
                  color: '#0f172a',
                  fontWeight: 500,
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            {/* Bookmarks Section matching Screenshot 4 */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #eaebf0',
              borderRadius: '12px',
              padding: '20px',
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Bookmarks</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setIsAddBookmarkOpen(true)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.76rem',
                      fontWeight: 700
                    }}
                  >
                    <Plus size={14} />
                  </button>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Public ▾</span>
                </div>
              </div>

              {activeTeam.bookmarks.length === 0 ? (
                /* Empty state matching Screenshot 4 */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 0' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    marginBottom: '12px'
                  }}>
                    <Bookmark size={18} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px', maxWidth: '300px' }}>
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
                      <button
                        onClick={() => handleRemoveBookmark(bm.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feed Section matching Screenshot 4 */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #eaebf0',
              borderRadius: '12px',
              padding: '20px',
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Feed</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                  <span style={{ cursor: 'pointer' }}>Filter by type ▾</span>
                  <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Subtasks: Shown ✕
                  </span>
                </div>
              </div>

              {activeTeam.feed.length === 0 ? (
                /* Empty state matching Screenshot 4 */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px 0' }}>
                  <div style={{ width: '48px', height: '36px', opacity: 0.5, marginBottom: '12px' }}>
                    <div style={{ height: '8px', backgroundColor: '#cbd5e1', borderRadius: '4px', marginBottom: '6px' }} />
                    <div style={{ height: '8px', backgroundColor: '#cbd5e1', borderRadius: '4px', width: '70%', marginBottom: '6px' }} />
                    <div style={{ height: '8px', backgroundColor: '#cbd5e1', borderRadius: '4px', width: '50%' }} />
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    No matching activity
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Try adjusting your filters or search to see more activity.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeTeam.feed.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: item.type === 'member' ? '#16a34a' : item.type === 'create' ? '#7c3aed' : '#2563eb'
                        }} />
                        <div>
                          <strong>{item.actor}</strong> {item.action} {item.target && <strong>{item.target}</strong>}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Sidebar) matching Screenshot 4 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Members Section matching Screenshot 4 */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #eaebf0',
              borderRadius: '12px',
              padding: '18px 20px'
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
                  onClick={() => setIsAddMemberOpen(true)}
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

              {/* 0% of people have Priorities set warning badge matching Screenshot 4 */}
              <div
                onClick={() => setActiveSubtab('priorities')}
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

            {/* Time off Section matching Screenshot 4 */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #eaebf0',
              borderRadius: '12px',
              padding: '18px 20px'
            }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Time off
              </div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                Business Plus
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '14px' }}>
                Try FREE for 15 days<br />No credit card required!
              </div>

              <button
                onClick={onOpenUpgradeModal}
                style={{
                  width: '100%',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
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

            {/* Team Analytics Section matching Screenshot 4 */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #eaebf0',
              borderRadius: '12px',
              padding: '18px 20px'
            }}>
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
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SUBTAB 2: ANALYTICS (Screenshot 5)                                    */}
      {/* -------------------------------------------------------------------- */}
      {activeSubtab === 'analytics' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          {/* Date Selector Header matching Screenshot 5 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <button style={{ width: '26px', height: '26px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={14} color="#64748b" />
            </button>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <span>Oct 25</span>
              <ChevronRight size={12} style={{ transform: 'rotate(90deg)' }} />
            </div>
            <button style={{ width: '26px', height: '26px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={14} color="#64748b" />
            </button>
          </div>

          {/* Top Activity Timeline Bar Chart matching Screenshot 5 */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eaebf0',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '24px'
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
                { label: '9am', val: 100 }, // Purple bar matching Screenshot 5!
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
                    <div style={{
                      width: '18px',
                      height: '90px',
                      backgroundColor: '#7c3aed',
                      borderRadius: '4px 4px 0 0',
                      marginBottom: '4px'
                    }} />
                  )}
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{hour.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Member Pulse List matching Screenshot 5 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', padding: '4px 8px', borderRadius: '6px', backgroundColor: '#f1f5f9' }}>
                1 Online
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', padding: '4px 8px' }}>
                0 Offline
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#64748b' }}>
              <span style={{ cursor: 'pointer' }}>Sort ▾</span>
              <span style={{ cursor: 'pointer' }}>Item type ▾</span>
            </div>
          </div>

          {/* Active User Card matching Screenshot 5 */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eaebf0',
            borderRadius: '12px',
            padding: '16px 20px',
            maxWidth: '380px'
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
                  JY
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
              <span style={{ color: '#cbd5e1' }}>---</span>
            </div>

            <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              Nothing to see here
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SUBTAB 3: PRIORITIES                                                  */}
      {/* -------------------------------------------------------------------- */}
      {activeSubtab === 'priorities' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Team Priorities
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Define and track top focus areas for team members to keep everyone aligned.
                </p>
              </div>
            </div>

            {/* Add priority input */}
            <form onSubmit={handleAddPriority} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <input
                type="text"
                placeholder="Add a new team focus or priority (e.g., Deliver Sprint 12 deliverables)..."
                value={newPriorityTitle}
                onChange={e => setNewPriorityTitle(e.target.value)}
                style={{
                  flex: 1,
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '0.84rem',
                  outline: 'none',
                  color: '#0f172a'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Add Priority
              </button>
            </form>

            {/* List of priorities */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeTeam.priorities.length === 0 ? (
                <div style={{
                  padding: '36px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎯</div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>No priorities set yet</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                    Setting team priorities helps track velocity and clears ambiguity for everyone.
                  </div>
                </div>
              ) : (
                activeTeam.priorities.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #eaebf0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleTogglePriority(item.id)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#7c3aed' }}
                      />
                      <span style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: item.completed ? '#94a3b8' : '#0f172a',
                        textDecoration: item.completed ? 'line-through' : 'none'
                      }}>
                        {idx + 1}. {item.title}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.74rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '4px' }}>
                      {item.memberName}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SUBTAB 4: TEAM DIRECTORY                                              */}
      {/* -------------------------------------------------------------------- */}
      {activeSubtab === 'team' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Team Members ({activeTeam.members.length})
            </h3>
            <button
              onClick={() => setIsAddMemberOpen(true)}
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <UserPlus size={14} /> Add Member
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #eaebf0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Member</th>
                <th style={{ padding: '10px 14px' }}>Role</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px' }}>Team Handle</th>
              </tr>
            </thead>
            <tbody>
              {activeTeam.members.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: m.avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.76rem' }}>
                        {m.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>
                          {m.name} {m.isYou && <span style={{ color: '#059669', fontSize: '0.72rem' }}>(You)</span>}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                    {m.role}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#16a34a' }}>
                      ● {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#64748b' }}>
                    {activeTeam.handle}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SUBTAB 5: STANDUP                                                     */}
      {/* -------------------------------------------------------------------- */}
      {activeSubtab === 'standup' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Daily StandUp
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Asynchronous daily updates from team members to avoid long meetings.
                </p>
              </div>

              <button
                onClick={() => setIsStandupFormOpen(!isStandupFormOpen)}
                style={{
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 16px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {isStandupFormOpen ? 'Close Form' : '+ Post Today\'s Standup'}
              </button>
            </div>

            {/* Standup Form */}
            {isStandupFormOpen && (
              <form onSubmit={handlePostStandup} style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    What did you accomplish yesterday?
                  </label>
                  <input
                    type="text"
                    value={standupYesterday}
                    onChange={e => setStandupYesterday(e.target.value)}
                    placeholder="Completed user authentication, merged PR #14..."
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    What will you work on today?
                  </label>
                  <input
                    type="text"
                    value={standupToday}
                    onChange={e => setStandupToday(e.target.value)}
                    required
                    placeholder="Building ClickUp 3.0 Teams Hub, Standups, and Analytics..."
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Any blockers or questions?
                  </label>
                  <input
                    type="text"
                    value={standupBlockers}
                    onChange={e => setStandupBlockers(e.target.value)}
                    placeholder="None"
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 18px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Submit Standup
                  </button>
                </div>
              </form>
            )}

            {/* Standup Entries Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeTeam.standups.map(entry => (
                <div
                  key={entry.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: entry.avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.76rem' }}>
                        {entry.authorInitials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{entry.author}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{entry.date}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '4px' }}>
                      Submitted
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>Yesterday: </span>
                      <span style={{ color: '#1e293b' }}>{entry.yesterday}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>Today: </span>
                      <span style={{ color: '#1e293b' }}>{entry.today}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: '#64748b' }}>Blockers: </span>
                      <span style={{ color: entry.blockers.toLowerCase() === 'none' ? '#16a34a' : '#ef4444', fontWeight: 600 }}>{entry.blockers}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* OTHER SUBTABS (Team Chart, Workload, Timesheet)                       */}
      {/* -------------------------------------------------------------------- */}
      {(activeSubtab === 'team_chart' || activeSubtab === 'workload' || activeSubtab === 'timesheet') && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eaebf0',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '640px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              {activeSubtab === 'team_chart' ? 'Team Organization Chart' : activeSubtab === 'workload' ? 'Team Workload & Capacity' : 'Team Timesheet Logs'}
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: '#64748b' }}>
              All team member data is connected to live ClickUp 3.0 tasks and schedules.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeTeam.members.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: m.avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.76rem' }}>
                      {m.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>{m.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{m.role} • 40h/week capacity</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed' }}>
                    {tasks.length} active tasks
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* MODAL: ADD MEMBERS TO TEAM (Screenshot 3)                             */}
      {/* -------------------------------------------------------------------- */}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Add members to {activeTeam.name}
                </h3>
                <button
                  onClick={() => setIsAddMemberOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Members selector matching Screenshot 3 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '260px',
                overflowY: 'auto',
                marginBottom: '24px'
              }}>
                {AVAILABLE_WORKSPACE_MEMBERS.map(m => {
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
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#f5f3ff' : '#f8fafc',
                        border: isSelected ? '1px solid #c4b5fd' : '1px solid #f1f5f9',
                        cursor: 'pointer'
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
                          fontSize: '0.76rem'
                        }}>
                          {m.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                            {m.name} {m.isYou && <span style={{ color: '#059669', fontSize: '0.72rem' }}>(You)</span>}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{m.email}</div>
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
                        color: '#fff'
                      }}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons matching Screenshot 3 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.84rem',
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Skip for now
                </button>

                <button
                  type="button"
                  onClick={handleAddMemberSubmit}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  Add {selectedMemberIds.length} {selectedMemberIds.length === 1 ? 'member' : 'members'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* MODAL: ADD BOOKMARK                                                  */}
      {/* -------------------------------------------------------------------- */}
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
            width: '440px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Add Team Bookmark</h3>
              <button onClick={() => setIsAddBookmarkOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddBookmarkSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Team Figma Specs, Product Roadmap"
                  value={newBookmarkTitle}
                  onChange={e => setNewBookmarkTitle(e.target.value)}
                  required
                  autoFocus
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '0.84rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newBookmarkUrl}
                  onChange={e => setNewBookmarkUrl(e.target.value)}
                  required
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '0.84rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddBookmarkOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
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
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Bookmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
