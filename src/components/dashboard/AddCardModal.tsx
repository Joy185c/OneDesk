import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  CheckSquare, 
  Clock, 
  FileText, 
  Sparkles, 
  Plus, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export interface OverviewCardItem {
  id: string;
  type: 'recent' | 'docs' | 'bookmarks' | 'assigned_to_me' | 'sprint_progress' | 'time_logged' | 'scratchpad';
  title: string;
  description: string;
}

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: OverviewCardItem) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAddCard }) => {
  if (!isOpen) return null;

  const availableCards: OverviewCardItem[] = [
    {
      id: 'c-assigned',
      type: 'assigned_to_me',
      title: 'Assigned to Me',
      description: 'Quickly see all tasks in Sales CRM assigned directly to you.'
    },
    {
      id: 'c-sprint',
      type: 'sprint_progress',
      title: 'Sprint Velocity & Burndown',
      description: 'Track week-over-week story points completed by your team.'
    },
    {
      id: 'c-time',
      type: 'time_logged',
      title: 'Time Logged Today',
      description: 'Live widget showing total tracked billable hours today.'
    },
    {
      id: 'c-notes',
      type: 'scratchpad',
      title: 'Scratchpad & Notes',
      description: 'A dedicated notepad card for quick workspace thoughts.'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '480px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #eaebf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              Add Card to Overview
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
              Customize your personal workspace overview dashboard
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Cards Grid */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {availableCards.map(c => (
            <div
              key={c.id}
              onClick={() => {
                onAddCard(c);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#7c3aed';
                e.currentTarget.style.backgroundColor = '#faf5ff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                  {c.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  {c.description}
                </div>
              </div>

              <div style={{
                backgroundColor: '#f1f5f9',
                borderRadius: '6px',
                padding: '5px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Plus size={13} />
                <span>Add</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
