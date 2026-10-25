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
  AtSign
} from 'lucide-react';

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
  const [selectedRecipient, setSelectedRecipient] = useState<string>('Joy Kumar Yuv (You)');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [composerText, setComposerText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_chat_launchpad_messages_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg-1',
        sender: 'Meeting Agent',
        senderInitials: 'MA',
        isAi: true,
        avatarBg: '#ec4899',
        text: '👋 Hi Joy! I have prepared the summary and action items from today\'s Sprint Planning. 3 tasks were added to the Sales CRM backlog.',
        timestamp: '10:30 AM'
      }
    ];
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('clickup_chat_launchpad_messages_v1', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendMessage = () => {
    if (!composerText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: 'Joy Kumar Yuv',
      senderInitials: 'JY',
      avatarBg: '#0f172a',
      text: composerText.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    const sentText = composerText.trim();
    setComposerText('');

    // If sent to an AI Agent, generate an immediate intelligent response
    if (selectedRecipient.includes('Agent') || selectedRecipient.includes('Brain')) {
      setTimeout(() => {
        const aiReply: ChatMessage = {
          id: 'm-ai-' + Date.now(),
          sender: selectedRecipient,
          senderInitials: selectedRecipient.includes('Meeting') ? 'MA' : 'CB',
          isAi: true,
          avatarBg: selectedRecipient.includes('Meeting') ? '#ec4899' : '#7c3aed',
          text: `Got it! ClickUp Brain processed: "${sentText}". I have updated your workspace context and synchronized with the team pipeline.`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiReply]);
      }, 800);
    }
  };

  const recipients = [
    { id: 'jy', name: 'Joy Kumar Yuv (You)', subtitle: 'Personal Scratchpad & Notes', initials: 'JY', bg: '#0f172a' },
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
      {/* 1. Left Chat Sub-Sidebar (Screenshot 3 1:1) */}
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
                padding: '3px 8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Plus size={12} />
              <span>Create</span>
            </button>
          </div>

          {/* Quick Search */}
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
              placeholder="Search chat & agents..."
              value={recipientSearch}
              onChange={e => setRecipientSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.8rem',
                width: '100%',
                color: '#1e293b'
              }}
            />
          </div>

          {/* Section: Agents (Screenshot 3 1:1) */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', padding: '0 4px', display: 'block', marginBottom: '6px' }}>
              Agents
            </span>

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
                <Sparkles size={14} color="#ec4899" />
                <span style={{ fontSize: '0.8rem', fontWeight: selectedRecipient === 'Meeting Agent' ? 700 : 500 }}>
                  Meeting Agent
                </span>
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                backgroundColor: '#ec4899',
                color: '#ffffff',
                padding: '1px 6px',
                borderRadius: '10px'
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

          {/* Section: Direct Messages */}
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
                  padding: '5px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: selectedRecipient === r.name ? '#f1f5f9' : 'transparent',
                  color: selectedRecipient === r.name ? '#0f172a' : '#475569',
                  fontWeight: selectedRecipient === r.name ? 700 : 500,
                  fontSize: '0.8rem',
                  marginTop: '1px'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: r.bg,
                  color: '#ffffff',
                  fontSize: '0.6rem',
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

      {/* 2. Main Area: Recipient Selector + Message Stream + Bottom Docked Composer (Screenshot 3 1:1) */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        {/* Top Recipient Header */}
        <div style={{
          padding: '14px 24px',
          borderBottom: '1px solid #eaebf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b' }}>To:</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f1f5f9',
              padding: '4px 10px',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                {selectedRecipient}
              </span>
            </div>
          </div>

          <button
            onClick={() => showToast('Chat preferences and notification settings')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Recipient Quick Picker Pills (Screenshot 3 1:1) */}
        <div style={{
          padding: '12px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          backgroundColor: '#fafbfc'
        }}>
          {filteredRecipients.map(r => (
            <div
              key={r.id}
              onClick={() => setSelectedRecipient(r.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedRecipient === r.name ? '#7c3aed' : '#e2e8f0',
                backgroundColor: selectedRecipient === r.name ? '#f5f3ff' : '#ffffff',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: r.bg,
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {r.initials}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedRecipient === r.name ? '#7c3aed' : '#1e293b' }}>
                  {r.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Messages Stream */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                maxWidth: '75%',
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
                  backgroundColor: msg.sender.includes('You') ? '#7c3aed' : '#f8fafc',
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

        {/* Screenshot 3 1:1 Docked Bottom Chat Composer with Full Formatting Toolbar */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #eaebf0',
          backgroundColor: '#ffffff'
        }}>
          <div style={{
            border: '1.5px solid #cbd5e1',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            overflow: 'hidden'
          }}>
            {/* Rich Formatting Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderBottom: '1px solid #f1f5f9',
              backgroundColor: '#fafbfc'
            }}>
              <button
                type="button"
                onClick={() => setComposerText(t => t + '**bold** ')}
                title="Bold"
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
              >
                <Bold size={14} />
              </button>
              <button
                type="button"
                onClick={() => setComposerText(t => t + '*italic* ')}
                title="Italic"
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
              >
                <Italic size={14} />
              </button>
              <button
                type="button"
                onClick={() => setComposerText(t => t + '`code` ')}
                title="Code"
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
              >
                <Code size={14} />
              </button>
              <button
                type="button"
                onClick={() => setComposerText(t => t + '\n- ')}
                title="Bullet List"
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
              >
                <List size={14} />
              </button>

              <div style={{ width: '1px', height: '14px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />

              <button
                type="button"
                onClick={() => setComposerText(t => t + '@')}
                title="Mention teammate or task"
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
              >
                <AtSign size={14} />
              </button>
              <button
                type="button"
                onClick={() => setComposerText(t => t + '✨ ')}
                title="ClickUp Brain AI Assistant"
                style={{ background: 'none', border: 'none', color: '#ec4899', cursor: 'pointer', padding: '3px' }}
              >
                <Sparkles size={14} />
              </button>
            </div>

            {/* Input Text Area */}
            <textarea
              placeholder={`Message ${selectedRecipient}... Press Enter to send`}
              value={composerText}
              onChange={e => setComposerText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '10px 14px',
                border: 'none',
                outline: 'none',
                fontSize: '0.86rem',
                fontFamily: 'inherit',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />

            {/* Bottom Actions Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 12px',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                <button
                  type="button"
                  onClick={() => showToast('Attach file from Computer, Drive, or Dropbox')}
                  title="Attach file"
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <Paperclip size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setComposerText(t => t + '👍 ')}
                  title="Emoji"
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <Smile size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Voice note recording active')}
                  title="Record voice note"
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <Mic size={15} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!composerText.trim()}
                style={{
                  backgroundColor: composerText.trim() ? '#7c3aed' : '#e2e8f0',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: composerText.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <span>Send</span>
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      </main>

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
          zIndex: 4300
        }}>
          <CheckCircle2 size={16} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
