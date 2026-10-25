import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Sparkles,
  User,
  Paperclip,
  Smile,
  Mic,
  Bold,
  Italic,
  Code,
  List,
  MoreHorizontal,
  CheckCircle2,
  Bot,
  Hash,
  AtSign,
  Star,
  Calendar as CalendarIcon,
  CheckSquare,
  Folder,
  Camera,
  Grid,
  Radio,
  Share2,
  Bookmark,
  Pin,
  CornerUpLeft,
  UserCheck,
  X,
  ExternalLink,
  ChevronRight,
  Eye,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface ChatMessage {
  id: string;
  sender: string;
  senderInitials: string;
  isAi?: boolean;
  avatarBg?: string;
  text: string;
  timestamp: string;
}

export const ChatLaunchpadView: React.FC<{
  onOpenChannel?: (channel: string) => void;
  onOpenDm?: (user: string) => void;
}> = ({ onOpenChannel, onOpenDm }) => {
  const { user } = useAuth();
  const currentUserName = user?.name || 'Workspace Member';
  const userInitials = user?.name 
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() 
    : 'ME';

  const [selectedRecipient, setSelectedRecipient] = useState<string>(`${currentUserName} (You)`);
  const [activePersonalTab, setActivePersonalTab] = useState<'chat' | 'calendar' | 'tasks'>('chat');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [composerText, setComposerText] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeSideTool, setActiveSideTool] = useState<'search' | 'replies' | 'pinned' | 'assigned' | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(['Sprint 42 Goals', 'Q4 Roadmap Wiki', 'CRM Leads']);
  const [newBookmarkInput, setNewBookmarkInput] = useState('');
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Personal tasks
  const [personalTasks, setPersonalTasks] = useState([
    { id: 'pt-1', title: 'Review Q4 Cloud Migration Proposal', completed: false, due: 'Today', priority: 'Urgent' },
    { id: 'pt-2', title: 'Sync with Meeting Agent on StandUp action items', completed: true, due: 'Yesterday', priority: 'High' },
    { id: 'pt-3', title: 'Schedule Technical Scoping Call with Client', completed: false, due: 'Tomorrow', priority: 'Normal' }
  ]);
  const [newPersonalTaskTitle, setNewPersonalTaskTitle] = useState('');

  // Calendar events
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 'ev-1', title: 'Team Daily StandUp', time: '10:00 AM - 10:30 AM', type: 'Sprint' },
    { id: 'ev-2', title: 'Sales CRM Architecture Review', time: '02:00 PM - 03:00 PM', type: 'Review' },
    { id: 'ev-3', title: 'Meeting Agent Briefing', time: '04:30 PM - 05:00 PM', type: 'AI Sync' }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_chat_launchpad_messages_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg-init',
        sender: 'Meeting Agent',
        senderInitials: 'MA',
        isAi: true,
        avatarBg: '#ec4899',
        text: `👋 Hi ${currentUserName.split(' ')[0]}! I have prepared the summary and action items from today's Sprint Planning. All tasks have been synchronized with Sales CRM.`,
        timestamp: '10:30 AM'
      }
    ];
  });

  const [personalNotes, setPersonalNotes] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_personal_space_notes_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('clickup_chat_launchpad_messages_v2', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('clickup_personal_space_notes_v1', JSON.stringify(personalNotes));
    } catch {}
  }, [personalNotes]);

  const isPersonalSpace = selectedRecipient.includes('(You)') || selectedRecipient === currentUserName;

  const handleSendMessage = () => {
    if (!composerText.trim()) return;
    const sentText = composerText.trim();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: `${currentUserName} (You)`,
      senderInitials: userInitials,
      text: sentText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    if (isPersonalSpace) {
      setPersonalNotes(prev => [...prev, newMsg]);
      setComposerText('');
      showToast('Note saved to your personal space');
    } else {
      setMessages(prev => [...prev, newMsg]);
      setComposerText('');

      // Auto-reply simulation for AI recipients
      if (selectedRecipient.includes('Meeting') || selectedRecipient.includes('Brain')) {
        setTimeout(() => {
          const aiReply: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: selectedRecipient.includes('Meeting') ? 'Meeting Agent' : 'ClickUp Brain',
            senderInitials: selectedRecipient.includes('Meeting') ? 'MA' : 'CB',
            isAi: true,
            avatarBg: selectedRecipient.includes('Meeting') ? '#ec4899' : '#7c3aed',
            text: `Got it! ClickUp Brain processed: "${sentText}". I have updated your workspace context and synchronized with the team pipeline.`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, aiReply]);
        }, 800);
      }
    }
  };

  const recipients = [
    { id: 'me', name: `${currentUserName} (You)`, subtitle: 'Personal Scratchpad & Notes', initials: userInitials, bg: '#0f172a' },
    { id: 'ma', name: 'Meeting Agent', subtitle: 'Autonomous AI Notetaker (1 unread)', initials: 'MA', bg: '#ec4899', isAi: true, badge: '1' },
    { id: 'cb', name: 'ClickUp Brain', subtitle: 'AI Super Assistant across all apps', initials: 'CB', bg: '#7c3aed', isAi: true },
    { id: 'sm', name: 'Sarah Miller', subtitle: 'Product Manager • Online', initials: 'SM', bg: '#3b82f6' },
    { id: 'am', name: 'Alex Morgan', subtitle: 'Lead Engineer • In a meeting', initials: 'AM', bg: '#10b981' },
    { id: 'ed', name: 'Emma Davis', subtitle: 'Sales CRM Specialist • Online', initials: 'ED', bg: '#f59e0b' }
  ];

  const filteredRecipients = recipients.filter(r =>
    r.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    r.subtitle.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      {/* 1. Left Chat Sub-Sidebar (Screenshot 1 / Screenshot 3 1:1) */}
      <aside style={{
        width: '240px',
        backgroundColor: '#fafbfc',
        borderRight: '1px solid #eaebf0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 12px',
        flexShrink: 0
      }}>
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageSquare size={14} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a' }}>Chat</span>
            </div>

            <button
              onClick={() => showToast('New Chat thread started')}
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

          {/* Search Contacts / Channels */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '6px 10px',
            marginBottom: '16px'
          }}>
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search chat or people..."
              value={recipientSearch}
              onChange={e => setRecipientSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '0.8rem',
                color: '#0f172a',
                width: '100%',
                backgroundColor: 'transparent'
              }}
            />
          </div>

          {/* Section: Agents (Screenshot 1) */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                Agents
              </span>
              <button
                onClick={() => showToast('Create new Super Agent')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
              >
                <Plus size={12} />
              </button>
            </div>

            <div
              onClick={() => setSelectedRecipient('Meeting Agent')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedRecipient === 'Meeting Agent' ? '#fdf2f8' : 'transparent',
                color: selectedRecipient === 'Meeting Agent' ? '#db2777' : '#334155'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={15} color="#db2777" />
                <span style={{ fontSize: '0.8rem', fontWeight: selectedRecipient === 'Meeting Agent' ? 700 : 500 }}>
                  Meeting Agent
                </span>
              </div>
              <span style={{
                backgroundColor: '#ec4899',
                color: '#ffffff',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '0.64rem',
                fontWeight: 800
              }}>
                1
              </span>
            </div>

            <div
              onClick={() => setSelectedRecipient('ClickUp Brain')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedRecipient === 'ClickUp Brain' ? '#f5f3ff' : 'transparent',
                color: selectedRecipient === 'ClickUp Brain' ? '#7c3aed' : '#334155',
                marginTop: '2px'
              }}
            >
              <Bot size={14} color="#7c3aed" />
              <span style={{ fontSize: '0.8rem', fontWeight: selectedRecipient === 'ClickUp Brain' ? 700 : 500 }}>
                Brain
              </span>
            </div>
          </div>

          {/* Section: Channels */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', padding: '0 4px', display: 'block', marginBottom: '6px' }}>
              Channels
            </span>
            {['general', 'sales-crm', 'announcements'].map(ch => (
              <div
                key={ch}
                onClick={() => {
                  if (onOpenChannel) onOpenChannel(ch);
                  showToast(`Opened #${ch} channel`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#475569',
                  fontSize: '0.8rem'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Hash size={13} color="#94a3b8" />
                <span>{ch}</span>
              </div>
            ))}
          </div>

          {/* Section: Direct Messages (Screenshot 1) */}
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', padding: '0 4px', display: 'block', marginBottom: '6px' }}>
              Direct Messages
            </span>
            {recipients.map(r => (
              <div
                key={r.id}
                onClick={() => setSelectedRecipient(r.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: selectedRecipient === r.name ? '#e2e8f0' : 'transparent',
                  color: selectedRecipient === r.name ? '#0f172a' : '#475569',
                  fontWeight: selectedRecipient === r.name ? 700 : 500,
                  fontSize: '0.8rem',
                  marginTop: '1px'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: r.bg,
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {r.initials}
                </div>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', padding: '0 4px' }}>
          Real-time encrypted workspace messaging
        </div>
      </aside>

      {/* 2. Main Center Area: Personal Space (Screenshot 1 1:1) or Team Stream */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflow: 'hidden', position: 'relative' }}>
        
        {/* Top Header (Screenshot 1 1:1) */}
        <div style={{
          padding: '12px 24px',
          borderBottom: '1px solid #eaebf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          {/* Left: User Avatar & Name & Subtabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {userInitials}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                  {isPersonalSpace ? currentUserName : selectedRecipient}
                </span>
                <button
                  onClick={() => showToast('Conversation options')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                >
                  <MoreHorizontal size={15} />
                </button>
                <button
                  onClick={() => showToast('Added to Favorites ⭐')}
                  style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', padding: '2px' }}
                >
                  <Star size={15} fill="#f59e0b" />
                </button>
              </div>
            </div>

            {/* Subtabs: Chat, Calendar, Tasks, + View (Screenshot 1) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '12px' }}>
              {[
                { key: 'chat', label: 'Chat' },
                { key: 'calendar', label: 'Calendar' },
                { key: 'tasks', label: 'Tasks' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActivePersonalTab(tab.key as any)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activePersonalTab === tab.key ? '2px solid #0f172a' : '2px solid transparent',
                    padding: '6px 2px',
                    fontSize: '0.84rem',
                    fontWeight: activePersonalTab === tab.key ? 700 : 500,
                    color: activePersonalTab === tab.key ? '#0f172a' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={() => showToast('Add Custom View (Doc, Table, Whiteboard)')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                + View
              </button>
            </div>
          </div>

          {/* Right Header Controls: Brain² + Show profile button (Screenshot 1) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => showToast('ClickUp Brain² AI Workspace search')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: '#7c3aed',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={14} color="#7c3aed" />
              <span>Brain²</span>
            </button>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
            >
              <Eye size={13} />
              <span>Show profile</span>
            </button>
          </div>
        </div>

        {/* Bookmarks bar (Screenshot 1: "Add bookmarks, notes, and more") */}
        <div style={{
          padding: '6px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#fafbfc',
          fontSize: '0.78rem'
        }}>
          {bookmarks.map((bm, idx) => (
            <div
              key={idx}
              onClick={() => showToast(`Opened bookmark: ${bm}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '3px 8px',
                color: '#475569',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Bookmark size={11} color="#7c3aed" />
              <span>{bm}</span>
            </div>
          ))}

          {isAddingBookmark ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="text"
                placeholder="Bookmark title..."
                value={newBookmarkInput}
                onChange={e => setNewBookmarkInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newBookmarkInput.trim()) {
                    setBookmarks(b => [...b, newBookmarkInput.trim()]);
                    setNewBookmarkInput('');
                    setIsAddingBookmark(false);
                    showToast('Bookmark added');
                  }
                }}
                style={{
                  border: '1px solid #7c3aed',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '0.76rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => {
                  if (newBookmarkInput.trim()) setBookmarks(b => [...b, newBookmarkInput.trim()]);
                  setNewBookmarkInput('');
                  setIsAddingBookmark(false);
                }}
                style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.72rem', cursor: 'pointer' }}
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingBookmark(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.78rem'
              }}
            >
              Add bookmarks, notes, and more
            </button>
          )}
        </div>

        {/* Content Body: Chat + Right Tools (Screenshot 1 1:1) */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* Main Middle Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '24px', position: 'relative' }}>
            
            {/* 1. CHAT TAB */}
            {activePersonalTab === 'chat' && (
              <>
                {/* Personal Space Empty State Card (Screenshot 1 1:1) */}
                {isPersonalSpace && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: personalNotes.length > 0 ? '12px' : '40px',
                    marginBottom: '32px',
                    textAlign: 'center'
                  }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                      This is your personal space
                    </h2>
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      maxWidth: '480px',
                      lineHeight: 1.5,
                      marginBottom: '20px'
                    }}>
                      It's just you and your brilliant ideas! Draft messages, set reminders, or store ideas and files for easy access later.
                    </p>

                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '8px 20px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        marginBottom: '28px'
                      }}
                    >
                      <Eye size={14} />
                      <span>View Profile</span>
                    </button>

                    {/* View your calendar card (Screenshot 1 1:1) */}
                    <div
                      onClick={() => setActivePersonalTab('calendar')}
                      style={{
                        width: '100%',
                        maxWidth: '440px',
                        backgroundColor: '#fff1f2',
                        border: '1px solid #ffe4e6',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: '0 2px 8px rgba(244,63,94,0.04)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #fecdd3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <CalendarIcon size={20} color="#e11d48" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#9f1239' }}>
                          View your calendar
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#be123c', marginTop: '2px' }}>
                          Create events or manage your schedule
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stream of Personal Notes or Direct Messages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(isPersonalSpace ? personalNotes : messages).map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        maxWidth: '80%',
                        alignSelf: msg.sender.includes('You') ? 'flex-end' : 'flex-start',
                        flexDirection: msg.sender.includes('You') ? 'row-reverse' : 'row'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: msg.avatarBg || '#0f172a',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {msg.senderInitials}
                      </div>

                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                          justifyContent: msg.sender.includes('You') ? 'flex-end' : 'flex-start'
                        }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{msg.sender}</span>
                          {msg.isAi && (
                            <span style={{
                              backgroundColor: '#fdf2f8',
                              color: '#db2777',
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}>
                              AI
                            </span>
                          )}
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{msg.timestamp}</span>
                        </div>

                        <div style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          backgroundColor: msg.sender.includes('You') ? '#0f172a' : '#f8fafc',
                          color: msg.sender.includes('You') ? '#ffffff' : '#1e293b',
                          fontSize: '0.84rem',
                          lineHeight: 1.5,
                          border: msg.sender.includes('You') ? 'none' : '1px solid #eaebf0',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 2. CALENDAR TAB */}
            {activePersonalTab === 'calendar' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Your Schedule &amp; Events
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Synchronized with Google Calendar and Workspace Tasks
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const newTitle = prompt('Enter Event Title:');
                      if (newTitle) {
                        setCalendarEvents(evs => [...evs, { id: `ev-${Date.now()}`, title: newTitle, time: '05:00 PM - 05:30 PM', type: 'Personal' }]);
                        showToast(`Event "${newTitle}" added to schedule`);
                      }
                    }}
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    + Add Event
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {calendarEvents.map(ev => (
                    <div
                      key={ev.id}
                      style={{
                        border: '1px solid #eaebf0',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Clock size={16} color="#7c3aed" />
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{ev.title}</div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{ev.time}</div>
                        </div>
                      </div>
                      <span style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {ev.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TASKS TAB */}
            {activePersonalTab === 'tasks' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      My Assigned Tasks
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Prioritized items assigned to {currentUserName}
                    </span>
                  </div>
                </div>

                {/* Add personal task input */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Add a new task and press Enter..."
                    value={newPersonalTaskTitle}
                    onChange={e => setNewPersonalTaskTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newPersonalTaskTitle.trim()) {
                        setPersonalTasks(ts => [...ts, { id: `pt-${Date.now()}`, title: newPersonalTaskTitle.trim(), completed: false, due: 'Today', priority: 'High' }]);
                        setNewPersonalTaskTitle('');
                        showToast('Personal task created');
                      }
                    }}
                    style={{
                      flex: 1,
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newPersonalTaskTitle.trim()) {
                        setPersonalTasks(ts => [...ts, { id: `pt-${Date.now()}`, title: newPersonalTaskTitle.trim(), completed: false, due: 'Today', priority: 'High' }]);
                        setNewPersonalTaskTitle('');
                        showToast('Personal task created');
                      }
                    }}
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {personalTasks.map(task => (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        border: '1px solid #eaebf0',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            setPersonalTasks(ts => ts.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                            showToast(task.completed ? 'Task reopened' : 'Task completed! 🎉');
                          }}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                        <span style={{
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          color: task.completed ? '#94a3b8' : '#0f172a',
                          textDecoration: task.completed ? 'line-through' : 'none'
                        }}>
                          {task.title}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{task.due}</span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: task.priority === 'Urgent' ? '#fef2f2' : '#f0fdf4',
                          color: task.priority === 'Urgent' ? '#dc2626' : '#16a34a',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Action Tools Column (Screenshot 1 1:1) */}
          <div style={{
            width: '180px',
            borderLeft: '1px solid #eaebf0',
            backgroundColor: '#ffffff',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flexShrink: 0
          }}>
            {[
              { id: 'search', label: 'Find in Channel', icon: Search },
              { id: 'replies', label: 'Replies', icon: CornerUpLeft },
              { id: 'pinned', label: 'Pinned Messages', icon: Pin },
              { id: 'assigned', label: 'Assigned', icon: UserCheck }
            ].map(tool => {
              const Icon = tool.icon;
              const isActive = activeSideTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveSideTool(isActive ? null : tool.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? '#f1f5f9' : 'transparent',
                    color: isActive ? '#0f172a' : '#475569',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={14} color={isActive ? '#0f172a' : '#64748b'} />
                  <span>{tool.label}</span>
                </button>
              );
            })}

            {/* Quick Flyout if a tool is active */}
            {activeSideTool && (
              <div style={{
                marginTop: '12px',
                padding: '10px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: '#fafbfc',
                fontSize: '0.74rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{activeSideTool.toUpperCase()}</span>
                  <X size={12} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setActiveSideTool(null)} />
                </div>
                {activeSideTool === 'search' && (
                  <input
                    type="text"
                    placeholder="Type to filter..."
                    style={{ width: '100%', padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.72rem' }}
                  />
                )}
                {activeSideTool === 'replies' && <span style={{ color: '#64748b' }}>No active thread replies.</span>}
                {activeSideTool === 'pinned' && <span style={{ color: '#64748b' }}>No pinned messages yet.</span>}
                {activeSideTool === 'assigned' && <span style={{ color: '#64748b' }}>All tasks up to date.</span>}
              </div>
            )}
          </div>

        </div>

        {/* Screenshot 1 1:1 Floating Composer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #eaebf0',
          backgroundColor: '#ffffff'
        }}>
          <div style={{
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            overflow: 'hidden'
          }}>
            {/* Input Text Area with exact placeholder from Screenshot 1 */}
            <input
              type="text"
              placeholder={`Write to ${currentUserName}, press 'space' for AI, '/' for commands`}
              value={composerText}
              onChange={e => setComposerText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                outline: 'none',
                fontSize: '0.84rem',
                fontFamily: 'inherit',
                color: '#0f172a',
                boxSizing: 'border-box'
              }}
            />

            {/* Bottom Tools Row matching Screenshot 1 icons (+, Brain, @, Clip, @, Smile, Mic, Camera, Folder, Grid) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 12px',
              borderTop: '1px solid #f8fafc',
              backgroundColor: '#fafbfc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <button
                  type="button"
                  onClick={() => showToast('Create task or reminder')}
                  title="Create item"
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
                >
                  <Plus size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setComposerText(t => t + '🌸 ClickUp Brain: ')}
                  title="ClickUp Brain AI"
                  style={{ background: 'none', border: 'none', color: '#ec4899', cursor: 'pointer', padding: '3px' }}
                >
                  <Sparkles size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setComposerText(t => t + '@')}
                  title="Mention"
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
                >
                  <AtSign size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Attach file')}
                  title="Attach file"
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
                >
                  <Paperclip size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setComposerText(t => t + '😊 ')}
                  title="Emoji"
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
                >
                  <Smile size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Voice memo recorder activated')}
                  title="Voice message"
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
                >
                  <Radio size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Attach image or screenshot')}
                  title="Media attachment"
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
                >
                  <Camera size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Browse Workspace Folders')}
                  title="Browse Folders"
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
                >
                  <Folder size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Insert Widget')}
                  title="Widgets"
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
                >
                  <Grid size={15} />
                </button>
              </div>

              {/* Right side: Mic + Send arrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => showToast('Dictation started')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <Mic size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!composerText.trim()}
                  style={{
                    backgroundColor: composerText.trim() ? '#0f172a' : '#e2e8f0',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    cursor: composerText.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* User Profile Modal (Screenshot 1 "View Profile" / "Show profile") */}
      {isProfileModalOpen && (
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
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '420px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            border: '1px solid #eaebf0'
          }}>
            {/* Header */}
            <div style={{
              height: '80px',
              backgroundColor: '#0f172a',
              position: 'relative',
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '12px'
            }}>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Profile Avatar & Details */}
            <div style={{ padding: '0 24px 24px 24px', position: 'relative' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                color: '#ffffff',
                border: '4px solid #ffffff',
                marginTop: '-32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                {userInitials}
              </div>

              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    {currentUserName}
                  </h3>
                  <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '1px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
                    Active
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  Workspace Owner &amp; Admin • {user?.email || 'joy@clickup.workspace'}
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ color: '#64748b' }}>Timezone:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>UTC+6 (Asia/Dhaka)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ color: '#64748b' }}>Assigned Open Tasks:</span>
                  <span style={{ fontWeight: 700, color: '#7c3aed' }}>{personalTasks.filter(t => !t.completed).length} items</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    showToast('Profile updated');
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
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
          zIndex: 6000
        }}>
          <CheckCircle2 size={16} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
