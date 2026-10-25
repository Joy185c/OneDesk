import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Plus, 
  ThumbsUp, 
  Heart, 
  Rocket, 
  PartyPopper, 
  MessageSquare, 
  Send, 
  Share2, 
  Sparkles,
  X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PostItem {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  title: string;
  content: string;
  timestamp: string;
  badge?: string;
  reactions: {
    thumbsUp: number;
    heart: number;
    rocket: number;
    party: number;
  };
  userReactions: Record<string, boolean>;
  comments: Array<{
    id: string;
    author: string;
    avatar: string;
    text: string;
    time: string;
  }>;
}

const INITIAL_POSTS: PostItem[] = [
  {
    id: 'p-1',
    author: 'Joy Kumar Yuv',
    authorRole: 'Workspace Owner',
    avatar: 'JY',
    title: '🎉 Welcome to ClickUp 3.0 — The Everything App For Work!',
    badge: 'Announcement',
    content: 'We have successfully migrated our entire workspace to ClickUp 3.0! Enjoy custom navigation rails, real-time whiteboards, interactive calendar sprint planners, and ClickUp Brain AI integration.',
    timestamp: 'Today at 9:00 AM',
    reactions: { thumbsUp: 14, heart: 9, rocket: 22, party: 18 },
    userReactions: { thumbsUp: true, rocket: true },
    comments: [
      { id: 'c-1', author: 'Sarah Miller', avatar: 'SM', text: 'The new Planner view and timesheets are saving the sales team hours each week!', time: '9:15 AM' },
      { id: 'c-2', author: 'Alex Chen', avatar: 'AC', text: 'AI task generator inside Brain is pure magic.', time: '9:30 AM' }
    ]
  },
  {
    id: 'p-2',
    author: 'Sarah Miller',
    authorRole: 'Head of Sales',
    avatar: 'SM',
    title: '🚀 Q4 Target Milestone: $250k ARR Pipeline Achieved!',
    badge: 'Company Milestone',
    content: 'Huge congratulations to the team! Our Sales CRM Space has processed 7 high-value enterprise deals this month. The automated webhook leads workflow is running flawlessly.',
    timestamp: 'Yesterday at 3:30 PM',
    reactions: { thumbsUp: 28, heart: 16, rocket: 34, party: 25 },
    userReactions: { party: true },
    comments: [
      { id: 'c-3', author: 'Joy Kumar Yuv', avatar: 'JY', text: 'Incredible execution team! Let us push hard for the enterprise renewals next.', time: '4:00 PM' }
    ]
  }
];

