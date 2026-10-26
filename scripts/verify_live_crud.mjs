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

async function verifyLive() {
  console.log('Testing probe insert into chat_messages:');
  const probeId = crypto.randomUUID();
  const { data, error } = await supabase.from('chat_messages').insert({
    id: probeId,
    text: 'Supabase schema verification test message',
    sender: 'Antigravity QA',
    sender_initials: 'AQ'
  }).select();

  if (error) {
    console.log('Insert chat_messages error:', error.message);
  } else {
    console.log('✅ Inserted chat_message successfully! Columns:', Object.keys(data[0]));
    // Clean up
    await supabase.from('chat_messages').delete().eq('id', probeId);
  }

  console.log('Testing probe insert into docs:');
  const docId = crypto.randomUUID();
  const { data: docData, error: docError } = await supabase.from('docs').insert({
    id: docId,
    title: 'Verification Test Doc',
    content: 'Testing Supabase cloud persistence'
  }).select();

  if (docError) {
    console.log('Insert docs error:', docError.message);
  } else {
    console.log('✅ Inserted doc successfully! Columns:', Object.keys(docData[0]));
    // Clean up
    await supabase.from('docs').delete().eq('id', docId);
  }

  console.log('Testing probe insert into whiteboards:');
  const wbId = crypto.randomUUID();
  const { data: wbData, error: wbError } = await supabase.from('whiteboards').insert({
    id: wbId,
    title: 'Verification Whiteboard',
    elements: [{ type: 'note', text: 'Hello OneDesk' }]
  }).select();

  if (wbError) {
    console.log('Insert whiteboard error:', wbError.message);
  } else {
    console.log('✅ Inserted whiteboard successfully! Columns:', Object.keys(wbData[0]));
    // Clean up
    await supabase.from('whiteboards').delete().eq('id', wbId);
  }
}

verifyLive();
