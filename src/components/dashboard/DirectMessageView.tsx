import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Sparkles, 
  Bookmark, 
  Check, 
  Trash2, 
  Search, 
  Bot 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DmMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  isNote?: boolean;
}

interface DirectMessageViewProps {
  recipientName?: string;
  recipientInitials?: string;
}

export const DirectMessageView: React.FC<DirectMessageViewProps> = ({ 
  recipientName,
  recipientInitials
}) => {
  const { user } = useAuth();
  const currentUserName = user?.name || 'You';
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME';

  const effectiveRecipient = recipientName || `${currentUserName} — You`;
  const effectiveInitials = recipientInitials || userInitials;

  const defaultMessages: DmMessage[] = [
    {
      id: 'dm-1',
      sender: `${currentUserName} (You)`,
      avatar: userInitials,
      text: '💡 Personal Scratchpad: Need to follow up with team regarding custom SLA addendum on Monday morning.',
      timestamp: 'Today at 8:45 AM',
      isNote: true
    },
    {
      id: 'dm-2',
      sender: `${currentUserName} (You)`,
      avatar: userInitials,
      text: 'Reminder: Check Supabase websocket connection latency after the latest migration.',
      timestamp: 'Today at 9:12 AM',
      isNote: true
    }
  ];

  const getInitialDmMessages = (): DmMessage[] => {
    try {
      const saved = localStorage.getItem(`clickup_dm_msgs_${effectiveRecipient}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultMessages;
  };

  const [messages, setMessages] = useState<DmMessage[]>(getInitialDmMessages);

  useEffect(() => {
    setMessages(getInitialDmMessages());
  }, [effectiveRecipient]);

  useEffect(() => {
    try {
      localStorage.setItem(`clickup_dm_msgs_${effectiveRecipient}`, JSON.stringify(messages));
    } catch {}
  }, [messages, effectiveRecipient]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = messages.filter(m => 
    !searchQuery.trim() || m.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: DmMessage = {
      id: `dm-${Date.now()}`,
      sender: `${currentUserName} (You)`,
      avatar: userInitials,
      text: inputText.trim(),
      timestamp: 'Just now',
      isNote: true
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fafbfc', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '16px 28px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.85rem'
          }}>
            {effectiveInitials}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                {effectiveRecipient}
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700, backgroundColor: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
                Online
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Personal message space, scratchpad & quick to-do reminders.
            </p>
          </div>
        </div>

        {/* Search Messages */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '6px 12px',
          width: '200px'
        }}>
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.8rem',
              color: '#1e293b',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Message Flow Area */}
      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredMessages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              maxWidth: '750px',
              position: 'relative'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.74rem',
              flexShrink: 0
            }}>
              {msg.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                  {msg.sender}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {msg.timestamp}
                  </span>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    title="Delete message"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Message Footer */}
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: '16px 28px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #eaebf0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0
        }}
      >
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          padding: '8px 14px',
          gap: '10px'
        }}>
          <input
            type="text"
            placeholder="Type a personal note, task reminder, or draft message (Press Enter to save)..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.86rem',
              color: '#1e293b'
            }}
          />
          <button
            type="button"
            onClick={() => setInputText(prev => prev + ' 🚀 ')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            title="Emoji"
          >
            <Smile size={16} />
          </button>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
          }}
        >
          <span>Send</span>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
