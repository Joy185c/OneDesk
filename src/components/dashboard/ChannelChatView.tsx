import React, { useState } from 'react';
import { 
  Hash, 
  Send, 
  Users, 
  Paperclip, 
  Smile, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  avatarBg: string;
  initials: string;
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  general: [
    {
      id: 'cm-1',
      sender: 'Joy Kumar Yuv',
      avatarBg: '#059669',
      initials: 'JY',
      text: "👋 Welcome everyone to Joy Kumar Yuv's Workspace! We're kicking off the Q4 sprint for Sales CRM.",
      timestamp: '10:14 AM'
    },
    {
      id: 'cm-2',
      sender: 'Alex Rivera',
      avatarBg: '#7c3aed',
      initials: 'AR',
      text: "Awesome! The OAuth 2.0 PKCE flow task is in progress on the Board. Will submit for review soon.",
      timestamp: '10:18 AM'
    },
    {
      id: 'cm-3',
      sender: 'Sarah Chen',
      avatarBg: '#2563eb',
      initials: 'SC',
      text: "I've updated the whiteboard with the wireframe notes. Ready for the Design Sprint Feedback at 9:30 AM Wednesday.",
      timestamp: '10:25 AM'
    }
  ],
  welcome: [
    {
      id: 'cw-1',
      sender: 'ClickUp Brain',
      avatarBg: '#ff72e5',
      initials: 'AI',
      text: "Welcome to ClickUp 3.0! This workspace is pre-configured with Sales CRM pipeline, Kanban boards, Docs, and Time tracking.",
      timestamp: 'Yesterday'
    }
  ]
};

interface ChannelChatViewProps {
  channelKey: string;
}

export const ChannelChatView: React.FC<ChannelChatViewProps> = ({ channelKey }) => {
  const getInitialMessages = (key: string): ChatMessage[] => {
    try {
      const saved = localStorage.getItem(`clickup_channel_msgs_${key}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MESSAGES[key] || [
      {
        id: 'cm-init',
        sender: 'ClickUp Brain',
        avatarBg: '#ff72e5',
        initials: 'AI',
        text: `Welcome to #${key}! Start conversations, share files, and mention tasks here.`,
        timestamp: 'Just now'
      }
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages(channelKey));
  const [inputText, setInputText] = useState('');

  React.useEffect(() => {
    setMessages(getInitialMessages(channelKey));
  }, [channelKey]);

  React.useEffect(() => {
    try {
      localStorage.setItem(`clickup_channel_msgs_${channelKey}`, JSON.stringify(messages));
    } catch {}
  }, [messages, channelKey]);

  const channelName = channelKey === 'general' 
    ? "General - Joy Kumar Yuv's Workspace" 
    : channelKey === 'welcome' 
      ? 'Welcome' 
      : channelKey;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: 'cm-' + Date.now(),
      sender: 'Joy Kumar Yuv',
      avatarBg: '#059669',
      initials: 'JY',
      text: inputText,
      timestamp: 'Just now'
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
      backgroundColor: '#ffffff',
      overflow: 'hidden'
    }}>
      {/* Channel Header */}
      <div style={{
        padding: '14px 24px',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Hash size={18} color="#059669" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {channelName}
          </h2>
          <span style={{ fontSize: '0.74rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '100px' }}>
            3 Members
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748b' }}>
          <Users size={14} />
          <span>Joy, Alex, Sarah</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: msg.avatarBg,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem',
              flexShrink: 0
            }}>
              {msg.initials}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                  {msg.sender}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {msg.timestamp}
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: '1.4' }}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
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
          borderRadius: '10px',
          padding: '8px 14px',
          gap: '10px'
        }}>
          <input
            type="text"
            placeholder={`Message #${channelName}...`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              fontSize: '0.86rem',
              color: '#0f172a'
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              backgroundColor: inputText.trim() ? '#059669' : '#cbd5e1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: inputText.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
};
