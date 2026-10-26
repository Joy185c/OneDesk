import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Read .env manually
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspectDb() {
  console.log('Connecting to Supabase at:', env.VITE_SUPABASE_URL);

  const tables = [
    'profiles', 
    'tasks', 
    'subtasks', 
    'comments', 
    'docs', 
    'time_entries', 
    'clips',
    'goals',
    'forms',
    'workspaces', 
    'workspace_members', 
    'workspace_invitations',
    'channels',
    'channel_messages'
  ];

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: false }).limit(2);
      if (error) {
        console.log(`❌ Table [${table}]: ERROR ${error.code} - ${error.message} (${error.details || 'no details'})`);
      } else {
        console.log(`✅ Table [${table}]: EXISTS. Found ${count ?? data?.length ?? 0} rows. Sample fields:`, data?.[0] ? Object.keys(data[0]) : 'empty table');
      }
    } catch (err) {
      console.log(`❌ Table [${table}]: EXCEPTION`, err.message);
    }
  }
}

inspectDb();
