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

async function testSignup() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'TestPassword123!#';
  console.log('Attempting signup for:', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Test Automation User',
        workspace_name: 'Test Automation Space'
      }
    }
  });

  if (error) {
    console.log('Signup error:', error.message);
    return;
  }

  console.log('Signup response user:', data.user?.id);
  console.log('Session present?:', !!data.session);

  if (data.session) {
    console.log('Auto-confirmed! Session active for:', data.user.id);
  } else {
    console.log('Confirmation email was sent (email confirmation is enabled in Supabase project).');
  }
}

testSignup();
