import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  ChevronRight, 
  MessageSquare, 
  Flag, 
  Calendar, 
  Clock, 
  Send, 
  ThumbsUp, 
  Rocket, 
  MoreHorizontal,
  Folder,
  Hash,
  ArrowRight,
  Code,
  Megaphone,
  Briefcase,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { FIGMA_CHAT_MESSAGES } from '../data/clickupData';
import { ChatMessage } from '../types';
import { Link } from 'react-router-dom';

interface WorkFlowSectionProps {
  onOpenWaitlist: () => void;
}

export const WorkFlowSection: React.FC<WorkFlowSectionProps> = ({ onOpenWaitlist }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(FIGMA_CHAT_MESSAGES);
  const [newComment, setNewComment] = useState('');
  const [taskStatus, setTaskStatus] = useState('IN PROGRESS');
  const [priority, setPriority] = useState('Urgent');

  const [activeSolution, setActiveSolution] = useState(0);

  const teamSolutions = [
    {
      role: 'Engineering & Product',
      icon: Code,
      headline: 'Ship faster, more reliable software',
      replaces: ['Jira', 'Linear', 'Confluence'],
      description: 'Connect PRDs to GitHub pull requests, auto-triage bug backlogs, and run agile bi-weekly sprints with automated burndown reports.',
      metrics: '+34% cycle time reduction'
    },
    {
      role: 'Project Management',
      icon: Briefcase,
      headline: 'Deliver projects on time, every time',
      replaces: ['Asana', 'Monday.com', 'Smartsheet'],
      description: 'Manage cross-functional initiatives across 35+ customizable views: Gantt, List, Kanban Board, Workload, and Mind Maps.',
      metrics: 'Zero missed milestones'
    },
    {
      role: 'Marketing & Creative',
      icon: Megaphone,
      headline: 'Maximize marketing impact & campaign ROI',
      replaces: ['Notion', 'Airtable', 'Trello'],
      description: 'Coordinate multi-channel launches, review design tokens alongside Figma, and automate campaign approvals in minutes.',
      metrics: '1 day/week saved per marketer'
    },
    {
      role: 'Operations & Leadership',
      icon: Compass,
      headline: 'Close the strategy-execution gap',
      replaces: ['Basecamp', 'Wrike', 'Spreadsheets'],
      description: 'Align OKRs with everyday tasks. Executive dashboards provide real-time visibility into headcount capacity and project budgets.',
      metrics: '100% portfolio visibility'
    }
  ];

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: ChatMessage = {
      id: String(Date.now()),
      author: 'You (Interactive Demo)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      time: 'Just now',
      content: newComment.trim(),
      reactions: [{ emoji: '🔥', count: 1 }]
    };
    setMessages([...messages, added]);
    setNewComment('');
  };

  const handleWaitlistClick = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    onOpenWaitlist();
  };

  return (
    <section id="workflows" style={{
      padding: '100px 0',
      backgroundColor: '#f9f9fb',
      borderTop: '1px solid #eaebf2',
      borderBottom: '1px solid #eaebf2'
    }}>
      <div className="container">
        {/* ======================================================== */}
        {/* PART 1: AI SOLUTIONS FOR EVERY TEAM WITH REPLACES BADGES */}
        {/* ======================================================== */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 50px' }}>
          <span className="badge-pill badge-purple" style={{ marginBottom: '14px' }}>
            TAILORED SOLUTIONS
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 900,
            color: '#1a1b2d',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '16px'
          }}>
            AI solutions for every team
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#555b70' }}>
            Built to adapt to any methodology, replace siloed point solutions, and bring clarity to your entire company.
          </p>
        </div>

        {/* Team Role Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '90px'
        }}>
          {teamSolutions.map((sol, index) => {
            const isSelected = activeSolution === index;
            const Icon = sol.icon;
            return (
              <div
                key={sol.role}
                onClick={() => setActiveSolution(index)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: isSelected ? '2px solid #7b68ee' : '1px solid #e2e8f0',
                  padding: '28px 24px',
                  boxShadow: isSelected ? '0 15px 35px rgba(123, 104, 238, 0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#7b68ee' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#7b68ee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={20} />
                    </div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#16a34a', backgroundColor: '#dcfce7', padding: '3px 8px', borderRadius: '6px' }}>
                      {sol.metrics}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7b68ee', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {sol.role}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1b2d', margin: '8px 0 12px', lineHeight: 1.3 }}>
                    {sol.headline}
                  </h3>

                  <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
                    {sol.description}
                  </p>
                </div>

                {/* REPLACES PILL BADGE */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    REPLACES
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {sol.replaces.map(app => (
                      <span key={app} style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* PART 2: CONVERSATIONS WITH CONTEXT (SIDE-BY-SIDE TRAY)   */}
        {/* ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr',
          gap: '60px',
          alignItems: 'center'
        }} className="workflow-grid">
          <style>{`
            @media (max-width: 960px) {
              .workflow-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
            }
          `}</style>

          {/* LEFT SIDE: Interactive Side-by-side Work & Context Tray */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 25px 60px -15px rgba(20, 24, 40, 0.12)',
            border: '1px solid #e2e4ee',
            overflow: 'hidden'
          }}>
            {/* Top Workspace Bar */}
            <div style={{
              backgroundColor: '#f8f9fd',
              padding: '12px 18px',
              borderBottom: '1px solid #eaebf2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00b884' }} />
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e1f2b' }}>
                  Mobile Core Roadmap → Live Split Tray
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#7a8097', backgroundColor: '#e9ebf5', padding: '2px 8px', borderRadius: '6px' }}>
                CLK-10 Synchronized
              </span>
            </div>

            {/* Split Tray Body */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              minHeight: '400px'
            }} className="split-tray">
              <style>{`
                @media (max-width: 600px) {
                  .split-tray { grid-template-columns: 1fr !important; }
                }
              `}</style>

              {/* Chat & Thread Pane */}
              <div style={{
                borderRight: '1px solid #eaebf2',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid #f0f2f8' }}>
                    <MessageSquare size={16} color="#7b68ee" />
                    <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e1f2b' }}>
                      Context Discussion
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {messages.map((msg) => (
                      <div key={msg.id} style={{ display: 'flex', gap: '10px', fontSize: '0.82rem' }}>
                        <img 
                          src={msg.avatar} 
                          alt="" 
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontWeight: 700, color: '#1e1f2b' }}>{msg.author}</span>
                            <span style={{ fontSize: '0.7rem', color: '#8a8fa3' }}>{msg.time}</span>
                          </div>
                          <div style={{ color: '#44495f', marginTop: '2px', lineHeight: 1.4 }}>
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input in Tray */}
                <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Comment on task..."
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #dcdfea',
                      outline: 'none',
                      fontSize: '0.82rem'
                    }}
                  />
                  <button type="submit" style={{
                    backgroundColor: '#7b68ee',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Send size={13} />
                  </button>
                </form>
              </div>

              {/* Task Details Pane */}
              <div style={{ padding: '18px', backgroundColor: '#fcfcfe', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7b68ee' }}>
                  CLK-10 • Launch Mobile App
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Status:</span>
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value)}
                      style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem', fontWeight: 700 }}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETE">COMPLETE</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Priority:</span>
                    <span style={{ fontWeight: 700, color: '#dc2626' }}>Urgent</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Due Date:</span>
                    <span style={{ fontWeight: 600 }}>May 15, 2026</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Assignee:</span>
                    <span style={{ fontWeight: 600 }}>Alex Rivera</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', padding: '10px', backgroundColor: '#e0e7ff', borderRadius: '8px', fontSize: '0.76rem', color: '#4338ca', fontWeight: 600 }}>
                  ⚡ Connected with Supabase Realtime DB
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Typography & CTA */}
          <div>
            <div style={{ marginBottom: '14px' }}>
              <span className="badge-pill badge-green" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                CONVERSATIONS WITH CONTEXT
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: '#1a1b2d',
              lineHeight: 1.12,
              marginBottom: '16px',
              letterSpacing: '-0.03em'
            }}>
              Get into your <br />
              (work) flow.
            </h2>

            <div style={{
              width: '84px',
              height: '6px',
              backgroundColor: '#00b884',
              borderRadius: '100px',
              marginBottom: '24px'
            }} />

            <p style={{
              fontSize: '1.12rem',
              color: '#555b70',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '480px'
            }}>
              See your work and discussions side-by-side for the context you need to crush work like never before.
            </p>

            <Link
              to="/workspace"
              className="btn-emerald"
              style={{
                fontSize: '1.05rem',
                padding: '14px 34px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Open Interactive Workspace</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
