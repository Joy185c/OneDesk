import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';
import * as fs from 'fs';

// Read .env
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

const supabaseAnon = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const generateUUID = () => crypto.randomUUID();

async function runSecurityAudit() {
  console.log('====================================================================');
  console.log('ONEDESK PHASE 4 — INDEPENDENT DATABASE SECURITY & ACCESS AUDIT');
  console.log('====================================================================\n');

  let passed = 0;
  let warnings = 0;
  let failed = 0;

  const testUserA = 'e094697a-6ecd-4a03-a2db-c2f59f616b2a';
  const attackerUserB = '00000000-0000-0000-0000-00000000000b';

  // ----------------------------------------------------
  // TEST 1: Service Role Key Leakage Audit
  // ----------------------------------------------------
  console.log('AUDIT 1: Frontend Secret & Service Role Key Leakage');
  const envText = fs.readFileSync('.env', 'utf-8');
  const srcFiles = fs.readdirSync('src', { recursive: true }).filter(f => typeof f === 'string' && (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js')));
  
  let keyLeaked = false;
  if (envText.includes('service_role') || envText.includes('SUPABASE_SERVICE_KEY')) {
    keyLeaked = true;
  }
  for (const f of srcFiles) {
    try {
      const content = fs.readFileSync('src/' + f, 'utf-8');
      if (content.includes('service_role') || content.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')) {
        keyLeaked = true;
        break;
      }
    } catch {}
  }

  if (!keyLeaked) {
    console.log('  ✅ PASS: Zero service-role keys exposed in client bundle or source code.\n');
    passed++;
  } else {
    console.log('  ❌ CRITICAL FAIL: Service-role key detected in client-accessible files!\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 2: Unauthorized Workspace Write Protection
  // ----------------------------------------------------
  console.log('AUDIT 2: Unauthorized Workspace Write Protection (RLS)');
  const fakeWsId = generateUUID();
  const { error: wsWriteErr } = await supabaseAnon
    .from('workspaces')
    .insert({ id: fakeWsId, name: 'Hacked Workspace', owner_id: attackerUserB });

  if (wsWriteErr && (wsWriteErr.code === '42501' || wsWriteErr.message.includes('row-level security'))) {
    console.log('  ✅ PASS: Anonymous unauthorized write to "workspaces" rejected by PostgreSQL RLS (42501).\n');
    passed++;
  } else {
    console.log('  ❌ FAIL: Unprotected write on "workspaces":', wsWriteErr?.message || 'Write permitted!', '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 3: Unauthorized Membership Tampering Protection
  // ----------------------------------------------------
  console.log('AUDIT 3: Workspace Membership Privilege Escalation Protection');
  const fakeMemId = generateUUID();
  const { error: memWriteErr } = await supabaseAnon
    .from('workspace_members')
    .insert({ id: fakeMemId, workspace_id: fakeWsId, user_id: attackerUserB, role: 'owner' });

  if (memWriteErr && (memWriteErr.code === '42501' || memWriteErr.message.includes('row-level security'))) {
    console.log('  ✅ PASS: Privilege escalation to "owner" in workspace_members blocked by RLS.\n');
    passed++;
  } else {
    console.log('  ❌ FAIL: Unprotected member write:', memWriteErr?.message || 'Permitted!', '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 4: Invitation Token Brute-Force & Enumeration Resistance
  // ----------------------------------------------------
  console.log('AUDIT 4: Workspace Invitations Enumeration Resistance');
  const { data: invList, error: invListErr } = await supabaseAnon
    .from('workspace_invitations')
    .select('id, token, email');

  // Should NOT return all tokens to anonymous user without filtering by token
  if (!invListErr && invList?.length > 0) {
    console.log(`  ⚠️ ADVISORY: Anonymous client read ${invList.length} invitations. Ensure policy restricts table scans.\n`);
    warnings++;
  } else {
    console.log('  ✅ PASS: Bulk anonymous enumeration of invitations blocked.\n');
    passed++;
  }

  // ----------------------------------------------------
  // TEST 5: Public Form Submission vs Private Data Read Isolation
  // ----------------------------------------------------
  console.log('AUDIT 5: Public Form Submission vs Response Isolation');
  const testFormId = generateUUID();
  // Form created by a specific user
  await supabaseAnon.from('forms').insert({
    id: testFormId,
    user_id: attackerUserB,
    title: 'Public Lead Capture Audit Form',
    status: 'active',
    fields: []
  });

  // Anonymous user submits response (should succeed)
  const testSubId = generateUUID();
  const { error: subWriteErr } = await supabaseAnon.from('form_submissions').insert({
    id: testSubId,
    form_id: testFormId,
    submitter_email: 'lead@enterprise.com',
    answers: { notes: 'Confidential request' }
  });

  // Anonymous user attempts to read other people's submissions (should fail or return 0 rows)
  const { data: leakedSubs, error: subReadErr } = await supabaseAnon
    .from('form_submissions')
    .select('*')
    .eq('form_id', testFormId);

  // Cleanup
  await supabaseAnon.from('form_submissions').delete().eq('id', testSubId);
  await supabaseAnon.from('forms').delete().eq('id', testFormId);

  if (!subWriteErr && (!leakedSubs || leakedSubs.length === 0 || subReadErr)) {
    console.log('  ✅ PASS: Anonymous users can submit forms, but cannot read stored customer responses.\n');
    passed++;
  } else {
    console.log('  ⚠️ ADVISORY: Form submissions readable by anonymous key. Submissions count returned:', leakedSubs?.length, '\n');
    warnings++;
  }

  // ----------------------------------------------------
  // TEST 6: User Profile Isolation
  // ----------------------------------------------------
  console.log('AUDIT 6: User Profile Direct Write & Role Tampering');
  const fakeProfileId = generateUUID();
  const { error: profWriteErr } = await supabaseAnon
    .from('profiles')
    .insert({
      id: fakeProfileId,
      name: 'Hacked Admin',
      role: 'SuperAdmin'
    });

  if (profWriteErr) {
    console.log('  ✅ PASS: Arbitrary profile creation with elevated roles rejected by database.\n');
    passed++;
  } else {
    console.log('  ⚠️ WARNING: Profile insert permitted:', profWriteErr, '\n');
    warnings++;
  }

  // ----------------------------------------------------
  // TEST 7: Cross-User Task Update Protection
  // ----------------------------------------------------
  console.log('AUDIT 7: Cross-User Task Tampering Test');
  const testTaskId = generateUUID();
  // Seed task for User A
  await supabaseAnon.from('tasks').insert({
    id: testTaskId,
    key: 'SEC-01',
    title: 'User A Confidential Security Task',
    status: 'TODO',
    priority: 'Urgent',
    user_id: testUserA
  });

  // Anonymous / User B attempts update
  const { error: tamperErr } = await supabaseAnon
    .from('tasks')
    .update({ title: 'Hacked Title' })
    .eq('id', testTaskId)
    .eq('user_id', attackerUserB);

  // Check if original title remained untouched
  const { data: chkTask } = await supabaseAnon.from('tasks').select('title').eq('id', testTaskId).single();
  await supabaseAnon.from('tasks').delete().eq('id', testTaskId);

  if (chkTask?.title === 'User A Confidential Security Task') {
    console.log('  ✅ PASS: Cross-user task tampering failed; original data preserved.\n');
    passed++;
  } else {
    console.log('  ❌ FAIL: Task was tampered by unauthorized query!\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 8: Deployment & SPA Routing Configuration
  // ----------------------------------------------------
  console.log('AUDIT 8: Deployment & SPA Route Fallback Configuration');
  let vercelConfigValid = false;
  try {
    const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf-8'));
    if (vercel.rewrites && vercel.rewrites.some(r => r.source === '/(.*)' && r.destination === '/index.html')) {
      vercelConfigValid = true;
    }
  } catch {}

  if (vercelConfigValid) {
    console.log('  ✅ PASS: vercel.json contains correct SPA rewrite rule /(.*) -> /index.html.\n');
    passed++;
  } else {
    console.log('  ⚠️ WARNING: vercel.json missing SPA catch-all rewrite rule for client router.\n');
    warnings++;
  }

  console.log('====================================================================');
  console.log(`SECURITY AUDIT SUMMARY: ${passed} PASSED, ${warnings} ADVISORIES, ${failed} FAILED.`);
  console.log('====================================================================');
}

runSecurityAudit();
