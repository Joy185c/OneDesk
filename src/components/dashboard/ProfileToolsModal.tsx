import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  X, 
  Settings, 
  Bell, 
  Palette, 
  Command, 
  Download, 
  HelpCircle, 
  Pin, 
  Briefcase, 
  Clock, 
  FileText, 
  Video, 
  Mic, 
  AlarmClock, 
  Layers, 
  Users, 
  BarChart3, 
  Bot, 
  Trash2, 
  ExternalLink, 
  LogOut, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Smile, 
  VolumeX, 
  Volume2, 
  Plus, 
  CheckCircle2, 
  Radio, 
  Bug, 
  Sparkles,
  Search,
  CheckSquare,
  Square,
  Camera,
  Upload,
  Edit2,
  User as UserIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { TaskItem } from '../../types';

interface ProfileToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string; initials?: string; avatar?: string };
  tasks: TaskItem[];
  onAddTask?: (task: TaskItem) => void;
  onNavigateToTab: (tab: any) => void;
  onLogout: () => void;
  onBackToLanding: () => void;
  onOpenNewTaskModal: () => void;
}

export const ProfileToolsModal: React.FC<ProfileToolsModalProps> = ({
  isOpen,
  onClose,
  user,
  tasks,
  onAddTask,
  onNavigateToTab,
  onLogout,
  onBackToLanding,
  onOpenNewTaskModal
}) => {
  // Active modals opened from this menu
  const [activeModal, setActiveModal] = useState<
    'none' | 'status' | 'mute' | 'settings' | 'shortcuts' | 'themes' | 'download' | 'help' | 
    'time_tracker' | 'notepad' | 'clip_recorder' | 'talk_to_text' | 'reminder' | 'trash' | 'edit_profile'
  >('none');

  const { user: authUser, updateProfile } = useAuth();

  // Profile update state
  const [editName, setEditName] = useState(authUser?.name || user.name);
  const [editAvatar, setEditAvatar] = useState(authUser?.avatar || user.avatar || '');
  const [editWorkspaceName, setEditWorkspaceName] = useState(authUser?.workspaceName || '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (authUser) {
      setEditName(authUser.name);
      setEditAvatar(authUser.avatar || '');
      setEditWorkspaceName(authUser.workspaceName || '');
    }
  }, [authUser]);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop'
  ];

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file too large (Max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setEditAvatar(result);
        showToast('Profile photo ready to save!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty');
      return;
    }

    updateProfile({
      name: editName.trim(),
      avatar: editAvatar,
      workspaceName: editWorkspaceName.trim()
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast('✓ Profile and picture updated successfully!');
    setActiveModal('none');
  };

  // 1. User Status state
  const [userStatus, setUserStatus] = useState<{ emoji: string; text: string }>(() => {
    try {
      const saved = localStorage.getItem('clickup_user_status');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { emoji: '🟢', text: 'Online' };
  });
  const [customStatusText, setCustomStatusText] = useState('');
  const [customStatusEmoji, setCustomStatusEmoji] = useState('🎯');

  // 2. Mute Notifications state
  const [mutedUntil, setMutedUntil] = useState<string | null>(null);

  // 3. Time Tracker state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTaskTitle, setTimerTaskTitle] = useState('Implement OAuth 2.0 PKCE Flow');
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning]);

  const formatTimer = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 4. Notepad state
  const [notes, setNotes] = useState<Array<{ id: string; title: string; content: string; date: string }>>(() => {
    try {
      const saved = localStorage.getItem('clickup_notes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'note-1',
        title: 'Sprint 28 Architecture Notes',
        content: '- Review PostgreSQL indexes for tasks table\n- Wire up Google Calendar OAuth 2.0 consent\n- Verify AI Notetaker audio recording buffer',
        date: 'Today, 9:45 AM'
      }
    ];
  });
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [noteEditTitle, setNoteEditTitle] = useState('');
  const [noteEditContent, setNoteEditContent] = useState('');

  // 5. Clip Recorder state
  const [isRecordingClip, setIsRecordingClip] = useState(false);
  const [clipDuration, setClipDuration] = useState(0);
  const clipIntervalRef = useRef<any>(null);

  // 6. Talk to Text state
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');

  // 7. Reminder state
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('Today, 5:00 PM');
  const [reminders, setReminders] = useState<Array<{ id: string; title: string; time: string }>>([
    { id: 'rem-1', title: 'Submit EDP Squad Weekly Feedback', time: 'Today at 5:00 PM' }
  ]);

  // 8. AI Notetaker active toggle
  const [isAiNotetakerActive, setIsAiNotetakerActive] = useState(true);

  // 9. Trash state
  const [trashItems, setTrashItems] = useState<Array<{ id: string; key: string; title: string; deletedAt: string }>>([
    { id: 'del-1', key: 'CRM-98', title: 'Deprecated REST webhook endpoint', deletedAt: 'Yesterday' },
    { id: 'del-2', key: 'CRM-94', title: 'Legacy v1 user onboarding flow', deletedAt: '2 days ago' }
  ]);

  // Toast helper
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Close main dropdown when clicking outside
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (activeModal === 'none') {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, activeModal, onClose]);

  if (!isOpen) return null;

  return (
    <>
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
          zIndex: 99999,
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

      {/* =================================================================== */}
      {/* 1. THE MAIN PROFILE & PERSONAL TOOLS MENU POPOVER (Screenshot Match)*/}
      {/* =================================================================== */}
      <div
        ref={menuRef}
        style={{
          position: 'absolute',
          top: '48px',
          right: '12px',
          width: '270px',
          maxHeight: '620px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb',
          zIndex: 9000,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          animation: 'scaleIn 0.15s ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}
      >
        {/* User Info Header */}
        <div style={{ padding: '14px 14px 10px 14px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            {/* Clickable Profile Avatar with hover camera */}
            <div
              onClick={() => setActiveModal('edit_profile')}
              title="Click to change profile picture"
              style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 800,
                flexShrink: 0,
                cursor: 'pointer',
                overflow: 'hidden',
                border: '2px solid #ede9fe',
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.2)'
              }}
            >
              {authUser?.avatar || user.avatar ? (
                <img
                  src={authUser?.avatar || user.avatar}
                  alt={authUser?.name || user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                (authUser?.name || user.name || 'JK').slice(0, 2).toUpperCase()
              )}

              {/* Camera icon on hover */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
              >
                <Camera size={15} color="#ffffff" />
              </div>

              {/* Online Green Indicator Dot */}
              <span style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '2px solid #ffffff'
              }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e1f21', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {authUser?.name || user.name}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  padding: '1px 6px',
                  borderRadius: '100px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  ✓ Verified
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {authUser?.email || user.email || 'user@workspace.local'}
              </div>
              <button
                onClick={() => setActiveModal('edit_profile')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  marginTop: '4px',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              >
                <Edit2 size={10} color="#7c3aed" />
                <span>Edit Profile & Photo</span>
              </button>
            </div>
          </div>

          {/* Set Status Pill Button */}
          <button
            onClick={() => setActiveModal('status')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '100px',
              fontSize: '0.78rem',
              color: '#475569',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
          >
            <Smile size={14} color="#64748b" />
            <span>Set status</span>
          </button>
        </div>

        {/* Mute notifications row */}
        <div style={{ padding: '6px 8px', borderBottom: '1px solid #f1f5f9' }}>
          <div
            onClick={() => setActiveModal('mute')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 8px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              color: '#334155',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <VolumeX size={15} color="#64748b" />
              <span>{mutedUntil ? `Muted until ${mutedUntil}` : 'Mute notifications'}</span>
            </div>
            <ChevronRight size={14} color="#94a3b8" />
          </div>
        </div>

        {/* Section 1: Settings & Options */}
        <div style={{ padding: '6px 8px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {[
            { id: 'edit_profile', label: 'Edit Profile & Avatar', icon: <Edit2 size={15} color="#7c3aed" />, action: () => setActiveModal('edit_profile') },
            { id: 'settings', label: 'Settings', icon: <Settings size={15} color="#64748b" />, action: () => setActiveModal('settings') },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={15} color="#64748b" />, action: () => showToast('Notification preferences loaded') },
            { id: 'themes', label: 'Themes', icon: <Palette size={15} color="#64748b" />, action: () => setActiveModal('themes') },
            { id: 'shortcuts', label: 'Keyboard shortcuts', icon: <Command size={15} color="#64748b" />, action: () => setActiveModal('shortcuts') },
            { id: 'download', label: 'Download ClickUp', icon: <Download size={15} color="#64748b" />, ext: true, action: () => setActiveModal('download') },
            { id: 'help', label: 'Help', icon: <HelpCircle size={15} color="#64748b" />, extra: <Bug size={13} color="#94a3b8" />, action: () => setActiveModal('help') }
          ].map(item => (
            <div
              key={item.id}
              onClick={item.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                color: '#334155',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.ext && <ExternalLink size={13} color="#94a3b8" />}
              {item.extra && item.extra}
            </div>
          ))}
        </div>

        {/* Section 2: Personal Tools (Matches Screenshot) */}
        <div style={{ padding: '8px 8px 6px 8px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', padding: '0 8px', marginBottom: '4px' }}>
            Personal Tools
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {[
              { id: 'create_task', label: 'Create task', icon: <CheckSquare size={15} color="#7c3aed" />, pinned: true, action: () => { onClose(); onOpenNewTaskModal(); } },
              { id: 'my_work', label: 'My Work', icon: <Briefcase size={15} color="#64748b" />, pinned: false, action: () => { onClose(); onNavigateToTab('overview'); showToast(`Showing tasks assigned to ${user.name}`); } },
              { id: 'track_time', label: 'Track Time', icon: <Clock size={15} color="#64748b" />, pinned: true, action: () => setActiveModal('time_tracker') },
              { id: 'notepad', label: 'Notepad', icon: <FileText size={15} color="#64748b" />, pinned: true, action: () => setActiveModal('notepad') },
              { id: 'record_clip', label: 'Record a Clip', icon: <Video size={15} color="#64748b" />, pinned: true, action: () => setActiveModal('clip_recorder') },
              { id: 'talk_to_text', label: 'Talk to Text', icon: <Mic size={15} color="#64748b" />, pinned: true, action: () => setActiveModal('talk_to_text') },
              { id: 'reminder', label: 'Create Reminder', icon: <AlarmClock size={15} color="#64748b" />, pinned: false, action: () => setActiveModal('reminder') },
              { id: 'create_doc', label: 'Create Doc', icon: <FileText size={15} color="#64748b" />, pinned: false, action: () => { onClose(); onNavigateToTab('docs'); } },
              { id: 'whiteboard', label: 'Create Whiteboard', icon: <Layers size={15} color="#64748b" />, pinned: true, action: () => { onClose(); onNavigateToTab('whiteboard'); } },
              { id: 'view_people', label: 'View People', icon: <Users size={15} color="#64748b" />, pinned: false, action: () => { onClose(); onNavigateToTab('teams'); } },
              { id: 'create_dashboard', label: 'Create Dashboard', icon: <BarChart3 size={15} color="#64748b" />, pinned: true, action: () => { onClose(); onNavigateToTab('analytics'); } },
              { 
                id: 'ai_notetaker', 
                label: 'AI Notetaker', 
                icon: <Bot size={15} color="#7c3aed" />, 
                pinned: false, 
                action: () => {
                  setIsAiNotetakerActive(!isAiNotetakerActive);
                  showToast(isAiNotetakerActive ? 'AI Notetaker disabled' : 'AI Notetaker enabled for upcoming meetings');
                } 
              }
            ].map(tool => (
              <div
                key={tool.id}
                onClick={tool.action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  color: '#334155',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {tool.icon}
                  <span>{tool.label}</span>
                </div>
                {tool.pinned && (
                  <Pin size={12} color="#94a3b8" style={{ transform: 'rotate(45deg)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Trash & Log Out (Screenshot Match) */}
        <div style={{ padding: '6px 8px 10px 8px' }}>
          <div
            onClick={() => setActiveModal('trash')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 8px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              color: '#475569',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Trash2 size={15} color="#64748b" />
            <span>Trash</span>
          </div>

          <div
            onClick={() => {
              onClose();
              onLogout();
              onBackToLanding();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 8px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              color: '#dc2626',
              cursor: 'pointer',
              marginTop: '2px'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={15} color="#dc2626" />
            <span>Log Out</span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. MODAL: SET USER STATUS                                           */}
      {/* =================================================================== */}
      {activeModal === 'status' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
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
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1f21', margin: 0 }}>
                Set Custom Status
              </h3>
              <button onClick={() => setActiveModal('none')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <select
                value={customStatusEmoji}
                onChange={e => setCustomStatusEmoji(e.target.value)}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', cursor: 'pointer' }}
              >
                <option value="🎯">🎯</option>
                <option value="📞">📞</option>
                <option value="☕">☕</option>
                <option value="🏡">🏡</option>
                <option value="✈️">✈️</option>
                <option value="🟢">🟢</option>
              </select>

              <input
                type="text"
                placeholder="What's your status?"
                value={customStatusText}
                onChange={e => setCustomStatusText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Quick status presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
              {[
                { emoji: '🎯', text: 'In focus mode' },
                { emoji: '📞', text: 'In a meeting' },
                { emoji: '☕', text: 'Coffee break' },
                { emoji: '🏡', text: 'Working remotely' }
              ].map((ps, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomStatusEmoji(ps.emoji);
                    setCustomStatusText(ps.text);
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '100px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{ps.emoji}</span>
                  <span>{ps.text}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setUserStatus({ emoji: '🟢', text: 'Online' });
                  localStorage.removeItem('clickup_user_status');
                  setActiveModal('none');
                  showToast('Status cleared');
                }}
                style={{ border: 'none', background: 'none', color: '#dc2626', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear Status
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setActiveModal('none')}
                  style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const st = { emoji: customStatusEmoji, text: customStatusText || 'Online' };
                    setUserStatus(st);
                    localStorage.setItem('clickup_user_status', JSON.stringify(st));
                    setActiveModal('none');
                    showToast('Status updated!');
                  }}
                  style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#7c3aed', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. MODAL: TIME TRACKER (Personal Tool)                              */}
      {/* =================================================================== */}
      {activeModal === 'time_tracker' && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '360px',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          border: '1px solid #e2e8f0',
          zIndex: 99999,
          padding: '18px',
          animation: 'slideUp 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#7c3aed" />
              <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1e1f21' }}>
                Time Tracker
              </span>
            </div>
            <button onClick={() => setActiveModal('none')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
            marginBottom: '14px'
          }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace', letterSpacing: '2px' }}>
              {formatTimer(timerSeconds)}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
              {isTimerRunning ? '🟢 Tracking Active Work' : '⚪ Timer Paused'}
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              Task to log time for:
            </label>
            <input
              type="text"
              value={timerTaskTitle}
              onChange={e => setTimerTaskTitle(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isTimerRunning ? '#f59e0b' : '#10b981',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
              <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(0);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
              title="Reset timer"
            >
              <RotateCcw size={14} color="#64748b" />
            </button>

            <button
              onClick={() => {
                if (timerSeconds === 0) return;
                showToast(`Logged ${formatTimer(timerSeconds)} to "${timerTaskTitle}"!`);
                setIsTimerRunning(false);
                setTimerSeconds(0);
                setActiveModal('none');
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Log Time
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. MODAL: NOTEPAD (Personal Tool)                                   */}
      {/* =================================================================== */}
      {activeModal === 'notepad' && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '420px',
          height: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          border: '1px solid #e2e8f0',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.2s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #eaebf0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fafbfc'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#7c3aed" />
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e1f21' }}>Notepad</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => {
                  const newNote = {
                    id: 'note-' + Date.now(),
                    title: 'New Workspace Note',
                    content: '',
                    date: 'Just now'
                  };
                  const updated = [newNote, ...notes];
                  setNotes(updated);
                  setActiveNoteId(newNote.id);
                  setNoteEditTitle(newNote.title);
                  setNoteEditContent(newNote.content);
                  localStorage.setItem('clickup_notes', JSON.stringify(updated));
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  padding: '3px 8px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={12} /> Note
              </button>
              <button onClick={() => setActiveModal('none')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px' }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notes list and active note content */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Left mini notes list */}
            <div style={{ width: '130px', borderRight: '1px solid #eaebf0', overflowY: 'auto', backgroundColor: '#f8fafc', padding: '8px 4px' }}>
              {notes.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    setActiveNoteId(n.id);
                    setNoteEditTitle(n.title);
                    setNoteEditContent(n.content);
                  }}
                  style={{
                    padding: '8px 6px',
                    borderRadius: '6px',
                    backgroundColor: activeNoteId === n.id ? '#ffffff' : 'transparent',
                    border: activeNoteId === n.id ? '1px solid #e2e8f0' : '1px solid transparent',
                    cursor: 'pointer',
                    marginBottom: '4px'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1e1f21', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {n.title || 'Untitled'}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#94a3b8', marginTop: '2px' }}>
                    {n.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Right editor */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px' }}>
              <input
                type="text"
                value={noteEditTitle || (notes.find(n => n.id === activeNoteId)?.title || '')}
                onChange={e => {
                  setNoteEditTitle(e.target.value);
                  const updated = notes.map(n => n.id === activeNoteId ? { ...n, title: e.target.value } : n);
                  setNotes(updated);
                  localStorage.setItem('clickup_notes', JSON.stringify(updated));
                }}
                placeholder="Note Title"
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  color: '#1e1f21',
                  marginBottom: '8px'
                }}
              />

              <textarea
                value={noteEditContent !== '' ? noteEditContent : (notes.find(n => n.id === activeNoteId)?.content || '')}
                onChange={e => {
                  setNoteEditContent(e.target.value);
                  const updated = notes.map(n => n.id === activeNoteId ? { ...n, content: e.target.value } : n);
                  setNotes(updated);
                  localStorage.setItem('clickup_notes', JSON.stringify(updated));
                }}
                placeholder="Type your notes, ideas, or meeting takeaways here..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '0.84rem',
                  lineHeight: 1.6,
                  color: '#334155'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                <button
                  onClick={() => {
                    const currentNote = notes.find(n => n.id === activeNoteId);
                    if (currentNote && onAddTask) {
                      onAddTask({
                        id: 'task-' + Date.now(),
                        key: 'CRM-' + (tasks.length + 101),
                        title: currentNote.title || 'Note Task',
                        status: 'TODO',
                        priority: 'Normal',
                        assignee: { name: user.name, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop', role: 'Owner' },
                        dueDate: 'Nov 04',
                        timeEstimate: '2h',
                        tags: ['Notepad'],
                        commentsCount: 0
                      });
                      showToast(`Converted note "${currentNote.title}" to Task!`);
                      setActiveModal('none');
                    }
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#7c3aed',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Convert Note to Task
                </button>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>✓ Auto-saved</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. MODAL: KEYBOARD SHORTCUTS CHEATSHEET                             */}
      {/* =================================================================== */}
      {activeModal === 'shortcuts' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '520px',
            maxHeight: '80vh',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #eaebf0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fafbfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Command size={18} color="#7c3aed" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1f21', margin: 0 }}>Keyboard Shortcuts</h3>
              </div>
              <button onClick={() => setActiveModal('none')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>NAVIGATION</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { key: 'Ctrl + K', desc: 'Universal Search' },
                    { key: 'Ctrl + \\', desc: 'Hide/Show Sidebar' },
                    { key: 'G then H', desc: 'Go to Home' },
                    { key: 'G then P', desc: 'Go to Planner' }
                  ].map((sc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#475569' }}>{sc.desc}</span>
                      <kbd style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 6px', fontSize: '0.72rem', fontWeight: 700 }}>{sc.key}</kbd>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>CREATION</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { key: 'C', desc: 'Create Task' },
                    { key: 'D', desc: 'Create Doc' },
                    { key: 'R', desc: 'Create Reminder' },
                    { key: 'T', desc: 'Start Time Tracker' }
                  ].map((sc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#475569' }}>{sc.desc}</span>
                      <kbd style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 6px', fontSize: '0.72rem', fontWeight: 700 }}>{sc.key}</kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. MODAL: TRASH (Recover deleted tasks)                              */}
      {/* =================================================================== */}
      {activeModal === 'trash' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '480px',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #eaebf0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fafbfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={18} color="#dc2626" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1f21', margin: 0 }}>Trash & Recovery</h3>
              </div>
              <button onClick={() => setActiveModal('none')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
                Items in trash are retained for 30 days before permanent purging.
              </div>

              {trashItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  Trash is empty
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {trashItems.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e1f21' }}>
                          <span style={{ color: '#7c3aed', marginRight: '6px' }}>{item.key}</span>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Deleted {item.deletedAt}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => {
                            if (onAddTask) {
                              onAddTask({
                                id: 'task-' + Date.now(),
                                key: item.key,
                                title: item.title,
                                status: 'TODO',
                                priority: 'Normal',
                                assignee: { name: user.name, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop', role: 'Owner' },
                                dueDate: 'Nov 05',
                                timeEstimate: '3h',
                                tags: ['Restored'],
                                commentsCount: 0
                              });
                            }
                            setTrashItems(trashItems.filter(i => i.id !== item.id));
                            showToast(`Restored "${item.title}" to board!`);
                          }}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            color: '#16a34a',
                            cursor: 'pointer'
                          }}
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: EDIT PROFILE (UPDATE NAME & PROFILE PICTURE)                 */}
      {/* =================================================================== */}
      {activeModal === 'edit_profile' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.15s ease'
        }}>
          <div style={{
            width: '460px',
            maxWidth: '92%',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #f1f5f9',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={16} color="#7c3aed" />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  Edit Profile & Photo
                </span>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProfile} style={{ padding: '24px' }}>
              {/* Avatar Section */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
                  <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '3px solid #ede9fe',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)',
                    margin: '0 auto'
                  }}>
                    {editAvatar ? (
                      <img src={editAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{editName ? editName.slice(0, 2).toUpperCase() : 'U'}</span>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    style={{ display: 'none' }}
                  />

                  {/* Camera overlay button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload picture from computer"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#7c3aed',
                      color: '#ffffff',
                      border: '2px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={13} />
                    <span>Upload Image</span>
                  </button>

                  {editAvatar && (
                    <button
                      type="button"
                      onClick={() => setEditAvatar('')}
                      style={{
                        backgroundColor: '#fee2e2',
                        border: '1px solid #fecaca',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#b91c1c',
                        cursor: 'pointer'
                      }}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {/* Preset Avatar Pickers */}
                <div style={{ marginTop: '14px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
                    Or select a preset avatar:
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {presetAvatars.map((url, i) => (
                      <div
                        key={i}
                        onClick={() => setEditAvatar(url)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: editAvatar === url ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                          boxShadow: editAvatar === url ? '0 0 0 2px rgba(124, 58, 237, 0.3)' : 'none',
                          transform: editAvatar === url ? 'scale(1.1)' : 'scale(1)',
                          transition: 'all 0.15s'
                        }}
                      >
                        <img src={url} alt={`Preset ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                  onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                />
              </div>

              {/* Workspace Name Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Workspace Title
                </label>
                <input
                  type="text"
                  value={editWorkspaceName}
                  onChange={e => setEditWorkspaceName(e.target.value)}
                  placeholder="e.g. My Workspace"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                  onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                />
              </div>

              {/* Email (Readonly Verified) */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Verified Email Address
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.86rem',
                  color: '#475569'
                }}>
                  <span>{authUser?.email || user.email || 'user@workspace.local'}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#16a34a',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle2 size={13} />
                    Verified
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
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
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
