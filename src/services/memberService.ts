export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Guest';
  status: 'Online' | 'Away' | 'Offline';
  avatar: string;
  avatarBg?: string;
  initials: string;
  isYou?: boolean;
}

export interface WorkspaceInvitation {
  id: string;
  token: string;
  email: string;
  role: 'Admin' | 'Member' | 'Guest';
  workspaceName: string;
  inviterName: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'expired';
  inviteLink: string;
}

export const DEFAULT_MEMBERS: WorkspaceMember[] = [
  {
    id: 'u-owner',
    name: 'Workspace Owner',
    email: 'owner@clickup.com',
    role: 'Owner',
    status: 'Online',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    avatarBg: '#059669',
    initials: 'WO',
    isYou: false
  },
  {
    id: 'u-alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@clickup.demo',
    role: 'Admin',
    status: 'Online',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    avatarBg: '#7c3aed',
    initials: 'AR'
  },
  {
    id: 'u-priya',
    name: 'Priya Gupta',
    email: 'priya.gupta@clickup.demo',
    role: 'Member',
    status: 'Online',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    avatarBg: '#10b981',
    initials: 'PG'
  },
  {
    id: 'u-sarah',
    name: 'Sarah Chang',
    email: 'sarah.chang@clickup.demo',
    role: 'Member',
    status: 'Online',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
    avatarBg: '#8b5cf6',
    initials: 'SC'
  },
  {
    id: 'u-mei',
    name: 'Mei Chen',
    email: 'mei.chen@clickup.demo',
    role: 'Member',
    status: 'Away',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces',
    avatarBg: '#06b6d4',
    initials: 'MC'
  },
  {
    id: 'u-ryan',
    name: 'Ryan Johnson',
    email: 'ryan.johnson@clickup.demo',
    role: 'Member',
    status: 'Offline',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    avatarBg: '#f97316',
    initials: 'RJ'
  }
];

const MEMBERS_KEY = 'clickjoy_workspace_members_v2';
const INVITES_KEY = 'clickjoy_workspace_invitations_v2';
const CHANNEL_MEMBERS_KEY_PREFIX = 'clickjoy_channel_members_';

export const memberService = {
  // Members
  getWorkspaceMembers(): WorkspaceMember[] {
    try {
      const stored = localStorage.getItem(MEMBERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(DEFAULT_MEMBERS));
    return DEFAULT_MEMBERS;
  },

  addWorkspaceMember(member: WorkspaceMember): void {
    const list = this.getWorkspaceMembers();
    const existingIndex = list.findIndex(m => m.id === member.id || m.email === member.email);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...member };
    } else {
      list.push(member);
    }
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(list));
  },

  // Invitations
  getInvitations(): WorkspaceInvitation[] {
    try {
      const stored = localStorage.getItem(INVITES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  },

  createInvitation(
    email: string,
    role: 'Admin' | 'Member' | 'Guest',
    workspaceName: string,
    inviterName: string
  ): WorkspaceInvitation {
    const token = 'inv_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    const inviteLink = `${origin}/join?code=${token}&email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}&ws=${encodeURIComponent(workspaceName)}&by=${encodeURIComponent(inviterName)}`;

    const invite: WorkspaceInvitation = {
      id: 'inv-' + Date.now(),
      token,
      email,
      role,
      workspaceName,
      inviterName,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'pending',
      inviteLink
    };

    const current = this.getInvitations();
    const updated = [invite, ...current.filter(i => i.email !== email)];
    localStorage.setItem(INVITES_KEY, JSON.stringify(updated));
    return invite;
  },

  revokeInvitation(token: string): void {
    const current = this.getInvitations();
    const updated = current.filter(i => i.token !== token);
    localStorage.setItem(INVITES_KEY, JSON.stringify(updated));
  },

  acceptInvitation(token: string, newMemberDetails: { name: string; avatar?: string }): WorkspaceMember {
    const current = this.getInvitations();
    const invite = current.find(i => i.token === token);

    const email = invite ? invite.email : 'newmember@clickup.com';
    const role = invite ? invite.role : 'Member';
    const initials = newMemberDetails.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'NM';

    const newMember: WorkspaceMember = {
      id: 'u_' + Date.now(),
      name: newMemberDetails.name,
      email,
      role,
      status: 'Online',
      avatar: newMemberDetails.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      avatarBg: '#7c3aed',
      initials,
      isYou: true
    };

    this.addWorkspaceMember(newMember);

    // Also auto-add to general channel
    this.addMemberToChannel('general', newMember.id);
    this.addMemberToChannel('welcome', newMember.id);

    // Update invite status
    if (invite) {
      invite.status = 'accepted';
      localStorage.setItem(INVITES_KEY, JSON.stringify(current));
    }

    return newMember;
  },

  // Channels Members
  getChannelMembers(channelKey: string): WorkspaceMember[] {
    const allMembers = this.getWorkspaceMembers();
    try {
      const stored = localStorage.getItem(CHANNEL_MEMBERS_KEY_PREFIX + channelKey);
      if (stored) {
        const memberIds: string[] = JSON.parse(stored);
        return allMembers.filter(m => memberIds.includes(m.id));
      }
    } catch {}

    // Default: general channel has all initial members, other channels have Joy & Alex
    const defaultIds = channelKey === 'general'
      ? allMembers.map(m => m.id)
      : ['u-joy', 'u-alex'];

    localStorage.setItem(CHANNEL_MEMBERS_KEY_PREFIX + channelKey, JSON.stringify(defaultIds));
    return allMembers.filter(m => defaultIds.includes(m.id));
  },

  addMemberToChannel(channelKey: string, memberId: string): void {
    try {
      const stored = localStorage.getItem(CHANNEL_MEMBERS_KEY_PREFIX + channelKey);
      const memberIds: string[] = stored ? JSON.parse(stored) : ['u-joy', 'u-alex'];
      if (!memberIds.includes(memberId)) {
        memberIds.push(memberId);
        localStorage.setItem(CHANNEL_MEMBERS_KEY_PREFIX + channelKey, JSON.stringify(memberIds));
      }
    } catch {}
  },

  removeMemberFromChannel(channelKey: string, memberId: string): void {
    try {
      const stored = localStorage.getItem(CHANNEL_MEMBERS_KEY_PREFIX + channelKey);
      if (stored) {
        const memberIds: string[] = JSON.parse(stored);
        const filtered = memberIds.filter(id => id !== memberId);
        localStorage.setItem(CHANNEL_MEMBERS_KEY_PREFIX + channelKey, JSON.stringify(filtered));
      }
    } catch {}
  }
};
