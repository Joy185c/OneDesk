import React, { useState } from 'react';
import { 
  ChevronDown, 
  Sparkles, 
  Menu, 
  X, 
  CheckSquare, 
  FileText, 
  LayoutDashboard, 
  LayoutGrid, 
  MessageSquare, 
  Bot,
  ArrowRight,
  Zap,
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Check,
  BarChart2,
  Kanban,
  AlignLeft,
  Hash,
  PhoneCall,
  Inbox,
  Video,
  Edit3,
  BookOpen,
  Calendar,
  Share2,
  Download,
  PlayCircle,
  Cpu,
  Glasses,
  Heart,
  TrendingUp,
  GraduationCap,
  HelpCircle,
  Headphones,
  Briefcase,
  Code,
  Megaphone,
  Compass,
  FileCheck,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenWaitlist: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onGoToWorkspace?: () => void;
}

type ActiveMegaMenu = 'brain' | 'product' | 'solutions' | 'learn' | null;

export const Navbar: React.FC<NavbarProps> = ({ onOpenWaitlist, onOpenAuth, onGoToWorkspace }) => {
  const [activeMenu, setActiveMenu] = useState<ActiveMegaMenu>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleMenuHover = (menu: ActiveMegaMenu) => {
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--bg-surface, #ffffff)',
        borderBottom: '1px solid var(--border-subtle, #e5e7eb)',
        transition: 'all 0.15s ease'
      }}
      onMouseLeave={handleMenuLeave}
    >
      {/* Top Navbar Row */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo & Main Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {/* Logo matching OneDesk Alpine Sage identity */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'var(--brand-gradient, linear-gradient(135deg, #123D32 0%, #176B50 55%, #58A681 100%))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(23, 107, 80, 0.3)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 14L9 19L20 6" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '1.45rem',
              letterSpacing: '-0.04em',
              color: 'var(--text-primary, #0f172a)'
            }}>
              OneDesk
            </span>
          </Link>

          {/* Nav Dropdown Triggers */}
          <nav style={{ display: 'none' }} className="desktop-nav">
            <style>{`
              @media (min-width: 992px) {
                .desktop-nav { display: flex !important; align-items: center; gap: 4px; }
              }
            `}</style>

            {/* 1. Brain AI Menu Trigger */}
            <button 
              onMouseEnter={() => handleMenuHover('brain')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: activeMenu === 'brain' ? '#0f172a' : '#334155',
                backgroundColor: activeMenu === 'brain' ? '#f1f5f9' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <span>Brain AI</span>
              <ChevronDown size={14} color="#64748b" style={{ transform: activeMenu === 'brain' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {/* 2. Product Menu Trigger */}
            <button 
              onMouseEnter={() => handleMenuHover('product')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: activeMenu === 'product' ? '#0f172a' : '#334155',
                backgroundColor: activeMenu === 'product' ? '#f1f5f9' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <span>Product</span>
              <ChevronDown size={14} color="#64748b" style={{ transform: activeMenu === 'product' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {/* 3. Solutions Menu Trigger */}
            <button 
              onMouseEnter={() => handleMenuHover('solutions')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: activeMenu === 'solutions' ? '#0f172a' : '#334155',
                backgroundColor: activeMenu === 'solutions' ? '#f1f5f9' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <span>Solutions</span>
              <ChevronDown size={14} color="#64748b" style={{ transform: activeMenu === 'solutions' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {/* 4. Learn Menu Trigger */}
            <button 
              onMouseEnter={() => handleMenuHover('learn')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: activeMenu === 'learn' ? '#0f172a' : '#334155',
                backgroundColor: activeMenu === 'learn' ? '#f1f5f9' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <span>Learn</span>
              <ChevronDown size={14} color="#64748b" style={{ transform: activeMenu === 'learn' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {/* 5. Direct Pricing Link */}
            <Link 
              to="/pricing"
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: '#334155'
              }}
            >
              Pricing
            </Link>

            {/* 6. Direct Enterprise Link */}
            <Link 
              to="/pricing"
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: '#334155'
              }}
            >
              Enterprise
            </Link>
          </nav>
        </div>

        {/* Right Nav CTA Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/signup"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: '#334155',
              padding: '8px 12px',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            Get a Demo
          </Link>

          <Link
            to="/login"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: '#0f172a',
              backgroundColor: '#f1f5f9',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textDecoration: 'none'
            }}
          >
            Login
          </Link>

          <Link
            to="/signup"
            style={{
              fontSize: '0.92rem',
              fontWeight: 700,
              color: 'var(--interactive-primary-text, #ffffff)',
              backgroundColor: 'var(--interactive-primary, #176B50)',
              padding: '8px 18px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textDecoration: 'none'
            }}
          >
            Sign Up
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: theme === 'dark' ? '#132B22' : '#F0F4F0',
              border: theme === 'dark' ? '1px solid #2C4538' : '1px solid #DCE7DE',
              color: theme === 'dark' ? '#C5F277' : '#176B50',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={theme === 'dark' ? 'Switch to Alpine Sage (Light Mode)' : 'Switch to Obsidian Forest (Dark Mode)'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Quick Workspace Shortcut */}
          <Link
            to="/workspace"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '0.86rem',
              fontWeight: 800,
              color: '#ffffff',
              borderRadius: '8px',
              background: 'var(--brand-gradient, linear-gradient(135deg, #123D32 0%, #176B50 55%, #58A681 100%))',
              boxShadow: '0 3px 12px rgba(23, 107, 80, 0.3)'
            }}
            className="app-shortcut"
          >
            <style>{`
              @media (max-width: 1180px) {
                .app-shortcut { display: none !important; }
              }
            `}</style>
            <span>Workspace</span>
            <ArrowRight size={13} />
          </Link>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'flex', padding: '6px' }}
            className="mobile-toggle"
          >
            <style>{`
              @media (min-width: 992px) {
                .mobile-toggle { display: none !important; }
              }
            `}</style>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. MEGA MENU: BRAIN AI (MATCHING SCREENSHOT 1)           */}
      {/* ======================================================== */}
      {activeMenu === 'brain' && (
        <div 
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e7eb',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            padding: '36px 0 28px',
            animation: 'fadeIn 0.15s ease'
          }}
          onMouseEnter={() => setActiveMenu('brain')}
        >
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '36px' }}>
              
              {/* Left Column: AI PLATFORM */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  AI PLATFORM
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Link to="/workspace" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Cpu size={19} color="#1e293b" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>Brain Platform</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>The converged AI workspace</div>
                    </div>
                  </Link>

                  <Link to="/workspace" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Glasses size={19} color="#1e293b" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>Super Agents</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Delegate your work entirely</div>
                    </div>
                  </Link>

                  <Link to="/workspace" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Heart size={19} color="#1e293b" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>Artifacts²</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Ship real apps from a prompt</div>
                    </div>
                  </Link>

                  <Link to="/workspace" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Zap size={19} color="#1e293b" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>Skills</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Teach it how your team works</div>
                    </div>
                  </Link>

                  <Link to="/workspace" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Download size={19} color="#1e293b" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>Brain MAX Downloads</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Desktop, mobile, and Chrome</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Col 2: AGENTS & AUTOMATION */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  AGENTS & AUTOMATION
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <span>Cloud Agents</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#ede9fe', color: '#7c3aed', padding: '1px 6px', borderRadius: '4px' }}>SOON</span>
                  </div>
                  <div style={{ cursor: 'pointer' }}>Process Miner</div>
                  <div style={{ cursor: 'pointer' }}>Custom Apps</div>
                </div>
              </div>

              {/* Col 3: KNOWLEDGE & CAPTURE */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  KNOWLEDGE & CAPTURE
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  <div style={{ cursor: 'pointer' }}>Context Engine</div>
                  <div style={{ cursor: 'pointer' }}>Enterprise Search</div>
                  <div style={{ cursor: 'pointer' }}>Notetaker</div>
                  <div style={{ cursor: 'pointer' }}>Talk to Text</div>
                </div>
              </div>

              {/* Col 4: RESOURCES */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  RESOURCES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  <Link to="/pricing" style={{ cursor: 'pointer' }}>Pricing</Link>
                  <div style={{ cursor: 'pointer' }}>State of AI</div>
                </div>
              </div>

            </div>

            {/* Bottom Row: WHAT'S NEW */}
            <div style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              fontSize: '0.84rem'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                WHAT'S NEW
              </span>
              <div>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>Artifacts² </span>
                <span style={{ color: '#64748b' }}>Now live in every workspace </span>
                <span style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>See the gallery →</span>
              </div>
              <div>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>Skills </span>
                <span style={{ color: '#64748b' }}>Build your own, no code needed </span>
                <span style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>Read the docs →</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MEGA MENU: PRODUCT (MATCHING SCREENSHOT 2)            */}
      {/* ======================================================== */}
      {activeMenu === 'product' && (
        <div 
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e7eb',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            padding: '36px 0',
            animation: 'fadeIn 0.15s ease'
          }}
          onMouseEnter={() => setActiveMenu('product')}
        >
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '28px' }}>
              
              {/* 1. PROJECTS */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  PROJECTS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <Link to="/features/tasks" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </div>
                    <span>Tasks</span>
                  </Link>

                  <Link to="/features/dashboards" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChart2 size={14} color="#fff" />
                    </div>
                    <span>Dashboards</span>
                  </Link>

                  <Link to="/features/tasks" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Kanban size={14} color="#fff" />
                    </div>
                    <span>Board</span>
                  </Link>

                  <Link to="/features/tasks" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlignLeft size={14} color="#fff" />
                    </div>
                    <span>Gantt</span>
                  </Link>
                </div>
              </div>

              {/* 2. COMMUNICATION */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  COMMUNICATION
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Hash size={14} color="#fff" />
                    </div>
                    <span>Chat</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PhoneCall size={14} color="#fff" />
                    </div>
                    <span>SyncUp</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Inbox size={14} color="#fff" />
                    </div>
                    <span>Inbox</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Video size={14} color="#fff" />
                    </div>
                    <span>Clips</span>
                  </div>
                </div>
              </div>

              {/* 3. KNOWLEDGE */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  KNOWLEDGE
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <Link to="/features/docs" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={14} color="#fff" />
                    </div>
                    <span>Docs</span>
                  </Link>

                  <Link to="/features/whiteboards" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Edit3 size={14} color="#fff" />
                    </div>
                    <span>Whiteboards</span>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={14} color="#fff" />
                    </div>
                    <span>Wiki</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileCheck size={14} color="#fff" />
                    </div>
                    <span>Forms</span>
                  </div>
                </div>
              </div>

              {/* 4. TIME */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  TIME
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={14} color="#fff" />
                    </div>
                    <span>Calendar</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CalendarIcon size={14} color="#fff" />
                    </div>
                    <span>Scheduling</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Zap size={14} color="#fff" />
                    </div>
                    <span>Automations</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={14} color="#fff" />
                    </div>
                    <span>Time tracking</span>
                  </div>
                </div>
              </div>

              {/* 5. MORE */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  MORE
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <LayoutGrid size={17} color="#f59e0b" />
                    <span>All features</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <Share2 size={17} color="#3b82f6" />
                    <span>Integrations</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <Download size={17} color="#64748b" />
                    <span>Downloads</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <PlayCircle size={17} color="#64748b" />
                    <span>Watch demo</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MEGA MENU: SOLUTIONS (MATCHING SCREENSHOT 3)          */}
      {/* ======================================================== */}
      {activeMenu === 'solutions' && (
        <div 
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e7eb',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            padding: '36px 0',
            animation: 'fadeIn 0.15s ease'
          }}
          onMouseEnter={() => setActiveMenu('solutions')}
        >
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.1fr 1.2fr 1.8fr', gap: '36px' }}>
              
              {/* Col 1: TEAMS */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  TEAMS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  <div style={{ cursor: 'pointer' }}>Project management</div>
                  <div style={{ cursor: 'pointer' }}>Product development</div>
                  <div style={{ cursor: 'pointer' }}>Operations</div>
                  <div style={{ cursor: 'pointer' }}>IT</div>
                  <div style={{ cursor: 'pointer' }}>Marketing</div>
                  <div style={{ cursor: 'pointer' }}>Human Resources</div>
                  <div style={{ cursor: 'pointer' }}>Sales</div>
                  <div style={{ color: '#2563eb', fontWeight: 700, marginTop: '6px', cursor: 'pointer' }}>See all teams →</div>
                </div>
              </div>

              {/* Col 2: COMPANIES */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  COMPANIES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  <div style={{ cursor: 'pointer' }}>Enterprise</div>
                  <div style={{ cursor: 'pointer' }}>Startup</div>
                  <div style={{ cursor: 'pointer' }}>Small Business</div>
                  <div style={{ cursor: 'pointer' }}>Non-profit</div>
                </div>
              </div>

              {/* Col 3: INDUSTRIES */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  INDUSTRIES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  <div style={{ cursor: 'pointer' }}>Healthcare</div>
                  <div style={{ cursor: 'pointer' }}>Education</div>
                  <div style={{ cursor: 'pointer' }}>Agency & Services</div>
                  <div style={{ cursor: 'pointer' }}>Consumer & Retail</div>
                  <div style={{ cursor: 'pointer' }}>Construction</div>
                  <div style={{ cursor: 'pointer' }}>Government</div>
                  <div style={{ color: '#2563eb', fontWeight: 700, marginTop: '6px', cursor: 'pointer' }}>See all industries →</div>
                </div>
              </div>

              {/* Col 4: FEATURED CARDS */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  FEATURED
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer'
                  }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={20} color="#fff" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>The Small Business Suite</span>
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, backgroundColor: '#ede9fe', color: '#7c3aed', padding: '1px 5px', borderRadius: '4px' }}>NEW</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>The only software your small business needs</div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer'
                  }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={22} color="#4338ca" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Custom agent solutions</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>AI workflows built for your team</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MEGA MENU: LEARN (MATCHING SCREENSHOT 4)              */}
      {/* ======================================================== */}
      {activeMenu === 'learn' && (
        <div 
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e7eb',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            padding: '36px 0',
            animation: 'fadeIn 0.15s ease'
          }}
          onMouseEnter={() => setActiveMenu('learn')}
        >
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.4fr 2.4fr', gap: '36px' }}>
              
              {/* Col 1: LEARN */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  LEARN
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  <div style={{ cursor: 'pointer' }}>University</div>
                  <div style={{ cursor: 'pointer' }}>Demos</div>
                  <div style={{ cursor: 'pointer' }}>Video tutorials</div>
                  <div style={{ cursor: 'pointer' }}>Webinars</div>
                </div>
              </div>

              {/* Col 2: DISCOVER */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  DISCOVER
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  <div style={{ cursor: 'pointer' }}>Blog</div>
                  <div style={{ cursor: 'pointer' }}>Customer stories</div>
                  <div style={{ cursor: 'pointer' }}>Guides</div>
                  <div style={{ cursor: 'pointer' }}>Kill Work Sprawl</div>
                </div>
              </div>

              {/* Col 3: SUPPORT */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  SUPPORT
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  <div style={{ cursor: 'pointer' }}>24/7 Support</div>
                  <div style={{ cursor: 'pointer' }}>Professional services</div>
                  <div style={{ cursor: 'pointer' }}>Premium support</div>
                  <div style={{ cursor: 'pointer' }}>Hire an expert</div>
                </div>
              </div>

              {/* Col 4: CUSTOMER STORIES (CARTOON NETWORK CARD) */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>
                  CUSTOMER STORIES
                </div>
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em' }}>
                    CN
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4 }}>
                    "Cartoon Network doubles output in 50% less time with ClickUp"
                  </div>
                  <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
                    Read the story →
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Link to="/workspace" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 800, color: '#7b68ee' }}>
            ⚡ Open Workspace App
          </Link>
          <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#1e293b' }}>
            Pricing
          </Link>
          <Link to="/compare" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: '#1e293b' }}>
            Compare
          </Link>
          <Link 
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '10px',
              backgroundColor: '#f1f5f9',
              color: '#0f172a',
              borderRadius: '8px',
              fontWeight: 600,
              textAlign: 'center',
              textDecoration: 'none'
            }}
          >
            Login
          </Link>
          <Link 
            to="/signup"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '10px',
              backgroundColor: '#111827',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 700,
              textAlign: 'center',
              textDecoration: 'none'
            }}
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};
