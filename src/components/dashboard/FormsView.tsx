import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  ArrowUpDown, 
  Star, 
  Trash2, 
  Share2, 
  Eye, 
  Check, 
  Mic, 
  Sparkles, 
  X,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabaseService } from '../../services/supabaseService';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'dropdown' | 'rating' | 'date';
  required: boolean;
  options?: string[];
}

export interface FormItem {
  id: string;
  name: string;
  description: string;
  location: string;
  createdBy: string;
  dateViewed: string;
  isFavorite: boolean;
  fields: FormField[];
  responsesCount: number;
}

export const FormsView: React.FC = () => {
  const { user } = useAuth();
  const currentUserName = user?.name || 'Workspace Member';

  const [forms, setForms] = useState<FormItem[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_saved_forms_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [subTab, setSubTab] = useState<'all' | 'my'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Builder states
  const [formTitle, setFormTitle] = useState('New Form');
  const [formDesc, setFormDesc] = useState('Collect requests and automatically route them to tasks.');
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: 'f-1', label: 'Full Name', type: 'text', required: true },
    { id: 'f-2', label: 'Work Email', type: 'email', required: true },
    { id: 'f-3', label: 'Project Description / Needs', type: 'textarea', required: false }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cloud sync for Forms
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { forms: cloudForms } = await supabaseService.getForms(user?.id);
      if (mounted && cloudForms && cloudForms.length > 0) {
        setForms(cloudForms);
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  useEffect(() => {
    try {
      localStorage.setItem('clickup_saved_forms_v1', JSON.stringify(forms));
    } catch (e) {}
  }, [forms]);

  const handleOpenBuilderWithTemplate = (title: string, desc: string, fields: FormField[]) => {
    setFormTitle(title);
    setFormDesc(desc);
    setFormFields(fields);
    setActiveFormId(null);
    setIsBuilderOpen(true);
  };

  const handleSaveForm = () => {
    if (!formTitle.trim()) {
      showToast('Please enter a form title');
      return;
    }

    const newForm: FormItem = {
      id: activeFormId || 'form-' + Date.now(),
      name: formTitle.trim(),
      description: formDesc.trim(),
      location: 'Sales CRM',
      createdBy: currentUserName,
      dateViewed: 'Just now',
      isFavorite: false,
      fields: formFields,
      responsesCount: 0
    };

    if (activeFormId) {
      setForms(forms.map(f => f.id === activeFormId ? newForm : f));
      supabaseService.saveForm(newForm, user?.id);
      showToast(`Updated form "${newForm.name}"!`);
    } else {
      setForms([newForm, ...forms]);
      supabaseService.saveForm(newForm, user?.id);
      showToast(`Created form "${newForm.name}"!`);
    }

    setIsBuilderOpen(false);
  };

  const handleAddField = (type: FormField['type']) => {
    const newF: FormField = {
      id: 'f-' + Date.now(),
      label: `Field ${formFields.length + 1}`,
      type,
      required: false,
      options: type === 'dropdown' ? ['Option 1', 'Option 2', 'Option 3'] : undefined
    };
    setFormFields([...formFields, newF]);
    showToast(`Added ${type} field`);
  };

  const handleDeleteField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  const handleDeleteForm = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setForms(forms.filter(f => f.id !== id));
    supabaseService.deleteForm(id);
    showToast('Form deleted');
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setForms(forms.map(f => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f));
    showToast('Favorite updated ⭐');
  };

  const filteredForms = forms.filter(f => {
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const favoriteForms = forms.filter(f => f.isFavorite);

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

      {/* SUB-SIDEBAR (Matches Screenshot 5) */}
      <aside style={{
        width: '224px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #eaebf0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '14px 10px',
        flexShrink: 0
      }}>
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '0 6px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a' }}>Forms</span>
            <button
              onClick={() => {
                setFormTitle('New Form');
                setFormDesc('Collect requests and feedback.');
                setFormFields([
                  { id: 'f-1', label: 'Full Name', type: 'text', required: true },
                  { id: 'f-2', label: 'Work Email', type: 'email', required: true }
                ]);
                setActiveFormId(null);
                setIsBuilderOpen(true);
              }}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Create new form"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Sub tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button
              onClick={() => setSubTab('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: subTab === 'all' ? '#f1f5f9' : 'transparent',
                color: subTab === 'all' ? '#0f172a' : '#475569',
                fontWeight: subTab === 'all' ? 700 : 500,
                fontSize: '0.84rem',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <ClipboardList size={16} />
              <span>All Forms</span>
            </button>

            <button
              onClick={() => setSubTab('my')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: subTab === 'my' ? '#f1f5f9' : 'transparent',
                color: subTab === 'my' ? '#0f172a' : '#475569',
                fontWeight: subTab === 'my' ? 700 : 500,
                fontSize: '0.84rem',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#059669', color: '#ffffff', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                J
              </div>
              <span>My Forms</span>
            </button>
          </div>

          {/* Favorites (Screenshot 5) */}
          <div style={{ marginTop: '22px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', padding: '0 8px', marginBottom: '8px' }}>
              Favorites
            </div>

            {favoriteForms.length === 0 ? (
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
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Star a Form to see it here</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {favoriteForms.map(ff => (
                  <div
                    key={ff.id}
                    onClick={() => {
                      setFormTitle(ff.name);
                      setFormDesc(ff.description);
                      setFormFields(ff.fields);
                      setActiveFormId(ff.id);
                      setIsBuilderOpen(true);
                    }}
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
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ff.name}</span>
                    <Star size={12} fill="#eab308" color="#eab308" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN VIEW AREA (Matches Screenshot 5) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        {/* AI Form Generation Prompt Box (Screenshot 5) */}
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
              onClick={() => {
                if (!aiPrompt.trim()) return;
                handleOpenBuilderWithTemplate(aiPrompt.trim(), 'Form generated by ClickUp Brain 3.0', [
                  { id: 'f-1', label: 'Contact Name', type: 'text', required: true },
                  { id: 'f-2', label: 'Company / Organization', type: 'text', required: true },
                  { id: 'f-3', label: 'Email', type: 'email', required: true },
                  { id: 'f-4', label: 'Inquiry Details', type: 'textarea', required: true }
                ]);
                setAiPrompt('');
              }}
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
              onKeyDown={e => {
                if (e.key === 'Enter' && aiPrompt.trim()) {
                  handleOpenBuilderWithTemplate(aiPrompt.trim(), 'Form generated by ClickUp Brain 3.0', [
                    { id: 'f-1', label: 'Contact Name', type: 'text', required: true },
                    { id: 'f-2', label: 'Company / Organization', type: 'text', required: true },
                    { id: 'f-3', label: 'Email', type: 'email', required: true },
                    { id: 'f-4', label: 'Inquiry Details', type: 'textarea', required: true }
                  ]);
                  setAiPrompt('');
                }
              }}
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
          >
            <Mic size={18} />
          </button>
        </div>

        {/* 4 Template Chips (Screenshot 5) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {[
            {
              title: 'Lead Intake',
              desc: 'Capture and qualify prospects',
              fields: [
                { id: 'f-1', label: 'Lead Name', type: 'text', required: true },
                { id: 'f-2', label: 'Company', type: 'text', required: true },
                { id: 'f-3', label: 'Work Email', type: 'email', required: true },
                { id: 'f-4', label: 'Estimated Budget', type: 'dropdown', required: false, options: ['< $5k', '$5k - $25k', '$25k+'] }
              ]
            },
            {
              title: 'Demo Request',
              desc: 'Book sales demos faster',
              fields: [
                { id: 'f-1', label: 'Your Name', type: 'text', required: true },
                { id: 'f-2', label: 'Work Email', type: 'email', required: true },
                { id: 'f-3', label: 'Preferred Date & Time', type: 'date', required: true },
                { id: 'f-4', label: 'Team Size', type: 'dropdown', required: false, options: ['1-10', '10-50', '50+'] }
              ]
            },
            {
              title: 'Scoping Request',
              desc: 'Gather technical needs',
              fields: [
                { id: 'f-1', label: 'Project Name', type: 'text', required: true },
                { id: 'f-2', label: 'Tech Stack & Requirements', type: 'textarea', required: true },
                { id: 'f-3', label: 'Deadline', type: 'date', required: true }
              ]
            },
            {
              title: 'Deal Handoff',
              desc: 'Streamline won-deal kickoff',
              fields: [
                { id: 'f-1', label: 'Account Name', type: 'text', required: true },
                { id: 'f-2', label: 'Contract Value', type: 'text', required: true },
                { id: 'f-3', label: 'Key Deliverables', type: 'textarea', required: true }
              ]
            }
          ].map(chip => (
            <div
              key={chip.title}
              onClick={() => handleOpenBuilderWithTemplate(chip.title, chip.desc, chip.fields as any)}
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

        {/* Toolbar: Sort + Search (Screenshot 5) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <button
            onClick={() => setForms([...forms].reverse())}
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

        {/* Empty State Table / Card (Screenshot 5) */}
        {filteredForms.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eaebf0',
            borderRadius: '12px',
            padding: '60px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            {/* Clipboard Search Icon (Screenshot 5) */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <ClipboardList size={30} color="#94a3b8" strokeWidth={1.5} />
            </div>

            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              No Forms found
            </div>

            <div style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '420px', lineHeight: 1.5, marginBottom: '22px' }}>
              Create forms for any purpose. Kick off projects, collect feedback, and much more
            </div>

            {/* Black [ New Form ] Button (Screenshot 5) */}
            <button
              onClick={() => {
                setFormTitle('New Form');
                setFormDesc('Collect requests and feedback.');
                setFormFields([
                  { id: 'f-1', label: 'Full Name', type: 'text', required: true },
                  { id: 'f-2', label: 'Work Email', type: 'email', required: true }
                ]);
                setActiveFormId(null);
                setIsBuilderOpen(true);
              }}
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 18px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              New Form
            </button>
          </div>
        ) : (
          /* Forms List */
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eaebf0',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(240px, 2fr) minmax(140px, 1.2fr) 140px 140px 80px',
              borderBottom: '1px solid #eaebf0',
              backgroundColor: '#fafbfc',
              padding: '10px 18px',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#64748b'
            }}>
              <div>Name</div>
              <div>Location</div>
              <div>Created by</div>
              <div>Date viewed ⬇</div>
              <div />
            </div>

            {filteredForms.map(form => (
              <div
                key={form.id}
                onClick={() => {
                  setFormTitle(form.name);
                  setFormDesc(form.description);
                  setFormFields(form.fields);
                  setActiveFormId(form.id);
                  setIsBuilderOpen(true);
                }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(240px, 2fr) minmax(140px, 1.2fr) 140px 140px 80px',
                  borderBottom: '1px solid #f1f5f9',
                  padding: '12px 18px',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafbfc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ClipboardList size={16} color="#7c3aed" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{form.name}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>#{form.location}</div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>{form.createdBy}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{form.dateViewed}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                  <button onClick={(e) => handleToggleFavorite(form.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                    <Star size={14} fill={form.isFavorite ? '#eab308' : 'none'} color={form.isFavorite ? '#eab308' : '#cbd5e1'} />
                  </button>
                  <button onClick={(e) => handleDeleteForm(form.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94a3b8' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INTERACTIVE FORM BUILDER MODAL */}
      {isBuilderOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3600
        }}>
          <div style={{
            width: '560px',
            maxHeight: '85vh',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 45px rgba(0,0,0,0.22)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={20} color="#7c3aed" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  {activeFormId ? 'Edit Form' : 'Create Form'}
                </h3>
              </div>
              <button onClick={() => setIsBuilderOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            {/* Title & Description Inputs */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Form Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Form Subtitle / Instructions</label>
              <input
                type="text"
                value={formDesc}
                onChange={e => setFormDesc(e.target.value)}
                style={{ width: '100%', padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
              />
            </div>

            {/* Fields List */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Form Questions & Fields ({formFields.length})</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => handleAddField('text')} style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>+ Short Text</button>
                  <button onClick={() => handleAddField('textarea')} style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>+ Long Text</button>
                  <button onClick={() => handleAddField('dropdown')} style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>+ Dropdown</button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formFields.map((field, idx) => (
                  <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>{idx + 1}.</span>
                    <input
                      type="text"
                      value={field.label}
                      onChange={e => {
                        const val = e.target.value;
                        setFormFields(formFields.map(f => f.id === field.id ? { ...f, label: val } : f));
                      }}
                      style={{ flex: 1, padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none' }}
                    />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px' }}>{field.type}</span>
                    <button onClick={() => handleDeleteField(field.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => setIsBuilderOpen(false)}
                style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveForm}
                style={{ backgroundColor: 'var(--brand-primary, #176B50)', color: 'var(--interactive-primary-text, #ffffff)', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Save Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
