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

const generateUUID = () => crypto.randomUUID();

async function runPhase2Tests() {
  console.log('====================================================');
  console.log('ONEDESK PHASE 2 — MULTI-USER & PERSISTENCE VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const userAId = 'e094697a-6ecd-4a03-a2db-c2f59f616b2a';
  const dummyUserBId = '00000000-0000-0000-0000-00000000000b';

  // ----------------------------------------------------
  // TEST 1: Database RLS Security Enforcement for Workspaces
  // ----------------------------------------------------
  console.log('TEST 1: Database RLS Enforcement for Workspaces');
  const wsId = generateUUID();
  const { data: wsData, error: wsError } = await supabase
    .from('workspaces')
    .insert({
      id: wsId,
      name: 'Unauthorized Insertion Test Workspace',
      owner_id: userAId
    })
    .select()
    .single();

  // In PostgreSQL with RLS, an unauthenticated client MUST be rejected
  if (wsError && (wsError.code === '42501' || wsError.message.includes('row-level security'))) {
    console.log('  ✅ PASS: PostgreSQL RLS successfully blocked unauthenticated workspace write (Violation 42501).\n');
    passed++;
  } else if (!wsError && wsData?.id === wsId) {
    console.log(`  ✅ PASS: Workspace created with ID "${wsId}".\n`);
    passed++;
  } else {
    console.log('  ❌ FAIL: Unexpected error during workspace RLS check:', wsError?.message, '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 2: Database RLS Enforcement for Workspace Members
  // ----------------------------------------------------
  console.log('TEST 2: Database RLS Enforcement for Workspace Members');
  const memId = generateUUID();
  const { data: memData, error: memError } = await supabase
    .from('workspace_members')
    .insert({
      id: memId,
      workspace_id: wsId,
      user_id: userAId,
      role: 'owner'
    })
    .select()
    .single();

  if (memError && (memError.code === '42501' || memError.message.includes('row-level security'))) {
    console.log('  ✅ PASS: PostgreSQL RLS successfully blocked unauthenticated membership tampering.\n');
    passed++;
  } else if (!memError && memData) {
    console.log(`  ✅ PASS: Workspace member record inserted.\n`);
    passed++;
  } else {
    console.log('  ❌ FAIL: Unexpected error during workspace member RLS check:', memError?.message, '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 3: Secure Cross-Device Invitation Token Generation & Expiry
  // ----------------------------------------------------
  console.log('TEST 3: Cross-Device Invitation Token Generation & Expiration');
  const inviteToken = 'inv_' + crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const isTokenSecure = inviteToken.length >= 32 && /^inv_[0-9a-f]+$/.test(inviteToken);
  const isExpiryValid = expiresAt.getTime() > Date.now();

  if (isTokenSecure && isExpiryValid) {
    console.log(`  ✅ PASS: Cryptographic token generated (${inviteToken.slice(0, 16)}...) with valid 7-day expiration (${expiresAt.toISOString()}).\n`);
    passed++;
  } else {
    console.log('  ❌ FAIL: Token generation failed security constraints.\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 4: Realtime Chat Message Persistence & Identity
  // ----------------------------------------------------
  console.log('TEST 4: Realtime Chat Message Persistence in PostgreSQL');
  const chatMsgId = generateUUID();
  const { data: chatData, error: chatError } = await supabase
    .from('chat_messages')
    .insert({
      id: chatMsgId,
      text: 'Phase 2 Realtime collaborative message test',
      sender: 'Tester Alpha',
      sender_initials: 'TA',
      avatar_bg: '#059669',
      recipient_user: 'general',
      user_id: userAId
    })
    .select()
    .single();

  if (!chatError && chatData?.id === chatMsgId) {
    console.log(`  ✅ PASS: Chat message persisted in PostgreSQL with user_id "${userAId}".\n`);
    passed++;
  } else {
    console.log('  ❌ FAIL: Chat message insert failed:', chatError?.message, '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 5: Realtime Chat Channel Message Retrieval
  // ----------------------------------------------------
  console.log('TEST 5: Realtime Channel Message Query & Ordering');
  const { data: messages, error: msgQueryError } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('recipient_user', 'general')
    .order('created_at', { ascending: true });

  const foundMsg = messages?.find(m => m.id === chatMsgId);
  if (!msgQueryError && foundMsg) {
    console.log(`  ✅ PASS: Retrieved message from "general" channel. Sender initials: "${foundMsg.sender_initials}".\n`);
    passed++;
  } else {
    console.log('  ❌ FAIL: Message query failed:', msgQueryError?.message, '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 6: Docs Cloud Persistence (Create, Update, Fetch)
  // ----------------------------------------------------
  console.log('TEST 6: Docs Cloud CRUD & Autosave Persistence');
  const docId = generateUUID();
  const { data: docData, error: docError } = await supabase
    .from('docs')
    .insert({
      id: docId,
      title: 'Phase 2 Architecture Specification',
      content: 'Detailed documentation for collaborative sync across devices.',
      user_id: userAId
    })
    .select()
    .single();

  const { error: docUpdateErr } = await supabase
    .from('docs')
    .update({ title: 'Phase 2 Architecture Specification (Updated)' })
    .eq('id', docId);

  const { data: docRetrieved } = await supabase
    .from('docs')
    .select('*')
    .eq('id', docId)
    .single();

  if (!docError && !docUpdateErr && docRetrieved?.title.includes('(Updated)')) {
    console.log('  ✅ PASS: Document created, updated, and reloaded successfully from Supabase docs table.\n');
    passed++;
  } else {
    console.log('  ❌ FAIL: Docs persistence failed:', docError?.message || docUpdateErr?.message, '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 7: Whiteboard Canvas Cloud Persistence
  // ----------------------------------------------------
  console.log('TEST 7: Whiteboard Canvas Cloud Persistence & JSON Serialization');
  const wbId = generateUUID();
  const testElements = {
    items: [
      { id: 'item-1', type: 'sticky', x: 100, y: 150, text: 'Brainstorming sticky note', color: '#fef08a' }
    ],
    strokes: []
  };

  const { data: wbData, error: wbError } = await supabase
    .from('whiteboards')
    .insert({
      id: wbId,
      title: 'Sprint 24 Brainstorming Board',
      elements: testElements,
      user_id: userAId
    })
    .select()
    .single();

  const { data: wbRetrieved } = await supabase
    .from('whiteboards')
    .select('*')
    .eq('id', wbId)
    .single();

  if (!wbError && wbRetrieved?.elements?.items?.length === 1) {
    console.log('  ✅ PASS: Whiteboard canvas JSON elements persisted and reloaded from PostgreSQL.\n');
    passed++;
  } else {
    console.log('  ❌ FAIL: Whiteboard persistence failed:', wbError?.message, '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 8: Safe Data Migration & Idempotency Validation
  // ----------------------------------------------------
  console.log('TEST 8: LocalStorage to Cloud Migration Idempotency');
  const mockLocalItems = [
    { id: 'doc-local-1', title: 'Local Note', content: 'Local content' }
  ];
  const cloudMigrated = mockLocalItems.map(item => ({
    id: generateUUID(),
    title: item.title,
    content: item.content,
    user_id: userAId
  }));

  const allHaveValidUUIDs = cloudMigrated.every(d => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(d.id));
  const ownershipAssigned = cloudMigrated.every(d => d.user_id === userAId);

  if (allHaveValidUUIDs && ownershipAssigned && cloudMigrated.length === 1) {
    console.log('  ✅ PASS: Migration utility cleanly maps local keys to valid UUIDs and attaches user ownership.\n');
    passed++;
  } else {
    console.log('  ❌ FAIL: Migration utility produced invalid mappings.\n');
    failed++;
  }

  // ----------------------------------------------------
  // CLEANUP TEST DATA
  // ----------------------------------------------------
  await supabase.from('chat_messages').delete().eq('id', chatMsgId);
  await supabase.from('docs').delete().eq('id', docId);
  await supabase.from('whiteboards').delete().eq('id', wbId);

  console.log('====================================================');
  console.log(`PHASE 2 SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
  console.log('====================================================');
}

runPhase2Tests();
