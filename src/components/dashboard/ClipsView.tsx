import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Mic,
  Play,
  Pause,
  Square,
  Circle,
  Share2,
  Trash2,
  Search,
  SlidersHorizontal,
  Plus,
  Sparkles,
  X,
  Clock,
  Copy,
  Film,
  Monitor,
  MoreHorizontal,
  ChevronRight,
  Eye,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

export interface ClipItem {
  id: string;
  title: string;
  type: 'video' | 'voice' | 'syncup';
  durationSeconds: number;
  createdAt: string;
  author: string;
  authorInitials: string;
  views: number;
  commentsCount: number;
  thumbnailGradient: string;
  transcript: string;
  tags: string[];
}

const DEFAULT_CLIPS: ClipItem[] = [
  {
    id: 'clip-1',
    title: 'Q4 Pipeline & Sales CRM Walkthrough',
    type: 'video',
    durationSeconds: 142,
    createdAt: 'Today at 10:45 AM',
    author: 'Joy Kumar Yuv',
    authorInitials: 'JY',
    views: 12,
    commentsCount: 3,
    thumbnailGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    transcript: 'Welcome everyone! In this clip I quickly walk through the new Deals stage in our Sales CRM pipeline. The qualified leads have jumped by 34% this sprint.',
    tags: ['Sales CRM', 'Sprint Walkthrough']
  },
  {
    id: 'clip-2',
    title: 'Voice Note: Standup Highlights & Blockers',
    type: 'voice',
    durationSeconds: 68,
    createdAt: 'Yesterday at 5:12 PM',
    author: 'Joy Kumar Yuv',
    authorInitials: 'JY',
    views: 8,
    commentsCount: 1,
    thumbnailGradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    transcript: 'Quick update: backend Supabase schema synchronization is completed. Frontend components for Docs, Forms, and Clips are deployed.',
    tags: ['Engineering', 'Standup']
  }
];

