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

async function findUser() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'joy185c@gmail.com');

  console.log('Profile query:', profiles, error);

  const { data: allProfiles } = await supabase.from('profiles').select('*');
  console.log('All profiles count:', allProfiles?.length);
  if (allProfiles && allProfiles.length > 0) {
    console.log('Profiles:', allProfiles);
  }
}

findUser();
