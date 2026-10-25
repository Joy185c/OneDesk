import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video, 
  Check, 
  X,
  Sparkles,
  Link2,
  ChevronDown,
  Flag,
  Search,
  RefreshCw,
  Settings,
  Sun,
  Layout,
  ArrowRight,
  ArrowLeft,
  CalendarCheck,
  Zap,
  Info
} from 'lucide-react';

// Google Calendar 31 Icon
const GoogleCalendarIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="6" y="6" width="36" height="36" rx="8" fill="#ffffff" stroke="#dadce0" strokeWidth="1.5"/>
    <path d="M6 14C6 9.58172 9.58172 6 14 6H34C38.4183 6 42 9.58172 42 14V16H6V14Z" fill="#4285F4"/>
    <rect x="13" y="3" width="4" height="6" rx="2" fill="#1976D2"/>
    <rect x="31" y="3" width="4" height="6" rx="2" fill="#1976D2"/>
    <text x="24" y="34" fill="#1976D2" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">31</text>
    <rect x="6" y="38" width="10" height="4" rx="2" fill="#34A853"/>
    <rect x="32" y="38" width="10" height="4" rx="2" fill="#EA4335"/>
  </svg>
);

// Microsoft Outlook Icon
const MicrosoftOutlookIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="8" y="10" width="32" height="28" rx="4" fill="#0078D4"/>
    <path d="M8 15L24 27L40 15" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="24" r="9" fill="#005A9E"/>
    <text x="18" y="28" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">O</text>
  </svg>
);

// ClickUp AI Petal Icon (Screenshot 4 & 5)
const ClickUpAIPetalIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2.5C10.6 5.5 10.6 7.5 12 9C13.4 7.5 13.4 5.5 12 2.5Z" fill="#ff70a6"/>
    <path d="M21.5 12C18.5 10.6 16.5 10.6 15 12C16.5 13.4 18.5 13.4 21.5 12Z" fill="#70d6ff"/>
    <path d="M12 21.5C13.4 18.5 13.4 16.5 12 15C10.6 16.5 10.6 18.5 12 21.5Z" fill="#ff9770"/>
    <path d="M2.5 12C5.5 13.4 7.5 13.4 9 12C7.5 10.6 5.5 10.6 2.5 12Z" fill="#a78bfa"/>
    <circle cx="12" cy="12" r="3" fill="#ec4899"/>
  </svg>
);

// ClickUp Brand Logo for OAuth Dialog
const ClickUpBrandLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M6 21L16 13L26 21" stroke="url(#cup-o-grad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="7" r="3" fill="#ff007a"/>
    <defs>
      <linearGradient id="cup-o-grad" x1="6" y1="21" x2="26" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ff007a"/>
        <stop offset="1" stopColor="#7b2cbf"/>
      </linearGradient>
    </defs>
  </svg>
);

// Google G Logo for OAuth Dialog
const GoogleGLogo: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
);

interface CalendarEvent {
  id: string;
  title: string;
  day: number; // 25 to 31
  time: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badge?: string;
}

