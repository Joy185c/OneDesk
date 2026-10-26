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

async function checkTaskTypes() {
  // Test query with a non-UUID string
  const { error: nonUuidError } = await supabase.from('tasks').select('*').eq('id', '1');
  console.log('Query with non-uuid id "1":', nonUuidError ? `${nonUuidError.code}: ${nonUuidError.message}` : 'Success');

  const { error: validUuidError } = await supabase.from('tasks').select('*').eq('id', '959cd88b-806f-4675-95f3-83571b0fc255');
  console.log('Query with valid uuid:', validUuidError ? `${validUuidError.code}: ${validUuidError.message}` : 'Success');
}

checkTaskTypes();
