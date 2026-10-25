import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  CheckCircle2, 
  Building2, 
  Mail, 
  User, 
  Lock,
  Layers,
  Check
} from 'lucide-react';
import { memberService } from '../services/memberService';
import { useAuth } from '../context/AuthContext';

export const JoinWorkspacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const code = searchParams.get('code') || '';
  const initialEmail = searchParams.get('email') || '';
  const initialRole = searchParams.get('role') || 'Member';
  const workspaceName = searchParams.get('ws') || "ClickUp Workspace";
  const inviterName = searchParams.get('by') || 'Workspace Admin';

  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [isJoining, setIsJoining] = useState(false);
  const [joinedSuccess, setJoinedSuccess] = useState(false);

  // If code exists, see if there's a stored invite
  useEffect(() => {
    if (code) {
      const invites = memberService.getInvitations();
      const matched = invites.find(i => i.token === code);
      if (matched) {
        setEmail(matched.email);
        setRole(matched.role);
      }
    }
    if (initialEmail && !name) {
      const guessedName = initialEmail.split('@')[0].replace(/[._-]/g, ' ');
      setName(guessedName.charAt(0).toUpperCase() + guessedName.slice(1));
    }
  }, [code, initialEmail]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsJoining(true);

    setTimeout(() => {
      // 1. Accept in memberService
      const newMember = memberService.acceptInvitation(code, {
        name: name.trim()
      });

      // 2. Set auth session
      login(email);

      // Save user details with custom role and workspace
      const customUser = {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
        avatar: newMember.avatar,
        role: role === 'Admin' ? 'Workspace Admin' : role === 'Guest' ? 'Guest Collaborator' : 'Workspace Member',
        workspaceName: workspaceName
      };
      localStorage.setItem('clickjoy_auth_user', JSON.stringify(customUser));

      setIsJoining(false);
      setJoinedSuccess(true);

      setTimeout(() => {
        navigate('/workspace');
      }, 1200);
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0d14',
      backgroundImage: 'radial-gradient(ellipse at 50% 10%, rgba(124, 58, 237, 0.22) 0%, rgba(10, 13, 20, 0) 70%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#ffffff'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: '#121624',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.6), 0 0 40px rgba(124, 58, 237, 0.15)',
        padding: '36px 32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #7c3aed, #ec4899, transparent)'
        }} />

        {joinedSuccess ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: '2px solid #22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#22c55e'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px', color: '#ffffff' }}>
              Welcome to the Team! 🎉
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '24px' }}>
              You've successfully joined <strong>{workspaceName}</strong> as <strong>{role}</strong>. Redirecting you to the workspace...
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#a855f7',
              fontSize: '0.86rem',
              fontWeight: 600
            }}>
              <Sparkles size={16} /> Loading dashboard & sprint tasks...
            </div>
          </div>
        ) : (
          <>
            {/* Header / Invitation Banner */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'rgba(124, 58, 237, 0.18)',
                border: '1px solid rgba(124, 58, 237, 0.35)',
                borderRadius: '100px',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#c084fc',
                marginBottom: '14px'
              }}>
                <Sparkles size={13} /> Official Workspace Invitation
              </div>

              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Join {workspaceName}
              </h1>

              <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: '#e2e8f0' }}>{inviterName}</strong> has invited you to collaborate as a{' '}
                <span style={{
                  backgroundColor: role === 'Admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(124, 58, 237, 0.2)',
                  color: role === 'Admin' ? '#fca5a5' : '#c084fc',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 700
                }}>
                  {role}
                </span>
              </p>
            </div>

            {/* Workspace details preview badge */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1rem'
                }}>
                  {workspaceName.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f1f5f9' }}>
                    {workspaceName}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Sales CRM • Kanban Sprints • Team Chat
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.76rem',
                color: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                padding: '4px 10px',
                borderRadius: '100px',
                fontWeight: 700
              }}>
                <ShieldCheck size={14} /> Verified Invite
              </div>
            </div>

            {/* Accept Invitation Form */}
            <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Your Full Name
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#181e30',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '10px 14px'
                }}>
                  <User size={16} color="#64748b" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#181e30',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '10px 14px'
                }}>
                  <Mail size={16} color="#64748b" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Choose Password (Optional)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#181e30',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '10px 14px'
                }}>
                  <Lock size={16} color="#64748b" />
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Permissions info */}
              <div style={{
                fontSize: '0.76rem',
                color: '#64748b',
                lineHeight: 1.4,
                padding: '6px 2px'
              }}>
                {role === 'Admin' ? (
                  <span>⭐ You will have full Admin rights to create channels, assign tasks, and invite teammates.</span>
                ) : (
                  <span>✅ You will have Member access to view boards, update assigned tasks, and chat in team channels.</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isJoining}
                style={{
                  marginTop: '10px',
                  padding: '13px 20px',
                  backgroundColor: '#7c3aed',
                  backgroundImage: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(124, 58, 237, 0.45)',
                  transition: 'transform 0.15s, opacity 0.15s'
                }}
              >
                {isJoining ? (
                  <span>Joining Workspace...</span>
                ) : (
                  <>
                    <UserCheck size={18} />
                    <span>Accept Invitation & Join Workspace</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Back link */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/" style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'none' }}>
                ← Return to ClickUp 3.0 Homepage
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
