import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TaskItem } from '../types';
import { INITIAL_TASKS } from '../data/clickupData';
import { isValidUUID, ensureUUID, generateUUID } from '../lib/uuid';

export const supabaseService = {
  isConfigured: () => isSupabaseConfigured,

  // ==========================================
  // 1. TASKS
  // ==========================================
  async getTasks(userId?: string): Promise<{ tasks: TaskItem[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      const stored = localStorage.getItem('clickjoy_saved_tasks');
      return { tasks: stored ? JSON.parse(stored) : INITIAL_TASKS };
    }

    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[OneDesk DB] Supabase fetch error:', error);
        return { tasks: [], error: error.message };
      }

      const mappedTasks: TaskItem[] = (data || []).map((item: any) => ({
        id: item.id,
        key: item.key,
        title: item.title,
        status: item.status,
        priority: item.priority,
        dueDate: item.due_date || 'May 28, 2026',
        timeEstimate: item.time_estimate || '3d',
        tags: item.tags || ['Feature'],
        commentsCount: item.comments_count || 0,
        userId: item.user_id,
        workspaceId: item.workspace_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        assignee: {
          name: item.assignee_name || 'Team Member',
          avatar: item.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
          role: item.assignee_role || 'Product Lead'
        }
      }));

      // Cache tasks locally for offline / reconnect resilience
      try {
        const cacheKey = userId ? `clickjoy_saved_tasks_${userId}` : 'clickjoy_saved_tasks';
        localStorage.setItem(cacheKey, JSON.stringify(mappedTasks));
      } catch {}

      return { tasks: mappedTasks };
    } catch (err: any) {
      console.error('[OneDesk DB] Unexpected error fetching tasks:', err);
      // Fallback to cache if available during offline / network drop
      try {
        const cacheKey = userId ? `clickjoy_saved_tasks_${userId}` : 'clickjoy_saved_tasks';
        const stored = localStorage.getItem(cacheKey) || localStorage.getItem('clickjoy_saved_tasks');
        if (stored) {
          const cached = JSON.parse(stored);
          if (Array.isArray(cached) && cached.length > 0) {
            return { tasks: cached };
          }
        }
      } catch {}
      return { tasks: [], error: err.message || 'Failed to fetch tasks from database' };
    }
  },

  async createTask(task: TaskItem, userId?: string): Promise<{ success: boolean; data?: TaskItem; error?: string }> {
    const safeId = ensureUUID(task.id);
    const resolvedUserId = userId || task.userId;
    const taskToSave: TaskItem = {
      ...task,
      id: safeId,
      userId: resolvedUserId
    };

    if (!isSupabaseConfigured || !supabase) {
      try {
        const stored = localStorage.getItem('clickjoy_saved_tasks');
        const list = stored ? JSON.parse(stored) : INITIAL_TASKS;
        localStorage.setItem('clickjoy_saved_tasks', JSON.stringify([taskToSave, ...list]));
      } catch {}
      return { success: true, data: taskToSave };
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          id: safeId,
          key: taskToSave.key,
          title: taskToSave.title,
          description: '',
          status: taskToSave.status,
          priority: taskToSave.priority,
          due_date: taskToSave.dueDate,
          time_estimate: taskToSave.timeEstimate,
          tags: taskToSave.tags,
          assignee_name: taskToSave.assignee.name,
          assignee_avatar: taskToSave.assignee.avatar,
          assignee_role: taskToSave.assignee.role,
          comments_count: taskToSave.commentsCount,
          user_id: resolvedUserId || null
        })
        .select()
        .single();

      if (error) {
        console.error('[OneDesk DB] Error inserting task to Supabase:', error);
        return { success: false, error: `${error.code ? error.code + ': ' : ''}${error.message}` };
      }

      // Sync local cache with successfully inserted record
      try {
        const cacheKey = resolvedUserId ? `clickjoy_saved_tasks_${resolvedUserId}` : 'clickjoy_saved_tasks';
        const stored = localStorage.getItem(cacheKey);
        const list = stored ? JSON.parse(stored) : [];
        localStorage.setItem(cacheKey, JSON.stringify([taskToSave, ...list.filter((t: any) => t.id !== safeId)]));
      } catch {}

      return { success: true, data: taskToSave };
    } catch (err: any) {
      console.error('[OneDesk DB] Unexpected error creating task:', err);
      return { success: false, error: err.message || 'Database insert failed' };
    }
  },

  async updateTask(task: TaskItem): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(task.id)) {
      const err = `Cannot update task: ID "${task.id}" is not a valid UUID format.`;
      console.error('[OneDesk DB]', err);
      return { success: false, error: err };
    }

    if (!isSupabaseConfigured || !supabase) {
      try {
        const stored = localStorage.getItem('clickjoy_saved_tasks');
        if (stored) {
          const list: TaskItem[] = JSON.parse(stored);
          localStorage.setItem('clickjoy_saved_tasks', JSON.stringify(list.map(t => (t.id === task.id ? task : t))));
        }
      } catch {}
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          status: task.status,
          priority: task.priority,
          due_date: task.dueDate,
          time_estimate: task.timeEstimate,
          tags: task.tags,
          assignee_name: task.assignee?.name,
          assignee_avatar: task.assignee?.avatar,
          assignee_role: task.assignee?.role,
          comments_count: task.commentsCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);

      if (error) {
        console.error('[OneDesk DB] Error updating task in Supabase:', error);
        return { success: false, error: `${error.code ? error.code + ': ' : ''}${error.message}` };
      }

      // Sync local cache with updated record
      try {
        const cacheKey = task.userId ? `clickjoy_saved_tasks_${task.userId}` : 'clickjoy_saved_tasks';
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
          const list: TaskItem[] = JSON.parse(stored);
          localStorage.setItem(cacheKey, JSON.stringify(list.map(t => (t.id === task.id ? task : t))));
        }
      } catch {}

      return { success: true };
    } catch (err: any) {
      console.error('[OneDesk DB] Unexpected error updating task:', err);
      return { success: false, error: err.message || 'Database update failed' };
    }
  },

  async deleteTask(taskId: string, userId?: string): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(taskId)) {
      const err = `Cannot delete task: ID "${taskId}" is not a valid UUID format.`;
      console.error('[OneDesk DB]', err);
      return { success: false, error: err };
    }

    if (!isSupabaseConfigured || !supabase) {
      try {
        const stored = localStorage.getItem('clickjoy_saved_tasks');
        if (stored) {
          const list: TaskItem[] = JSON.parse(stored);
          localStorage.setItem('clickjoy_saved_tasks', JSON.stringify(list.filter(t => t.id !== taskId)));
        }
      } catch {}
      return { success: true };
    }

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);

      if (error) {
        console.error('[OneDesk DB] Error deleting task from Supabase:', error);
        return { success: false, error: `${error.code ? error.code + ': ' : ''}${error.message}` };
      }

      // Remove from local cache
      try {
        const cacheKey = userId ? `clickjoy_saved_tasks_${userId}` : 'clickjoy_saved_tasks';
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
          const list: TaskItem[] = JSON.parse(stored);
          localStorage.setItem(cacheKey, JSON.stringify(list.filter(t => t.id !== taskId)));
        }
      } catch {}

      return { success: true };
    } catch (err: any) {
      console.error('[OneDesk DB] Unexpected error deleting task:', err);
      return { success: false, error: err.message || 'Database delete failed' };
    }
  },

  async migrateLocalTasksToCloud(
    userId: string,
    localTasks: TaskItem[]
  ): Promise<{ success: boolean; migratedCount: number; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, migratedCount: 0, error: 'Supabase is not configured' };
    }
    if (!userId) {
      return { success: false, migratedCount: 0, error: 'User ID is required for cloud migration' };
    }

    try {
      // 1. Fetch current cloud tasks to prevent duplicates
      const { tasks: cloudTasks } = await this.getTasks(userId);
      const existingTitles = new Set(cloudTasks.map(t => t.title.toLowerCase().trim()));
      const existingKeys = new Set(cloudTasks.map(t => t.key.toLowerCase().trim()));

      let migratedCount = 0;
      for (const t of localTasks) {
        // Skip duplicate
        if (existingTitles.has(t.title.toLowerCase().trim()) || existingKeys.has(t.key.toLowerCase().trim())) {
          continue;
        }

        const safeId = ensureUUID(t.id);
        const res = await this.createTask({
          ...t,
          id: safeId,
          userId
        }, userId);

        if (res.success) {
          migratedCount++;
        }
      }

      return { success: true, migratedCount };
    } catch (err: any) {
      console.error('[OneDesk DB] Migration error:', err);
      return { success: false, migratedCount: 0, error: err.message || 'Migration failed' };
    }
  },

  // ==========================================
  // 2. TIME ENTRIES (Timesheets)
  // ==========================================

  // ==========================================
  // 3. CLIPS (Audio/Video screen walkthroughs)
  // ==========================================
  async getClips(userId?: string): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('clips')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (userId && isValidUUID(userId)) {
          query = query.or(`user_id.eq.${userId},user_id.is.null`);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            title: c.title,
            type: c.type || 'video',
            durationSeconds: c.duration_seconds || 60,
            createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
            author: c.author || 'Team Member',
            authorInitials: c.author_initials || 'TM',
            views: c.views_count || 1,
            commentsCount: c.comments_count || 0,
            thumbnailGradient: c.thumbnail_gradient || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            transcript: c.transcript || '',
            tags: c.tags || ['Walkthrough'],
            videoUrl: c.video_url || null
          }));
        }
      } catch (err) {
        console.error('Supabase clips fetch error:', err);
      }
    }
    try {
      const stored = localStorage.getItem('clickup_clips_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async saveClip(clip: any, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const clipId = isValidUUID(clip.id) ? clip.id : generateUUID();
    const clipRecord = {
      id: clipId,
      title: clip.title.trim(),
      type: clip.type || 'video',
      duration_seconds: clip.durationSeconds || 60,
      author: clip.author || 'Team Member',
      author_initials: clip.authorInitials || 'TM',
      views_count: clip.views || 1,
      comments_count: clip.commentsCount || 0,
      thumbnail_gradient: clip.thumbnailGradient || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      transcript: clip.transcript || '',
      tags: clip.tags || ['Walkthrough'],
      video_url: clip.videoUrl || null,
      user_id: (userId && isValidUUID(userId)) ? userId : null
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('clips').insert([clipRecord]).select().single();
        if (error) {
          console.warn('[OneDesk Clips] Supabase save error:', error.message);
          return { success: false, error: error.message };
        }
        return { success: true, data };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    try {
      const existing = JSON.parse(localStorage.getItem('clickup_clips_v1') || '[]');
      localStorage.setItem('clickup_clips_v1', JSON.stringify([clipRecord, ...existing]));
    } catch {}

    return { success: true, data: clipRecord };
  },

  async deleteClip(clipId: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured && supabase && isValidUUID(clipId)) {
      try {
        const { error } = await supabase.from('clips').delete().eq('id', clipId);
        if (error) return { success: false, error: error.message };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
    try {
      const existing = JSON.parse(localStorage.getItem('clickup_clips_v1') || '[]');
      const filtered = existing.filter((c: any) => c.id !== clipId);
      localStorage.setItem('clickup_clips_v1', JSON.stringify(filtered));
    } catch {}
    return { success: true };
  },


  // ==========================================
  // 5. CHAT MESSAGES & REALTIME
  // ==========================================
  async getChatMessages(channelKey?: string): Promise<{ messages: any[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      try {
        const stored = localStorage.getItem(`clickup_channel_msgs_${channelKey || 'general'}`);
        return { messages: stored ? JSON.parse(stored) : [] };
      } catch {
        return { messages: [] };
      }
    }

    try {
      let query = supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (channelKey) {
        query = query.or(`recipient_user.eq.${channelKey},channel_id.eq.${channelKey}`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[OneDesk Chat] Error loading messages:', error);
        return { messages: [], error: error.message };
      }

      const mapped = (data || []).map((m: any) => ({
        id: m.id,
        text: m.text,
        sender: m.sender,
        initials: m.sender_initials,
        avatarBg: m.avatar_bg || '#0f172a',
        isAi: m.is_ai || false,
        timestamp: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        userId: m.user_id,
        channelKey: m.recipient_user || 'general'
      }));

      return { messages: mapped };
    } catch (err: any) {
      console.error('[OneDesk Chat] Exception:', err);
      return { messages: [], error: err.message };
    }
  },

  async sendChatMessage(msg: {
    id?: string;
    text: string;
    sender: string;
    initials?: string;
    avatarBg?: string;
    isAi?: boolean;
    channelKey?: string;
    userId?: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    const safeId = ensureUUID(msg.id);

    if (!isSupabaseConfigured || !supabase) {
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          id: safeId,
          text: msg.text.trim(),
          sender: msg.sender,
          sender_initials: msg.initials || 'ME',
          avatar_bg: msg.avatarBg || '#0f172a',
          is_ai: msg.isAi || false,
          recipient_user: msg.channelKey || 'general',
          user_id: msg.userId || null
        })
        .select()
        .single();

      if (error) {
        console.error('[OneDesk Chat] Send message error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  subscribeToChat(channelKey: string, onNewMessage: (msg: any) => void) {
    if (!isSupabaseConfigured || !supabase) return () => {};

    const channelName = `chat-realtime-${channelKey || 'all'}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload: any) => {
        const m = payload.new;
        if (!channelKey || m.recipient_user === channelKey) {
          onNewMessage({
            id: m.id,
            text: m.text,
            sender: m.sender,
            initials: m.sender_initials,
            avatarBg: m.avatar_bg || '#0f172a',
            isAi: m.is_ai || false,
            timestamp: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            userId: m.user_id,
            channelKey: m.recipient_user || 'general'
          });
        }
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  },

  // ==========================================
  // 6. DOCS CLOUD PERSISTENCE
  // ==========================================
  async getDocs(userId?: string): Promise<{ docs: any[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      try {
        const stored = localStorage.getItem('clickup_saved_docs_v2');
        return { docs: stored ? JSON.parse(stored) : [] };
      } catch {
        return { docs: [] };
      }
    }

    try {
      let query = supabase
        .from('docs')
        .select('*')
        .order('updated_at', { ascending: false });

      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }

      const { data, error } = await query;
      if (error) {
        return { docs: [], error: error.message };
      }

      const mapped = (data || []).map((d: any) => ({
        id: d.id,
        name: d.title || 'Untitled Document',
        content: d.content || '',
        location: d.category || 'General',
        tags: [],
        dateUpdated: d.updated_at ? new Date(d.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
        dateViewed: '-',
        isFavorite: false,
        userId: d.user_id
      }));

      return { docs: mapped };
    } catch (err: any) {
      return { docs: [], error: err.message };
    }
  },

  async saveDoc(doc: { id?: string; title: string; content: string }, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const safeId = ensureUUID(doc.id);

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, data: { ...doc, id: safeId } };
    }

    try {
      const { data, error } = await supabase
        .from('docs')
        .upsert({
          id: safeId,
          title: doc.title || 'Untitled Document',
          content: doc.content || '',
          user_id: userId || null,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('[OneDesk Docs] Save doc error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteDoc(docId: string): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(docId)) {
      return { success: false, error: 'Invalid Doc UUID' };
    }
    if (!isSupabaseConfigured || !supabase) {
      return { success: true };
    }

    try {
      const { error } = await supabase.from('docs').delete().eq('id', docId);
      return { success: !error, error: error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================
  // 7. WHITEBOARDS CLOUD PERSISTENCE
  // ==========================================
  async getWhiteboards(userId?: string): Promise<{ whiteboards: any[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { whiteboards: [] };
    }

    try {
      let query = supabase
        .from('whiteboards')
        .select('*')
        .order('updated_at', { ascending: false });

      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }

      const { data, error } = await query;
      if (error) {
        return { whiteboards: [], error: error.message };
      }

      const mapped = (data || []).map((w: any) => ({
        id: w.id,
        title: w.title || 'Untitled Whiteboard',
        items: Array.isArray(w.elements) ? w.elements : (w.elements?.items || []),
        strokes: w.elements?.strokes || [],
        templateType: w.elements?.templateType || 'scratch',
        dateUpdated: w.updated_at ? new Date(w.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
        dateCreated: w.created_at,
        isFavorite: false,
        userId: w.user_id
      }));

      return { whiteboards: mapped };
    } catch (err: any) {
      return { whiteboards: [], error: err.message };
    }
  },

  async saveWhiteboard(wb: {
    id?: string;
    title: string;
    items: any[];
    strokes?: any[];
    templateType?: string;
  }, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const safeId = ensureUUID(wb.id);

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, data: { ...wb, id: safeId } };
    }

    try {
      const elementsPayload = {
        items: wb.items || [],
        strokes: wb.strokes || [],
        templateType: wb.templateType || 'scratch'
      };

      const { data, error } = await supabase
        .from('whiteboards')
        .upsert({
          id: safeId,
          title: wb.title || 'Untitled Whiteboard',
          elements: elementsPayload,
          user_id: userId || null,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('[OneDesk Whiteboard] Save error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteWhiteboard(wbId: string): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(wbId)) {
      return { success: false, error: 'Invalid Whiteboard UUID' };
    }
    if (!isSupabaseConfigured || !supabase) {
      return { success: true };
    }

    try {
      const { error } = await supabase.from('whiteboards').delete().eq('id', wbId);
      return { success: !error, error: error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================
  // 8. REALTIME MULTIPLAYER SYNC
  // ==========================================
  subscribeToTasks(onUpdate: () => void) {
    if (!isSupabaseConfigured || !supabase) return () => {};

    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        onUpdate();
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  },

  // ==========================================
  // 9. PHASE 3A: CALENDAR & PLANNER EVENTS
  // ==========================================
  async getCalendarEvents(userId?: string): Promise<{ events: any[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { events: [] };
    }
    try {
      let query = supabase.from('calendar_events').select('*').order('date_str', { ascending: true });
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error) return { events: [], error: error.message };
      return {
        events: (data || []).map((e: any) => ({
          id: e.id,
          title: e.title,
          dayIndex: e.day_index,
          dateStr: e.date_str,
          startHour: Number(e.start_hour),
          durationHours: Number(e.duration_hours),
          isAllDay: e.is_all_day,
          color: e.color,
          bgColor: e.bg_color,
          borderColor: e.border_color,
          textColor: e.text_color,
          badge: e.badge,
          type: e.type,
          attendees: e.attendees || [],
          meetingUrl: e.meeting_url,
          description: e.description,
          userId: e.user_id
        }))
      };
    } catch (err: any) {
      return { events: [], error: err.message };
    }
  },

  async saveCalendarEvent(evt: any, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const safeId = ensureUUID(evt.id);
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, data: { ...evt, id: safeId } };
    }
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .upsert({
          id: safeId,
          title: evt.title || 'Untitled Event',
          day_index: evt.dayIndex ?? 0,
          date_str: evt.dateStr || new Date().toISOString().split('T')[0],
          start_hour: evt.startHour ?? 10,
          duration_hours: evt.durationHours ?? 1,
          is_all_day: evt.isAllDay ?? false,
          color: evt.color || '#7c3aed',
          bg_color: evt.bgColor || '#faf5ff',
          border_color: evt.borderColor || '#ddd6fe',
          text_color: evt.textColor || '#6b21a8',
          badge: evt.badge || null,
          type: evt.type || 'meeting',
          attendees: evt.attendees || [],
          meeting_url: evt.meetingUrl || null,
          description: evt.description || '',
          user_id: userId || null,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteCalendarEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(eventId)) return { success: false, error: 'Invalid Event UUID' };
    if (!isSupabaseConfigured || !supabase) return { success: true };
    try {
      const { error } = await supabase.from('calendar_events').delete().eq('id', eventId);
      return { success: !error, error: error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================
  // 10. PHASE 3B: NOTIFICATIONS & INBOX
  // ==========================================
  async getNotifications(userId?: string): Promise<{ notifications: any[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) return { notifications: [] };
    try {
      let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error) return { notifications: [], error: error.message };
      return {
        notifications: (data || []).map((n: any) => ({
          id: n.id,
          sender: n.sender,
          senderAvatar: n.sender_avatar,
          isAi: n.is_ai,
          action: n.action,
          taskTitle: n.task_title,
          taskId: n.task_id,
          content: n.content,
          timestamp: n.created_at ? new Date(n.created_at).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          isRead: n.is_read,
          tab: n.tab || 'primary'
        }))
      };
    } catch (err: any) {
      return { notifications: [], error: err.message };
    }
  },

  async createNotification(notif: any, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const safeId = ensureUUID(notif.id);
    if (!isSupabaseConfigured || !supabase) return { success: true, data: { ...notif, id: safeId } };
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          id: safeId,
          sender: notif.sender || 'System',
          sender_avatar: notif.senderAvatar || 'SY',
          is_ai: notif.isAi || false,
          action: notif.action,
          task_title: notif.taskTitle || null,
          task_id: notif.taskId && isValidUUID(notif.taskId) ? notif.taskId : null,
          content: notif.content,
          is_read: notif.isRead || false,
          tab: notif.tab || 'primary',
          user_id: userId || null
        })
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async updateNotificationStatus(notifId: string, updates: { isRead?: boolean; tab?: string }): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(notifId) || !isSupabaseConfigured || !supabase) return { success: true };
    try {
      const payload: any = {};
      if (updates.isRead !== undefined) payload.is_read = updates.isRead;
      if (updates.tab !== undefined) payload.tab = updates.tab;
      const { error } = await supabase.from('notifications').update(payload).eq('id', notifId);
      return { success: !error, error: error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================
  // 11. PHASE 3C: TIME TRACKING & TIMESHEETS
  // ==========================================
  async getTimeEntries(userId?: string): Promise<{ entries: any[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) return { entries: [] };
    try {
      let query = supabase.from('time_entries').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error) return { entries: [], error: error.message };
      return {
        entries: (data || []).map((t: any) => ({
          id: t.id,
          taskId: t.task_id || '',
          taskTitle: t.task_title,
          taskKey: t.task_key || 'CRM-101',
          durationSeconds: t.duration_seconds || 0,
          dateStr: t.date_str,
          dayOfWeek: t.day_of_week ?? 0,
          startTime: t.start_time || '10:00 am',
          endTime: t.end_time || '11:00 am',
          notes: t.notes || '',
          tags: t.tags || ['Development'],
          billable: t.billable ?? true,
          user: t.user_name || 'Joy Kumar Yuv'
        }))
      };
    } catch (err: any) {
      return { entries: [], error: err.message };
    }
  },

  async saveTimeEntry(entry: any, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const safeId = ensureUUID(entry.id);
    if (!isSupabaseConfigured || !supabase) return { success: true, data: { ...entry, id: safeId } };
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .upsert({
          id: safeId,
          task_id: entry.taskId || null,
          task_title: entry.taskTitle || 'General Task',
          task_key: entry.taskKey || 'CRM-101',
          duration_seconds: entry.durationSeconds || 0,
          date_str: entry.dateStr || new Date().toISOString().split('T')[0],
          day_of_week: entry.dayOfWeek ?? 0,
          start_time: entry.startTime || '10:00 am',
          end_time: entry.endTime || '11:00 am',
          notes: entry.notes || '',
          tags: entry.tags || ['Development'],
          billable: entry.billable ?? true,
          user_name: entry.user || 'Joy Kumar Yuv',
          user_id: userId || null
        })
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteTimeEntry(entryId: string): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(entryId) || !isSupabaseConfigured || !supabase) return { success: true };
    try {
      const { error } = await supabase.from('time_entries').delete().eq('id', entryId);
      return { success: !error, error: error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================
  // 12. PHASE 3D: FORMS & SUBMISSIONS
  // ==========================================
  async getForms(userId?: string): Promise<{ forms: any[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) return { forms: [] };
    try {
      let query = supabase.from('forms').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error) return { forms: [], error: error.message };
      return {
        forms: (data || []).map((f: any) => ({
          id: f.id,
          name: f.title,
          description: f.description,
          location: f.target_list || 'Backlog',
          createdBy: 'Workspace Member',
          dateViewed: 'Today',
          isFavorite: false,
          fields: f.fields || [],
          responsesCount: f.submissions_count || 0
        }))
      };
    } catch (err: any) {
      return { forms: [], error: err.message };
    }
  },

  async saveForm(form: any, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const safeId = ensureUUID(form.id);
    if (!isSupabaseConfigured || !supabase) return { success: true, data: { ...form, id: safeId } };
    try {
      const { data, error } = await supabase
        .from('forms')
        .upsert({
          id: safeId,
          title: form.name || 'New Form',
          description: form.description || '',
          status: 'active',
          submissions_count: form.responsesCount || 0,
          color: '#7c3aed',
          fields: form.fields || [],
          target_list: form.location || 'Sales CRM Backlog',
          user_id: userId || null,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteForm(formId: string): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(formId) || !isSupabaseConfigured || !supabase) return { success: true };
    try {
      const { error } = await supabase.from('forms').delete().eq('id', formId);
      return { success: !error, error: error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async submitFormResponse(formId: string, answers: any, email?: string): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(formId) || !isSupabaseConfigured || !supabase) return { success: true };
    try {
      const { error } = await supabase.from('form_submissions').insert({
        id: crypto.randomUUID(),
        form_id: formId,
        submitter_email: email || 'anonymous@domain.com',
        answers: answers || {}
      });
      if (error) return { success: false, error: error.message };

      // Increment form submission count
      const { data: frm } = await supabase.from('forms').select('submissions_count').eq('id', formId).single();
      if (frm) {
        await supabase.from('forms').update({ submissions_count: (frm.submissions_count || 0) + 1 }).eq('id', formId);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================
  // 13. PHASE 3E: GOALS & TARGETS
  // ==========================================
  async getGoals(userId?: string): Promise<{ goals: any[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) return { goals: [] };
    try {
      let query = supabase.from('goals').select('*, goal_targets(*)').order('created_at', { ascending: false });
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error) return { goals: [], error: error.message };
      return {
        goals: (data || []).map((g: any) => ({
          id: g.id,
          name: g.name,
          description: g.description,
          owner: g.owner || 'Workspace Member',
          ownerInitials: g.owner_initials || 'WM',
          color: g.color || '#7c3aed',
          icon: g.icon || '🎯',
          dueDate: g.due_date || 'Dec 31, 2026',
          status: g.status || 'on_track',
          targets: (g.goal_targets || []).map((t: any) => ({
            id: t.id,
            name: t.name,
            type: t.type,
            currentValue: Number(t.current_value),
            targetValue: Number(t.target_value),
            unit: t.unit || undefined
          }))
        }))
      };
    } catch (err: any) {
      return { goals: [], error: err.message };
    }
  },

  async saveGoal(goal: any, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const safeId = ensureUUID(goal.id);
    if (!isSupabaseConfigured || !supabase) return { success: true, data: { ...goal, id: safeId } };
    try {
      const { data, error } = await supabase
        .from('goals')
        .upsert({
          id: safeId,
          name: goal.name,
          description: goal.description || '',
          owner: goal.owner || 'Workspace Member',
          owner_initials: goal.ownerInitials || 'WM',
          color: goal.color || '#7c3aed',
          icon: goal.icon || '🎯',
          due_date: goal.dueDate || 'Dec 31, 2026',
          status: goal.status || 'on_track',
          user_id: userId || null,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) return { success: false, error: error.message };

      // Upsert targets
      if (goal.targets && goal.targets.length > 0) {
        for (const t of goal.targets) {
          const targetId = ensureUUID(t.id);
          await supabase.from('goal_targets').upsert({
            id: targetId,
            goal_id: safeId,
            name: t.name,
            type: t.type || 'tasks',
            current_value: t.currentValue ?? 0,
            target_value: t.targetValue ?? 10,
            unit: t.unit || null
          });
        }
      }

      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteGoal(goalId: string): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(goalId) || !isSupabaseConfigured || !supabase) return { success: true };
    try {
      const { error } = await supabase.from('goals').delete().eq('id', goalId);
      return { success: !error, error: error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================
  // 14. PHASE 3G: GLOBAL SEARCH
  // ==========================================
  async globalSearch(searchTerm: string, userId?: string): Promise<{
    tasks: any[];
    docs: any[];
    channels: any[];
  }> {
    if (!searchTerm || !searchTerm.trim() || !isSupabaseConfigured || !supabase) {
      return { tasks: [], docs: [], channels: [] };
    }

    try {
      const term = `%${searchTerm.trim()}%`;
      const [tasksRes, docsRes, channelsRes] = await Promise.all([
        supabase.from('tasks').select('id, title, key, status').ilike('title', term).limit(5),
        supabase.from('docs').select('id, title').ilike('title', term).limit(5),
        supabase.from('channels').select('id, name, topic').ilike('name', term).limit(5)
      ]);

      return {
        tasks: tasksRes.data || [],
        docs: docsRes.data || [],
        channels: channelsRes.data || []
      };
    } catch {
      return { tasks: [], docs: [], channels: [] };
    }
  },

  // ==========================================
  // 15. PHASE 4: WORKSPACE HIERARCHY (Space -> Folder -> List)
  // ==========================================
  async getSpaces(workspaceId?: string): Promise<{ spaces: any[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { spaces: [] };
    }
    try {
      let query = supabase.from('spaces').select('*').eq('is_archived', false).order('created_at', { ascending: true });
      if (workspaceId && isValidUUID(workspaceId)) {
        query = query.eq('workspace_id', workspaceId);
      }
      const { data, error } = await query;
      if (error) {
        return { spaces: [], error: error.message };
      }
      return { spaces: data || [] };
    } catch (err: any) {
      return { spaces: [], error: err.message };
    }
  },

  async createSpace(space: { name: string; workspaceId: string; color?: string; icon?: string }): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase client not configured' };
    }
    try {
      const spaceId = generateUUID();
      const newSpace = {
        id: spaceId,
        workspace_id: space.workspaceId,
        name: space.name.trim(),
        color: space.color || '#7c3aed',
        icon: space.icon || 'layout',
        is_archived: false
      };
      const { data, error } = await supabase.from('spaces').insert([newSpace]).select().single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async updateSpace(spaceId: string, updates: Partial<{ name: string; color: string; icon: string; is_archived: boolean }>): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(spaceId)) return { success: false, error: 'Invalid UUID format for spaceId' };
    if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured' };
    try {
      const { error } = await supabase.from('spaces').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', spaceId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteSpace(spaceId: string): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(spaceId)) return { success: false, error: 'Invalid UUID format for spaceId' };
    if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured' };
    try {
      const { error } = await supabase.from('spaces').delete().eq('id', spaceId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getFolders(spaceId?: string, workspaceId?: string): Promise<{ folders: any[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) return { folders: [] };
    try {
      let query = supabase.from('folders').select('*').eq('is_archived', false).order('created_at', { ascending: true });
      if (spaceId && isValidUUID(spaceId)) query = query.eq('space_id', spaceId);
      if (workspaceId && isValidUUID(workspaceId)) query = query.eq('workspace_id', workspaceId);
      const { data, error } = await query;
      if (error) return { folders: [], error: error.message };
      return { folders: data || [] };
    } catch (err: any) {
      return { folders: [], error: err.message };
    }
  },

  async createFolder(folder: { name: string; spaceId: string; workspaceId: string }): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase client not configured' };
    try {
      const folderId = generateUUID();
      const newFolder = {
        id: folderId,
        space_id: folder.spaceId,
        workspace_id: folder.workspaceId,
        name: folder.name.trim(),
        is_archived: false
      };
      const { data, error } = await supabase.from('folders').insert([newFolder]).select().single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async updateFolder(folderId: string, updates: Partial<{ name: string; is_archived: boolean }>): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(folderId)) return { success: false, error: 'Invalid UUID format for folderId' };
    if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured' };
    try {
      const { error } = await supabase.from('folders').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', folderId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteFolder(folderId: string): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(folderId)) return { success: false, error: 'Invalid UUID format for folderId' };
    if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured' };
    try {
      const { error } = await supabase.from('folders').delete().eq('id', folderId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getLists(spaceId?: string, folderId?: string, workspaceId?: string): Promise<{ lists: any[]; error?: string }> {
    if (!isSupabaseConfigured || !supabase) return { lists: [] };
    try {
      let query = supabase.from('lists').select('*').eq('is_archived', false).order('created_at', { ascending: true });
      if (spaceId && isValidUUID(spaceId)) query = query.eq('space_id', spaceId);
      if (folderId && isValidUUID(folderId)) query = query.eq('folder_id', folderId);
      if (workspaceId && isValidUUID(workspaceId)) query = query.eq('workspace_id', workspaceId);
      const { data, error } = await query;
      if (error) return { lists: [], error: error.message };
      return { lists: data || [] };
    } catch (err: any) {
      return { lists: [], error: err.message };
    }
  },

  async createList(list: { name: string; spaceId: string; folderId?: string; workspaceId: string; color?: string }): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase client not configured' };
    try {
      const listId = generateUUID();
      const newList = {
        id: listId,
        space_id: list.spaceId,
        folder_id: list.folderId || null,
        workspace_id: list.workspaceId,
        name: list.name.trim(),
        color: list.color || '#3b82f6',
        is_archived: false
      };
      const { data, error } = await supabase.from('lists').insert([newList]).select().single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async updateList(listId: string, updates: Partial<{ name: string; color: string; is_archived: boolean }>): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(listId)) return { success: false, error: 'Invalid UUID format for listId' };
    if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured' };
    try {
      const { error } = await supabase.from('lists').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', listId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteList(listId: string): Promise<{ success: boolean; error?: string }> {
    if (!isValidUUID(listId)) return { success: false, error: 'Invalid UUID format for listId' };
    if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured' };
    try {
      const { error } = await supabase.from('lists').delete().eq('id', listId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};
