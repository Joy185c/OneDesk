import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';
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

async function testUuidInsert() {
  const newId = crypto.randomUUID();
  console.log('Testing insert with client UUID:', newId);
  
  const { data, error } = await supabase.from('tasks').insert({
    id: newId,
    key: 'CLK-99',
    title: 'Test UUID Persistence Task',
    status: 'TODO',
    priority: 'Normal'
  }).select();

  console.log('Insert result:', error ? `${error.code}: ${error.message}` : 'SUCCESS', data);

  if (!error) {
    // Test update with this uuid
    const { data: updateData, error: updateError } = await supabase
      .from('tasks')
      .update({ status: 'IN PROGRESS' })
      .eq('id', newId)
      .select();
    console.log('Update result:', updateError ? `${updateError.code}: ${updateError.message}` : 'SUCCESS', updateData);

    // Test delete with this uuid
    const { error: deleteError } = await supabase.from('tasks').delete().eq('id', newId);
    console.log('Delete result:', deleteError ? `${deleteError.code}: ${deleteError.message}` : 'SUCCESS');
  }
}

testUuidInsert();
