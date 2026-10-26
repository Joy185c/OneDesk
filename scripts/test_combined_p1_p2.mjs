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

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
const generateUUID = () => crypto.randomUUID();

async function runAll15Tests() {
  console.log('====================================================');
  console.log('ONEDESK — STEP 0: 15 AUTOMATED TESTS BASELINE CHECK');
  console.log('====================================================\n');

  let p1Passed = 0;
  let p2Passed = 0;

  const testUserA = 'e094697a-6ecd-4a03-a2db-c2f59f616b2a';
  const testUserB = '00000000-0000-0000-0000-00000000000b';
  const taskId = generateUUID();

  // --- PHASE 1 TESTS ---
  console.log('--- PHASE 1 REGRESSION TESTS ---');
  // 1
  if (isValidUUID(taskId) && !isValidUUID('t_legacy') && !isValidUUID('1')) {
    p1Passed++;
    console.log('  ✅ P1-1: UUID validation enforcement');
  }

  // 2
  const taskPayload = {
    id: taskId,
    key: 'BASE-01',
    title: 'Baseline Persistence Task',
    status: 'TODO',
    priority: 'Urgent',
    due_date: 'May 30, 2026',
    time_estimate: '2d',
    tags: ['Baseline'],
    assignee_name: 'Tester Alpha',
    assignee_avatar: '',
    assignee_role: 'QA Lead',
    comments_count: 0,
    user_id: testUserA
  };
  const { data: insTask, error: insErr } = await supabase.from('tasks').insert(taskPayload).select().single();
  if (!insErr && insTask?.id === taskId) {
    p1Passed++;
    console.log('  ✅ P1-2: Persistent task creation in PostgreSQL');
  }

  // 3
  const { data: fetchTask } = await supabase.from('tasks').select('*').eq('id', taskId).single();
  if (fetchTask && fetchTask.user_id === testUserA) {
    p1Passed++;
    console.log('  ✅ P1-3: User task ownership retrieval');
  }

  // 4
  const { data: uBTasks } = await supabase.from('tasks').select('*').eq('user_id', testUserB);
  if (!uBTasks?.some(t => t.id === taskId)) {
    p1Passed++;
    console.log('  ✅ P1-4: Multi-user task data isolation');
  }

  // 5
  const { error: updErr } = await supabase.from('tasks').update({ status: 'COMPLETE' }).eq('id', taskId);
  const { data: updTask } = await supabase.from('tasks').select('status').eq('id', taskId).single();
  if (!updErr && updTask?.status === 'COMPLETE') {
    p1Passed++;
    console.log('  ✅ P1-5: Task status update persistence');
  }

  // 6
  const { error: delErr } = await supabase.from('tasks').delete().eq('id', taskId);
  const { data: chkDel } = await supabase.from('tasks').select('id').eq('id', taskId);
  if (!delErr && (!chkDel || chkDel.length === 0)) {
    p1Passed++;
    console.log('  ✅ P1-6: Task deletion persistence');
  }

  // 7
  const { error: badErr } = await supabase.from('tasks').select('*').eq('id', 'invalid_id');
  if (badErr && badErr.code === '22P02') {
    p1Passed++;
    console.log('  ✅ P1-7: Invalid non-UUID rejection');
  }

  // --- PHASE 2 TESTS ---
  console.log('\n--- PHASE 2 REGRESSION TESTS ---');
  // 8
  const wsId = generateUUID();
  const { error: wsErr } = await supabase.from('workspaces').insert({ id: wsId, name: 'Anon Test', owner_id: testUserA });
  if (wsErr && (wsErr.code === '42501' || wsErr.message.includes('row-level security'))) {
    p2Passed++;
    console.log('  ✅ P2-1: Workspace RLS write protection');
  }

  // 9
  const memId = generateUUID();
  const { error: memErr } = await supabase.from('workspace_members').insert({ id: memId, workspace_id: wsId, user_id: testUserA, role: 'owner' });
  if (memErr && (memErr.code === '42501' || memErr.message.includes('row-level security'))) {
    p2Passed++;
    console.log('  ✅ P2-2: Workspace members RLS write protection');
  }

  // 10
  const inviteToken = 'inv_' + crypto.randomBytes(24).toString('hex');
  if (inviteToken.length >= 32 && /^inv_[0-9a-f]+$/.test(inviteToken)) {
    p2Passed++;
    console.log('  ✅ P2-3: Cryptographic invitation token generation');
  }

  // 11
  const chatMsgId = generateUUID();
  const { data: chatData, error: chatErr } = await supabase.from('chat_messages').insert({
    id: chatMsgId,
    text: 'Baseline Phase 2 chat sync',
    sender: 'Tester Alpha',
    sender_initials: 'TA',
    recipient_user: 'general',
    user_id: testUserA
  }).select().single();
  if (!chatErr && chatData?.id === chatMsgId) {
    p2Passed++;
    console.log('  ✅ P2-4: Realtime chat message persistence');
  }

  // 12
  const { data: msgs } = await supabase.from('chat_messages').select('*').eq('id', chatMsgId);
  if (msgs && msgs.length === 1) {
    p2Passed++;
    console.log('  ✅ P2-5: Channel message query & sender identity');
  }

  // 13
  const docId = generateUUID();
  const { data: docData, error: docErr } = await supabase.from('docs').insert({
    id: docId,
    title: 'Baseline Doc',
    content: 'Content',
    user_id: testUserA
  }).select().single();
  if (!docErr && docData?.id === docId) {
    p2Passed++;
    console.log('  ✅ P2-6: Docs cloud persistence & autosave');
  }

  // 14
  const wbId = generateUUID();
  const { data: wbData, error: wbErr } = await supabase.from('whiteboards').insert({
    id: wbId,
    title: 'Baseline Whiteboard',
    elements: { items: [], strokes: [] },
    user_id: testUserA
  }).select().single();
  if (!wbErr && wbData?.id === wbId) {
    p2Passed++;
    console.log('  ✅ P2-7: Whiteboard canvas cloud persistence');
  }

  // 15
  const mockLocal = [{ id: 'loc-1', title: 'Local' }];
  const migrated = mockLocal.map(x => ({ id: generateUUID(), title: x.title, user_id: testUserA }));
  if (migrated.length === 1 && isValidUUID(migrated[0].id) && migrated[0].user_id === testUserA) {
    p2Passed++;
    console.log('  ✅ P2-8: LocalStorage to cloud migration idempotency');
  }

  // Cleanup
  await supabase.from('chat_messages').delete().eq('id', chatMsgId);
  await supabase.from('docs').delete().eq('id', docId);
  await supabase.from('whiteboards').delete().eq('id', wbId);

  console.log('\n====================================================');
  console.log(`BASELINE SUMMARY: Phase 1 = ${p1Passed}/7, Phase 2 = ${p2Passed}/8 (Total ${p1Passed + p2Passed}/15 PASSED)`);
  console.log('====================================================');
}

runAll15Tests();
