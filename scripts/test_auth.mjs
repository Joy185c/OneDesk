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

async function testAuth() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'onedesk_tester_a@gmail.com',
    password: 'Password123!#'
  });

  if (error) {
    console.log('Login error:', error.message);
  } else {
    console.log('Login success! User ID:', data.user.id);
  }
}

testAuth();
