import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  ShieldCheck, 
  UserPlus, 
  Check, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent: (email: string, role: string) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onInviteSent }) => {
  const { user } = useAuth();
  const workspaceName = user?.workspaceName || (user?.name ? `${user.name}'s Workspace` : 'My Workspace');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Member' | 'Admin' | 'Guest'>('Member');
  const [spaces, setSpaces] = useState({
    salesCrm: true,
    teamSpace: true
  });
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      onInviteSent(email, role);
      setIsSending(false);
      setEmail('');
      onClose();
    }, 500);
  };

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
        width: '460px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #eaebf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#ede9fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7c3aed'
            }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Invite to {workspaceName}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                Collaborate on Sales CRM and team sprints
              </p>
            </div>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                padding: '8px 12px',
                backgroundColor: '#f8fafc'
              }}>
                <Mail size={16} color="#94a3b8" />
                <input
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.86rem',
                    color: '#0f172a',
                    width: '100%',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
            </div>

            {/* Role Radio Group */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Workspace Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {(['Member', 'Admin', 'Guest'] as const).map(r => (
                  <div
                    key={r}
                    onClick={() => setRole(r)}
                    style={{
                      border: '1.5px solid',
                      borderColor: role === r ? '#7c3aed' : '#e2e8f0',
                      backgroundColor: role === r ? '#faf5ff' : '#ffffff',
                      borderRadius: '8px',
                      padding: '10px 8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: role === r ? '#7c3aed' : '#1e293b' }}>
                      {r}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                      {r === 'Admin' ? 'Manage workspace' : r === 'Member' ? 'Full access' : 'Limited view'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessible Spaces */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Default Space Access
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={spaces.salesCrm}
                    onChange={e => setSpaces({ ...spaces, salesCrm: e.target.checked })}
                    style={{ accentColor: '#7c3aed' }}
                  />
                  <span>Space S • <strong>Sales CRM</strong> (4 active tasks)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={spaces.teamSpace}
                    onChange={e => setSpaces({ ...spaces, teamSpace: e.target.checked })}
                    style={{ accentColor: '#7c3aed' }}
                  />
                  <span>Team Space • General Collaboration</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                style={{
                  padding: '9px 20px',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)'
                }}
              >
                {isSending ? (
                  <span>Sending Invites...</span>
                ) : (
                  <>
                    <Check size={15} />
                    <span>Send Invite</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
