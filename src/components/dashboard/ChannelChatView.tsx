import React, { useState, useEffect, useRef } from 'react';
import { 
  Hash, 
  Send, 
  Users, 
  Paperclip, 
  Smile, 
  Sparkles,
  CheckCircle2,
  CheckCheck,
  UserPlus,
  ShieldCheck,
  X,
  Plus,
  Trash2,
  Lock,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { memberService, WorkspaceMember } from '../../services/memberService';
import { supabaseService } from '../../services/supabaseService';
import { generateUUID } from '../../lib/uuid';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

const MOCK_SENDERS = new Set(['Workspace Admin', 'Alex Rivera', 'Sarah Chang', 'Tester Alpha']);

interface ChatMessage {
  id: string;
  sender: string;
  avatarBg: string;
  initials: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  general: [],
  welcome: []
};

interface ChannelChatViewProps {
  channelKey: string;
  onOpenInviteModal?: () => void;
}

export const ChannelChatView: React.FC<ChannelChatViewProps> = ({ channelKey, onOpenInviteModal }) => {
  const { user } = useAuth();
  const isDemoUser = user?.id === 'u_joy_1';
  const userRole = user?.role || 'Workspace Owner';
  const isAdmin = userRole.toLowerCase().includes('admin') || userRole.toLowerCase().includes('owner');
  const currentUserName = user?.name || 'You';
  const userInitials = currentUserName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'ME';

  const getInitialMessages = (key: string): ChatMessage[] => {
    try {
      const storageKey = isDemoUser ? `clickup_channel_msgs_${key}` : `clickup_channel_msgs_${key}_${user?.id || 'guest'}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: ChatMessage[] = JSON.parse(saved);
        return parsed.filter(m => !m.id.startsWith('cm-') && !m.id.startsWith('cw-') && !MOCK_SENDERS.has(m.sender));
      }
    } catch {}
    return [];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages(channelKey));
  const [inputText, setInputText] = useState('');
  const [channelMembers, setChannelMembers] = useState<WorkspaceMember[]>([]);
  const [allWorkspaceMembers, setAllWorkspaceMembers] = useState<WorkspaceMember[]>([]);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedMemberToAdd, setSelectedMemberToAdd] = useState<string>('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load channel members and workspace members
  const refreshMembers = () => {
    const cMembers = memberService.getChannelMembers(channelKey);
    const wsMembers = memberService.getWorkspaceMembers();
    setChannelMembers(cMembers);
    setAllWorkspaceMembers(wsMembers);

    const availableToAdd = wsMembers.filter(m => !cMembers.some(cm => cm.id === m.id));
    if (availableToAdd.length > 0) {
      setSelectedMemberToAdd(availableToAdd[0].id);
    } else {
      setSelectedMemberToAdd('');
    }
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Initial messages from cache or seeds
    setMessages(getInitialMessages(channelKey));
    refreshMembers();

    // 2. Fetch live messages from Supabase
    supabaseService.getChatMessages(channelKey).then(({ messages: cloudMsgs }) => {
      if (isMounted) {
        if (cloudMsgs && cloudMsgs.length > 0) {
          const realMsgs = cloudMsgs.filter(m => !m.id.startsWith('cm-') && !m.id.startsWith('cw-') && !MOCK_SENDERS.has(m.sender));
          setMessages(realMsgs);
        } else {
          setMessages(prev => prev.filter(m => !m.id.startsWith('cm-') && !m.id.startsWith('cw-') && !MOCK_SENDERS.has(m.sender)));
        }
      }
    });

    // 3. Subscribe to real-time incoming messages
    const unsubscribe = supabaseService.subscribeToChat(channelKey, (newMsg) => {
      if (!isMounted) return;
      if (MOCK_SENDERS.has(newMsg.sender)) return;
      setMessages(prev => {
        // Prevent duplicate append
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [channelKey]);

  useEffect(() => {
    try {
      const storageKey = isDemoUser ? `clickup_channel_msgs_${channelKey}` : `clickup_channel_msgs_${channelKey}_${user?.id || 'guest'}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, channelKey, user?.id, isDemoUser]);

  // Auto-scroll to bottom whenever new messages arrive or are sent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const channelName = channelKey === 'general' 
    ? `General - ${user?.workspaceName || 'Team Workspace'}` 
    : channelKey === 'welcome' 
      ? 'Welcome' 
      : channelKey;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageId = generateUUID();
    const newMsg: ChatMessage = {
      id: messageId,
      sender: currentUserName,
      avatarBg: isAdmin ? '#176B50' : '#123D32',
      initials: userInitials,
      avatar: user?.avatar || '',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    // Optimistic UI update
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Persist to Supabase
    const res = await supabaseService.sendChatMessage({
      id: messageId,
      text: newMsg.text,
      sender: newMsg.sender,
      initials: newMsg.initials,
      avatarBg: newMsg.avatarBg,
      channelKey,
      userId: user?.id
    });

    if (!res.success) {
      showToast(`⚠️ Message delivery issue: ${res.error || 'Check connection'}`);
    }
  };

  // Requirement 3: Admin adds member to channel
  const handleAddMemberToChannel = () => {
    if (!isAdmin) {
      showToast('Permission Denied: Only Workspace Admins can add members to this channel.');
      return;
    }
    if (!selectedMemberToAdd) {
      showToast('No more workspace members available to add.');
      return;
    }

    const member = allWorkspaceMembers.find(m => m.id === selectedMemberToAdd);
    if (!member) return;

    memberService.addMemberToChannel(channelKey, member.id);
    refreshMembers();

    // Post an announcement in the channel
    const systemNotice: ChatMessage = {
      id: 'cm-sys-' + Date.now(),
      sender: 'Workspace System',
      avatarBg: '#0f172a',
      initials: 'WS',
      text: `📢 ${currentUserName} added ${member.name} (${member.role}) to #${channelName}.`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    };
    setMessages(prev => [...prev, systemNotice]);
    showToast(`Added ${member.name} to #${channelName}!`);
  };

  const handleRemoveMemberFromChannel = (member: WorkspaceMember) => {
    if (!isAdmin) {
      showToast('Permission Denied: Only Workspace Admins can remove members.');
      return;
    }
    if (confirm(`Remove ${member.name} from #${channelName}?`)) {
      memberService.removeMemberFromChannel(channelKey, member.id);
      refreshMembers();
      const systemNotice: ChatMessage = {
        id: 'cm-sys-' + Date.now(),
        sender: 'Workspace System',
        avatarBg: '#0f172a',
        initials: 'WS',
        text: `📢 ${currentUserName} removed ${member.name} from #${channelName}.`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      };
      setMessages(prev => [...prev, systemNotice]);
      showToast(`Removed ${member.name} from #${channelName}`);
    }
  };

  const availableToAdd = allWorkspaceMembers.filter(m => !channelMembers.some(cm => cm.id === m.id));

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Toast Notification */}
      {notificationMsg && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '8px 18px',
          borderRadius: '100px',
          fontSize: '0.82rem',
          fontWeight: 700,
          boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
          zIndex: 2500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={14} color="#a855f7" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Channel Header */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#ede9fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7c3aed'
          }}>
            <Hash size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {channelName}
              </h2>
              {isAdmin && (
                <span style={{
                  fontSize: '0.68rem',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <Crown size={11} /> Admin Mode
                </span>
              )}
            </div>
            <p style={{ margin: '1px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
              Team channel discussion, sprint sync & updates
            </p>
          </div>
        </div>

        {/* Channel Members button & Actions (Requirement 3) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => { refreshMembers(); setIsMembersModalOpen(true); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <Users size={15} color="#7c3aed" />
            <span>{channelMembers.length} Members</span>
            {isAdmin && <span style={{ color: '#059669', fontSize: '0.74rem' }}>• Add</span>}
          </button>

          {/* Member avatars preview */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-4px' }}>
            {channelMembers.slice(0, 4).map((m, idx) => (
              <img
                key={m.id}
                src={m.avatar}
                alt={m.name}
                title={`${m.name} (${m.role})`}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ffffff',
                  marginLeft: idx > 0 ? '-8px' : '0'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: 'var(--bg-canvas, #f8fafc)'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary, #64748b)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-selected, #E0EDE3)',
              color: 'var(--brand-primary, #176B50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Hash size={28} />
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
              Welcome to #{channelKey}
            </h3>
            <p style={{ margin: 0, fontSize: '0.86rem', maxWidth: '380px', lineHeight: 1.5 }}>
              This is the start of the #{channelKey} channel. Send a message below to start collaborating with your team!
            </p>
          </div>
        ) : (
          messages.map(msg => {
            if (msg.isSystem) {
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: 'center',
                    margin: '4px 0',
                    backgroundColor: 'var(--bg-surface-secondary, #e2e8f0)',
                    color: 'var(--text-secondary, #475569)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    padding: '5px 14px',
                    borderRadius: '20px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    maxWidth: '85%',
                    textAlign: 'center'
                  }}
                >
                  {msg.text}
                </div>
              );
            }

            const isMe = msg.sender === currentUserName ||
              (user?.name && msg.sender.toLowerCase() === user.name.toLowerCase()) ||
              (user?.email && msg.sender.toLowerCase() === user.email.toLowerCase()) ||
              (msg as any).userId === user?.id ||
              (msg as any).isYou;

            if (isMe) {
              // Sender (You) on the RIGHT side
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    gap: '8px',
                    width: '100%'
                  }}
                >
                  <div style={{
                    maxWidth: '72%',
                    minWidth: '100px',
                    backgroundColor: 'var(--brand-primary, #176B50)',
                    color: '#ffffff',
                    borderRadius: '16px 16px 4px 16px',
                    padding: '9px 13px',
                    boxShadow: '0 2px 8px rgba(23, 107, 80, 0.22)',
                    display: 'flex',
                    flexDirection: 'column',
                    wordBreak: 'break-word',
                    position: 'relative'
                  }}>
                    <div style={{
                      fontSize: '0.88rem',
                      lineHeight: '1.45'
                    }}>
                      <MarkdownRenderer content={msg.text} textColor="#ffffff" />
                    </div>

                    {/* Sender Meta: Timestamp + WhatsApp Double Checkmarks */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '4px',
                      marginTop: '3px',
                      fontSize: '0.68rem',
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                      <span>{msg.timestamp}</span>
                      <CheckCheck size={14} color="#C5F277" />
                    </div>
                  </div>

                  {/* Sender Avatar */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: msg.avatarBg || 'var(--brand-primary, #176B50)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                  }}>
                    {user?.avatar || msg.avatar ? (
                      <img
                        src={user?.avatar || msg.avatar}
                        alt={currentUserName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                </div>
              );
            }

            // Receiver (Teammate) Bubble on the LEFT side
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                  gap: '8px',
                  width: '100%'
                }}
              >
                {/* Receiver Avatar */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: msg.avatarBg || '#0f766e',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                  overflow: 'hidden'
                }}>
                  {msg.avatar ? (
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    msg.initials
                  )}
                </div>

                <div style={{
                  maxWidth: '72%',
                  minWidth: '100px',
                  backgroundColor: 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-default, #DCE7DE)',
                  color: 'var(--text-primary, #182A22)',
                  borderRadius: '16px 16px 16px 4px',
                  padding: '9px 13px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  wordBreak: 'break-word',
                  position: 'relative'
                }}>
                  {/* Teammate Sender Name Header */}
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: 'var(--brand-primary, #176B50)',
                    marginBottom: '3px'
                  }}>
                    {msg.sender}
                  </div>

                  <div style={{
                    fontSize: '0.88rem',
                    lineHeight: '1.45',
                    color: 'var(--text-primary, #182A22)'
                  }}>
                    <MarkdownRenderer content={msg.text} />
                  </div>

                  {/* Receiver Meta: Timestamp */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '4px',
                    marginTop: '3px',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted, #94a3b8)'
                  }}>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSend} style={{
        padding: '14px 24px',
        borderTop: '1px solid #eaebf0',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          border: '1.5px solid #cbd5e1',
          borderRadius: '12px',
          padding: '8px 14px',
          gap: '10px'
        }}>
          <input
            type="text"
            placeholder={`Message #${channelName} as ${currentUserName}...`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#0f172a'
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              backgroundColor: inputText.trim() ? 'var(--brand-primary, #176B50)' : '#cbd5e1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 14px',
              cursor: inputText.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.82rem',
              gap: '4px',
              transition: 'background 0.15s ease'
            }}
          >
            <Send size={14} />
            <span>Send</span>
          </button>
        </div>
      </form>

      {/* Channel Members & Admin Add Member Modal (Requirement 3) */}
      {isMembersModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '20px'
        }}>
          <div style={{
            width: '480px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '85vh'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid #eaebf0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#faf5ff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--brand-primary, #176B50)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Channel Members
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                    #{channelName} • {channelMembers.length} active members
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMembersModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '22px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Admin Add Member Section (Requirement 3) */}
              {isAdmin ? (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '14px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#0f172a', fontWeight: 800, fontSize: '0.86rem' }}>
                    <UserPlus size={16} color="#7c3aed" />
                    <span>Add Member to Channel (Admin Only)</span>
                  </div>

                  {availableToAdd.length > 0 ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        value={selectedMemberToAdd}
                        onChange={e => setSelectedMemberToAdd(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          backgroundColor: '#ffffff',
                          color: '#1e293b'
                        }}
                      >
                        {availableToAdd.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.role}) — {m.email}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={handleAddMemberToChannel}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'var(--brand-primary, #176B50)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Plus size={15} />
                        <span>Add Member</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={15} />
                      <span>All workspace members are already members of this channel!</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#991b1b',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}>
                  <Lock size={15} />
                  <span>Only Workspace Admins can add or remove members from channels.</span>
                </div>
              )}

              {/* Members List */}
              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#334155', margin: '0 0 12px' }}>
                  Current Members ({channelMembers.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {channelMembers.map(m => (
                    <div
                      key={m.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={m.avatar}
                          alt={m.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>
                              {m.name}
                            </span>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor: m.role === 'Owner' || m.role === 'Admin' ? '#fee2e2' : '#ede9fe',
                              color: m.role === 'Owner' || m.role === 'Admin' ? '#dc2626' : '#7c3aed'
                            }}>
                              {m.role}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {m.email}
                          </div>
                        </div>
                      </div>

                      {isAdmin && m.id !== user?.id && channelMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMemberFromChannel(m)}
                          style={{
                            border: 'none',
                            background: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                          title="Remove from channel"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '12px 22px',
              borderTop: '1px solid #eaebf0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => setIsMembersModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e2e8f0',
                  color: '#334155',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
