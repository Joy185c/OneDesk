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

async function checkMissingElements() {
  console.log('--- Checking Chat Messages table columns ---');
  const { data: chatData, error: chatError } = await supabase.from('chat_messages').select('*').limit(1);
  if (chatError) {
    console.log('chat_messages query error:', chatError.message);
  } else {
    console.log('chat_messages sample row/fields:', chatData);
  }

  console.log('--- Checking Storage Buckets ---');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.log('storage listBuckets error:', bucketError.message);
  } else {
    console.log('Active storage buckets:', buckets?.map(b => b.name) || 'None');
  }

  console.log('--- Testing insert to whiteboards ---');
  const { data: wbData, error: wbError } = await supabase.from('whiteboards').select('*').limit(1);
  console.log('whiteboards query:', wbError ? wbError.message : 'Accessible');
}

checkMissingElements();