export const PostsView: React.FC = () => {
  const { user } = useAuth();
  const isDemoUser = user?.id === 'u_joy_1';
  const currentUserName = user?.name || 'Workspace Owner';
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'WO';
  const workspaceName = user?.workspaceName || 'My Team Workspace';

  const defaultNewUserPosts: PostItem[] = [
    {
      id: 'p-welcome',
      author: currentUserName,
      authorRole: 'Workspace Owner',
      avatar: userInitials,
      title: `🎉 Welcome to ${workspaceName}!`,
      badge: 'Announcement',
      content: 'Your centralized workspace is live. You can share company updates, celebrate milestones, and collaborate with your team right here.',
      timestamp: 'Just now',
      reactions: { thumbsUp: 1, heart: 1, rocket: 1, party: 1 },
      userReactions: { rocket: true },
      comments: []
    }
  ];

  const [posts, setPosts] = useState<PostItem[]>(() => {
    try {
      const storageKey = isDemoUser ? 'clickup_posts_v1' : `clickup_posts_${user?.id || 'guest'}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
      return isDemoUser ? INITIAL_POSTS : defaultNewUserPosts;
    } catch {}
    return isDemoUser ? INITIAL_POSTS : defaultNewUserPosts;
  });

  useEffect(() => {
    try {
      const storageKey = isDemoUser ? 'clickup_posts_v1' : `clickup_posts_${user?.id || 'guest'}`;
      localStorage.setItem(storageKey, JSON.stringify(posts));
    } catch {}
  }, [posts, user?.id, isDemoUser]);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newBadge, setNewBadge] = useState('Update');
  const [commentInputMap, setCommentInputMap] = useState<Record<string, string>>({});

  const toggleReaction = (postId: string, reactionType: 'thumbsUp' | 'heart' | 'rocket' | 'party') => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const alreadyReacted = p.userReactions[reactionType];
      return {
        ...p,
        reactions: {
          ...p.reactions,
          [reactionType]: alreadyReacted ? p.reactions[reactionType] - 1 : p.reactions[reactionType] + 1
        },
        userReactions: {
          ...p.userReactions,
          [reactionType]: !alreadyReacted
        }
      };
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputMap[postId];
    if (!text || !text.trim()) return;

    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: [
          ...p.comments,
          {
            id: `c-${Date.now()}`,
            author: 'Joy Kumar Yuv (You)',
            avatar: 'JY',
            text: text.trim(),
            time: 'Just now'
          }
        ]
      };
    }));

    setCommentInputMap(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: PostItem = {
      id: `p-${Date.now()}`,
      author: currentUserName,
      authorRole: 'Workspace Owner',
      avatar: userInitials,
      title: newTitle.trim(),
      badge: newBadge,
      content: newContent.trim(),
      timestamp: 'Just now',
      reactions: { thumbsUp: 1, heart: 0, rocket: 1, party: 0 },
      userReactions: { thumbsUp: true },
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsNewPostModalOpen(false);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fafbfc', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        padding: '16px 28px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaebf0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a'
          }}>
            <Megaphone size={20} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Workspace Posts & Announcements
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Company-wide updates, milestones, and releases for Joy Kumar Yuv's Workspace.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewPostModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
          }}
        >
          <Plus size={15} />
          <span>New Post</span>
        </button>
      </div>

      {/* Posts Stream */}
      <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '850px' }}>
        {posts.map(post => (
          <div
            key={post.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* Author info & Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.78rem'
                }}>
                  {post.avatar}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                      {post.author}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 600, backgroundColor: '#f5f3ff', padding: '1px 6px', borderRadius: '4px' }}>
                      {post.authorRole}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    {post.timestamp}
                  </span>
                </div>
              </div>

              {post.badge && (
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#0d9488',
                  backgroundColor: '#ccfbf1',
                  padding: '3px 10px',
                  borderRadius: '100px'
                }}>
                  {post.badge}
                </span>
              )}
            </div>

            {/* Post Title & Content */}
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                {post.title}
              </h2>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {post.content}
              </p>
            </div>

            {/* Reactions Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingTop: '10px',
              borderTop: '1px solid #f1f5f9'
            }}>
              {[
                { type: 'thumbsUp' as const, icon: <ThumbsUp size={13} />, count: post.reactions.thumbsUp, emoji: '👍' },
                { type: 'heart' as const, icon: <Heart size={13} />, count: post.reactions.heart, emoji: '❤️' },
                { type: 'rocket' as const, icon: <Rocket size={13} />, count: post.reactions.rocket, emoji: '🚀' },
                { type: 'party' as const, icon: <PartyPopper size={13} />, count: post.reactions.party, emoji: '🎉' }
              ].map(r => (
                <button
                  key={r.type}
                  onClick={() => toggleReaction(post.id, r.type)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: post.userReactions[r.type] ? '#f5f3ff' : '#f8fafc',
                    border: post.userReactions[r.type] ? '1px solid #c4b5fd' : '1px solid #e2e8f0',
                    color: post.userReactions[r.type] ? '#7c3aed' : '#64748b',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{r.emoji}</span>
                  <span>{r.count}</span>
                </button>
              ))}
            </div>

            {/* Comments Thread */}
            {post.comments.length > 0 && (
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {post.comments.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {c.avatar}
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{c.author}:</span>{' '}
                      <span style={{ color: '#334155' }}>{c.text}</span>{' '}
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>({c.time})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInputMap[post.id] || ''}
                onChange={e => setCommentInputMap({ ...commentInputMap, [post.id]: e.target.value })}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddComment(post.id);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  fontSize: '0.82rem',
                  outline: 'none',
                  color: '#1e293b'
                }}
              />
              <button
                onClick={() => handleAddComment(post.id)}
                style={{
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Reply</span>
                <Send size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Creator Modal */}
      {isNewPostModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3500
        }}>
          <div style={{
            width: '480px',
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
                <Megaphone size={18} color="#7c3aed" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Create Workspace Post
                </h3>
              </div>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Post Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. 🚀 Q4 Product Launch Highlights"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Announcement Category
                </label>
                <select
                  value={newBadge}
                  onChange={e => setNewBadge(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Company Milestone">Company Milestone</option>
                  <option value="Product Release">Product Release</option>
                  <option value="Team Shoutout">Team Shoutout</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Message Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details, next steps, and praise with the team..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.82rem',
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
                    backgroundColor: '#7c3aed',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
