import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const envContent = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
let supabaseUrl = '', supabaseAnonKey = '';
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  const val = v.join('=').trim().replace(/^["']|["']$/g, '');
  if (k === 'VITE_SUPABASE_URL') supabaseUrl = val;
  if (k === 'VITE_SUPABASE_ANON_KEY') supabaseAnonKey = val;
});

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log('Testing live Supabase tables for Phase 4 hierarchy...');
  const [spacesRes, foldersRes, listsRes, tasksRes] = await Promise.all([
    supabase.from('spaces').select('*').limit(1),
    supabase.from('folders').select('*').limit(1),
    supabase.from('lists').select('*').limit(1),
    supabase.from('tasks').select('id, space_id, folder_id, list_id').limit(1)
  ]);

  console.log('spaces check:', spacesRes.error ? spacesRes.error.message : 'EXISTS (OK)');
  console.log('folders check:', foldersRes.error ? foldersRes.error.message : 'EXISTS (OK)');
  console.log('lists check:', listsRes.error ? listsRes.error.message : 'EXISTS (OK)');
  console.log('tasks hierarchy columns check:', tasksRes.error ? tasksRes.error.message : 'COLUMNS EXIST (OK)');

  // Let's test RLS on spaces: anonymous unauthenticated select or insert
  const anonInsertSpace = await supabase.from('spaces').insert([{
    name: 'Unauthorized Space Test',
    workspace_id: '00000000-0000-0000-0000-000000000000'
  }]);
  console.log('spaces RLS anon insert blocked:', anonInsertSpace.error ? `BLOCKED (${anonInsertSpace.error.code})` : 'FAILED TO BLOCK');
}

checkSchema();
