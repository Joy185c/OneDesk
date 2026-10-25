import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Check, 
  Share2, 
  Edit3, 
  Users, 
  ArrowRight, 
  Lock, 
  CheckSquare, 
  Zap,
  Layers
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WaitlistModal } from '../components/WaitlistModal';
import { AuthModal } from '../components/AuthModal';
import { useNavigate } from 'react-router-dom';

export const DocsFeaturePage: React.FC = () => {
  const navigate = useNavigate();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'signin' | 'signup' }>({
    open: false,
    mode: 'signup'
  });

  const [activeTab, setActiveTab] = useState<'wiki' | 'prd' | 'meeting'>('wiki');
  const [docContent, setDocContent] = useState(
`# 📚 Engineering & Product Wiki

Welcome to the team handbook. Everything here is linked to our sprint roadmap.

### Core Architecture
- **Real-time Sync**: Operational Transform over WebSockets
- **Permissions**: Granular folder & page level access
- **ClickUp AI**: Automatically extracts action items and writes summaries

> 💡 **Tip:** Highlight any text and press Cmd+K to convert into a tracked Task!`
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Navbar
        onOpenWaitlist={() => setWaitlistOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        onGoToWorkspace={() => navigate('/workspace')}
      />

      <main style={{ flex: 1 }}>
        {/* HERO SECTION */}
        <section style={{
          paddingTop: '80px',
          paddingBottom: '90px',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 184, 132, 0.15), transparent 70%), linear-gradient(180deg, #f8fbf9 0%, #ffffff 100%)',
          textAlign: 'center'
        }}>
          <div className="container">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0, 184, 132, 0.12)', color: '#00996d', padding: '6px 14px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '20px' }}>
              <FileText size={15} />
              <span>CLICKUP DOCS 3.0</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 800,
              color: '#1a1b2d',
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '-0.035em'
            }}>
              The next generation <br />
              <span style={{
                background: 'linear-gradient(135deg, #00b884 0%, #00dfa2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>of documents.</span>
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: '#555b70',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 36px'
            }}>
              Connect your notes, wikis, and specifications directly to tasks, workflows, and automated sprints. No more stale Google Docs.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '50px' }}>
              <button
                onClick={() => setAuthModal({ open: true, mode: 'signup' })}
                className="btn-emerald"
                style={{ fontSize: '1rem', padding: '14px 32px', borderRadius: '12px' }}
              >
                <span>Create a Doc Free</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/workspace')}
                className="btn-secondary"
                style={{ fontSize: '1rem', padding: '14px 28px', borderRadius: '12px' }}
              >
                Explore Live Demo
              </button>
            </div>

            {/* LIVE INTERACTIVE DOCS DEMO CONTAINER */}
            <div style={{
              maxWidth: '960px',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 25px 70px -15px rgba(22, 24, 45, 0.15)',
              border: '1px solid #e1e4ee',
              overflow: 'hidden',
              textAlign: 'left'
            }}>
              {/* Doc Chrome Navigation */}
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '12px 20px',
                borderBottom: '1px solid #eaebf2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
                  <span style={{ marginLeft: '10px', fontSize: '0.84rem', fontWeight: 600, color: '#475569' }}>
                    Design System Wiki / Components.md
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#00b884', backgroundColor: '#00b88418', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    <span>LIVE COLLAB</span>
                  </div>
                  <div style={{ display: 'flex', marginLeft: '6px' }}>
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #fff' }} />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-6px' }} />
                  </div>
                </div>
              </div>

              {/* Interactive Doc Editor */}
              <div style={{ padding: '30px 40px' }}>
                <textarea
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '260px',
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem',
                    lineHeight: 1.65,
                    color: '#334155',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4 PILLARS OF CLICKUP DOCS */}
        <section style={{ padding: '80px 0', backgroundColor: '#fcfcfe', borderTop: '1px solid #eaebf2' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1a1b2d', marginBottom: '16px' }}>
                Built for modern engineering & product teams.
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
                Why use standalone note tools when your docs can automatically update your sprint backlog?
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}>
              {[
                {
                  icon: CheckSquare,
                  color: '#7b68ee',
                  title: '1-Click Task Creation',
                  desc: 'Highlight any text in your document and immediately create a tracked ClickUp task with assignees, due dates, and sprint tags.'
                },
                {
                  icon: Users,
                  color: '#00b884',
                  title: 'Real-Time Co-Authoring',
                  desc: 'Work simultaneously with unlimited teammates. See live cursors, leave threaded comments, and resolve suggestions in seconds.'
                },
                {
                  icon: Sparkles,
                  color: '#ff72e5',
                  title: 'ClickUp AI Integration',
                  desc: 'Generate project briefs, translate requirements into user stories, and automatically summarize 30-page documents into 3 bullet points.'
                },
                {
                  icon: Lock,
                  color: '#00c0f3',
                  title: 'Granular Permissions',
                  desc: 'Share pages publicly with a password, restrict sensitive executive wikis, or invite external clients with view-only guest permissions.'
                }
              ].map((feat, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '30px 24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: `${feat.color}15`,
                    color: feat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px'
                  }}>
                    <feat.icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '10px' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
                    {feat.desc}
                  </p>
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
