import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TaskItem } from '../types';
import { INITIAL_TASKS } from '../data/clickupData';

export const supabaseService = {
  isConfigured: () => isSupabaseConfigured,

  // ==========================================
  // 1. TASKS
  // ==========================================
  async getTasks(): Promise<TaskItem[]> {
    if (!isSupabaseConfigured || !supabase) {
      const stored = localStorage.getItem('clickjoy_saved_tasks');
      return stored ? JSON.parse(stored) : INITIAL_TASKS;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Supabase fetch notice, falling back:', error);
        const stored = localStorage.getItem('clickjoy_saved_tasks');
        return stored ? JSON.parse(stored) : INITIAL_TASKS;
      }

      return data.map((item: any) => ({
        id: item.id,
        key: item.key,
        title: item.title,
        status: item.status,
        priority: item.priority,
        dueDate: item.due_date || 'May 28, 2026',
        timeEstimate: item.time_estimate || '3d',
        tags: item.tags || ['Feature'],
        commentsCount: item.comments_count || 0,
        assignee: {
          name: item.assignee_name || 'Team Member',
          avatar: item.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
          role: item.assignee_role || 'Product Lead'
        }
      }));
    } catch (err) {
      console.error('Error fetching from Supabase:', err);
      const stored = localStorage.getItem('clickjoy_saved_tasks');
      return stored ? JSON.parse(stored) : INITIAL_TASKS;
    }
  },

  async createTask(task: TaskItem): Promise<void> {
    // 1. Always sync to localStorage
    try {
      const stored = localStorage.getItem('clickjoy_saved_tasks');
      const list = stored ? JSON.parse(stored) : INITIAL_TASKS;
      localStorage.setItem('clickjoy_saved_tasks', JSON.stringify([task, ...list]));
    } catch {}

    // 2. If Supabase configured, insert to PostgreSQL
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tasks').insert({
          key: task.key,
          title: task.title,
          status: task.status,
          priority: task.priority,
          due_date: task.dueDate,
          time_estimate: task.timeEstimate,
          tags: task.tags,
          assignee_name: task.assignee.name,
          assignee_avatar: task.assignee.avatar,
          comments_count: task.commentsCount
        });
      } catch (err) {
        console.error('Error inserting to Supabase:', err);
      }
    }
  },

  async updateTask(task: TaskItem): Promise<void> {
    try {
      const stored = localStorage.getItem('clickjoy_saved_tasks');
      if (stored) {
        const list: TaskItem[] = JSON.parse(stored);
        localStorage.setItem(
          'clickjoy_saved_tasks',
          JSON.stringify(list.map(t => (t.id === task.id ? task : t)))
        );
      }
    } catch {}

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tasks').update({
          title: task.title,
          status: task.status,
          priority: task.priority,
          due_date: task.dueDate,
          time_estimate: task.timeEstimate,
          tags: task.tags,
          comments_count: task.commentsCount
        }).eq('id', task.id);
      } catch (err) {
        console.error('Error updating in Supabase:', err);
      }
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      const stored = localStorage.getItem('clickjoy_saved_tasks');
      if (stored) {
        const list: TaskItem[] = JSON.parse(stored);
        localStorage.setItem(
          'clickjoy_saved_tasks',
          JSON.stringify(list.filter(t => t.id !== taskId))
        );
      }
    } catch {}

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tasks').delete().eq('id', taskId);
      } catch (err) {
        console.error('Error deleting from Supabase:', err);
      }
    }
  },

  // ==========================================
  // 2. TIME ENTRIES (Timesheets)
  // ==========================================
  async getTimeEntries(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('time_entries')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.error('Supabase time_entries fetch error:', err);
      }
    }
    try {
      const stored = localStorage.getItem('clickup_time_entries_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async saveTimeEntry(entry: any): Promise<void> {
    try {
      const existing = JSON.parse(localStorage.getItem('clickup_time_entries_v1') || '[]');
      localStorage.setItem('clickup_time_entries_v1', JSON.stringify([entry, ...existing]));
    } catch {}

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('time_entries').insert({
          task_id: entry.taskId,
          task_title: entry.taskTitle,
          task_key: entry.taskKey,
          duration_seconds: entry.durationSeconds,
          date_str: entry.dateStr,
          day_of_week: entry.dayOfWeek,
          start_time: entry.startTime,
          end_time: entry.endTime,
          notes: entry.notes,
          tags: entry.tags,
          billable: entry.billable,
          user_name: entry.user
        });
      } catch (err) {
        console.error('Supabase saveTimeEntry error:', err);
      }
    }
  },

  // ==========================================
  // 3. CLIPS
  // ==========================================
  async getClips(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('clips')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
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

  async saveClip(clip: any): Promise<void> {
    try {
      const existing = JSON.parse(localStorage.getItem('clickup_clips_v1') || '[]');
      localStorage.setItem('clickup_clips_v1', JSON.stringify([clip, ...existing]));
    } catch {}

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('clips').insert({
          title: clip.title,
          type: clip.type,
          duration_seconds: clip.durationSeconds,
          author: clip.author,
          author_initials: clip.authorInitials,
          views_count: clip.views,
          comments_count: clip.commentsCount,
          thumbnail_gradient: clip.thumbnailGradient,
          transcript: clip.transcript,
          tags: clip.tags
        });
      } catch (err) {
        console.error('Supabase saveClip error:', err);
      }
    }
  },

  // ==========================================
  // 4. GOALS
  // ==========================================
  async getGoals(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('goals')
          .select('*, goal_targets(*)')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.error('Supabase goals fetch error:', err);
      }
    }
    try {
      const stored = localStorage.getItem('clickup_goals_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async saveGoal(goal: any): Promise<void> {
    try {
      const existing = JSON.parse(localStorage.getItem('clickup_goals_v1') || '[]');
      localStorage.setItem('clickup_goals_v1', JSON.stringify([goal, ...existing]));
    } catch {}

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('goals').insert({
          name: goal.name,
          description: goal.description,
          owner: goal.owner,
          owner_initials: goal.ownerInitials,
          color: goal.color,
          icon: goal.icon,
          due_date: goal.dueDate,
          status: goal.status
        }).select().single();

        if (data && goal.targets && goal.targets.length > 0) {
          await supabase.from('goal_targets').insert(
            goal.targets.map((t: any) => ({
              goal_id: data.id,
              name: t.name,
              type: t.type,
              current_value: t.currentValue,
              target_value: t.targetValue,
              unit: t.unit
            }))
          );
        }
      } catch (err) {
        console.error('Supabase saveGoal error:', err);
      }
    }
  },

  // ==========================================
  // 5. CHAT MESSAGES
  // ==========================================
  async getChatMessages(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.error('Supabase chat_messages fetch error:', err);
      }
    }
    try {
      const stored = localStorage.getItem('clickup_chat_launchpad_messages_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async sendChatMessage(msg: any): Promise<void> {
    try {
      const existing = JSON.parse(localStorage.getItem('clickup_chat_launchpad_messages_v1') || '[]');
      localStorage.setItem('clickup_chat_launchpad_messages_v1', JSON.stringify([...existing, msg]));
    } catch {}

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('chat_messages').insert({
          sender: msg.sender,
          sender_initials: msg.senderInitials,
          is_ai: msg.isAi || false,
          avatar_bg: msg.avatarBg || '#0f172a',
          text: msg.text
        });
      } catch (err) {
        console.error('Supabase sendChatMessage error:', err);
      }
    }
  },

  // ==========================================
  // 6. REALTIME MULTIPLAYER SYNC
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
  }
};
