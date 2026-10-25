import React, { useState } from 'react';
import { 
  CheckSquare, 
  ArrowRight, 
  Layers, 
  Kanban, 
  ListTodo, 
  Calendar, 
  Clock, 
  Sparkles, 
  Flag 
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WaitlistModal } from '../components/WaitlistModal';
import { AuthModal } from '../components/AuthModal';
import { useNavigate } from 'react-router-dom';

export const TasksFeaturePage: React.FC = () => {
  const navigate = useNavigate();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'signin' | 'signup' }>({
    open: false,
    mode: 'signup'
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Navbar
        onOpenWaitlist={() => setWaitlistOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        onGoToWorkspace={() => navigate('/workspace')}
      />

      <main style={{ flex: 1 }}>
        <section style={{
          paddingTop: '80px',
          paddingBottom: '90px',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(123, 104, 238, 0.18), transparent 70%), linear-gradient(180deg, #fbfaff 0%, #ffffff 100%)',
          textAlign: 'center'
        }}>
          <div className="container">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(123, 104, 238, 0.12)', color: '#5e48e8', padding: '6px 14px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '20px' }}>
              <CheckSquare size={15} />
              <span>CLICKUP TASKS & SPRINTS</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 800,
              color: '#1a1b2d',
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '-0.035em'
            }}>
              Plan, track, and manage <br />
              <span style={{
                background: 'linear-gradient(135deg, #7b68ee 0%, #ff72e5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>any project with ease.</span>
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: '#555b70',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 36px'
            }}>
              Organize complex sprints with customizable subtasks, custom statuses, agile estimations, and 35+ flexible views.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '50px' }}>
              <button
                onClick={() => setAuthModal({ open: true, mode: 'signup' })}
                className="btn-primary"
                style={{ fontSize: '1rem', padding: '14px 32px', borderRadius: '12px' }}
              >
                <span>Get Started with Tasks</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/workspace')}
                className="btn-secondary"
                style={{ fontSize: '1rem', padding: '14px 28px', borderRadius: '12px' }}
              >
                Open Workspace Kanban
              </button>
            </div>
          </div>
        </section>

        {/* 35+ Views Feature Grid */}
        <section style={{ padding: '80px 0', backgroundColor: '#fcfcfe', borderTop: '1px solid #eaebf2' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1a1b2d', marginBottom: '16px' }}>
                Every view your team needs.
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
                Switch perspectives without changing your data. Engineers use Board, managers use List, executives use Dashboards.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {[
                { icon: Kanban, title: 'Agile Kanban Boards', desc: 'Drag-and-drop tasks across custom workflows, set WIP limits, and balance workloads.' },
                { icon: ListTodo, title: 'High-Density Lists', desc: 'Sort, group, and bulk edit hundreds of tasks with Excel-like inline editing.' },
                { icon: Calendar, title: 'Calendar & Sprints', desc: 'Visualize project milestones, sync with Google Calendar, and schedule team capacity.' },
                { icon: Clock, title: 'Time Tracking & Estimates', desc: 'Track billable hours natively, set time estimates, and generate client timesheets.' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '30px 24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#7b68ee18',
                    color: '#7b68ee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <item.icon size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer
        onOpenWaitlist={() => setWaitlistOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
      />

      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, open: false })}
      />
    </div>
  );
};