export const PlannerView: React.FC = () => {
  // Calendar connection state (defaults to false for onboarding, but easily toggled)
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [authModalStep, setAuthModalStep] = useState<'none' | 'account_chooser' | 'consent' | 'connecting'>('none');
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState({
    name: 'Joy Sarkar',
    email: 'joy185c@gmail.com',
    avatar: 'JS'
  });
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [isCommandPopoverOpen, setIsCommandPopoverOpen] = useState<boolean>(false);
  const [isPlannerSidebarOpen, setIsPlannerSidebarOpen] = useState<boolean>(true);
  const [lightenNonWorking, setLightenNonWorking] = useState<boolean>(false);
  const [showWeekNumbers, setShowWeekNumbers] = useState<boolean>(false);
  const [isMeetingAgentToastOpen, setIsMeetingAgentToastOpen] = useState<boolean>(true);
  const [meetWithSearch, setMeetWithSearch] = useState<string>('');
  const [assignedOpen, setAssignedOpen] = useState<boolean>(false);
  const [todayOverdueOpen, setTodayOverdueOpen] = useState<boolean>(false);
  const [calendarViewMode, setCalendarViewMode] = useState<'Week' | 'Day' | 'Month'>('Week');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // List of accounts for Google Sign-in modal matching Screenshot 2
  const googleAccounts = [
    { name: 'Joy Sarkar', email: 'joy185c@gmail.com', avatar: 'JS', signedOut: false },
    { name: 'Mugdho', email: 'junaedalmugdho@gmail.com', avatar: '👓', signedOut: false },
    { name: 'Junaid', email: 'junaed.mugdho@gmail.com', avatar: '👨', signedOut: false },
    { name: 'Joy Kumar Yuv', email: 'joy209688@gmail.com', avatar: '👨‍🎓', signedOut: false },
    { name: 'Joy Kumar Yuv', email: 'whiteboxaixyz@gmail.com', avatar: 'J', signedOut: true },
    { name: 'Joy Sarkar', email: 'cscode261@gmail.com', avatar: 'JS', signedOut: true },
    { name: 'Joy Kumar Yuv 261-16-010', email: '261-16-010@diu.edu.bd', avatar: '👨‍🎓', signedOut: false }
  ];

  // Week days for October 2026 (matching Screenshot 4)
  const weekDays = [
    { name: 'Sun', date: 25, isToday: true },
    { name: 'Mon', date: 26, isToday: false },
    { name: 'Tue', date: 27, isToday: false },
    { name: 'Wed', date: 28, isToday: false },
    { name: 'Thu', date: 29, isToday: false },
    { name: 'Fri', date: 30, isToday: false },
    { name: 'Sat', date: 31, isToday: false }
  ];

  // Hours array from 1 am to 11 pm
  const hours = [
    '1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am', '8 am', '9 am', 
    '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', 
    '7 pm', '8 pm', '9 pm', '10 pm', '11 pm'
  ];

  const handleSelectAccount = (acc: typeof googleAccounts[0]) => {
    if (acc.signedOut) return;
    setSelectedGoogleAccount({
      name: acc.name,
      email: acc.email,
      avatar: acc.avatar
    });
    setAuthModalStep('consent');
  };

  const handleCompleteGoogleAuth = () => {
    setAuthModalStep('connecting');
    setTimeout(() => {
      setAuthModalStep('none');
      setIsConnected(true);
      setToastMessage(`Connected to Google Calendar (${selectedGoogleAccount.email})`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 900);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Toast notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease'
        }}>
          <Check size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 1: ONBOARDING SCREEN (Screenshots 1 & 2)                  */}
      {/* ============================================================== */}
      {!isConnected && (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle grid background pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.6,
            pointerEvents: 'none'
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1180px',
            width: '100%',
            gap: '60px',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Left Hero Content */}
            <div style={{ flex: 1, maxWidth: '520px' }}>
              <h1 style={{
                fontSize: '2.8rem',
                fontWeight: 900,
                color: '#1e1f21',
                lineHeight: 1.15,
                margin: '0 0 18px 0',
                letterSpacing: '-0.025em'
              }}>
                You, but better organized
              </h1>
              <p style={{
                fontSize: '1.08rem',
                color: '#4f5762',
                lineHeight: 1.6,
                margin: '0 0 36px 0',
                fontWeight: 400
              }}>
                Connect your calendar to manage events, time block your work, and take meeting notes - powered by ClickUp AI.
              </p>

              <div>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#6c757d',
                  marginBottom: '12px',
                  letterSpacing: '0.02em'
                }}>
                  Get started with
                </div>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  {/* Google Calendar Button (Screenshot 1) */}
                  <button
                    onClick={() => setAuthModalStep('account_chooser')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '11px 20px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#202124',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                      e.currentTarget.style.borderColor = '#4285f4';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  >
                    <GoogleCalendarIcon size={20} />
                    <span>Google Calendar</span>
                  </button>

                  {/* Microsoft Outlook Button (Screenshot 1) */}
                  <button
                    onClick={() => {
                      setIsConnected(true);
                      setToastMessage('Connected to Microsoft Outlook Calendar');
                      setTimeout(() => setToastMessage(null), 4000);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '11px 20px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#202124',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                      e.currentTarget.style.borderColor = '#0078d4';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  >
                    <MicrosoftOutlookIcon size={20} />
                    <span>Microsoft Outlook</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Carousel Preview Card (Screenshot 1) */}
            <div style={{ flex: 1, maxWidth: '520px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #ebebeb',
                boxShadow: '0 12px 36px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
                padding: '24px',
                minHeight: '380px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}>
                {carouselIndex === 0 ? (
                  <>
                    {/* Mockup Top Task Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#8c8c8c' }}>1</span>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7' }} />
                        <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e1f21' }}>Update color tokens</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem', color: '#7c3aed', fontWeight: 600 }}>
                        <span>📅 17 Mar</span>
                        <span>⌛ 4h</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Zap size={11} fill="#7c3aed" /> 4 sessions
                        </span>
                      </div>
                    </div>

                    {/* Schedule Grid Mockup */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      backgroundColor: '#fbf9fe',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid #f3e8ff'
                    }}>
                      {/* Left Column */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{
                          backgroundColor: '#f3e8ff',
                          color: '#6b21a8',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700
                        }}>
                          Design Sprint Feedback
                          <div style={{ fontSize: '0.68rem', fontWeight: 500, color: '#9333ea', marginTop: '2px' }}>12 - 1pm</div>
                        </div>

                        <div style={{
                          border: '1.5px dashed #c084fc',
                          backgroundColor: '#faf5ff',
                          color: '#7e22ce',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Zap size={11} /> Update color tok
                          </span>
                          <span style={{ fontSize: '0.66rem', color: '#a855f7' }}>3/4</span>
                        </div>

                        <div style={{
                          backgroundColor: '#fae8ff',
                          color: '#86198f',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700
                        }}>
                          Team Lunch <span style={{ fontSize: '0.68rem', fontWeight: 500 }}>1:30pm</span>
                        </div>

                        <div style={{
                          border: '1.5px dashed #c084fc',
                          backgroundColor: '#faf5ff',
                          color: '#7e22ce',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Zap size={11} /> Update color tokens
                          </span>
                          <span style={{ fontSize: '0.66rem', color: '#a855f7' }}>2/4</span>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{
                          border: '1.5px dashed #c084fc',
                          backgroundColor: '#faf5ff',
                          color: '#7e22ce',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Zap size={11} /> Update color tokens
                          </span>
                          <span style={{ fontSize: '0.66rem', color: '#a855f7' }}>1/4</span>
                        </div>

                        <div style={{
                          backgroundColor: '#f3e8ff',
                          color: '#6b21a8',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700
                        }}>
                          Design Review
                          <div style={{ fontSize: '0.68rem', fontWeight: 500, color: '#9333ea', marginTop: '2px' }}>1 - 2pm</div>
                        </div>

                        <div style={{
                          border: '1.5px dashed #c084fc',
                          backgroundColor: '#faf5ff',
                          color: '#7e22ce',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Zap size={11} /> Update color tok
                          </span>
                          <span style={{ fontSize: '0.66rem', color: '#a855f7' }}>4/4</span>
                        </div>

                        <div style={{
                          backgroundColor: '#f3e8ff',
                          color: '#6b21a8',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700
                        }}>
                          Calendar Squad Sync
                        </div>
                      </div>
                    </div>

                    {/* Bottom Card Copy (Screenshot 1) */}
                    <div style={{ marginTop: '20px' }}>
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#1e1f21', margin: '0 0 6px 0' }}>
                        Automatic time blocking
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                        AI suggests and schedules tasks on your calendar. Like your own personal assistant.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Slide 2: Schedule Meeting / Book Meeting */}
                    <div style={{
                      backgroundColor: '#eff6ff',
                      borderRadius: '10px',
                      padding: '20px',
                      border: '1px solid #dbeafe',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.84rem'
                      }}>
                        <span>Schedule meeting</span>
                        <Users size={16} />
                      </div>

                      <div style={{
                        backgroundColor: '#ffffff',
                        border: '1.5px dashed #60a5fa',
                        padding: '12px',
                        borderRadius: '6px',
                        textAlign: 'center',
                        color: '#2563eb',
                        fontWeight: 700,
                        fontSize: '0.84rem'
                      }}>
                        Book Meeting with Team
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>JS</div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>MA</div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>JY</div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>+ 3 teammates available</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#1e1f21', margin: '0 0 6px 0' }}>
                        Smart Meeting Coordination
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                        Instantly share your availability, coordinate cross-timezone syncs, and generate AI meeting agendas.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Carousel Arrows (Screenshot 1) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={() => setCarouselIndex(carouselIndex === 0 ? 1 : 0)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={() => setCarouselIndex(carouselIndex === 0 ? 1 : 0)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* GOOGLE ACCOUNT CHOOSER MODAL (Screenshot 2)                    */}
      {/* ============================================================== */}
      {authModalStep === 'account_chooser' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '450px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            animation: 'scaleIn 0.2s ease'
          }}>
            {/* Modal Title Bar / Header */}
            <div style={{
              padding: '12px 18px',
              borderBottom: '1px solid #f1f3f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GoogleGLogo size={18} />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#3c4043' }}>
                  Sign in with Google
                </span>
              </div>
              <button
                onClick={() => setAuthModalStep('none')}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#5f6368',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* ClickUp Brand Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <ClickUpBrandLogo size={42} />
              </div>

              <h2 style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#202124',
                textAlign: 'center',
                margin: '0 0 6px 0'
              }}>
                Choose an account
              </h2>
              <p style={{
                fontSize: '0.94rem',
                color: '#5f6368',
                textAlign: 'center',
                margin: '0 0 20px 0'
              }}>
                to continue to <span style={{ color: '#1a73e8', fontWeight: 600 }}>ClickUp</span>
              </p>

              {/* Accounts list */}
              <div style={{
                border: '1px solid #dadce0',
                borderRadius: '8px',
                overflow: 'hidden',
                maxHeight: '320px',
                overflowY: 'auto'
              }}>
                {googleAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectAccount(acc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderBottom: idx < googleAccounts.length - 1 ? '1px solid #f1f3f4' : 'none',
                      cursor: acc.signedOut ? 'default' : 'pointer',
                      backgroundColor: '#ffffff',
                      transition: 'background-color 0.1s'
                    }}
                    onMouseEnter={e => {
                      if (!acc.signedOut) e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }}
                    onMouseLeave={e => {
                      if (!acc.signedOut) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: acc.signedOut ? '#9aa0a6' : '#1a73e8',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.88rem'
                      }}>
                        {acc.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#202124' }}>
                          {acc.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#5f6368' }}>
                          {acc.email}
                        </div>
                      </div>
                    </div>

                    {acc.signedOut && (
                      <span style={{ fontSize: '0.74rem', color: '#70757a', fontWeight: 500 }}>
                        Signed out
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* GOOGLE CONSENT MODAL (Screenshot 3)                            */}
      {/* ============================================================== */}
      {authModalStep === 'consent' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            animation: 'scaleIn 0.2s ease'
          }}>
            {/* Header */}
            <div style={{
              padding: '12px 18px',
              borderBottom: '1px solid #f1f3f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GoogleGLogo size={18} />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#3c4043' }}>
                  Sign in with Google
                </span>
              </div>
              <button
                onClick={() => setAuthModalStep('none')}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#5f6368',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Consent Body */}
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <ClickUpBrandLogo size={42} />
              </div>

              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#202124',
                lineHeight: 1.3,
                margin: '0 0 12px 0'
              }}>
                ClickUp wants access to your Google Account
              </h2>

              {/* Selected account tag */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #dadce0',
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '0.8rem',
                color: '#3c4043',
                marginBottom: '20px'
              }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#1a73e8', color: '#fff', fontSize: '0.66rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {selectedGoogleAccount.avatar}
                </div>
                <span>{selectedGoogleAccount.email}</span>
              </div>

              {/* Permissions list */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#202124', marginBottom: '10px' }}>
                  Select what <span style={{ color: '#1a73e8' }}>ClickUp</span> can access
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafd'
                }}>
                  <GoogleCalendarIcon size={24} />
                  <div style={{ flex: 1, fontSize: '0.78rem', color: '#3c4043', lineHeight: 1.4 }}>
                    See, edit, share and permanently delete all the calendars that you can access using Google Calendar.{' '}
                    <span style={{ color: '#1a73e8', textDecoration: 'underline', cursor: 'pointer' }}>
                      See access details
                    </span>
                  </div>
                  <input type="checkbox" defaultChecked style={{ marginTop: '3px', cursor: 'pointer' }} />
                </div>
              </div>

              {/* Trust statement */}
              <div style={{
                borderTop: '1px solid #f1f3f4',
                paddingTop: '16px',
                fontSize: '0.74rem',
                color: '#5f6368',
                lineHeight: 1.5,
                marginBottom: '24px'
              }}>
                <div style={{ fontWeight: 700, color: '#202124', marginBottom: '4px' }}>
                  Make sure that you trust ClickUp
                </div>
                Review ClickUp's <span style={{ color: '#1a73e8', textDecoration: 'underline', cursor: 'pointer' }}>privacy policy</span> and <span style={{ color: '#1a73e8', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span> to understand how ClickUp will process and protect your data.
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setAuthModalStep('account_chooser')}
                  style={{
                    padding: '8px 22px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #dadce0',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#1a73e8',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleCompleteGoogleAuth}
                  style={{
                    padding: '8px 26px',
                    backgroundColor: '#1a73e8',
                    border: 'none',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: FULL CONNECTED PLANNER & CALENDAR (Screenshots 4 & 5)   */}
      {/* ============================================================== */}
      {isConnected && (
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          position: 'relative'
        }}>
          {/* 1. LEFT PLANNER SUB-PANEL (Screenshots 4 & 5) */}
          {isPlannerSidebarOpen && (
            <div style={{
              width: '260px',
              backgroundColor: '#fafbfc',
              borderRight: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 14px',
              overflowY: 'auto',
              flexShrink: 0
            }}>
              {/* Header: Planner + ▾ */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px'
              }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1f21', margin: 0 }}>
                  Planner
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    padding: '3px 6px',
                    cursor: 'pointer',
                    color: '#475569',
                    fontSize: '0.78rem'
                  }}>
                    <Plus size={14} />
                    <ChevronDown size={12} />
                  </button>
                </div>
              </div>

              {/* Section 1: Priorities */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  Priorities
                </div>

                {/* Empty dashed card matching Screenshot 4 */}
                <div style={{
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '8px'
                }}>
                  <Flag size={18} color="#94a3b8" />
                  <span style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.3 }}>
                    Prioritize a Task to see it appear here
                  </span>
                  <button style={{
                    marginTop: '4px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#7c3aed',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    + Add priority
                  </button>
                </div>
              </div>

              {/* Section 2: Meet with */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  Meet with
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  padding: '6px 10px'
                }}>
                  <Users size={14} color="#94a3b8" />
                  <input
                    type="text"
                    value={meetWithSearch}
                    onChange={e => setMeetWithSearch(e.target.value)}
                    placeholder="Search for people..."
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.78rem',
                      color: '#1e1f21',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>
              </div>

              {/* Section 3: Expandable sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <button
                  onClick={() => setAssignedOpen(!assignedOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '4px 0',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <ChevronRight size={14} style={{ transform: assignedOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                  <span>Assigned to me</span>
                </button>

                <button
                  onClick={() => setTodayOverdueOpen(!todayOverdueOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '4px 0',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <ChevronRight size={14} style={{ transform: todayOverdueOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                  <span>Today & overdue</span>
                </button>
              </div>

              {/* Section 4: Backlog */}
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  Backlog
                </div>
                <div style={{
                  border: '1px solid #f1f5f9',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  padding: '24px 12px',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: '#94a3b8'
                }}>
                  No tasks match these filters
                </div>
              </div>
            </div>
          )}

          {/* 2. MAIN CALENDAR STAGE */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#ffffff'
          }}>
            {/* Top Calendar Toolbar (Screenshot 4) */}
            <div style={{
              padding: '10px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff'
            }}>
              {/* Left: Nav arrows + Month Year */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button style={{
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button style={{
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <ChevronRight size={16} />
                  </button>
                </div>

                <h2 style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#1e1f21',
                  margin: 0
                }}>
                  October 2026
                </h2>

                {showWeekNumbers && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    W43
                  </span>
                )}
              </div>

              {/* Right: View mode, Day 1, Refresh, Settings */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer'
                }}>
                  <span>{calendarViewMode}</span>
                  <ChevronDown size={14} />
                </button>

                <button style={{
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CalendarIcon size={14} />
                  <span>1</span>
                </button>

                <button
                  onClick={() => {
                    setToastMessage('Google Calendar synced successfully');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  title="Sync with Google Calendar"
                  style={{
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <RefreshCw size={14} />
                </button>

                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    title="Calendar Settings & Integrations"
                    style={{
                      border: '1px solid #e2e8f0',
                      backgroundColor: isSettingsOpen ? '#f1f5f9' : '#ffffff',
                      borderRadius: '6px',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Settings size={14} />
                  </button>

                  {isSettingsOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '6px',
                      width: '210px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      border: '1px solid #e2e8f0',
                      padding: '6px',
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}>
                      <div
                        onClick={() => {
                          setIsConnected(false);
                          setIsSettingsOpen(false);
                        }}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '5px',
                          fontSize: '0.8rem',
                          color: '#1e1f21',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <RefreshCw size={13} color="#64748b" />
                        <span>Show Onboarding Screen</span>
                      </div>

                      <div
                        onClick={() => {
                          setIsConnected(false);
                          setIsSettingsOpen(false);
                          setToastMessage('Disconnected from Google Calendar');
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '5px',
                          fontSize: '0.8rem',
                          color: '#e11d48',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff1f2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <X size={13} color="#e11d48" />
                        <span>Disconnect Google Calendar</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar Grid Container */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}>
              {/* Day Columns Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '70px repeat(7, 1fr)',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                position: 'sticky',
                top: 0,
                zIndex: 20
              }}>
                {/* Timezone Indicator */}
                <div style={{
                  padding: '10px 8px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  textAlign: 'center',
                  borderRight: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px'
                }}>
                  <span>+ GMT+6</span>
                </div>

                {/* Week Day headers (Screenshot 4) */}
                {weekDays.map(day => (
                  <div
                    key={day.date}
                    style={{
                      padding: '8px 10px',
                      borderRight: '1px solid #f1f5f9',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      fontSize: '0.76rem',
                      fontWeight: day.isToday ? 700 : 500,
                      color: day.isToday ? '#1e1f21' : '#64748b'
                    }}>
                      {day.name}
                    </div>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: day.isToday ? '#e11d48' : 'transparent', // Red circle badge for 25
                      color: day.isToday ? '#ffffff' : '#1e1f21',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      marginTop: '2px'
                    }}>
                      {day.date}
                    </div>
                  </div>
                ))}
              </div>

              {/* All-Day Events Row (Screenshot 4) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '70px repeat(7, 1fr)',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#fafbfc',
                minHeight: '34px',
                alignItems: 'center'
              }}>
                <div style={{
                  padding: '6px 8px',
                  fontSize: '0.72rem',
                  color: '#64748b',
                  textAlign: 'center',
                  borderRight: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  <span>◇ All day</span>
                </div>

                {/* Sun 25: Design a Workflow... 2 events */}
                <div style={{ padding: '4px 6px', borderRight: '1px solid #f1f5f9' }}>
                  <div style={{
                    backgroundColor: '#fff7ed',
                    border: '1px solid #fed7aa',
                    color: '#c2410c',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    <span>🎨 Design a Workflow...</span>
                    <span style={{ fontSize: '0.64rem', color: '#ea580c' }}>2 events</span>
                  </div>
                </div>

                {/* Mon 26: Empty */}
                <div style={{ borderRight: '1px solid #f1f5f9' }} />

                {/* Tue 27: Integrate Your Fav... */}
                <div style={{ padding: '4px 6px', borderRight: '1px solid #f1f5f9' }}>
                  <div style={{
                    backgroundColor: '#f3e8ff',
                    border: '1px solid #e9d5ff',
                    color: '#7e22ce',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    🔗 Integrate Your Fav...
                  </div>
                </div>

                {/* Wed 28: Work Smarter with... */}
                <div style={{ padding: '4px 6px', borderRight: '1px solid #f1f5f9' }}>
                  <div style={{
                    backgroundColor: '#fdf2f8',
                    border: '1px solid #fbcfe8',
                    color: '#be185d',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    💬 Work Smarter with...
                  </div>
                </div>

                {/* Thu 29, Fri 30, Sat 31: Empty */}
                <div style={{ borderRight: '1px solid #f1f5f9' }} />
                <div style={{ borderRight: '1px solid #f1f5f9' }} />
                <div style={{ borderRight: '1px solid #f1f5f9' }} />
              </div>

              {/* Time Grid with Red Current-Time Line */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '70px repeat(7, 1fr)',
                position: 'relative'
              }}>
                {/* Red Current Time Line Indicator (Screenshot 4 at 9:35) */}
                <div style={{
                  position: 'absolute',
                  top: '522px', // positioned precisely at ~9:35 AM row
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: '#e11d48',
                  zIndex: 15,
                  pointerEvents: 'none'
                }}>
                  {/* Red Time Badge on left axis (Screenshot 4: 9:35) */}
                  <span style={{
                    position: 'absolute',
                    left: '14px',
                    top: '-10px',
                    backgroundColor: '#e11d48',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    boxShadow: '0 1px 3px rgba(225, 29, 72, 0.4)'
                  }}>
                    9:35
                  </span>
                  {/* Red circle dot on Today column */}
                  <div style={{
                    position: 'absolute',
                    left: '115px',
                    top: '-4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#e11d48',
                    border: '2px solid #ffffff'
                  }} />
                </div>

                {/* Time Axis Column */}
                <div style={{ borderRight: '1px solid #f1f5f9' }}>
                  {hours.map((hr, idx) => (
                    <div
                      key={idx}
                      style={{
                        height: '56px',
                        padding: '4px 8px',
                        textAlign: 'right',
                        fontSize: '0.72rem',
                        color: '#94a3b8',
                        borderBottom: '1px solid #f8fafc',
                        boxSizing: 'border-box'
                      }}
                    >
                      {hr}
                    </div>
                  ))}
                </div>

                {/* 7 Day Columns with Hatched Non-working hours */}
                {weekDays.map(day => (
                  <div
                    key={day.date}
                    style={{
                      borderRight: '1px solid #f1f5f9',
                      position: 'relative',
                      boxSizing: 'border-box'
                    }}
                  >
                    {hours.map((_, hIdx) => {
                      // Non-working hours hatched (before 8 AM, after 7 PM)
                      const isNonWorking = hIdx < 7 || hIdx > 17;
                      return (
                        <div
                          key={hIdx}
                          style={{
                            height: '56px',
                            borderBottom: '1px solid #f1f5f9',
                            boxSizing: 'border-box',
                            background: isNonWorking
                              ? (lightenNonWorking
                                  ? 'none'
                                  : 'repeating-linear-gradient(45deg, #fbfcfe, #fbfcfe 8px, #ffffff 8px, #ffffff 16px)')
                              : 'transparent'
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. BOTTOM-LEFT MEETING AGENT NOTIFICATION TOAST (Screenshot 4) */}
          {isMeetingAgentToastOpen && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '14px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
              border: '1px solid #e5e7eb',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: '232px',
              zIndex: 30,
              animation: 'slideUp 0.3s ease'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                flexShrink: 0
              }}>
                💡
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1e1f21', marginBottom: '2px', lineHeight: 1.2 }}>
                  Creating your Meeting Agent...
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.25 }}>
                  We're finishing setup. This usually takes a moment.
                </div>
              </div>

              <button
                onClick={() => setIsMeetingAgentToastOpen(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  flexShrink: 0
                }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* 4. BOTTOM FLOATING COMMAND BAR & POPOVER (Screenshots 4 & 5) */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: isPlannerSidebarOpen ? 'calc(50% + 130px)' : '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Popover Menu matching Screenshot 5 */}
            {isCommandPopoverOpen && (
              <div style={{
                width: '460px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
                padding: '12px 14px',
                marginBottom: '8px',
                animation: 'slideUp 0.18s ease'
              }}>
                {/* Up next section */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                    Up next
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Nothing on your calendar coming up.
                  </div>
                </div>

                {/* Commands section */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                    Commands
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div
                      onClick={() => setLightenNonWorking(!lightenNonWorking)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        color: '#1e1f21',
                        backgroundColor: '#f8fafc'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>💡</span>
                        <span>Lighten non-working hours</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>
                        {lightenNonWorking ? 'ON' : 'OFF'}
                      </span>
                    </div>

                    <div
                      onClick={() => setShowWeekNumbers(!showWeekNumbers)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        color: '#1e1f21'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarIcon size={14} color="#64748b" />
                        <span>Show week numbers</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setIsPlannerSidebarOpen(!isPlannerSidebarOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        color: '#1e1f21'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layout size={14} color="#64748b" />
                        <span>Hide sidebar</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Ctrl \</span>
                    </div>

                    <div
                      onClick={() => {
                        setToastMessage('Advanced to next week');
                        setTimeout(() => setToastMessage(null), 2500);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        color: '#1e1f21'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowRight size={14} color="#64748b" />
                        <span>Next week</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>→</span>
                    </div>

                    <div
                      onClick={() => {
                        setToastMessage('Returned to previous week');
                        setTimeout(() => setToastMessage(null), 2500);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        color: '#1e1f21'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowLeft size={14} color="#64748b" />
                        <span>Previous week</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>←</span>
                    </div>
                  </div>
                </div>

                {/* Team section */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                    Team
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 10px',
                    borderRadius: '6px'
                  }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}>
                      J
                    </div>
                    <div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e1f21' }}>
                        Joy Kumar Yuv
                      </span>{' '}
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        joy185c@gmail.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pill Search Capsule (Screenshots 4 & 5) */}
            <div
              onClick={() => setIsCommandPopoverOpen(!isCommandPopoverOpen)}
              style={{
                width: '460px',
                height: '42px',
                backgroundColor: '#ffffff',
                borderRadius: '100px',
                border: isCommandPopoverOpen ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <Search size={15} color="#94a3b8" />
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Search events, teammates, commands...
                </span>
              </div>

              {/* ClickUp AI Petal */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ClickUpAIPetalIcon size={18} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
