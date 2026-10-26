import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Lock, 
  Users, 
  MoreHorizontal, 
  ChevronDown, 
  ArrowUpDown, 
  ExternalLink,
  Sparkles,
  Mic,
  Tag,
  ArrowRight,
  BookOpen,
  Calendar,
  X,
  Trash2,
  Share2,
  Download,
  Check,
  ChevronLeft,
  Edit2,
  CloudCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabaseService } from '../../services/supabaseService';
import { generateUUID } from '../../lib/uuid';

export interface DocItem {
  id: string;
  name: string;
  location: string;
  tags: string[];
  dateUpdated: string;
  dateViewed: string;
  isFavorite: boolean;
  content: string;
}

const DEFAULT_DOCS: DocItem[] = [
  {
    id: 'doc-welcome',
    name: 'Welcome',
    location: 'Sales CRM',
    tags: [],
    dateUpdated: 'Yesterday',
    dateViewed: '-',
    isFavorite: false,
    content: `# Welcome to ClickUp Workspace

Welcome to your team's centralized workspace. Here you can organize tasks, write collaborative documentation, run AI Super Agents, and coordinate sprint deliverables.

## Getting Started
1. **Sales CRM**: Manage your pipeline and deal stages.
2. **Docs Hub**: Document architectures, wikis, and meeting summaries.
3. **Whiteboards**: Brainstorm ideas on infinite collaborative canvas.
4. **Timesheets**: Track billable hours and submit for weekly approvals.`
  },
  {
    id: 'doc-meeting-agent',
    name: 'Meeting Agent Memory',
    location: 'Meeting Agent',
    tags: [],
    dateUpdated: '1 hour ago',
    dateViewed: '-',
    isFavorite: true,
    content: `# Meeting Agent Persistent Memory

This document stores the context, preferences, and action items recorded by the ClickUp Meeting Agent during voice and video calls.

### Recent Action Items
- [x] Finalize ClickUp 3.0 dark navigation rail.
- [x] Add Timesheets and Approvals workflow with 4-step onboarding.
- [ ] Connect Docs, Forms, Clips, and Goals hubs.`
  },
  {
    id: 'doc-team-docs-2',
    name: 'Team Docs 2',
    location: 'Team Space',
    tags: [],
    dateUpdated: 'Yesterday',
    dateViewed: '-',
    isFavorite: false,
    content: `# Team Space Documentation

Architecture guidelines, API schemas, and deployment checklists for engineering and product design teams.`
  }
];