export const ClipsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'video' | 'voice' | 'syncups' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [clips, setClips] = useState<ClipItem[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_clips_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CLIPS;
  });

  // Live Recording Studio Modal state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordMode, setRecordMode] = useState<'screen' | 'camera' | 'voice'>('screen');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Review / Preview clip state
  const [previewClip, setPreviewClip] = useState<ClipItem | null>(null);
  const [newClipTitle, setNewClipTitle] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist clips
  useEffect(() => {
    try {
      localStorage.setItem('clickup_clips_v1', JSON.stringify(clips));
    } catch {}
  }, [clips]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Preview playback simulation
  useEffect(() => {
    let playInterval: number | null = null;
    if (isPlayingPreview && previewClip) {
      playInterval = window.setInterval(() => {
        setPreviewTime(t => {
          if (t >= previewClip.durationSeconds) {
            setIsPlayingPreview(false);
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => {
      if (playInterval) clearInterval(playInterval);
    };
  }, [isPlayingPreview, previewClip]);

  const handleStartCountdown = () => {
    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown(c => {
        if (c === null || c <= 1) {
          clearInterval(countInterval);
          setIsRecording(true);
          setRecordSeconds(0);
          return null;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const dur = Math.max(recordSeconds, 6);
    const autoTitle = recordMode === 'voice' 
      ? `Voice Memo - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` 
      : `Screen Recording - ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    
    const draftClip: ClipItem = {
      id: 'clip-' + Date.now(),
      title: autoTitle,
      type: recordMode === 'voice' ? 'voice' : 'video',
      durationSeconds: dur,
      createdAt: 'Just now',
      author: 'Joy Kumar Yuv',
      authorInitials: 'JY',
      views: 1,
      commentsCount: 0,
      thumbnailGradient: recordMode === 'voice' 
        ? 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' 
        : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      transcript: 'Automated AI transcript generated: "Sharing a quick update on current sprint progress and next deliverables for the team."',
      tags: ['New Clip', recordMode === 'voice' ? 'Audio' : 'Video Walkthrough']
    };

    setPreviewClip(draftClip);
    setNewClipTitle(draftClip.title);
    setIsRecordModalOpen(false);
  };

  const handleSavePreviewClip = () => {
    if (!previewClip) return;
    const finalClip: ClipItem = {
      ...previewClip,
      title: newClipTitle.trim() || previewClip.title
    };
    setClips([finalClip, ...clips]);
    setPreviewClip(null);
    showToast(`Clip "${finalClip.title}" saved successfully!`);
  };

  const handleDeleteClip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setClips(clips.filter(c => c.id !== id));
    showToast('Clip deleted');
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  const filteredClips = clips.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.transcript.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeSubTab === 'video') return c.type === 'video';
    if (activeSubTab === 'voice') return c.type === 'voice';
    if (activeSubTab === 'syncups') return c.type === 'syncup';
    return true;
  });

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      {/* 1. Left Clips Sub-Sidebar (Screenshot 6 1:1) */}
      <aside style={{
        width: '230px',
        backgroundColor: '#fafbfc',
        borderRight: '1px solid #eaebf0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 12px',
        flexShrink: 0
      }}>
        <div>
          {/* Header: Clips title + more */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                backgroundColor: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Video size={14} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a' }}>Clips</span>
            </div>
            <button
              onClick={() => showToast('Clips Hub Options: All settings synced')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
            >
              <MoreHorizontal size={16} />
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
            marginBottom: '14px'
          }}>
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search clips..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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

          {/* Nav Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div
              onClick={() => setActiveSubTab('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'all' ? 700 : 500,
                color: activeSubTab === 'all' ? '#7c3aed' : '#475569',
                backgroundColor: activeSubTab === 'all' ? '#f5f3ff' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={15} color={activeSubTab === 'all' ? '#7c3aed' : '#64748b'} />
                <span>All Clips</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{clips.length}</span>
            </div>

            <div
              onClick={() => setActiveSubTab('video')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'video' ? 700 : 500,
                color: activeSubTab === 'video' ? '#7c3aed' : '#475569',
                backgroundColor: activeSubTab === 'video' ? '#f5f3ff' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={15} color={activeSubTab === 'video' ? '#7c3aed' : '#64748b'} />
                <span>Video Clips</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {clips.filter(c => c.type === 'video').length}
              </span>
            </div>

            <div
              onClick={() => setActiveSubTab('voice')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'voice' ? 700 : 500,
                color: activeSubTab === 'voice' ? '#7c3aed' : '#475569',
                backgroundColor: activeSubTab === 'voice' ? '#f5f3ff' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic size={15} color={activeSubTab === 'voice' ? '#7c3aed' : '#64748b'} />
                <span>Voice Clips</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {clips.filter(c => c.type === 'voice').length}
              </span>
            </div>

            <div
              onClick={() => setActiveSubTab('syncups')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'syncups' ? 700 : 500,
                color: activeSubTab === 'syncups' ? '#7c3aed' : '#475569',
                backgroundColor: activeSubTab === 'syncups' ? '#f5f3ff' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Play size={15} color={activeSubTab === 'syncups' ? '#7c3aed' : '#64748b'} />
                <span>SyncUps</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>0</span>
            </div>

            <div
              onClick={() => setActiveSubTab('ai')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'ai' ? 700 : 500,
                color: activeSubTab === 'ai' ? '#7c3aed' : '#475569',
                backgroundColor: activeSubTab === 'ai' ? '#f5f3ff' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={15} color="#ec4899" />
                <span>AI Notetaker</span>
              </div>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                backgroundColor: '#fdf2f8',
                color: '#db2777',
                padding: '1px 6px',
                borderRadius: '10px'
              }}>
                NEW
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Quick Record Helper */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Sparkles size={14} color="#7c3aed" />
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a' }}>ClickUp Brain AI</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
            Clips are automatically transcribed and searchable across your entire workspace.
          </p>
        </div>
      </aside>

      {/* 2. Main Area (Screenshot 6 1:1) */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', backgroundColor: '#ffffff' }}>
        {/* Top Header */}
        <div style={{
          padding: '16px 28px',
          borderBottom: '1px solid #eaebf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {activeSubTab === 'all' && 'All Clips'}
              {activeSubTab === 'video' && 'Video Clips'}
              {activeSubTab === 'voice' && 'Voice Clips'}
              {activeSubTab === 'syncups' && 'SyncUps'}
              {activeSubTab === 'ai' && 'AI Notetaker Transcripts'}
            </h1>
            <span style={{
              fontSize: '0.76rem',
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 600
            }}>
              {filteredClips.length} {filteredClips.length === 1 ? 'Clip' : 'Clips'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => showToast('Filters applied: Showing recent clips first')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              <SlidersHorizontal size={14} />
              <span>Filter</span>
            </button>

            {/* Black [ New Clip ] Button matching Screenshot 1:1 */}
            <button
              onClick={() => {
                setRecordMode('screen');
                setIsRecordModalOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 16px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
              }}
            >
              <Video size={15} />
              <span>New Clip</span>
            </button>
          </div>
        </div>

        {/* Hero Showcase Cards (Screenshot 6 1:1: Record in a snap, Unlock async productivity, Watch share collaborate) */}
        <div style={{ padding: '24px 28px 12px 28px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '28px'
          }}>
            {/* Card 1 */}
            <div style={{
              backgroundColor: '#fbfbfe',
              border: '1px solid #ede9fe',
              borderRadius: '14px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.04)'
            }}>
              <div>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}>
                  <Monitor size={20} />
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                  Record in a snap
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  Record your screen, voice, or face with just one click. No extra software or extensions needed.
                </p>
              </div>
              <div 
                onClick={() => { setRecordMode('screen'); setIsRecordModalOpen(true); }}
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#7c3aed',
                  cursor: 'pointer'
                }}
              >
                <span>Try recording</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Card 2 */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #dcfce7',
              borderRadius: '14px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.04)'
            }}>
              <div>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}>
                  <Sparkles size={20} />
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                  Unlock async productivity
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  Say goodbye to unnecessary meetings. Share video walk-throughs in tasks, comments, and channels.
                </p>
              </div>
              <div 
                onClick={() => { setRecordMode('voice'); setIsRecordModalOpen(true); }}
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#16a34a',
                  cursor: 'pointer'
                }}
              >
                <span>Record voice memo</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Card 3 */}
            <div style={{
              backgroundColor: '#fdf2f8',
              border: '1px solid #fce7f3',
              borderRadius: '14px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(236, 72, 153, 0.04)'
            }}>
              <div>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#db2777',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}>
                  <Share2 size={20} />
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                  Watch, share, collaborate
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  Automatic AI transcripts, timestamps, and timestamped comments right on the video timeline.
                </p>
              </div>
              <div 
                onClick={() => showToast('AI transcript feature active on all recorded clips')}
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#db2777',
                  cursor: 'pointer'
                }}
              >
                <span>Explore AI summaries</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>

          {/* Clips List / Grid or Empty State matching Screenshot 6 */}
          {filteredClips.length === 0 ? (
            /* Screenshot 6 Empty State: Create your first Clip! */
            <div style={{
              border: '2px dashed #e2e8f0',
              borderRadius: '16px',
              padding: '60px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              backgroundColor: '#fafbfc'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15)'
              }}>
                <Video size={30} />
              </div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Create your first Clip!
              </h2>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.88rem', color: '#64748b', maxWidth: '420px', lineHeight: 1.5 }}>
                Record your screen or webcam to share updates, report bugs, or give feedback in seconds.
              </p>
              <button
                onClick={() => {
                  setRecordMode('screen');
                  setIsRecordModalOpen(true);
                }}
                style={{
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 24px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                }}
              >
                <Plus size={16} />
                <span>Create Clip</span>
              </button>
            </div>
          ) : (
            /* Clips Active Grid */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                  Workspace Clips Library
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Showing {filteredClips.length} items
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '18px',
                marginBottom: '40px'
              }}>
                {filteredClips.map(clip => (
                  <div
                    key={clip.id}
                    onClick={() => {
                      setPreviewClip(clip);
                      setNewClipTitle(clip.title);
                      setPreviewTime(0);
                      setIsPlayingPreview(false);
                    }}
                    style={{
                      border: '1px solid #eaebf0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                    }}
                  >
                    {/* Thumbnail banner */}
                    <div style={{
                      height: '140px',
                      background: clip.thumbnailGradient,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.92)',
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}>
                        <Play size={20} fill="#0f172a" style={{ marginLeft: '2px' }} />
                      </div>

                      {/* Duration pill */}
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={11} />
                        <span>{formatSeconds(clip.durationSeconds)}</span>
                      </div>

                      {/* Type badge */}
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#0f172a',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        textTransform: 'capitalize'
                      }}>
                        {clip.type === 'voice' ? <Mic size={11} color="#0284c7" /> : <Video size={11} color="#7c3aed" />}
                        <span>{clip.type} Clip</span>
                      </div>
                    </div>

                    {/* Metadata body */}
                    <div style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                          {clip.title}
                        </h4>
                        <button
                          onClick={e => handleDeleteClip(clip.id, e)}
                          title="Delete Clip"
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <p style={{ margin: '0 0 12px 0', fontSize: '0.76rem', color: '#64748b', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {clip.transcript}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {clip.authorInitials}
                          </div>
                          <span style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>
                            {clip.author}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem', color: '#94a3b8' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Eye size={12} /> {clip.views}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <MessageSquare size={12} /> {clip.commentsCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Live Screen & Audio Recording Modal */}
      {isRecordModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3600
        }}>
          <div style={{
            width: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Video size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    ClickUp Clip Studio
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b' }}>
                    Record your screen, voice, and webcam in HD
                  </p>
                </div>
              </div>

              {!isRecording && (
                <button
                  onClick={() => setIsRecordModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Mode selection tabs */}
            {!isRecording && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                backgroundColor: '#f8fafc',
                padding: '6px',
                borderRadius: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => setRecordMode('screen')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: recordMode === 'screen' ? '#ffffff' : 'transparent',
                    color: recordMode === 'screen' ? '#7c3aed' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: recordMode === 'screen' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <Monitor size={15} />
                  <span>Screen + Mic</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecordMode('camera')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: recordMode === 'camera' ? '#ffffff' : 'transparent',
                    color: recordMode === 'camera' ? '#7c3aed' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: recordMode === 'camera' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <Video size={15} />
                  <span>Camera only</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecordMode('voice')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: recordMode === 'voice' ? '#ffffff' : 'transparent',
                    color: recordMode === 'voice' ? '#7c3aed' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: recordMode === 'voice' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <Mic size={15} />
                  <span>Voice Memo</span>
                </button>
              </div>
            )}

            {/* Live Visualizer Stage */}
            <div style={{
              height: '200px',
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {countdown !== null ? (
                <div style={{
                  fontSize: '4rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  animation: 'pulse 0.8s infinite'
                }}>
                  {countdown}
                </div>
              ) : isRecording ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%', padding: '0 20px' }}>
                  {/* Live recording indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      animation: 'pulse 1s infinite'
                    }} />
                    <span style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, fontFamily: 'monospace' }}>
                      {formatSeconds(recordSeconds)}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      REC {recordMode}
                    </span>
                  </div>

                  {/* Audio visualizer bar animations */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '40px' }}>
                    {[18, 32, 14, 28, 40, 22, 36, 12, 30, 26, 38, 20, 34, 16, 24].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          width: '4px',
                          height: isPaused ? '8px' : `${h}px`,
                          backgroundColor: i % 2 === 0 ? '#7c3aed' : '#ec4899',
                          borderRadius: '2px',
                          transition: 'height 0.15s ease'
                        }}
                      />
                    ))}
                  </div>

                  <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                    {isPaused ? 'Recording paused' : 'ClickUp Brain is capturing live audio & transcribing...'}
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                  {recordMode === 'voice' ? <Mic size={40} color="#7c3aed" /> : <Monitor size={40} color="#7c3aed" />}
                  <span style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 600 }}>
                    Ready to record {recordMode === 'voice' ? 'Voice Memo' : 'Screen & Audio'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Microphone: Default System Audio • 1080p Full HD
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px' }}>
              {!isRecording ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsRecordModalOpen(false)}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleStartCountdown}
                    disabled={countdown !== null}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '9px 24px',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      cursor: countdown !== null ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <Circle size={14} fill="#ffffff" />
                    <span>Start Recording</span>
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => setIsPaused(!isPaused)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 16px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#1e293b',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStopRecording}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '9px 24px',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)'
                    }}
                  >
                    <Square size={14} fill="#ffffff" />
                    <span>Finish & Save</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Preview / Review Modal */}
      {previewClip && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3700
        }}>
          <div style={{
            width: '640px',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={18} color="#7c3aed" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Clip Preview & Details
                </h3>
              </div>
              <button
                onClick={() => setPreviewClip(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Player Mockup with working controls */}
            <div style={{
              height: '240px',
              background: previewClip.thumbnailGradient,
              borderRadius: '12px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '14px',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  {formatSeconds(previewTime)} / {formatSeconds(previewClip.durationSeconds)}
                </span>
              </div>

              {/* Center Play button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    color: '#0f172a',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
                  }}
                >
                  {isPlayingPreview ? <Pause size={24} fill="#0f172a" /> : <Play size={24} fill="#0f172a" style={{ marginLeft: '3px' }} />}
                </button>
              </div>

              {/* Progress bar */}
              <div style={{
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(previewTime / previewClip.durationSeconds) * 100}%`,
                  backgroundColor: '#ffffff',
                  transition: 'width 0.2s linear'
                }} />
              </div>
            </div>

            {/* Title edit */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Clip Title
              </label>
              <input
                type="text"
                value={newClipTitle}
                onChange={e => setNewClipTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* AI Transcript */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Sparkles size={14} color="#7c3aed" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>AI Transcript</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
                {previewClip.transcript}
              </p>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/hubs/clips/' + previewClip.id);
                  showToast('Share link copied to clipboard!');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  color: '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Copy size={14} />
                <span>Copy Link</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setPreviewClip(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSavePreviewClip}
                  style={{
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
                  }}
                >
                  Save Clip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
          zIndex: 4000
        }}>
          <CheckCircle2 size={16} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
