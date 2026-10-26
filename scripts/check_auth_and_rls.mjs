import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

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

async function checkAuthAndRls() {
  console.log('--- Checking tasks RLS for anonymous requests ---');
  // 1. Try anon select
  const { data: selectData, error: selectError } = await supabase.from('tasks').select('*');
  console.log('Anon select:', { count: selectData?.length, error: selectError?.message });

  // 2. Try anon insert
  const fakeId = '00000000-0000-0000-0000-000000000001';
  const { data: insertData, error: insertError } = await supabase.from('tasks').insert({
    id: fakeId,
    key: 'TEST-01',
    title: 'Anon probe task'
  }).select();
  console.log('Anon insert:', { success: !!insertData, error: insertError?.message });

  if (insertData) {
    // clean up
    await supabase.from('tasks').delete().eq('id', fakeId);
  }
}

checkAuthAndRls();