export const DocsView: React.FC = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState<DocItem[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_saved_docs_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_DOCS;
  });

  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<'all' | 'my' | 'shared' | 'private' | 'meeting' | 'archived'>('all');
  const [aiPrompt, setAiPrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cloudSaveStatus, setCloudSaveStatus] = useState<'saved' | 'saving' | 'offline'>('saved');

  // Active doc editor states
  const activeDoc = docs.find(d => d.id === activeDocId);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load cloud docs on mount or user change
  useEffect(() => {
    let isMounted = true;
    supabaseService.getDocs(user?.id).then(({ docs: cloudDocs }) => {
      if (isMounted && cloudDocs && cloudDocs.length > 0) {
        setDocs(cloudDocs);
      }
    });
    return () => { isMounted = false; };
  }, [user?.id]);

  useEffect(() => {
    try {
      localStorage.setItem('clickup_saved_docs_v2', JSON.stringify(docs));
    } catch (e) {}
  }, [docs]);

  useEffect(() => {
    if (activeDoc) {
      setEditingTitle(activeDoc.name);
      setEditingContent(activeDoc.content);
    }
  }, [activeDocId]);

  // Debounced cloud autosave on content or title change
  useEffect(() => {
    if (!activeDocId) return;
    const currentDoc = docs.find(d => d.id === activeDocId);
    if (!currentDoc) return;
    if (currentDoc.name === editingTitle && currentDoc.content === editingContent) return;

    setCloudSaveStatus('saving');
    const timer = setTimeout(async () => {
      const res = await supabaseService.saveDoc({
        id: activeDocId,
        title: editingTitle,
        content: editingContent
      }, user?.id);

      if (res.success) {
        setCloudSaveStatus('saved');
        setDocs(prev => prev.map(d => d.id === activeDocId ? {
          ...d,
          name: editingTitle,
          content: editingContent,
          dateUpdated: 'Just now'
        } : d));
      } else {
        setCloudSaveStatus('offline');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [editingTitle, editingContent, activeDocId, user?.id]);

  const handleCreateDoc = async (initialTitle?: string, initialBody?: string) => {
    const title = initialTitle || 'Untitled Document';
    const docId = generateUUID();
    const newDoc: DocItem = {
      id: docId,
      name: title,
      location: 'Sales CRM',
      tags: [],
      dateUpdated: 'Just now',
      dateViewed: 'Just now',
      isFavorite: false,
      content: initialBody || `# ${title}\n\nStart writing your document here...`
    };

    setDocs(prev => [newDoc, ...prev]);
    setActiveDocId(newDoc.id);

    const res = await supabaseService.saveDoc({
      id: docId,
      title: newDoc.name,
      content: newDoc.content
    }, user?.id);

    if (res.success) {
      showToast(`✓ Created "${title}" in cloud!`);
    } else {
      showToast(`Created locally (Cloud sync notice: ${res.error || 'check network'})`);
    }
  };

  const handleSaveActiveDoc = async () => {
    if (!activeDocId) return;
    setCloudSaveStatus('saving');
    const res = await supabaseService.saveDoc({
      id: activeDocId,
      title: editingTitle,
      content: editingContent
    }, user?.id);

    if (res.success) {
      setCloudSaveStatus('saved');
      setDocs(prev => prev.map(d => {
        if (d.id === activeDocId) {
          return {
            ...d,
            name: editingTitle,
            content: editingContent,
            dateUpdated: 'Just now'
          };
        }
        return d;
      }));
      showToast('Document saved to cloud!');
    } else {
      showToast('Failed to save to cloud');
      setCloudSaveStatus('offline');
    }
  };

  const handleToggleFavorite = (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDocs(prev => prev.map(d => {
      if (d.id === docId) {
        const next = !d.isFavorite;
        showToast(next ? 'Added to Favorites ⭐' : 'Removed from Favorites');
        return { ...d, isFavorite: next };
      }
      return d;
    }));
  };

  const handleDeleteDoc = async (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDocs(prev => prev.filter(d => d.id !== docId));
    if (activeDocId === docId) {
      setActiveDocId(null);
    }
    await supabaseService.deleteDoc(docId);
    showToast('Document deleted from cloud');
  };

  const handleAiGenerateDoc = () => {
    if (!aiPrompt.trim()) return;
    const promptText = aiPrompt.trim();
    setAiPrompt('');
    showToast(`ClickUp Brain generating "${promptText}"...`);

    setTimeout(() => {
      handleCreateDoc(
        promptText,
        `# ${promptText}\n\nGenerated by ClickUp Brain 3.0\n\n## Overview\nThis guide outlines the standard operating procedures and best practices for ${promptText}.\n\n### Key Objectives\n- Streamline execution and quality assurance.\n- Coordinate deliverables across cross-functional team members.\n- Automate milestone tracking in CRM pipelines.`
      );
    }, 800);
  };

  // Filtered docs
  const filteredDocs = docs.filter(d => {
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (subTab === 'private' && !d.name.toLowerCase().includes('agent')) return false;
    if (subTab === 'meeting' && !d.name.toLowerCase().includes('meeting')) return false;
    return true;
  });

  const favoriteDocs = docs.filter(d => d.isFavorite);

  return (
    <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden', backgroundColor: '#fafbfc' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '10px',
          fontSize: '0.84rem',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={16} color="#c084fc" />
          {toastMessage}
        </div>
      )}

      {/* SUB-SIDEBAR (Matches Screenshot 4: Docs, All Docs, My Docs, Meeting Notes, Favorites, Recent) */}
      <aside style={{
        width: isSidebarCollapsed ? '48px' : '224px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #eaebf0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isSidebarCollapsed ? '14px 6px' : '14px 10px',
        flexShrink: 0,
        transition: 'width 0.2s ease',
        overflowY: 'auto'
      }}>
        <div>
          {/* Header row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            padding: '0 6px'
          }}>
            {!isSidebarCollapsed && (
              <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a' }}>
                Docs
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => handleCreateDoc('New Workspace Doc')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: isSidebarCollapsed ? '4px' : '4px 8px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Create Doc"
              >
                <Plus size={14} />
                {!isSidebarCollapsed && <span>Create</span>}
              </button>
            </div>
          </div>

          {/* Navigation Links (Screenshot 4) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { id: 'all', label: 'All Docs', icon: <FileText size={16} /> },
              { id: 'my', label: 'My Docs', count: '2', icon: <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#059669', color: '#ffffff', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>J</div> },
              { id: 'shared', label: 'Shared with me', icon: <Users size={16} /> },
              { id: 'private', label: 'Private', icon: <Lock size={16} /> },
              { id: 'meeting', label: 'Meeting Notes', color: '#a855f7', icon: <Sparkles size={16} color="#a855f7" /> },
              { id: 'archived', label: 'Archived', icon: <Tag size={16} /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setSubTab(item.id as any);
                  setActiveDocId(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: (subTab === item.id && !activeDocId) ? '#f1f5f9' : 'transparent',
                  color: item.color || ((subTab === item.id && !activeDocId) ? '#0f172a' : '#475569'),
                  fontWeight: (subTab === item.id && !activeDocId) ? 700 : 500,
                  fontSize: '0.84rem',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.icon}
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </div>
                {!isSidebarCollapsed && item.count && (
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{item.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Favorites (Screenshot 4) */}
          {!isSidebarCollapsed && (
            <div style={{ marginTop: '22px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', padding: '0 8px', marginBottom: '8px' }}>
                Favorites
              </div>

              {favoriteDocs.length === 0 ? (
                <div style={{
                  padding: '14px 10px',
                  borderRadius: '10px',
                  border: '1px dashed #cbd5e1',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '4px'
                }}>
                  <Star size={16} fill="#facc15" color="#facc15" />
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Star a Doc to see it here</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {favoriteDocs.map(fd => (
                    <div
                      key={fd.id}
                      onClick={() => setActiveDocId(fd.id)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#fefce8',
                        border: '1px solid #fef08a',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#854d0e',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fd.name}</span>
                      <Star size={12} fill="#eab308" color="#eab308" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Pages (Screenshot 4) */}
          {!isSidebarCollapsed && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', padding: '0 8px', marginBottom: '6px' }}>
                Recent Pages
              </div>
              <div
                onClick={() => setActiveDocId('doc-welcome')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#334155'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FileText size={14} color="#64748b" />
                <span>Welcome</span>
              </div>
            </div>
          )}

          {/* Popular Wikis (Screenshot 4) */}
          {!isSidebarCollapsed && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', padding: '0 8px', marginBottom: '6px' }}>
                Popular Wikis
              </div>
              <div style={{
                padding: '12px 10px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                fontSize: '0.72rem',
                color: '#64748b',
                textAlign: 'center'
              }}>
                Most viewed and active Wikis appear here
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      {!activeDoc ? (
        /* SCREENSHOT 4: DOCS HUB */
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {/* Header Title & Top Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              All Docs
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => showToast('Importing document from Markdown, Word or Notion...')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Import</span>
              </button>

              <button
                onClick={() => handleCreateDoc()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>New Doc</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* AI Document Generation Prompt Box (Screenshot 4) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '16px 20px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <button
                onClick={handleAiGenerateDoc}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
                title="Add or Generate with ClickUp Brain"
              >
                <Plus size={16} />
              </button>

              <input
                type="text"
                placeholder="Describe what you want to create..."
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAiGenerateDoc(); }}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.94rem',
                  color: '#0f172a',
                  fontWeight: 500
                }}
              />
            </div>

            <button
              onClick={() => showToast('Voice AI dictation listening...')}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}
              title="Voice to text"
            >
              <Mic size={18} />
            </button>
          </div>

          {/* 4 Quick Starter Chips (Screenshot 4) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
            {[
              { title: 'Sales Playbook', desc: 'Standardize sales steps' },
              { title: 'Lead Guide', desc: 'Qualify leads consistently' },
              { title: 'Discovery Guide', desc: 'Capture client needs' },
              { title: 'Handoff Guide', desc: 'Smooth post-sale delivery' }
            ].map(chip => (
              <div
                key={chip.title}
                onClick={() => handleCreateDoc(chip.title, `# ${chip.title}\n\n${chip.desc}\n\n## Table of Contents\n1. Target Audience\n2. Key Value Propositions\n3. Objection Handling\n4. Closing Timeline`)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#c084fc';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                  {chip.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {chip.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar (Screenshot 4) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => showToast('Filters active')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <SlidersHorizontal size={13} />
                <span>Filters</span>
              </button>

              <button
                onClick={() => setDocs([...docs].reverse())}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <ArrowUpDown size={13} />
                <span>Sort</span>
              </button>

              <span style={{ fontSize: '0.76rem', color: '#94a3b8', marginLeft: '6px' }}>Tags:</span>
            </div>

            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '4px 10px',
              width: '180px'
            }}>
              <Search size={13} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.78rem',
                  color: '#1e293b',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Docs Table (Screenshot 4) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eaebf0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            {/* Header row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(240px, 2fr) minmax(140px, 1.2fr) 100px 140px 140px 60px',
              borderBottom: '1px solid #eaebf0',
              backgroundColor: '#fafbfc',
              padding: '10px 18px',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#64748b'
            }}>
              <div>Name</div>
              <div>Location</div>
              <div>Tags</div>
              <div>Date updated</div>
              <div>Date viewed ⬇</div>
              <div />
            </div>

            {/* Document Rows */}
            {filteredDocs.map(doc => (
              <div
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(240px, 2fr) minmax(140px, 1.2fr) 100px 140px 140px 60px',
                  borderBottom: '1px solid #f1f5f9',
                  padding: '12px 18px',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafbfc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={16} color="#3b82f6" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                    {doc.name}
                  </span>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                  {doc.location.includes('CRM') ? (
                    <span style={{ color: '#7c3aed' }}># {doc.location}</span>
                  ) : doc.location.includes('Agent') ? (
                    <span style={{ color: '#ec4899' }}>🌸 {doc.location}</span>
                  ) : (
                    <span>📁 {doc.location}</span>
                  )}
                </div>

                {/* Tags */}
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  -
                </div>

                {/* Date updated */}
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  {doc.dateUpdated}
                </div>

                {/* Date viewed */}
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {doc.dateViewed}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                  <button
                    onClick={(e) => handleToggleFavorite(doc.id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                  >
                    <Star size={14} fill={doc.isFavorite ? '#eab308' : 'none'} color={doc.isFavorite ? '#eab308' : '#cbd5e1'} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteDoc(doc.id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94a3b8' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* FULL DOCUMENT EDITOR */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
          {/* Editor Header Bar */}
          <div style={{
            height: '52px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            backgroundColor: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setActiveDocId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ChevronLeft size={16} />
                <span>All Docs</span>
              </button>

              <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0' }} />

              <input
                type="text"
                value={editingTitle}
                onChange={e => setEditingTitle(e.target.value)}
                style={{
                  border: '1px solid transparent',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  outline: 'none'
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#c084fc'}
                onBlur={e => e.currentTarget.style.borderColor = 'transparent'}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleSaveActiveDoc}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Check size={14} />
                <span>Save</span>
              </button>

              <button
                onClick={() => showToast('Doc share link copied!')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Document Content Canvas */}
          <div style={{ flex: 1, padding: '32px 48px', overflowY: 'auto' }}>
            <textarea
              value={editingContent}
              onChange={e => setEditingContent(e.target.value)}
              placeholder="Start typing markdown content..."
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '0.94rem',
                lineHeight: 1.65,
                color: '#1e293b',
                fontFamily: 'inherit',
                resize: 'none',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
