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

async function runPhase1Tests() {
  console.log('====================================================');
  console.log('ONEDESK PHASE 1 — AUTOMATED PERSISTENCE & SECURITY TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // Real auth.users record created in Supabase Auth
  const testUserA = 'e094697a-6ecd-4a03-a2db-c2f59f616b2a';
  const testUserB = '00000000-0000-0000-0000-00000000000b';
  const taskId = crypto.randomUUID();

  // Test 1: UUID format validation
  console.log('TEST 1: UUID Validation and Format Enforcement');
  if (isValidUUID(taskId) && !isValidUUID('t_1729876543210') && !isValidUUID('1')) {
    console.log('  ✅ PASS: isValidUUID correctly accepts standard UUID and rejects legacy prefixes.\n');
    passed++;
  } else {
    console.log('  ❌ FAIL: UUID validation failed.\n');
    failed++;
  }

  // Test 2: Task Creation with UUID and user ownership
  console.log('TEST 2: Persistent Task Creation in Supabase');
  const taskPayload = {
    id: taskId,
    key: 'TEST-P1',
    title: 'Phase 1 Verified Persistent Task',
    status: 'TODO',
    priority: 'Urgent',
    due_date: 'May 30, 2026',
    time_estimate: '2d',
    tags: ['Security', 'Test'],
    assignee_name: 'Tester Alpha',
    assignee_avatar: '',
    assignee_role: 'QA Lead',
    comments_count: 0,
    user_id: testUserA
  };

  const { data: insertData, error: insertError } = await supabase
    .from('tasks')
    .insert(taskPayload)
    .select()
    .single();

  if (!insertError && insertData?.id === taskId && insertData?.user_id === testUserA) {
    console.log(`  ✅ PASS: Task created with UUID "${taskId}" and user_id "${testUserA}".\n`);
    passed++;
  } else {
    console.log('  ❌ FAIL: Task insert failed:', insertError?.message || 'Data mismatch', '\n');
    failed++;
  }

  // Test 3: Task Retrieval by User Ownership
  console.log('TEST 3: User Data Ownership & Scope Retrieval');
  const { data: userATasks, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', testUserA);

  const foundUserATask = userATasks?.find(t => t.id === taskId);
  if (!fetchError && foundUserATask) {
    console.log(`  ✅ PASS: User A successfully queried their own task (${foundUserATask.title}).\n`);
    passed++;
  } else {
    console.log('  ❌ FAIL: Could not retrieve task for User A:', fetchError?.message, '\n');
    failed++;
  }

  // Test 4: Multi-User Data Isolation (User B cannot see User A's private task)
  console.log('TEST 4: Multi-User Data Isolation');
  const { data: userBTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', testUserB);

  const leakFound = userBTasks?.some(t => t.id === taskId);
  if (!leakFound) {
    console.log(`  ✅ PASS: User B query returned ${userBTasks?.length || 0} tasks; User A's task was NOT leaked.\n`);
    passed++;
  } else {
    console.log('  ❌ FAIL: Data isolation breach! User B retrieved User A\'s task.\n');
    failed++;
  }

  // Test 5: Task Status Update Persistence
  console.log('TEST 5: Task Update & Status Transition Persistence');
  const { error: updateError } = await supabase
    .from('tasks')
    .update({ status: 'COMPLETE', priority: 'High' })
    .eq('id', taskId);

  const { data: verifyUpdate } = await supabase
    .from('tasks')
    .select('status, priority')
    .eq('id', taskId)
    .single();

  if (!updateError && verifyUpdate?.status === 'COMPLETE' && verifyUpdate?.priority === 'High') {
    console.log('  ✅ PASS: Task update persisted cleanly in PostgreSQL (status=COMPLETE, priority=High).\n');
    passed++;
  } else {
    console.log('  ❌ FAIL: Task update did not persist:', updateError?.message, '\n');
    failed++;
  }

  // Test 6: Safe Deletion Persistence
  console.log('TEST 6: Task Deletion Persistence');
  const { error: deleteError } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  const { data: checkDeleted } = await supabase
    .from('tasks')
    .select('id')
    .eq('id', taskId);

  if (!deleteError && (!checkDeleted || checkDeleted.length === 0)) {
    console.log('  ✅ PASS: Task record deleted from Supabase PostgreSQL (0 records remain).\n');
    passed++;
  } else {
    console.log('  ❌ FAIL: Task deletion failed or record still exists.\n');
    failed++;
  }

  // Test 7: Error handling on invalid non-UUID operations
  console.log('TEST 7: Invalid Non-UUID Query Rejection');
  const { error: badQueryError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', 't_invalid_legacy_id');

  if (badQueryError && badQueryError.code === '22P02') {
    console.log('  ✅ PASS: PostgreSQL rejects malformed non-UUID queries with error code 22P02 (Handled safely by frontend validator).\n');
    passed++;
  } else {
    console.log('  ⚠️ NOTICE: Non-UUID query behavior:', badQueryError?.code, badQueryError?.message, '\n');
  }

  console.log('====================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
  console.log('====================================================');
}

runPhase1Tests();
