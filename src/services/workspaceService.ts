import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateUUID, isValidUUID } from '../lib/uuid';

export interface WorkspaceRecord {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  role?: string;
}

export interface WorkspaceMemberRecord {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  name?: string;
  email?: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface WorkspaceInvitationRecord {
  id: string;
  workspaceId: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  token: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  expiresAt: string;
  createdAt: string;
  inviteLink?: string;
  workspaceName?: string;
}

export const workspaceService = {
  /**
   * Get all workspaces the user owns or is a member of
   */
  async getUserWorkspaces(userId: string): Promise<{ workspaces: WorkspaceRecord[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase || !userId) {
      return { workspaces: [] };
    }

    try {
      // 1. Fetch owned workspaces
      const { data: owned, error: ownedErr } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', userId);

      if (ownedErr) {
        console.error('[OneDesk Workspace] Error fetching owned workspaces:', ownedErr);
      }

      // 2. Fetch memberships
      const { data: memberships, error: memErr } = await supabase
        .from('workspace_members')
        .select('workspace_id, role, workspaces(*)')
        .eq('user_id', userId);

      if (memErr) {
        console.error('[OneDesk Workspace] Error fetching member workspaces:', memErr);
      }

      const map = new Map<string, WorkspaceRecord>();

      (owned || []).forEach((w: any) => {
        map.set(w.id, {
          id: w.id,
          name: w.name,
          ownerId: w.owner_id,
          createdAt: w.created_at,
          role: 'owner'
        });
      });

      (memberships || []).forEach((m: any) => {
        if (m.workspaces && !map.has(m.workspaces.id)) {
          map.set(m.workspaces.id, {
            id: m.workspaces.id,
            name: m.workspaces.name,
            ownerId: m.workspaces.owner_id,
            createdAt: m.workspaces.created_at,
            role: m.role
          });
        }
      });

      return { workspaces: Array.from(map.values()) };
    } catch (err: any) {
      console.error('[OneDesk Workspace] getUserWorkspaces exception:', err);
      return { workspaces: [], error: err.message };
    }
  },

  /**
   * Create a new workspace in Supabase
   */
  async createWorkspace(name: string, userId: string): Promise<{ success: boolean; workspace?: WorkspaceRecord; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Database is not configured' };
    }

    const wsId = generateUUID();
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          id: wsId,
          name: name.trim() || 'My Workspace',
          owner_id: userId
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Add user as owner member
      await supabase.from('workspace_members').insert({
        id: generateUUID(),
        workspace_id: wsId,
        user_id: userId,
        role: 'owner'
      });

      return {
        success: true,
        workspace: {
          id: data.id,
          name: data.name,
          ownerId: data.owner_id,
          createdAt: data.created_at,
          role: 'owner'
        }
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Get all members of a workspace
   */
  async getWorkspaceMembers(workspaceId: string): Promise<{ members: WorkspaceMemberRecord[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase || !workspaceId) {
      return { members: [] };
    }

    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select(`
          id,
          workspace_id,
          user_id,
          role,
          created_at,
          profiles (name, email, avatar_url)
        `)
        .eq('workspace_id', workspaceId);

      if (error) {
        return { members: [], error: error.message };
      }

      const list: WorkspaceMemberRecord[] = (data || []).map((row: any) => ({
        id: row.id,
        workspaceId: row.workspace_id,
        userId: row.user_id,
        role: row.role,
        name: row.profiles?.name || 'Workspace Member',
        email: row.profiles?.email || '',
        avatarUrl: row.profiles?.avatar_url || '',
        joinedAt: row.created_at
      }));

      return { members: list };
    } catch (err: any) {
      return { members: [], error: err.message };
    }
  },

  /**
   * Create a secure Supabase-backed invitation
   */
  async createInvitation(
    workspaceId: string,
    email: string,
    role: 'admin' | 'member' | 'guest',
    invitedByUserId: string,
    workspaceName?: string
  ): Promise<{ success: boolean; invitation?: WorkspaceInvitationRecord; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Database is not configured' };
    }

    const token = generateUUID().replace(/-/g, '') + Date.now().toString(36);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    const inviteLink = `${origin}/join-workspace?token=${token}&email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}&ws=${encodeURIComponent(workspaceName || 'OneDesk')}`;

    try {
      const { data, error } = await supabase
        .from('workspace_invitations')
        .insert({
          id: generateUUID(),
          workspace_id: workspaceId || null,
          email: email.trim().toLowerCase(),
          role: role.toLowerCase(),
          token,
          invited_by: invitedByUserId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        invitation: {
          id: data.id,
          workspaceId: data.workspace_id,
          email: data.email,
          role: data.role,
          token: data.token,
          invitedBy: data.invited_by,
          status: data.status,
          expiresAt: data.expires_at,
          createdAt: data.created_at,
          inviteLink,
          workspaceName: workspaceName || 'OneDesk'
        }
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Retrieve an invitation by its token
   */
  async getInvitationByToken(token: string): Promise<{ invitation?: WorkspaceInvitationRecord; error?: string }> {
    if (!isSupabaseConfigured || !supabase || !token) {
      return { error: 'Invalid invitation token' };
    }

    try {
      const { data, error } = await supabase
        .from('workspace_invitations')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (error) {
        return { error: error.message };
      }
      if (!data) {
        return { error: 'Invitation not found or expired' };
      }

      // Check expiration
      if (new Date(data.expires_at) < new Date()) {
        return { error: 'This invitation link has expired' };
      }

      if (data.status !== 'pending') {
        return { error: `This invitation has already been ${data.status}` };
      }

      return {
        invitation: {
          id: data.id,
          workspaceId: data.workspace_id,
          email: data.email,
          role: data.role,
          token: data.token,
          invitedBy: data.invited_by,
          status: data.status,
          expiresAt: data.expires_at,
          createdAt: data.created_at
        }
      };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  /**
   * Accept an invitation and bind the authenticated user to the workspace
   */
  async acceptInvitation(token: string, userId: string): Promise<{ success: boolean; workspaceId?: string; error?: string }> {
    if (!isSupabaseConfigured || !supabase || !token || !userId) {
      return { success: false, error: 'Invalid invitation parameters' };
    }

    try {
      const { invitation, error: lookupErr } = await this.getInvitationByToken(token);
      if (lookupErr || !invitation) {
        return { success: false, error: lookupErr || 'Invalid invitation' };
      }

      // 1. Mark invitation as accepted
      const { error: updateErr } = await supabase
        .from('workspace_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      // 2. Add to workspace_members (with duplicate prevention)
      if (invitation.workspaceId) {
        const { error: memberErr } = await supabase
          .from('workspace_members')
          .insert({
            id: generateUUID(),
            workspace_id: invitation.workspaceId,
            user_id: userId,
            role: invitation.role
          });

        if (memberErr && !memberErr.message.includes('duplicate key')) {
          console.warn('[OneDesk Workspace] Member insert notice:', memberErr.message);
        }
      }

      return { success: true, workspaceId: invitation.workspaceId };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Revoke an invitation
   */
  async revokeInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase || !invitationId) {
      return { success: false };
    }

    try {
      const { error } = await supabase
        .from('workspace_invitations')
        .update({ status: 'revoked' })
        .eq('id', invitationId);

      return { success: !error, error: error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};
