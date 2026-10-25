import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  ShieldCheck, 
  UserPlus, 
  Check, 
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  Send,
  Trash2,
  Clock,
  Inbox
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { memberService, WorkspaceInvitation } from '../../services/memberService';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent: (email: string, role: string) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onInviteSent }) => {
  const { user } = useAuth();
  const workspaceName = user?.workspaceName || (user?.name ? `${user.name}'s Workspace` : 'My Workspace');
  const inviterName = user?.name || 'Workspace Admin';

  const [activeTab, setActiveTab] = useState<'create' | 'pending'>('create');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Member' | 'Admin' | 'Guest'>('Member');
  const [isSending, setIsSending] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<WorkspaceInvitation | null>(null);
  const [pendingInvites, setPendingInvites] = useState<WorkspaceInvitation[]>([]);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPendingInvites(memberService.getInvitations());
      setGeneratedInvite(null);
      setShowEmailPreview(false);
      setCopiedLink(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateAndSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      const invite = memberService.createInvitation(email.trim(), role, workspaceName, inviterName);
      setGeneratedInvite(invite);
      setPendingInvites(memberService.getInvitations());
      setIsSending(false);
      setShowEmailPreview(true);
      onInviteSent(email.trim(), role);
    }, 400);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenMailClient = (invite: WorkspaceInvitation) => {
    const subject = encodeURIComponent(`Invitation to join ${invite.workspaceName} on ClickUp`);
    const body = encodeURIComponent(
      `Hi,\n\n${invite.inviterName} has invited you to collaborate on the "${invite.workspaceName}" workspace on ClickUp 3.0 as a ${invite.role}.\n\nPlease click the link below to accept the invitation and get started:\n\n${invite.inviteLink}\n\nBest regards,\nThe ClickUp Team`
    );
    window.open(`mailto:${invite.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleRevoke = (token: string) => {
    memberService.revokeInvitation(token);
    setPendingInvites(memberService.getInvitations());
    if (generatedInvite?.token === token) {
      setGeneratedInvite(null);
      setShowEmailPreview(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '540px',
        maxWidth: '100%',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #eaebf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#faf5ff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Invite to {workspaceName}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                Send official join invitation email & share secure link
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
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 24px',
          backgroundColor: '#ffffff'
        }}>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '12px 16px',
              border: 'none',
              borderBottom: activeTab === 'create' ? '2.5px solid #7c3aed' : '2.5px solid transparent',
              background: 'none',
              color: activeTab === 'create' ? '#7c3aed' : '#64748b',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            Send New Invite
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '12px 16px',
              border: 'none',
              borderBottom: activeTab === 'pending' ? '2.5px solid #7c3aed' : '2.5px solid transparent',
              background: 'none',
              color: activeTab === 'pending' ? '#7c3aed' : '#64748b',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Pending Invites</span>
            {pendingInvites.filter(i => i.status === 'pending').length > 0 && (
              <span style={{
                backgroundColor: '#ede9fe',
                color: '#7c3aed',
                fontSize: '0.72rem',
                padding: '2px 7px',
                borderRadius: '100px',
                fontWeight: 800
              }}>
                {pendingInvites.filter(i => i.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'create' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <form onSubmit={handleCreateAndSendInvite} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Email Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Recipient Email Address *
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    backgroundColor: '#ffffff'
                  }}>
                    <Mail size={18} color="#7c3aed" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. colleague@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.9rem',
                        color: '#0f172a',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                {/* Role selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Assigned Workspace Role
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {(['Member', 'Admin', 'Guest'] as const).map(r => (
                      <div
                        key={r}
                        onClick={() => setRole(r)}
                        style={{
                          border: '2px solid',
                          borderColor: role === r ? '#7c3aed' : '#e2e8f0',
                          backgroundColor: role === r ? '#faf5ff' : '#ffffff',
                          borderRadius: '12px',
                          padding: '12px 10px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.86rem', color: role === r ? '#7c3aed' : '#1e293b' }}>
                          {r}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px' }}>
                          {r === 'Admin' ? 'Can create channels & assign' : r === 'Member' ? 'Full sprint & task access' : 'Limited view only'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSending}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
                  }}
                >
                  {isSending ? (
                    <span>Generating Invitation Link...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Invitation Mail & Generate Link</span>
                    </>
                  )}
                </button>
              </form>

              {/* Generated Invite Details Card */}
              {generatedInvite && showEmailPreview && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 700, fontSize: '0.86rem' }}>
                      <CheckCircle2 size={18} />
                      <span>Invitation Ready for {generatedInvite.email}!</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                      Role: {generatedInvite.role}
                    </span>
                  </div>

                  {/* Copy Link input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                      Official Invitation Link:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        readOnly
                        value={generatedInvite.inviteLink}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.78rem',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyLink(generatedInvite.inviteLink)}
                        style={{
                          padding: '8px 14px',
                          backgroundColor: copiedLink ? '#16a34a' : '#7c3aed',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Mail & Preview Actions */}
                  <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenMailClient(generatedInvite)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #7c3aed',
                        color: '#7c3aed',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Mail size={15} />
                      <span>Open in Mail Client</span>
                    </button>

                    <a
                      href={generatedInvite.inviteLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        textDecoration: 'none'
                      }}
                    >
                      <ExternalLink size={15} />
                      <span>Test Join Link</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Pending Invites Tab */
            <div>
              {pendingInvites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 10px', color: '#94a3b8' }}>
                  <Inbox size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>No pending invitations</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>Send an invite above to see it listed here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pendingInvites.map(inv => (
                    <div
                      key={inv.id}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e293b' }}>
                            {inv.email}
                          </span>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '100px',
                            backgroundColor: inv.role === 'Admin' ? '#fee2e2' : '#ede9fe',
                            color: inv.role === 'Admin' ? '#dc2626' : '#7c3aed'
                          }}>
                            {inv.role}
                          </span>
                          {inv.status === 'accepted' ? (
                            <span style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <CheckCircle2 size={12} /> Joined
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Clock size={12} /> Pending
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                          Invited by {inv.inviterName} • {inv.createdAt}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(inv.inviteLink)}
                          style={{
                            padding: '6px 10px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Copy Link"
                        >
                          <Copy size={13} />
                          <span>Link</span>
                        </button>

                        <a
                          href={inv.inviteLink}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: '6px 10px',
                            backgroundColor: '#ede9fe',
                            border: '1px solid #c4b5fd',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            color: '#7c3aed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none'
                          }}
                          title="Open Join Page"
                        >
                          <ExternalLink size={13} />
                          <span>Join</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleRevoke(inv.token)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                          title="Revoke Invitation"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #eaebf0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              backgroundColor: '#e2e8f0',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
