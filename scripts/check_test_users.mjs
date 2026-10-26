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

async function checkOrRegisterTestUsers() {
  const users = [
    { email: 'onedesk_tester_a@gmail.com', password: 'Password123!#', name: 'Tester Alpha' },
    { email: 'onedesk_tester_b@gmail.com', password: 'Password123!#', name: 'Tester Beta' }
  ];

  for (const u of users) {
    console.log(`Checking user: ${u.email}`);
    // Try login first
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: u.email,
      password: u.password
    });

    if (loginData?.user) {
      console.log(`✅ Logged in as ${u.email}: ID=${loginData.user.id}`);
    } else {
      console.log(`Login failed (${loginError?.message}), attempting signup...`);
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: u.email,
        password: u.password,
        options: {
          data: { full_name: u.name, name: u.name }
        }
      });
      if (signupError) {
        console.log(`❌ Signup failed for ${u.email}:`, signupError.message);
      } else {
        console.log(`✅ Signed up ${u.email}: ID=${signupData.user?.id}, session=${!!signupData.session}`);
      }
    }
  }
}

checkOrRegisterTestUsers();
